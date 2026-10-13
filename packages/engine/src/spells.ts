import { formatDice, parseDice } from "./dice.js";
import type { Registry } from "./registry.js";
import type {
  Ability,
  CasterProgression,
  CharacterData,
  ComputedSpell,
  ComputedSpellSource,
  ComputedSpellcasting,
  GrantedSpell,
  Issue,
  Part,
  SlotPool,
  SpellDef,
  SpellRollDef,
  Stat,
} from "./types.js";

export const ABILITY_NAMES: Record<Ability, string> = {
  str: "Forza",
  dex: "Destrezza",
  con: "Costituzione",
  int: "Intelligenza",
  wis: "Saggezza",
  cha: "Carisma",
};

/** Slot per livello di incantatore (riga 0 = livello 1); le colonne sono gli slot dal 1° al 9°. */
export const SPELL_SLOTS: readonly (readonly number[])[] = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Magia del Patto per livello da Warlock: numero di slot e loro livello. */
export const PACT_MAGIC: readonly { slots: number; level: number }[] = [
  { slots: 1, level: 1 },
  { slots: 2, level: 1 },
  { slots: 2, level: 2 },
  { slots: 2, level: 2 },
  { slots: 2, level: 3 },
  { slots: 2, level: 3 },
  { slots: 2, level: 4 },
  { slots: 2, level: 4 },
  { slots: 2, level: 5 },
  { slots: 2, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 4, level: 5 },
  { slots: 4, level: 5 },
  { slots: 4, level: 5 },
  { slots: 4, level: 5 },
];

/**
 * Quanto contano i livelli di una classe nel livello da incantatore.
 * Da soli si segue la tabella della classe (un terzo arrotonda per eccesso);
 * nel multiclasse la regola dice: metà per eccesso, un terzo per difetto.
 */
export function casterLevelOf(progression: CasterProgression, classLevel: number, multiclass: boolean): number {
  switch (progression) {
    case "full":
      return classLevel;
    case "half":
      return Math.ceil(classLevel / 2);
    case "third":
      return multiclass ? Math.floor(classLevel / 3) : Math.ceil(classLevel / 3);
    case "pact":
      return 0;
  }
}

export function slotsForCasterLevel(level: number): number[] {
  if (level < 1) return [];
  return [...SPELL_SLOTS[Math.min(20, level) - 1]!];
}

export function pactMagicAt(warlockLevel: number): { slots: number; level: number } {
  return PACT_MAGIC[Math.min(20, Math.max(1, warlockLevel)) - 1]!;
}

function tableAt(values: number[] | undefined, level: number): number {
  if (!values?.length || level < 1) return 0;
  return values[Math.min(level, values.length) - 1] ?? 0;
}

/** Incantesimi di una lista, fino a un certo livello, ordinati per livello e nome. */
export function spellsForList(reg: Registry, list: string, maxLevel = 9): SpellDef[] {
  return [...reg.spells.values()]
    .filter((s) => s.lists.includes(list) && s.level <= maxLevel)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, "it"));
}

/** Dadi del tiro di un incantesimo, con slot superiore, crescita dei trucchetti e modificatore. */
export function spellDice(
  def: SpellRollDef,
  o: { spellLevel: number; slotLevel?: number; characterLevel: number; mod: number },
): string {
  const p = parseDice(def.dice);
  if (def.cantripScaling) {
    const tier = 1 + (o.characterLevel >= 5 ? 1 : 0) + (o.characterLevel >= 11 ? 1 : 0) + (o.characterLevel >= 17 ? 1 : 0);
    for (const d of p.dice) d.count *= tier;
  }
  const extra = (o.slotLevel ?? o.spellLevel) - o.spellLevel;
  if (def.perSlotLevel && extra > 0) {
    const per = parseDice(def.perSlotLevel);
    for (const d of per.dice) {
      const same = p.dice.find((x) => x.sides === d.sides && x.sign === d.sign);
      if (same) same.count += d.count * extra;
      else p.dice.push({ ...d, count: d.count * extra });
    }
    p.flat += per.flat * extra;
  }
  if (def.addMod) p.flat += o.mod;
  return formatDice(p);
}

export interface SpellcastingEnv {
  ch: CharacterData;
  reg: Registry;
  classLevels: Record<string, number>;
  totalLevel: number;
  proficiencyBonus: number;
  mods: Record<Ability, number>;
  d20Penalty: number;
  /** Incantesimi concessi dai privilegi attivi, con la classe a cui il privilegio appartiene. */
  granted: { spell: GrantedSpell; classId?: string; featureId: string; featureName: string }[];
  bonusParts: (...targets: string[]) => Part[];
  stat: (path: string, parts: Part[]) => Stat;
  /** false in automazione manuale: nessun controllo di regola. */
  validate: boolean;
  issues: Issue[];
}

interface Caster {
  id: string;
  name: string;
  ability: Ability;
  dc: number;
  attack: number;
}

export function computeSpellcasting(env: SpellcastingEnv): ComputedSpellcasting | undefined {
  const { ch, reg, classLevels, mods, proficiencyBonus, issues } = env;
  const sources: ComputedSpellSource[] = [];
  const shared: { progression: CasterProgression; level: number }[] = [];
  let pact: SlotPool | undefined;
  const sum = (parts: Part[]) => parts.reduce((a, p) => a + p.value, 0);

  for (const [classId, lvl] of Object.entries(classLevels)) {
    const cls = reg.classes.get(classId);
    if (!cls) continue;
    const sub = lvl >= cls.subclassLevel ? reg.subclasses.get(ch.subclasses[classId] ?? "") : undefined;
    const def = cls.spellcasting ?? sub?.spellcasting;
    if (!def || lvl < (def.fromLevel ?? 1)) continue;

    const abilityPart = { label: ABILITY_NAMES[def.ability], value: mods[def.ability] };
    const profPart = { label: "Competenza", value: proficiencyBonus };
    const attackParts: Part[] = [profPart, abilityPart, ...env.bonusParts("spell.attack")];
    if (env.d20Penalty) attackParts.push({ label: "Indebolimento", value: -env.d20Penalty });

    let maxSpellLevel: number;
    if (def.progression === "pact") {
      const pm = pactMagicAt(lvl);
      const spent = Math.min(pm.slots, Math.max(0, ch.state.pactSlotsSpent ?? 0));
      pact = { level: pm.level, max: pm.slots, spent, remaining: pm.slots - spent };
      maxSpellLevel = pm.level;
    } else {
      shared.push({ progression: def.progression, level: lvl });
      // Si prepara come se si avesse solo questa classe, anche nel multiclasse.
      maxSpellLevel = slotsForCasterLevel(casterLevelOf(def.progression, lvl, false)).length;
    }

    const sel = ch.spells?.[classId];
    sources.push({
      id: classId,
      name: cls.name,
      ability: def.ability,
      progression: def.progression,
      list: def.list,
      saveDC: env.stat(`spell.dc.${classId}`, [{ label: "Base", value: 8 }, profPart, abilityPart, ...env.bonusParts("spell.dc")]),
      attackBonus: env.stat(`spell.attack.${classId}`, attackParts),
      cantripsMax: tableAt(def.cantrips, lvl),
      preparedMax: tableAt(def.prepared, lvl),
      maxSpellLevel,
      cantrips: sel?.cantrips ?? [],
      prepared: sel?.prepared ?? [],
      changeOn: def.changeOn,
      spellbook: !!def.spellbook,
    });
  }

  /* --- slot condivisi --- */
  const casterLevel =
    shared.length === 1
      ? casterLevelOf(shared[0]!.progression, shared[0]!.level, false)
      : shared.reduce((a, s) => a + casterLevelOf(s.progression, s.level, true), 0);
  const table = slotsForCasterLevel(casterLevel);
  const slots: SlotPool[] = [];
  for (let level = 1; level <= 9; level++) {
    // Agli slot della tabella si sommano quelli creati (es. con i Punti Stregoneria).
    const max = (table[level - 1] ?? 0) + Math.max(0, ch.state.spellSlotsBonus?.[String(level)] ?? 0);
    if (max <= 0) continue;
    const spent = Math.min(max, Math.max(0, ch.state.spellSlotsSpent?.[String(level)] ?? 0));
    slots.push({ level, max, spent, remaining: max - spent });
  }

  /* --- incantesimi disponibili --- */
  const spells: ComputedSpell[] = [];
  const add = (spellId: string, c: Caster, always: boolean, resource?: string) => {
    const sp = reg.spells.get(spellId);
    if (!sp) {
      if (env.validate) issues.push({ severity: "warning", code: "spell.unknown", message: `Incantesimo sconosciuto: ${spellId}.` });
      return;
    }
    if (spells.some((x) => x.spellId === spellId && x.sourceId === c.id)) return;
    spells.push({
      spellId,
      name: sp.name,
      level: sp.level,
      school: sp.school,
      sourceId: c.id,
      sourceName: c.name,
      ability: c.ability,
      always,
      concentration: !!sp.concentration,
      ritual: !!sp.ritual,
      castingTime: sp.castingTime,
      range: sp.range,
      attackBonus: sp.attack ? c.attack : undefined,
      save: sp.save,
      saveDC: sp.save ? c.dc : undefined,
      roll: sp.roll
        ? spellDice(sp.roll, { spellLevel: sp.level, characterLevel: env.totalLevel, mod: mods[c.ability] })
        : undefined,
      resource,
    });
  };
  const casterOf = (s: ComputedSpellSource): Caster => ({
    id: s.id,
    name: s.name,
    ability: s.ability,
    dc: s.saveDC.value,
    attack: s.attackBonus.value,
  });

  // Prima quelli concessi dai privilegi: sono "sempre preparati" e vincono sui doppioni.
  for (const g of env.granted) {
    const { spell: gs } = g;
    if (gs.minLevel) {
      const have = gs.minLevel.by === "total" ? env.totalLevel : classLevels[gs.minLevel.by] ?? 0;
      if (have < gs.minLevel.level) continue;
    }
    const src = gs.ability ? undefined : sources.find((s) => s.id === (gs.source ?? g.classId));
    if (src) {
      add(gs.spellId, casterOf(src), true, gs.resource);
    } else if (gs.ability) {
      const mod = mods[gs.ability];
      add(
        gs.spellId,
        {
          id: g.featureId,
          name: g.featureName,
          ability: gs.ability,
          dc: 8 + proficiencyBonus + mod + sum(env.bonusParts("spell.dc")),
          attack: proficiencyBonus + mod + sum(env.bonusParts("spell.attack")) - env.d20Penalty,
        },
        true,
        gs.resource,
      );
    } else if (env.validate) {
      issues.push({ severity: "warning", code: "spell.nosource", message: `${g.featureName}: nessuna classe con cui lanciare ${gs.spellId}.` });
    }
  }

  for (const s of sources) {
    const c = casterOf(s);
    if (env.validate) validateSelection(s, spells, env);
    for (const id of s.cantrips) add(id, c, false);
    for (const id of s.prepared) add(id, c, false);
  }

  if (sources.length === 0 && spells.length === 0) return undefined;
  spells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, "it"));
  return { sources, slots, pact, concentration: ch.state.concentration ?? undefined, spells };
}

/** Controlli sugli incantesimi scelti per una classe: numero, lista, livello. */
function validateSelection(s: ComputedSpellSource, always: ComputedSpell[], env: SpellcastingEnv) {
  const { reg, issues, ch } = env;
  const path = `spells.${s.id}`;
  const err = (code: string, message: string) => issues.push({ severity: "error", code, message, path });
  const warn = (code: string, message: string) => issues.push({ severity: "warning", code, message, path });
  const book = s.spellbook ? ch.spells?.[s.id]?.spellbook : undefined;

  if (s.cantrips.length > s.cantripsMax) err("spells.cantrips.excess", `${s.name}: troppi trucchetti (${s.cantrips.length}/${s.cantripsMax}).`);
  if (s.prepared.length > s.preparedMax) err("spells.prepared.excess", `${s.name}: troppi incantesimi preparati (${s.prepared.length}/${s.preparedMax}).`);
  if (new Set([...s.cantrips, ...s.prepared]).size !== s.cantrips.length + s.prepared.length) {
    err("spells.duplicate", `${s.name}: incantesimo ripetuto.`);
  }

  for (const id of s.cantrips) {
    const sp = reg.spells.get(id);
    if (!sp) continue;
    if (sp.level !== 0) err("spells.kind", `${sp.name} non è un trucchetto.`);
    else if (!sp.lists.includes(s.list)) err("spells.list", `${sp.name} non è nella lista da ${s.name}.`);
  }
  for (const id of s.prepared) {
    const sp = reg.spells.get(id);
    if (!sp) continue;
    if (sp.level === 0) err("spells.kind", `${sp.name} è un trucchetto: non si prepara.`);
    else if (!sp.lists.includes(s.list)) err("spells.list", `${sp.name} non è nella lista da ${s.name}.`);
    else if (sp.level > s.maxSpellLevel) err("spells.level", `${sp.name} è di livello ${sp.level}: con ${s.name} arrivi al ${s.maxSpellLevel}.`);
    else if (book && !book.includes(id)) err("spells.spellbook", `${sp.name} non è nel libro degli incantesimi.`);
    if (always.some((a) => a.always && a.spellId === id && a.sourceId === s.id)) {
      warn("spells.redundant", `${sp.name} è già sempre preparato: puoi sceglierne un altro.`);
    }
  }

  const missing: string[] = [];
  if (s.cantrips.length < s.cantripsMax) missing.push(`trucchetti ${s.cantrips.length}/${s.cantripsMax}`);
  if (s.prepared.length < s.preparedMax) missing.push(`preparati ${s.prepared.length}/${s.preparedMax}`);
  if (missing.length) warn("spells.pending", `Incantesimi da scegliere per ${s.name}: ${missing.join(", ")}.`);
}
