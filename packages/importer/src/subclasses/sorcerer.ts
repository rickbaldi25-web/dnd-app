/** Origini Stregonesche. Gli incantesimi delle origini arrivano dalle liste del compendio. */
import { note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "sorcerer.";
const SP = "sorcerer.sorcery-points";

export const SORCERER: Record<string, Mechanics> = {
  /* Discendenza Draconica */
  [`${P}draconic-bloodline.dragon-ancestor`]: {
    effects: [{ type: "grant", target: "language", values: ["draconic"] }],
    choices: [{ id: "sorcerer.dragon-ancestor", kind: "custom", label: "Antenato draconico", count: 1, from: ["Nero (acido)", "Blu (fulmine)", "Ottone (fuoco)", "Bronzo (fulmine)", "Rame (acido)", "Oro (fuoco)", "Verde (veleno)", "Rosso (fuoco)", "Argento (freddo)", "Bianco (freddo)"] }],
  },
  [`${P}draconic-bloodline.elemental-affinity`]: { actions: [note("sorcerer.elemental-affinity", "Affinità Elementale", "free", "Ai danni del tipo del tuo antenato aggiungi il Carisma; con 1 punto stregoneria hai resistenza a quel tipo per 1 ora.")] },
  [`${P}draconic-bloodline.dragon-wings`]: { actions: [note("sorcerer.dragon-wings", "Ali di Drago", "bonus", "Spieghi le ali: velocità di volare pari a quella di camminare finché non le ritiri.")] },
  [`${P}draconic-bloodline.draconic-presence`]: { actions: [note("sorcerer.draconic-presence", "Presenza Draconica", "action", "Aura di 18 m per 1 minuto (concentrazione): ogni creatura ostile fa TS Saggezza o è affascinata o spaventata.", SP, 5)] },

  /* Magia Selvaggia (Maree del Caos e Piegare la Fortuna sono già nella base) */
  [`${P}wild-magic.wild-magic-surge`]: { actions: [rollAction("sorcerer.wild-magic-surge", "Impulso di Magia Selvaggia", "special", "1d20", "Dopo un incantesimo di 1° livello o superiore, se il Master lo chiede: con 1 si tira 1d100 sulla tabella.")] },
  [`${P}wild-magic.controlled-chaos`]: { actions: [rollAction("sorcerer.controlled-chaos", "Caos Controllato", "special", "1d100", "Tiri due volte sulla tabella della Magia Selvaggia e scegli.")] },
  [`${P}wild-magic.spell-bombardment`]: { actions: [note("sorcerer.spell-bombardment", "Bombardamento Magico", "free", "Una volta per turno, quando un dado di danno di un incantesimo esce al massimo, tiri un altro dado e lo aggiungi.")] },

  /* Anima Divina */
  [`${P}divine-soul.divine-magic`]: {
    choices: [{ id: "sorcerer.divine-soul.affinity", kind: "custom", label: "Affinità divina", count: 1, from: ["Buona (cura ferite)", "Malvagia (infliggi ferite)", "Legale (benedizione)", "Caotica (anatema)", "Neutrale (protezione dal bene e dal male)"] }],
  },
  [`${P}divine-soul.favored-by-the-gods`]: { actions: [rollAction("sorcerer.favored-by-the-gods", "Favorito dagli Dèi", "free", "2d4", "Aggiungi il risultato a un tiro salvezza o un tiro per colpire falliti.", { resource: "sorcerer.favored-by-gods" })] },
  [`${P}divine-soul.empowered-healing`]: { actions: [note("sorcerer.empowered-healing", "Guarigione Potenziata", "free", "Ritiri i dadi di cura di un incantesimo (tuo o di un alleato entro 1,5 m), una volta per turno.", SP, 1)] },
  [`${P}divine-soul.otherworldly-wings`]: { actions: [note("sorcerer.otherworldly-wings", "Ali Ultraterrene", "bonus", "Spieghi ali spettrali: velocità di volare 9 m finché non le ritiri.")] },
  [`${P}divine-soul.unearthly-recovery`]: { actions: [note("sorcerer.unearthly-recovery", "Recupero Ultraterreno", "bonus", "Se hai meno di metà dei PF: recuperi PF pari a metà del massimo.", "sorcerer.unearthly-recovery")] },

  /* Magia dell'Ombra */
  [`${P}shadow-magic.eyes-of-the-dark`]: {
    effects: [{ type: "sense", sense: "darkvision", range: 120 }],
    actions: [note("sorcerer.eyes-of-the-dark", "Occhi dell'Oscurità", "action", "Dal 3° livello lanci oscurità e vedi attraverso di essa.", SP, 2)],
  },
  [`${P}shadow-magic.strength-of-the-grave`]: { actions: [note("sorcerer.strength-of-the-grave", "Forza della Tomba", "free", "Quando scendi a 0 PF senza morire sul colpo: TS Carisma (CD 5 + danni) per restare a 1 PF. Non vale contro radiosi e critici.", "sorcerer.strength-of-the-grave")] },
  [`${P}shadow-magic.hound-of-ill-omen`]: { actions: [note("sorcerer.hound-of-ill-omen", "Segugio del Malaugurio", "bonus", "Un segugio d'ombra appare entro 9 m da un bersaglio: lo insegue, ha svantaggio ai TS contro i tuoi incantesimi finché il segugio è vicino.", SP, 3)] },
  [`${P}shadow-magic.shadow-walk`]: { actions: [note("sorcerer.shadow-walk", "Passo nell'Ombra", "bonus", "In luce fioca o oscurità: ti teletrasporti fino a 36 m in un altro punto buio.")] },
  [`${P}shadow-magic.umbral-form`]: { actions: [note("sorcerer.umbral-form", "Forma Umbratile", "bonus", "Per 1 minuto: resistenza a tutti i danni tranne forza e radiosi, attraversi creature e oggetti.", SP, 6)] },

  /* Stregoneria della Tempesta */
  [`${P}storm-sorcery.wind-speaker`]: { effects: [{ type: "grant", target: "language", values: ["primordial"] }] },
  [`${P}storm-sorcery.tempestuous-magic`]: { actions: [note("sorcerer.tempestuous-magic", "Magia Tempestosa", "bonus", "Prima o dopo un incantesimo di 1° livello o superiore: voli fino a 3 m senza provocare attacchi di opportunità.")] },
  [`${P}storm-sorcery.heart-of-the-storm`]: {
    effects: [{ type: "grant", target: "resistance", values: ["lightning", "thunder"] }],
    actions: [note("sorcerer.heart-of-the-storm", "Cuore della Tempesta", "free", "Lanciando un incantesimo di fulmine o tuono: creature a scelta entro 3 m subiscono danni pari a metà del tuo livello da stregone.")],
  },
  [`${P}storm-sorcery.storm-guide`]: { actions: [note("sorcerer.storm-guide", "Guida della Tempesta", "action", "Fermi la pioggia intorno a te o cambi direzione al vento entro 30 m, fino alla fine del tuo prossimo turno.")] },
  [`${P}storm-sorcery.storms-fury`]: { actions: [note("sorcerer.storms-fury", "Furia della Tempesta", "reaction", "Chi ti colpisce in mischia subisce danni da fulmine pari al tuo livello da stregone e TS Forza o viene spinto fino a 6 m.")] },
  [`${P}storm-sorcery.wind-soul`]: {
    effects: [{ type: "grant", target: "immunity", values: ["lightning", "thunder"] }, { type: "speed", mode: "fly", value: 60 }],
    actions: [note("sorcerer.wind-soul", "Anima del Vento", "action", "Per 1 ora fino a 3 + Carisma creature entro 9 m ottengono volo 9 m; la tua velocità di volare scende di 3 m per ognuna.", "sorcerer.wind-soul")],
  },

  /* Mente Aberrante */
  [`${P}aberrant-mind.telepathic-speech`]: { actions: [note("sorcerer.telepathic-speech", "Parola Telepatica", "bonus", "Collegamento telepatico con una creatura entro 9 m per tanti minuti quanto il livello da stregone.")] },
  [`${P}aberrant-mind.psionic-sorcery`]: { actions: [note("sorcerer.psionic-sorcery", "Stregoneria Psionica", "special", "Un incantesimo psionico si lancia spendendo punti stregoneria pari al suo livello, senza componenti verbali né somatiche.")] },
  [`${P}aberrant-mind.psychic-defenses`]: { effects: [{ type: "grant", target: "resistance", values: ["psychic"] }, { type: "advantage", on: "save.vs.charmed", label: "Difese Psichiche" }, { type: "advantage", on: "save.vs.frightened", label: "Difese Psichiche" }] },
  [`${P}aberrant-mind.revelation-in-flesh`]: { actions: [note("sorcerer.revelation-in-flesh", "Rivelazione nella Carne", "bonus", "Per 10 minuti, per ogni punto speso: vista dell'invisibile, volo, nuoto e respiro sott'acqua, oppure corpo fluido.", SP, 1)] },
  [`${P}aberrant-mind.warping-implosion`]: {
    resources: [uses("sorcerer.warping-implosion", "Implosione Distorcente", 1)],
    actions: [rollAction("sorcerer.warping-implosion", "Implosione Distorcente", "action", "3d10", "Ti teletrasporti fino a 36 m; le creature entro 9 m da dove eri: TS Forza o danni da forza e tirate verso quel punto. Senza usi: 5 punti stregoneria.", { resource: "sorcerer.warping-implosion" })],
  },

  /* Anima Meccanica */
  [`${P}clockwork-soul.restore-balance`]: { actions: [note("sorcerer.restore-balance", "Ristabilire l'Equilibrio", "reaction", "Una creatura entro 18 m sta per tirare con vantaggio o svantaggio: lo annulli.", "sorcerer.restore-balance")] },
  [`${P}clockwork-soul.bastion-of-law`]: {
    actions: [{ id: "sorcerer.bastion-of-law", name: "Bastione della Legge", timing: "action", cost: { resource: SP, amount: 1, variable: true }, outcome: { kind: "note" }, description: "Da 1 a 5 punti: una creatura ottiene altrettanti d8 per ridurre i danni subiti, finché non li usa o fai un riposo lungo." }],
    dice: [{ id: "sorcerer.bastion-of-law", name: "Bastione della Legge", dice: "1d8", note: "Per ogni dado di protezione speso" }],
  },
  [`${P}clockwork-soul.trance-of-order`]: {
    resources: [uses("sorcerer.trance-of-order", "Trance dell'Ordine", 1)],
    actions: [note("sorcerer.trance-of-order", "Trance dell'Ordine", "bonus", "Per 1 minuto: nessuno ha vantaggio contro di te, e i tuoi d20 sotto il 10 contano come 10. Senza usi: 5 punti stregoneria.", "sorcerer.trance-of-order")],
  },
  [`${P}clockwork-soul.clockwork-cavalcade`]: {
    resources: [uses("sorcerer.clockwork-cavalcade", "Cavalcata Meccanica", 1)],
    actions: [note("sorcerer.clockwork-cavalcade", "Cavalcata Meccanica", "action", "Cubo di 9 m: fino a 100 PF ripartiti, ripari gli oggetti e termini incantesimi di 6° livello o inferiori. Senza usi: 7 punti stregoneria.", "sorcerer.clockwork-cavalcade")],
  },

  /* Magia Lunare */
  [`${P}lunar-magic.lunar-embodiment`]: {
    choices: [{ id: "sorcerer.lunar-phase", kind: "custom", label: "Fase lunare attuale", count: 1, from: ["Luna piena", "Luna nuova", "Luna crescente"] }],
    actions: [note("sorcerer.lunar-embodiment", "Incarnazione Lunare", "special", "Lanci senza slot un incantesimo della fase attuale, una volta per riposo lungo.", "sorcerer.lunar-embodiment")],
  },
  [`${P}lunar-magic.moon-fire`]: { spells: [{ spellId: "sacred-flame" }] },
  [`${P}lunar-magic.lunar-boons`]: { actions: [note("sorcerer.lunar-boons", "Doni Lunari", "special", "Gli incantesimi della scuola legata alla fase costano 1 punto stregoneria in meno per la metamagia (volte pari al bonus di competenza).")] },
  [`${P}lunar-magic.waxing-and-waning`]: { actions: [note("sorcerer.waxing-and-waning", "Crescere e Calare", "bonus", "Cambi la fase lunare attuale.", SP, 1)] },
  [`${P}lunar-magic.lunar-empowerment`]: { actions: [note("sorcerer.lunar-empowerment", "Potenziamento Lunare", "special", "Beneficio passivo della fase: piena, luce e vantaggio a Indagare e Percezione; nuova, vantaggio a Furtività; crescente, resistenza a necrotici e radiosi.")] },
  [`${P}lunar-magic.lunar-phenomenon`]: { actions: [note("sorcerer.lunar-phenomenon", "Fenomeno Lunare", "bonus", "Effetto della fase: piena, luce che acceca e cura; nuova, oscurità che danneggia e rende invisibili; crescente, teletrasporto e resistenza. Senza usi: 5 punti stregoneria.", "sorcerer.lunar-phenomenon")] },
};

