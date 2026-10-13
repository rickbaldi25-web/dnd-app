import type { AutomationLevel, CharacterData } from "@dnd/engine";

export type Unsubscribe = () => void;

export interface UserPrefs {
  automation?: AutomationLevel;
}

/**
 * Accesso ai dati. La UI conosce solo questa interfaccia:
 * oggi Firestore o localStorage, domani qualsiasi altro backend.
 */
export interface Repository {
  watchCharacters(ownerUid: string, cb: (list: CharacterData[]) => void): Unsubscribe;
  watchCharacter(id: string, cb: (ch: CharacterData | null) => void): Unsubscribe;
  saveCharacter(ch: CharacterData): Promise<void>;
  deleteCharacter(id: string): Promise<void>;
  getPrefs(uid: string): Promise<UserPrefs>;
  savePrefs(uid: string, prefs: UserPrefs): Promise<void>;
}
