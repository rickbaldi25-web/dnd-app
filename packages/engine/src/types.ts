/**
 * Tipi del motore regole D&D 5e (regole 2024).
 *
 * Regola d'oro: tutto ciò che sta nei contenuti (classi, specie, background,
 * talenti, oggetti) è SERIALIZZABILE in JSON. Niente funzioni nei dati: così
 * lo stesso formato vale per l'SRD, per l'homebrew salvato su Firestore e per
 * i privilegi personalizzati di un singolo personaggio.
 */

export type Ability = "str" | "dex" | "con" | "int" | "wis" | "cha";
export const ABILITIES: readonly Ability[] = ["str", "dex", "con", "int", "wis", "cha"];

export type Die = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

/* ------------------------------------------------------------------ */
/* Valori e condizioni (mini-linguaggio dichiarativo)                  */
/* ------------------------------------------------------------------ */

/**
 * Un valore numerico calcolato a runtime.
 * - number                     costante
 * - { mod: "con" }             modificatore di caratteristica
 * - { score: "str" }           punteggio di caratteristica
 * - { prof: 1 }                bonus competenza × moltiplicatore
 * - { level: "total" }         livello del personaggio
 * - { level: "barbarian" }     livello in una classe
 * - { table: { by, values } }  tabella per livello (values[0] = livello 1)
 * - { sum: [...] } / { max: [...] } / { min: [...] }
 */
export type Value =
  | number
  | { mod: Ability }
  | { score: Ability }
  | { prof: number }
  | { level: "total" | string }
  | { table: { by: "total" | string; values: number[] } }
  | { sum: Value[] }
  | { max: Value[] }
  | { min: Value[] };

export type ArmorCategory = "light" | "medium" | "heavy";

export type Condition =
  | { toggle: string } // stato attivabile dal giocatore, es. "raging"
  | { armor: "none" | ArmorCategory | "any" } // armatura indossata (non lo scudo)
  | { shield: boolean }
  | { hasCondition: string } // condizione di gioco, es. "incapacitated"
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

/* ------------------------------------------------------------------ */
/* Effetti                                                             */
/* ------------------------------------------------------------------ */

/**
 * Bersagli numerici noti. Il tipo resta `string` per permettere estensioni,
 * ma questi sono quelli che il motore usa:
 *  ability.<ab>        punteggio di caratteristica
 *  ac                  classe armatura (bonus piatto)
 *  hp.max              punti ferita massimi
 *  speed.walk          velocità
 *  initiative          iniziativa
 *  save.<ab> / save.all
 *  skill.<id> / skill.all
 *  attack.melee / attack.ranged / attack.all
 *  damage.str          danni degli attacchi che usano Forza (es. Ira)
 *  crit.range          soglia critico (min wins)
 *  spell.dc            CD del tiro salvezza degli incantesimi
 *  spell.attack        tiro per colpire degli incantesimi
 */
export type NumericTarget = string;

export type Effect =
  | { type: "bonus"; target: NumericTarget; value: Value; when?: Condition; label?: string }
  /** Formula alternativa per la CA base: il motore prende la migliore. */
  | { type: "acFormula"; value: Value; when?: Condition; label?: string }
  /** Concede competenze, resistenze, lingue... */
  | {
      type: "grant";
      target:
        | "resistance"
        | "immunity"
        | "skill"
        | "expertise"
        | "save"
        | "armor"
        | "weapon"
        | "tool"
        | "language";
      values: string[];
      when?: Condition;
    }
  /** Vantaggio su un tipo di tiro: "save.dex", "check.str", "initiative", "skill.athletics", "save.vs.poisoned" */
  | { type: "advantage"; on: string; when?: Condition; label?: string }
  | { type: "sense"; sense: "darkvision" | "blindsight" | "tremorsense" | "truesight"; range: number; when?: Condition }
  /** Permette di usare un'altra caratteristica per certe abilità (si usa la migliore). */
  | { type: "altAbility"; skills: string[]; ability: Ability; when?: Condition }
  /** Soglia minima del critico (es. 19 per Improved Critical). */
  | { type: "critRange"; value: number; when?: Condition };

/* ------------------------------------------------------------------ */
/* Risorse, azioni, scelte, widget                                     */
/* ------------------------------------------------------------------ */

export interface ResourceDef {
  id: string;
  name: string;
  max: Value;
  /** Quanto si recupera con un riposo breve. Omesso = nulla. */
  shortRest?: number | "all";
  /** Con il riposo lungo si recupera sempre tutto, salvo diversa indicazione. */
  longRest?: number | "all";
  die?: string; // es. dado associato, informativo
}

export type ActionTiming = "action" | "bonus" | "reaction" | "free" | "special";

export interface ActionDef {
  id: string;
  name: string;
  timing: ActionTiming;
  cost?: { resource: string; amount: number };
  /** Tiro da effettuare: "1d10" + plus */
  roll?: { dice: string; plus?: Value };
  /** Cosa fa automaticamente (in modalità assistita/completa). */
  outcome?:
    | { kind: "heal" }
    | { kind: "tempHp" }
    | { kind: "toggleOn"; toggle: string }
    | { kind: "toggleOff"; toggle: string }
    | { kind: "note" };
  /** Condizione per poter usare l'azione */
  when?: Condition;
  description?: string;
}

export type ChoiceKind = "skill" | "feat" | "weaponMastery" | "subclass" | "tool" | "language" | "custom";

export interface ChoiceDef {
  id: string;
  kind: ChoiceKind;
  label: string;
  count: Value;
  /** Opzioni ammesse. Per "feat" può essere un tag: { tag: "fighting-style" } */
  from?: string[] | { tag: string };
}

/**
 * Riferimento a un componente UI. Il frontend ha un registry che mappa
 * "resource" -> <ResourceTracker/>, "toggle" -> <ToggleState/>, ecc.
 */
export interface WidgetRef {
  widget: string; // "resource" | "toggle" | "action" | "note" | ...
  ref?: string; // id della risorsa / toggle / azione
  props?: Record<string, unknown>;
}

export interface Feature {
  id: string;
  name: string;
  level?: number; // livello di classe a cui si ottiene (per classi/sottoclassi)
  description?: string;
  effects?: Effect[];
  resources?: ResourceDef[];
  actions?: ActionDef[];
  choices?: ChoiceDef[];
  widgets?: WidgetRef[];
  toggles?: { id: string; name: string; when?: Condition }[];
  /** Incantesimi concessi dal privilegio (di dominio, di specie, di talento...). */
  spells?: GrantedSpell[];
}

/* ------------------------------------------------------------------ */
/* Incantesimi                                                         */
/* ------------------------------------------------------------------ */

export type SpellSchool =
  | "abjuration"
  | "conjuration"
  | "divination"
  | "enchantment"
  | "evocation"
  | "illusion"
  | "necromancy"
  | "transmutation";

/** Il tiro "principale" di un incantesimo, quello che la scheda può fare da sola. */
export interface SpellRollDef {
  kind: "damage" | "heal" | "tempHp";
  dice: string; // "8d6"
  damageType?: string;
  /** Aggiunge il modificatore della caratteristica da incantatore. */
  addMod?: boolean;
  /** Dadi in più per ogni livello di slot sopra quello dell'incantesimo, es. "1d6". */
  perSlotLevel?: string;
  /** Trucchetti: i dadi raddoppiano, triplicano e quadruplicano ai livelli 5, 11 e 17. */
  cantripScaling?: boolean;
}

export interface SpellDef {
  id: string;
  name: string;
  /** 0 = trucchetto. */
  level: number;
  school: SpellSchool;
  castingTime: string; // "Azione", "Azione bonus", "1 minuto"...
  timing?: ActionTiming;
  range: string;
  components: string; // "V, S, M (un pizzico di zolfo)"
  duration: string;
  concentration?: boolean;
  ritual?: boolean;
  /** Liste di incantesimi a cui appartiene: di norma gli id delle classi. */
  lists: string[];
  description: string;
  higherLevels?: string;
  attack?: "melee" | "ranged";
  save?: Ability;
  roll?: SpellRollDef;
}

/**
 * Progressione degli slot:
 * - full   incantatore pieno (Mago, Chierico...)
 * - half   mezzo incantatore (Paladino, Ranger)
 * - third  un terzo (sottoclassi come il Cavaliere Mistico)
 * - pact   Magia del Patto: pochi slot, tutti dello stesso livello, a riposo breve
 */
export type CasterProgression = "full" | "half" | "third" | "pact";

export interface SpellcastingDef {
  ability: Ability;
  progression: CasterProgression;
  /** Lista da cui si scelgono gli incantesimi (di norma l'id della classe). */
  list: string;
  /** Trucchetti conosciuti per livello di classe (values[0] = livello 1). */
  cantrips?: number[];
  /** Incantesimi preparati per livello di classe. */
  prepared: number[];
  /** Livello di classe da cui si lanciano incantesimi. Omesso = 1. */
  fromLevel?: number;
  /** Quando si possono cambiare gli incantesimi preparati. Informativo. */
  changeOn?: "longRest" | "levelUp";
  /** Il Mago prepara dal proprio libro degli incantesimi. */
  spellbook?: boolean;
}

export interface GrantedSpell {
  spellId: string;
  /** Livello minimo per averlo, es. gli incantesimi di dominio di 3° al livello 5 da Chierico. */
  minLevel?: { by: "total" | string; level: number };
  /** Classe con cui lo si lancia. Omesso = la classe del privilegio. */
  source?: string;
  /** Caratteristica da incantatore quando non dipende da una classe (specie, talenti). */
  ability?: Ability;
  /** Risorsa che permette di lanciarlo senza slot (es. 1 volta per riposo lungo). */
  resource?: string;
}

/* ------------------------------------------------------------------ */
/* Contenuti                                                           */
/* ------------------------------------------------------------------ */

export interface SkillDef {
  id: string;
  name: string;
  ability: Ability;
}

export interface ProficiencySet {
  armor?: (ArmorCategory | "shield")[];
  weapons?: string[]; // "simple", "martial" o id specifici
  tools?: string[];
  saves?: Ability[];
}

export interface ClassDef {
  id: string;
  name: string;
  hitDie: Die;
  primaryAbility: Ability[]; // per il multiclasse: basta una (es. Guerriero: str O dex)
  proficiencies: ProficiencySet; // come classe iniziale
  multiclassProficiencies: ProficiencySet;
  skillChoice: { count: number; from: string[] };
  weaponMasteries?: Value;
  /** Armi ammesse per la Maestria (es. Barbaro: solo mischia). Omesso = tutte. */
  weaponMasteryFrom?: string[];
  subclassLevel: number;
  spellcasting?: SpellcastingDef;
  features: Feature[];
}

export interface SubclassDef {
  id: string;
  classId: string;
  name: string;
  /** Per le sottoclassi che danno incantesimi a una classe che non ne ha. */
  spellcasting?: SpellcastingDef;
  features: Feature[];
}

export interface SpeciesDef {
  id: string;
  name: string;
  size: "Small" | "Medium" | "Small or Medium";
  speed: number;
  features: Feature[];
}

export interface BackgroundDef {
  id: string;
  name: string;
  abilities: [Ability, Ability, Ability];
  featId: string;
  skills: string[];
  tools?: string[];
  toolChoice?: { label: string; from: string[] };
}

export interface FeatDef {
  id: string;
  name: string;
  category: "origin" | "general" | "fighting-style" | "epic-boon";
  tags?: string[];
  feature: Feature;
}

export interface ArmorDef {
  id: string;
  name: string;
  kind: "armor";
  category: ArmorCategory;
  baseAC: number;
  dexCap: number | null; // null = Des piena, 0 = niente Des
  strength?: number;
  stealthDisadvantage?: boolean;
}

export interface ShieldDef {
  id: string;
  name: string;
  kind: "shield";
  bonus: number;
}

export type WeaponProperty =
  | "finesse"
  | "heavy"
  | "light"
  | "loading"
  | "reach"
  | "thrown"
  | "two-handed"
  | "versatile"
  | "ammunition";

export interface WeaponDef {
  id: string;
  name: string;
  kind: "weapon";
  category: "simple" | "martial";
  range: "melee" | "ranged";
  damage: string; // "1d8"
  damageType: "bludgeoning" | "piercing" | "slashing";
  properties: WeaponProperty[];
  versatile?: string;
  mastery: string; // "Cleave", "Topple", ...
  rangeFt?: [number, number];
}

export interface GearDef {
  id: string;
  name: string;
  kind: "gear";
}

export type ItemDef = ArmorDef | ShieldDef | WeaponDef | GearDef;

export interface ContentPack {
  id: string;
  name: string;
  license?: string;
  classes?: ClassDef[];
  subclasses?: SubclassDef[];
  species?: SpeciesDef[];
  backgrounds?: BackgroundDef[];
  feats?: FeatDef[];
  items?: ItemDef[];
  skills?: SkillDef[];
  spells?: SpellDef[];
}

/* ------------------------------------------------------------------ */
/* Personaggio (ciò che si salva)                                      */
/* ------------------------------------------------------------------ */

export type AutomationLevel = "manual" | "assisted" | "full";

/** Una voce per ogni livello acquisito, in ordine. levels[0] = primo livello. */
export interface LevelEntry {
  classId: string;
  /** PF guadagnati al livello (dado tirato o "avg"). Ignorato per levels[0]: si prende il massimo. */
  hp: number | "avg";
}

export interface EquipmentEntry {
  itemId: string;
  equipped?: boolean;
  quantity?: number;
  notes?: string;
}

export interface CharacterState {
  hpCurrent: number;
  hpTemp: number;
  hitDiceSpent: Partial<Record<Die, number>>;
  resourcesSpent: Record<string, number>;
  toggles: Record<string, boolean>;
  conditions: string[];
  exhaustion: number; // 0-6
  deathSaves: { success: number; failure: number };
  heroicInspiration: boolean;
  /** Slot spesi per livello di incantesimo ("1".."9"). Opzionali: i personaggi salvati prima non li hanno. */
  spellSlotsSpent?: Record<string, number>;
  pactSlotsSpent?: number;
  concentration?: { spellId: string; name: string } | null;
}

/** Incantesimi scelti per una classe da incantatore. */
export interface SpellSelection {
  cantrips: string[];
  prepared: string[];
  /** Solo per chi ha un libro degli incantesimi. */
  spellbook?: string[];
}

export interface CharacterData {
  schemaVersion: 1;
  id: string;
  name: string;
  ownerUid?: string;
  campaignId?: string;
  speciesId: string;
  backgroundId: string;
  levels: LevelEntry[];
  subclasses: Record<string, string>; // classId -> subclassId
  /** Punteggi base (point buy, array standard o tiri), PRIMA del background. */
  abilityScores: Record<Ability, number>;
  /** Bonus del background 2024: +2/+1 oppure +1/+1/+1 sulle sue tre caratteristiche. */
  backgroundBoosts: Partial<Record<Ability, number>>;
  /** Scelte fatte: chiave = ChoiceDef.id, valore = opzioni scelte. */
  choices: Record<string, string[]>;
  /** Incantesimi scelti: chiave = id della classe da incantatore. */
  spells?: Record<string, SpellSelection>;
  equipment: EquipmentEntry[];
  state: CharacterState;
  settings: { automation?: AutomationLevel };
  /** Valori forzati a mano (es. "ac", "hp.max", "skill.stealth"). Ignorati in modalità "full". */
  overrides: Record<string, number>;
  customFeatures?: Feature[];
  portraitUrl?: string;
  notes?: string;
}

/* ------------------------------------------------------------------ */
/* Scheda calcolata (output del motore)                                */
/* ------------------------------------------------------------------ */

export interface Part {
  label: string;
  value: number;
}

export interface Stat {
  value: number;
  computed: number; // valore calcolato prima di eventuali override
  parts: Part[];
  overridden: boolean;
}

export type Severity = "error" | "warning" | "info";
export interface Issue {
  severity: Severity;
  code: string;
  message: string;
  path?: string;
}

export interface ComputedResource {
  id: string;
  name: string;
  source: string;
  max: number;
  spent: number;
  remaining: number;
  shortRest?: number | "all";
  longRest: number | "all";
}

export interface ComputedAttack {
  itemId: string;
  name: string;
  ability: Ability;
  toHit: Stat;
  damage: string; // es. "1d12+5"
  damageType: string;
  mastery?: string;
  masteryActive: boolean;
  properties: WeaponProperty[];
  critRange: number;
}

export interface SlotPool {
  level: number;
  max: number;
  spent: number;
  remaining: number;
}

/** Una classe (o sottoclasse) con cui il personaggio lancia incantesimi. */
export interface ComputedSpellSource {
  id: string; // id della classe
  name: string;
  ability: Ability;
  progression: CasterProgression;
  list: string;
  saveDC: Stat;
  attackBonus: Stat;
  cantripsMax: number;
  preparedMax: number;
  /** Livello massimo degli incantesimi che si possono preparare con questa classe. */
  maxSpellLevel: number;
  cantrips: string[];
  prepared: string[];
  changeOn?: "longRest" | "levelUp";
  spellbook: boolean;
}

/** Un incantesimo che il personaggio può lanciare adesso. */
export interface ComputedSpell {
  spellId: string;
  name: string;
  level: number;
  school: SpellSchool;
  sourceId: string;
  sourceName: string;
  ability: Ability;
  /** Sempre preparato (dominio, giuramento, specie): non conta nel numero dei preparati. */
  always: boolean;
  concentration: boolean;
  ritual: boolean;
  castingTime: string;
  range: string;
  attackBonus?: number;
  save?: Ability;
  saveDC?: number;
  /** Dadi del tiro principale al livello base, es. "8d6" o "1d8+3". */
  roll?: string;
  /** Risorsa che permette di lanciarlo senza slot. */
  resource?: string;
}

export interface ComputedSpellcasting {
  sources: ComputedSpellSource[];
  /** Slot condivisi fra le classi (regola del multiclasse). */
  slots: SlotPool[];
  /** Slot della Magia del Patto: separati, tornano con il riposo breve. */
  pact?: SlotPool;
  concentration?: { spellId: string; name: string };
  spells: ComputedSpell[];
}

export interface ComputedSheet {
  automation: AutomationLevel;
  level: number;
  classLevels: Record<string, number>;
  proficiencyBonus: number;
  abilities: Record<Ability, { score: Stat; mod: number }>;
  saves: Record<Ability, { mod: Stat; proficient: boolean; advantage: boolean }>;
  skills: Record<
    string,
    { name: string; ability: Ability; mod: Stat; proficient: boolean; expertise: boolean; advantage: boolean }
  >;
  passivePerception: number;
  ac: Stat;
  hpMax: Stat;
  initiative: Stat & { advantage: boolean };
  speed: Stat;
  hitDice: { die: Die; total: number; spent: number }[];
  critRange: number;
  attacks: ComputedAttack[];
  resources: ComputedResource[];
  actions: (ActionDef & { source: string; available: boolean })[];
  toggles: { id: string; name: string; active: boolean; available: boolean }[];
  features: { id: string; name: string; source: string; description?: string }[];
  pendingChoices: (ChoiceDef & { source: string; required: number; made: number })[];
  widgets: WidgetRef[];
  resistances: string[];
  immunities: string[];
  senses: { sense: string; range: number }[];
  advantages: { on: string; label?: string }[];
  proficiencies: { armor: string[]; weapons: string[]; tools: string[]; languages: string[] };
  /** Assente se il personaggio non lancia incantesimi. */
  spellcasting?: ComputedSpellcasting;
  issues: Issue[];
}
