import { describe, expect, it } from "vitest";
import { crXp, encounterMultiplier, partyThresholds, rateEncounter } from "../src/index.js";

describe("difficoltà degli incontri", () => {
  it("legge i gradi di sfida, anche frazionari o mancanti", () => {
    expect(crXp("1/4")).toBe(50);
    expect(crXp("0.5")).toBe(100);
    expect(crXp("17")).toBe(18000);
    expect(crXp("00")).toBe(0);
    expect(crXp("—")).toBe(0);
    expect(crXp(undefined)).toBe(0);
  });

  it("somma le soglie dei personaggi", () => {
    expect(partyThresholds([3, 3, 3, 2])).toEqual({ easy: 275, medium: 550, hard: 825, deadly: 1400 });
  });

  it("sposta il moltiplicatore per gruppi piccoli e grandi", () => {
    expect(encounterMultiplier(1, 4)).toBe(1);
    expect(encounterMultiplier(4, 4)).toBe(2);
    expect(encounterMultiplier(1, 2)).toBe(1.5);
    expect(encounterMultiplier(1, 6)).toBe(0.5);
    expect(encounterMultiplier(15, 2)).toBe(5);
  });

  it("valuta l'esempio del manuale: un bugbear e tre hobgoblin contro quattro PG", () => {
    const r = rateEncounter([3, 3, 3, 2], [{ cr: "1", count: 1 }, { cr: "1/2", count: 3 }]);
    expect(r.xp).toBe(500);
    expect(r.adjustedXp).toBe(1000);
    expect(r.difficulty).toBe("hard");
  });

  it("senza personaggi non dà un giudizio", () => {
    expect(rateEncounter([], [{ cr: "5", count: 1 }]).difficulty).toBeNull();
  });
});
