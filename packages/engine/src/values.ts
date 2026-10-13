import type { Ability, ArmorCategory, Condition, Value } from "./types.js";

/** Contesto di valutazione per Value e Condition. */
export interface EvalContext {
  mods: Record<Ability, number>;
  scores: Record<Ability, number>;
  proficiencyBonus: number;
  totalLevel: number;
  classLevels: Record<string, number>;
  toggles: Record<string, boolean>;
  conditions: string[];
  armor: ArmorCategory | "none";
  shield: boolean;
}

export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonusFor(totalLevel: number): number {
  return 2 + Math.floor((Math.max(1, totalLevel) - 1) / 4);
}

function levelOf(ctx: EvalContext, by: string): number {
  return by === "total" ? ctx.totalLevel : ctx.classLevels[by] ?? 0;
}

export function evalValue(v: Value, ctx: EvalContext): number {
  if (typeof v === "number") return v;
  if ("mod" in v) return ctx.mods[v.mod];
  if ("score" in v) return ctx.scores[v.score];
  if ("prof" in v) return Math.floor(ctx.proficiencyBonus * v.prof);
  if ("level" in v) return levelOf(ctx, v.level);
  if ("table" in v) {
    const lvl = levelOf(ctx, v.table.by);
    if (lvl < 1) return 0;
    const idx = Math.min(lvl, v.table.values.length) - 1;
    return v.table.values[idx] ?? 0;
  }
  if ("sum" in v) return v.sum.reduce<number>((acc, x) => acc + evalValue(x, ctx), 0);
  if ("max" in v) return Math.max(...v.max.map((x) => evalValue(x, ctx)));
  if ("min" in v) return Math.min(...v.min.map((x) => evalValue(x, ctx)));
  const _exhaustive: never = v;
  throw new Error(`Valore sconosciuto: ${JSON.stringify(_exhaustive)}`);
}

export function evalCondition(c: Condition | undefined, ctx: EvalContext): boolean {
  if (!c) return true;
  if ("toggle" in c) return ctx.toggles[c.toggle] === true;
  if ("armor" in c) {
    if (c.armor === "any") return ctx.armor !== "none";
    return ctx.armor === c.armor;
  }
  if ("shield" in c) return ctx.shield === c.shield;
  if ("hasCondition" in c) return ctx.conditions.includes(c.hasCondition);
  if ("all" in c) return c.all.every((x) => evalCondition(x, ctx));
  if ("any" in c) return c.any.some((x) => evalCondition(x, ctx));
  if ("not" in c) return !evalCondition(c.not, ctx);
  const _exhaustive: never = c;
  throw new Error(`Condizione sconosciuta: ${JSON.stringify(_exhaustive)}`);
}
