import { applyFieldChanges, diffFields, type CharacterData } from "@dnd/engine";
import { newCampaignCode, type Campaign, type Presence, type Repository, type UserPrefs } from "./repository";

const KEY = "dnd.characters.v1";
const PREFS = "dnd.prefs.v1";
const CAMPAIGNS = "dnd.campaigns.v1";
/** Presenze solo in memoria: in modalità locale c'è un utente solo. */
const presences = new Map<string, Presence[]>();

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
if (typeof window !== "undefined") window.addEventListener("storage", (e) => (e.key === KEY || e.key === CAMPAIGNS) && notify());

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
