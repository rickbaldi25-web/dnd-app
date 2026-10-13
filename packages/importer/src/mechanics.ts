/**
 * Meccaniche codificate a mano.
 *
 * Il compendio descrive i privilegi a parole: qui si aggiunge, privilegio per privilegio,
 * ciò che la scheda può calcolare o far tirare (azioni, dadi, effetti, risorse, scelte).
 * Si applica dopo l'importazione e prima delle traduzioni. Contiene solo regole, non testi dei manuali.
 *
 * Chiave = id del privilegio (o dell'opzione). "*.suffisso" vale per tutti gli id che finiscono
 * così, quando non c'è una voce con l'id esatto (es. gli stili di combattimento, uguali per più classi).
 */
import type { ActionDef, Condition, ContentPack, Feature, Value } from "@dnd/engine";

type Mechanics = Pick<Feature, "effects" | "actions" | "resources" | "choices" | "dice" | "spells" | "toggles" | "widgets">;

/** Tabella per livello di classe a partire dalle soglie: at("rogue", { 1: 2, 6: 4 }). */
const at = (by: string, thresholds: Record<number, number>): Value => {
  const values: number[] = [];
  for (let lv = 1, cur = 0; lv <= 20; lv++) values.push((cur = thresholds[lv] ?? cur));
  return { table: { by, values } };
};
const halfUp = (v: Value): Value => ({ div: [v, 2], round: "up" });
const note = (id: string, name: string, timing: ActionDef["timing"], description: string, resource?: string): ActionDef => ({
  id,
  name,
  timing,
  ...(resource ? { cost: { resource, amount: 1 } } : {}),
  outcome: { kind: "note" },
  description,
});

const CHANNEL = "cleric.channel-divinity";
const PALADIN_CHANNEL = "paladin.channel-divinity";
const RAGING: Condition = { toggle: "raging" };
const MARTIAL_DIE = at("monk", { 1: 4, 5: 6, 11: 8, 17: 10 });
const ALL_SKILLS = [
  "acrobatics", "animal-handling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation",
  "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight-of-hand", "stealth", "survival",
];

export const MECHANICS: Record<string, Mechanics> = {
  /* ---------------- Comuni a più classi ---------------- */
  "*.extra-attack": { effects: [{ type: "extraAttack", attacks: 2 }] },
  "*.fighting-style.archery": { effects: [{ type: "bonus", target: "attack.ranged", value: 2, label: "Stile: Tiro" }] },
  "*.fighting-style.defense": { effects: [{ type: "bonus", target: "ac", value: 1, when: { armor: "any" }, label: "Stile: Difesa" }] },
  "*.fighting-style.blind-fighting": { effects: [{ type: "sense", sense: "blindsight", range: 10 }] },
  "*.fighting-style.unarmed-fighting": { effects: [{ type: "unarmed", die: 6 }] },
  "*.divine-strike": { dice: [{ id: "cleric.divine-strike", name: "Colpo Divino", dice: { count: at("cleric", { 8: 1, 14: 2 }), sides: 8 }, note: "Una volta per turno, quando colpisci con un'arma" }] },

  /* ---------------- Guerriero ---------------- */
  "fighter.second-wind": {
    actions: [{ id: "fighter.second-wind", name: "Recuperare Energie", timing: "bonus", cost: { resource: "fighter.second-wind", amount: 1 }, roll: { dice: "1d10", plus: { level: "fighter" } }, outcome: { kind: "heal" } }],
  },
  "fighter.action-surge": { actions: [note("fighter.action-surge", "Azione Impetuosa", "special", "Un'azione in più in questo turno.", "fighter.action-surge")] },
  "fighter.extra-attack": { effects: [{ type: "extraAttack", attacks: at("fighter", { 1: 1, 5: 2, 11: 3, 20: 4 }) }] },
  "fighter.indomitable": { actions: [note("fighter.indomitable", "Indomito", "free", "Ritira un tiro salvezza fallito: devi usare il nuovo risultato.", "fighter.indomitable")] },
  "fighter.champion.improved-critical": { effects: [{ type: "critRange", value: 19 }] },
  "fighter.champion.superior-critical": { effects: [{ type: "critRange", value: 18 }] },
  "fighter.champion.remarkable-athlete": { effects: [{ type: "bonus", target: "initiative", value: halfUp({ prof: 1 }), label: "Atleta Straordinario" }] },
  "fighter.battle-master.combat-superiority": {
    dice: [{ id: "fighter.superiority-die", name: "Dado di superiorità", dice: { sides: at("fighter", { 3: 8, 10: 10, 18: 12 }) }, note: "Si spende con una manovra" }],
  },

  /* ---------------- Ladro ---------------- */
  "rogue.expertise": { choices: [{ id: "rogue.expertise", kind: "expertise", label: "Maestria", count: at("rogue", { 1: 2, 6: 4 }) }] },
  "rogue.sneak-attack": {
    dice: [{ id: "rogue.sneak-attack", name: "Attacco Furtivo", dice: { count: halfUp({ level: "rogue" }), sides: 6 }, note: "Una volta per turno, con un'arma accurata o a distanza e vantaggio (o un alleato vicino al bersaglio)" }],
  },
  "rogue.cunning-action": { actions: [note("rogue.cunning-action", "Azione Scaltra", "bonus", "Scatto, Disimpegno o Nascondersi come azione bonus.")] },
  "rogue.steady-aim": { actions: [note("rogue.steady-aim", "Mira Stabile", "bonus", "Vantaggio al prossimo tiro per colpire di questo turno, se non ti sei mosso. La tua velocità è 0 fino a fine turno.")] },
  "rogue.uncanny-dodge": { actions: [note("rogue.uncanny-dodge", "Schivata Prodigiosa", "reaction", "Dimezzi i danni dell'attacco di un attaccante che puoi vedere.")] },
  "rogue.blindsense": { effects: [{ type: "sense", sense: "blindsight", range: 10 }] },
  "rogue.stroke-of-luck": { actions: [note("rogue.stroke-of-luck", "Colpo di Fortuna", "free", "Un attacco mancato colpisce, oppure una prova fallita vale come un 20 sul d20.", "rogue.stroke-of-luck")] },
  "rogue.thief.second-story-work": { effects: [{ type: "speed", mode: "climb", value: "walk" }] },
  "rogue.assassin.bonus-proficiencies": { effects: [{ type: "grant", target: "tool", values: ["disguise-kit", "poisoners-kit"] }] },

  /* ---------------- Bardo (solo ciò che condivide con il Ladro) ---------------- */
  "bard.expertise": { choices: [{ id: "bard.expertise", kind: "expertise", label: "Maestria", count: at("bard", { 3: 2, 10: 4 }) }] },

  /* ---------------- Chierico ---------------- */
  "cleric.channel-divinity-turn-undead": {
    actions: [note("cleric.turn-undead", "Scacciare Non Morti", "action", "Ogni non morto entro 9 m che ti vede o ti sente: tiro salvezza su Saggezza contro la CD dei tuoi incantesimi, o è scacciato per 1 minuto.", CHANNEL)],
  },
  "cleric.harness-divine-power": {
    actions: [
      {
        id: "cleric.harness-divine-power",
        name: "Imbrigliare il Potere Divino",
        timing: "bonus",
        cost: { resource: "cleric.harness-divine-power", amount: 1 },
        outcome: { kind: "recoverSlots", budget: halfUp({ prof: 1 }) },
        description: "Recuperi uno slot speso. Spende anche un utilizzo di Incanalare Divinità: segnalo a mano.",
      },
    ],
  },
  "cleric.divine-intervention": {
    actions: [{ id: "cleric.divine-intervention", name: "Intervento Divino", timing: "action", roll: { dice: "1d100" }, outcome: { kind: "note" }, description: "Riesce se il risultato è pari o inferiore al tuo livello da chierico." }],
  },
  "cleric.life-domain.bonus-proficiency": { effects: [{ type: "grant", target: "armor", values: ["heavy"] }] },
  "cleric.life-domain.channel-divinity-preserve-life": {
    actions: [note("cleric.preserve-life", "Preservare Vita", "action", "Ripristini in tutto 5 PF per livello da chierico, divisi tra creature entro 9 m, fino a metà dei loro PF massimi.", CHANNEL)],
  },
  "cleric.war-domain.bonus-proficiencies": { effects: [{ type: "grant", target: "armor", values: ["heavy"] }, { type: "grant", target: "weapon", values: ["martial"] }] },
  "cleric.war-domain.war-priest": {
    resources: [{ id: "cleric.war-priest", name: "Sacerdote di Guerra", max: { max: [1, { mod: "wis" }] }, longRest: "all" }],
    actions: [note("cleric.war-priest", "Sacerdote di Guerra", "bonus", "Un attacco con un'arma come azione bonus, quando usi l'azione di Attacco.", "cleric.war-priest")],
  },
  "cleric.war-domain.channel-divinity-guided-strike": { actions: [note("cleric.guided-strike", "Colpo Guidato", "special", "+10 a un tiro per colpire, dopo aver visto il tiro.", CHANNEL)] },
  "cleric.light-domain.bonus-cantrip": { spells: [{ spellId: "light" }] },
  "cleric.light-domain.warding-flare": {
    resources: [{ id: "cleric.warding-flare", name: "Bagliore Protettivo", max: { max: [1, { mod: "wis" }] }, longRest: "all" }],
    actions: [note("cleric.warding-flare", "Bagliore Protettivo", "reaction", "Svantaggio al tiro per colpire di una creatura entro 9 m che ti attacca.", "cleric.warding-flare")],
  },
  "cleric.light-domain.channel-divinity-radiance-of-the-dawn": {
    actions: [
      {
        id: "cleric.radiance-of-the-dawn",
        name: "Fulgore dell'Alba",
        timing: "action",
        cost: { resource: CHANNEL, amount: 1 },
        roll: { dice: "2d10", plus: { level: "cleric" } },
        outcome: { kind: "note" },
        description: "Danni radiosi a ogni creatura ostile entro 9 m: tiro salvezza su Costituzione per dimezzarli. Dissolve l'oscurità magica.",
      },
    ],
  },

  /* ---------------- Mago ---------------- */
  "wizard.arcane-recovery": {
    actions: [
      {
        id: "wizard.arcane-recovery",
        name: "Recupero Arcano",
        timing: "special",
        cost: { resource: "wizard.arcane-recovery", amount: 1 },
        outcome: { kind: "recoverSlots", budget: halfUp({ level: "wizard" }), maxLevel: 5 },
        description: "Alla fine di un riposo breve, una volta al giorno.",
      },
    ],
  },
  "wizard.school-of-abjuration.arcane-ward": {
    resources: [{ id: "wizard.arcane-ward", name: "Interdizione Arcana (PF)", max: { sum: [{ times: [{ level: "wizard" }, 2] }, { mod: "int" }] }, longRest: "all" }],
  },

  /* ---------------- Barbaro ---------------- */
  "barbarian.rage": {
    toggles: [{ id: "raging", name: "Ira" }],
    widgets: [{ widget: "toggle", ref: "raging", props: { accent: "danger" } }],
    actions: [
      { id: "barbarian.rage", name: "Ira", timing: "bonus", cost: { resource: "barbarian.rage", amount: 1 }, outcome: { kind: "toggleOn", toggle: "raging" }, when: { not: { toggle: "raging" } } },
      { id: "barbarian.rage.end", name: "Termina l'Ira", timing: "bonus", outcome: { kind: "toggleOff", toggle: "raging" }, when: { toggle: "raging" } },
    ],
    effects: [
      { type: "bonus", target: "damage.str", value: at("barbarian", { 1: 2, 9: 3, 16: 4 }), when: RAGING, label: "Ira" },
      { type: "grant", target: "resistance", values: ["bludgeoning", "piercing", "slashing"], when: RAGING },
      { type: "advantage", on: "check.str", when: RAGING, label: "Ira" },
      { type: "advantage", on: "save.str", when: RAGING, label: "Ira" },
    ],
  },
  "barbarian.reckless-attack": { actions: [note("barbarian.reckless-attack", "Attacco Irruento", "free", "Vantaggio ai tuoi attacchi in mischia con Forza per questo turno; gli attacchi contro di te hanno vantaggio fino al tuo prossimo turno.")] },
  "barbarian.danger-sense": { effects: [{ type: "advantage", on: "save.dex", label: "Percezione del Pericolo (effetti che vedi)" }] },
  "barbarian.feral-instinct": { effects: [{ type: "advantage", on: "initiative", label: "Istinto Ferino" }] },
  "barbarian.relentless-rage": { actions: [note("barbarian.relentless-rage", "Ira Implacabile", "free", "Se scendi a 0 PF in ira: tiro salvezza su Costituzione CD 10 (+5 a ogni uso fino al riposo) per restare a 1 PF.")] },
  "barbarian.primal-champion": { effects: [{ type: "abilityMax", ability: "str", value: 24 }, { type: "abilityMax", ability: "con", value: 24 }] },
  "barbarian.path-of-the-berserker.frenzy": { actions: [note("barbarian.frenzy", "Frenesia", "free", "Per questa ira: un attacco in mischia come azione bonus a ogni turno. A fine ira subisci 1 livello di indebolimento.")] },
  "barbarian.path-of-the-berserker.mindless-rage": { effects: [{ type: "grant", target: "conditionImmunity", values: ["charmed", "frightened"], when: RAGING }] },
  "barbarian.path-of-the-berserker.retaliation": { actions: [note("barbarian.retaliation", "Ritorsione", "reaction", "Un attacco in mischia contro una creatura entro 1,5 m che ti ha appena ferito.")] },
  "barbarian.optional.totem-spirit-bear": {
    effects: [{ type: "grant", target: "resistance", values: ["acid", "cold", "fire", "force", "lightning", "necrotic", "poison", "radiant", "thunder"], when: RAGING }],
  },
  "barbarian.optional.totem-spirit-elk": { effects: [{ type: "bonus", target: "speed.walk", value: 15, when: RAGING, label: "Spirito dell'Alce" }] },

  /* ---------------- Bardo ---------------- */
  "bard.bardic-inspiration": {
    resources: [{ id: "bard.bardic-inspiration", name: "Ispirazione Bardica", max: { max: [1, { mod: "cha" }] }, longRest: "all" }],
    dice: [{ id: "bard.bardic-inspiration", name: "Dado di Ispirazione Bardica", dice: { sides: at("bard", { 1: 6, 5: 8, 10: 10, 15: 12 }) } }],
    actions: [note("bard.bardic-inspiration", "Ispirazione Bardica", "bonus", "Una creatura entro 18 m che ti sente ottiene un dado di Ispirazione Bardica per 10 minuti.", "bard.bardic-inspiration")],
  },
  "bard.song-of-rest": { dice: [{ id: "bard.song-of-rest", name: "Canto di Riposo", dice: { sides: at("bard", { 2: 6, 9: 8, 13: 10, 17: 12 }) }, note: "PF extra a chi spende Dadi Vita nel riposo breve" }] },
  "bard.countercharm": { actions: [note("bard.countercharm", "Controfascino", "action", "Fino alla fine del tuo prossimo turno, tu e gli alleati entro 9 m avete vantaggio ai tiri salvezza contro spaventato e affascinato.")] },
  "bard.college-of-lore.cutting-words": { actions: [note("bard.cutting-words", "Parole Taglienti", "reaction", "Sottrai un dado di Ispirazione Bardica a un tiro per colpire, una prova o un tiro per i danni di una creatura entro 18 m.", "bard.bardic-inspiration")] },
  "bard.college-of-lore.bonus-proficiencies": { choices: [{ id: "bard.college-of-lore.skills", kind: "skill", label: "Competenze Bonus", count: 3, from: ALL_SKILLS }] },
  "bard.college-of-valor.bonus-proficiencies": { effects: [{ type: "grant", target: "armor", values: ["medium", "shield"] }, { type: "grant", target: "weapon", values: ["martial"] }] },

  /* ---------------- Druido ---------------- */
  "druid.wild-shape": { actions: [note("druid.wild-shape", "Forma Selvatica", "action", "Assumi la forma di una bestia che hai già visto, per un numero di ore pari a metà del tuo livello da druido.", "druid.wild-shape")] },
  "druid.wild-companion": { actions: [note("druid.wild-companion", "Compagno Selvatico", "action", "Lanci trova famiglio senza componenti materiali: il famiglio è un folletto e resta per metà del tuo livello da druido in ore.", "druid.wild-shape")] },
  "druid.circle-of-the-land.natural-recovery": {
    actions: [
      {
        id: "druid.natural-recovery",
        name: "Recupero Naturale",
        timing: "special",
        cost: { resource: "druid.natural-recovery", amount: 1 },
        outcome: { kind: "recoverSlots", budget: halfUp({ level: "druid" }), maxLevel: 5 },
        description: "Durante un riposo breve, una volta al giorno.",
      },
    ],
  },
  "druid.circle-of-the-moon.combat-wild-shape": {
    actions: [{ id: "druid.combat-wild-shape", name: "Cura in Forma Selvatica", timing: "bonus", outcome: { kind: "note" }, description: "In forma selvatica, spendi uno slot incantesimo: recuperi 1d8 PF per livello dello slot. La Forma Selvatica si usa come azione bonus." }],
  },

  /* ---------------- Monaco ---------------- */
  "monk.martial-arts": {
    effects: [{ type: "martialArts", die: MARTIAL_DIE }],
    actions: [note("monk.martial-arts", "Colpo senz'armi bonus", "bonus", "Dopo l'azione di Attacco con un colpo senz'armi o un'arma da monaco.")],
  },
  "monk.flurry-of-blows": { actions: [note("monk.flurry-of-blows", "Raffica di Colpi", "bonus", "Due colpi senz'armi subito dopo l'azione di Attacco.", "monk.ki")] },
  "monk.patient-defense": { actions: [note("monk.patient-defense", "Difesa Paziente", "bonus", "Azione di Schivata come azione bonus.", "monk.ki")] },
  "monk.step-of-the-wind": { actions: [note("monk.step-of-the-wind", "Passo del Vento", "bonus", "Disimpegno o Scatto come azione bonus; la distanza di salto raddoppia per il turno.", "monk.ki")] },
  "monk.deflect-missiles": {
    actions: [{ id: "monk.deflect-missiles", name: "Deviare Proiettili", timing: "reaction", roll: { dice: "1d10", plus: { sum: [{ mod: "dex" }, { level: "monk" }] } }, outcome: { kind: "note" }, description: "Riduci di questo valore i danni di un attacco con arma a distanza. A 0 puoi afferrare il proiettile e rilanciarlo con 1 punto ki." }],
  },
  "monk.slow-fall": { actions: [note("monk.slow-fall", "Caduta Lenta", "reaction", "Riduci i danni da caduta di 5 volte il tuo livello da monaco.")] },
  "monk.stunning-strike": { actions: [note("monk.stunning-strike", "Colpo Stordente", "special", "Quando colpisci con un'arma da mischia: tiro salvezza su Costituzione contro la CD del ki, o il bersaglio è stordito fino alla fine del tuo prossimo turno.", "monk.ki")] },
  "monk.stillness-of-mind": { actions: [note("monk.stillness-of-mind", "Mente Lucida", "action", "Termini su di te un effetto che ti rende affascinato o spaventato.")] },
  "monk.purity-of-body": { effects: [{ type: "grant", target: "immunity", values: ["poison"] }, { type: "grant", target: "conditionImmunity", values: ["poisoned"] }] },
  "monk.empty-body": { actions: [{ id: "monk.empty-body", name: "Corpo Vuoto", timing: "action", cost: { resource: "monk.ki", amount: 4 }, outcome: { kind: "note" }, description: "Invisibile per 1 minuto, con resistenza a tutti i danni tranne quelli da forza." }] },
  "monk.quickened-healing": {
    actions: [{ id: "monk.quickened-healing", name: "Guarigione Rapida", timing: "action", cost: { resource: "monk.ki", amount: 2 }, roll: { dice: { sides: MARTIAL_DIE }, plus: { prof: 1 } }, outcome: { kind: "heal" } }],
  },
  "monk.way-of-the-open-hand.wholeness-of-body": { actions: [note("monk.wholeness-of-body", "Integrità del Corpo", "action", "Recuperi PF pari a tre volte il tuo livello da monaco.", "monk.wholeness-of-body")] },

  /* ---------------- Paladino ---------------- */
  "paladin.divine-sense": {
    resources: [{ id: "paladin.divine-sense", name: "Percezione del Divino", max: { max: [1, { sum: [1, { mod: "cha" }] }] }, longRest: "all" }],
    actions: [note("paladin.divine-sense", "Percezione del Divino", "action", "Fino alla fine del tuo prossimo turno conosci la posizione di celestiali, immondi e non morti entro 18 m non dietro copertura totale.", "paladin.divine-sense")],
  },
  "paladin.lay-on-hands": {
    actions: [{ id: "paladin.lay-on-hands", name: "Imposizione delle Mani", timing: "action", cost: { resource: "paladin.lay-on-hands", amount: 1, variable: true }, outcome: { kind: "note" }, description: "Ripristini a una creatura toccata tanti PF quanti punti spendi. Con 5 punti curi una malattia o neutralizzi un veleno." }],
  },
  "paladin.divine-smite": { dice: [{ id: "paladin.divine-smite", name: "Punizione Divina", dice: "2d8", damageType: "radiant", note: "Con uno slot di 1°. +1d8 per ogni livello di slot in più (massimo 5d8) e +1d8 contro non morti e immondi" }] },
  "paladin.improved-divine-smite": { effects: [{ type: "damageDice", on: "melee", dice: "1d8", damageType: "radiant", label: "Punizione Divina Migliorata" }] },
  "paladin.aura-of-protection": { effects: [{ type: "bonus", target: "save.all", value: { max: [1, { mod: "cha" }] }, label: "Aura di Protezione" }] },
  "paladin.aura-of-courage": { effects: [{ type: "grant", target: "conditionImmunity", values: ["frightened"] }] },
  "paladin.cleansing-touch": {
    resources: [{ id: "paladin.cleansing-touch", name: "Tocco Purificatore", max: { max: [1, { mod: "cha" }] }, longRest: "all" }],
    actions: [note("paladin.cleansing-touch", "Tocco Purificatore", "action", "Termini un incantesimo su di te o su una creatura consenziente che tocchi.", "paladin.cleansing-touch")],
  },
  "paladin.harness-divine-power": {
    actions: [
      {
        id: "paladin.harness-divine-power",
        name: "Imbrigliare il Potere Divino",
        timing: "bonus",
        cost: { resource: "paladin.harness-divine-power", amount: 1 },
        outcome: { kind: "recoverSlots", budget: halfUp({ prof: 1 }) },
        description: "Recuperi uno slot speso. Spende anche un utilizzo di Incanalare Divinità: segnalo a mano.",
      },
    ],
  },
  "paladin.oath-of-devotion.channel-divinity-sacred-weapon": { actions: [note("paladin.sacred-weapon", "Arma Sacra", "action", "Per 1 minuto sommi il modificatore di Carisma ai tiri per colpire con un'arma, che emette luce e conta come magica.", PALADIN_CHANNEL)] },
  "paladin.oath-of-devotion.channel-divinity-turn-the-unholy": { actions: [note("paladin.turn-the-unholy", "Scacciare gli Empi", "action", "Immondi e non morti entro 9 m: tiro salvezza su Saggezza o scacciati per 1 minuto.", PALADIN_CHANNEL)] },
  "paladin.oath-of-vengeance.channel-divinity-abjure-enemy": { actions: [note("paladin.abjure-enemy", "Abiurare il Nemico", "action", "Una creatura entro 18 m: tiro salvezza su Saggezza o spaventata e con velocità 0 per 1 minuto.", PALADIN_CHANNEL)] },
  "paladin.oath-of-vengeance.channel-divinity-vow-of-enmity": { actions: [note("paladin.vow-of-enmity", "Voto di Inimicizia", "bonus", "Vantaggio ai tiri per colpire contro una creatura entro 3 m, per 1 minuto.", PALADIN_CHANNEL)] },

  /* ---------------- Ranger ---------------- */
  "ranger.primeval-awareness": { actions: [{ id: "ranger.primeval-awareness", name: "Consapevolezza Primordiale", timing: "action", outcome: { kind: "note" }, description: "Spendi uno slot incantesimo: per 1 minuto per livello dello slot percepisci aberrazioni, celestiali, draghi, elementali, folletti, immondi e non morti entro 1,5 km." }] },
  "ranger.vanish": { actions: [note("ranger.vanish", "Svanire", "bonus", "Azione di Nascondersi come azione bonus.")] },
  "ranger.optional.hunters-prey-colossus-slayer": { dice: [{ id: "ranger.colossus-slayer", name: "Uccisore di Colossi", dice: "1d8", note: "Una volta per turno, contro una creatura sotto i suoi PF massimi" }] },
  "ranger.optional.natures-veil-replaces-the-hide-in-plain-sight-feature": { actions: [note("ranger.natures-veil", "Velo della Natura", "bonus", "Invisibile fino all'inizio del tuo prossimo turno.", "ranger.natures-veil")] },
  "ranger.optional.deft-explorer-replaces-the-natural-explorer-feature": {
    actions: [{ id: "ranger.tireless", name: "Instancabile", timing: "action", cost: { resource: "ranger.tireless", amount: 1 }, roll: { dice: "1d8", plus: { max: [1, { mod: "wis" }] } }, outcome: { kind: "tempHp" }, when: { minLevel: { by: "ranger", level: 10 } } }],
  },
  "ranger.optional.favored-foe-replaces-the-favored-enemy-feature-and-works-with-the-foe-slayer-feature": {
    resources: [{ id: "ranger.favored-foe", name: "Avversario Prescelto", max: { prof: 1 }, longRest: "all" }],
    dice: [{ id: "ranger.favored-foe", name: "Avversario Prescelto", dice: { sides: at("ranger", { 1: 4, 6: 6, 14: 8 }) }, note: "Una volta per turno, contro il bersaglio marchiato" }],
    actions: [note("ranger.favored-foe", "Marchia l'avversario", "free", "Quando colpisci: il bersaglio è il tuo avversario prescelto per 1 minuto (concentrazione).", "ranger.favored-foe")],
  },

  /* ---------------- Stregone ---------------- */
  "sorcerer.font-of-magic": {
    actions: [
      { id: "sorcerer.create-slot", name: "Crea uno slot", timing: "bonus", outcome: { kind: "resourceToSlot", resource: "sorcerer.sorcery-points", costs: [2, 3, 5, 6, 7] }, description: "Spendi punti stregoneria: 2, 3, 5, 6 o 7 per uno slot dal 1° al 5°." },
      { id: "sorcerer.convert-slot", name: "Converti uno slot", timing: "bonus", outcome: { kind: "slotToResource", resource: "sorcerer.sorcery-points" }, description: "Uno slot diventa punti stregoneria pari al suo livello." },
    ],
  },
  "sorcerer.magical-guidance": { actions: [note("sorcerer.magical-guidance", "Guida Magica", "free", "Ritiri il d20 di una prova di caratteristica fallita.", "sorcerer.sorcery-points")] },
  "sorcerer.draconic-bloodline.draconic-resilience": {
    effects: [
      { type: "bonus", target: "hp.max", value: { level: "sorcerer" }, label: "Resilienza Draconica" },
      { type: "acFormula", value: { sum: [13, { mod: "dex" }] }, when: { armor: "none" }, label: "Resilienza Draconica" },
    ],
  },
  "sorcerer.wild-magic.tides-of-chaos": { actions: [note("sorcerer.tides-of-chaos", "Maree del Caos", "free", "Vantaggio a un tiro per colpire, una prova o un tiro salvezza.", "sorcerer.tides-of-chaos")] },
  "sorcerer.wild-magic.bend-luck": { actions: [{ id: "sorcerer.bend-luck", name: "Piegare la Fortuna", timing: "reaction", cost: { resource: "sorcerer.sorcery-points", amount: 2 }, roll: { dice: "1d4" }, outcome: { kind: "note" }, description: "Bonus o penalità al tiro di un'altra creatura che puoi vedere." }] },

  /* ---------------- Warlock ---------------- */
  "warlock.eldritch-master": { actions: [{ id: "warlock.eldritch-master", name: "Maestro dell'Occulto", timing: "special", cost: { resource: "warlock.eldritch-master", amount: 1 }, outcome: { kind: "recoverPact", fraction: 1 }, description: "1 minuto di supplica al patrono: recuperi tutti gli slot del Patto." }] },
  "warlock.the-fiend.dark-ones-blessing": { actions: [note("warlock.dark-ones-blessing", "Benedizione dell'Oscuro", "free", "Quando riduci una creatura ostile a 0 PF: PF temporanei pari al modificatore di Carisma + il tuo livello da warlock (minimo 1).")] },
  "warlock.the-fiend.dark-ones-own-luck": { actions: [{ id: "warlock.dark-ones-own-luck", name: "Fortuna dell'Oscuro", timing: "free", cost: { resource: "warlock.dark-ones-luck", amount: 1 }, roll: { dice: "1d10" }, outcome: { kind: "note" }, description: "Aggiungi il risultato a una prova di caratteristica o a un tiro salvezza." }] },
  "warlock.the-fiend.hurl-through-hell": { actions: [{ id: "warlock.hurl-through-hell", name: "Scagliare all'Inferno", timing: "special", cost: { resource: "warlock.hurl-through-hell", amount: 1 }, roll: { dice: "10d10" }, outcome: { kind: "note" }, description: "Danni psichici a una creatura che hai colpito, se non è un immondo." }] },
  "warlock.optional.hexblades-curse-hexblade": {
    resources: [{ id: "warlock.hexblades-curse", name: "Maledizione della Lama del Sortilegio", max: 1, shortRest: "all", longRest: "all" }],
    actions: [note("warlock.hexblades-curse", "Maledizione della Lama del Sortilegio", "bonus", "Una creatura entro 9 m per 1 minuto: bonus ai danni pari alla competenza, critico con 19-20, PF recuperati alla sua morte.", "warlock.hexblades-curse")],
  },

  /* ---------------- Artefice ---------------- */
  "artificer.flash-of-genius": {
    resources: [{ id: "artificer.flash-of-genius", name: "Lampo di Genio", max: { max: [1, { mod: "int" }] }, longRest: "all" }],
    actions: [note("artificer.flash-of-genius", "Lampo di Genio", "reaction", "Sommi il modificatore di Intelligenza a una prova o a un tiro salvezza tuo o di una creatura entro 9 m.", "artificer.flash-of-genius")],
  },
  "artificer.artillerist.eldritch-cannon": { actions: [{ id: "artificer.eldritch-cannon", name: "Cannone Occulto", timing: "action", outcome: { kind: "note" }, description: "Crei un cannone (lanciafiamme, balista di forza o protettore). Una volta per riposo lungo, oppure spendendo uno slot incantesimo." }] },
  "artificer.artillerist.arcane-firearm": { dice: [{ id: "artificer.arcane-firearm", name: "Arma da Fuoco Arcana", dice: "1d8", note: "A un tiro per i danni di un incantesimo da artefice lanciato con l'arma" }] },
  "artificer.battle-smith.arcane-jolt": {
    resources: [{ id: "artificer.arcane-jolt", name: "Scossa Arcana", max: { max: [1, { mod: "int" }] }, longRest: "all" }],
    dice: [{ id: "artificer.arcane-jolt", name: "Scossa Arcana", dice: { count: at("artificer", { 9: 2, 15: 4 }), sides: 6 }, damageType: "force", note: "Danni da forza, oppure PF ripristinati a una creatura entro 9 m" }],
  },
};

/**
 * Incantesimi sempre preparati delle sottoclassi. Il compendio li elenca come liste
 * "classe.sottoclasse": qui diventano incantesimi concessi, al livello di classe giusto.
 */
const GRANT_LEVEL: Record<string, (spellLevel: number) => number> = {
  cleric: (l) => Math.max(1, 2 * l - 1),
  sorcerer: (l) => Math.max(1, 2 * l - 1),
  druid: (l) => (l <= 1 ? 2 : 2 * l - 1),
  paladin: (l) => [3, 3, 5, 9, 13, 17][l] ?? 17,
  ranger: (l) => [3, 3, 5, 9, 13, 17][l] ?? 17,
  artificer: (l) => [3, 3, 5, 9, 13, 17][l] ?? 17,
};

export interface MechanicsReport {
  applied: number;
  /** Voci la cui chiave non corrisponde a nessun privilegio del pacchetto. */
  missing: string[];
  subclassSpells: number;
}

const mergeById = <T extends { id: string }>(old: T[] | undefined, add: T[]): T[] => [...(old ?? []).filter((o) => !add.some((a) => a.id === o.id)), ...add];

function merge(f: Feature, m: Mechanics) {
  if (m.effects) f.effects = [...(f.effects ?? []), ...m.effects];
  if (m.spells) f.spells = [...(f.spells ?? []), ...m.spells];
  if (m.actions) f.actions = mergeById(f.actions, m.actions);
  if (m.dice) f.dice = mergeById(f.dice, m.dice);
  if (m.toggles) f.toggles = mergeById(f.toggles, m.toggles);
  if (m.widgets) f.widgets = [...(f.widgets ?? []), ...m.widgets];
  if (m.choices) f.choices = mergeById(f.choices, m.choices);
  if (m.resources) {
    f.resources = mergeById(f.resources, m.resources);
    for (const r of m.resources) {
      if (!f.widgets?.some((w) => w.ref === r.id)) f.widgets = [...(f.widgets ?? []), { widget: "resource", ref: r.id }];
    }
  }
}

export function applyMechanics(pack: ContentPack, mechanics: Record<string, Mechanics> = MECHANICS): MechanicsReport {
  // Privilegi di classe e sottoclasse per id; le opzioni per id dell'opzione (non del suo privilegio interno).
  const targets: { id: string; feature: Feature }[] = [
    ...[...(pack.classes ?? []), ...(pack.subclasses ?? [])].flatMap((c) => c.features.map((feature) => ({ id: feature.id, feature }))),
    ...(pack.feats ?? []).map((f) => ({ id: f.id, feature: f.feature })),
  ];
  const report: MechanicsReport = { applied: 0, missing: [], subclassSpells: 0 };
  for (const [key, m] of Object.entries(mechanics)) {
    const wild = key.startsWith("*.") ? key.slice(1) : undefined;
    const hits = targets.filter((t) => (wild ? t.id.endsWith(wild) && !(t.id in mechanics) : t.id === key));
    if (!hits.length) report.missing.push(key);
    for (const t of hits) merge(t.feature, m);
    report.applied += hits.length;
  }

  for (const sub of pack.subclasses ?? []) {
    const level = GRANT_LEVEL[sub.classId];
    const first = [...sub.features].sort((a, b) => (a.level ?? 1) - (b.level ?? 1))[0];
    if (!level || !first) continue;
    const words = sub.id.slice(sub.classId.length + 1).split("-");
    const list = (pack.spells ?? []).flatMap((s) => s.lists).find((l) => {
      if (!l.startsWith(`${sub.classId}.`)) return false;
      return l.slice(sub.classId.length + 1).split("-").every((w) => words.includes(w));
    });
    if (!list) continue;
    const spells = (pack.spells ?? []).filter((s) => s.lists.includes(list));
    first.spells = [...(first.spells ?? []), ...spells.map((s) => ({ spellId: s.id, minLevel: { by: sub.classId, level: Math.max(level(s.level), first.level ?? 1) } }))];
    report.subclassSpells += spells.length;
  }
  // Circolo della Terra: il terreno è un'opzione, e i suoi incantesimi stanno nella lista "druid.<terreno>".
  for (const feat of pack.feats ?? []) {
    const land = feat.id.match(/^druid.optional.circle-of-the-land-(.+)$/)?.[1];
    if (!land) continue;
    const spells = (pack.spells ?? []).filter((s) => s.lists.includes(`druid.${land}`));
    feat.feature.spells = spells.map((s) => ({ spellId: s.id, source: "druid", minLevel: { by: "druid", level: Math.max(3, 2 * s.level - 1) } }));
    report.subclassSpells += spells.length;
  }
  return report;
}
