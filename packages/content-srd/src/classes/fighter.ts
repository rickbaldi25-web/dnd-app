import type { ClassDef, SubclassDef } from "@dnd/engine";

const by = (values: number[]) => ({ table: { by: "fighter", values } });

export const fighter: ClassDef = {
  id: "fighter",
  name: "Guerriero",
  hitDie: "d10",
  primaryAbility: ["str", "dex"],
  proficiencies: {
    saves: ["str", "con"],
    armor: ["light", "medium", "heavy", "shield"],
    weapons: ["simple", "martial"],
  },
  multiclassProficiencies: { armor: ["light", "medium", "shield"], weapons: ["martial"] },
  skillChoice: {
    count: 2,
    from: ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "persuasion", "perception", "survival"],
  },
  //                       1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20
  weaponMasteries: by([3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6]),
  subclassLevel: 3,
  features: [
    {
      id: "fighter.fighting-style",
      name: "Stile di Combattimento",
      level: 1,
      description: "Ottieni un talento Stile di Combattimento a scelta. Puoi sostituirlo quando sali di livello da Guerriero.",
      choices: [{ id: "fighter.fighting-style", kind: "feat", label: "Stile di Combattimento", count: 1, from: { tag: "fighting-style" } }],
    },
    {
      id: "fighter.second-wind",
      name: "Recuperare Energie",
      level: 1,
      description: "Azione bonus: recuperi PF pari a 1d10 + il tuo livello da Guerriero. Recuperi un uso con un riposo breve, tutti con un riposo lungo.",
      resources: [
        { id: "second-wind", name: "Recuperare Energie", max: by([2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]), shortRest: 1, longRest: "all" },
      ],
      actions: [
        {
          id: "second-wind.use",
          name: "Recuperare Energie",
          timing: "bonus",
          cost: { resource: "second-wind", amount: 1 },
          roll: { dice: "1d10", plus: { level: "fighter" } },
          outcome: { kind: "heal" },
        },
      ],
      widgets: [{ widget: "resource", ref: "second-wind", props: { style: "pips" } }],
    },
    {
      id: "fighter.weapon-mastery",
      name: "Maestria nelle Armi",
      level: 1,
      description: "Usi le proprietà di maestria di alcune armi semplici o da guerra a tua scelta. Puoi cambiarne una dopo un riposo lungo.",
    },
    {
      id: "fighter.action-surge",
      name: "Azione Impetuosa",
      level: 2,
      description: "Nel tuo turno ottieni un'azione aggiuntiva (non Magia). Recuperi gli usi con un riposo breve o lungo.",
      resources: [
        { id: "action-surge", name: "Azione Impetuosa", max: by([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2]), shortRest: "all", longRest: "all" },
      ],
      actions: [
        {
          id: "action-surge.use",
          name: "Azione Impetuosa",
          timing: "free",
          cost: { resource: "action-surge", amount: 1 },
          outcome: { kind: "note" },
          description: "Hai un'azione in più in questo turno.",
        },
      ],
      widgets: [{ widget: "resource", ref: "action-surge", props: { style: "pips", accent: "gold" } }],
    },
    {
      id: "fighter.tactical-mind",
      name: "Mente Tattica",
      level: 2,
      description: "Quando fallisci una prova di caratteristica, puoi spendere un uso di Recuperare Energie per aggiungere 1d10. Se fallisci comunque, l'uso non viene speso.",
      actions: [
        {
          id: "tactical-mind.use",
          name: "Mente Tattica",
          timing: "special",
          cost: { resource: "second-wind", amount: 1 },
          roll: { dice: "1d10" },
          outcome: { kind: "note" },
          description: "Aggiungi il risultato alla prova fallita. Se fallisci ancora, annulla: l'uso non si spende.",
        },
      ],
    },
    {
      id: "fighter.subclass",
      name: "Sottoclasse del Guerriero",
      level: 3,
      description: "Scegli un Archetipo marziale.",
    },
  ],
};

export const champion: SubclassDef = {
  id: "fighter.champion",
  classId: "fighter",
  name: "Campione",
  features: [
    {
      id: "champion.improved-critical",
      name: "Critico Migliorato",
      level: 3,
      description: "I tuoi attacchi con arma e senz'armi sono critici con 19 o 20.",
      effects: [{ type: "critRange", value: 19 }],
    },
    {
      id: "champion.remarkable-athlete",
      name: "Atleta Straordinario",
      level: 3,
      description:
        "Vantaggio all'Iniziativa e alle prove di Forza (Atletica). Dopo un colpo critico puoi muoverti di metà velocità senza provocare attacchi di opportunità.",
      effects: [
        { type: "advantage", on: "initiative", label: "Atleta Straordinario" },
        { type: "advantage", on: "skill.athletics", label: "Atleta Straordinario" },
      ],
    },
  ],
};
