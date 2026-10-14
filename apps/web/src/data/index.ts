import { db } from "../firebase/config";
import { firestoreRepo } from "./firestoreRepo";
import { localRepo } from "./localRepo";
import type { Repository } from "./repository";

export const repo: Repository = db ? firestoreRepo(db) : localRepo;
export { PRESENCE_TTL_MS } from "./repository";
export type { AdventureChapter, AdventureDoc, AdventureEncounter, AdventureMeta, AdventureNote, Campaign, Homebrew, Encounter, EncounterMonster, EncounterPlan, Handout, LootItem, PlanEntry, TreasureItem, MonsterSecret, Presence, SessionNote, SharedRoll, Repository, UserPrefs } from "./repository";
