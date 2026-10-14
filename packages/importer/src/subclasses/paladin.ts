/** Giuramenti del Paladino. Gli incantesimi di giuramento arrivano dalle liste del compendio. */
import { atLeastOne, note, PALADIN_CHANNEL as CH, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "paladin.";

export const PALADIN: Record<string, Mechanics> = {
  /* Devozione */
  [`${P}oath-of-devotion.aura-of-devotion`]: { effects: [{ type: "grant", target: "conditionImmunity", values: ["charmed"] }] },
  [`${P}oath-of-devotion.holy-nimbus`]: { actions: [note("paladin.holy-nimbus", "Nimbo Sacro", "action", "Per 1 minuto: luce intensa per 9 m, i nemici che vi iniziano il turno subiscono 10 danni radiosi, vantaggio ai TS contro incantesimi di immondi e non morti.", "paladin.holy-nimbus")] },

  /* Antichi */
  [`${P}oath-of-the-ancients.channel-divinity-natures-wrath`]: { actions: [note("paladin.natures-wrath", "Ira della Natura", "action", "Viticci spettrali trattengono una creatura entro 3 m: TS Forza o Destrezza a sua scelta, ripetibile a ogni turno.", CH)] },
  [`${P}oath-of-the-ancients.channel-divinity-turn-the-faithless`]: { actions: [note("paladin.turn-the-faithless", "Scacciare gli Infedeli", "action", "Folletti e immondi entro 9 m: TS Saggezza o scacciati per 1 minuto.", CH)] },
  [`${P}oath-of-the-ancients.undying-sentinel`]: { actions: [note("paladin.undying-sentinel", "Sentinella Immortale", "free", "Quando scendi a 0 PF senza morire: resti a 1 PF.", "paladin.undying-sentinel")] },
  [`${P}oath-of-the-ancients.elder-champion`]: { actions: [note("paladin.elder-champion", "Campione Antico", "action", "Per 1 minuto: recuperi 10 PF a inizio turno, lanci incantesimi da 1 azione come azione bonus, i nemici entro 3 m hanno svantaggio contro i tuoi incantesimi e Incanalare Divinità.", "paladin.elder-champion")] },

  /* Vendetta */
  [`${P}oath-of-vengeance.relentless-avenger`]: { actions: [note("paladin.relentless-avenger", "Vendicatore Implacabile", "free", "Dopo un attacco di opportunità a segno: ti muovi fino a metà velocità senza provocare attacchi di opportunità.")] },
  [`${P}oath-of-vengeance.soul-of-vengeance`]: { actions: [note("paladin.soul-of-vengeance", "Anima della Vendetta", "reaction", "Quando la creatura del tuo Voto di Inimicizia attacca: un attacco in mischia contro di lei.")] },
  [`${P}oath-of-vengeance.avenging-angel`]: { actions: [note("paladin.avenging-angel", "Angelo Vendicatore", "action", "Per 1 ora: ali con volo 18 m e aura di 9 m che spaventa i nemici (TS Saggezza); gli attacchi contro gli spaventati hanno vantaggio.", "paladin.avenging-angel")] },

  /* Giuramento Infranto */
  [`${P}oathbreaker.channel-divinity-control-undead`]: { actions: [note("paladin.control-undead", "Controllare Non Morti", "action", "Un non morto entro 9 m: TS Saggezza o obbedisce ai tuoi ordini per 24 ore.", CH)] },
  [`${P}oathbreaker.channel-divinity-dreadful-aspect`]: { actions: [note("paladin.dreadful-aspect", "Aspetto Terrificante", "action", "Creature a scelta entro 9 m: TS Saggezza o spaventate per 1 minuto.", CH)] },
  [`${P}oathbreaker.dread-lord`]: { actions: [note("paladin.dread-lord", "Signore del Terrore", "action", "Per 1 minuto: aura di oscurità di 9 m, i nemici spaventati subiscono 4d10 psichici, e un attacco d'ombra come azione bonus.", "paladin.dread-lord")] },

  /* Conquista */
  [`${P}oath-of-conquest.channel-divinity-conquering-presence`]: { actions: [note("paladin.conquering-presence", "Presenza Conquistatrice", "action", "Creature a scelta entro 9 m: TS Saggezza o spaventate per 1 minuto.", CH)] },
  [`${P}oath-of-conquest.channel-divinity-guided-strike`]: { actions: [note("paladin.guided-strike", "Colpo Guidato", "free", "+10 a un tiro per colpire, dopo aver visto il tiro.", CH)] },
  [`${P}oath-of-conquest.invincible-conqueror`]: { actions: [note("paladin.invincible-conqueror", "Conquistatore Invincibile", "action", "Per 1 minuto: resistenza a tutti i danni, un attacco in più con l'azione di Attacco, critico con 19-20.", "paladin.invincible-conqueror")] },

  /* Redenzione */
  [`${P}oath-of-redemption.channel-divinity-emissary-of-peace`]: { actions: [note("paladin.emissary-of-peace", "Emissario di Pace", "bonus", "+5 alle prove di Persuasione per 10 minuti.", CH)] },
  [`${P}oath-of-redemption.channel-divinity-rebuke-the-violent`]: { actions: [note("paladin.rebuke-the-violent", "Rimproverare il Violento", "reaction", "Chi ha appena ferito un'altra creatura entro 9 m: TS Saggezza o subisce danni radiosi pari a quelli inflitti (metà se riesce).", CH)] },
  [`${P}oath-of-redemption.aura-of-the-guardian`]: { actions: [note("paladin.aura-of-the-guardian", "Aura del Guardiano", "reaction", "Subisci al posto di un'altra creatura entro 3 m i danni che ha appena subito.")] },
  [`${P}oath-of-redemption.protective-spirit`]: { actions: [rollAction("paladin.protective-spirit", "Spirito Protettivo", "special", "1d6", "A fine turno, se sei sotto metà dei PF e non a 0: recuperi il dado più metà del livello da paladino.", { plus: { div: [{ level: "paladin" }, 2], round: "down" }, outcome: { kind: "heal" } })] },

  /* Corona */
  [`${P}oath-of-the-crown.channel-divinity-champion-challenge`]: { actions: [note("paladin.champion-challenge", "Sfida del Campione", "bonus", "Creature a scelta entro 9 m: TS Saggezza o non possono allontanarsi da te più di 9 m.", CH)] },
  [`${P}oath-of-the-crown.channel-divinity-turn-the-tide`]: { actions: [rollAction("paladin.turn-the-tide", "Capovolgere le Sorti", "bonus", "1d6", "Ogni creatura a scelta entro 9 m sotto metà PF recupera questi PF (più Carisma, minimo 1).", { resource: CH, plus: { max: [1, { mod: "cha" }] } })] },
  [`${P}oath-of-the-crown.divine-allegiance`]: { actions: [note("paladin.divine-allegiance", "Lealtà Divina", "reaction", "Subisci al posto di una creatura entro 1,5 m i danni che sta per subire.")] },
  [`${P}oath-of-the-crown.unyielding-spirit`]: { effects: [{ type: "advantage", on: "save.vs.paralyzed", label: "Spirito Inflessibile" }, { type: "advantage", on: "save.vs.stunned", label: "Spirito Inflessibile" }] },
  [`${P}oath-of-the-crown.exalted-champion`]: { actions: [note("paladin.exalted-champion", "Campione Esaltato", "action", "Per 1 ora: resistenza ai danni delle armi non magiche; tu e gli alleati entro 9 m avete vantaggio ai TS su morte e su Saggezza.", "paladin.exalted-champion")] },

  /* Gloria */
  [`${P}oath-of-glory.channel-divinity-peerless-athlete`]: { actions: [note("paladin.peerless-athlete", "Atleta Impareggiabile", "bonus", "Per 10 minuti: vantaggio a Atletica e Acrobazia, carichi il doppio e salti 3 m in più.", CH)] },
  [`${P}oath-of-glory.channel-divinity-inspiring-smite`]: { actions: [rollAction("paladin.inspiring-smite", "Punizione Ispiratrice", "bonus", "2d8", "Dopo una Punizione Divina: distribuisci PF temporanei pari al tiro + il livello da paladino tra le creature entro 9 m.", { resource: CH, plus: { level: "paladin" } })] },
  [`${P}oath-of-glory.aura-of-alacrity`]: { effects: [{ type: "bonus", target: "speed.walk", value: 10, label: "Aura di Alacrità" }] },
  [`${P}oath-of-glory.glorious-defense`]: {
    resources: [uses("paladin.glorious-defense", "Difesa Gloriosa", atLeastOne({ mod: "cha" }))],
    actions: [note("paladin.glorious-defense", "Difesa Gloriosa", "reaction", "Una creatura entro 3 m sta per essere colpita: aggiungi il Carisma alla sua CA; se l'attacco manca, puoi attaccare l'attaccante.", "paladin.glorious-defense")],
  },
  [`${P}oath-of-glory.living-legend`]: {
    resources: [uses("paladin.living-legend", "Leggenda Vivente", 1)],
    actions: [note("paladin.living-legend", "Leggenda Vivente", "bonus", "Per 1 minuto: vantaggio alle prove di Carisma, una volta per turno un attacco mancato colpisce, ritiri i TS falliti con la reazione.", "paladin.living-legend")],
  },

  /* Sentinelle */
  [`${P}oath-of-the-watchers.channel-divinity-watchers-will`]: { actions: [note("paladin.watchers-will", "Volontà delle Sentinelle", "action", "Fino a tante creature quanto il Carisma, entro 9 m: vantaggio ai TS di Intelligenza, Saggezza e Carisma per 1 minuto.", CH)] },
  [`${P}oath-of-the-watchers.channel-divinity-abjure-the-extraplanar`]: { actions: [note("paladin.abjure-the-extraplanar", "Abiurare l'Extraplanare", "action", "Aberrazioni, celestiali, elementali, folletti e immondi entro 9 m: TS Saggezza o scacciati per 1 minuto.", CH)] },
  [`${P}oath-of-the-watchers.aura-of-the-sentinel`]: { effects: [{ type: "bonus", target: "initiative", value: { prof: 1 }, label: "Aura della Sentinella" }] },
  [`${P}oath-of-the-watchers.vigilant-rebuke`]: { actions: [rollAction("paladin.vigilant-rebuke", "Rimprovero Vigile", "reaction", "2d8", "Quando tu o una creatura entro 9 m superate un TS di Intelligenza, Saggezza o Carisma: chi l'ha causato subisce danni da forza (più Carisma).", { plus: { mod: "cha" } })] },
  [`${P}oath-of-the-watchers.mortal-bulwark`]: {
    resources: [uses("paladin.mortal-bulwark", "Baluardo Mortale", 1)],
    actions: [note("paladin.mortal-bulwark", "Baluardo Mortale", "bonus", "Per 1 minuto: vista pura 36 m, vantaggio contro aberrazioni, celestiali, elementali, folletti e immondi, che colpendo puoi bandire.", "paladin.mortal-bulwark")],
  },
};
