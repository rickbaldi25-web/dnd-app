import { describe, expect, it } from "vitest";
import { applyFieldChanges, diffFields } from "../src/index.js";

describe("salvataggi a campi", () => {
  const base = { name: "Aria", state: { hpCurrent: 20, conditions: ["prone"], resourcesSpent: { "barbarian.rage": 1 } as Record<string, number> }, notes: "x" as string | undefined };

  it("trova solo i campi cambiati, anche con id che contengono punti", () => {
    const next = { ...base, notes: undefined, state: { ...base.state, hpCurrent: 12, resourcesSpent: { "barbarian.rage": 2, "monk.ki": 1 } } };
    expect(diffFields(base, next)).toEqual([
      { path: ["state", "hpCurrent"], value: 12 },
      { path: ["state", "resourcesSpent", "barbarian.rage"], value: 2 },
      { path: ["state", "resourcesSpent", "monk.ki"], value: 1 },
      { path: ["notes"] },
    ]);
    expect(diffFields(base, structuredClone(base))).toEqual([]);
  });

  it("le liste si sostituiscono intere", () => {
    const next = { ...base, state: { ...base.state, conditions: ["prone", "poisoned"] } };
    expect(diffFields(base, next)).toEqual([{ path: ["state", "conditions"], value: ["prone", "poisoned"] }]);
  });

  it("due modifiche a campi diversi, fatte sulla stessa versione, si sommano", () => {
    const player = diffFields(base, { ...base, notes: "appunti" });
    const master = diffFields(base, { ...base, state: { ...base.state, hpCurrent: 5 } });
    const merged = applyFieldChanges(applyFieldChanges(base, player), master);
    expect(merged).toMatchObject({ notes: "appunti", state: { hpCurrent: 5, conditions: ["prone"] } });
    expect(base.state.hpCurrent).toBe(20); // l'originale non cambia
  });
});
