import { AUTOMATION_POLICY } from "./automation.js";
import { averageHitDie, computeSheet } from "./compute.js";
import { defaultRng, roll, type Rng } from "./dice.js";
import { cloneState, type Proposal } from "./patch.js";
import { must, type Registry } from "./registry.js";
import type { CharacterData, ComputedSheet, Issue } from "./types.js";

export interface LevelUpResult extends Proposal {
  /** Privilegi ottenuti con il nuovo livello. */
  gained: ComputedSheet["features"];
  /** Scelte da fare dopo il passaggio (abilità, maestrie, sottoclasse, talenti...). */
  pendingChoices: ComputedSheet["pendingChoices"];
  issues: Issue[];
  next: CharacterData;
}

/**
 * Aggiunge un livello in `classId`.
 * hp: numero tirato al tavolo, "avg" (media) oppure "roll" (tira il motore).
 * In automazione completa gli errori di regola bloccano il passaggio.
 */
export function levelUp(
  ch: CharacterData,
  reg: Registry,
  classId: string,
  hp: number | "avg" | "roll" = "avg",
  rng: Rng = defaultRng,
): LevelUpResult {
  const cls = must(reg.classes, classId, "Classe");
  const before = computeSheet(ch, reg);
  const policy = AUTOMATION_POLICY[before.automation];
  const rolls: Proposal["rolls"] = [];
  const lines: string[] = [];

  let hpEntry: number | "avg" = "avg";
  if (hp === "roll") {
    const r = roll(`1${cls.hitDie}`, rng);
    hpEntry = r.total;
    rolls.push({ label: `PF (${cls.hitDie})`, expr: `1${cls.hitDie}`, dice: [r.total], total: r.total });
  } else {
    hpEntry = hp;
  }

  const next: CharacterData = { ...ch, levels: [...ch.levels, { classId, hp: hpEntry }] };
  const after = computeSheet(next, reg);

  const state = cloneState(ch.state);
  const delta = after.hpMax.value - before.hpMax.value;
  if (policy.computeActions) state.hpCurrent = Math.max(0, state.hpCurrent + delta);
  next.state = state;

  const oldIds = new Set(before.features.map((f) => f.id));
  const gained = after.features.filter((f) => !oldIds.has(f.id));
  const issues = after.issues.filter((i) => !before.issues.some((b) => b.code === i.code && b.path === i.path));

  lines.push(`${cls.name} ${after.classLevels[classId]} (livello ${after.level})`);
  lines.push(`PF massimi: ${before.hpMax.value} → ${after.hpMax.value}`);
  if (after.proficiencyBonus !== before.proficiencyBonus) lines.push(`Bonus competenza: +${after.proficiencyBonus}`);
  for (const f of gained) lines.push(`Nuovo: ${f.name}`);

  const errors = after.issues.filter((i) => i.severity === "error");
  const blocked = policy.validation === "block" && errors.length ? errors.map((e) => e.message).join(" ") : undefined;

  return {
    title: `Passaggio di livello: ${cls.name}`,
    lines,
    rolls,
    state,
    character: { levels: next.levels },
    blocked,
    gained,
    pendingChoices: after.pendingChoices,
    issues,
    next,
  };
}

/** PF che un livello darebbe con la media: utile per mostrare l'anteprima. */
export function averageHpGain(reg: Registry, classId: string): number {
  return averageHitDie(must(reg.classes, classId, "Classe").hitDie);
}
