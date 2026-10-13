/**
 * Importa un compendio XML nel formato di Fight Club 5e / Game Master 5e
 * (<compendium> con item, race, class, feat, background, spell, monster) e lo
 * trasforma in un ContentPack del motore.
 *
 * Cosa passa in automatico: struttura (classi, sottoclassi, livelli, opzioni),
 * numeri (dadi vita, slot, contatori, competenze, statistiche dei mostri) e testi.
 * Le meccaniche descritte solo a parole restano testo: si codificano a mano dopo.
 */
import type {
  Ability,
  BackgroundDef,
  ChoiceDef,
  ClassDef,
  ContentPack,
  Effect,
  FeatDef,
  Feature,
  ItemDef,
  MonsterDef,
  MonsterEntry,
  ProficiencySet,
  SkillDef,
  SpeciesDef,
  SpellDef,
  SpellcastingDef,
  SubclassDef,
  Value,
  WeaponProperty,
} from "@dnd/engine";
import { applyMechanics, type MechanicsReport } from "./mechanics.ts";
import { kid, kids, parseXml, val, type XmlNode } from "./xml.ts";

/* ------------------------------------------------------------------ */
/* Tabelle di regole 2014 che il compendio dà solo a parole            */
/* ------------------------------------------------------------------ */

const ABILITY_BY_NAME: Record<string, Ability> = {
  strength: "str",
  dexterity: "dex",
  constitution: "con",
  intelligence: "int",
  wisdom: "wis",
  charisma: "cha",
  str: "str",
  dex: "dex",
  con: "con",
  int: "int",
  wis: "wis",
  cha: "cha",
};

export const SKILLS_2014: SkillDef[] = [
  { id: "acrobatics", name: "Acrobazia", ability: "dex" },
  { id: "animal-handling", name: "Addestrare Animali", ability: "wis" },
  { id: "arcana", name: "Arcano", ability: "int" },
  { id: "athletics", name: "Atletica", ability: "str" },
  { id: "deception", name: "Inganno", ability: "cha" },
  { id: "history", name: "Storia", ability: "int" },
  { id: "insight", name: "Intuizione", ability: "wis" },
  { id: "intimidation", name: "Intimidire", ability: "cha" },
  { id: "investigation", name: "Indagare", ability: "int" },
  { id: "medicine", name: "Medicina", ability: "wis" },
  { id: "nature", name: "Natura", ability: "int" },
  { id: "perception", name: "Percezione", ability: "wis" },
  { id: "performance", name: "Intrattenere", ability: "cha" },
  { id: "persuasion", name: "Persuasione", ability: "cha" },
  { id: "religion", name: "Religione", ability: "int" },
  { id: "sleight-of-hand", name: "Rapidità di Mano", ability: "dex" },
  { id: "stealth", name: "Furtività", ability: "dex" },
  { id: "survival", name: "Sopravvivenza", ability: "wis" },
];
const SKILL_IDS = new Set(SKILLS_2014.map((s) => s.id));

/** Requisiti e competenze del multiclasse (tabelle del Manuale del Giocatore). */
const MULTICLASS: Record<string, { primary: Ability[]; all?: boolean; prof: ProficiencySet }> = {
  barbarian: { primary: ["str"], prof: { armor: ["shield"], weapons: ["simple", "martial"] } },
  bard: { primary: ["cha"], prof: { armor: ["light"] } },
  cleric: { primary: ["wis"], prof: { armor: ["light", "medium", "shield"] } },
  druid: { primary: ["wis"], prof: { armor: ["light", "medium", "shield"] } },
  fighter: { primary: ["str", "dex"], prof: { armor: ["light", "medium", "shield"], weapons: ["simple", "martial"] } },
  monk: { primary: ["dex", "wis"], all: true, prof: { weapons: ["simple", "shortsword"] } },
  paladin: { primary: ["str", "cha"], all: true, prof: { armor: ["light", "medium", "shield"], weapons: ["simple", "martial"] } },
  ranger: { primary: ["dex", "wis"], all: true, prof: { armor: ["light", "medium", "shield"], weapons: ["simple", "martial"] } },
  rogue: { primary: ["dex"], prof: { armor: ["light"], tools: ["thieves-tools"] } },
  sorcerer: { primary: ["cha"], prof: {} },
  warlock: { primary: ["cha"], prof: { armor: ["light"], weapons: ["simple"] } },
  wizard: { primary: ["int"], prof: {} },
  artificer: { primary: ["int"], prof: { armor: ["light", "medium", "shield"], tools: ["thieves-tools", "tinkers-tools"] } },
};

/** Incantesimi conosciuti per livello di classe, per chi non li prepara. */
const SPELLS_KNOWN: Record<string, number[]> = {
  bard: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  sorcerer: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  ranger: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
  warlock: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
};
/** Cavaliere Mistico e Mistificatore Arcano. */
const THIRD_CASTER_KNOWN = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13];
/** Preparano metà livello + modificatore invece di livello + modificatore. */
const HALF_PREPARED = new Set(["paladin", "artificer"]);

/* ------------------------------------------------------------------ */
/* Utilità                                                             */
/* ------------------------------------------------------------------ */

export const slug = (s: string): string =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const SOURCE = /^\s*Source:\s*(.+)$/i;

/** Righe <text> di una voce: testo unito, fonte separata. */
function body(n: XmlNode): { text: string; source?: string } {
  const lines: string[] = [];
  let source: string | undefined;
  for (const t of kids(n, "text")) {
    const line = t.text.replace(/\s+$/, "");
    const m = line.match(SOURCE);
    if (m) source ??= m[1]!.trim();
    else lines.push(line.replace(/^\t+/, ""));
  }
  return { text: lines.join("\n").replace(/\n{3,}/g, "\n\n").trim(), source };
}

const list = (s: string): string[] =>
  s
    .split(/[,;]/)
    .map((x) => x.trim())
    .filter(Boolean);

/** Id unico: se il nome è già usato aggiunge la fonte o un numero. */
function uniqueId(used: Set<string>, base: string, hint?: string): string {
  let id = base || "x";
  if (used.has(id) && hint) id = `${base}-${slug(hint).slice(0, 24)}`;
  for (let i = 2; used.has(id); i++) id = `${base}-${i}`;
  used.add(id);
  return id;
}

export interface ImportStats {
  counts: Record<string, number>;
  /** Modificatori del compendio che l'importatore non sa tradurre in effetti. */
  unmappedModifiers: Record<string, number>;
  subclasses: Record<string, string[]>;
  warnings: string[];
  /** Meccaniche codificate a mano applicate al pacchetto. */
  mechanics?: MechanicsReport;
}

interface Ctx {
  stats: ImportStats;
}

/* ------------------------------------------------------------------ */
/* Modificatori e competenze -> effetti                                */
/* ------------------------------------------------------------------ */

function effectsOf(n: XmlNode, ctx: Ctx, label: string): Effect[] {
  const out: Effect[] = [];
  for (const m of kids(n, "modifier")) {
    const cat = (m.attrs.category ?? "").toLowerCase();
    const text = m.text.trim().toLowerCase();
    const num = text.match(/^(.*?)\s*([+-]\s*\d+)$/);
    const what = num?.[1]?.trim();
    const value = num ? Number(num[2]!.replace(/\s+/g, "")) : NaN;
    const ability = what ? ABILITY_BY_NAME[what] : undefined;
    if (cat === "ability score" && ability && !Number.isNaN(value)) {
      out.push({ type: "bonus", target: `ability.${ability}`, value, label });
    } else if (cat === "bonus" && what === "speed" && !Number.isNaN(value)) {
      out.push({ type: "bonus", target: "speed.walk", value, label });
    } else if (cat === "bonus" && what === "initiative" && !Number.isNaN(value)) {
      out.push({ type: "bonus", target: "initiative", value, label });
    } else if (cat === "bonus" && /^initiative\s*\+\s*prof/.test(text)) {
      out.push({ type: "bonus", target: "initiative", value: { prof: 1 }, label });
    } else {
      // CA, attacchi e danni dipendono quasi sempre da una condizione scritta nel testo
      // (armatura indossata, arma a una mano...): si codificano a mano.
      const key = `${cat}: ${text.replace(/[+-]?\s*\d+/g, "N")}`;
      ctx.stats.unmappedModifiers[key] = (ctx.stats.unmappedModifiers[key] ?? 0) + 1;
    }
  }
  for (const s of kids(n, "special")) {
    const t = s.text.trim().toLowerCase();
    if (t === "unarmored defense constitution") {
      out.push({ type: "acFormula", value: { sum: [10, { mod: "dex" }, { mod: "con" }] }, when: { armor: "none" }, label });
    } else if (t === "unarmored defense wisdom") {
      out.push({ type: "acFormula", value: { sum: [10, { mod: "dex" }, { mod: "wis" }] }, when: { all: [{ armor: "none" }, { shield: false }] }, label });
    } else if (t === "jack of all trades") {
      out.push({ type: "bonus", target: "skill.unproficient", value: { prof: 0.5 }, label });
    }
  }
  const skills: string[] = [];
  const saves: string[] = [];
  for (const p of kids(n, "proficiency")) {
    for (const item of list(p.text)) {
      const ab = ABILITY_BY_NAME[item.toLowerCase()];
      if (ab) saves.push(ab);
      else if (SKILL_IDS.has(slug(item))) skills.push(slug(item));
    }
  }
  if (skills.length) out.push({ type: "grant", target: "skill", values: skills });
  if (saves.length) out.push({ type: "grant", target: "save", values: saves });
  return out;
}

/* ------------------------------------------------------------------ */
/* Classi                                                              */
/* ------------------------------------------------------------------ */

interface RawFeature {
  level: number;
  node: XmlNode;
  name: string;
  optional: boolean;
  asi: boolean;
}

const ASI_FEAT: FeatDef = {
  id: "asi",
  name: "Aumento dei punteggi di caratteristica",
  category: "general",
  repeatable: true,
  feature: {
    id: "feat.asi",
    name: "Aumento dei punteggi di caratteristica",
    description: "Aumenta un punteggio di caratteristica di 2, oppure due punteggi di 1. Non puoi superare 20.",
    choices: [{ id: "abilities", kind: "abilityBoost", label: "Aumento dei punteggi", count: 2, repeat: true }],
  },
};

function importClass(n: XmlNode, ctx: Ctx, usedClassIds: Set<string>): { cls: ClassDef; subclasses: SubclassDef[]; options: FeatDef[] } {
  const name = val(n, "name");
  const classId = uniqueId(usedClassIds, slug(name));
  const hd = Number(val(n, "hd")) || 8;

  /* --- competenze dall'intestazione --- */
  const saves: Ability[] = [];
  const skillList: string[] = [];
  for (const item of list(val(n, "proficiency").replace(/\./g, ","))) {
    const ab = ABILITY_BY_NAME[item.toLowerCase()];
    if (ab) saves.push(ab);
    else if (SKILL_IDS.has(slug(item))) skillList.push(slug(item));
  }
  const armor = list(val(n, "armor").toLowerCase())
    .map((a) => (a.startsWith("light") ? "light" : a.startsWith("medium") ? "medium" : a.startsWith("heavy") ? "heavy" : a.startsWith("shield") ? "shield" : undefined))
    .filter((a): a is "light" | "medium" | "heavy" | "shield" => !!a);
  const weapons = list(val(n, "weapons").toLowerCase())
    .filter((w) => w !== "none")
    .map((w) => (w.startsWith("simple") ? "simple" : w.startsWith("martial") ? "martial" : slug(w.replace(/s$/, ""))));
  const tools = list(val(n, "tools"))
    .filter((t) => t.toLowerCase() !== "none")
    .map(slug);

  /* --- livelli --- */
  const raw: RawFeature[] = [];
  const counters: { level: number; name: string; value: number; reset: string; owner?: RawFeature }[] = [];
  const slotRows: { level: number; optional: boolean; values: number[] }[] = [];
  for (const al of kids(n, "autolevel")) {
    const level = Number(al.attrs.level) || 1;
    const asi = al.attrs.scoreImprovement === "YES";
    const feats = kids(al, "feature").map((f) => ({ level, node: f, name: val(f, "name"), optional: f.attrs.optional === "YES", asi }));
    raw.push(...feats);
    for (const c of kids(al, "counter")) {
      counters.push({ level, name: val(c, "name"), value: Number(val(c, "value")) || 0, reset: val(c, "reset"), owner: feats[0] });
    }
    for (const s of kids(al, "slots")) {
      slotRows.push({ level, optional: s.attrs.optional === "YES", values: list(s.text).map(Number) });
    }
  }

  /* --- sottoclassi: "Gruppo: Nome" più privilegi "Privilegio (Nome)" --- */
  const SUFFIX = /^(.*\S)\s*\(([^()]+)\)$/;
  const suffixes = new Set(raw.filter((f) => f.optional).map((f) => f.name.match(SUFFIX)?.[2]).filter((x): x is string => !!x));
  const groupCount = new Map<string, number>();
  for (const f of raw) {
    const m = f.optional && !SUFFIX.test(f.name) ? f.name.match(/^([^:]+):\s*(.+)$/) : null;
    if (m && suffixes.has(m[2]!.trim())) groupCount.set(m[1]!.trim(), (groupCount.get(m[1]!.trim()) ?? 0) + 1);
  }
  const subGroup = [...groupCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const subNames = new Map<string, { level: number; intro: RawFeature }>();
  if (subGroup) {
    for (const f of raw) {
      const m = f.optional ? f.name.match(/^([^:]+):\s*(.+)$/) : null;
      if (m && m[1]!.trim() === subGroup && !SUFFIX.test(f.name) && !subNames.has(m[2]!.trim())) subNames.set(m[2]!.trim(), { level: f.level, intro: f });
    }
  }
  const subclassLevel = subNames.size ? Math.min(...[...subNames.values()].map((s) => s.level)) : 3;

  /* --- costruzione dei privilegi --- */
  const usedIds = new Set<string>();
  const options: FeatDef[] = [];
  const optionIds = new Set<string>();
  const classFeatures: Feature[] = [];
  const subFeatures = new Map<string, Feature[]>();
  const built = new Map<RawFeature, Feature>();
  const byName = new Map<string, Feature>(); // "sottoclasse|nome" -> privilegio, per agganciare le opzioni

  const make = (f: RawFeature, idBase: string, displayName: string): Feature => {
    const b = body(f.node);
    const feature: Feature = { id: uniqueId(usedIds, idBase, `l${f.level}`), name: displayName, level: f.level };
    if (b.text) feature.description = b.text;
    if (b.source) feature.source = b.source;
    const effects = effectsOf(f.node, ctx, displayName);
    if (effects.length) feature.effects = effects;
    built.set(f, feature);
    return feature;
  };
  const addOption = (parent: Feature, f: RawFeature, optName: string, scope: string) => {
    const tag = `opt:${parent.id}`;
    const id = `${scope}.${slug(optName)}`;
    if (!parent.choices?.some((c) => c.from && !Array.isArray(c.from) && c.from.tag === tag)) {
      const choice: ChoiceDef = { id: parent.id, kind: "feat", label: parent.name, count: 1, from: { tag } };
      parent.choices = [...(parent.choices ?? []), choice];
    }
    if (optionIds.has(id)) return; // stessa opzione ripetuta a più livelli
    optionIds.add(id);
    const b = body(f.node);
    const effects = effectsOf(f.node, ctx, optName);
    options.push({
      id,
      name: optName,
      category: "option",
      tags: [tag],
      source: b.source,
      feature: { id: `feat.${id}`, name: `${parent.name}: ${optName}`, description: b.text || undefined, ...(effects.length ? { effects } : {}) },
    });
  };

  // Primo passaggio: privilegi di classe e di sottoclasse (le opzioni dopo, quando i genitori esistono).
  const pendingOptions: RawFeature[] = [];
  const loose: RawFeature[] = [];
  for (const f of raw) {
    if (!f.optional) {
      const feature = make(f, `${classId}.${slug(f.name)}`, f.name);
      if (f.asi && /ability score improvement/i.test(f.name)) {
        feature.choices = [{ id: `${classId}.asi-${f.level}`, kind: "feat", label: `Aumento di caratteristica o talento (livello ${f.level})`, count: 1, from: { tag: "general" } }];
      }
      classFeatures.push(feature);
      if (!byName.has(`|${f.name}`)) byName.set(`|${f.name}`, feature);
      continue;
    }
    if (/^(Starting|Multiclass) /.test(f.name)) continue; // riassunti: i dati sono già nell'intestazione
    const sfx = f.name.match(SUFFIX);
    const colon = (sfx ? sfx[1]! : f.name).match(/^([^:]+):\s*(.+)$/);
    if (!sfx && colon && colon[1]!.trim() === subGroup && subNames.has(colon[2]!.trim())) continue; // introduzione della sottoclasse
    if (sfx && subNames.has(sfx[2]!.trim())) {
      const sub = sfx[2]!.trim();
      if (colon && byName.has(`${sub}|${colon[1]!.trim()}`)) {
        pendingOptions.push(f);
        continue;
      }
      const feature = make(f, `${classId}.${slug(sub)}.${slug(sfx[1]!)}`, sfx[1]!.trim());
      subFeatures.set(sub, [...(subFeatures.get(sub) ?? []), feature]);
      if (!byName.has(`${sub}|${sfx[1]!.trim()}`)) byName.set(`${sub}|${sfx[1]!.trim()}`, feature);
      continue;
    }
    if (colon) pendingOptions.push(f);
    else loose.push(f);
  }

  // Secondo passaggio: "Stile di Combattimento: Tiro" diventa un'opzione del privilegio "Stile di Combattimento".
  for (const f of pendingOptions) {
    const sfx = f.name.match(SUFFIX);
    const sub = sfx && subNames.has(sfx[2]!.trim()) ? sfx[2]!.trim() : "";
    const colon = (sub ? sfx![1]! : f.name).match(/^([^:]+):\s*(.+)$/)!;
    const parent = byName.get(`${sub}|${colon[1]!.trim()}`) ?? byName.get(`|${colon[1]!.trim()}`);
    if (parent) addOption(parent, f, colon[2]!.trim(), parent.id);
    else if (sub) {
      const feature = make(f, `${classId}.${slug(sub)}.${slug(sfx![1]!)}`, sfx![1]!.trim());
      subFeatures.set(sub, [...(subFeatures.get(sub) ?? []), feature]);
    } else loose.push(f);
  }

  // Privilegi facoltativi senza un genitore (regole opzionali di Tasha e simili): scelta libera.
  if (loose.length) {
    const holder: Feature = { id: `${classId}.optional`, name: "Privilegi opzionali", level: 1, description: "Privilegi facoltativi: sceglili d'accordo con il Master." };
    classFeatures.push(holder);
    for (const f of loose) addOption(holder, f, f.name, holder.id);
    holder.choices = holder.choices?.map((c) => ({ ...c, count: 0 }));
  }

  /* --- contatori -> risorse con tabella per livello --- */
  const byCounter = new Map<string, typeof counters>();
  for (const c of counters) byCounter.set(c.name, [...(byCounter.get(c.name) ?? []), c]);
  for (const [cname, rows] of byCounter) {
    rows.sort((a, b) => a.level - b.level);
    const values: number[] = [];
    for (let lv = 1, cur = 0; lv <= 20; lv++) {
      for (const r of rows) if (r.level === lv) cur = r.value;
      values.push(cur);
    }
    if (values.every((v) => v === 0)) continue;
    // Il proprietario si cerca per nome: nel compendio il contatore può stare in un livello che ha altri privilegi.
    const candidates = [...classFeatures, ...[...subFeatures.values()].flat(), ...options.map((o) => o.feature)];
    const optionName = (f: Feature) => f.name.replace(/^.*?: /, "");
    const ownerRaw = rows.find((r) => r.owner && built.has(r.owner))?.owner;
    const owner =
      candidates.find((f) => f.name === cname) ??
      candidates.find((f) => f.name.startsWith(`${cname} (`) || optionName(f) === cname || optionName(f).startsWith(`${cname} (`)) ??
      candidates.find((f) => f.description?.includes(cname)) ??
      (ownerRaw && built.get(ownerRaw)) ??
      classFeatures[0];
    if (!owner) continue;
    const id = `${classId}.${slug(cname)}`;
    owner.resources = [
      ...(owner.resources ?? []),
      { id, name: cname, max: { table: { by: classId, values } }, ...(rows[0]!.reset === "S" ? { shortRest: "all" as const } : {}), longRest: "all" },
    ];
    owner.widgets = [...(owner.widgets ?? []), { widget: "resource", ref: id, props: Math.max(...values) <= 6 ? { style: "pips" } : {} }];
  }

  /* --- incantesimi --- */
  const abilityName = val(n, "spellAbility").toLowerCase();
  const castAbility = ABILITY_BY_NAME[abilityName];
  const table = (optional: boolean) => {
    const rows = slotRows.filter((r) => r.optional === optional).sort((a, b) => a.level - b.level);
    if (!rows.length) return undefined;
    const cantrips: number[] = [];
    for (let lv = 1, cur = 0; lv <= 20; lv++) {
      const r = rows.find((x) => x.level === lv);
      if (r) cur = r.values[0] ?? 0;
      cantrips.push(cur);
    }
    const at = (lv: number) => rows.filter((x) => x.level <= lv).at(-1)?.values.slice(1) ?? [];
    return { cantrips, first: rows[0]!.level, maxAt5: at(5).filter((x) => x > 0).length, maxAt20: at(20).filter((x) => x > 0).length };
  };
  const prepared = (id: string, ability: Ability): number[] | Value =>
    SPELLS_KNOWN[id] ?? { max: [1, { sum: [HALF_PREPARED.has(id) ? { div: [{ level: id }, 2] } : { level: id }, { mod: ability }] }] };

  let spellcasting: SpellcastingDef | undefined;
  const own = table(false);
  if (own && castAbility) {
    const pact = kid(n, "slotsReset") !== undefined;
    spellcasting = {
      ability: castAbility,
      progression: pact ? "pact" : own.maxAt5 >= 3 ? "full" : "half",
      list: classId,
      prepared: prepared(classId, castAbility),
      ...(own.cantrips.some((c) => c > 0) ? { cantrips: own.cantrips } : {}),
      ...(own.first > 1 ? { fromLevel: own.first } : {}),
      changeOn: SPELLS_KNOWN[classId] ? "levelUp" : "longRest",
      ...(classId === "wizard" ? { spellbook: true } : {}),
    };
  }
  const subTable = table(true);

  const subclasses: SubclassDef[] = [...subNames.entries()].map(([sub, info]) => {
    const b = body(info.intro.node);
    const features = subFeatures.get(sub) ?? [];
    const def: SubclassDef = { id: `${classId}.${slug(sub)}`, classId, name: sub, features };
    if (b.text) def.description = b.text;
    if (b.source) def.source = b.source;
    // Le sottoclassi che danno incantesimi a una classe che non ne ha (un terzo della progressione).
    if (!spellcasting && subTable && castAbility && features.some((f) => /^Spellcasting$/i.test(f.name))) {
      def.spellcasting = { ability: castAbility, progression: "third", list: "wizard", cantrips: subTable.cantrips, prepared: THIRD_CASTER_KNOWN, fromLevel: subTable.first, changeOn: "levelUp" };
    }
    return def;
  });
  ctx.stats.subclasses[name] = subclasses.map((s) => s.name);

  const mc = MULTICLASS[classId];
  if (!mc) ctx.stats.warnings.push(`${name}: requisiti del multiclasse non noti, da inserire a mano.`);
  const cls: ClassDef = {
    id: classId,
    name,
    hitDie: `d${hd}` as ClassDef["hitDie"],
    primaryAbility: mc?.primary ?? [],
    ...(mc?.all ? { primaryAbilityAll: true } : {}),
    proficiencies: { saves, armor, weapons, tools },
    multiclassProficiencies: mc?.prof ?? {},
    skillChoice: { count: Number(val(n, "numSkills")) || 0, from: skillList },
    subclassLevel,
    ...(spellcasting ? { spellcasting } : {}),
    features: classFeatures,
  };
  return { cls, subclasses, options };
}

/* ------------------------------------------------------------------ */
/* Specie, background, talenti                                         */
/* ------------------------------------------------------------------ */

const SIZES: Record<string, string> = { T: "Tiny", S: "Small", M: "Medium", L: "Large", H: "Huge", G: "Gargantuan" };
const LORE_TRAITS = new Set(["description", "age", "alignment", "size"]);

function traitFeatures(n: XmlNode, ctx: Ctx, idPrefix: string): { features: Feature[]; description?: string; source?: string } {
  const used = new Set<string>();
  const features: Feature[] = [];
  const lore: string[] = [];
  let source: string | undefined;
  for (const t of kids(n, "trait")) {
    const tname = val(t, "name");
    const b = body(t);
    source ??= b.source;
    if (LORE_TRAITS.has(tname.toLowerCase())) {
      if (b.text) lore.push(tname.toLowerCase() === "description" ? b.text : `${tname}. ${b.text}`);
      continue;
    }
    const feature: Feature = { id: uniqueId(used, `${idPrefix}.${slug(tname)}`), name: tname };
    if (b.text) feature.description = b.text;
    const effects = effectsOf(t, ctx, tname);
    const dark = /darkvision/i.test(tname) ? b.text.match(/(\d+)\s*feet/) : null;
    if (dark) effects.push({ type: "sense", sense: "darkvision", range: Number(dark[1]) });
    if (effects.length) feature.effects = effects;
    features.push(feature);
  }
  return { features, description: lore.join("\n\n") || undefined, source };
}

function importRace(n: XmlNode, ctx: Ctx, used: Set<string>): SpeciesDef {
  const name = val(n, "name");
  const id = uniqueId(used, slug(name));
  const t = traitFeatures(n, ctx, id);
  const effects: Effect[] = effectsOf(n, ctx, name);
  for (const part of list(val(n, "ability"))) {
    const m = part.match(/^(\w+)\s*([+-]?\d+)$/);
    const ab = m ? ABILITY_BY_NAME[m[1]!.toLowerCase()] : undefined;
    if (ab) effects.push({ type: "bonus", target: `ability.${ab}`, value: Number(m![2]), label: name });
  }
  if (effects.length) t.features.unshift({ id: `${id}.ability-scores`, name: "Aumento dei punteggi di caratteristica", effects });
  return { id, name, size: SIZES[val(n, "size")] ?? "Medium", speed: Number(val(n, "speed")) || 30, features: t.features, ...(t.description ? { description: t.description } : {}), ...(t.source ? { source: t.source } : {}) };
}

function importBackground(n: XmlNode, ctx: Ctx, used: Set<string>): BackgroundDef {
  const name = val(n, "name");
  const id = uniqueId(used, slug(name));
  const t = traitFeatures(n, ctx, `bg.${id}`);
  const skills = list(val(n, "proficiency")).map(slug).filter((s) => SKILL_IDS.has(s));
  return { id, name, skills, features: t.features, ...(t.description ? { description: t.description } : {}), ...(t.source ? { source: t.source } : {}) };
}

function importFeat(n: XmlNode, ctx: Ctx, used: Set<string>): FeatDef {
  const name = val(n, "name");
  const id = uniqueId(used, slug(name));
  const b = body(n);
  const effects = effectsOf(n, ctx, name);
  const pre = val(n, "prerequisite");
  return {
    id,
    name,
    category: "general",
    ...(pre ? { prerequisiteText: pre } : {}),
    ...(b.source ? { source: b.source } : {}),
    feature: { id: `feat.${id}`, name, ...(b.text ? { description: b.text } : {}), ...(effects.length ? { effects } : {}) },
  };
}

/* ------------------------------------------------------------------ */
/* Incantesimi                                                         */
/* ------------------------------------------------------------------ */

const SCHOOLS: Record<string, SpellDef["school"]> = { A: "abjuration", C: "conjuration", D: "divination", EN: "enchantment", EV: "evocation", I: "illusion", N: "necromancy", T: "transmutation" };
const DAMAGE_TYPES = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];

function importSpell(n: XmlNode, ctx: Ctx, used: Set<string>): SpellDef {
  const name = val(n, "name");
  const b = body(n);
  const id = uniqueId(used, slug(name), b.source);
  const level = Number(val(n, "level")) || 0;
  const time = val(n, "time");
  const duration = val(n, "duration");
  // "Fighter (Eldritch Knight)" -> lista "fighter.eldritch-knight"; "Wizard" -> "wizard".
  const lists = [...new Set(list(val(n, "classes")).map((c) => {
    const m = c.match(/^(.*?)\s*\((.+)\)$/);
    return m ? `${slug(m[1]!)}.${slug(m[2]!)}` : slug(c);
  }))];

  const paras = b.text.split("\n");
  const hi = paras.findIndex((p) => /^\s*At Higher Levels[.:]/i.test(p));
  const description = (hi < 0 ? paras : paras.slice(0, hi)).join("\n").trim();
  const higher = hi < 0 ? "" : paras.slice(hi).join("\n").replace(/^\s*At Higher Levels[.:]\s*/i, "").trim();

  const spell: SpellDef = {
    id,
    name,
    level,
    school: SCHOOLS[val(n, "school")] ?? "evocation",
    castingTime: time,
    timing: /^1 bonus action/i.test(time) ? "bonus" : /^1 action/i.test(time) ? "action" : /^1 reaction/i.test(time) ? "reaction" : "special",
    range: val(n, "range"),
    components: val(n, "components"),
    duration,
    lists,
    description,
  };
  if (/^concentration/i.test(duration)) spell.concentration = true;
  if (val(n, "ritual") === "YES") spell.ritual = true;
  if (higher) spell.higherLevels = higher;
  if (/ranged spell attack/i.test(description)) spell.attack = "ranged";
  else if (/melee spell attack/i.test(description)) spell.attack = "melee";
  const save = description.match(/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) saving throw/);
  if (save) spell.save = ABILITY_BY_NAME[save[1]!.toLowerCase()];

  // Tiro principale: il primo <roll>, se nel testo è un danno o una cura riconoscibile.
  const first = kids(n, "roll")[0]?.text.replace(/\s+/g, "");
  if (first && /^\d+d\d+([+-]\d+)?$/.test(first)) {
    const dice = first.replace(/[+-]\d+$/, "");
    const esc = dice.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const dmg = description.match(new RegExp(`${esc}(?:\\s*[+-]\\s*\\d+)? (${DAMAGE_TYPES.join("|")}) damage`, "i"));
    const heal = new RegExp(`regains? (?:a number of )?hit points equal to ${esc}`, "i").test(description);
    const up = higher.match(/(?:increases|increase) by (\d+d\d+) for each slot level above/i);
    if (heal) {
      spell.roll = { kind: "heal", dice: first, ...(/\+ your spellcasting ability modifier/i.test(description) ? { addMod: true } : {}) };
    } else if (dmg) {
      spell.roll = { kind: "damage", dice: first, damageType: dmg[1]!.toLowerCase() };
    }
    if (spell.roll) {
      if (up) spell.roll.perSlotLevel = up[1];
      if (level === 0 && /damage increases by \d+d\d+ when you reach 5th level/i.test(b.text)) spell.roll.cantripScaling = true;
    }
  }
  void ctx;
  return spell;
}

/* ------------------------------------------------------------------ */
/* Oggetti                                                             */
/* ------------------------------------------------------------------ */

const DMG_TYPE: Record<string, "bludgeoning" | "piercing" | "slashing"> = { B: "bludgeoning", P: "piercing", S: "slashing" };
const PROPS: Record<string, WeaponProperty> = { F: "finesse", H: "heavy", L: "light", LD: "loading", R: "reach", T: "thrown", "2H": "two-handed", V: "versatile", A: "ammunition" };
const GEAR: Record<string, string> = { A: "ammunition", G: "gear", $: "money", P: "potion", RD: "rod", RG: "ring", SC: "scroll", ST: "staff", W: "wondrous", WD: "wand" };

function importItem(n: XmlNode, ctx: Ctx, used: Set<string>): ItemDef {
  const name = val(n, "name");
  const b = body(n);
  const id = uniqueId(used, slug(name), b.source);
  const type = val(n, "type");
  const detail = val(n, "detail");
  const info = {
    ...(b.text ? { description: b.text } : {}),
    ...(val(n, "weight") ? { weight: Number(val(n, "weight")) } : {}),
    ...(val(n, "value") ? { value: Number(val(n, "value")) } : {}),
    ...(val(n, "magic") === "YES" || val(n, "magic") === "1" ? { magic: true } : {}),
    ...(detail ? { rarity: detail.replace(/\s*\(requires attunement.*\)/i, "").trim() } : {}),
    ...(/requires attunement/i.test(detail) ? { attunement: true } : {}),
    ...(b.source ? { source: b.source } : {}),
  };
  void ctx;
  if (type === "M" || type === "R") {
    const codes = list(val(n, "property"));
    const range = val(n, "range").match(/^(\d+)\/(\d+)$/);
    return {
      id,
      name,
      kind: "weapon",
      category: codes.includes("M") ? "martial" : "simple",
      range: type === "R" ? "ranged" : "melee",
      damage: val(n, "dmg1") || "1",
      damageType: DMG_TYPE[val(n, "dmgType")] ?? "bludgeoning",
      properties: codes.map((c) => PROPS[c]).filter((p): p is WeaponProperty => !!p),
      ...(val(n, "dmg2") ? { versatile: val(n, "dmg2") } : {}),
      ...(range ? { rangeFt: [Number(range[1]), Number(range[2])] as [number, number] } : {}),
      ...info,
    };
  }
  if (type === "LA" || type === "MA" || type === "HA") {
    const str = Number(val(n, "strength"));
    return {
      id,
      name,
      kind: "armor",
      category: type === "LA" ? "light" : type === "MA" ? "medium" : "heavy",
      baseAC: Number(val(n, "ac")) || 10,
      dexCap: type === "LA" ? null : type === "MA" ? 2 : 0,
      ...(str ? { strength: str } : {}),
      ...(val(n, "stealth") === "1" || val(n, "stealth") === "YES" ? { stealthDisadvantage: true } : {}),
      ...info,
    };
  }
  if (type === "S") return { id, name, kind: "shield", bonus: Number(val(n, "ac")) || 2, ...info };
  return { id, name, kind: "gear", category: GEAR[type] ?? "gear", ...info };
}

/* ------------------------------------------------------------------ */
/* Mostri                                                              */
/* ------------------------------------------------------------------ */

function monsterEntries(n: XmlNode, tag: string): MonsterEntry[] {
  return kids(n, tag).map((e) => {
    const atk = val(e, "attack").split("|");
    const bonus = Number(atk[1]);
    const entry: MonsterEntry = { name: val(e, "name"), text: body(e).text };
    if (atk.length >= 3 && atk[1] !== "" && !Number.isNaN(bonus) && atk[2]) entry.attack = { bonus, damage: atk[2].replace(/\s+/g, "") };
    return entry;
  });
}

const bonusMap = (s: string, keyOf: (k: string) => string | undefined): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const part of list(s)) {
    const m = part.match(/^(.*?)\s*([+-]\s*\d+)$/);
    const key = m ? keyOf(m[1]!.trim()) : undefined;
    if (key) out[key] = Number(m![2]!.replace(/\s+/g, ""));
  }
  return out;
};

function importMonster(n: XmlNode, ctx: Ctx, used: Set<string>): MonsterDef {
  const name = val(n, "name");
  const traits = monsterEntries(n, "trait");
  const srcIdx = traits.findIndex((t) => t.name === "Source");
  const source = srcIdx >= 0 ? traits.splice(srcIdx, 1)[0]!.text : undefined;
  const id = uniqueId(used, slug(name), source);
  const acM = val(n, "ac").match(/^(\d+)\s*(?:\((.*)\))?/);
  const hpM = val(n, "hp").match(/^(\d+)\s*(?:\((.*)\))?/);
  const num = (t: string) => Number(val(n, t)) || 10;
  const saves = bonusMap(val(n, "save"), (k) => ABILITY_BY_NAME[k.toLowerCase()]);
  const skills = bonusMap(val(n, "skill"), (k) => (SKILL_IDS.has(slug(k)) ? slug(k) : undefined));
  const opt = (key: string, tag: string) => (val(n, tag) ? { [key]: val(n, tag) } : {});
  const entries = (key: string, tag: string) => {
    const e = monsterEntries(n, tag);
    return e.length ? { [key]: e } : {};
  };
  void ctx;
  return {
    id,
    name,
    size: SIZES[val(n, "size")] ?? val(n, "size"),
    type: val(n, "type"),
    ...opt("alignment", "alignment"),
    ac: Number(acM?.[1]) || 10,
    ...(acM?.[2] ? { acNote: acM[2] } : {}),
    hp: Number(hpM?.[1]) || 1,
    ...(hpM?.[2] ? { hpFormula: hpM[2].replace(/\s+/g, "") } : {}),
    speed: val(n, "speed"),
    abilities: { str: num("str"), dex: num("dex"), con: num("con"), int: num("int"), wis: num("wis"), cha: num("cha") },
    ...(Object.keys(saves).length ? { saves } : {}),
    ...(Object.keys(skills).length ? { skills } : {}),
    ...opt("resistances", "resist"),
    ...opt("vulnerabilities", "vulnerable"),
    ...opt("immunities", "immune"),
    ...opt("conditionImmunities", "conditionImmune"),
    ...opt("senses", "senses"),
    ...(val(n, "passive") ? { passivePerception: Number(val(n, "passive")) } : {}),
    ...opt("languages", "languages"),
    cr: val(n, "cr") || "0",
    traits,
    actions: monsterEntries(n, "action"),
    ...entries("reactions", "reaction"),
    ...entries("legendary", "legendary"),
    ...opt("environment", "environment"),
    ...(source ? { source } : {}),
  } as MonsterDef;
}

/* ------------------------------------------------------------------ */

/** Valori per livello 1-20 a partire dalle soglie: steps({ 3: 2, 10: 3 }) = 0, 0, 2, 2, ... 3, ... */
function steps(at: Record<number, number>): number[] {
  const out: number[] = [];
  for (let lv = 1, cur = 0; lv <= 20; lv++) out.push((cur = at[lv] ?? cur));
  return out;
}

/**
 * Quante opzioni si scelgono, per livello di classe: il compendio non lo dice in forma strutturata.
 * "list" indica le opzioni che il compendio registra come incantesimi di una lista fittizia:
 * diventano opzioni del privilegio, come gli stili di combattimento.
 */
const OPTION_RULES: { feature: string; by: string; count: Record<number, number>; list?: string; prefix?: RegExp }[] = [
  { feature: "sorcerer.metamagic", by: "sorcerer", count: { 3: 2, 10: 3, 17: 4 } },
  { feature: "warlock.eldritch-invocations", by: "warlock", count: { 2: 2, 5: 3, 7: 4, 9: 5, 12: 6, 15: 7, 18: 8 }, list: "eldritch-invocations", prefix: /^Invocation:\s*/ },
  { feature: "artificer.infuse-item", by: "artificer", count: { 2: 4, 6: 6, 10: 8, 14: 10, 18: 12 }, list: "artificer-infusions", prefix: /^Infusion:\s*/ },
  { feature: "fighter.battle-master.combat-superiority", by: "fighter", count: { 3: 3, 7: 5, 10: 7, 15: 9 }, list: "maneuvers" },
  { feature: "fighter.arcane-archer.arcane-shot", by: "fighter", count: { 3: 2, 7: 3, 10: 4, 15: 5, 18: 6 }, list: "fighter.arcane-archer" },
  // Sintonia Elementale più una disciplina al 3° livello, poi una in più a ogni soglia.
  { feature: "monk.way-of-the-four-elements.disciple-of-the-elements", by: "monk", count: { 3: 2, 6: 3, 11: 4, 17: 5 }, list: "monk.way-of-the-four-elements" },
];

function applyOptionRules(pack: ContentPack, stats: ImportStats) {
  const features = [...(pack.classes ?? []), ...(pack.subclasses ?? [])].flatMap((c) => c.features);
  for (const rule of OPTION_RULES) {
    const parent = features.find((f) => f.id === rule.feature);
    if (!parent) continue; // compendio senza quella classe
    const tag = `opt:${parent.id}`;
    const count: Value = { table: { by: rule.by, values: steps(rule.count) } };
    const existing = parent.choices?.find((c) => c.from && !Array.isArray(c.from) && c.from.tag === tag);
    if (existing) existing.count = count;
    else parent.choices = [...(parent.choices ?? []), { id: parent.id, kind: "feat", label: parent.name, count, from: { tag } }];
    if (!rule.list) continue;
    const moved = (pack.spells ?? []).filter((s) => s.lists.includes(rule.list!));
    pack.spells = (pack.spells ?? []).filter((s) => !moved.includes(s));
    for (const s of moved) {
      // "Infusion: Helm of Awareness (Level 10)" -> nome pulito e livello minimo.
      let name = rule.prefix ? s.name.replace(rule.prefix, "") : s.name;
      const inName = name.match(/\s*\(Level (\d+)\)$/);
      if (inName) name = name.slice(0, inName.index);
      const prereq = s.description.match(/^Prerequisite:\s*(.+)$/m)?.[1];
      const level = Number(inName?.[1] ?? prereq?.match(/(\d+)(?:st|nd|rd|th) level/)?.[1]) || 0;
      const id = `${parent.id}.${slug(name)}`;
      (pack.feats ??= []).push({
        id,
        name,
        category: "option",
        tags: [tag],
        ...(prereq ? { prerequisiteText: prereq } : {}),
        ...(level ? { prerequisites: { minLevel: { by: rule.by, level } } } : {}),
        feature: { id: `feat.${id}`, name: `${parent.name}: ${name}`, description: s.description },
      });
    }
    stats.counts[`options:${rule.list}`] = moved.length;
  }
}

/**
 * Il compendio ripete alcuni incantesimi in una seconda voce che serve solo ad aggiungere liste
 * (di dominio, di giuramento...): resta la prima voce, con le liste di tutte.
 */
function mergeSameName(spells: SpellDef[]): SpellDef[] {
  const byName = new Map<string, SpellDef>();
  for (const s of spells) {
    // La voce ripetuta porta un asterisco in fondo al nome.
    const name = s.name.replace(/\*+$/, "").trim();
    const first = byName.get(name);
    if (first) first.lists = [...new Set([...first.lists, ...s.lists])];
    else byName.set(name, s);
  }
  return [...byName.values()];
}

export interface ImportOptions {
  id: string;
  name: string;
  ruleset?: "2014" | "2024";
}

export function importCompendium(xml: string, opts: ImportOptions): { pack: ContentPack; stats: ImportStats } {
  const root = parseXml(xml);
  const comp = kid(root, "compendium");
  if (!comp) throw new Error("Non è un compendio: manca l'elemento <compendium>.");
  const stats: ImportStats = { counts: {}, unmappedModifiers: {}, subclasses: {}, warnings: [] };
  const ctx: Ctx = { stats };
  const named = (tag: string) => kids(comp, tag).filter((n) => val(n, "name"));

  const classIds = new Set<string>();
  const classes: ClassDef[] = [];
  const subclasses: SubclassDef[] = [];
  const feats: FeatDef[] = [ASI_FEAT];
  for (const n of named("class")) {
    const r = importClass(n, ctx, classIds);
    classes.push(r.cls);
    subclasses.push(...r.subclasses);
    feats.push(...r.options);
  }
  const each = <T>(tag: string, fn: (n: XmlNode, ctx: Ctx, used: Set<string>) => T): T[] => {
    const used = new Set<string>();
    return named(tag).map((n) => fn(n, ctx, used));
  };
  const featIds = new Set(feats.map((f) => f.id));
  feats.push(...named("feat").map((n) => importFeat(n, ctx, featIds)));

  const pack: ContentPack = {
    id: opts.id,
    name: opts.name,
    ruleset: opts.ruleset ?? "2014",
    classes,
    subclasses,
    species: each("race", importRace),
    backgrounds: each("background", importBackground),
    feats,
    items: each("item", importItem),
    skills: SKILLS_2014,
    spells: mergeSameName(each("spell", importSpell)),
    monsters: each("monster", importMonster),
  };
  applyOptionRules(pack, stats);
  stats.mechanics = applyMechanics(pack);
  for (const k of ["classes", "subclasses", "species", "backgrounds", "feats", "items", "spells", "monsters"] as const) stats.counts[k] = pack[k]?.length ?? 0;
  return { pack, stats };
}
