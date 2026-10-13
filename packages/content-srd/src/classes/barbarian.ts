import type { ClassDef, Condition, SubclassDef } from "@dnd/engine";
import { MELEE_WEAPON_IDS } from "../items/equipment.js";

const SKILLS = ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"];

/** In Ira e senza armatura pesante. */
const RAGING: Condition = { all: [{ toggle: "raging" }, { not: { armor: "heavy" } }] };

const by = (values: number[]) => ({ table: { by: "barbarian", values } });

export const barbarian: ClassDef = {
  id: "barbarian",
  name: "Barbaro",
  hitDie: "d12",
  primaryAbility: ["str"],
  proficiencies: {
    saves: ["str", "con"],
    armor: ["light", "medium", "shield"],
    weapons: ["simple", "martial"],
  },
  multiclassProficiencies: { armor: ["shield"], weapons: ["martial"] },
  skillChoice: { count: 2, from: SKILLS },
  //                       1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
  weaponMasteries: by([2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
  weaponMasteryFrom: MELEE_WEAPON_IDS,
  subclassLevel: 3,
  features: [
    {
      id: "barbarian.rage",
      name: "Ira",
      level: 1,
      description:
        "Azione bonus, se non indossi armatura pesante. Dura fino alla fine del tuo prossimo turno e puoi prolungarla ogni turno (attaccando, imponendo un TS o con un'azione bonus), fino a 10 minuti. Finisce se indossi armatura pesante o sei incapacitato. In Ira non puoi lanciare incantesimi né mantenere la concentrazione. Recuperi un uso con un riposo breve, tutti con un riposo lungo.",
      resources: [
        { id: "rage", name: "Ira", max: by([2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6]), shortRest: 1, longRest: "all" },
      ],
      toggles: [{ id: "raging", name: "In Ira", when: { not: { armor: "heavy" } } }],
      actions: [
        {
          id: "rage.start",
          name: "Entra in Ira",
          timing: "bonus",
          cost: { resource: "rage", amount: 1 },
          when: { all: [{ not: { armor: "heavy" } }, { not: { toggle: "raging" } }] },
          outcome: { kind: "toggleOn", toggle: "raging" },
        },
        { id: "rage.end", name: "Termina Ira", timing: "free", when: { toggle: "raging" }, outcome: { kind: "toggleOff", toggle: "raging" } },
      ],
      effects: [
        { type: "grant", target: "resistance", values: ["bludgeoning", "piercing", "slashing"], when: RAGING },
        { type: "bonus", target: "damage.str", value: by([2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4]), when: RAGING, label: "Danni da Ira" },
        { type: "advantage", on: "check.str", when: RAGING, label: "Ira" },
        { type: "advantage", on: "save.str", when: RAGING, label: "Ira" },
      ],
      widgets: [
        { widget: "resource", ref: "rage", props: { style: "pips", accent: "danger" } },
        { widget: "toggle", ref: "raging", props: { accent: "danger", banner: true } },
      ],
    },
    {
      id: "barbarian.unarmored-defense",
      name: "Difesa Senza Armatura",
      level: 1,
      description: "Senza armatura, la tua CA è 10 + Des + Cos. Puoi usare uno scudo e mantenere questo beneficio.",
      effects: [
        { type: "acFormula", value: { sum: [10, { mod: "dex" }, { mod: "con" }] }, when: { armor: "none" }, label: "Difesa Senza Armatura" },
      ],
    },
    {
      id: "barbarian.weapon-mastery",
      name: "Maestria nelle Armi",
      level: 1,
      description: "Usi le proprietà di maestria di alcune armi da mischia semplici o da guerra a tua scelta. Puoi cambiarne una dopo un riposo lungo.",
    },
    {
      id: "barbarian.danger-sense",
      name: "Percezione del Pericolo",
      level: 2,
      description: "Vantaggio ai tiri salvezza su Destrezza, a meno che tu non sia incapacitato.",
      effects: [{ type: "advantage", on: "save.dex", when: { not: { hasCondition: "incapacitated" } }, label: "Percezione del Pericolo" }],
    },
    {
      id: "barbarian.reckless-attack",
      name: "Attacco Irruento",
      level: 2,
      description:
        "Al primo attacco del tuo turno puoi attaccare in modo irruento: vantaggio ai tiri per colpire che usano Forza fino all'inizio del tuo prossimo turno, ma i tiri per colpire contro di te hanno vantaggio.",
      toggles: [{ id: "reckless", name: "Irruento" }],
      widgets: [{ widget: "toggle", ref: "reckless", props: { accent: "warning" } }],
    },
    {
      id: "barbarian.subclass",
      name: "Sottoclasse del Barbaro",
      level: 3,
      description: "Scegli un Cammino primordiale.",
    },
    {
      id: "barbarian.primal-knowledge",
      name: "Conoscenza Primordiale",
      level: 3,
      description:
        "Ottieni competenza in un'altra abilità della lista del Barbaro. In Ira, puoi usare la Forza per le prove di Acrobazia, Intimidire, Percezione, Furtività e Sopravvivenza.",
      choices: [{ id: "barbarian.primal-knowledge", kind: "skill", label: "Conoscenza Primordiale", count: 1, from: SKILLS }],
      effects: [
        {
          type: "altAbility",
          skills: ["acrobatics", "intimidation", "perception", "stealth", "survival"],
          ability: "str",
          when: RAGING,
        },
      ],
    },
  ],
};

export const berserker: SubclassDef = {
  id: "barbarian.berserker",
  classId: "barbarian",
  name: "Cammino del Berserker",
  features: [
    {
      id: "berserker.frenzy",
      name: "Frenesia",
      level: 3,
      description:
        "Se usi Attacco Irruento mentre sei in Ira, il primo bersaglio che colpisci nel turno con un attacco basato sulla Forza subisce danni extra: tanti d6 quanto il tuo bonus ai danni da Ira.",
      widgets: [{ widget: "note", props: { highlightWhen: ["raging", "reckless"] } }],
    },
  ],
};
