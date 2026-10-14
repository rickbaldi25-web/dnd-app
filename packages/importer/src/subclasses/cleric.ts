/** Domini del Chierico. Gli incantesimi di dominio arrivano dalle liste del compendio; il Colpo Divino è comune (*.divine-strike). */
import { atLeastOne, CLERIC_CHANNEL as CH, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "cleric.";
const WIS_USES = atLeastOne({ mod: "wis" });

export const CLERIC: Record<string, Mechanics> = {
  /* Conoscenza */
  [`${P}knowledge-domain.blessings-of-knowledge`]: {
    choices: [
      { id: "cleric.knowledge.languages", kind: "language", label: "Benedizioni della Conoscenza: lingue", count: 2 },
      { id: "cleric.knowledge.skills", kind: "skill", label: "Benedizioni della Conoscenza: abilità", count: 2, from: ["arcana", "history", "nature", "religion"] },
      { id: "cleric.knowledge.expertise", kind: "expertise", label: "Benedizioni della Conoscenza: maestria (le stesse due)", count: 2, from: ["arcana", "history", "nature", "religion"] },
    ],
  },
  [`${P}knowledge-domain.channel-divinity-knowledge-of-the-ages`]: { actions: [note("cleric.knowledge-of-the-ages", "Conoscenza dei Secoli", "action", "Per 10 minuti hai competenza in un'abilità o in uno strumento a scelta.", CH)] },
  [`${P}knowledge-domain.channel-divinity-read-thoughts`]: { actions: [note("cleric.read-thoughts", "Leggere i Pensieri", "action", "Una creatura entro 18 m: TS Saggezza o leggi i suoi pensieri superficiali per 1 minuto; puoi poi lanciarle suggestione senza slot.", CH)] },
  [`${P}knowledge-domain.visions-of-the-past`]: { actions: [note("cleric.visions-of-the-past", "Visioni del Passato", "action", "Dopo 1 minuto di meditazione: visioni sul passato di un oggetto o del luogo in cui ti trovi.")] },

  /* Vita */

  /* Luce */
  [`${P}light-domain.corona-of-light`]: { actions: [note("cleric.corona-of-light", "Corona di Luce", "action", "Per 1 minuto emani luce intensa per 18 m: i nemici in quella luce hanno svantaggio ai tiri salvezza contro incantesimi di fuoco o radiosi.")] },

  /* Natura */
  [`${P}nature-domain.acolyte-of-nature`]: {
    choices: [
      { id: "cleric.nature.cantrip", kind: "spell", label: "Accolito della Natura: trucchetto da druido", count: 1, spell: { list: "druid", level: 0, ability: "wis" } },
      { id: "cleric.nature.skill", kind: "skill", label: "Accolito della Natura: abilità", count: 1, from: ["animal-handling", "nature", "survival"] },
    ],
  },
  [`${P}nature-domain.bonus-proficiency`]: { effects: [{ type: "grant", target: "armor", values: ["heavy"] }] },
  [`${P}nature-domain.channel-divinity-charm-animals-and-plants`]: { actions: [note("cleric.charm-animals-and-plants", "Affascinare Animali e Piante", "action", "Bestie e creature vegetali entro 9 m: TS Saggezza o affascinate per 1 minuto.", CH)] },
  [`${P}nature-domain.dampen-elements`]: { actions: [note("cleric.dampen-elements", "Smorzare gli Elementi", "reaction", "Tu o una creatura entro 9 m ottenete resistenza a un attacco di acido, freddo, fuoco, fulmine o tuono.")] },
  [`${P}nature-domain.master-of-nature`]: { actions: [note("cleric.master-of-nature", "Padrone della Natura", "bonus", "Comandi le creature affascinate da Affascinare Animali e Piante.")] },

  /* Tempesta */
  [`${P}tempest-domain.bonus-proficiencies`]: { effects: [{ type: "grant", target: "armor", values: ["heavy"] }, { type: "grant", target: "weapon", values: ["martial"] }] },
  [`${P}tempest-domain.wrath-of-the-storm`]: {
    resources: [uses("cleric.wrath-of-the-storm", "Ira della Tempesta", WIS_USES)],
    actions: [rollAction("cleric.wrath-of-the-storm", "Ira della Tempesta", "reaction", "2d8", "Chi ti colpisce entro 1,5 m: danni da fulmine o tuono, TS Destrezza per dimezzarli.", { resource: "cleric.wrath-of-the-storm" })],
  },
  [`${P}tempest-domain.channel-divinity-destructive-wrath`]: { actions: [note("cleric.destructive-wrath", "Ira Distruttiva", "free", "Quando tiri danni da fulmine o tuono, li massimizzi invece di tirarli.", CH)] },
  [`${P}tempest-domain.thunderbolt-strike`]: { actions: [note("cleric.thunderbolt-strike", "Colpo di Tuono", "free", "Quando infliggi danni da fulmine a una creatura Grande o più piccola, puoi spingerla di 3 m.")] },
  [`${P}tempest-domain.stormborn`]: { effects: [{ type: "speed", mode: "fly", value: "walk" }] },

  /* Inganno */
  [`${P}trickery-domain.blessing-of-the-trickster`]: { actions: [note("cleric.blessing-of-the-trickster", "Benedizione dell'Ingannatore", "action", "Una creatura consenziente che tocchi ha vantaggio alle prove di Furtività per 1 ora.")] },
  [`${P}trickery-domain.channel-divinity-invoke-duplicity`]: { actions: [note("cleric.invoke-duplicity", "Invocare la Duplicità", "action", "Un'illusione di te per 1 minuto (concentrazione): puoi lanciare incantesimi dal suo spazio e hai vantaggio contro chi le sta vicino.", CH)] },
  [`${P}trickery-domain.channel-divinity-cloak-of-shadows`]: { actions: [note("cleric.cloak-of-shadows", "Manto d'Ombra", "action", "Diventi invisibile fino alla fine del tuo prossimo turno, o finché non attacchi o lanci un incantesimo.", CH)] },

  /* Guerra */
  [`${P}war-domain.channel-divinity-war-gods-blessing`]: { actions: [note("cleric.war-gods-blessing", "Benedizione del Dio della Guerra", "reaction", "+10 al tiro per colpire di una creatura entro 9 m, dopo aver visto il tiro.", CH)] },

  /* Morte */
  [`${P}death-domain.bonus-proficiency`]: { effects: [{ type: "grant", target: "weapon", values: ["martial"] }] },
  [`${P}death-domain.channel-divinity-touch-of-death`]: { actions: [note("cleric.touch-of-death", "Tocco della Morte", "free", "Quando colpisci in mischia: danni necrotici extra pari a 5 + il doppio del livello da chierico.", CH)] },

  /* Forgia */
  [`${P}forge-domain.bonus-proficiency`]: { effects: [{ type: "grant", target: "armor", values: ["heavy"] }, { type: "grant", target: "tool", values: ["smiths-tools"] }] },
  [`${P}forge-domain.blessing-of-the-forge`]: {
    resources: [uses("cleric.blessing-of-the-forge", "Benedizione della Forgia", 1)],
    actions: [note("cleric.blessing-of-the-forge", "Benedizione della Forgia", "special", "Alla fine di un riposo lungo: un'armatura o un'arma diventa magica (+1) fino al prossimo riposo lungo.", "cleric.blessing-of-the-forge")],
  },
  [`${P}forge-domain.channel-divinity-artisans-blessing`]: { actions: [note("cleric.artisans-blessing", "Benedizione dell'Artigiano", "special", "Rituale di 1 ora: crei un oggetto non magico di metallo del valore massimo di 100 mo.", CH)] },
  [`${P}forge-domain.soul-of-the-forge`]: {
    effects: [
      { type: "grant", target: "resistance", values: ["fire"] },
      { type: "bonus", target: "ac", value: 1, when: { armor: "heavy" }, label: "Anima della Forgia" },
    ],
  },
  [`${P}forge-domain.saint-of-forge-and-fire`]: { effects: [{ type: "grant", target: "immunity", values: ["fire"] }] },

  /* Tomba */
  [`${P}grave-domain.eyes-of-the-grave`]: {
    resources: [uses("cleric.eyes-of-the-grave", "Occhi della Tomba", WIS_USES)],
    actions: [note("cleric.eyes-of-the-grave", "Occhi della Tomba", "action", "Fino alla fine del tuo prossimo turno percepisci i non morti entro 18 m.", "cleric.eyes-of-the-grave")],
  },
  [`${P}grave-domain.channel-divinity-path-to-the-grave`]: { actions: [note("cleric.path-to-the-grave", "Sentiero verso la Tomba", "action", "Una creatura entro 9 m è vulnerabile a tutti i danni del prossimo attacco che la colpisce.", CH)] },
  [`${P}grave-domain.sentinel-at-deaths-door`]: {
    resources: [uses("cleric.sentinel-at-deaths-door", "Sentinella alle Porte della Morte", WIS_USES)],
    actions: [note("cleric.sentinel-at-deaths-door", "Sentinella alle Porte della Morte", "reaction", "Un colpo critico contro te o una creatura entro 9 m diventa un colpo normale.", "cleric.sentinel-at-deaths-door")],
  },
  [`${P}grave-domain.keeper-of-souls`]: { actions: [note("cleric.keeper-of-souls", "Custode delle Anime", "free", "Una volta per round, quando un nemico muore entro 18 m: tu o un alleato recuperate PF pari ai Dadi Vita del nemico.")] },

  /* Arcano */
  [`${P}arcana-domain.arcane-initiate`]: { choices: [{ id: "cleric.arcane-initiate", kind: "spell", label: "Iniziato Arcano: trucchetti da mago", count: 2, spell: { list: "wizard", level: 0, ability: "wis" } }] },
  [`${P}arcana-domain.channel-divinity-arcane-abjuration`]: { actions: [note("cleric.arcane-abjuration", "Abiurazione Arcana", "action", "Un celestiale, elementale, folletto o immondo entro 9 m: TS Saggezza o scacciato per 1 minuto (bandito se di GS basso).", CH)] },
  [`${P}arcana-domain.spell-breaker`]: { actions: [note("cleric.spell-breaker", "Spezzaincantesimi", "special", "Quando curi un alleato con un incantesimo, puoi terminare su di lui un incantesimo di livello non superiore a quello usato.")] },
  [`${P}arcana-domain.arcane-mastery`]: {
    choices: [6, 7, 8, 9].map((level) => ({ id: `cleric.arcane-mastery.${level}`, kind: "spell" as const, label: `Maestria Arcana: incantesimo da mago di ${level}°`, count: 1, spell: { list: "wizard", level, ability: "wis" as const } })),
  },

  /* Ordine */
  [`${P}order-domain.bonus-proficiencies`]: {
    effects: [{ type: "grant", target: "armor", values: ["heavy"] }],
    choices: [{ id: "cleric.order.skill", kind: "skill", label: "Dominio dell'Ordine: abilità", count: 1, from: ["intimidation", "persuasion"] }],
  },
  [`${P}order-domain.voice-of-authority`]: { actions: [note("cleric.voice-of-authority", "Voce dell'Autorità", "special", "Quando lanci un incantesimo di 1° livello o superiore su un alleato: può fare subito un attacco con un'arma con la reazione.")] },
  [`${P}order-domain.channel-divinity-orders-demand`]: { actions: [note("cleric.orders-demand", "Pretesa dell'Ordine", "action", "Creature a scelta entro 9 m: TS Saggezza o affascinate fino alla fine del tuo prossimo turno, e lasciano cadere ciò che tengono.", CH)] },
  [`${P}order-domain.embodiment-of-the-law`]: {
    resources: [uses("cleric.embodiment-of-the-law", "Incarnazione della Legge", WIS_USES)],
    actions: [note("cleric.embodiment-of-the-law", "Incarnazione della Legge", "special", "Un incantesimo di ammaliamento di 1° livello o superiore con tempo di lancio di 1 azione si lancia come azione bonus.", "cleric.embodiment-of-the-law")],
  },
  [`${P}order-domain.orders-wrath`]: { dice: [{ id: "cleric.orders-wrath", name: "Ira dell'Ordine", dice: "2d8", damageType: "psychic", note: "Al bersaglio colpito dal Colpo Divino: il prossimo alleato che lo colpisce aggiunge questi danni" }] },

  /* Pace */
  [`${P}peace-domain.implement-of-peace`]: { choices: [{ id: "cleric.peace.skill", kind: "skill", label: "Strumento di Pace", count: 1, from: ["insight", "performance", "persuasion"] }] },
  [`${P}peace-domain.emboldening-bond`]: {
    dice: [{ id: "cleric.emboldening-bond", name: "Legame Incoraggiante", dice: "1d4", note: "Una volta per turno, chi è legato lo aggiunge a un tiro per colpire, una prova o un tiro salvezza, se è entro 9 m da un altro legato" }],
    actions: [note("cleric.emboldening-bond", "Legame Incoraggiante", "action", "Leghi fino a tante creature quanto il bonus di competenza, entro 9 m, per 10 minuti.", "cleric.emboldening-bond")],
  },
  [`${P}peace-domain.channel-divinity-balm-of-peace`]: {
    actions: [rollAction("cleric.balm-of-peace", "Balsamo della Pace", "action", "2d6", "Ti muovi senza provocare attacchi di opportunità; ogni creatura che scegli entro 1,5 m lungo il percorso recupera questi PF + Saggezza.", { resource: CH, plus: { mod: "wis" } })],
  },
  [`${P}peace-domain.protective-bond`]: { actions: [note("cleric.protective-bond", "Legame Protettivo", "reaction", "Quando un legato sta per subire danni, un altro legato entro 9 m si teletrasporta vicino a lui e subisce i danni al suo posto.")] },

  /* Crepuscolo */
  [`${P}twilight-domain.bonus-proficiencies`]: { effects: [{ type: "grant", target: "armor", values: ["heavy"] }, { type: "grant", target: "weapon", values: ["martial"] }] },
  [`${P}twilight-domain.eyes-of-night`]: {
    effects: [{ type: "sense", sense: "darkvision", range: 300 }],
    actions: [note("cleric.eyes-of-night", "Occhi della Notte: condividere", "action", "Condividi la scurovisione con creature consenzienti entro 3 m per 1 ora (una volta per riposo lungo, o con uno slot).")],
  },
  [`${P}twilight-domain.vigilant-blessing`]: { actions: [note("cleric.vigilant-blessing", "Benedizione Vigile", "action", "Una creatura che tocchi ha vantaggio alla prossima prova di iniziativa.")] },
  [`${P}twilight-domain.channel-divinity-twilight-sanctuary`]: {
    actions: [rollAction("cleric.twilight-sanctuary", "Santuario Crepuscolare", "action", "1d6", "Sfera di 9 m per 1 minuto. A fine turno, una creatura nella sfera ottiene PF temporanei pari al dado + il livello da chierico, oppure si libera da affascinato o spaventato.", { resource: CH, plus: { level: "cleric" } })],
  },
  [`${P}twilight-domain.steps-of-night`]: { actions: [note("cleric.steps-of-night", "Passi della Notte", "bonus", "In luce fioca o oscurità: velocità di volare pari a quella di camminare per 1 minuto.", "cleric.steps-of-night")] },
};

