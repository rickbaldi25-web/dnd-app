import type { FeatDef } from "@dnd/engine";

export const feats: FeatDef[] = [
  /* --- Talenti d'origine --- */
  {
    id: "alert",
    name: "Allerta",
    category: "origin",
    feature: {
      id: "feat.alert",
      name: "Allerta",
      description:
        "Aggiungi il bonus di competenza all'Iniziativa. Subito dopo il tiro di Iniziativa puoi scambiarla con quella di un alleato consenziente (non incapacitato).",
      effects: [{ type: "bonus", target: "initiative", value: { prof: 1 }, label: "Allerta" }],
    },
  },
  {
    id: "savage-attacker",
    name: "Attaccante Selvaggio",
    category: "origin",
    feature: {
      id: "feat.savage-attacker",
      name: "Attaccante Selvaggio",
      description: "Una volta per turno, quando colpisci con un'arma, puoi tirare due volte i dadi del danno e scegliere il risultato.",
      widgets: [{ widget: "note", props: { per: "turn" } }],
    },
  },
  {
    id: "tough",
    name: "Robusto",
    category: "origin",
    feature: {
      id: "feat.tough",
      name: "Robusto",
      description: "I tuoi PF massimi aumentano di 2 per ogni livello del personaggio.",
      effects: [{ type: "bonus", target: "hp.max", value: { sum: [{ level: "total" }, { level: "total" }] }, label: "Robusto" }],
    },
  },

  /* --- Stili di combattimento --- */
  {
    id: "fs-archery",
    name: "Tiro",
    category: "fighting-style",
    feature: {
      id: "feat.fs-archery",
      name: "Stile: Tiro",
      description: "+2 ai tiri per colpire con armi a distanza.",
      effects: [{ type: "bonus", target: "attack.ranged", value: 2, label: "Stile: Tiro" }],
    },
  },
  {
    id: "fs-defense",
    name: "Difesa",
    category: "fighting-style",
    feature: {
      id: "feat.fs-defense",
      name: "Stile: Difesa",
      description: "+1 alla CA mentre indossi un'armatura leggera, media o pesante.",
      effects: [{ type: "bonus", target: "ac", value: 1, when: { armor: "any" }, label: "Stile: Difesa" }],
    },
  },
  {
    id: "fs-great-weapon",
    name: "Armi Grandi",
    category: "fighting-style",
    feature: {
      id: "feat.fs-great-weapon",
      name: "Stile: Armi Grandi",
      description: "Con un'arma da mischia a due mani o versatile impugnata a due mani, tratta come 3 ogni 1 o 2 sui dadi del danno.",
    },
  },
  {
    id: "fs-two-weapon",
    name: "Due Armi",
    category: "fighting-style",
    feature: {
      id: "feat.fs-two-weapon",
      name: "Stile: Due Armi",
      description: "Quando fai l'attacco extra di un'arma Leggera, aggiungi il modificatore di caratteristica al danno.",
    },
  },
];
