import { computeSheet } from "./compute.js";
import type { Registry } from "./registry.js";
import type { Ability, AutomationLevel, CharacterData, CharacterState, EquipmentEntry } from "./types.js";

export function emptyState(): CharacterState {
  return {
    hpCurrent: 0,
    hpTemp: 0,
    hitDiceSpent: {},
    resourcesSpent: {},
    toggles: {},
    conditions: [],
    exhaustion: 0,
    deathSaves: { success: 0, failure: 0 },
    heroicInspiration: false,
    spellSlotsSpent: {},
    pactSlotsSpent: 0,
    concentration: null,
  };
}

export interface NewCharacterInput {
  id: string;
  name: string;
  speciesId: string;
  backgroundId: string;
  classId: string;
  abilityScores: Record<Ability, number>;
  backgroundBoosts?: Partial<Record<Ability, number>>;
  choices?: Record<string, string[]>;
  equipment?: EquipmentEntry[];
  automation?: AutomationLevel;
  ownerUid?: string;
}

/** Array standard 2024. */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

/** Costi point buy (27 punti, punteggi 8–15). */
export const POINT_BUY_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const POINT_BUY_BUDGET = 27;

export function pointBuySpent(scores: Record<Ability, number>): number | null {
  let total = 0;
  for (const v of Object.values(scores)) {
    const c = POINT_BUY_COST[v];
    if (c === undefined) return null;
    total += c;
  }
  return total;
}

/** Crea un personaggio di 1° livello con PF pieni. */
export function createCharacter(input: NewCharacterInput, reg: Registry): CharacterData {
  const ch: CharacterData = {
    schemaVersion: 1,
    id: input.id,
    name: input.name,
    ownerUid: input.ownerUid,
    speciesId: input.speciesId,
    backgroundId: input.backgroundId,
    levels: [{ classId: input.classId, hp: "avg" }],
    subclasses: {},
    abilityScores: input.abilityScores,
    backgroundBoosts: input.backgroundBoosts ?? {},
    choices: input.choices ?? {},
    equipment: input.equipment ?? [],
    state: emptyState(),
    settings: { automation: input.automation },
    overrides: {},
  };
  ch.state.hpCurrent = computeSheet(ch, reg).hpMax.value;
  return ch;
}
