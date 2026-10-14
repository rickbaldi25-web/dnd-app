/** Tradizioni Monastiche. Le discipline elementali sono opzioni a parte. */
import { at, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "monk.";
const KI = "monk.ki";
const MARTIAL = { sides: at("monk", { 1: 4, 5: 6, 11: 8, 17: 10 }) };
const ARMS = "astral-arms";

export const MONK: Record<string, Mechanics> = {
  /* Ombra */
  [`${P}way-of-shadow.shadow-arts`]: {
    spells: [{ spellId: "minor-illusion", ability: "wis" }],
    actions: [note("monk.shadow-arts", "Arti dell'Ombra", "action", "Lanci oscurità, scurovisione, passare senza tracce o silenzio senza componenti materiali.", KI, 2)],
  },
  [`${P}way-of-shadow.shadow-step`]: { actions: [note("monk.shadow-step", "Passo d'Ombra", "bonus", "Da luce fioca o oscurità ti teletrasporti fino a 18 m in un'altra zona in ombra; vantaggio al primo attacco in mischia del turno.")] },
  [`${P}way-of-shadow.cloak-of-shadows`]: { actions: [note("monk.cloak-of-shadows", "Manto d'Ombra", "action", "In luce fioca o oscurità diventi invisibile finché non attacchi, lanci un incantesimo o sei in luce intensa.")] },
  [`${P}way-of-shadow.opportunist`]: { actions: [note("monk.opportunist", "Opportunista", "reaction", "Quando una creatura entro 1,5 m viene colpita da un altro: un attacco in mischia contro di lei.")] },

  /* Mano Aperta */
  [`${P}way-of-the-open-hand.open-hand-technique`]: { actions: [note("monk.open-hand-technique", "Tecnica della Mano Aperta", "free", "Colpendo con la Raffica di Colpi: TS Destrezza o prono; oppure TS Forza o spinto di 4,5 m; oppure niente reazioni fino al tuo prossimo turno.")] },
  [`${P}way-of-the-open-hand.tranquility`]: { actions: [note("monk.tranquility", "Tranquillità", "special", "Alla fine di un riposo lungo ottieni l'effetto di santuario fino al riposo lungo successivo.")] },
  [`${P}way-of-the-open-hand.quivering-palm`]: {
    actions: [
      note("monk.quivering-palm", "Palmo Vibrante", "free", "Quando colpisci senz'armi: vibrazioni che puoi attivare entro un numero di giorni pari al livello da monaco.", KI, 3),
      rollAction("monk.quivering-palm.end", "Palmo Vibrante: attivare", "action", "10d10", "TS Costituzione: se fallisce scende a 0 PF, altrimenti subisce questi danni necrotici."),
    ],
  },

  /* Maestro Ubriaco */
  [`${P}way-of-the-drunken-master.bonus-proficiencies`]: { effects: [{ type: "grant", target: "skill", values: ["performance"] }, { type: "grant", target: "tool", values: ["brewers-supplies"] }] },
  [`${P}way-of-the-drunken-master.drunken-technique`]: { actions: [note("monk.drunken-technique", "Tecnica dell'Ubriaco", "free", "Con la Raffica di Colpi ottieni anche Disimpegno e +3 m di velocità per il turno.")] },
  [`${P}way-of-the-drunken-master.tipsy-sway`]: { actions: [note("monk.tipsy-sway", "Ondeggiamento Brillo", "reaction", "Un attacco in mischia che ti manca colpisce invece un'altra creatura entro 1,5 m da te. Rialzarti da prono costa solo 1,5 m.", KI, 1)] },
  [`${P}way-of-the-drunken-master.drunkards-luck`]: { actions: [note("monk.drunkards-luck", "Fortuna dell'Ubriaco", "free", "Annulli lo svantaggio a una prova, un attacco o un tiro salvezza.", KI, 2)] },
  [`${P}way-of-the-drunken-master.intoxicated-frenzy`]: { actions: [note("monk.intoxicated-frenzy", "Frenesia Ebbra", "free", "La Raffica di Colpi può fare fino a tre attacchi in più, ognuno contro una creatura diversa.")] },

  /* Kensei */
  [`${P}way-of-the-kensei.path-of-the-kensei`]: {
    choices: [{ id: "monk.kensei-weapons", kind: "custom", label: "Armi del kensei", count: at("monk", { 3: 2, 6: 3, 11: 4, 17: 5 }), from: ["Arma da mischia", "Arma a distanza", "Altra arma (6°)", "Altra arma (11°)", "Altra arma (17°)"] }],
    actions: [
      note("monk.agile-parry", "Parata Agile", "free", "Colpendo senz'armi durante l'azione di Attacco, con un'arma del kensei in mano: +2 alla CA fino all'inizio del tuo prossimo turno."),
      rollAction("monk.kenseis-shot", "Tiro del Kensei", "bonus", "1d4", "Per questo turno, i colpi a distanza con un'arma del kensei fanno questi danni in più."),
    ],
  },
  [`${P}way-of-the-kensei.one-with-the-blade`]: { actions: [note("monk.deft-strike", "Colpo Abile", "free", "Colpendo con un'arma del kensei: danni extra pari al dado delle arti marziali (una volta per turno).", KI, 1)] },
  [`${P}way-of-the-kensei.sharpen-the-blade`]: {
    actions: [{ id: "monk.sharpen-the-blade", name: "Affilare la Lama", timing: "bonus", cost: { resource: KI, amount: 1, variable: true }, outcome: { kind: "note" }, description: "Fino a 3 ki: un'arma del kensei ottiene un bonus pari ai ki spesi ai tiri per colpire e ai danni, per 1 minuto." }],
  },
  [`${P}way-of-the-kensei.unerring-accuracy`]: { actions: [note("monk.unerring-accuracy", "Precisione Infallibile", "free", "Ritiri un attacco mancato con un'arma da monaco (una volta per turno).")] },

  /* Anima Solare */
  [`${P}way-of-the-sun-soul.radiant-sun-bolt`]: {
    actions: [
      rollAction("monk.radiant-sun-bolt", "Dardo del Sole Radioso", "action", MARTIAL, "Attacco a distanza (9 m) con Destrezza: danni radiosi. Al posto di un attacco dell'azione di Attacco.", { plus: { mod: "dex" } }),
      note("monk.radiant-sun-bolt.extra", "Dardi del Sole bonus", "bonus", "Dopo l'azione di Attacco: due Dardi del Sole Radioso.", KI, 1),
    ],
  },
  [`${P}way-of-the-sun-soul.searing-arc-strike`]: { actions: [note("monk.searing-arc-strike", "Colpo ad Arco Ardente", "bonus", "Dopo l'azione di Attacco lanci mani brucianti (2 ki per il 1° livello, +1 ki per livello in più).", KI, 2)] },
  [`${P}way-of-the-sun-soul.searing-sunburst`]: { actions: [rollAction("monk.searing-sunburst", "Esplosione di Sole Ardente", "action", "2d6", "Sfera di 6 m entro 45 m: TS Costituzione o danni radiosi. Ogni ki speso (fino a 3) aggiunge 2d6.")] },
  [`${P}way-of-the-sun-soul.sun-shield`]: { actions: [note("monk.sun-shield", "Scudo Solare", "reaction", "Emani luce; chi ti colpisce in mischia subisce danni radiosi pari a 5 + Saggezza.")] },

  /* Lunga Morte */
  [`${P}way-of-the-long-death.touch-of-death`]: { actions: [note("monk.touch-of-death", "Tocco della Morte", "free", "Quando riduci a 0 PF una creatura entro 1,5 m: PF temporanei pari a Saggezza + livello da monaco.")] },
  [`${P}way-of-the-long-death.hour-of-reaping`]: { actions: [note("monk.hour-of-reaping", "Ora del Raccolto", "action", "Ogni creatura entro 9 m che ti vede: TS Saggezza o spaventata fino alla fine del tuo prossimo turno.")] },
  [`${P}way-of-the-long-death.mastery-of-death`]: { actions: [note("monk.mastery-of-death", "Padronanza della Morte", "free", "Quando scendi a 0 PF: resti a 1 PF.", KI, 1)] },
  [`${P}way-of-the-long-death.touch-of-the-long-death`]: {
    actions: [{ id: "monk.touch-of-the-long-death", name: "Tocco della Lunga Morte", timing: "action", cost: { resource: KI, amount: 1, variable: true }, outcome: { kind: "note" }, description: "Da 1 a 10 ki: una creatura toccata, TS Costituzione o 2d10 danni necrotici per ki speso (dimezzati se riesce)." }],
  },

  /* Drago Ascendente */
  [`${P}way-of-the-ascendant-dragon.draconic-disciple`]: {
    choices: [{ id: "monk.draconic-disciple.language", kind: "language", label: "Discepolo Draconico: lingua", count: 1 }],
    actions: [note("monk.draconic-presence", "Presenza Draconica", "free", "Ritiri una prova di Intimidire o Persuadere fallita (una volta per riposo lungo).")],
  },
  [`${P}way-of-the-ascendant-dragon.breath-of-the-dragon`]: {
    resources: [uses("monk.breath-of-the-dragon", "Soffio del Drago", { prof: 1 })],
    actions: [rollAction("monk.breath-of-the-dragon", "Soffio del Drago", "free", { count: 2, sides: at("monk", { 1: 4, 5: 6, 11: 8, 17: 10 }) }, "Al posto di un attacco: cono di 6 m o linea di 9 m, TS Destrezza per dimezzare. Senza usi: 2 ki.", { resource: "monk.breath-of-the-dragon" })],
  },
  [`${P}way-of-the-ascendant-dragon.wings-unfurled`]: {
    resources: [uses("monk.wings-unfurled", "Ali Spiegate", { prof: 1 })],
    actions: [note("monk.wings-unfurled", "Ali Spiegate", "free", "Con il Passo del Vento: velocità di volare pari a quella di camminare fino alla fine del turno.", "monk.wings-unfurled")],
  },
  [`${P}way-of-the-ascendant-dragon.aspect-of-the-wyrm`]: { actions: [note("monk.aspect-of-the-wyrm", "Aspetto del Wyrm", "bonus", "Aura di 3 m per 1 minuto: spaventare le creature, oppure resistenza a un tipo di danno per gli alleati.", KI, 3)] },
  [`${P}way-of-the-ascendant-dragon.ascendant-aspect`]: { effects: [{ type: "sense", sense: "blindsight", range: 10 }] },

  /* Misericordia */
  [`${P}way-of-mercy.hand-of-healing`]: { actions: [rollAction("monk.hand-of-healing", "Mano della Guarigione", "action", MARTIAL, "Una creatura che tocchi recupera PF pari al dado + Saggezza. Si può fare al posto di un colpo della Raffica di Colpi.", { resource: KI, plus: { mod: "wis" } })] },
  [`${P}way-of-mercy.hand-of-harm`]: { actions: [rollAction("monk.hand-of-harm", "Mano del Danno", "free", MARTIAL, "Colpendo senz'armi: danni necrotici extra pari al dado + Saggezza (una volta per turno).", { resource: KI, plus: { mod: "wis" } })] },
  [`${P}way-of-mercy.flurry-of-healing-and-harm`]: { actions: [note("monk.flurry-of-healing-and-harm", "Raffica di Guarigione e Danno", "free", "Nella Raffica di Colpi, Mano della Guarigione e Mano del Danno non costano ki (una volta per turno ciascuna).")] },
  [`${P}way-of-mercy.hand-of-ultimate-mercy`]: { actions: [note("monk.hand-of-ultimate-mercy", "Mano della Misericordia Suprema", "action", "Riporti in vita una creatura morta da non più di 24 ore, con 4d10 + Saggezza PF.", "monk.hand-of-ultimate-mercy")] },

  /* Sé Astrale */
  [`${P}way-of-the-astral-self.arms-of-the-astral-self`]: {
    toggles: [{ id: ARMS, name: "Braccia del Sé Astrale" }],
    actions: [
      { id: "monk.astral-arms", name: "Braccia del Sé Astrale", timing: "bonus", cost: { resource: KI, amount: 1 }, outcome: { kind: "toggleOn", toggle: ARMS }, when: { not: { toggle: ARMS } }, description: "Per 10 minuti: portata +1,5 m, colpi senz'armi con Saggezza e danni da forza. All'evocazione, creature entro 3 m: TS Destrezza o due dadi delle arti marziali di danni da forza." },
      { id: "monk.astral-arms.end", name: "Congeda le braccia astrali", timing: "free", outcome: { kind: "toggleOff", toggle: ARMS }, when: { toggle: ARMS } },
    ],
  },
  [`${P}way-of-the-astral-self.visage-of-the-astral-self`]: { actions: [note("monk.astral-visage", "Volto del Sé Astrale", "bonus", "Per 10 minuti: vedi nell'oscurità magica fino a 36 m e parli in modo che senta solo chi scegli.", KI, 1)] },
  [`${P}way-of-the-astral-self.body-of-the-astral-self`]: {
    dice: [{ id: "monk.empowered-arms", name: "Braccia Potenziate", dice: MARTIAL, note: "Una volta per turno, quando colpisci con le braccia astrali", when: { toggle: ARMS } }],
    actions: [rollAction("monk.deflect-energy", "Deviare l'Energia", "reaction", "1d10", "Con braccia e volto evocati: riduci danni da acido, freddo, fuoco, forza, fulmine o tuono di 1d10 + Saggezza.", { plus: { mod: "wis" }, when: { toggle: ARMS } })],
  },
  [`${P}way-of-the-astral-self.awakened-astral-self`]: { actions: [note("monk.awakened-astral-self", "Sé Astrale Risvegliato", "bonus", "Evochi braccia, volto e corpo insieme: +2 alla CA e tre attacchi con le braccia astrali con l'azione di Attacco.", KI, 5)] },
};
