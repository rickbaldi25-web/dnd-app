import { AUTOMATION_POLICY, DEFAULT_AUTOMATION } from "./automation.js";
import { parseDice, withFlat } from "./dice.js";
import { featsByTag, must, type Registry } from "./registry.js";
import { computeSpellcasting } from "./spells.js";
import {
  ABILITIES,
  type Ability,
  type ActionDef,
  type ArmorCategory,
  type ArmorDef,
  type AutomationLevel,
  type CharacterData,
  type ChoiceDef,
  type ComputedAttack,
  type ComputedResource,
  type ComputedSheet,
  type Die,
  type Effect,
  type Feature,
  type Issue,
  type Part,
  type ShieldDef,
  type Stat,
  type WeaponDef,
  type WidgetRef,
} from "./types.js";
import { abilityMod, evalCondition, evalValue, proficiencyBonusFor, resolveDice, type EvalContext } from "./values.js";
import { validateCharacter } from "./validate.js";

export interface ComputeOptions {
  /** Livello di automazione già risolto (vedi resolveAutomation). */
  automation?: AutomationLevel;
}

interface ActiveFeature {
  feature: Feature;
  source: string;
  /** Classe a cui appartiene il privilegio (anche tramite la sottoclasse). */
  classId?: string;
}

/** Widget sempre presenti nella scheda, in ordine di default. */
export const CORE_WIDGETS: WidgetRef[] = [
  { widget: "header" },
  { widget: "hp" },
  { widget: "combat-stats" },
  { widget: "abilities" },
  { widget: "saves" },
  { widget: "skills" },
  { widget: "attacks" },
  { widget: "conditions" },
  { widget: "hit-dice" },
  { widget: "death-saves" },
  { widget: "features" },
  { widget: "inventory" },
  { widget: "notes" },
];

export const EXHAUSTION_D20_PENALTY = 2; // regole 2024: −2 ai tiri di d20 per livello
export const EXHAUSTION_SPEED_PENALTY = 5; // −5 ft di velocità per livello

export function classLevelsOf(ch: CharacterData): Record<string, number> {
  const out: Record<string, number> = {};
  for (const l of ch.levels) out[l.classId] = (out[l.classId] ?? 0) + 1;
  return out;
}

const dieSize = (d: Die) => parseInt(d.slice(1), 10);
export const averageHitDie = (d: Die) => dieSize(d) / 2 + 1;

/** Una scelta raccolta, con il privilegio (e la classe) da cui viene. */
export type CollectedChoice = ChoiceDef & { source: string; classId?: string; featureId?: string; featureName?: string };

/**
 * Un talento ripetibile preso da una certa scelta: id e scelte interne prendono
 * il nome di quella scelta, così due Aumenti di Caratteristica non si pestano i piedi.
 */
function scopeFeature(f: Feature, scope: string): Feature {
  return { ...f, id: `${f.id}@${scope}`, choices: f.choices?.map((c) => ({ ...c, id: `${scope}/${c.id}` })) };
}

/** Raccoglie privilegi attivi (specie, classi, sottoclassi, talenti, homebrew) e le scelte implicite. */
export function collectFeatures(ch: CharacterData, reg: Registry, classLevels: Record<string, number>) {
  const active: ActiveFeature[] = [];
  const choices: CollectedChoice[] = [];
  const firstClassId = ch.levels[0]?.classId;

  const species = must(reg.species, ch.speciesId, "Specie");
  for (const f of species.features) active.push({ feature: f, source: species.name });

  const bg = must(reg.backgrounds, ch.backgroundId, "Background");
  const bgFeat = bg.featId ? reg.feats.get(bg.featId) : undefined;
  for (const f of bg.features ?? []) active.push({ feature: f, source: bg.name });
  if (bgFeat) active.push({ feature: bgFeat.feature, source: `${bg.name} (talento)` });
  if (bg.toolChoice) {
    choices.push({ id: "background.tool", kind: "tool", label: bg.toolChoice.label, count: 1, from: bg.toolChoice.from, source: bg.name });
  }

  for (const [classId, lvl] of Object.entries(classLevels)) {
    const cls = must(reg.classes, classId, "Classe");
    if (classId === firstClassId) {
      choices.push({
        id: `${classId}.skills`,
        kind: "skill",
        label: `Abilità di classe (${cls.name})`,
        count: cls.skillChoice.count,
        from: cls.skillChoice.from,
        source: cls.name,
      });
    }
    if (cls.weaponMasteries !== undefined) {
      choices.push({
        id: `${classId}.weaponMastery`,
        kind: "weaponMastery",
        label: `Maestria nelle armi (${cls.name})`,
        count: cls.weaponMasteries,
        from: cls.weaponMasteryFrom,
        source: cls.name,
      });
    }
    for (const f of cls.features) if ((f.level ?? 1) <= lvl) active.push({ feature: f, source: cls.name, classId });
    if (lvl >= cls.subclassLevel) {
      choices.push({ id: `${classId}.subclass`, kind: "subclass", label: `Sottoclasse (${cls.name})`, count: 1, source: cls.name });
      const subId = ch.subclasses[classId];
      const sub = subId ? reg.subclasses.get(subId) : undefined;
      if (sub) for (const f of sub.features) if ((f.level ?? 1) <= lvl) active.push({ feature: f, source: sub.name, classId });
    }
  }

  for (const f of ch.customFeatures ?? []) active.push({ feature: f, source: "Personalizzato" });

  // Le scelte dei privilegi possono portare talenti, che a loro volta hanno scelte.
  const seenFeats = new Set<string>(bgFeat ? [bgFeat.id] : []);
  for (let i = 0; i < active.length; i++) {
    const { feature, source, classId } = active[i]!;
    for (const c of feature.choices ?? []) {
      choices.push({ ...c, source, classId, featureId: feature.id, featureName: feature.name });
      if (c.kind !== "feat") continue;
      for (const featId of ch.choices[c.id] ?? []) {
        const feat = reg.feats.get(featId);
        if (!feat) continue;
        if (feat.repeatable) {
          active.push({ feature: scopeFeature(feat.feature, c.id), source: `${feature.name}: ${feat.name}`, classId });
          continue;
        }
        if (seenFeats.has(feat.id)) continue;
        seenFeats.add(feat.id);
        active.push({ feature: feat.feature, source: `${feature.name}: ${feat.name}`, classId });
      }
    }
  }

  // Abilità e strumenti scelti diventano concessioni.
  const chosenSkills: string[] = [];
  const chosenTools: string[] = [];
  for (const c of choices) {
    const picked = ch.choices[c.id] ?? [];
    if (c.kind === "skill") chosenSkills.push(...picked);
    if (c.kind === "tool") chosenTools.push(...picked);
  }

  return { active, choices, chosenSkills, chosenTools };
}

function equippedGear(ch: CharacterData, reg: Registry) {
  let armor: ArmorDef | undefined;
  let shield: ShieldDef | undefined;
  const weapons: WeaponDef[] = [];
  for (const e of ch.equipment) {
    if (!e.equipped) continue;
    const item = reg.items.get(e.itemId);
    if (!item) continue;
    if (item.kind === "armor" && !armor) armor = item;
    else if (item.kind === "shield" && !shield) shield = item;
    else if (item.kind === "weapon") weapons.push(item);
  }
  return { armor, shield, weapons };
}

export function computeSheet(ch: CharacterData, reg: Registry, opts: ComputeOptions = {}): ComputedSheet {
  const automation = opts.automation ?? ch.settings.automation ?? DEFAULT_AUTOMATION;
  const policy = AUTOMATION_POLICY[automation];
  const issues: Issue[] = [];

  const classLevels = classLevelsOf(ch);
  const totalLevel = ch.levels.length;
  const proficiencyBonus = proficiencyBonusFor(totalLevel);
  const firstClass = ch.levels[0] ? must(reg.classes, ch.levels[0].classId, "Classe") : undefined;
  const species = must(reg.species, ch.speciesId, "Specie");
  const bg = must(reg.backgrounds, ch.backgroundId, "Background");

  const { active, choices, chosenSkills, chosenTools } = collectFeatures(ch, reg, classLevels);
  const { armor, shield, weapons } = equippedGear(ch, reg);
  const exh = Math.max(0, Math.min(6, ch.state.exhaustion));
  // Indebolimento: nel 2024 toglie 2 a ogni d20 per livello; nel 2014 dà svantaggi a soglie.
  const old = reg.ruleset === "2014";
  const d20Penalty = old ? 0 : exh * EXHAUSTION_D20_PENALTY;

  const stat = (path: string, parts: Part[]): Stat => {
    const computed = parts.reduce((a, p) => a + p.value, 0);
    const ov = ch.overrides[path];
    if (ov !== undefined && !policy.applyOverrides) {
      issues.push({ severity: "info", code: "override.ignored", path, message: `Valore forzato per "${path}" ignorato in automazione completa.` });
    }
    const overridden = ov !== undefined && policy.applyOverrides;
    return { value: overridden ? ov : computed, computed, parts, overridden };
  };

  /* --- contesto preliminare per le caratteristiche --- */
  const baseScores = {} as Record<Ability, number>;
  for (const a of ABILITIES) baseScores[a] = (ch.abilityScores[a] ?? 10) + (ch.backgroundBoosts[a] ?? 0);
  const featureIds = new Set(active.map((x) => x.feature.id));
  const picks = (c: ChoiceDef) => ch.choices[c.id] ?? [];
  const mkCtx = (scores: Record<Ability, number>): EvalContext => {
    const mods = {} as Record<Ability, number>;
    for (const a of ABILITIES) mods[a] = abilityMod(scores[a]);
    return {
      mods,
      scores,
      proficiencyBonus,
      totalLevel,
      classLevels,
      toggles: ch.state.toggles,
      conditions: ch.state.conditions,
      armor: (armor?.category ?? "none") as ArmorCategory | "none",
      shield: !!shield,
      features: featureIds,
    };
  };
  const allEffects: { effect: Effect; source: string }[] = active.flatMap(({ feature, source }) =>
    (feature.effects ?? []).map((effect) => ({ effect, source: feature.name || source })),
  );

  /* --- caratteristiche --- */
  const preCtx = mkCtx(baseScores);
  const boostChoices = choices.filter((c) => c.kind === "abilityBoost");
  const abilities = {} as ComputedSheet["abilities"];
  const finalScores = {} as Record<Ability, number>;
  for (const a of ABILITIES) {
    const parts: Part[] = [{ label: "Base", value: ch.abilityScores[a] ?? 10 }];
    if (ch.backgroundBoosts[a]) parts.push({ label: bg.name, value: ch.backgroundBoosts[a]! });
    let cap = 20;
    for (const c of boostChoices) {
      const n = picks(c).filter((x) => x === a).length;
      if (!n) continue;
      parts.push({ label: c.label, value: n });
      if (c.max) cap = Math.max(cap, c.max);
    }
    // Gli aumenti a scelta si fermano al tetto prima che arrivino i bonus dei privilegi (che possono alzarlo).
    const chosen = sumParts(parts);
    if (chosen > cap) parts.push({ label: `Massimo ${cap}`, value: cap - chosen });
    for (const { effect, source } of allEffects) {
      if (!evalCondition(effect.when, preCtx)) continue;
      if (effect.type === "bonus" && effect.target === `ability.${a}`) {
        parts.push({ label: effect.label ?? source, value: evalValue(effect.value, preCtx) });
      } else if (effect.type === "abilityMax" && effect.ability === a) {
        cap = Math.max(cap, effect.value);
      }
    }
    let s = stat(`ability.${a}`, parts);
    if (!s.overridden && s.value > cap) {
      s = { ...s, value: cap, parts: [...parts, { label: `Massimo ${cap}`, value: cap - s.computed }] };
    }
    finalScores[a] = s.value;
    abilities[a] = { score: s, mod: abilityMod(s.value) };
  }
  const ctx = mkCtx(finalScores);
  const mods = ctx.mods;

  /* --- effetti attivi --- */
  const live = allEffects.filter(({ effect }) => evalCondition(effect.when, ctx));
  const bonusParts = (...targets: string[]): Part[] =>
    live
      .filter(({ effect }) => effect.type === "bonus" && targets.includes(effect.target))
      .map(({ effect, source }) => ({
        label: (effect as Extract<Effect, { type: "bonus" }>).label ?? source,
        value: evalValue((effect as Extract<Effect, { type: "bonus" }>).value, ctx),
      }));
  const grants = (target: Extract<Effect, { type: "grant" }>["target"]) =>
    live.flatMap(({ effect }) => (effect.type === "grant" && effect.target === target ? effect.values : []));
  const advantages = live.flatMap(({ effect, source }) =>
    effect.type === "advantage" ? [{ on: effect.on, label: effect.label ?? source }] : [],
  );
  const hasAdv = (...keys: string[]) => advantages.some((a) => keys.includes(a.on));

  /* --- competenze --- */
  const otherClasses = Object.keys(classLevels).filter((id) => id !== firstClass?.id).map((id) => must(reg.classes, id, "Classe"));
  const armorProf = new Set<string>([
    ...(firstClass?.proficiencies.armor ?? []),
    ...otherClasses.flatMap((c) => c.multiclassProficiencies.armor ?? []),
    ...grants("armor"),
  ]);
  const weaponProf = new Set<string>([
    ...(firstClass?.proficiencies.weapons ?? []),
    ...otherClasses.flatMap((c) => c.multiclassProficiencies.weapons ?? []),
    ...grants("weapon"),
  ]);
  const toolProf = new Set<string>([
    ...(firstClass?.proficiencies.tools ?? []),
    ...(bg.tools ?? []),
    ...chosenTools,
    ...grants("tool"),
  ]);
  const saveProf = new Set<string>([...(firstClass?.proficiencies.saves ?? []), ...grants("save")]);
  const skillProf = new Set<string>([...bg.skills, ...chosenSkills, ...grants("skill")]);
  const expertise = new Set<string>(grants("expertise"));
  for (const c of choices) {
    if (c.kind !== "expertise") continue;
    for (const id of picks(c)) {
      if (!skillProf.has(id) && policy.validation !== "off") {
        issues.push({ severity: "error", code: "expertise.unproficient", path: `choices.${c.id}`, message: `${c.label}: serve la competenza in ${reg.skills.get(id)?.name ?? id}.` });
      }
      expertise.add(id);
    }
  }

  /* --- tiri salvezza --- */
  const saves = {} as ComputedSheet["saves"];
  for (const a of ABILITIES) {
    const proficient = saveProf.has(a);
    const parts: Part[] = [{ label: "Caratteristica", value: mods[a] }];
    if (proficient) parts.push({ label: "Competenza", value: proficiencyBonus });
    parts.push(...bonusParts(`save.${a}`, "save.all"));
    if (d20Penalty) parts.push({ label: "Indebolimento", value: -d20Penalty });
    saves[a] = { mod: stat(`save.${a}`, parts), proficient, advantage: hasAdv(`save.${a}`, "save.all") };
  }

  /* --- abilità --- */
  const altAbilities = live.flatMap(({ effect }) => (effect.type === "altAbility" ? [effect] : []));
  const skills = {} as ComputedSheet["skills"];
  for (const sk of reg.skills.values()) {
    let ability = sk.ability;
    for (const alt of altAbilities) if (alt.skills.includes(sk.id) && mods[alt.ability] > mods[ability]) ability = alt.ability;
    const proficient = skillProf.has(sk.id) || expertise.has(sk.id);
    const isExpert = expertise.has(sk.id);
    const parts: Part[] = [{ label: "Caratteristica", value: mods[ability] }];
    if (proficient) parts.push({ label: isExpert ? "Competenza (maestria)" : "Competenza", value: proficiencyBonus * (isExpert ? 2 : 1) });
    parts.push(...bonusParts(`skill.${sk.id}`, "skill.all", `check.${ability}`, ...(proficient ? [] : ["skill.unproficient"])));
    if (d20Penalty) parts.push({ label: "Indebolimento", value: -d20Penalty });
    skills[sk.id] = {
      name: sk.name,
      ability,
      mod: stat(`skill.${sk.id}`, parts),
      proficient,
      expertise: isExpert,
      advantage: hasAdv(`skill.${sk.id}`, `check.${ability}`, "check.all"),
    };
  }
  const perc = skills["perception"];
  // Il passivo non è un tiro di d20: niente penalità da Indebolimento; vantaggio = +5.
  const passivePerception = perc
    ? 10 + perc.mod.value + (perc.mod.overridden ? 0 : d20Penalty) + (perc.advantage ? 5 : 0) - (old && exh >= 1 ? 5 : 0)
    : 10 + mods.wis;

  /* --- CA --- */
  const acCandidates: { label: string; parts: Part[] }[] = [];
  if (armor) {
    const dex = armor.dexCap === null ? mods.dex : Math.min(mods.dex, armor.dexCap);
    const parts: Part[] = [{ label: armor.name, value: armor.baseAC }];
    if (dex !== 0 && armor.dexCap !== 0) parts.push({ label: "Destrezza", value: dex });
    acCandidates.push({ label: armor.name, parts });
    if (!armorProf.has(armor.category)) {
      issues.push({ severity: "warning", code: "armor.untrained", message: `Senza addestramento per ${armor.name}: svantaggio ai tiri di For e Des e niente incantesimi.` });
    }
  } else {
    acCandidates.push({ label: "Senza armatura", parts: [{ label: "Base", value: 10 }, { label: "Destrezza", value: mods.dex }] });
  }
  for (const { effect, source } of live) {
    if (effect.type !== "acFormula") continue;
    acCandidates.push({ label: effect.label ?? source, parts: [{ label: effect.label ?? source, value: evalValue(effect.value, ctx) }] });
  }
  const best = acCandidates.reduce((a, b) => (sumParts(b.parts) > sumParts(a.parts) ? b : a));
  const acParts = [...best.parts];
  if (shield) {
    if (armorProf.has("shield")) acParts.push({ label: shield.name, value: shield.bonus });
    else issues.push({ severity: "warning", code: "shield.untrained", message: `Senza addestramento per lo scudo: nessun bonus alla CA.` });
  }
  acParts.push(...bonusParts("ac"));
  const ac = stat("ac", acParts);

  /* --- PF --- */
  const hpParts: Part[] = [];
  if (ch.levels.length) {
    let dice = 0;
    let con = 0;
    ch.levels.forEach((l, i) => {
      const die = must(reg.classes, l.classId, "Classe").hitDie;
      const gain = i === 0 ? dieSize(die) : l.hp === "avg" ? averageHitDie(die) : l.hp;
      // Regola: almeno 1 PF per livello anche con Cos negativa.
      const conPart = Math.max(mods.con, 1 - gain);
      dice += gain;
      con += conPart;
    });
    hpParts.push({ label: "Dadi Vita", value: dice }, { label: "Costituzione", value: con });
  }
  hpParts.push(...bonusParts("hp.max"));
  if (old && exh >= 4) hpParts.push({ label: "Indebolimento", value: -Math.ceil(sumParts(hpParts) / 2) });
  const hpMax = stat("hp.max", hpParts);

  /* --- iniziativa, velocità --- */
  const initParts: Part[] = [{ label: "Destrezza", value: mods.dex }, ...bonusParts("initiative")];
  if (d20Penalty) initParts.push({ label: "Indebolimento", value: -d20Penalty });
  const initiative = { ...stat("initiative", initParts), advantage: hasAdv("initiative") };

  const speedParts: Part[] = [{ label: species.name, value: species.speed }, ...bonusParts("speed.walk")];
  if (armor?.strength && finalScores.str < armor.strength) speedParts.push({ label: `${armor.name} (For ${armor.strength})`, value: -10 });
  if (old) {
    const base = sumParts(speedParts);
    if (exh >= 5) speedParts.push({ label: "Indebolimento", value: -base });
    else if (exh >= 2) speedParts.push({ label: "Indebolimento", value: -Math.ceil(base / 2) });
  } else if (exh) speedParts.push({ label: "Indebolimento", value: -exh * EXHAUSTION_SPEED_PENALTY });
  const speedStat = stat("speed.walk", speedParts);
  const speed = { ...speedStat, value: Math.max(0, speedStat.value) };

  /* --- dadi vita --- */
  const hitDice: ComputedSheet["hitDice"] = [];
  for (const [classId, n] of Object.entries(classLevels)) {
    const die = must(reg.classes, classId, "Classe").hitDie;
    const row = hitDice.find((h) => h.die === die);
    if (row) row.total += n;
    else hitDice.push({ die, total: n, spent: 0 });
  }
  for (const h of hitDice) h.spent = Math.min(h.total, ch.state.hitDiceSpent[h.die] ?? 0);

  /* --- critico --- */
  const critRange = Math.min(20, ...live.flatMap(({ effect }) => (effect.type === "critRange" ? [effect.value] : [])));

  /* --- attacchi --- */
  const masteries = new Set(choices.filter((c) => c.kind === "weaponMastery").flatMap((c) => ch.choices[c.id] ?? []));
  const martialDie = Math.max(0, ...live.flatMap(({ effect }) => (effect.type === "martialArts" ? [evalValue(effect.die, ctx)] : [])));
  const unarmedDie = Math.max(martialDie, ...live.flatMap(({ effect }) => (effect.type === "unarmed" ? [evalValue(effect.die, ctx)] : [])));
  const extraDamage = (kind: "melee" | "ranged" | "unarmed"): ComputedAttack["extraDamage"] =>
    live.flatMap(({ effect, source }) =>
      effect.type === "damageDice" && (effect.on === "all" || effect.on === kind || (effect.on === "weapon" && kind !== "unarmed"))
        ? [{ label: effect.label ?? source, dice: resolveDice(effect.dice, ctx), damageType: effect.damageType }]
        : [],
    );
  const attacks: ComputedAttack[] = weapons.map((w) => {
    const monkWeapon = martialDie > 0 && w.range === "melee" && (w.category === "simple" || w.properties.includes("light"));
    const ability: Ability =
      w.range === "ranged" ? "dex" : (w.properties.includes("finesse") || monkWeapon) && mods.dex > mods.str ? "dex" : "str";
    const proficient = weaponProf.has(w.category) || weaponProf.has(w.id);
    const parts: Part[] = [{ label: "Caratteristica", value: mods[ability] }];
    if (proficient) parts.push({ label: "Competenza", value: proficiencyBonus });
    parts.push(...bonusParts(w.range === "ranged" ? "attack.ranged" : "attack.melee", "attack.all"));
    if (d20Penalty) parts.push({ label: "Indebolimento", value: -d20Penalty });
    const dmgFlat =
      mods[ability] + sumParts(bonusParts("damage.all", ...(ability === "str" ? ["damage.str"] : [])));
    let dice = w.damage;
    if (monkWeapon) {
      const p = parseDice(w.damage);
      if (p.dice.length === 1 && p.dice[0]!.count === 1 && p.dice[0]!.sides < martialDie) dice = `1d${martialDie}`;
    }
    return {
      itemId: w.id,
      name: w.name,
      ability,
      toHit: stat(`attack.${w.id}`, parts),
      damage: withFlat(dice, dmgFlat),
      damageType: w.damageType,
      mastery: w.mastery,
      masteryActive: masteries.has(w.id),
      properties: w.properties,
      critRange,
      extraDamage: extraDamage(w.range),
    };
  });
  {
    // Colpo senz'armi: sempre disponibile, 1 + For di danno se nessun privilegio dà un dado.
    const ability: Ability = martialDie > 0 && mods.dex > mods.str ? "dex" : "str";
    const parts: Part[] = [
      { label: "Caratteristica", value: mods[ability] },
      { label: "Competenza", value: proficiencyBonus },
      ...bonusParts("attack.melee", "attack.unarmed", "attack.all"),
    ];
    if (d20Penalty) parts.push({ label: "Indebolimento", value: -d20Penalty });
    const flat = mods[ability] + sumParts(bonusParts("damage.all", "damage.unarmed", ...(ability === "str" ? ["damage.str"] : [])));
    attacks.push({
      itemId: "unarmed",
      name: "Colpo senz'armi",
      ability,
      toHit: stat("attack.unarmed", parts),
      damage: unarmedDie ? withFlat(`1d${unarmedDie}`, flat) : String(Math.max(0, 1 + flat)),
      damageType: "bludgeoning",
      masteryActive: false,
      properties: [],
      critRange,
      unarmed: true,
      extraDamage: extraDamage("unarmed"),
    });
  }
  const attacksPerAction = Math.max(1, ...live.flatMap(({ effect }) => (effect.type === "extraAttack" ? [evalValue(effect.attacks, ctx)] : [])));

  /* --- altre velocità --- */
  const speeds: Record<string, number> = {};
  for (const { effect } of live) {
    if (effect.type !== "speed") continue;
    const v = effect.value === "walk" ? speed.value : evalValue(effect.value, ctx);
    speeds[effect.mode] = Math.max(speeds[effect.mode] ?? 0, v);
  }

  /* --- risorse, azioni, toggle --- */
  const resources: ComputedResource[] = [];
  const actions: ComputedSheet["actions"] = [];
  const toggles: ComputedSheet["toggles"] = [];
  const features: ComputedSheet["features"] = [];
  const dice: ComputedSheet["dice"] = [];
  const widgets: WidgetRef[] = [...CORE_WIDGETS];
  for (const { feature, source } of active) {
    features.push({ id: feature.id, name: feature.name, source, description: feature.description });
    for (const d of feature.dice ?? []) {
      if (!evalCondition(d.when, ctx)) continue;
      dice.push({ id: d.id, name: d.name, expr: resolveDice(d.dice, ctx), source, damageType: d.damageType, note: d.note });
    }
    for (const r of feature.resources ?? []) {
      const max = Math.max(0, evalValue(r.max, ctx));
      const spent = Math.min(max, ch.state.resourcesSpent[r.id] ?? 0);
      resources.push({ id: r.id, name: r.name, source, max, spent, remaining: max - spent, shortRest: r.shortRest, longRest: r.longRest ?? "all" });
    }
    for (const t of feature.toggles ?? []) {
      toggles.push({ id: t.id, name: t.name, active: !!ch.state.toggles[t.id], available: evalCondition(t.when, ctx) });
    }
    for (const w of feature.widgets ?? []) widgets.push(w);
  }
  for (const { feature, source } of active) {
    for (const a of feature.actions ?? []) {
      const res = a.cost ? resources.find((r) => r.id === a.cost!.resource) : undefined;
      const affordable = !a.cost || (res !== undefined && res.remaining >= a.cost.amount);
      actions.push({
        ...a,
        roll: a.roll ? { dice: resolveDice(a.roll.dice, ctx), plus: a.roll.plus } : undefined,
        source,
        available: evalCondition(a.when, ctx) && affordable,
      });
    }
  }

  /* --- incantesimi --- */
  const spellcasting = computeSpellcasting({
    ch,
    reg,
    classLevels,
    totalLevel,
    proficiencyBonus,
    mods,
    d20Penalty,
    ruleset: reg.ruleset,
    granted: [
      ...active.flatMap(({ feature, classId }) =>
        (feature.spells ?? []).map((spell) => ({ spell, classId, featureId: feature.id, featureName: feature.name })),
      ),
      // Gli incantesimi scelti con una scelta "spell" diventano sempre preparati.
      ...choices.flatMap((c) =>
        c.kind === "spell"
          ? picks(c).map((spellId) => ({
              spell: {
                spellId,
                ability: c.spell?.ability ?? (c.spell?.abilityFrom ? (ch.choices[c.spell.abilityFrom]?.[0] as Ability | undefined) : undefined),
                resource: c.spell?.resource,
              },
              classId: c.classId,
              featureId: c.featureId ?? c.id,
              featureName: c.featureName ?? c.label,
            }))
          : [],
      ),
    ],
    bonusParts,
    evalValue: (v) => evalValue(v, ctx),
    stat,
    validate: policy.validation !== "off",
    issues,
  });

  /* --- scelte in sospeso --- */
  const pendingChoices: ComputedSheet["pendingChoices"] = [];
  for (const c of choices) {
    const required = Math.max(0, evalValue(c.count, ctx));
    const made = c.kind === "subclass" ? (ch.subclasses[c.id.split(".")[0]!] ? 1 : 0) : (ch.choices[c.id]?.length ?? 0);
    if (made < required) pendingChoices.push({ ...c, required, made });
  }
  if (policy.validation !== "off") {
    for (const p of pendingChoices) {
      issues.push({ severity: "warning", code: "choice.pending", path: `choices.${p.id}`, message: `Scelta da completare: ${p.label} (${p.made}/${p.required}).` });
    }
    issues.push(...validateCharacter(ch, reg, { choices, featsByTag: (t) => featsByTag(reg, t).map((f) => f.id), featureIds }));
  }

  return {
    automation,
    level: totalLevel,
    classLevels,
    proficiencyBonus,
    abilities,
    saves,
    skills,
    passivePerception,
    ac,
    hpMax,
    initiative,
    speed,
    speeds,
    hitDice,
    critRange,
    attacksPerAction,
    attacks,
    dice,
    resources,
    actions,
    toggles,
    features,
    pendingChoices,
    widgets,
    resistances: unique(grants("resistance")),
    immunities: unique(grants("immunity")),
    conditionImmunities: unique(grants("conditionImmunity")),
    senses: live.flatMap(({ effect }) => (effect.type === "sense" ? [{ sense: effect.sense, range: effect.range }] : [])),
    advantages,
    disadvantages: old
      ? [
          ...(exh >= 1 ? [{ on: "check.all", label: "Indebolimento" }] : []),
          ...(exh >= 3 ? [{ on: "attack.all", label: "Indebolimento" }, { on: "save.all", label: "Indebolimento" }] : []),
        ]
      : [],
    proficiencies: {
      armor: [...armorProf],
      weapons: [...weaponProf],
      tools: [...toolProf],
      languages: unique(grants("language")),
    },
    spellcasting,
    issues: policy.validation === "off" ? issues.filter((i) => i.code.startsWith("override")) : issues,
  };
}

function sumParts(parts: Part[]): number {
  return parts.reduce((a, p) => a + p.value, 0);
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
