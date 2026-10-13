/** Tiri di dado con RNG iniettabile (deterministico nei test). */

export type Rng = () => number; // [0, 1)

/** RNG seedabile (mulberry32). */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const defaultRng: Rng = () => {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! / 4294967296;
  }
  return Math.random();
};

export interface DiceTerm {
  count: number;
  sides: number;
  sign: 1 | -1;
}

export interface ParsedDice {
  dice: DiceTerm[];
  flat: number;
}

/** Interpreta espressioni tipo "1d10+3", "2d6 - 1", "d20", "4". */
export function parseDice(expr: string): ParsedDice {
  const clean = expr.replace(/\s+/g, "").toLowerCase();
  if (!clean) throw new Error("Espressione di dado vuota");
  const tokens = clean.match(/[+-]?[^+-]+/g);
  if (!tokens || tokens.join("") !== clean) throw new Error(`Espressione non valida: ${expr}`);
  const out: ParsedDice = { dice: [], flat: 0 };
  for (const tok of tokens) {
    const sign: 1 | -1 = tok.startsWith("-") ? -1 : 1;
    const body = tok.replace(/^[+-]/, "");
    const m = body.match(/^(\d*)d(\d+)$/);
    if (m) {
      const count = m[1] ? parseInt(m[1], 10) : 1;
      const sides = parseInt(m[2]!, 10);
      if (count < 1 || count > 100 || sides < 2 || sides > 1000) throw new Error(`Dado non valido: ${tok}`);
      out.dice.push({ count, sides, sign });
    } else if (/^\d+$/.test(body)) {
      out.flat += sign * parseInt(body, 10);
    } else {
      throw new Error(`Termine non valido: ${tok}`);
    }
  }
  return out;
}

export interface RollResult {
  expr: string;
  rolls: { sides: number; value: number; sign: 1 | -1 }[];
  flat: number;
  total: number;
}

export function rollDie(sides: number, rng: Rng = defaultRng): number {
  return 1 + Math.floor(rng() * sides);
}

export function roll(expr: string, rng: Rng = defaultRng): RollResult {
  const p = parseDice(expr);
  const rolls: RollResult["rolls"] = [];
  let total = p.flat;
  for (const d of p.dice) {
    for (let i = 0; i < d.count; i++) {
      const v = rollDie(d.sides, rng);
      rolls.push({ sides: d.sides, value: v, sign: d.sign });
      total += d.sign * v;
    }
  }
  return { expr, rolls, flat: p.flat, total };
}

export type RollMode = "normal" | "advantage" | "disadvantage";

/** Tiro di d20 con vantaggio/svantaggio. */
export function rollD20(bonus: number, mode: RollMode = "normal", rng: Rng = defaultRng) {
  const a = rollDie(20, rng);
  const b = mode === "normal" ? undefined : rollDie(20, rng);
  const kept = b === undefined ? a : mode === "advantage" ? Math.max(a, b) : Math.min(a, b);
  return { rolls: b === undefined ? [a] : [a, b], kept, bonus, total: kept + bonus, nat20: kept === 20, nat1: kept === 1 };
}

/** Formatta un modificatore: 3 -> "+3", -1 -> "−1" */
export function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

/** Unisce un'espressione di dado e un bonus piatto: ("1d8", 3) -> "1d8+3" */
export function withFlat(dice: string, flat: number): string {
  if (flat === 0) return dice;
  return `${dice}${flat > 0 ? "+" : ""}${flat}`;
}
