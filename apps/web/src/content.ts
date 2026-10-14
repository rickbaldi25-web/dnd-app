import { srd } from "@dnd/content-srd";
import { ABILITIES, createRegistry, type ContentPack, type ItemDef, type MonsterDef, type SpellDef } from "@dnd/engine";

/**
 * Contenuti importati dai compendi (packages/importer). La cartella è esclusa da git:
 * su un computer senza quei file l'app ripiega sul pacchetto SRD incluso nel progetto.
 * I mostri hanno un file a parte, caricato solo quando servono al Master.
 */
const imported = import.meta.glob<ContentPack>("../../../packages/content-private/generated/*.{core,spells,items}.json", {
  eager: true,
  import: "default",
});
// Prima i file "core": sono quelli che dichiarano l'edizione delle regole.
const packs = Object.entries(imported)
  .sort(([a], [b]) => Number(b.includes(".core.")) - Number(a.includes(".core.")))
  .map(([, p]) => p);

/**
 * Registro dei contenuti usato dall'app. Qui in futuro si aggiungono
 * i pacchetti homebrew della campagna e del giocatore.
 */
export const registry = packs.length ? createRegistry(...packs) : createRegistry(srd);

/*
 * Contenuti propri di una campagna (oggetti e incantesimi del Master). Si aggiungono al registro
 * quando si apre una scheda o una pagina di quella campagna e si tolgono quando la si lascia.
 */
let homebrewIds: { items: string[]; spells: string[] } = { items: [], spells: [] };
let version = 0;
const watchers = new Set<() => void>();
export const contentVersion = () => version;
export function subscribeContent(cb: () => void): () => void {
  watchers.add(cb);
  return () => watchers.delete(cb);
}
export function applyHomebrew(pack: { items: ItemDef[]; spells: SpellDef[] } | null) {
  for (const id of homebrewIds.items) registry.items.delete(id);
  for (const id of homebrewIds.spells) registry.spells.delete(id);
  homebrewIds = { items: [], spells: [] };
  for (const item of pack?.items ?? []) {
    registry.items.set(item.id, item);
    homebrewIds.items.push(item.id);
  }
  for (const spell of pack?.spells ?? []) {
    registry.spells.set(spell.id, spell);
    homebrewIds.spells.push(spell.id);
  }
  version++;
  watchers.forEach((w) => w());
}
/** Gli id delle voci della campagna cominciano così. */
export const isHomebrew = (id: string) => id.startsWith("hb.");

/** I mostri importati: un file grande, caricato solo quando il Master ne cerca uno. */
const monsterFiles = import.meta.glob<{ monsters?: MonsterDef[] }>("../../../packages/content-private/generated/*.monsters.json", { import: "default" });
let monsters: Promise<MonsterDef[]> | undefined;
export function loadMonsters(): Promise<MonsterDef[]> {
  monsters ??= Promise.all(Object.values(monsterFiles).map((load) => load())).then((files) =>
    files.flatMap((f) => f.monsters ?? []).sort((a, b) => a.name.localeCompare(b.name, "it")),
  );
  return monsters;
}

/** Nelle regole 2014 le specie si chiamano razze. */
export const SPECIES_LABEL = registry.ruleset === "2014" ? "Razza" : "Specie";

export const ABILITY_NAMES = {
  str: { short: "FOR", name: "Forza" },
  dex: { short: "DES", name: "Destrezza" },
  con: { short: "COS", name: "Costituzione" },
  int: { short: "INT", name: "Intelligenza" },
  wis: { short: "SAG", name: "Saggezza" },
  cha: { short: "CAR", name: "Carisma" },
} as const;

export const DAMAGE_TYPES: Record<string, string> = {
  acid: "acido",
  bludgeoning: "contundente",
  cold: "freddo",
  fire: "fuoco",
  force: "forza",
  lightning: "fulmine",
  necrotic: "necrotico",
  piercing: "perforante",
  poison: "veleno",
  psychic: "psichico",
  radiant: "radioso",
  slashing: "tagliente",
  thunder: "tuono",
};

/** Condizioni delle regole 2024 (l'Indebolimento ha il suo contatore). */
export const CONDITIONS: Record<string, string> = {
  blinded: "Accecato",
  charmed: "Affascinato",
  deafened: "Assordato",
  frightened: "Spaventato",
  grappled: "Afferrato",
  incapacitated: "Incapacitato",
  invisible: "Invisibile",
  paralyzed: "Paralizzato",
  petrified: "Pietrificato",
  poisoned: "Avvelenato",
  prone: "Prono",
  restrained: "Trattenuto",
  stunned: "Stordito",
  unconscious: "Privo di sensi",
};

export const SENSES: Record<string, string> = {
  darkvision: "Scurovisione",
  blindsight: "Vista cieca",
  tremorsense: "Percezione tellurica",
  truesight: "Vista pura",
};

export const TIMING: Record<string, string> = {
  action: "Azione",
  bonus: "Azione bonus",
  reaction: "Reazione",
  free: "Gratuita",
  special: "Speciale",
};

/** Piedi → metri come nei manuali italiani (1,5 m ogni 5 ft). */
export const ftToM = (ft: number) => `${((ft / 5) * 1.5).toLocaleString("it-IT")} m`;

export function itemName(id: string): string {
  // Oggetti fuori dai manuali, consegnati dal bottino: l'id è "custom:" seguito dal nome.
  if (id.startsWith("custom:")) return id.slice(7);
  return registry.items.get(id)?.name ?? id;
}
export function skillName(id: string): string {
  return registry.skills.get(id)?.name ?? id;
}
export function optionLabel(kind: string, id: string): string {
  if (kind === "skill" || kind === "expertise") return skillName(id);
  if (kind === "abilityBoost" && (ABILITIES as readonly string[]).includes(id)) return ABILITY_NAMES[id as keyof typeof ABILITY_NAMES].name;
  if (kind === "feat") return registry.feats.get(id)?.name ?? id;
  if (kind === "weaponMastery") {
    const w = registry.items.get(id);
    return w && w.kind === "weapon" ? `${w.name} (${w.mastery})` : id;
  }
  if (kind === "subclass") return registry.subclasses.get(id)?.name ?? id;
  return TOOLS[id] ?? id;
}

export const TOOLS: Record<string, string> = {
  "dice-set": "Dadi",
  "dragonchess-set": "Scacchi dei draghi",
  "playing-cards": "Carte da gioco",
  "three-dragon-ante": "Ante dei tre draghi",
  "thieves-tools": "Arnesi da scasso",
};
