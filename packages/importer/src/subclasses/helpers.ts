/** Funzioni comuni per scrivere le meccaniche dei privilegi. Solo regole, nessun testo dei manuali. */
import type { ActionDef, Condition, DiceExpr, Feature, Value } from "@dnd/engine";

export type Mechanics = Pick<Feature, "effects" | "actions" | "resources" | "choices" | "dice" | "spells" | "toggles" | "widgets">;

/** Tabella per livello di classe a partire dalle soglie: at("rogue", { 1: 2, 6: 4 }). */
export const at = (by: string, thresholds: Record<number, number>): Value => {
  const values: number[] = [];
  for (let lv = 1, cur = 0; lv <= 20; lv++) values.push((cur = thresholds[lv] ?? cur));
  return { table: { by, values } };
};
export const halfUp = (v: Value): Value => ({ div: [v, 2], round: "up" });
export const halfDown = (v: Value): Value => ({ div: [v, 2], round: "down" });
/** Almeno 1, altrimenti il modificatore indicato. */
export const atLeastOne = (v: Value): Value => ({ max: [1, v] });

/** Azione che si usa con un tasto e lascia una nota nel registro; con resource spende un utilizzo. */
export const note = (id: string, name: string, timing: ActionDef["timing"], description: string, resource?: string, amount = 1): ActionDef => ({
  id,
  name,
  timing,
  ...(resource ? { cost: { resource, amount } } : {}),
  outcome: { kind: "note" },
  description,
});

/** Azione con un tiro di dado (danni, cure da annotare, effetti casuali). */
export const rollAction = (id: string, name: string, timing: ActionDef["timing"], dice: DiceExpr, description: string, opts: { resource?: string; amount?: number; plus?: Value; outcome?: ActionDef["outcome"]; when?: Condition } = {}): ActionDef => ({
  id,
  name,
  timing,
  ...(opts.resource ? { cost: { resource: opts.resource, amount: opts.amount ?? 1 } } : {}),
  roll: { dice, ...(opts.plus !== undefined ? { plus: opts.plus } : {}) },
  outcome: opts.outcome ?? { kind: "note" },
  ...(opts.when ? { when: opts.when } : {}),
  description,
});

/** Risorsa con utilizzi limitati. */
export const uses = (id: string, name: string, max: Value, rest: "short" | "long" = "long") => ({
  id,
  name,
  max,
  ...(rest === "short" ? { shortRest: "all" as const } : {}),
  longRest: "all" as const,
});

export const RAGING: Condition = { toggle: "raging" };
export const CLERIC_CHANNEL = "cleric.channel-divinity";
export const PALADIN_CHANNEL = "paladin.channel-divinity";
export const ALL_SKILLS = [
  "acrobatics", "animal-handling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation",
  "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight-of-hand", "stealth", "survival",
];
export const ALL_DAMAGE = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];
