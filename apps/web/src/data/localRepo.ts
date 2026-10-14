import { applyFieldChanges, diffFields, type CharacterData } from "@dnd/engine";
import { newCampaignCode, type AdventureChapter, type AdventureMeta, type AdventureNote, type Campaign, type Encounter, type EncounterPlan, type Handout, type Homebrew, type LootItem, type MonsterSecret, type Presence, type SessionNote, type SharedRoll, type Repository, type UserPrefs } from "./repository";

const KEY = "dnd.characters.v1";
const PREFS = "dnd.prefs.v1";
const CAMPAIGNS = "dnd.campaigns.v1";
/** Presenze solo in memoria: in modalità locale c'è un utente solo. */
const presences = new Map<string, Presence[]>();
/** Tiri condivisi: in memoria, in modalità locale servono solo a provare il riquadro. */
const sharedRolls = new Map<string, SharedRoll[]>();
const ENCOUNTERS = "dnd.encounters.v1";
type StoredEncounter = { encounter?: Encounter; secrets?: Record<string, MonsterSecret>; homebrew?: Homebrew; plans?: EncounterPlan[]; handouts?: Handout[]; sessions?: SessionNote[]; sessionSecrets?: Record<string, string>; loot?: LootItem[]; adventure?: AdventureMeta | null; chapters?: Record<string, AdventureChapter>; combatNotes?: AdventureNote[] };

function readEncounters(): Record<string, StoredEncounter> {
  try {
    return JSON.parse(localStorage.getItem(ENCOUNTERS) ?? "{}");
  } catch {
    return {};
  }
}
function writeEncounter(campaignId: string, patch: StoredEncounter) {
  const all = readEncounters();
  all[campaignId] = { ...all[campaignId], ...patch };
  try {
    localStorage.setItem(ENCOUNTERS, JSON.stringify(all));
  } catch {
    /* storage pieno o bloccato */
  }
  notify();
}

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

function readCampaigns(): Record<string, Campaign> {
  try {
    return JSON.parse(localStorage.getItem(CAMPAIGNS) ?? "{}");
  } catch {
    return {};
  }
}
function writeCampaigns(all: Record<string, Campaign>) {
  try {
    localStorage.setItem(CAMPAIGNS, JSON.stringify(all));
  } catch {
    /* storage pieno o bloccato */
  }
  notify();
}

// Sincronizza tra schede del browser aperte sullo stesso PC.
if (typeof window !== "undefined") window.addEventListener("storage", (e) => (e.key === KEY || e.key === CAMPAIGNS || e.key === ENCOUNTERS) && notify());

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
  async updateCharacter(prev, next) {
    // Come su Firestore: le differenze si applicano alla versione salvata, che un'altra scheda può aver cambiato.
    const all = readAll();
    all[next.id] = applyFieldChanges(all[next.id] ?? prev, diffFields(prev, next));
    writeAll(all);
  },
  async deleteCharacter(id) {
    const all = readAll();
    delete all[id];
    writeAll(all);
  },
  watchCampaigns(uid, cb) {
    const emit = () => cb(Object.values(readCampaigns()).filter((c) => c.dmUid === uid || c.memberUids.includes(uid)).sort((a, b) => a.name.localeCompare(b.name)));
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  watchCampaign(id, cb) {
    const emit = () => cb(readCampaigns()[id] ?? null);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  watchCampaignCharacters(campaignId, cb) {
    const emit = () => cb(Object.values(readAll()).filter((c) => c.campaignId === campaignId).sort((a, b) => a.name.localeCompare(b.name)));
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async createCampaign(name, dm) {
    const campaign: Campaign = { id: newCampaignCode(), name, dmUid: dm.uid, dmName: dm.name, memberUids: [] };
    writeCampaigns({ ...readCampaigns(), [campaign.id]: campaign });
    return campaign;
  },
  async joinCampaign(code, uid) {
    const all = readCampaigns();
    const campaign = all[code];
    if (!campaign) throw new Error("Nessuna campagna con questo codice.");
    if (campaign.dmUid !== uid && !campaign.memberUids.includes(uid)) {
      campaign.memberUids = [...campaign.memberUids, uid];
      writeCampaigns(all);
    }
    return campaign;
  },
  async deleteCampaign(id) {
    const all = readCampaigns();
    delete all[id];
    writeCampaigns(all);
    // Via anche combattimento, incontri, handout, sessioni e avventura della campagna.
    const stored = readEncounters();
    delete stored[id];
    try {
      localStorage.setItem(ENCOUNTERS, JSON.stringify(stored));
    } catch {
      /* storage bloccato */
    }
    sharedRolls.delete(id);
    presences.delete(id);
    notify();
  },
  async setProgression(id, progression) {
    const all = readCampaigns();
    if (!all[id]) return;
    all[id].progression = progression;
    writeCampaigns(all);
  },
  async setAutomationLock(id, level) {
    const all = readCampaigns();
    if (!all[id]) return;
    if (level) all[id].automationLock = level;
    else delete all[id].automationLock;
    writeCampaigns(all);
  },
  async leaveCampaign(id, uid) {
    const all = readCampaigns();
    if (!all[id]) return;
    all[id].memberUids = all[id].memberUids.filter((u) => u !== uid);
    writeCampaigns(all);
  },
  watchEncounter(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.encounter ?? null);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveEncounter(campaignId, encounter) {
    writeEncounter(campaignId, { encounter });
  },
  watchMonsterSecrets(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.secrets ?? {});
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveMonsterSecrets(campaignId, secrets) {
    writeEncounter(campaignId, { secrets });
  },
  watchEncounterPlans(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.plans ?? []);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveEncounterPlans(campaignId, plans) {
    writeEncounter(campaignId, { plans });
  },
  watchHandouts(campaignId, viewer, cb) {
    const emit = () => cb((readEncounters()[campaignId]?.handouts ?? []).filter((h) => viewer.isDm || h.everyone || h.visibleTo.includes(viewer.uid)));
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveHandout(campaignId, handout) {
    const list = readEncounters()[campaignId]?.handouts ?? [];
    writeEncounter(campaignId, { handouts: list.some((h) => h.id === handout.id) ? list.map((h) => (h.id === handout.id ? handout : h)) : [...list, handout] });
  },
  async deleteHandout(campaignId, id) {
    writeEncounter(campaignId, { handouts: (readEncounters()[campaignId]?.handouts ?? []).filter((h) => h.id !== id) });
  },
  watchSessions(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.sessions ?? []);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveSession(campaignId, session) {
    const list = readEncounters()[campaignId]?.sessions ?? [];
    writeEncounter(campaignId, { sessions: list.some((s) => s.id === session.id) ? list.map((s) => (s.id === session.id ? session : s)) : [...list, session] });
  },
  async deleteSession(campaignId, id) {
    writeEncounter(campaignId, { sessions: (readEncounters()[campaignId]?.sessions ?? []).filter((s) => s.id !== id) });
  },
  watchSessionSecrets(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.sessionSecrets ?? {});
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveSessionSecrets(campaignId, notes) {
    writeEncounter(campaignId, { sessionSecrets: notes });
  },
  watchLoot(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.loot ?? []);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveLoot(campaignId, items) {
    writeEncounter(campaignId, { loot: items });
  },
  watchAdventure(campaignId, cb) {
    const emit = () => {
      const all = readEncounters()[campaignId];
      cb(all?.adventure ?? null, Object.values(all?.chapters ?? {}).sort((a, b) => a.order - b.order));
    };
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveAdventureMeta(campaignId, meta) {
    writeEncounter(campaignId, { adventure: meta });
  },
  async saveAdventureChapter(campaignId, chapter) {
    writeEncounter(campaignId, { chapters: { ...readEncounters()[campaignId]?.chapters, [chapter.id]: chapter } });
  },
  async deleteAdventure(campaignId, chapterIds, whole) {
    const chapters = { ...readEncounters()[campaignId]?.chapters };
    for (const id of chapterIds) delete chapters[id];
    writeEncounter(campaignId, { chapters, ...(whole ? { adventure: null } : {}) });
  },
  watchCombatNotes(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.combatNotes ?? []);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveCombatNotes(campaignId, notes) {
    writeEncounter(campaignId, { combatNotes: notes });
  },
  watchHomebrew(campaignId, cb) {
    const emit = () => cb(readEncounters()[campaignId]?.homebrew ?? null);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async saveHomebrew(campaignId, homebrew) {
    writeEncounter(campaignId, { homebrew });
  },
  async addRoll(campaignId, roll) {
    const list = sharedRolls.get(campaignId) ?? [];
    sharedRolls.set(campaignId, [{ ...roll, id: `${roll.at}-${list.length}` }, ...list].slice(0, 60));
    notify();
  },
  async clearRolls(campaignId) {
    sharedRolls.delete(campaignId);
    notify();
  },
  watchRolls(campaignId, secret, cb) {
    const emit = () => cb((sharedRolls.get(campaignId) ?? []).filter((r) => !!r.secret === secret));
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  async touchPresence(campaignId, user) {
    const rest = (presences.get(campaignId) ?? []).filter((p) => p.uid !== user.uid);
    presences.set(campaignId, [...rest, { uid: user.uid, name: user.name, at: Date.now() }]);
    notify();
  },
  watchPresence(campaignId, cb) {
    const emit = () => cb(presences.get(campaignId) ?? []);
    listeners.add(emit);
    emit();
    return () => listeners.delete(emit);
  },
  // In modalità locale c'è un dispositivo solo: ciò che si è visto sta già nel browser.
  watchSeen(_uid, _campaignId, cb) {
    cb({});
    return () => undefined;
  },
  async saveSeen() {},
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
