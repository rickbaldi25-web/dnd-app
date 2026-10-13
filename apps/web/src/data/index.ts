import { db } from "../firebase/config";
import { firestoreRepo } from "./firestoreRepo";
import { localRepo } from "./localRepo";
import type { Repository } from "./repository";

export const repo: Repository = db ? firestoreRepo(db) : localRepo;
export type { Repository, UserPrefs } from "./repository";
