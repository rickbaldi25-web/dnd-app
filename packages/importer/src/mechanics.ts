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
import type { ActionDef, ContentPack, Feature, Value } from "@dnd/engine";

type Mechanics = Pick<Feature, "effects" | "actions" | "resources" | "choices" | "dice" | "spells">;

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
  return report;
}
