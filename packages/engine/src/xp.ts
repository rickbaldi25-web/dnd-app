/** PE totali necessari per ogni livello, regole 2014 (indice 0 = 1° livello). */
export const XP_FOR_LEVEL: readonly number[] = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

/** Il livello che i PE permettono di raggiungere. */
export function levelForXp(xp: number): number {
  let level = 1;
  while (level < 20 && xp >= XP_FOR_LEVEL[level]!) level++;
  return level;
}

/** PE del livello successivo a quello dato; null al 20°. */
export function nextLevelXp(level: number): number | null {
  return level >= 20 ? null : XP_FOR_LEVEL[level]!;
}
