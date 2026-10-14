/** Patroni del Warlock. Le liste ampliate restano incantesimi da scegliere, non concessi. */
import { ALL_DAMAGE, at, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "warlock.";
const CURSE = "hexblades-curse";
const DREAD = "form-of-dread";

export const WARLOCK: Record<string, Mechanics> = {
  /* Signore Fatato */
  [`${P}the-archfey.fey-presence`]: { actions: [note("warlock.fey-presence", "Presenza Fatata", "action", "Cubo di 3 m da te: TS Saggezza o affascinate o spaventate fino alla fine del tuo prossimo turno.", "warlock.fey-presence")] },
  [`${P}the-archfey.misty-escape`]: { actions: [note("warlock.misty-escape", "Fuga Nebbiosa", "reaction", "Quando subisci danni: diventi invisibile e ti teletrasporti fino a 18 m, fino all'inizio del tuo prossimo turno.", "warlock.misty-escape")] },
  [`${P}the-archfey.beguiling-defenses`]: {
    effects: [{ type: "grant", target: "conditionImmunity", values: ["charmed"] }],
    actions: [note("warlock.beguiling-defenses", "Difese Ammalianti", "reaction", "Chi prova ad affascinarti: TS Saggezza o è affascinato da te per 1 minuto.")],
  },
  [`${P}the-archfey.dark-delirium`]: { actions: [note("warlock.dark-delirium", "Delirio Oscuro", "action", "Una creatura entro 18 m: TS Saggezza o affascinata o spaventata in un regno illusorio per 1 minuto (concentrazione).", "warlock.dark-delirium")] },

  /* Immondo */
  [`${P}the-fiend.fiendish-resilience`]: {
    choices: [{ id: "warlock.fiendish-resilience", kind: "custom", label: "Resilienza Immonda: tipo di danno (cambia dopo ogni riposo)", count: 1, from: ALL_DAMAGE }],
  },

  /* Grande Antico */
  [`${P}the-great-old-one.awakened-mind`]: { actions: [note("warlock.awakened-mind", "Mente Risvegliata", "special", "Parli telepaticamente con una creatura entro 9 m che conosca almeno una lingua.")] },
  [`${P}the-great-old-one.entropic-ward`]: { actions: [note("warlock.entropic-ward", "Protezione Entropica", "reaction", "Svantaggio all'attacco contro di te; se manca, vantaggio al tuo prossimo attacco contro l'attaccante.", "warlock.entropic-ward")] },
  [`${P}the-great-old-one.thought-shield`]: { effects: [{ type: "grant", target: "resistance", values: ["psychic"] }] },
  [`${P}the-great-old-one.create-thrall`]: { actions: [note("warlock.create-thrall", "Creare un Servitore", "action", "Un umanoide incapacitato che tocchi resta affascinato da te finché non ne crei un altro; comunicate telepaticamente.")] },

  /* Celestiale */
  [`${P}the-celestial.bonus-cantrips`]: { spells: [{ spellId: "light" }, { spellId: "sacred-flame" }] },
  [`${P}the-celestial.healing-light`]: {
    resources: [uses("warlock.healing-light", "Luce Curativa (d6)", { sum: [1, { level: "warlock" }] })],
    dice: [{ id: "warlock.healing-light", name: "Luce Curativa", dice: "1d6", note: "Per ogni dado speso" }],
    actions: [{ id: "warlock.healing-light", name: "Luce Curativa", timing: "bonus", cost: { resource: "warlock.healing-light", amount: 1, variable: true }, outcome: { kind: "note" }, description: "Una creatura entro 18 m recupera 1d6 per dado speso (al massimo tanti dadi quanto il Carisma)." }],
  },
  [`${P}the-celestial.radiant-soul`]: {
    effects: [{ type: "grant", target: "resistance", values: ["radiant"] }],
    actions: [note("warlock.radiant-soul", "Anima Radiosa", "free", "Una volta per incantesimo, ai danni radiosi o da fuoco aggiungi il Carisma su un bersaglio.")],
  },
  [`${P}the-celestial.celestial-resilience`]: { actions: [note("warlock.celestial-resilience", "Resilienza Celestiale", "special", "Dopo un riposo: PF temporanei pari a livello da warlock + Carisma per te, e metà a fino a cinque alleati.")] },
  [`${P}the-celestial.searing-vengeance`]: { actions: [note("warlock.searing-vengeance", "Vendetta Ardente", "special", "Al tiro contro la morte: ti rialzi con metà dei PF, i nemici entro 9 m subiscono 2d8 + Carisma radiosi e sono accecati.", "warlock.searing-vengeance")] },

  /* Lama del Sortilegio */
  [`${P}the-hexblade.hexblades-curse`]: {
    resources: [uses("warlock.hexblades-curse", "Maledizione della Lama del Sortilegio", 1, "short")],
    toggles: [{ id: CURSE, name: "Bersaglio maledetto" }],
    actions: [
      { id: "warlock.hexblades-curse", name: "Maledizione della Lama del Sortilegio", timing: "bonus", cost: { resource: "warlock.hexblades-curse", amount: 1 }, outcome: { kind: "toggleOn", toggle: CURSE }, when: { not: { toggle: CURSE } }, description: "Una creatura entro 9 m per 1 minuto: bonus ai danni pari alla competenza, critico con 19-20; alla sua morte recuperi livello da warlock + Carisma PF." },
      { id: "warlock.hexblades-curse.end", name: "Fine della maledizione", timing: "free", outcome: { kind: "toggleOff", toggle: CURSE }, when: { toggle: CURSE } },
    ],
    effects: [
      { type: "bonus", target: "damage.all", value: { prof: 1 }, when: { toggle: CURSE }, label: "Maledizione (solo contro il maledetto)" },
      { type: "critRange", value: 19, when: { toggle: CURSE } },
    ],
  },
  [`${P}the-hexblade.hex-warrior`]: {
    effects: [{ type: "grant", target: "armor", values: ["medium", "shield"] }, { type: "grant", target: "weapon", values: ["martial"] }],
    actions: [note("warlock.hex-warrior", "Guerriero del Sortilegio", "special", "Dopo un riposo lungo scegli un'arma senza la proprietà a due mani: con essa usi il Carisma per colpire e per i danni.")],
  },
  [`${P}the-hexblade.accursed-specter`]: { actions: [note("warlock.accursed-specter", "Spettro Maledetto", "special", "Quando uccidi un umanoide: si rialza come spettro al tuo servizio fino al tuo prossimo riposo lungo, con PF temporanei pari a metà del tuo livello.", "warlock.accursed-specter")] },
  [`${P}the-hexblade.armor-of-hexes`]: { actions: [rollAction("warlock.armor-of-hexes", "Armatura dei Sortilegi", "reaction", "1d6", "Il maledetto ti colpisce: con 4 o più l'attacco manca.", { when: { toggle: CURSE } })] },
  [`${P}the-hexblade.master-of-hexes`]: { actions: [note("warlock.master-of-hexes", "Maestro dei Sortilegi", "free", "Quando il maledetto muore: sposti la maledizione su un'altra creatura entro 9 m (senza recuperare PF).")] },

  /* Immortale */
  [`${P}the-undying.among-the-dead`]: { spells: [{ spellId: "spare-the-dying" }], effects: [{ type: "advantage", on: "save.vs.disease", label: "Tra i Morti" }] },
  [`${P}the-undying.defy-death`]: { actions: [rollAction("warlock.defy-death", "Sfidare la Morte", "free", "1d8", "Quando superi un tiro contro la morte o stabilizzi qualcuno con risparmiare i morenti: recuperi questi PF (più Costituzione).", { resource: "warlock.defy-death", plus: { max: [1, { mod: "con" }] }, outcome: { kind: "heal" } })] },
  [`${P}the-undying.indestructible-life`]: { actions: [rollAction("warlock.indestructible-life", "Vita Indistruttibile", "bonus", "1d8", "Recuperi PF (più il livello da warlock) e riattacchi una parte del corpo mozzata.", { resource: "warlock.indestructible-life", plus: { level: "warlock" }, outcome: { kind: "heal" } })] },

  /* Non Morto */
  [`${P}the-undead.form-of-dread`]: {
    toggles: [{ id: DREAD, name: "Forma del Terrore" }],
    actions: [
      { id: "warlock.form-of-dread", name: "Forma del Terrore", timing: "bonus", cost: { resource: "warlock.form-of-dread", amount: 1 }, outcome: { kind: "toggleOn", toggle: DREAD }, when: { not: { toggle: DREAD } }, description: "Per 1 minuto: immune a spaventato; una volta per turno chi colpisci fa TS Saggezza o è spaventato." },
      rollAction("warlock.form-of-dread.hp", "Forma del Terrore: PF temporanei", "free", "1d10", "PF temporanei all'inizio della trasformazione.", { plus: { level: "warlock" }, outcome: { kind: "tempHp" }, when: { toggle: DREAD } }),
      { id: "warlock.form-of-dread.end", name: "Fine della Forma del Terrore", timing: "free", outcome: { kind: "toggleOff", toggle: DREAD }, when: { toggle: DREAD } },
    ],
    effects: [{ type: "grant", target: "conditionImmunity", values: ["frightened"], when: { toggle: DREAD } }],
  },
  [`${P}the-undead.grave-touched`]: { actions: [note("warlock.grave-touched", "Toccato dalla Tomba", "free", "Una volta per turno, colpendo: i danni diventano necrotici; in Forma del Terrore tiri un dado di danno in più.")] },
  [`${P}the-undead.necrotic-husk`]: {
    effects: [{ type: "grant", target: "resistance", values: ["necrotic"] }],
    actions: [note("warlock.necrotic-husk", "Guscio Necrotico", "special", "Quando scendi a 0 PF: torni a 1 PF ed esplodi, creature entro 9 m subiscono 2d10 + livello da warlock necrotici. Poi 1 livello di indebolimento.")],
  },
  [`${P}the-undead.spirit-projection`]: { actions: [note("warlock.spirit-projection", "Proiezione Spirituale", "action", "Per 1 ora il tuo spirito lascia il corpo: resistenza a contundenti, perforanti e taglienti, incantesimi di evocazione e necromanzia senza componenti, volo.", "warlock.spirit-projection")] },

  /* Insondabile */
  [`${P}the-fathomless.tentacle-of-the-deeps`]: {
    actions: [
      note("warlock.tentacle-of-the-deeps", "Tentacolo degli Abissi", "bonus", "Evochi un tentacolo entro 18 m per 1 minuto.", "warlock.tentacle-of-the-deeps"),
      rollAction("warlock.tentacle.strike", "Colpo del tentacolo", "bonus", { count: at("warlock", { 1: 1, 10: 2 }), sides: 8 }, "Attacco in mischia con incantesimo a una creatura entro 3 m dal tentacolo: danni da freddo e velocità ridotta di 3 m."),
    ],
  },
  [`${P}the-fathomless.gift-of-the-sea`]: { effects: [{ type: "speed", mode: "swim", value: 40 }] },
  [`${P}the-fathomless.oceanic-soul-soul`]: { effects: [{ type: "grant", target: "resistance", values: ["cold"] }] },
  [`${P}the-fathomless.guardian-coil`]: { actions: [rollAction("warlock.guardian-coil", "Spira Protettiva", "reaction", { count: at("warlock", { 6: 1, 10: 2 }), sides: 8 }, "Una creatura entro 3 m dal tentacolo subisce danni: li riduci di questo valore.")] },
  [`${P}the-fathomless.grasping-tentacles`]: { spells: [{ spellId: "evards-black-tentacles", resource: "warlock.grasping-tentacles" }] },
  [`${P}the-fathomless.fathomless-plunge`]: { actions: [note("warlock.fathomless-plunge", "Tuffo nell'Insondabile", "action", "Tu e fino a cinque creature entro 9 m vi teletrasportate fino a 1,5 km verso un corpo d'acqua che conosci.", "warlock.fathomless-plunge")] },

  /* Genio */
  [`${P}the-genie.genies-vessel`]: {
    choices: [{ id: "warlock.genie-kind", kind: "custom", label: "Tipo di genio", count: 1, from: ["Dao (contundenti)", "Djinni (tuono)", "Efreeti (fuoco)", "Marid (freddo)"] }],
    actions: [
      note("warlock.bottled-respite", "Rifugio nella Bottiglia", "action", "Entri nel recipiente per fino al doppio del bonus di competenza in ore.", "warlock.bottled-respite"),
      note("warlock.genies-wrath", "Ira del Genio", "free", "Una volta per turno, quando colpisci: danni extra pari al bonus di competenza, del tipo del tuo genio."),
    ],
  },
  [`${P}the-genie.elemental-gift`]: { actions: [note("warlock.elemental-gift", "Dono Elementale", "bonus", "Velocità di volare 9 m per 10 minuti. Hai anche resistenza al tipo di danno del tuo genio.", "warlock.elemental-gift")] },
  [`${P}the-genie.sanctuary-vessel`]: { actions: [note("warlock.sanctuary-vessel", "Recipiente Santuario", "special", "Entrando nel recipiente porti fino a cinque creature; un riposo breve dentro dura 10 minuti e cura di più.")] },
  [`${P}the-genie.limited-wish`]: {
    resources: [uses("warlock.limited-wish", "Desiderio Limitato", 1)],
    actions: [note("warlock.limited-wish", "Desiderio Limitato", "action", "Ottieni l'effetto di un incantesimo di 6° livello o inferiore con tempo di lancio di 1 azione. Si recupera dopo 1d4 riposi lunghi.", "warlock.limited-wish")],
  },
};
