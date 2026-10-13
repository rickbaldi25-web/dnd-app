import { srd } from "@dnd/content-srd";
import { createRegistry } from "@dnd/engine";

/**
 * Registro dei contenuti usato dall'app. Qui in futuro si aggiungono
 * i pacchetti homebrew della campagna e del giocatore:
 *   createRegistry(srd, homebrewCampagna, homebrewPersonale)
 */
export const registry = createRegistry(srd);

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
  return registry.items.get(id)?.name ?? id;
}
export function skillName(id: string): string {
  return registry.skills.get(id)?.name ?? id;
}
export function optionLabel(kind: string, id: string): string {
  if (kind === "skill") return skillName(id);
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
