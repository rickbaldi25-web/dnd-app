import type { AutomationLevel, CharacterData, ItemDef, SpellDef } from "@dnd/engine";

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

/** Un incontro che il Master prepara prima della sessione. Lo vede solo lui. */
export interface EncounterPlan {
  id: string;
  name: string;
  entries: PlanEntry[];
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
  getPrefs(uid: string): Promise<UserPrefs>;
  savePrefs(uid: string, prefs: UserPrefs): Promise<void>;
}
