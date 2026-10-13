import type { CharacterData } from "@dnd/engine";
import type { Repository, UserPrefs } from "./repository";

const KEY = "dnd.characters.v1";
const PREFS = "dnd.prefs.v1";

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

function readAll(): Record<string, CharacterData> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeAll(all: Record<string, CharacterData>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage pieno o bloccato: la sessione continua in memoria */
  }
  notify();
}

// Sincronizza tra schede del browser aperte sullo stesso PC.
if (typeof window !== "undefined") window.addEventListener("storage", (e) => e.key === KEY && notify());

/** Modalità senza Firebase: tutto nel browser. */
export const localRepo: Repository = {
  watchCharacters(ownerUid, cb) {
    const emit = () => cb(Object.values(readAll()).filter((c) => c.ownerUid === ownerUid).sort((a, b) => a.name.localeCompare(b.name)));
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  watchCharacter(id, cb) {
    const emit = () => cb(readAll()[id] ?? null);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveCharacter(ch) {
    const all = readAll();
    all[ch.id] = ch;
    writeAll(all);
  },
  async deleteCharacter(id) {
    const all = readAll();
    delete all[id];
    writeAll(all);
  },
  async getPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS) ?? "{}") as UserPrefs;
    } catch {
      return {};
    }
  },
  async savePrefs(_uid, prefs) {
    try {
      localStorage.setItem(PREFS, JSON.stringify(prefs));
    } catch {
      /* ignora */
    }
  },
};
