import type { CharacterData } from "@dnd/engine";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Firestore,
} from "firebase/firestore";
import type { Repository, UserPrefs } from "./repository";

/** Toglie i campi tecnici di Firestore prima di passare il personaggio al motore. */
function toCharacter(id: string, data: Record<string, unknown>): CharacterData {
  const { updatedAt: _u, createdAt: _c, ...rest } = data;
  return { ...(rest as unknown as CharacterData), id };
}

export function firestoreRepo(db: Firestore): Repository {
  const characters = collection(db, "characters");
  return {
    watchCharacters(ownerUid, cb) {
      const q = query(characters, where("ownerUid", "==", ownerUid), orderBy("name"));
      return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toCharacter(d.id, d.data()))));
    },
    watchCharacter(id, cb) {
      // onSnapshot: la scheda si aggiorna in tempo reale (es. danno applicato dal Master).
      return onSnapshot(doc(characters, id), (d) => cb(d.exists() ? toCharacter(d.id, d.data()) : null));
    },
    async saveCharacter(ch) {
      await setDoc(doc(characters, ch.id), { ...ch, updatedAt: serverTimestamp() });
    },
    async deleteCharacter(id) {
      await deleteDoc(doc(characters, id));
    },
    async getPrefs(uid) {
      const d = await getDoc(doc(db, "users", uid));
      return (d.data()?.prefs as UserPrefs) ?? {};
    },
    async savePrefs(uid, prefs) {
      await setDoc(doc(db, "users", uid), { prefs }, { merge: true });
    },
  };
}
