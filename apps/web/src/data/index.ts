import { db } from "../firebase/config";
import { firestoreRepo } from "./firestoreRepo";
import { localRepo } from "./localRepo";
import type { Repository } from "./repository";

export const repo: Repository = db ? firestoreRepo(db) : localRepo;
export { PRESENCE_TTL_MS } from "./repository";
export type { Campaign, Encounter, EncounterMonster, MonsterSecret, Presence, Repository, UserPrefs } from "./repository";
