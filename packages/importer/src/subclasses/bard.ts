/** Sottoclassi del Bardo. */
import { at, atLeastOne, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "bard.";
const INSPIRATION = "bard.bardic-inspiration";
const INSPIRATION_DIE = { sides: at("bard", { 1: 6, 5: 8, 10: 10, 15: 12 }) };

export const BARD: Record<string, Mechanics> = {
  /* Sapienza */
  [`${P}college-of-lore.additional-magical-secrets`]: {
    choices: [{ id: "bard.additional-magical-secrets", kind: "spell", label: "Segreti Magici Aggiuntivi", count: 2, spell: { maxLevel: 3, ability: "cha" } }],
  },
  [`${P}college-of-lore.peerless-skill`]: { actions: [rollAction("bard.peerless-skill", "Abilità Impareggiabile", "free", INSPIRATION_DIE, "Aggiungi il dado a una tua prova di caratteristica.", { resource: INSPIRATION })] },

  /* Valore */
  [`${P}college-of-valor.combat-inspiration`]: { actions: [note("bard.combat-inspiration", "Ispirazione in Combattimento", "special", "Chi ha il tuo dado di ispirazione può aggiungerlo ai danni di un'arma, oppure alla CA contro un attacco (reazione).")] },
  [`${P}college-of-valor.battle-magic`]: { actions: [note("bard.battle-magic", "Magia da Battaglia", "bonus", "Dopo aver usato l'azione per lanciare un incantesimo da bardo: un attacco con un'arma.")] },

  /* Incanto */
  [`${P}college-of-glamour.mantle-of-inspiration`]: {
    actions: [note("bard.mantle-of-inspiration", "Manto d'Ispirazione", "bonus", "Fino a tante creature quanto il modificatore di Carisma, entro 18 m: PF temporanei (5, poi 8 al 5°, 11 al 10°, 14 al 15°) e movimento immediato con la reazione senza attacchi di opportunità.", INSPIRATION)],
  },
  [`${P}college-of-glamour.enthralling-performance`]: { actions: [note("bard.enthralling-performance", "Esibizione Ammaliante", "action", "Dopo 1 minuto di esibizione: fino a tante creature quanto il modificatore di Carisma, TS Saggezza o affascinate per 1 ora.", "bard.enthralling-performance")] },
  [`${P}college-of-glamour.mantle-of-majesty`]: { actions: [note("bard.mantle-of-majesty", "Manto di Maestà", "bonus", "Lanci comando senza slot; per 1 minuto (concentrazione) puoi rilanciarlo come azione bonus a ogni turno.", "bard.mantle-of-majesty")] },
  [`${P}college-of-glamour.unbreakable-majesty`]: { actions: [note("bard.unbreakable-majesty", "Maestà Inviolabile", "bonus", "Per 1 minuto chi ti attacca per la prima volta nel turno fa un TS Carisma o sceglie un altro bersaglio.", "bard.unbreakable-majesty")] },

  /* Spade */
  [`${P}college-of-swords.bonus-proficiencies`]: { effects: [{ type: "grant", target: "armor", values: ["medium"] }, { type: "grant", target: "weapon", values: ["scimitar"] }] },
  [`${P}college-of-swords.blade-flourish`]: {
    effects: [{ type: "bonus", target: "speed.walk", value: 10, label: "Fendente Fiorito (nel turno in cui attacchi)" }],
    actions: [
      rollAction("bard.flourish.defensive", "Fendente Difensivo", "free", INSPIRATION_DIE, "Aggiungi il dado ai danni e alla tua CA fino all'inizio del tuo prossimo turno.", { resource: INSPIRATION }),
      rollAction("bard.flourish.slashing", "Fendente Tagliente", "free", INSPIRATION_DIE, "Aggiungi il dado ai danni del bersaglio e di un'altra creatura entro 1,5 m da te.", { resource: INSPIRATION }),
      rollAction("bard.flourish.mobile", "Fendente Mobile", "free", INSPIRATION_DIE, "Aggiungi il dado ai danni e spingi il bersaglio di 1,5 m più il risultato; puoi seguirlo con la reazione.", { resource: INSPIRATION }),
    ],
  },
  [`${P}college-of-swords.masters-flourish`]: { actions: [rollAction("bard.masters-flourish", "Fendente del Maestro", "free", "1d6", "Un Fendente Fiorito senza spendere Ispirazione: usa un d6 al posto del dado.")] },

  /* Sussurri */
  [`${P}college-of-whispers.psychic-blades`]: {
    dice: [{ id: "bard.psychic-blades", name: "Lame Psichiche", dice: { count: at("bard", { 3: 2, 5: 3, 10: 5, 15: 8 }), sides: 6 }, damageType: "psychic", note: "Una volta per turno, quando colpisci con un'arma: spendi un uso di Ispirazione Bardica" }],
    actions: [note("bard.psychic-blades", "Lame Psichiche", "free", "Spendi un'Ispirazione Bardica per i danni psichici extra.", INSPIRATION)],
  },
  [`${P}college-of-whispers.words-of-terror`]: { actions: [note("bard.words-of-terror", "Parole del Terrore", "action", "Dopo 1 minuto da soli con una creatura: TS Saggezza o spaventata da te o da qualcuno che scegli per 1 ora.", "bard.words-of-terror")] },
  [`${P}college-of-whispers.mantle-of-whispers`]: { actions: [note("bard.mantle-of-whispers", "Manto dei Sussurri", "reaction", "Quando un umanoide muore entro 9 m: ne catturi l'ombra e puoi assumerne l'aspetto per 1 ora.", "bard.mantle-of-whispers")] },
  [`${P}college-of-whispers.shadow-lore`]: { actions: [note("bard.shadow-lore", "Sapere dell'Ombra", "action", "Una creatura entro 9 m che ti sente: TS Saggezza o affascinata per 8 ore, convinta che tu conosca il suo segreto.", "bard.shadow-lore")] },

  /* Spiriti */
  [`${P}college-of-spirits.guiding-whispers`]: { spells: [{ spellId: "guidance" }] },
  [`${P}college-of-spirits.spiritual-focus`]: { dice: [{ id: "bard.spiritual-focus", name: "Focus Spirituale", dice: "1d6", note: "Dal 6° livello, a un tiro di danni o cure di un incantesimo da bardo lanciato con il focus" }] },
  [`${P}college-of-spirits.tales-from-beyond`]: {
    actions: [rollAction("bard.tales-from-beyond", "Racconti dall'Aldilà", "bonus", INSPIRATION_DIE, "Tira sulla tabella Spirit Tales: tieni il racconto finché non lo usi o fai un riposo.", { resource: INSPIRATION })],
  },
  [`${P}college-of-spirits.spirit-session`]: { actions: [note("bard.spirit-session", "Seduta Spiritica", "special", "Rituale di 1 ora con fino a 5 creature: impari un incantesimo di divinazione o necromanzia di livello non superiore al numero dei partecipanti.", "bard.spirit-session")] },
  [`${P}college-of-spirits.mystical-connection`]: { actions: [rollAction("bard.mystical-connection", "Connessione Mistica", "free", "1d6", "Quando tiri su Racconti dall'Aldilà, puoi tirare due volte e scegliere.")] },

  /* Creazione */
  [`${P}college-of-creation.mote-of-potential`]: { actions: [note("bard.mote-of-potential", "Granello di Potenziale", "special", "Chi riceve il tuo dado di ispirazione: per una prova lo tira due volte; per un attacco, al colpo 5 m di tuono (TS Costituzione); per un tiro salvezza, PF temporanei pari al dado + Carisma.")] },
  [`${P}college-of-creation.performance-of-creation`]: {
    resources: [uses("bard.performance-of-creation", "Esibizione della Creazione", 1)],
    actions: [note("bard.performance-of-creation", "Esibizione della Creazione", "action", "Crei un oggetto non magico entro 3 m, di valore fino a 20 volte il tuo livello da bardo in mo. Senza usi: uno slot di 2° livello o superiore.", "bard.performance-of-creation")],
  },
  [`${P}college-of-creation.animating-performance`]: {
    resources: [uses("bard.animating-performance", "Esibizione Animata", 1)],
    actions: [note("bard.animating-performance", "Esibizione Animata", "action", "Un oggetto Grande o più piccolo diventa un servitore danzante per 1 ora. Senza usi: uno slot di 3° livello o superiore.", "bard.animating-performance")],
  },
  [`${P}college-of-creation.creative-crescendo`]: { actions: [note("bard.creative-crescendo", "Crescendo Creativo", "special", "Con Esibizione della Creazione crei più oggetti insieme (fino al modificatore di Carisma), senza limite di valore per uno di loro.")] },

  /* Eloquenza */
  [`${P}college-of-eloquence.silver-tongue`]: { actions: [note("bard.silver-tongue", "Lingua d'Argento", "special", "Nelle prove di Persuasione e Inganno un risultato di 9 o meno sul d20 conta come 10.")] },
  [`${P}college-of-eloquence.unsettling-words`]: {
    actions: [rollAction("bard.unsettling-words", "Parole Inquietanti", "bonus", INSPIRATION_DIE, "Una creatura entro 18 m sottrae il risultato al suo prossimo tiro salvezza prima dell'inizio del tuo prossimo turno.", { resource: INSPIRATION })],
  },
  [`${P}college-of-eloquence.universal-speech`]: {
    resources: [uses("bard.universal-speech", "Parola Universale", 1)],
    actions: [note("bard.universal-speech", "Parola Universale", "action", "Fino a tante creature quanto il modificatore di Carisma ti capiscono per 1 ora. Senza usi: uno slot qualsiasi.", "bard.universal-speech")],
  },
  [`${P}college-of-eloquence.infectious-inspiration`]: {
    resources: [uses("bard.infectious-inspiration", "Ispirazione Contagiosa", atLeastOne({ mod: "cha" }))],
    actions: [note("bard.infectious-inspiration", "Ispirazione Contagiosa", "reaction", "Quando qualcuno usa con successo il tuo dado: dai un'Ispirazione Bardica a un'altra creatura senza spenderla.", "bard.infectious-inspiration")],
  },
};

