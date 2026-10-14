import type { AutomationLevel, CharacterData, Coin, ItemDef, MonsterDef, SpellDef } from "@dnd/engine";

export type Unsubscribe = () => void;

export interface UserPrefs {
  automation?: AutomationLevel;
}

/** Una campagna: il Master la crea, i giocatori entrano con il codice (che è il suo id). */
export interface Campaign {
  id: string;
  name: string;
  dmUid: string;
  dmName: string;
  memberUids: string[];
  /** Livello di automazione imposto dal Master a tutti i personaggi della campagna. */
  automationLock?: AutomationLevel;
  /** Come si sale di livello: con i PE (di partenza) o a pietre miliari, decise dal Master. */
  progression?: "xp" | "milestone";
}

/** Un mostro in combattimento, per come lo vedono tutti: nome e iniziativa, niente statistiche. */
export interface EncounterMonster {
  id: string;
  name: string;
  initiative: number | null;
  /** Condizioni visibili a tutti: id -> round che restano (null = senza scadenza). */
  conditions?: Record<string, number | null>;
}

/** Il combattimento in corso, visibile a tutta la campagna. L'iniziativa dei PG sta sui personaggi. */
export interface Encounter {
  active: boolean;
  round: number;
  /** Di chi è il turno: id di un personaggio o di un mostro. */
  currentId?: string;
  monsters: EncounterMonster[];
  /** Condizioni che scadono a un turno preciso; chiave "bersaglio|condizione". Le altre contano a round. */
  timers?: Record<string, ConditionTimer>;
}

/** Scadenza legata al turno di una creatura: all'inizio o alla fine. skip = la fine del turno in corso non conta. */
export interface ConditionTimer {
  tick: "start" | "end";
  on: string;
  skip?: boolean;
}

/** Ciò che dei mostri vede solo il Master. */
export interface MonsterSecret {
  hp: number;
  hpMax: number;
  ac: number;
  /** Bonus all'iniziativa, per il tasto "Tira". */
  initiativeBonus: number;
  /** Id nella raccolta dei mostri, se viene da lì: serve ad aprirne la scheda. */
  monsterId?: string;
  /** Grado di sfida, per i PE a fine combattimento. */
  cr?: string;
}

/** Un gruppo di mostri uguali in un incontro preparato. */
export interface PlanEntry {
  name: string;
  count: number;
  hp: number;
  ac: number;
  initiativeBonus: number;
  /** Grado di sfida, per il conto dei PE. */
  cr?: string;
  monsterId?: string;
}

/** Una nota dell'avventura: titolo e testo. */
export interface AdventureNote {
  title: string;
  text: string;
}
/** Un documento esterno da consultare, per esempio il PDF dell'avventura. */
export interface AdventureDoc {
  title: string;
  url: string;
}
/** L'avventura della campagna: solo il Master la vede. */
export interface AdventureMeta {
  name: string;
  notes: AdventureNote[];
  /** Oggetti propri dell'avventura, con la loro descrizione. */
  items: AdventureNote[];
  docs: AdventureDoc[];
  importedAt?: number;
}
export interface AdventureEncounter {
  name: string;
  notes: AdventureNote[];
  treasure: { name: string; quantity: number; text?: string }[];
  /** Mostri raggruppati: "3 × Goblin". */
  groups: { label: string; count: number; hp: number; ac: number; cr: string; name: string }[];
  planId?: string;
}
/** Un capitolo, salvato in un documento a sé per stare nei limiti di Firestore. */
export interface AdventureChapter {
  id: string;
  order: number;
  name: string;
  notes: AdventureNote[];
  npcs: { label: string; monster: MonsterDef }[];
  encounters: AdventureEncounter[];
}

/** Un oggetto del tesoro: dai manuali (itemId) oppure scritto a mano. */
export interface TreasureItem {
  name: string;
  quantity: number;
  itemId?: string;
  notes?: string;
  /** Se sono monete: quali. La quantità è il numero di monete. */
  coin?: Coin;
}
/** Un oggetto del bottino ancora da consegnare. */
export interface LootItem extends TreasureItem {
  id: string;
}

/** Un incontro che il Master prepara prima della sessione. Lo vede solo lui. */
export interface EncounterPlan {
  id: string;
  name: string;
  /** Capitolo dell'avventura a cui appartiene, per raggrupparli. */
  chapter?: string;
  entries: PlanEntry[];
  /** Tesoro che finisce nel bottino quando l'incontro parte. */
  treasure?: TreasureItem[];
  /** Note dell'avventura (tattiche, cosa succede se...), mostrate al Master durante il combattimento. */
  notes?: AdventureNote[];
  /** Da dove viene, se importato da un'avventura. */
  source?: { chapterId: string; index: number };
}

/** Un foglio che il Master mostra ai giocatori: una lettera, una mappa, un ritratto. */
export interface Handout {
  id: string;
  title: string;
  text: string;
  /** Indirizzo https di un'immagine già online. */
  imageUrl?: string;
  /** Visibile a tutti i giocatori. */
  everyone: boolean;
  /** Oppure solo a questi utenti (uid). */
  visibleTo: string[];
  createdAt: number;
  /** Quando è stato mostrato l'ultima volta: serve a ordinare e a segnalare i nuovi. */
  revealedAt?: number;
}

/** Una sessione di gioco: il riassunto lo leggono tutti, gli appunti del Master stanno a parte. */
export interface SessionNote {
  id: string;
  title: string;
  /** Giorno della sessione, AAAA-MM-GG. */
  date: string;
  /** Riassunto per i giocatori. */
  recap: string;
  createdAt: number;
  /** PE assegnati al gruppo in questa sessione, una voce per combattimento o ricompensa. */
  awards?: { label: string; xp: number; at: number }[];
}

/** Oggetti e incantesimi propri della campagna, inseriti dal Master. */
export interface Homebrew {
  items: ItemDef[];
  spells: SpellDef[];
}

/** Un tiro condiviso con la campagna. */
export interface SharedRoll {
  id: string;
  uid: string;
  /** Chi ha tirato: il nome del personaggio, oppure "Master". */
  author: string;
  title: string;
  rolls: { label: string; expr: string; dice: number[]; total: number }[];
  at: number;
  /** Visibile solo al Master. */
  secret?: boolean;
}

/** Ultimo segnale di presenza di un utente nella campagna. */
export interface Presence {
  uid: string;
  name: string;
  /** Millisecondi, dall'orologio di chi l'ha scritto. */
  at: number;
}

/**
 * Dopo questo tempo senza segnali un utente non conta più come connesso.
 * Largo apposta: in secondo piano i browser rallentano i timer fino a un colpo al minuto.
 */
export const PRESENCE_TTL_MS = 150_000;

/** Codice d'invito: 8 caratteri senza quelli che si confondono a voce o a vista (0/O, 1/I/L). */
export function newCampaignCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

/**
 * Accesso ai dati. La UI conosce solo questa interfaccia:
 * oggi Firestore o localStorage, domani qualsiasi altro backend.
 */
export interface Repository {
  watchCharacters(ownerUid: string, cb: (list: CharacterData[]) => void): Unsubscribe;
  watchCharacter(id: string, cb: (ch: CharacterData | null) => void): Unsubscribe;
  /** Scrive il personaggio intero: per crearlo o importarlo. */
  saveCharacter(ch: CharacterData): Promise<void>;
  /**
   * Salva solo i campi che cambiano tra prev e next. Così Master e giocatore possono
   * toccare lo stesso personaggio nello stesso momento senza cancellarsi le modifiche.
   */
  updateCharacter(prev: CharacterData, next: CharacterData): Promise<void>;
  deleteCharacter(id: string): Promise<void>;
  /** Campagne in cui l'utente è Master o giocatore. */
  watchCampaigns(uid: string, cb: (list: Campaign[]) => void): Unsubscribe;
  watchCampaign(id: string, cb: (c: Campaign | null) => void): Unsubscribe;
  /** Personaggi collegati a una campagna, di tutti i giocatori. */
  watchCampaignCharacters(campaignId: string, cb: (list: CharacterData[]) => void): Unsubscribe;
  createCampaign(name: string, dm: { uid: string; name: string }): Promise<Campaign>;
  /** Entra con il codice. Errore se il codice non esiste. */
  joinCampaign(code: string, uid: string): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  /** Solo il Master. null toglie il blocco. */
  setAutomationLock(id: string, level: AutomationLevel | null): Promise<void>;
  /** Solo il Master. */
  setProgression(id: string, progression: "xp" | "milestone"): Promise<void>;
  /** Il giocatore si toglie dall'elenco. I suoi personaggi vanno scollegati a parte. */
  leaveCampaign(id: string, uid: string): Promise<void>;
  watchEncounter(campaignId: string, cb: (e: Encounter | null) => void): Unsubscribe;
  /** Solo il Master. */
  saveEncounter(campaignId: string, encounter: Encounter): Promise<void>;
  /** Solo il Master: gli altri non ricevono nulla. Chiave = id del mostro. */
  watchMonsterSecrets(campaignId: string, cb: (secrets: Record<string, MonsterSecret>) => void): Unsubscribe;
  saveMonsterSecrets(campaignId: string, secrets: Record<string, MonsterSecret>): Promise<void>;
  /** Solo il Master: gli incontri preparati. */
  watchEncounterPlans(campaignId: string, cb: (plans: EncounterPlan[]) => void): Unsubscribe;
  saveEncounterPlans(campaignId: string, plans: EncounterPlan[]): Promise<void>;
  /** Il Master li riceve tutti, un giocatore solo quelli che gli sono stati mostrati. */
  watchHandouts(campaignId: string, viewer: { uid: string; isDm: boolean }, cb: (list: Handout[]) => void): Unsubscribe;
  /** Solo il Master: crea o sostituisce. */
  saveHandout(campaignId: string, handout: Handout): Promise<void>;
  deleteHandout(campaignId: string, id: string): Promise<void>;
  watchSessions(campaignId: string, cb: (list: SessionNote[]) => void): Unsubscribe;
  /** Solo il Master: crea o sostituisce. */
  saveSession(campaignId: string, session: SessionNote): Promise<void>;
  deleteSession(campaignId: string, id: string): Promise<void>;
  /** Solo il Master: i suoi appunti riservati, per id di sessione. */
  watchSessionSecrets(campaignId: string, cb: (notes: Record<string, string>) => void): Unsubscribe;
  saveSessionSecrets(campaignId: string, notes: Record<string, string>): Promise<void>;
  /** Solo il Master: il bottino ancora da consegnare. */
  watchLoot(campaignId: string, cb: (items: LootItem[]) => void): Unsubscribe;
  saveLoot(campaignId: string, items: LootItem[]): Promise<void>;
  /** Solo il Master: l'avventura (meta = null se non c'è). */
  watchAdventure(campaignId: string, cb: (meta: AdventureMeta | null, chapters: AdventureChapter[]) => void): Unsubscribe;
  saveAdventureMeta(campaignId: string, meta: AdventureMeta): Promise<void>;
  saveAdventureChapter(campaignId: string, chapter: AdventureChapter): Promise<void>;
  /** Toglie i capitoli indicati e, se whole, anche la scheda dell'avventura. */
  deleteAdventure(campaignId: string, chapterIds: string[], whole: boolean): Promise<void>;
  /** Solo il Master: le note degli incontri in corso. */
  watchCombatNotes(campaignId: string, cb: (notes: AdventureNote[]) => void): Unsubscribe;
  saveCombatNotes(campaignId: string, notes: AdventureNote[]): Promise<void>;
  watchHomebrew(campaignId: string, cb: (h: Homebrew | null) => void): Unsubscribe;
  /** Solo il Master. */
  saveHomebrew(campaignId: string, homebrew: Homebrew): Promise<void>;
  /** secret = tiro del Master che i giocatori non vedono. */
  addRoll(campaignId: string, roll: Omit<SharedRoll, "id">): Promise<void>;
  /** Solo il Master: cancella tutti i tiri, pubblici e segreti. */
  clearRolls(campaignId: string): Promise<void>;
  /** Gli ultimi tiri, dal più recente. secret = quelli riservati al Master. */
  watchRolls(campaignId: string, secret: boolean, cb: (list: SharedRoll[]) => void): Unsubscribe;
  /** "Sono qui": da richiamare a intervalli finché la pagina è aperta. */
  touchPresence(campaignId: string, user: { uid: string; name: string }): Promise<void>;
  watchPresence(campaignId: string, cb: (list: Presence[]) => void): Unsubscribe;
  /** Cosa l'utente ha già visto in una campagna (handout, riassunti): uguale su tutti i suoi dispositivi. */
  watchSeen(uid: string, campaignId: string, cb: (seen: Record<string, Record<string, string | number>>) => void): Unsubscribe;
  saveSeen(uid: string, campaignId: string, kind: string, entries: Record<string, string | number>): Promise<void>;
  getPrefs(uid: string): Promise<UserPrefs>;
  savePrefs(uid: string, prefs: UserPrefs): Promise<void>;
}
