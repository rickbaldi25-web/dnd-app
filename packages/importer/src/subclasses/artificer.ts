/** Specializzazioni dell'Artefice. Gli incantesimi di specializzazione arrivano dalle liste del compendio. */
import { at, atLeastOne, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "artificer.";
const ARMOR = "arcane-armor";

export const ARTIFICER: Record<string, Mechanics> = {
  /* Alchimista */
  [`${P}alchemist.tool-proficiency`]: { effects: [{ type: "grant", target: "tool", values: ["alchemists-supplies"] }] },
  [`${P}alchemist.experimental-elixir`]: {
    resources: [uses("artificer.experimental-elixir", "Elisir Sperimentale", at("artificer", { 3: 1, 6: 2, 15: 3 }))],
    actions: [
      rollAction("artificer.experimental-elixir", "Elisir Sperimentale", "special", "1d6", "Dopo un riposo lungo crei un elisir casuale: cura, rapidità, resilienza, audacia, volo o trasformazione. Altri si creano spendendo uno slot.", { resource: "artificer.experimental-elixir" }),
      rollAction("artificer.elixir.healing", "Elisir di cura", "action", "2d4", "Chi beve recupera questi PF (più Intelligenza).", { plus: { mod: "int" } }),
    ],
  },
  [`${P}alchemist.alchemical-savant`]: { actions: [note("artificer.alchemical-savant", "Sapiente Alchemico", "free", "A un tiro di cure o di danni acidi, da fuoco, necrotici o da veleno di un tuo incantesimo aggiungi l'Intelligenza.")] },
  [`${P}alchemist.restorative-reagents`]: {
    resources: [uses("artificer.restorative-reagents", "Reagenti Ristoratori", atLeastOne({ mod: "int" }))],
    spells: [{ spellId: "lesser-restoration", resource: "artificer.restorative-reagents" }],
    actions: [rollAction("artificer.restorative-reagents.hp", "Reagenti Ristoratori: PF temporanei", "free", "2d6", "Chi beve un tuo elisir ottiene questi PF temporanei (più Intelligenza).", { plus: { mod: "int" }, outcome: { kind: "tempHp" } })],
  },
  [`${P}alchemist.chemical-mastery`]: {
    effects: [{ type: "grant", target: "resistance", values: ["acid", "poison"] }, { type: "grant", target: "conditionImmunity", values: ["poisoned"] }],
    resources: [uses("artificer.chemical-mastery", "Maestria Chimica", 1)],
    spells: [{ spellId: "greater-restoration", resource: "artificer.chemical-mastery" }, { spellId: "heal", resource: "artificer.chemical-mastery" }],
  },

  /* Armaiolo */
  [`${P}armorer.tools-of-the-trade`]: { effects: [{ type: "grant", target: "armor", values: ["heavy"] }, { type: "grant", target: "tool", values: ["smiths-tools"] }] },
  [`${P}armorer.arcane-armor`]: {
    toggles: [{ id: ARMOR, name: "Armatura Arcana" }],
    actions: [note("artificer.arcane-armor", "Armatura Arcana", "action", "La tua armatura diventa il focus da incantatore e copre tutto il corpo; la indossi o la togli con un'azione.")],
  },
  [`${P}armorer.armor-model`]: {
    choices: [{ id: "artificer.armor-model", kind: "custom", label: "Modello dell'armatura", count: 1, from: ["Guardiano", "Infiltratore"] }],
    dice: [
      { id: "artificer.thunder-gauntlets", name: "Guanti del Tuono (Guardiano)", dice: "1d8", damageType: "thunder", note: "Colpito: svantaggio ad attaccare altri fino al tuo prossimo turno" },
      { id: "artificer.lightning-launcher", name: "Lanciafulmini (Infiltratore)", dice: "1d6", damageType: "lightning", note: "Più 1d6 da fulmine una volta per turno" },
    ],
    actions: [note("artificer.defensive-field", "Campo Difensivo (Guardiano)", "bonus", "Se sei sotto metà PF: PF temporanei pari al tuo livello da artefice.", "artificer.defensive-field")],
  },
  [`${P}armorer.armor-modifications`]: { actions: [note("artificer.armor-modifications", "Modifiche all'Armatura", "special", "L'armatura conta come più oggetti per le infusioni: elmo, corazza, gambali e arma speciale; due infusioni in più.")] },
  [`${P}armorer.perfected-armor`]: {
    actions: [
      note("artificer.perfected-armor.guardian", "Armatura Perfezionata (Guardiano)", "reaction", "Una creatura Enorme o più piccola entro 9 m: TS Forza o tirata fino a 9 m verso di te, e attacco se arriva entro 1,5 m.", "artificer.perfected-armor"),
      note("artificer.perfected-armor.infiltrator", "Armatura Perfezionata (Infiltratore)", "free", "Chi colpisci con il Lanciafulmini emette luce e il prossimo attacco contro di lui ha vantaggio e +1d6 fulmine."),
    ],
  },

  /* Artigliere */
  [`${P}artillerist.tool-proficiency`]: { effects: [{ type: "grant", target: "tool", values: ["woodcarvers-tools"] }] },
  [`${P}artillerist.explosive-cannon`]: {
    actions: [rollAction("artificer.cannon.detonate", "Far esplodere il cannone", "action", "3d8", "Il cannone esplode: creature entro 6 m, TS Destrezza o danni da forza (metà se riesce).")],
  },
  [`${P}artillerist.fortified-position`]: { actions: [note("artificer.fortified-position", "Posizione Fortificata", "special", "Puoi avere due cannoni insieme; tu e gli alleati entro 3 m da un cannone avete mezza copertura.")] },

  /* Fabbro da Battaglia */
  [`${P}battle-smith.tool-proficiency`]: { effects: [{ type: "grant", target: "tool", values: ["smiths-tools"] }] },
  [`${P}battle-smith.battle-ready`]: {
    effects: [{ type: "grant", target: "weapon", values: ["martial"] }],
    actions: [note("artificer.battle-ready", "Pronto alla Battaglia", "special", "Con le armi magiche usi l'Intelligenza per colpire e per i danni.")],
  },
  [`${P}battle-smith.steel-defender`]: {
    actions: [
      note("artificer.steel-defender", "Comandare il Difensore d'Acciaio", "bonus", "Il difensore agisce dopo di te: attacca, schiva o aiuta. Con la reazione dà svantaggio a un attacco contro un'altra creatura entro 1,5 m."),
      rollAction("artificer.steel-defender.repair", "Riparazione del difensore", "action", "2d8", "Il difensore recupera questi PF (più il bonus di competenza), tre volte al giorno.", { plus: { prof: 1 } }),
    ],
  },
  [`${P}battle-smith.improved-defender`]: { actions: [note("artificer.improved-defender", "Difensore Migliorato", "special", "La Scossa Arcana sale a 4d6, il difensore ha +2 CA e chi ferisce con la sua deviazione subisce 1d4 + Intelligenza forza.")] },
};
