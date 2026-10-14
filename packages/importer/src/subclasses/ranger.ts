/** Archetipi del Ranger. Gli incantesimi di archetipo arrivano dalle liste del compendio. */
import { at, atLeastOne, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "ranger.";

export const RANGER: Record<string, Mechanics> = {
  /* Signore delle Bestie */
  [`${P}beast-master.rangers-companion`]: { actions: [note("ranger.command-companion", "Comandare il compagno", "action", "Il compagno animale attacca, scatta, si disimpegna, schiva o aiuta. Si muove e agisce al tuo turno.")] },
  [`${P}beast-master.exceptional-training`]: { actions: [note("ranger.exceptional-training", "Addestramento Eccezionale", "bonus", "Il compagno scatta, si disimpegna o aiuta come azione bonus; i suoi attacchi contano come magici.")] },
  [`${P}beast-master.bestial-fury`]: { actions: [note("ranger.bestial-fury", "Furia Bestiale", "special", "Quando ordini al compagno di attaccare, fa due attacchi.")] },
  [`${P}beast-master.share-spells`]: { actions: [note("ranger.share-spells", "Condividere Incantesimi", "special", "Un incantesimo che ti ha come bersaglio può avere anche il compagno entro 9 m.")] },

  /* Cacciatore: le opzioni sono importate tra i privilegi facoltativi del Ranger, qui si scelgono dal privilegio giusto */
  [`${P}hunter.hunters-prey`]: {
    choices: [{ id: "ranger.hunters-prey", kind: "feat", label: "Preda del Cacciatore", count: 1, from: ["ranger.optional.hunters-prey-colossus-slayer", "ranger.optional.hunters-prey-giant-killer", "ranger.optional.hunters-prey-horde-breaker"] }],
  },
  [`${P}hunter.superior-hunters-defense`]: {
    choices: [{ id: "ranger.superior-hunters-defense", kind: "feat", label: "Difesa Superiore del Cacciatore", count: 1, from: ["ranger.optional.superior-hunters-defense-evasion", "ranger.optional.superior-hunters-defense-stand-against-the-tide", "ranger.optional.superior-hunters-defense-uncanny-dodge"] }],
  },
  "ranger.optional.hunters-prey-giant-killer": { actions: [note("ranger.giant-killer", "Uccisore di Giganti", "reaction", "Una creatura Grande o più grande entro 1,5 m ti attacca: subito dopo puoi attaccarla.")] },
  "ranger.optional.hunters-prey-horde-breaker": { actions: [note("ranger.horde-breaker", "Spezzaorde", "free", "Una volta per turno, dopo un attacco con un'arma: un altro attacco contro una creatura entro 1,5 m dal bersaglio.")] },
  "ranger.optional.superior-hunters-defense-evasion": { actions: [note("ranger.evasion", "Evasione", "special", "Ai TS di Destrezza per dimezzare i danni: nessun danno se riesci, metà se fallisci.")] },
  "ranger.optional.superior-hunters-defense-stand-against-the-tide": { actions: [note("ranger.stand-against-the-tide", "Resistere alla Marea", "reaction", "Un attacco in mischia che ti manca colpisce un'altra creatura scelta da te.")] },
  "ranger.optional.superior-hunters-defense-uncanny-dodge": { actions: [note("ranger.uncanny-dodge", "Schivata Prodigiosa", "reaction", "Dimezzi i danni di un attacco di un attaccante che puoi vedere.")] },
  "ranger.hunter.defensive-tactics.escape-the-horde": { actions: [note("ranger.escape-the-horde", "Sfuggire all'Orda", "special", "Gli attacchi di opportunità contro di te hanno svantaggio.")] },
  "ranger.hunter.defensive-tactics.multiattack-defense": { actions: [note("ranger.multiattack-defense", "Difesa dai Multiattacchi", "special", "Dopo che una creatura ti colpisce: +4 alla CA contro i suoi attacchi successivi in questo turno.")] },
  "ranger.hunter.defensive-tactics.steel-will": { effects: [{ type: "advantage", on: "save.vs.frightened", label: "Volontà d'Acciaio" }] },
  "ranger.hunter.multiattack.volley": { actions: [note("ranger.volley", "Raffica", "action", "Un attacco a distanza contro ogni creatura entro 3 m da un punto che vedi.")] },
  "ranger.hunter.multiattack.whirlwind-attack": { actions: [note("ranger.whirlwind-attack", "Attacco Turbinante", "action", "Un attacco in mischia contro ogni creatura entro 1,5 m da te.")] },

  /* Cacciatore delle Tenebre */
  [`${P}gloom-stalker.dread-ambusher`]: {
    effects: [{ type: "bonus", target: "initiative", value: { mod: "wis" }, label: "Imboscatore Terrificante" }],
    dice: [{ id: "ranger.dread-ambusher", name: "Imboscatore Terrificante", dice: "1d8", note: "Nel primo turno di ogni combattimento: +3 m di velocità e un attacco in più con questi danni extra" }],
  },
  [`${P}gloom-stalker.umbral-sight`]: { effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
  [`${P}gloom-stalker.stalkers-flurry`]: { actions: [note("ranger.stalkers-flurry", "Raffica del Cacciatore", "free", "Una volta per turno, se manchi con un'arma: un altro attacco subito.")] },
  [`${P}gloom-stalker.shadowy-dodge`]: { actions: [note("ranger.shadowy-dodge", "Schivata Ombrosa", "reaction", "Un attacco contro di te senza vantaggio subisce svantaggio.")] },

  /* Viandante dell'Orizzonte */
  [`${P}horizon-walker.detect-portal`]: {
    resources: [uses("ranger.detect-portal", "Percepire Portali", 1, "short")],
    actions: [note("ranger.detect-portal", "Percepire Portali", "action", "Percepisci distanza e direzione del portale planare più vicino entro 1,5 km.", "ranger.detect-portal")],
  },
  [`${P}horizon-walker.planar-warrior`]: {
    dice: [{ id: "ranger.planar-warrior", name: "Guerriero Planare", dice: { count: at("ranger", { 3: 1, 11: 2 }), sides: 8 }, damageType: "force", note: "Al bersaglio marcato con l'azione bonus: tutti i danni del colpo diventano da forza" }],
    actions: [note("ranger.planar-warrior", "Guerriero Planare", "bonus", "Una creatura entro 9 m: il tuo prossimo colpo con un'arma in questo turno fa danni da forza e i dadi extra.")],
  },
  [`${P}horizon-walker.ethereal-step`]: { actions: [note("ranger.ethereal-step", "Passo Etereo", "bonus", "Entri nel Piano Etereo fino alla fine del turno.", "ranger.ethereal-step")] },
  [`${P}horizon-walker.distant-strike`]: { actions: [note("ranger.distant-strike", "Colpo Distante", "free", "Con l'azione di Attacco ti teletrasporti fino a 3 m prima di ogni attacco; se colpisci due creature diverse, un attacco in più contro una terza.")] },
  [`${P}horizon-walker.spectral-defense`]: { actions: [note("ranger.spectral-defense", "Difesa Spettrale", "reaction", "Ottieni resistenza a tutti i danni dell'attacco che ti ha appena colpito.")] },

  /* Uccisore di Mostri */
  [`${P}monster-slayer.hunters-sense`]: {
    resources: [uses("ranger.hunters-sense", "Senso del Cacciatore", atLeastOne({ mod: "wis" }))],
    actions: [note("ranger.hunters-sense", "Senso del Cacciatore", "action", "Una creatura entro 18 m: scopri immunità, resistenze e vulnerabilità ai danni.", "ranger.hunters-sense")],
  },
  [`${P}monster-slayer.slayers-prey`]: {
    resources: [uses("ranger.slayers-prey", "Preda dell'Uccisore", 1, "short")],
    dice: [{ id: "ranger.slayers-prey", name: "Preda dell'Uccisore", dice: "1d6", note: "Al primo colpo di ogni turno contro il bersaglio designato" }],
    actions: [note("ranger.slayers-prey", "Preda dell'Uccisore", "bonus", "Designi una creatura entro 18 m fino al prossimo riposo o finché non ne designi un'altra.")],
  },
  [`${P}monster-slayer.supernatural-defense`]: { dice: [{ id: "ranger.supernatural-defense", name: "Difesa Sovrannaturale", dice: "1d6", note: "Ai tiri salvezza e alle prove per sfuggire dalla lotta della preda designata" }] },
  [`${P}monster-slayer.magic-users-nemesis`]: { actions: [note("ranger.magic-users-nemesis", "Nemesi degli Incantatori", "reaction", "Una creatura entro 18 m lancia un incantesimo o si teletrasporta: TS Saggezza o fallisce.", "ranger.magic-users-nemesis")] },
  [`${P}monster-slayer.slayers-counter`]: { actions: [note("ranger.slayers-counter", "Contromossa dell'Uccisore", "reaction", "Quando la preda ti costringe a un TS: un attacco contro di lei; se colpisci superi il TS.")] },

  /* Custode dei Draghi */
  [`${P}drakewarden.draconic-gift`]: {
    choices: [{ id: "ranger.draconic-gift.language", kind: "language", label: "Dono Draconico: lingua", count: 1 }],
    spells: [{ spellId: "thaumaturgy" }],
  },
  [`${P}drakewarden.drake-companion`]: {
    resources: [uses("ranger.drake-companion", "Compagno Drago", 1)],
    actions: [
      note("ranger.drake-companion", "Evocare il Compagno Drago", "action", "Il drago compare entro 9 m (una volta per riposo lungo, poi con uno slot di 1° livello o superiore).", "ranger.drake-companion"),
      note("ranger.command-drake", "Comandare il drago", "bonus", "Il drago usa la sua azione; reazione per infondere un tuo attacco di danni del suo elemento."),
    ],
  },
  [`${P}drakewarden.bond-of-fang-and-scale`]: { dice: [{ id: "ranger.infused-strikes", name: "Colpi Infusi", dice: { count: 1, sides: at("ranger", { 7: 6, 15: 6 }) }, note: "Il morso del drago fa questi danni in più del suo elemento" }] },
  [`${P}drakewarden.drakes-breath`]: {
    resources: [uses("ranger.drakes-breath", "Soffio del Drago", 1)],
    actions: [rollAction("ranger.drakes-breath", "Soffio del Drago", "action", { count: at("ranger", { 11: 8, 15: 10 }), sides: 6 }, "Cono di 9 m da te o dal drago: TS Destrezza per dimezzare. Senza usi: uno slot di 3° livello o superiore.", { resource: "ranger.drakes-breath" })],
  },
  [`${P}drakewarden.perfected-bond`]: { actions: [note("ranger.perfected-bond", "Legame Perfezionato", "reaction", "Il drago colpito o tu entro 9 m da lui ottenete resistenza ai danni (volte pari al bonus di competenza).")] },

  /* Viandante Fatato */
  [`${P}fey-wanderer.dreadful-strikes`]: { dice: [{ id: "ranger.dreadful-strikes", name: "Colpi Terrificanti", dice: { count: 1, sides: at("ranger", { 3: 4, 11: 6 }) }, damageType: "psychic", note: "Una volta per turno per creatura, quando colpisci con un'arma" }] },
  [`${P}fey-wanderer.otherworldly-glamour`]: {
    effects: [{ type: "bonus", target: "check.cha", value: { max: [1, { mod: "wis" }] }, label: "Fascino Ultraterreno" }],
    choices: [{ id: "ranger.otherworldly-glamour.skill", kind: "skill", label: "Fascino Ultraterreno: abilità", count: 1, from: ["deception", "performance", "persuasion"] }],
  },
  [`${P}fey-wanderer.beguiling-twist`]: { actions: [note("ranger.beguiling-twist", "Torsione Ammaliante", "reaction", "Quando una creatura entro 36 m supera un TS contro affascinato o spaventato: un'altra creatura fa TS Saggezza o è affascinata o spaventata per 1 minuto.")] },
  [`${P}fey-wanderer.fey-reinforcements`]: {
    resources: [uses("ranger.fey-reinforcements", "Rinforzi Fatati", 1)],
    spells: [{ spellId: "summon-fey", resource: "ranger.fey-reinforcements" }],
  },
  [`${P}fey-wanderer.misty-wanderer`]: {
    resources: [uses("ranger.misty-wanderer", "Viandante della Nebbia", atLeastOne({ mod: "wis" }))],
    spells: [{ spellId: "misty-step", resource: "ranger.misty-wanderer" }],
  },

  /* Custode dello Sciame */
  [`${P}swarmkeeper.gathered-swarm`]: {
    dice: [{ id: "ranger.gathered-swarm", name: "Sciame Raccolto", dice: { count: 1, sides: at("ranger", { 3: 6, 11: 8 }) }, damageType: "piercing", note: "Una volta per turno quando colpisci: danni, spinta di 4,5 m o ti sposti di 1,5 m" }],
  },
  [`${P}swarmkeeper.writhing-tide`]: { actions: [note("ranger.writhing-tide", "Marea Brulicante", "bonus", "Per 1 minuto lo sciame ti dà velocità di volare 3 m e la capacità di fluttuare.", "ranger.writhing-tide")] },
  [`${P}swarmkeeper.swarming-dispersal`]: { actions: [note("ranger.swarming-dispersal", "Dispersione dello Sciame", "reaction", "Quando subisci danni: resistenza a quei danni e ti teletrasporti fino a 9 m.", "ranger.swarming-dispersal")] },
};
