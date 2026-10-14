import type { CharacterData } from "@dnd/engine";
import type { ConditionTimer, Encounter, EncounterMonster } from "../data/repository.ts";

/*
 * Durata delle condizioni in combattimento. Senza indicazioni una condizione a tempo perde un round
 * a ogni nuovo round. Con un "timer" scade invece all'inizio o alla fine del turno di una creatura precisa:
 * il bersaglio ("fino alla fine del suo prossimo turno") oppure chi l'ha causata.
 */

/** Quando scade: a ogni round, o all'inizio/fine del turno del bersaglio o di chi agisce ora. */
export type ConditionAnchor = "round" | "targetEnd" | "targetStart" | "actorEnd" | "actorStart";
export const ANCHOR_LABELS: Record<ConditionAnchor, string> = {
  round: "a ogni round",
  targetEnd: "a fine del suo turno",
  targetStart: "all'inizio del suo turno",
  actorEnd: "a fine turno di chi agisce ora",
  actorStart: "all'inizio del turno di chi agisce ora",
};

export const timerKey = (targetId: string, condition: string) => `${targetId}|${condition}`;

/**
 * Il timer per una condizione appena messa; null se conta a round.
 * Se scade a fine turno di chi sta agendo ora, la fine di questo turno non conta: "fino alla fine del tuo prossimo turno".
 */
export function makeTimer(anchor: ConditionAnchor, targetId: string, currentId: string | undefined): ConditionTimer | null {
  if (anchor === "round") return null;
  const on = anchor.startsWith("target") ? targetId : currentId;
  if (!on) return null;
  const tick = anchor.endsWith("End") ? "end" : "start";
  return { tick, on, ...(tick === "end" && on === currentId ? { skip: true } : {}) };
}

export interface TickResult {
  monsters: EncounterMonster[];
  timers: Record<string, ConditionTimer>;
  /** Personaggi da aggiornare: condizioni e round rimasti. */
  pcs: { ch: CharacterData; conditions: string[]; conditionRounds: Record<string, number> }[];
  /** "Goblin 1: Prono", per l'avviso. */
  ended: string[];
}

/** Il turno passa da `from` a `to`; wrapped = comincia un nuovo round. */
export function tickConditions(encounter: Encounter, party: CharacterData[], names: Record<string, string>, step: { from?: string; to: string; wrapped: boolean }): TickResult {
  const timers = { ...(encounter.timers ?? {}) };
  const due = new Set<string>();
  for (const [key, t] of Object.entries(timers)) {
    if (t.tick === "end" && t.on === step.from) {
      if (t.skip) timers[key] = { tick: t.tick, on: t.on };
      else due.add(key);
    }
    if (t.tick === "start" && t.on === step.to) due.add(key);
  }
  // Le condizioni senza timer contano a round, come prima.
  const counts = (target: string, condition: string) => {
    const key = timerKey(target, condition);
    return due.has(key) || (step.wrapped && !encounter.timers?.[key]);
  };
  const ended: string[] = [];
  const monsters = encounter.monsters.map((m) => {
    if (!m.conditions) return m;
    const left: Record<string, number | null> = {};
    for (const [id, n] of Object.entries(m.conditions)) {
      if (n === null || !counts(m.id, id)) left[id] = n;
      else if (n > 1) left[id] = n - 1;
      else {
        ended.push(`${m.name}: ${names[id] ?? id}`);
        delete timers[timerKey(m.id, id)];
      }
    }
    return { ...m, conditions: left };
  });
  const pcs: TickResult["pcs"] = [];
  for (const ch of party) {
    const timed = ch.state.conditionRounds ?? {};
    const left: Record<string, number> = {};
    const gone: string[] = [];
    let changed = false;
    for (const [id, n] of Object.entries(timed)) {
      if (!counts(ch.id, id)) left[id] = n;
      else if (n > 1) {
        left[id] = n - 1;
        changed = true;
      } else {
        gone.push(id);
        changed = true;
        delete timers[timerKey(ch.id, id)];
      }
    }
    for (const id of gone) ended.push(`${ch.name}: ${names[id] ?? id}`);
    if (changed) pcs.push({ ch, conditions: ch.state.conditions.filter((x) => !gone.includes(x)), conditionRounds: left });
  }
  return { monsters, timers, pcs, ended };
}
