/**
 * Italiano automatico per le parti formulari dei dati inglesi: distanze in metri, tempi, taglie, tipi,
 * allineamenti, sensi, linguaggi, danni, condizioni e gli attacchi dei mostri scritti nella forma standard.
 *
 * Vale solo per le voci che nessuna traduzione ha toccato (senza `nameEn`): i testi liberi restano in
 * inglese, ma ciò che si legge di più a colpo d'occhio diventa italiano. I nomi delle voci dei mostri
 * ("Multiattack", "Pack Tactics") arrivano da un dizionario costruito dalle traduzioni dell'SRD.
 */
import type { ContentPack, MonsterDef, MonsterEntry, SpellDef } from "@dnd/engine";

/** "30 feet" → "9 metri"; "5-foot" → "1,5 metri". */
export function metres(ft: number): string {
  const m = Math.round(ft * 0.3 * 10) / 10;
  return String(m).replace(".", ",");
}

const DIST = /(\d+(?:,\d{3})*)[- ](?:feet|foot|ft\.?)/gi;
const MILES = /(\d+) miles?/gi;
const distances = (s: string, unit = "m") =>
  s
    .replace(DIST, (_, n: string) => `${metres(Number(n.replace(/,/g, "")))} ${unit}`)
    .replace(MILES, (_, n: string) => `${String(Math.round(Number(n) * 1.5 * 10) / 10).replace(".", ",")} km`);

export const DAMAGE_IT: Record<string, string> = {
  acid: "acido",
  bludgeoning: "contundenti",
  cold: "freddo",
  fire: "fuoco",
  force: "forza",
  lightning: "fulmine",
  necrotic: "necrotici",
  piercing: "perforanti",
  poison: "veleno",
  psychic: "psichici",
  radiant: "radiosi",
  slashing: "taglienti",
  thunder: "tuono",
};

export const CONDITION_IT: Record<string, string> = {
  blinded: "accecato",
  charmed: "affascinato",
  deafened: "assordato",
  exhaustion: "indebolimento",
  frightened: "spaventato",
  grappled: "afferrato",
  incapacitated: "incapacitato",
  invisible: "invisibile",
  paralyzed: "paralizzato",
  petrified: "pietrificato",
  poisoned: "avvelenato",
  prone: "prono",
  restrained: "trattenuto",
  stunned: "stordito",
  unconscious: "privo di sensi",
};

/** Sostituzioni di parole intere, senza distinguere maiuscole; la prima lettera segue l'originale se serve. */
function words(s: string, dict: Record<string, string>): string {
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
  if (!keys.length) return s;
  const re = new RegExp(`\\b(${keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
  return s.replace(re, (w) => dict[w.toLowerCase()] ?? w);
}

/* ------------------------------------------------------------------ */
/* Incantesimi                                                         */
/* ------------------------------------------------------------------ */

function spellTime(s: string): string {
  return s
    .replace(/^1 bonus action/i, "1 azione bonus")
    .replace(/^1 reaction/i, "1 reazione")
    .replace(/^1 action/i, "1 azione")
    .replace(/^(\d+) actions?/i, "$1 azioni")
    .replace(/^1 minute/i, "1 minuto")
    .replace(/^(\d+) minutes/i, "$1 minuti")
    .replace(/^1 hour/i, "1 ora")
    .replace(/^(\d+) hours/i, "$1 ore")
    .replace(/, which you take when /i, ", che effettui quando ");
}

function spellRange(s: string): string {
  return distances(
    s
      .replace(/^Self\b/i, "Incantatore")
      .replace(/^Touch$/i, "Contatto")
      .replace(/^Sight$/i, "Vista")
      .replace(/^Unlimited$/i, "Illimitata")
      .replace(/^Special$/i, "Speciale")
      .replace(/(\d+)-foot(?:-radius)? (cone|cube|line|sphere|radius|hemisphere|cylinder)/gi, (_, n: string, shape: string) => `${shape.toLowerCase()} di ${metres(Number(n))} m`)
      .replace(/\bcone\b/gi, "cono")
      .replace(/\bcube\b/gi, "cubo")
      .replace(/\bline\b/gi, "linea")
      .replace(/\bsphere\b/gi, "sfera")
      .replace(/\bradius\b/gi, "raggio")
      .replace(/\bhemisphere\b/gi, "emisfero")
      .replace(/\bcylinder\b/gi, "cilindro"),
    "metri",
  );
}

function spellDuration(s: string): string {
  return s
    .replace(/^Instantaneous$/i, "Istantanea")
    .replace(/^Concentration, up to /i, "Concentrazione, fino a ")
    .replace(/^Up to /i, "Fino a ")
    .replace(/Until dispelled or triggered/i, "Finché non viene dissolto o innescato")
    .replace(/Until dispelled/i, "Finché non viene dissolto")
    .replace(/^Special$/i, "Speciale")
    .replace(/\b1 round\b/i, "1 round")
    .replace(/\b(\d+) rounds\b/i, "$1 round")
    .replace(/\b1 minute\b/i, "1 minuto")
    .replace(/\b(\d+) minutes\b/i, "$1 minuti")
    .replace(/\b1 hour\b/i, "1 ora")
    .replace(/\b(\d+) hours\b/i, "$1 ore")
    .replace(/\b1 day\b/i, "1 giorno")
    .replace(/\b(\d+) days\b/i, "$1 giorni")
    .replace(/\b1 year\b/i, "1 anno");
}

export function localizeSpell(sp: SpellDef & { nameEn?: string }) {
  // Solo i dati ancora in inglese: un incantesimo tradotto solo nel nome li ha ancora da tradurre.
  if (!/\b(actions?|reaction|minutes?|hours?)\b/i.test(sp.castingTime)) return;
  sp.castingTime = spellTime(sp.castingTime);
  sp.range = spellRange(sp.range);
  sp.duration = spellDuration(sp.duration);
}

/* ------------------------------------------------------------------ */
/* Mostri                                                              */
/* ------------------------------------------------------------------ */

/** Tipo di creatura → nome italiano e genere (per accordare la taglia). */
const TYPES: Record<string, [string, "m" | "f"]> = {
  aberration: ["aberrazione", "f"],
  beast: ["bestia", "f"],
  celestial: ["celestiale", "m"],
  construct: ["costrutto", "m"],
  dragon: ["drago", "m"],
  elemental: ["elementale", "m"],
  fey: ["folletto", "m"],
  fiend: ["immondo", "m"],
  giant: ["gigante", "m"],
  humanoid: ["umanoide", "m"],
  monstrosity: ["mostruosità", "f"],
  ooze: ["melma", "f"],
  plant: ["vegetale", "m"],
  undead: ["non morto", "m"],
};
const SIZES: Record<string, [string, string]> = {
  tiny: ["Minuscolo", "Minuscola"],
  small: ["Piccolo", "Piccola"],
  medium: ["Medio", "Media"],
  large: ["Grande", "Grande"],
  huge: ["Enorme", "Enorme"],
  gargantuan: ["Mastodontico", "Mastodontica"],
};
const SUBTYPES: Record<string, string> = {
  "any race": "qualsiasi razza",
  human: "umano",
  elf: "elfo",
  dwarf: "nano",
  gnome: "gnomo",
  halfling: "halfling",
  orc: "orco",
  "half-elf": "mezzelfo",
  "half-orc": "mezzorco",
  goblinoid: "goblinoide",
  kobold: "coboldo",
  lizardfolk: "lucertoloide",
  shapechanger: "mutaforma",
  demon: "demone",
  devil: "diavolo",
  gem: "gemma",
  titan: "titano",
  wizard: "mago",
  sorcerer: "stregone",
  druid: "druido",
  cleric: "chierico",
  warlock: "warlock",
  dinosaur: "dinosauro",
  merfolk: "uomo pesce",
  grimlock: "grimlock",
  gnoll: "gnoll",
  tiefling: "tiefling",
  aarakocra: "aarakocra",
  "any lineage": "qualsiasi stirpe",
};
const ALIGNMENT: Record<string, string> = {
  typically: "di solito",
  unaligned: "senza allineamento",
  "any alignment": "qualsiasi allineamento",
  "any non-good alignment": "qualsiasi allineamento non buono",
  "any non-lawful alignment": "qualsiasi allineamento non legale",
  "any evil alignment": "qualsiasi allineamento malvagio",
  "any chaotic alignment": "qualsiasi allineamento caotico",
  "any good alignment": "qualsiasi allineamento buono",
  any: "qualsiasi",
  lawful: "legale",
  chaotic: "caotico",
  neutral: "neutrale",
  good: "buono",
  evil: "malvagio",
  or: "o",
};
const MOVES: Record<string, string> = { fly: "volare", swim: "nuotare", climb: "scalare", burrow: "scavare", hover: "fluttuare", walk: "camminare" };
const SENSES: Record<string, string> = {
  darkvision: "scurovisione",
  blindsight: "vista cieca",
  truesight: "vista pura",
  tremorsense: "percezione tellurica",
  "blind beyond this radius": "cieco oltre questo raggio",
};
const LANGUAGES: Record<string, string> = {
  common: "Comune",
  elvish: "Elfico",
  dwarvish: "Nanico",
  giant: "Gigante",
  gnomish: "Gnomesco",
  orc: "Orchesco",
  abyssal: "Abissale",
  celestial: "Celestiale",
  draconic: "Draconico",
  "deep speech": "Gergo delle profondità",
  infernal: "Infernale",
  primordial: "Primordiale",
  sylvan: "Silvano",
  undercommon: "Sottocomune",
  druidic: "Druidico",
  "thieves' cant": "Gergo ladresco",
  telepathy: "telepatia",
  "any one language (usually Common)": "un linguaggio qualsiasi (di solito il Comune)",
  "the languages it knew in life": "i linguaggi che conosceva in vita",
  "any languages it knew in life": "i linguaggi che conosceva in vita",
  "understands the languages of its creator but can't speak": "capisce i linguaggi del suo creatore ma non può parlare",
  "understands one language of its creator but can't speak": "capisce un linguaggio del suo creatore ma non può parlare",
  "understands the languages you speak": "capisce i linguaggi che parli",
  "understands the languages it knew in life but can't speak": "capisce i linguaggi che conosceva in vita ma non può parlare",
  understands: "capisce",
  "but can't speak": "ma non può parlare",
  "can't speak": "non può parlare",
  "any two languages": "due linguaggi qualsiasi",
  "any three languages": "tre linguaggi qualsiasi",
  "any four languages": "quattro linguaggi qualsiasi",
  "any five languages": "cinque linguaggi qualsiasi",
  "any six languages": "sei linguaggi qualsiasi",
  "any one language": "un linguaggio qualsiasi",
  "plus any one language": "più un linguaggio qualsiasi",
  "plus any two languages": "più due linguaggi qualsiasi",
  "plus any four languages": "più quattro linguaggi qualsiasi",
  "plus one other language": "più un altro linguaggio",
  plus: "più",
  all: "tutti",
};
const RESIST: Record<string, string> = {
  ...DAMAGE_IT,
  "from nonmagical attacks": "da attacchi non magici",
  "from nonmagical attacks that aren't silvered": "da attacchi non magici non argentati",
  "from nonmagical attacks that aren't adamantine": "da attacchi non magici non adamantini",
  "that aren't silvered": "non argentati",
  "from magic weapons": "da armi magiche",
  and: "e",
};
const ARMOR_NOTES: Record<string, string> = {
  "natural armor": "armatura naturale",
  "leather armor": "armatura di cuoio",
  "studded leather armor": "armatura di cuoio borchiato",
  "studded leather": "cuoio borchiato",
  "hide armor": "armatura di pelle",
  "chain shirt": "giaco di maglia",
  "scale mail": "corazza a scaglie",
  breastplate: "corazza di piastre",
  "half plate armor": "mezza armatura",
  "half plate": "mezza armatura",
  "ring mail": "corazza ad anelli",
  "chain mail": "cotta di maglia",
  splint: "corazza a strisce",
  "plate armor": "armatura a piastre",
  plate: "armatura a piastre",
  shield: "scudo",
  shields: "scudi",
  "with mage armor": "con armatura magica",
  "with barkskin": "con pelle coriacea",
  "unarmored defense": "difesa senza armatura",
  "patchwork armor": "armatura rattoppata",
};

function monsterType(type: string, size: string): { type: string; size: string } {
  const m = /^(\w+)(?:\s*\((.*)\))?$/.exec(type.trim().toLowerCase());
  const t = m && TYPES[m[1]!];
  const sz = SIZES[size.toLowerCase()];
  if (!t) return { type, size: sz?.[0] ?? size };
  const sub = m[2] ? ` (${m[2].split(/,\s*/).map((x) => SUBTYPES[x] ?? x).join(", ")})` : "";
  return { type: `${t[0]}${sub}`, size: sz ? sz[t[1] === "f" ? 1 : 0] : size };
}

/**
 * Le voci formulari: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
 * Si traduce la parte fissa; le frasi che seguono i danni restano come sono.
 */
const ATTACK =
  /^(Melee|Ranged|Melee or Ranged) (Weapon|Spell) Attack: ([+-]\d+) to hit, ((?:reach|range) [^,]+?(?: or range [^,]+?)?), (one target|one creature|one target in the swarm's space|one creature in the swarm's space)\. Hit: (\d+) \(([^)]+)\) (\w+) damage(?:,? plus (\d+) \(([^)]+)\) (\w+) damage)?\.(\s[\s\S]*)?$/;
const KIND: Record<string, string> = { Melee: "da mischia", Ranged: "a distanza", "Melee or Ranged": "da mischia o a distanza" };
const TARGET: Record<string, string> = {
  "one target": "un bersaglio",
  "one creature": "una creatura",
  "one target in the swarm's space": "un bersaglio nello spazio dello sciame",
  "one creature in the swarm's space": "una creatura nello spazio dello sciame",
};

export function localizeAttack(text: string): string {
  const a = ATTACK.exec(text.trim());
  if (!a) return text;
  const [, kind, by, bonus, reach, target, avg, dice, type, avg2, dice2, type2, rest] = a;
  const where = distances(rangePair(reach!.replace(/^reach /, "portata ").replace(/^range /, "gittata ").replace(/ or range /, " o gittata ")));
  const dmg = (n: string, d: string, t: string) => `${n} (${d}) danni ${DAMAGE_IT[t.toLowerCase()] ?? t}`;
  const attack = by === "Spell" ? `Attacco con incantesimo ${KIND[kind!]}` : `Attacco con arma ${KIND[kind!]}`;
  return `${attack}: ${bonus} al tiro per colpire, ${where}, ${TARGET[target!]}. Colpito: ${dmg(avg!, dice!, type!)}${avg2 ? ` più ${dmg(avg2, dice2!, type2!)}` : ""}.${rest ?? ""}`;
}

/** Il "range 80/320 ft." si converte dopo, perché la barra spezza la regola generale. */
function rangePair(s: string) {
  return s.replace(/(\d+)\/(\d+) (?:feet|foot|ft\.?)/g, (_, x: string, y: string) => `${metres(Number(x))}/${metres(Number(y))} m`);
}

export function localizeMonster(m: MonsterDef & { nameEn?: string }, entryNames: Map<string, string>) {
  // Solo i mostri con i dati ancora in inglese (la taglia lo dice): quelli tradotti solo nel nome vanno sistemati.
  if (!SIZES[m.size.toLowerCase()]) return;
  const t = monsterType(m.type, m.size);
  m.type = t.type;
  m.size = t.size;
  if (m.alignment) m.alignment = words(m.alignment.toLowerCase(), ALIGNMENT);
  m.speed = distances(rangePair(words(m.speed, MOVES)));
  if (m.senses) m.senses = distances(words(m.senses, SENSES));
  if (m.languages) m.languages = distances(words(m.languages, LANGUAGES));
  for (const k of ["resistances", "immunities", "vulnerabilities"] as const) if (m[k]) m[k] = words(m[k]!, RESIST);
  if (m.conditionImmunities) m.conditionImmunities = words(m.conditionImmunities, CONDITION_IT);
  if (m.acNote) m.acNote = words(m.acNote, ARMOR_NOTES);
  const entry = (e: MonsterEntry) => {
    const [, base, paren] = /^(.*?)(\s*\(.*\))?$/.exec(e.name)!;
    const it = entryNames.get(base!.toLowerCase());
    if (it) e.name = `${it}${paren ? localizeParen(paren) : ""}`;
    e.text = localizeAttack(e.text);
  };
  for (const k of ["traits", "actions", "reactions", "legendary"] as const) m[k]?.forEach(entry);
}

/** "(Recharge 5–6)", "(3/Day)", "(Costs 2 Actions)" → italiano. */
function localizeParen(p: string): string {
  return p
    .replace(/Recharge (\d)/i, "Ricarica $1")
    .replace(/Recharges after a Short or Long Rest/i, "si ricarica dopo un riposo breve o lungo")
    .replace(/(\d)\/Day/i, "$1/giorno")
    .replace(/Costs (\d) Actions/i, "costa $1 azioni")
    .replace(/(\d)\/Turn/i, "$1/turno");
}

/** Nomi di voci frequenti nei supplementi che l'SRD non contiene; il dizionario dell'SRD ha la precedenza. */
const EXTRA_ENTRY_NAMES: Record<string, string> = {
  regeneration: "Rigenerazione",
  "pack tactics": "Tattiche del branco",
  "magic resistance": "Resistenza alla magia",
  amphibious: "Anfibio",
  "spider climb": "Movimenti del ragno",
  "keen smell": "Olfatto acuto",
  "keen hearing and smell": "Udito e olfatto acuti",
  "keen sight and smell": "Vista e olfatto acuti",
  bite: "Morso",
  claw: "Artiglio",
  slam: "Schianto",
  "breath weapon": "Soffio",
  "breath weapons": "Soffi",
  "fey ancestry": "Retaggio fatato",
  "sunlight sensitivity": "Sensibilità alla luce del sole",
  "sunlight hypersensitivity": "Ipersensibilità alla luce del sole",
  "hold breath": "Trattenere il respiro",
  "keen sight": "Vista acuta",
  "keen hearing": "Udito acuto",
  "keen senses": "Sensi acuti",
  "pounce": "Assalto",
  charge: "Carica",
  "limited magic immunity": "Immunità limitata alla magia",
  "turn immunity": "Immunità allo scacciare",
  "turn resistance": "Resistenza allo scacciare",
  "turn defiance": "Sfida allo scacciare",
  "undead fortitude": "Tempra da non morto",
  "devil's sight": "Vista del diavolo",
  "shapechanger": "Mutaforma",
  "change shape": "Cambiare forma",
  "false appearance": "Falso aspetto",
  "magic weapons": "Armi magiche",
  "siege monster": "Mostro d'assedio",
  "standing leap": "Balzo da fermo",
  "rampage": "Furia",
  "aggressive": "Aggressivo",
  "brute": "Bruto",
  "martial advantage": "Vantaggio marziale",
  "nimble escape": "Fuga agile",
  "parry": "Parata",
  "reckless": "Avventato",
  "sneak attack": "Attacco furtivo",
  "cunning action": "Azione scaltra",
  "evasion": "Elusione",
  "dagger": "Pugnale",
  "unarmed strike": "Colpo senz'armi",
  "fist": "Pugno",
  "tentacles": "Tentacoli",
  "tentacle": "Tentacolo",
  "horns": "Corna",
  "hooves": "Zoccoli",
  "gore": "Incornata",
  "talons": "Artigli",
  "beak": "Becco",
  "sting": "Pungiglione",
  "tail": "Coda",
  "claws": "Artigli",
  "touch": "Tocco",
  "rock": "Masso",
  "teleport": "Teletrasporto",
  "detect": "Individuazione",
  "move": "Movimento",
  "attack": "Attacco",
  "cantrip": "Trucchetto",
  "cast a spell": "Lanciare un incantesimo",
  "frightful presence": "Presenza terrificante",
  "wing attack": "Attacco d'ala",
  "tail attack": "Attacco di coda",
  "legendary resistance": "Resistenza leggendaria",
  "multiattack": "Multiattacco",
  "spellcasting": "Incantesimi",
  "innate spellcasting": "Incantesimi innati",
};

/** "Alarm (Ritual Only)" è una copia di "Alarm": se l'originale è tradotto, la copia prende nome e testi italiani. */
function ritualCopies(spells: (SpellDef & { nameEn?: string })[]) {
  const byId = new Map(spells.map((s) => [s.id, s]));
  for (const s of spells) {
    const base = !s.nameEn && s.id.endsWith("-ritual-only") ? byId.get(s.id.replace(/-ritual-only$/, "")) : undefined;
    if (!base?.nameEn) continue;
    s.nameEn = s.name;
    s.name = `${base.name} (solo rituale)`;
    for (const k of ["description", "higherLevels", "castingTime", "range", "components", "duration"] as const) if (base[k] !== undefined) s[k] = base[k] as string;
  }
}

/** Applica l'italiano automatico a tutto il pacchetto (solo alle voci senza traduzione). */
export function localizePack(pack: ContentPack, entryNames: Record<string, string> = {}) {
  const names = new Map(Object.entries({ ...EXTRA_ENTRY_NAMES, ...entryNames }));
  ritualCopies(pack.spells ?? []);
  pack.spells?.forEach(localizeSpell);
  pack.monsters?.forEach((m) => localizeMonster(m, names));
}
