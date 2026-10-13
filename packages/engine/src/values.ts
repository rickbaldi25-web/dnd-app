import type { Ability, ArmorCategory, Condition, DiceExpr, Value } from "./types.js";

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
  /** Id dei privilegi attivi, per le condizioni { feature }. */
  features?: ReadonlySet<string>;
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
  if ("times" in v) return evalValue(v.times[0], ctx) * v.times[1];
  if ("div" in v) {
    const q = evalValue(v.div[0], ctx) / v.div[1];
    return v.round === "up" ? Math.ceil(q) : Math.floor(q);
  }
  const _exhaustive: never = v;
  throw new Error(`Valore sconosciuto: ${JSON.stringify(_exhaustive)}`);
}

/** Risolve dadi che crescono con il livello in un'espressione: { count: 3, sides: 6 } -> "3d6". */
export function resolveDice(d: DiceExpr, ctx: EvalContext): string {
  if (typeof d === "string") return d;
  const count = d.count === undefined ? 1 : evalValue(d.count, ctx);
  const sides = evalValue(d.sides, ctx);
  const plus = d.plus === undefined ? 0 : evalValue(d.plus, ctx);
  if (count < 1 || sides < 2) return String(Math.max(0, plus));
  return `${count}d${sides}${plus ? `${plus > 0 ? "+" : ""}${plus}` : ""}`;
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
  if ("feature" in c) return ctx.features?.has(c.feature) ?? false;
  if ("minLevel" in c) return levelOf(ctx, c.minLevel.by) >= c.minLevel.level;
  if ("all" in c) return c.all.every((x) => evalCondition(x, ctx));
  if ("any" in c) return c.any.some((x) => evalCondition(x, ctx));
  if ("not" in c) return !evalCondition(c.not, ctx);
  const _exhaustive: never = c;
  throw new Error(`Condizione sconosciuta: ${JSON.stringify(_exhaustive)}`);
}
