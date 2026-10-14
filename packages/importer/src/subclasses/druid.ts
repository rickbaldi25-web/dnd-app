/** Circoli del Druido. Gli incantesimi di circolo arrivano dalle liste del compendio. */
import { at, atLeastOne, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "druid.";
const WILD = "druid.wild-shape";
const STARRY = "starry-form";

export const DRUID: Record<string, Mechanics> = {
  /* Terra */
  [`${P}circle-of-the-land.bonus-cantrip`]: { choices: [{ id: "druid.land.cantrip", kind: "spell", label: "Trucchetto Bonus", count: 1, spell: { list: "druid", level: 0, ability: "wis" } }] },
  [`${P}circle-of-the-land.natures-ward`]: { effects: [{ type: "grant", target: "immunity", values: ["poison"] }, { type: "grant", target: "conditionImmunity", values: ["poisoned"] }] },

  /* Luna */
  [`${P}circle-of-the-moon.elemental-wild-shape`]: { actions: [note("druid.elemental-wild-shape", "Forma Selvatica Elementale", "action", "Spendi due usi di Forma Selvatica per diventare un elementale dell'aria, della terra, del fuoco o dell'acqua.", WILD, 2)] },
  [`${P}circle-of-the-moon.thousand-forms`]: { spells: [{ spellId: "alter-self" }] },

  /* Sogni */
  [`${P}circle-of-dreams.balm-of-the-summer-court`]: {
    dice: [{ id: "druid.balm-of-summer", name: "Balsamo della Corte d'Estate", dice: "1d6", note: "Per ogni dado speso: 1d6 PF e 1 PF temporaneo a una creatura entro 36 m" }],
    actions: [{ id: "druid.balm-of-summer", name: "Balsamo della Corte d'Estate", timing: "bonus", cost: { resource: "druid.balm-of-summer", amount: 1, variable: true }, outcome: { kind: "note" }, description: "Spendi fino a metà del tuo livello da druido in dadi: ognuno cura 1d6 e dà 1 PF temporaneo." }],
  },
  [`${P}circle-of-dreams.hearth-of-moonlight-and-shadow`]: { actions: [note("druid.hearth", "Focolare di Luna e Ombra", "special", "Durante un riposo, sfera di 9 m: +5 a Furtività e Percezione, e la luce di fuochi interni non si vede da fuori.")] },
  [`${P}circle-of-dreams.hidden-paths`]: {
    resources: [uses("druid.hidden-paths", "Sentieri Nascosti", atLeastOne({ mod: "wis" }))],
    actions: [
      note("druid.hidden-paths", "Sentieri Nascosti (te)", "bonus", "Ti teletrasporti fino a 18 m in uno spazio libero che vedi.", "druid.hidden-paths"),
      note("druid.hidden-paths.other", "Sentieri Nascosti (altri)", "action", "Una creatura consenziente che tocchi si teletrasporta fino a 9 m.", "druid.hidden-paths"),
    ],
  },
  [`${P}circle-of-dreams.walker-in-dreams`]: {
    resources: [uses("druid.walker-in-dreams", "Viandante dei Sogni", 1)],
    actions: [note("druid.walker-in-dreams", "Viandante dei Sogni", "special", "Al risveglio da un riposo breve: lanci sogno, scrutare o cerchio di teletrasporto senza slot, legati a un luogo dove hai riposato.", "druid.walker-in-dreams")],
  },

  /* Pastore */
  [`${P}circle-of-the-shepherd.speech-of-the-woods`]: { effects: [{ type: "grant", target: "language", values: ["sylvan"] }], spells: [{ spellId: "speak-with-animals" }] },
  [`${P}circle-of-the-shepherd.spirit-totem`]: {
    actions: [note("druid.spirit-totem", "Totem Spirituale", "bonus", "Aura di 9 m per 1 minuto. Orso: PF temporanei 5 + livello da druido e vantaggio a prove e TS di Forza. Falco: reazione per dare vantaggio a un attacco; vantaggio a Percezione. Unicorno: vantaggio a cercare creature; le tue cure curano anche chi è nell'aura.", "druid.spirit-totem")],
  },
  [`${P}circle-of-the-shepherd.faithful-summons`]: { actions: [note("druid.faithful-summons", "Evocazioni Fedeli", "special", "Quando scendi a 0 PF o sei incapacitato: lanci evoca animali di 9° livello (quattro bestie di GS 2), senza concentrazione.", "druid.faithful-summons")] },

  /* Spore */
  [`${P}circle-of-spores.halo-of-spores`]: {
    actions: [rollAction("druid.halo-of-spores", "Alone di Spore", "reaction", { sides: at("druid", { 2: 4, 6: 6, 10: 8, 14: 10 }) }, "Una creatura che vedi entro 3 m: TS Costituzione o subisce questi danni necrotici.")],
  },
  [`${P}circle-of-spores.symbiotic-entity`]: {
    toggles: [{ id: "symbiotic-entity", name: "Entità Simbiotica" }],
    actions: [
      { id: "druid.symbiotic-entity", name: "Entità Simbiotica", timing: "action", cost: { resource: WILD, amount: 1 }, outcome: { kind: "toggleOn", toggle: "symbiotic-entity" }, when: { not: { toggle: "symbiotic-entity" } }, description: "PF temporanei pari a 4 volte il livello da druido (segnali a mano) per 10 minuti: l'Alone di Spore raddoppia il dado e i colpi in mischia fanno 1d6 necrotici in più." },
      { id: "druid.symbiotic-entity.end", name: "Termina l'Entità Simbiotica", timing: "free", outcome: { kind: "toggleOff", toggle: "symbiotic-entity" }, when: { toggle: "symbiotic-entity" } },
    ],
    effects: [{ type: "damageDice", on: "melee", dice: "1d6", damageType: "necrotic", when: { toggle: "symbiotic-entity" }, label: "Entità Simbiotica" }],
  },
  [`${P}circle-of-spores.fungal-infestation`]: {
    resources: [uses("druid.fungal-infestation", "Infestazione Fungina", atLeastOne({ mod: "wis" }))],
    actions: [note("druid.fungal-infestation", "Infestazione Fungina", "reaction", "Una bestia o un umanoide Piccolo o Medio che muore entro 3 m si rialza come zombie con 1 PF per 1 ora.", "druid.fungal-infestation")],
  },
  [`${P}circle-of-spores.spreading-spores`]: { actions: [note("druid.spreading-spores", "Spore Diffuse", "bonus", "Con l'Entità Simbiotica attiva: cubo di 3 m entro 9 m dove l'Alone di Spore colpisce chi entra o vi finisce il turno.")] },
  [`${P}circle-of-spores.fungal-body`]: { effects: [{ type: "grant", target: "conditionImmunity", values: ["blinded", "deafened", "frightened", "poisoned"] }] },

  /* Stelle */
  [`${P}circle-of-stars.star-map`]: {
    resources: [uses("druid.star-map", "Mappa Stellare: dardo guida", { prof: 1 })],
    spells: [{ spellId: "guidance" }, { spellId: "guiding-bolt", resource: "druid.star-map" }],
  },
  [`${P}circle-of-stars.starry-form`]: {
    toggles: [{ id: STARRY, name: "Forma Stellare" }],
    actions: [
      { id: "druid.starry-form", name: "Forma Stellare", timing: "bonus", cost: { resource: WILD, amount: 1 }, outcome: { kind: "toggleOn", toggle: STARRY }, when: { not: { toggle: STARRY } }, description: "Per 10 minuti: Arciere, Calice o Drago (scegli quando la attivi)." },
      { id: "druid.starry-form.end", name: "Termina la Forma Stellare", timing: "free", outcome: { kind: "toggleOff", toggle: STARRY }, when: { toggle: STARRY } },
      rollAction("druid.starry-archer", "Arciere stellare", "bonus", { count: at("druid", { 2: 1, 10: 2 }), sides: 8 }, "Attacco a distanza con incantesimo entro 18 m: danni radiosi (più Saggezza).", { plus: { mod: "wis" }, when: { toggle: STARRY } }),
      rollAction("druid.starry-chalice", "Calice stellare", "free", { count: at("druid", { 2: 1, 10: 2 }), sides: 8 }, "Quando curi con uno slot: tu o una creatura entro 9 m recuperate questi PF (più Saggezza).", { plus: { mod: "wis" }, when: { toggle: STARRY } }),
    ],
    effects: [{ type: "grant", target: "resistance", values: ["bludgeoning", "piercing", "slashing"], when: { all: [{ toggle: STARRY }, { minLevel: { by: "druid", level: 14 } }] } }],
  },
  [`${P}circle-of-stars.cosmic-omen`]: {
    choices: [{ id: "druid.cosmic-omen", kind: "custom", label: "Presagio cosmico del giorno (lo decide un d6 dopo il riposo lungo)", count: 1, from: ["Fortuna (pari)", "Sventura (dispari)"] }],
    actions: [rollAction("druid.cosmic-omen", "Presagio Cosmico", "reaction", "1d6", "Fortuna: aggiungi il dado al tiro di una creatura entro 9 m. Sventura: lo sottrai.", { resource: "druid.cosmic-omen" })],
  },

  /* Fuoco Selvaggio */
  [`${P}circle-of-wildfire.summon-wildfire-spirit`]: { actions: [note("druid.wildfire-spirit", "Evocare lo Spirito del Fuoco Selvaggio", "action", "Lo spirito compare entro 9 m per 1 ora; all'arrivo, creature entro 3 m: TS Destrezza o 2d6 danni da fuoco.", WILD)] },
  [`${P}circle-of-wildfire.enhanced-bond`]: { dice: [{ id: "druid.enhanced-bond", name: "Legame Potenziato", dice: "1d8", note: "Con lo spirito evocato: a un tiro di danni da fuoco o di cure di un tuo incantesimo" }] },
  [`${P}circle-of-wildfire.cauterizing-flames`]: {
    actions: [rollAction("druid.cauterizing-flames", "Fiamme Cauterizzanti", "reaction", "2d10", "Dove è morta una creatura entro 9 m da te o dallo spirito: chi entra nella fiamma recupera o subisce questi PF/danni da fuoco (più Saggezza).", { resource: "druid.cauterizing-flames", plus: { mod: "wis" } })],
  },
  [`${P}circle-of-wildfire.blazing-revival`]: { actions: [note("druid.blazing-revival", "Rinascita Ardente", "special", "Se scendi a 0 PF con lo spirito entro 36 m: lo spirito scompare e tu torni a metà dei PF.", "druid.blazing-revival")] },
};
