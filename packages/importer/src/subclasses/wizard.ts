/** Tradizioni Arcane del Mago. L'Interdizione Arcana è già nella base. */
import { atLeastOne, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "wizard.";
const BLADESONG = "bladesong";

export const WIZARD: Record<string, Mechanics> = {
  /* Abiurazione */
  [`${P}school-of-abjuration.projected-ward`]: { actions: [note("wizard.projected-ward", "Interdizione Proiettata", "reaction", "Una creatura entro 9 m subisce danni: l'Interdizione Arcana li assorbe al suo posto.")] },
  [`${P}school-of-abjuration.spell-resistance`]: { effects: [{ type: "advantage", on: "save.vs.spells", label: "Resistenza agli Incantesimi" }] },

  /* Evocazione */
  [`${P}school-of-conjuration.minor-conjuration`]: { actions: [note("wizard.minor-conjuration", "Evocazione Minore", "action", "Evochi un oggetto non magico che hai visto, lungo al massimo 90 cm e pesante fino a 5 kg, per 1 ora.")] },
  [`${P}school-of-conjuration.benign-transposition`]: { actions: [note("wizard.benign-transposition", "Trasposizione Benigna", "action", "Ti teletrasporti fino a 9 m, o scambi posto con una creatura consenziente. Si recupera anche lanciando un incantesimo di evocazione.", "wizard.benign-transposition")] },

  /* Divinazione */
  [`${P}school-of-divination.portent`]: {
    actions: [
      rollAction("wizard.portent.roll", "Presagio: tira i dadi", "special", "1d20", "Dopo un riposo lungo tira due d20 (tre dal 14°) e annota i risultati."),
      note("wizard.portent", "Presagio: sostituire un tiro", "free", "Sostituisci un tiro per colpire, una prova o un tiro salvezza di una creatura che vedi con uno dei risultati annotati.", "wizard.portents"),
    ],
  },
  [`${P}school-of-divination.the-third-eye`]: { actions: [note("wizard.third-eye", "Il Terzo Occhio", "action", "Fino al riposo: scurovisione 18 m, vista eterea 18 m, leggere qualsiasi lingua, oppure vedere l'invisibile entro 3 m.", "wizard.third-eye")] },

  /* Ammaliamento */
  [`${P}school-of-enchantment.hypnotic-gaze`]: { actions: [note("wizard.hypnotic-gaze", "Sguardo Ipnotico", "action", "Una creatura entro 1,5 m che ti vede: TS Saggezza o affascinata, incapacitata e con velocità 0 fino alla fine del tuo prossimo turno.", "wizard.hypnotic-gaze")] },
  [`${P}school-of-enchantment.instinctive-charm`]: { actions: [note("wizard.instinctive-charm", "Fascino Istintivo", "reaction", "Chi ti attacca entro 9 m: TS Saggezza o deve attaccare la creatura più vicina diversa da te.")] },
  [`${P}school-of-enchantment.alter-memories`]: { actions: [note("wizard.alter-memories", "Alterare i Ricordi", "special", "Chi affascini con un incantesimo non si accorge di esserlo; con un'azione gli fai dimenticare fino a 1 + Carisma ore.")] },

  /* Invocazione */
  [`${P}school-of-evocation.sculpt-spells`]: { actions: [note("wizard.sculpt-spells", "Plasmare Incantesimi", "special", "In un incantesimo di invocazione ad area, fino a 1 + il livello dell'incantesimo creature superano il TS e non subiscono danni.")] },
  [`${P}school-of-evocation.empowered-evocation`]: { actions: [note("wizard.empowered-evocation", "Invocazione Potenziata", "free", "A un tiro di danni di un incantesimo di invocazione aggiungi l'Intelligenza.")] },
  [`${P}school-of-evocation.overchannel`]: { actions: [note("wizard.overchannel", "Sovraccarico", "free", "Un incantesimo da mago di 1°–5° livello fa il massimo dei danni. Dal secondo uso prima di un riposo lungo subisci 2d12 necrotici per livello, crescenti.")] },

  /* Illusione */
  [`${P}school-of-illusion.improved-minor-illusion`]: { spells: [{ spellId: "minor-illusion" }] },
  [`${P}school-of-illusion.malleable-illusions`]: { actions: [note("wizard.malleable-illusions", "Illusioni Malleabili", "action", "Modifichi la natura di un tuo incantesimo di illusione di durata 1 minuto o più.")] },
  [`${P}school-of-illusion.illusory-step`]: { actions: [note("wizard.illusory-self", "Sé Illusorio", "reaction", "Un attacco contro di te manca automaticamente.", "wizard.illusory-step")] },
  [`${P}school-of-illusion.illusory-reality`]: { actions: [note("wizard.illusory-reality", "Realtà Illusoria", "bonus", "Un oggetto inanimato non magico della tua illusione diventa reale per 1 minuto.")] },

  /* Necromanzia */
  [`${P}school-of-necromancy.grim-harvest`]: { actions: [note("wizard.grim-harvest", "Raccolto Macabro", "free", "Uccidendo con un incantesimo: recuperi il doppio del suo livello in PF (il triplo per la necromanzia).")] },
  [`${P}school-of-necromancy.undead-thralls`]: { spells: [{ spellId: "animate-dead" }] },
  [`${P}school-of-necromancy.inured-to-undeath`]: { effects: [{ type: "grant", target: "resistance", values: ["necrotic"] }] },
  [`${P}school-of-necromancy.command-undead`]: { actions: [note("wizard.command-undead", "Comandare Non Morti", "action", "Un non morto entro 18 m: TS Carisma o obbedisce a te finché non lo rilasci.")] },

  /* Trasmutazione */
  [`${P}school-of-transmutation.minor-alchemy`]: { actions: [note("wizard.minor-alchemy", "Alchimia Minore", "special", "In 10 minuti trasformi un oggetto di legno, pietra, ferro, rame o argento in un altro di questi materiali, per 1 ora.")] },
  [`${P}school-of-transmutation.transmuters-stone`]: {
    choices: [{ id: "wizard.transmuters-stone", kind: "custom", label: "Pietra del Trasmutatore: beneficio", count: 1, from: ["Scurovisione 18 m", "+3 m di velocità", "Competenza nei TS di Costituzione", "Resistenza a un tipo di danno elementale"] }],
    actions: [note("wizard.transmuters-stone", "Pietra del Trasmutatore", "special", "In 8 ore crei la pietra; ne cambi il beneficio quando lanci un incantesimo di trasmutazione.")],
  },
  [`${P}school-of-transmutation.shapechanger`]: { spells: [{ spellId: "polymorph", resource: "wizard.shapechanger" }] },
  [`${P}school-of-transmutation.master-transmuter`]: { actions: [note("wizard.master-transmuter", "Maestro Trasmutatore", "action", "Distruggi la pietra: trasmuti un oggetto, curi tutti i mali di una creatura, lanci rianimare morti senza slot o ringiovanisci una creatura.")] },

  /* Magia della Guerra */
  [`${P}war-magic.arcane-deflection`]: {
    actions: [note("wizard.arcane-deflection", "Deviazione Arcana", "reaction", "Colpito o fallendo un TS: +2 alla CA contro l'attacco, oppure +4 al TS. Fino alla fine del prossimo turno lanci solo trucchetti.")],
  },
  [`${P}war-magic.tactical-wit`]: { effects: [{ type: "bonus", target: "initiative", value: { mod: "int" }, label: "Ingegno Tattico" }] },
  [`${P}war-magic.power-surge`]: {
    resources: [uses("wizard.power-surge", "Impeto di Potere", atLeastOne({ mod: "int" }))],
    actions: [note("wizard.power-surge", "Impeto di Potere", "free", "Una volta per turno, ai danni di un incantesimo da mago aggiungi forza pari a metà del livello da mago.", "wizard.power-surge")],
  },
  [`${P}war-magic.durable-magic`]: { actions: [note("wizard.durable-magic", "Magia Durevole", "special", "Mentre mantieni la concentrazione: +2 alla CA e a tutti i tiri salvezza.")] },
  [`${P}war-magic.deflecting-shroud`]: { actions: [note("wizard.deflecting-shroud", "Velo Deviante", "free", "Con Deviazione Arcana: fino a tre creature entro 18 m subiscono forza pari a metà del livello da mago.")] },

  /* Cronurgia */
  [`${P}chronurgy-magic.chronal-shift`]: {
    resources: [uses("wizard.chronal-shift", "Spostamento Cronale", 2)],
    actions: [note("wizard.chronal-shift", "Spostamento Cronale", "reaction", "Una creatura entro 9 m deve ritirare un tiro per colpire, una prova o un tiro salvezza appena fatto.", "wizard.chronal-shift")],
  },
  [`${P}chronurgy-magic.temporal-awareness`]: { effects: [{ type: "bonus", target: "initiative", value: { mod: "int" }, label: "Consapevolezza Temporale" }] },
  [`${P}chronurgy-magic.momentary-stasis`]: {
    resources: [uses("wizard.momentary-stasis", "Stasi Momentanea", atLeastOne({ mod: "int" }))],
    actions: [note("wizard.momentary-stasis", "Stasi Momentanea", "action", "Una creatura Grande o più piccola entro 18 m: TS Costituzione o incapacitata e con velocità 0 fino alla fine del tuo prossimo turno.", "wizard.momentary-stasis")],
  },
  [`${P}chronurgy-magic.arcane-abeyance`]: { actions: [note("wizard.arcane-abeyance", "Sospensione Arcana", "special", "Un incantesimo di 4° livello o inferiore si condensa in una perla che chiunque può usare entro 1 ora (una volta per riposo breve).")] },
  [`${P}chronurgy-magic.convergent-future`]: { actions: [note("wizard.convergent-future", "Futuro Convergente", "reaction", "Decidi tu se un tiro entro 18 m riesce o fallisce. Ottieni 1 livello di indebolimento.")] },

  /* Graviturgia */
  [`${P}graviturgy-magic.adjust-density`]: { actions: [note("wizard.adjust-density", "Regolare la Densità", "action", "Una creatura o un oggetto Grande o più piccolo entro 9 m dimezza o raddoppia il peso per 1 minuto (concentrazione).")] },
  [`${P}graviturgy-magic.gravity-well`]: { actions: [note("wizard.gravity-well", "Pozzo Gravitazionale", "free", "Quando un tuo incantesimo colpisce o fa fallire un TS: sposti il bersaglio di 1,5 m.")] },
  [`${P}graviturgy-magic.violent-attraction`]: {
    resources: [uses("wizard.violent-attraction", "Attrazione Violenta", atLeastOne({ mod: "int" }))],
    actions: [rollAction("wizard.violent-attraction", "Attrazione Violenta", "reaction", "1d10", "Un attacco con arma entro 18 m fa questi danni in più, oppure una caduta raddoppia i danni.", { resource: "wizard.violent-attraction" })],
  },
  [`${P}graviturgy-magic.event-horizon`]: {
    resources: [uses("wizard.event-horizon", "Orizzonte degli Eventi", 1)],
    actions: [note("wizard.event-horizon", "Orizzonte degli Eventi", "action", "Per 1 minuto (concentrazione): le creature ostili entro 9 m fanno TS Forza o subiscono 2d10 forza e velocità 0. Senza usi: uno slot di 3° livello o superiore.", "wizard.event-horizon")],
  },

  /* Canto della Lama */
  [`${P}bladesinging.bladesong`]: {
    toggles: [{ id: BLADESONG, name: "Canto della Lama" }],
    actions: [
      { id: "wizard.bladesong", name: "Canto della Lama", timing: "bonus", cost: { resource: "wizard.bladesong", amount: 1 }, outcome: { kind: "toggleOn", toggle: BLADESONG }, when: { not: { toggle: BLADESONG } }, description: "Per 1 minuto, senza armatura media o pesante né scudo: CA e concentrazione migliorano, +3 m di velocità, vantaggio ad Acrobazia." },
      { id: "wizard.bladesong.end", name: "Termina il Canto della Lama", timing: "free", outcome: { kind: "toggleOff", toggle: BLADESONG }, when: { toggle: BLADESONG } },
    ],
    effects: [
      { type: "bonus", target: "ac", value: atLeastOne({ mod: "int" }), when: { toggle: BLADESONG }, label: "Canto della Lama" },
      { type: "bonus", target: "speed.walk", value: 10, when: { toggle: BLADESONG }, label: "Canto della Lama" },
      { type: "advantage", on: "skill.acrobatics", when: { toggle: BLADESONG }, label: "Canto della Lama" },
    ],
  },
  [`${P}bladesinging.song-of-defense`]: { actions: [note("wizard.song-of-defense", "Canto di Difesa", "reaction", "Durante il Canto della Lama: spendi uno slot per ridurre i danni subiti di 5 volte il livello dello slot.", undefined)] },
  [`${P}bladesinging.song-of-victory`]: { effects: [{ type: "bonus", target: "damage.all", value: atLeastOne({ mod: "int" }), when: { toggle: BLADESONG }, label: "Canto della Vittoria (in mischia)" }] },

  /* Ordine degli Scribi */
  [`${P}order-of-scribes.wizardly-quill`]: { actions: [note("wizard.wizardly-quill", "Penna Magica", "bonus", "Evochi la penna: copi un incantesimo nel libro in 2 minuti per livello e cancelli ciò che hai scritto.")] },
  [`${P}order-of-scribes.awakened-spellbook`]: { actions: [note("wizard.awakened-spellbook", "Libro Risvegliato", "special", "Un incantesimo che lanci sostituisce il suo tipo di danno con quello di un altro incantesimo del libro dello stesso livello; un rituale si lancia in tempo normale (una volta per riposo lungo).")] },
  [`${P}order-of-scribes.manifest-mind`]: {
    resources: [uses("wizard.manifest-mind", "Mente Manifesta", { prof: 1 })],
    actions: [note("wizard.manifest-mind", "Mente Manifesta", "bonus", "Lo spirito del libro appare entro 18 m: vedi e senti da lì, e lanci incantesimi da quel punto.", "wizard.manifest-mind")],
  },
  [`${P}order-of-scribes.master-scrivener`]: { actions: [note("wizard.master-scrivener", "Scrivano Esperto", "special", "Dopo un riposo lungo crei una pergamena di un incantesimo di 1° o 2° livello del libro, lanciata a un livello più alto.")] },
  [`${P}order-of-scribes.one-with-the-word`]: {
    effects: [{ type: "advantage", on: "skill.arcana", label: "Tutt'uno con la Parola" }],
    actions: [note("wizard.one-with-the-word", "Tutt'uno con la Parola", "reaction", "Quando subisci danni con la Mente Manifesta: li annulli e perdi incantesimi dal libro per un totale di livelli pari a 3d6.", "wizard.one-with-the-word")],
  },
};
