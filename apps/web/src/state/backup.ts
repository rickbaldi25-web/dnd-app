import type { CharacterData } from "@dnd/engine";
import { repo, type AdventureChapter, type AdventureMeta, type EncounterPlan, type Handout, type Homebrew, type LootItem, type SessionNote, type Unsubscribe } from "../data";

/*
 * Copie di sicurezza in un file JSON: i propri personaggi, oppure tutto ciò che il Master ha preparato
 * per una campagna (incontri, avventura, diario, handout, contenuti, bottino).
 */

const FORMAT = "brocks-dnd";

/** Scarica un oggetto come file JSON. */
export function download(name: string, data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const fileStamp = () => new Date().toISOString().slice(0, 10);
const safeName = (s: string) => s.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "campagna";

/** Il primo valore di un "watch", poi si smette di ascoltare. */
function once<T>(watch: (cb: (v: T) => void) => Unsubscribe): Promise<T> {
  return new Promise((resolve) => {
    let stop: Unsubscribe | undefined;
    let done = false;
    stop = watch((v) => {
      if (done) return;
      done = true;
      resolve(v);
      // Con alcuni archivi il primo valore arriva prima che watch restituisca la funzione per fermarsi.
      setTimeout(() => stop?.(), 0);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Personaggi                                                          */

export function exportCharacters(list: CharacterData[]) {
  download(`personaggi-${fileStamp()}.json`, { format: FORMAT, kind: "characters", exportedAt: Date.now(), characters: list });
}

/**
 * Reimporta i personaggi di un file come propri. Chi ha lo stesso id di un personaggio esistente
 * entra come copia, così non si sovrascrive niente; il collegamento alle campagne si toglie.
 */
export async function importCharacters(text: string, uid: string, existing: CharacterData[]): Promise<number> {
  const data = JSON.parse(text);
  if (data?.format !== FORMAT || data.kind !== "characters" || !Array.isArray(data.characters)) throw new Error("Il file non è un backup di personaggi di Brock's DnD.");
  const taken = new Set(existing.map((c) => c.id));
  let n = 0;
  for (const raw of data.characters as CharacterData[]) {
    const { campaignId: _c, ...rest } = raw;
    const copy = taken.has(raw.id);
    await repo.saveCharacter({ ...rest, id: copy ? crypto.randomUUID() : raw.id, name: copy ? `${raw.name} (copia)` : raw.name, ownerUid: uid });
    n++;
  }
  return n;
}

/* ------------------------------------------------------------------ */
/* Campagna (solo Master)                                              */

interface CampaignBackup {
  format: typeof FORMAT;
  kind: "campaign";
  exportedAt: number;
  name: string;
  plans: EncounterPlan[];
  homebrew: Homebrew | null;
  loot: LootItem[];
  sessions: SessionNote[];
  sessionSecrets: Record<string, string>;
  handouts: Handout[];
  adventure: { meta: AdventureMeta | null; chapters: AdventureChapter[] };
}

export async function exportCampaign(campaignId: string, name: string, uid: string) {
  const [plans, homebrew, loot, sessions, sessionSecrets, handouts, adventure] = await Promise.all([
    once<EncounterPlan[]>((cb) => repo.watchEncounterPlans(campaignId, cb)),
    once<Homebrew | null>((cb) => repo.watchHomebrew(campaignId, cb)),
    once<LootItem[]>((cb) => repo.watchLoot(campaignId, cb)),
    once<SessionNote[]>((cb) => repo.watchSessions(campaignId, cb)),
    once<Record<string, string>>((cb) => repo.watchSessionSecrets(campaignId, cb)),
    once<Handout[]>((cb) => repo.watchHandouts(campaignId, { uid, isDm: true }, cb)),
    once<{ meta: AdventureMeta | null; chapters: AdventureChapter[] }>((cb) => repo.watchAdventure(campaignId, (meta, chapters) => cb({ meta, chapters }))),
  ]);
  const backup: CampaignBackup = { format: FORMAT, kind: "campaign", exportedAt: Date.now(), name, plans, homebrew, loot, sessions, sessionSecrets, handouts, adventure };
  download(`campagna-${safeName(name)}-${fileStamp()}.json`, backup);
}

/**
 * Ripristina nella campagna aperta ciò che c'è nel file: incontri, contenuti, bottino e avventura si sostituiscono;
 * sessioni e handout si aggiungono o aggiornano per id. Giocatori e personaggi non si toccano.
 */
export async function restoreCampaign(campaignId: string, text: string): Promise<CampaignBackup> {
  const data = JSON.parse(text) as CampaignBackup;
  if (data?.format !== FORMAT || data.kind !== "campaign") throw new Error("Il file non è un backup di campagna di Brock's DnD.");
  await repo.saveEncounterPlans(campaignId, data.plans ?? []);
  if (data.homebrew) await repo.saveHomebrew(campaignId, data.homebrew);
  await repo.saveLoot(campaignId, data.loot ?? []);
  for (const s of data.sessions ?? []) await repo.saveSession(campaignId, s);
  await repo.saveSessionSecrets(campaignId, data.sessionSecrets ?? {});
  for (const h of data.handouts ?? []) await repo.saveHandout(campaignId, h);
  const current = await once<AdventureChapter[]>((cb) => repo.watchAdventure(campaignId, (_m, chapters) => cb(chapters)));
  await repo.deleteAdventure(campaignId, current.map((c) => c.id), false);
  for (const ch of data.adventure?.chapters ?? []) await repo.saveAdventureChapter(campaignId, ch);
  if (data.adventure?.meta) await repo.saveAdventureMeta(campaignId, data.adventure.meta);
  return data;
}
