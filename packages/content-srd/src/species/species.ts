import type { SpeciesDef } from "@dnd/engine";
import { ALL_SKILL_IDS } from "../skills.js";

export const dwarf: SpeciesDef = {
  id: "dwarf",
  name: "Nano",
  size: "Medium",
  speed: 30,
  features: [
    {
      id: "dwarf.darkvision",
      name: "Scurovisione",
      description: "Vedi nella penombra entro 36 m (120 ft) come in piena luce, e al buio come in penombra.",
      effects: [{ type: "sense", sense: "darkvision", range: 120 }],
    },
    {
      id: "dwarf.resilience",
      name: "Resilienza Nanica",
      description: "Resistenza ai danni da veleno. Vantaggio ai tiri salvezza per evitare o terminare la condizione Avvelenato.",
      effects: [
        { type: "grant", target: "resistance", values: ["poison"] },
        { type: "advantage", on: "save.vs.poisoned", label: "Resilienza Nanica" },
      ],
    },
    {
      id: "dwarf.toughness",
      name: "Robustezza Nanica",
      description: "I tuoi PF massimi aumentano di 1, e di 1 a ogni livello successivo.",
      effects: [{ type: "bonus", target: "hp.max", value: { level: "total" }, label: "Robustezza Nanica" }],
    },
    {
      id: "dwarf.stonecunning",
      name: "Esperto Minatore",
      description:
        "Azione bonus: ottieni percezione tellurica entro 18 m (60 ft) per 10 minuti, se sei su una superficie di pietra o la tocchi. Usi pari al bonus di competenza per riposo lungo.",
      resources: [{ id: "stonecunning", name: "Esperto Minatore", max: { prof: 1 }, longRest: "all" }],
      toggles: [{ id: "tremorsense", name: "Percezione tellurica" }],
      actions: [
        {
          id: "stonecunning.use",
          name: "Esperto Minatore",
          timing: "bonus",
          cost: { resource: "stonecunning", amount: 1 },
          outcome: { kind: "toggleOn", toggle: "tremorsense" },
        },
      ],
      effects: [{ type: "sense", sense: "tremorsense", range: 60, when: { toggle: "tremorsense" } }],
      widgets: [{ widget: "resource", ref: "stonecunning", props: { style: "pips" } }],
    },
  ],
};

export const human: SpeciesDef = {
  id: "human",
  name: "Umano",
  size: "Small or Medium",
  speed: 30,
  features: [
    {
      id: "human.resourceful",
      name: "Pieno di Risorse",
      description: "Ottieni Ispirazione Eroica al termine di ogni riposo lungo.",
      widgets: [{ widget: "heroic-inspiration" }],
    },
    {
      id: "human.skillful",
      name: "Abile",
      description: "Ottieni competenza in un'abilità a tua scelta.",
      choices: [{ id: "human.skillful", kind: "skill", label: "Abile", count: 1, from: ALL_SKILL_IDS }],
    },
    {
      id: "human.versatile",
      name: "Versatile",
      description: "Ottieni un talento d'origine a tua scelta.",
      choices: [{ id: "human.versatile", kind: "feat", label: "Versatile", count: 1, from: { tag: "origin" } }],
    },
  ],
};
