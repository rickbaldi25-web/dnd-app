import { describe, expect, it } from "vitest";
import { levelForXp, nextLevelXp } from "../src/index.js";

describe("punti esperienza", () => {
  it("trova il livello dai PE", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(299)).toBe(1);
    expect(levelForXp(300)).toBe(2);
    expect(levelForXp(6500)).toBe(5);
    expect(levelForXp(1_000_000)).toBe(20);
  });
  it("dice quanti PE servono per il livello dopo", () => {
    expect(nextLevelXp(1)).toBe(300);
    expect(nextLevelXp(4)).toBe(6500);
    expect(nextLevelXp(20)).toBeNull();
  });
});
