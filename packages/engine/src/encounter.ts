/*
 * Difficoltà di un incontro con il metodo delle regole 2014: i PE dei mostri, moltiplicati
 * in base a quanti sono, si confrontano con le soglie del gruppo.
 */

const XP_BY_CR: Record<string, number> = {
  "0": 10,
  "1/8": 25,
  "1/4": 50,
  "1/2": 100,
  "1": 200,
  "2": 450,
  "3": 700,
  "4": 1100,
  "5": 1800,
  "6": 2300,
  "7": 2900,
  "8": 3900,
  "9": 5000,
  "10": 5900,
  "11": 7200,
  "12": 8400,
  "13": 10000,
  "14": 11500,
  "15": 13000,
  "16": 15000,
  "17": 18000,
  "18": 20000,
  "19": 22000,
  "20": 25000,
  "21": 33000,
  "22": 41000,
  "23": 50000,
  "24": 62000,
  "25": 75000,
  "26": 90000,
  "27": 105000,
  "28": 120000,
  "29": 135000,
  "30": 155000,
};

/** Gradi di sfida in ordine crescente, per i menu. */
export const CHALLENGE_RATINGS: readonly string[] = Object.keys(XP_BY_CR).sort((a, b) => XP_BY_CR[a]! - XP_BY_CR[b]!);

/** PE di un mostro dal grado di sfida ("1/4", "0.25", "5"). Zero se il grado manca o non si riconosce. */
export function crXp(cr: string | undefined): number {
  const raw = (cr ?? "").trim();
  // Nei compendi "00" indica i mostri di grado 0 che non danno PE.
  if (raw === "00") return 0;
  const decimals: Record<string, string> = { "0.125": "1/8", "0.25": "1/4", "0.5": "1/2" };
  return XP_BY_CR[decimals[raw] ?? raw] ?? 0;
}

export type EncounterDifficulty = "trivial" | "easy" | "medium" | "hard" | "deadly";
export interface XpThresholds {
  easy: number;
  medium: number;
  hard: number;
  deadly: number;
}

/** Soglie di PE di un personaggio per livello: facile, medio, difficile, mortale. */
const THRESHOLDS: readonly (readonly [number, number, number, number])[] = [
  [25, 50, 75, 100],
  [50, 100, 150, 200],
  [75, 150, 225, 400],
  [125, 250, 375, 500],
  [250, 500, 750, 1100],
  [300, 600, 900, 1400],
  [350, 750, 1100, 1700],
  [450, 900, 1400, 2100],
  [550, 1100, 1600, 2400],
  [600, 1200, 1900, 2800],
  [800, 1600, 2400, 3600],
  [1000, 2000, 3000, 4500],
  [1100, 2200, 3400, 5100],
  [1250, 2500, 3800, 5700],
  [1400, 2800, 4300, 6400],
  [1600, 3200, 4800, 7200],
  [2000, 3900, 5900, 8800],
  [2100, 4200, 6300, 9500],
  [2400, 4900, 7300, 10900],
  [2800, 5700, 8500, 12700],
];

/** Soglie del gruppo: la somma di quelle dei singoli personaggi. */
export function partyThresholds(levels: number[]): XpThresholds {
  const sum: XpThresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };
  for (const level of levels) {
    const row = THRESHOLDS[Math.min(20, Math.max(1, Math.floor(level))) - 1]!;
    sum.easy += row[0];
    sum.medium += row[1];
    sum.hard += row[2];
    sum.deadly += row[3];
  }
  return sum;
}

const MULTIPLIERS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5] as const;

/** Moltiplicatore per il numero di mostri; i gruppi piccoli (meno di 3) e grandi (6 o più) lo spostano di un gradino. */
export function encounterMultiplier(monsterCount: number, partySize: number): number {
  if (monsterCount <= 0) return 1;
  let step = monsterCount === 1 ? 1 : monsterCount === 2 ? 2 : monsterCount <= 6 ? 3 : monsterCount <= 10 ? 4 : monsterCount <= 14 ? 5 : 6;
  if (partySize > 0 && partySize < 3) step++;
  else if (partySize >= 6) step--;
  return MULTIPLIERS[step]!;
}

export interface EncounterRating {
  /** PE che il gruppo guadagna: la somma, senza moltiplicatore. */
  xp: number;
  multiplier: number;
  /** PE che contano per la difficoltà. */
  adjustedXp: number;
  thresholds: XpThresholds;
  /** null se non ci sono personaggi con cui confrontare. */
  difficulty: EncounterDifficulty | null;
}

export function rateEncounter(levels: number[], monsters: { cr?: string; count: number }[]): EncounterRating {
  const xp = monsters.reduce((sum, m) => sum + crXp(m.cr) * m.count, 0);
  const count = monsters.reduce((sum, m) => sum + m.count, 0);
  const multiplier = encounterMultiplier(count, levels.length);
  const adjustedXp = Math.floor(xp * multiplier);
  const thresholds = partyThresholds(levels);
  let difficulty: EncounterDifficulty | null = null;
  if (levels.length) {
    difficulty = adjustedXp >= thresholds.deadly ? "deadly" : adjustedXp >= thresholds.hard ? "hard" : adjustedXp >= thresholds.medium ? "medium" : adjustedXp >= thresholds.easy ? "easy" : "trivial";
  }
  return { xp, multiplier, adjustedXp, thresholds, difficulty };
}
