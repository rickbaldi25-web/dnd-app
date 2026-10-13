import { AUTOMATION_POLICY } from "./automation.js";
import { classLevelsOf, computeSheet } from "./compute.js";
import { defaultRng, formatMod, roll, rollD20, type Rng } from "./dice.js";
import { cloneState, type Proposal } from "./patch.js";
import type { Registry } from "./registry.js";
import { ABILITY_NAMES, DAMAGE_TYPE_NAMES, spellDice } from "./spells.js";
import type { Ability, CharacterData, ComputedSheet, Die } from "./types.js";
import { evalValue, proficiencyBonusFor, type EvalContext } from "./values.js";

/* ------------------------------------------------------------------ */
/* Punti ferita                                                        */
/* ------------------------------------------------------------------ */

export function applyDamage(
  ch: CharacterData,
  sheet: ComputedSheet,
  amount: number,
  opts: { type?: string; typeLabel?: string; critical?: boolean } = {},
): Proposal {
  const s = cloneState(ch.state);
  const lines: string[] = [];
  let dmg = Math.max(0, Math.floor(amount));
  const tl = opts.typeLabel ?? opts.type;
  if (opts.type && sheet.immunities.includes(opts.type)) {
    lines.push(`Immunità a ${tl}: nessun danno.`);
    dmg = 0;
  } else if (opts.type && sheet.resistances.includes(opts.type)) {
    dmg = Math.floor(dmg / 2);
    lines.push(`Resistenza a ${tl}: danno dimezzato a ${dmg}.`);
  }
  const wasAtZero = s.hpCurrent === 0;
  const absorbed = Math.min(s.hpTemp, dmg);
  s.hpTemp -= absorbed;
  if (absorbed) lines.push(`${absorbed} assorbiti dai PF temporanei.`);
  const rest = dmg - absorbed;

  if (wasAtZero && rest > 0) {
    if (rest >= sheet.hpMax.value) {
      lines.push("Danno massiccio: il personaggio muore.");
      s.deathSaves.failure = 3;
    } else {
      s.deathSaves.failure = Math.min(3, s.deathSaves.failure + (opts.critical ? 2 : 1));
      lines.push(`Danno a 0 PF: ${opts.critical ? 2 : 1} fallimento/i ai TS contro morte.`);
    }
  } else {
    const overflow = rest - s.hpCurrent;
    s.hpCurrent = Math.max(0, s.hpCurrent - rest);
    if (s.hpCurrent === 0 && rest > 0) {
      if (overflow >= sheet.hpMax.value) {
        lines.push("Danno massiccio: il personaggio muore.");
        s.deathSaves.failure = 3;
      } else {
        lines.push("A 0 PF: privo di sensi.");
        s.deathSaves = { success: 0, failure: 0 };
      }
      if (!s.conditions.includes("unconscious")) s.conditions.push("unconscious");
    }
  }
  if (s.concentration && dmg > 0) {
    if (s.hpCurrent === 0) {
      lines.push(`Concentrazione su ${s.concentration.name} interrotta.`);
      s.concentration = null;
    } else {
      const dc = Math.min(30, Math.max(10, Math.floor(dmg / 2)));
      lines.push(`Concentrazione su ${s.concentration.name}: TS su Costituzione CD ${dc}.`);
    }
  }
  return { title: `Danno: ${dmg}`, lines, rolls: [], state: s };
}

export function applyHealing(ch: CharacterData, sheet: ComputedSheet, amount: number): Proposal {
  const s = cloneState(ch.state);
  const before = s.hpCurrent;
  s.hpCurrent = Math.min(sheet.hpMax.value, s.hpCurrent + Math.max(0, Math.floor(amount)));
  const lines = [`PF ${before} → ${s.hpCurrent}`];
  if (before === 0 && s.hpCurrent > 0) {
    s.conditions = s.conditions.filter((c) => c !== "unconscious");
    s.deathSaves = { success: 0, failure: 0 };
    lines.push("Torna cosciente.");
  }
  return { title: `Cura: ${s.hpCurrent - before}`, lines, rolls: [], state: s };
}

export function setTempHp(ch: CharacterData, amount: number): Proposal {
  const s = cloneState(ch.state);
  // I PF temporanei non si sommano: si tiene il valore più alto.
  const next = Math.max(s.hpTemp, Math.floor(amount));
  const lines = next === s.hpTemp ? [`Restano ${s.hpTemp} PF temporanei (non si sommano).`] : [`PF temporanei: ${next}`];
  s.hpTemp = next;
  return { title: "PF temporanei", lines, rolls: [], state: s };
}

/* ------------------------------------------------------------------ */
/* Azioni di classe (Ira, Secondo Fiato, Azione Impetuosa...)          */
/* ------------------------------------------------------------------ */

/** Scelte fatte dal giocatore al momento di usare un'azione. */
export interface ActionParams {
  /** Quantità da spendere per i costi variabili (es. PF di Imposizione delle Mani). */
  amount?: number;
  /** Slot da recuperare: livello -> quanti (Recupero Arcano). */
  slots?: Record<string, number>;
  /** Livello dello slot da convertire o da creare (Fonte di Magia). */
  slotLevel?: number;
}

export function useAction(
  ch: CharacterData,
  reg: Registry,
  actionId: string,
  rng: Rng = defaultRng,
  params: ActionParams = {},
): Proposal {
  const sheet = computeSheet(ch, reg);
  const policy = AUTOMATION_POLICY[sheet.automation];
  const action = sheet.actions.find((a) => a.id === actionId);
  if (!action) throw new Error(`Azione non disponibile: ${actionId}`);

  const s = cloneState(ch.state);
  const lines: string[] = [];
  const rolls: Proposal["rolls"] = [];
  let blocked: string | undefined;
  const fail = (msg: string) => {
    if (policy.enforceResources) blocked ??= msg;
    else lines.push(`Attenzione — ${msg}`);
  };
  const amount = action.cost?.variable ? Math.max(1, Math.floor(params.amount ?? 1)) : (action.cost?.amount ?? 0);

  if (!action.available) {
    fail(action.cost ? `${action.name}: risorse esaurite o condizioni non soddisfatte.` : `${action.name}: condizioni non soddisfatte.`);
  } else if (action.cost?.variable) {
    const r = sheet.resources.find((x) => x.id === action.cost!.resource);
    if ((r?.remaining ?? 0) < amount) fail(`${r?.name ?? action.cost.resource}: ne restano ${r?.remaining ?? 0}, ne servono ${amount}.`);
  }

  if (!policy.computeActions) {
    // Manuale: si tira solo il dado, se c'è, come promemoria.
    if (action.roll) {
      const r = roll(action.roll.dice, rng);
      rolls.push({ label: action.name, expr: action.roll.dice, dice: r.rolls.map((x) => x.value), total: r.total });
    }
    lines.push("Modalità manuale: aggiorna tu risorse e PF.");
    return { title: action.name, lines, rolls, state: ch.state, blocked };
  }

  if (action.cost) {
    const r = sheet.resources.find((x) => x.id === action.cost!.resource);
    const spent = (s.resourcesSpent[action.cost.resource] ?? 0) + amount;
    s.resourcesSpent[action.cost.resource] = r ? Math.min(r.max, spent) : spent;
    lines.push(`${r?.name ?? action.cost.resource}: −${amount} (restano ${Math.max(0, (r?.remaining ?? 0) - amount)})`);
  }

  const ctx = evalCtxFromSheet(ch, sheet);
  // Senza tiro, un costo variabile vale quanto si è speso (es. PF curati con Imposizione delle Mani).
  let total = action.cost?.variable ? amount : 0;
  if (action.roll) {
    const plus = action.roll.plus !== undefined ? evalValue(action.roll.plus, ctx) : 0;
    const r = roll(action.roll.dice, rng);
    total = r.total + plus;
    const expr = plus ? `${action.roll.dice}${plus > 0 ? "+" : ""}${plus}` : action.roll.dice;
    rolls.push({ label: action.name, expr, dice: r.rolls.map((x) => x.value), total });
  }

  switch (action.outcome?.kind) {
    case "heal": {
      const before = s.hpCurrent;
      s.hpCurrent = Math.min(sheet.hpMax.value, s.hpCurrent + total);
      if (before === 0 && s.hpCurrent > 0) {
        s.conditions = s.conditions.filter((c) => c !== "unconscious");
        s.deathSaves = { success: 0, failure: 0 };
      }
      lines.push(`PF ${before} → ${s.hpCurrent}`);
      break;
    }
    case "tempHp":
      s.hpTemp = Math.max(s.hpTemp, total);
      lines.push(`PF temporanei: ${s.hpTemp}`);
      break;
    case "toggleOn":
      s.toggles[action.outcome.toggle] = true;
      lines.push(`${action.name}: attivo.`);
      break;
    case "toggleOff":
      s.toggles[action.outcome.toggle] = false;
      lines.push(`${action.name}: terminato.`);
      break;
    case "recoverSlots": {
      const budget = evalValue(action.outcome.budget, ctx);
      const maxLevel = action.outcome.maxLevel ?? 9;
      let used = 0;
      for (const [lv, n] of Object.entries(params.slots ?? {})) {
        const level = Number(lv);
        if (!n) continue;
        const pool = sheet.spellcasting?.slots.find((p) => p.level === level);
        if (level > maxLevel) fail(`${action.name}: solo slot fino al ${maxLevel}°.`);
        if ((pool?.spent ?? 0) < n) fail(`Non hai ${n} slot di ${level}° spesi.`);
        const back = Math.min(n, pool?.spent ?? 0);
        used += level * n;
        s.spellSlotsSpent = { ...s.spellSlotsSpent, [lv]: (pool?.spent ?? 0) - back };
        lines.push(`Slot di ${level}°: +${back}`);
      }
      if (used === 0) fail(`Scegli gli slot da recuperare: fino a ${budget} livelli in totale.`);
      else if (used > budget) fail(`Puoi recuperare slot per ${budget} livelli in totale, ne hai chiesti ${used}.`);
      break;
    }
    case "recoverPact": {
      const p = sheet.spellcasting?.pact;
      if (!p || p.spent === 0) {
        fail("Nessuno slot del Patto da recuperare.");
        break;
      }
      const back = Math.min(p.spent, Math.ceil(p.max * action.outcome.fraction));
      s.pactSlotsSpent = p.spent - back;
      lines.push(`Slot del Patto: +${back}`);
      break;
    }
    case "slotToResource": {
      const level = params.slotLevel;
      const pool = sheet.spellcasting?.slots.find((p) => p.level === level);
      const resId = action.outcome.resource;
      const r = sheet.resources.find((x) => x.id === resId);
      if (!level || !pool || pool.remaining < 1) {
        fail("Scegli uno slot disponibile da convertire.");
        break;
      }
      const gain = Math.min(level, r?.spent ?? 0);
      s.spellSlotsSpent = { ...s.spellSlotsSpent, [String(level)]: pool.spent + 1 };
      if (r) s.resourcesSpent[r.id] = r.spent - gain;
      lines.push(`Slot di ${level}°: −1. ${r?.name ?? "Punti"}: +${gain}.`);
      break;
    }
    case "resourceToSlot": {
      const level = params.slotLevel;
      const cost = level ? action.outcome.costs[level - 1] : undefined;
      const resId = action.outcome.resource;
      const r = sheet.resources.find((x) => x.id === resId);
      if (!level || cost === undefined) {
        fail(`Scegli il livello dello slot da creare: dal 1° al ${action.outcome.costs.length}°.`);
        break;
      }
      if (!r || r.remaining < cost) {
        fail(`Uno slot di ${level}° costa ${cost}: ${r?.name ?? resId} ne ha ${r?.remaining ?? 0}.`);
        break;
      }
      const pool = sheet.spellcasting?.slots.find((p) => p.level === level);
      s.resourcesSpent[resId] = r.spent + cost;
      // Lo slot creato rimpiazza uno speso, se c'è; altrimenti è uno slot in più fino al riposo lungo.
      if (pool && pool.spent > 0) s.spellSlotsSpent = { ...s.spellSlotsSpent, [String(level)]: pool.spent - 1 };
      else s.spellSlotsBonus = { ...s.spellSlotsBonus, [String(level)]: (s.spellSlotsBonus?.[String(level)] ?? 0) + 1 };
      lines.push(`${r.name}: −${cost}. Slot di ${level}°: +1.`);
      break;
    }
    default:
      if (action.description) lines.push(action.description);
  }

  return { title: action.name, lines, rolls, state: s, blocked };
}

/** Spende (delta negativo) o recupera punti di una risorsa: per i contatori regolati a mano. */
export function adjustResource(ch: CharacterData, sheet: ComputedSheet, resourceId: string, delta: number): Proposal {
  const r = sheet.resources.find((x) => x.id === resourceId);
  if (!r) throw new Error(`Risorsa non disponibile: ${resourceId}`);
  const s = cloneState(ch.state);
  const remaining = Math.min(r.max, Math.max(0, r.remaining + Math.trunc(delta)));
  s.resourcesSpent[resourceId] = r.max - remaining;
  const policy = AUTOMATION_POLICY[sheet.automation];
  const blocked = delta < 0 && r.remaining + delta < 0 && policy.enforceResources ? `${r.name}: ne restano ${r.remaining}.` : undefined;
  return { title: r.name, lines: [`${r.name}: ${r.remaining} → ${remaining}`], rolls: [], state: s, blocked };
}

/** Attiva/disattiva uno stato senza costi (es. Attacco Irruento). */
export function setToggle(ch: CharacterData, toggleId: string, on: boolean): Proposal {
  const s = cloneState(ch.state);
  s.toggles[toggleId] = on;
  return { title: on ? "Attivato" : "Disattivato", lines: [toggleId], rolls: [], state: s };
}

/* ------------------------------------------------------------------ */
/* Incantesimi                                                         */
/* ------------------------------------------------------------------ */

export interface CastOptions {
  /** Classe con cui lanciarlo, se l'incantesimo è disponibile da più di una. */
  sourceId?: string;
  /** Livello dello slot da spendere. Omesso = il più basso disponibile. */
  slotLevel?: number;
  /** Usa uno slot della Magia del Patto. */
  pact?: boolean;
  /** Lancio come rituale: nessuno slot. */
  ritual?: boolean;
  /** Usa la risorsa del privilegio che lo concede al posto dello slot. */
  useResource?: boolean;
}

export function castSpell(
  ch: CharacterData,
  reg: Registry,
  spellId: string,
  opts: CastOptions = {},
  rng: Rng = defaultRng,
): Proposal {
  const sheet = computeSheet(ch, reg);
  const policy = AUTOMATION_POLICY[sheet.automation];
  const sc = sheet.spellcasting;
  const entry = sc?.spells.find((x) => x.spellId === spellId && (!opts.sourceId || x.sourceId === opts.sourceId));
  const spell = reg.spells.get(spellId);
  if (!sc || !entry || !spell) throw new Error(`Incantesimo non disponibile: ${spellId}`);

  const s = cloneState(ch.state);
  const lines: string[] = [];
  const rolls: Proposal["rolls"] = [];
  let blocked: string | undefined;
  const fail = (msg: string) => {
    if (policy.enforceResources) blocked = msg;
    else lines.push(`Attenzione — ${msg}`);
  };

  /* --- costo: slot, rituale o risorsa --- */
  let castLevel = spell.level;
  if (policy.computeActions && spell.level > 0) {
    if (opts.ritual) {
      if (spell.ritual) lines.push("Lanciato come rituale: 10 minuti in più, nessuno slot.");
      else fail(`${spell.name} non si può lanciare come rituale.`);
    } else if (opts.useResource && entry.resource) {
      const r = sheet.resources.find((x) => x.id === entry.resource);
      if (!r || r.remaining < 1) fail(`${r?.name ?? entry.resource}: usi esauriti.`);
      s.resourcesSpent[entry.resource] = Math.min(r?.max ?? 1, (s.resourcesSpent[entry.resource] ?? 0) + 1);
      lines.push(`${r?.name ?? entry.resource}: −1 (nessuno slot).`);
    } else {
      const pactFits = sc.pact !== undefined && sc.pact.level >= spell.level;
      const wanted = opts.slotLevel;
      const pool = opts.pact
        ? undefined
        : wanted !== undefined
          ? sc.slots.find((p) => p.level === wanted)
          : sc.slots.find((p) => p.level >= spell.level && p.remaining > 0);
      // Senza indicazioni, la Magia del Patto si usa quando gli slot normali non bastano.
      const usePact = opts.pact || (wanted === undefined && !pool && pactFits && sc.pact!.remaining > 0);

      if (usePact) {
        if (!pactFits) fail(`${spell.name} è di livello ${spell.level}: gli slot del Patto non bastano.`);
        else if (sc.pact!.remaining < 1) fail("Slot del Patto esauriti.");
        if (sc.pact) {
          castLevel = Math.max(spell.level, sc.pact.level);
          s.pactSlotsSpent = Math.min(sc.pact.max, sc.pact.spent + 1);
          lines.push(`Slot del Patto di ${castLevel}°: −1 (restano ${Math.max(0, sc.pact.remaining - 1)}).`);
        }
      } else if (wanted !== undefined && wanted < spell.level) {
        fail(`${spell.name} richiede uno slot di ${spell.level}° o superiore.`);
      } else if (!pool || pool.remaining < 1) {
        fail(`Nessuno slot di ${wanted ?? spell.level}°${wanted === undefined ? " o superiore" : ""} disponibile.`);
        castLevel = wanted ?? spell.level;
      } else {
        castLevel = pool.level;
        s.spellSlotsSpent = { ...s.spellSlotsSpent, [String(pool.level)]: pool.spent + 1 };
        lines.push(`Slot di ${pool.level}°: −1 (restano ${pool.remaining - 1}).`);
      }
    }
  }

  // In manuale non si toccano gli slot, ma i dadi seguono comunque il livello scelto.
  if (!policy.computeActions && spell.level > 0 && (opts.slotLevel ?? 0) > spell.level) castLevel = opts.slotLevel!;

  /* --- tiri --- */
  if (entry.attackBonus !== undefined) {
    const r = rollD20(entry.attackBonus, "normal", rng);
    rolls.push({ label: "Tiro per colpire", expr: `1d20${formatMod(entry.attackBonus)}`, dice: r.rolls, total: r.total });
    if (r.nat20) lines.push("20 naturale: colpo critico.");
  }
  if (entry.save && entry.saveDC !== undefined) lines.push(`Tiro salvezza su ${ABILITY_NAMES[entry.save]}, CD ${entry.saveDC}.`);
  if (spell.roll) {
    const expr = spellDice(spell.roll, {
      spellLevel: spell.level,
      slotLevel: castLevel,
      characterLevel: sheet.level,
      mod: sheet.abilities[entry.ability].mod,
    });
    const r = roll(expr, rng);
    const type = spell.roll.damageType;
    const label = spell.roll.kind === "damage" ? `Danni${type ? ` (${DAMAGE_TYPE_NAMES[type] ?? type})` : ""}` : spell.roll.kind === "heal" ? "Cura" : "PF temporanei";
    rolls.push({ label, expr, dice: r.rolls.map((x) => x.value), total: Math.max(0, r.total) });
  }

  const title = castLevel > spell.level ? `${spell.name} (slot di ${castLevel}°)` : spell.name;
  if (!policy.computeActions) {
    lines.push("Modalità manuale: aggiorna tu slot e concentrazione.");
    return { title, lines, rolls, state: ch.state, blocked };
  }

  if (spell.concentration) {
    if (s.concentration && s.concentration.spellId !== spell.id) lines.push(`Termina la concentrazione su ${s.concentration.name}.`);
    s.concentration = { spellId: spell.id, name: spell.name };
    lines.push(`Concentrazione: ${spell.duration}.`);
  }
  return { title, lines, rolls, state: s, blocked };
}

export function endConcentration(ch: CharacterData): Proposal {
  const s = cloneState(ch.state);
  const lines = s.concentration ? [`Concentrazione su ${s.concentration.name} terminata.`] : [];
  s.concentration = null;
  return { title: "Concentrazione", lines, rolls: [], state: s };
}

/** Segna a mano gli slot spesi di un livello (o del Patto): per correggere dalla scheda. */
export function setSlotsSpent(ch: CharacterData, pool: number | "pact", spent: number): Proposal {
  const s = cloneState(ch.state);
  const n = Math.max(0, Math.floor(spent));
  if (pool === "pact") s.pactSlotsSpent = n;
  else s.spellSlotsSpent = { ...s.spellSlotsSpent, [String(pool)]: n };
  return { title: "Slot incantesimo", lines: [pool === "pact" ? `Slot del Patto spesi: ${n}` : `Slot di ${pool}° spesi: ${n}`], rolls: [], state: s };
}

/* ------------------------------------------------------------------ */
/* Riposi                                                              */
/* ------------------------------------------------------------------ */

export function shortRest(
  ch: CharacterData,
  reg: Registry,
  spend: Partial<Record<Die, number>> = {},
  rng: Rng = defaultRng,
): Proposal {
  const sheet = computeSheet(ch, reg);
  const policy = AUTOMATION_POLICY[sheet.automation];
  const s = cloneState(ch.state);
  const lines: string[] = [];
  const rolls: Proposal["rolls"] = [];
  let blocked: string | undefined;
  const con = sheet.abilities.con.mod;

  for (const [die, n] of Object.entries(spend) as [Die, number][]) {
    if (!n) continue;
    const pool = sheet.hitDice.find((h) => h.die === die);
    const available = pool ? pool.total - pool.spent : 0;
    if (n > available) {
      const msg = `Dadi Vita ${die} insufficienti (${available} disponibili).`;
      if (policy.enforceResources) blocked = msg;
      else lines.push(`Attenzione — ${msg}`);
    }
    if (!policy.computeActions) continue;
    for (let i = 0; i < n; i++) {
      const r = roll(`1${die}`, rng);
      // Regole 2024: dado + Cos, minimo 1 PF per dado.
      const healed = Math.max(reg.ruleset === "2014" ? 0 : 1, r.total + con);
      rolls.push({ label: `Dado Vita ${die}`, expr: `1${die}${con >= 0 ? "+" : ""}${con}`, dice: [r.total], total: healed });
      s.hpCurrent = Math.min(sheet.hpMax.value, s.hpCurrent + healed);
    }
    s.hitDiceSpent[die] = (s.hitDiceSpent[die] ?? 0) + n;
  }

  if (policy.computeActions) {
    for (const r of sheet.resources) {
      if (!r.shortRest || r.spent === 0) continue;
      const back = r.shortRest === "all" ? r.spent : Math.min(r.spent, r.shortRest);
      s.resourcesSpent[r.id] = r.spent - back;
      lines.push(`${r.name}: +${back}`);
    }
    if (sheet.spellcasting?.pact?.spent) {
      s.pactSlotsSpent = 0;
      lines.push("Slot del Patto recuperati.");
    }
    if (rolls.length) lines.push(`PF ${ch.state.hpCurrent} → ${s.hpCurrent}`);
  } else {
    lines.push("Modalità manuale: aggiorna tu PF e risorse.");
    return { title: "Riposo breve", lines, rolls, state: ch.state, blocked };
  }
  return { title: "Riposo breve", lines, rolls, state: s, blocked };
}

export function longRest(ch: CharacterData, reg: Registry): Proposal {
  const sheet = computeSheet(ch, reg);
  const policy = AUTOMATION_POLICY[sheet.automation];
  if (!policy.computeActions) {
    return { title: "Riposo lungo", lines: ["Modalità manuale: aggiorna tu PF e risorse."], rolls: [], state: ch.state };
  }
  const s = cloneState(ch.state);
  const lines: string[] = [];
  s.hpCurrent = sheet.hpMax.value;
  s.hpTemp = 0;
  if (reg.ruleset === "2014") {
    // Regole 2014: si recupera metà dei Dadi Vita totali (almeno 1), dai più grandi.
    let back = Math.max(1, Math.floor(sheet.hitDice.reduce((a, h) => a + h.total, 0) / 2));
    for (const h of [...sheet.hitDice].sort((a, b) => Number(b.die.slice(1)) - Number(a.die.slice(1)))) {
      const n = Math.min(back, h.spent);
      s.hitDiceSpent[h.die] = h.spent - n;
      back -= n;
    }
  } else {
    s.hitDiceSpent = {}; // regole 2024: si recuperano tutti i Dadi Vita
  }
  for (const r of sheet.resources) {
    if (r.spent === 0) continue;
    const back = r.longRest === "all" ? r.spent : Math.min(r.spent, r.longRest);
    s.resourcesSpent[r.id] = r.spent - back;
  }
  s.toggles = {};
  s.spellSlotsSpent = {};
  s.spellSlotsBonus = {};
  s.pactSlotsSpent = 0;
  s.concentration = null;
  s.deathSaves = { success: 0, failure: 0 };
  s.conditions = s.conditions.filter((c) => c !== "unconscious");
  if (s.exhaustion > 0) {
    s.exhaustion -= 1;
    lines.push(`Indebolimento: ${ch.state.exhaustion} → ${s.exhaustion}`);
  }
  lines.unshift(`PF al massimo (${s.hpCurrent}), ${reg.ruleset === "2014" ? "metà dei Dadi Vita" : "Dadi Vita"}${sheet.spellcasting ? ", slot incantesimo" : ""} e risorse recuperati.`);
  return { title: "Riposo lungo", lines, rolls: [], state: s };
}

/* ------------------------------------------------------------------ */

/** Contesto per valutare i bonus dei tiri delle azioni (es. "1d10 + livello da guerriero"). */
function evalCtxFromSheet(ch: CharacterData, sheet: ComputedSheet): EvalContext {
  const mods = {} as Record<Ability, number>;
  const scores = {} as Record<Ability, number>;
  for (const [a, v] of Object.entries(sheet.abilities) as [Ability, ComputedSheet["abilities"][Ability]][]) {
    mods[a] = v.mod;
    scores[a] = v.score.value;
  }
  return {
    mods,
    scores,
    proficiencyBonus: proficiencyBonusFor(ch.levels.length),
    totalLevel: ch.levels.length,
    classLevels: classLevelsOf(ch),
    toggles: ch.state.toggles,
    conditions: ch.state.conditions,
    armor: "none",
    shield: false,
    features: new Set(sheet.features.map((f) => f.id)),
  };
}
