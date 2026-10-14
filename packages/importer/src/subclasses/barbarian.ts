/** Sottoclassi del Barbaro: ciò che la scheda può calcolare o far usare. */
import { at, note, RAGING, rollAction, type Mechanics } from "./helpers.ts";

const P = "barbarian.";
const TOTEMS = ["bear", "eagle", "elk", "tiger", "wolf"];

export const BARBARIAN: Record<string, Mechanics> = {
  /* Berserker */
  [`${P}path-of-the-berserker.intimidating-presence`]: {
    actions: [note("barbarian.intimidating-presence", "Presenza Intimidatoria", "action", "Una creatura entro 9 m che ti vede o ti sente: tiro salvezza su Saggezza (CD 8 + competenza + Carisma) o spaventata fino alla fine del tuo prossimo turno. Nei turni dopo puoi prolungarlo con un'azione.")],
  },

  /* Combattente Totemico: gli animali sono importati tra i privilegi facoltativi, qui si scelgono dal privilegio giusto */
  [`${P}path-of-the-totem-warrior.totem-spirit`]: { choices: [{ id: "barbarian.totem-spirit", kind: "feat", label: "Spirito Totemico", count: 1, from: TOTEMS.map((t) => `barbarian.optional.totem-spirit-${t}`) }] },
  [`${P}path-of-the-totem-warrior.aspect-of-the-beast`]: { choices: [{ id: "barbarian.aspect-of-the-beast", kind: "feat", label: "Aspetto della Bestia", count: 1, from: TOTEMS.map((t) => `barbarian.optional.aspect-of-the-beast-${t}`) }] },
  [`${P}path-of-the-totem-warrior.totemic-attunement`]: { choices: [{ id: "barbarian.totemic-attunement", kind: "feat", label: "Sintonia Totemica", count: 1, from: TOTEMS.map((t) => `barbarian.optional.totemic-attunement-${t}`) }] },
  "barbarian.optional.totem-spirit-eagle": { actions: [note("barbarian.totem-eagle", "Spirito dell'Aquila", "bonus", "In ira, senza armatura pesante: Scatto come azione bonus; gli attacchi di opportunità contro di te hanno svantaggio.", undefined)] },
  "barbarian.optional.totem-spirit-wolf": { actions: [note("barbarian.totem-wolf", "Spirito del Lupo", "special", "In ira, i tuoi alleati hanno vantaggio in mischia contro i nemici entro 1,5 m da te.")] },
  "barbarian.optional.totem-spirit-tiger": { actions: [note("barbarian.totem-tiger", "Spirito della Tigre", "special", "In ira, +3 m al salto in lungo e +1 m al salto in alto.")] },
  "barbarian.optional.aspect-of-the-beast-bear": { effects: [{ type: "advantage", on: "check.str", label: "Aspetto dell'Orso (spingere, tirare, sollevare)" }] },
  "barbarian.optional.aspect-of-the-beast-tiger": { choices: [{ id: "barbarian.aspect-tiger.skills", kind: "skill", label: "Aspetto della Tigre", count: 2, from: ["athletics", "acrobatics", "stealth", "survival"] }] },
  "barbarian.optional.totemic-attunement-eagle": { effects: [{ type: "speed", mode: "fly", value: "walk", when: RAGING }] },
  "barbarian.optional.totemic-attunement-bear": { actions: [note("barbarian.attunement-bear", "Sintonia dell'Orso", "special", "In ira, i nemici entro 1,5 m hanno svantaggio ad attaccare altri che non siano te.")] },
  "barbarian.optional.totemic-attunement-elk": { actions: [rollAction("barbarian.attunement-elk", "Sintonia dell'Alce", "bonus", "1d12", "In ira, attraversando lo spazio di una creatura Grande o più piccola: TS Forza o prona e subisce questi danni contundenti (più Forza).", { plus: { mod: "str" }, when: RAGING })] },
  "barbarian.optional.totemic-attunement-tiger": { actions: [note("barbarian.attunement-tiger", "Sintonia della Tigre", "bonus", "In ira, dopo 6 m in linea retta verso un bersaglio: un attacco in mischia in più.")] },
  "barbarian.optional.totemic-attunement-wolf": { actions: [note("barbarian.attunement-wolf", "Sintonia del Lupo", "bonus", "In ira, quando colpisci una creatura Grande o più piccola: la fai cadere prona.")] },
  [`${P}path-of-the-totem-warrior.spirit-seeker`]: { actions: [note("barbarian.spirit-seeker", "Cercatore di Spiriti", "special", "Lanci bestia empatica e parlare con gli animali, solo come rituali.")] },
  [`${P}path-of-the-totem-warrior.spirit-walker`]: { actions: [note("barbarian.spirit-walker", "Camminatore degli Spiriti", "special", "Lanci comunione con la natura, solo come rituale.")] },
  [`${P}path-of-the-totem-warrior.variant-spirit-seeker-tree-ghost-tribe`]: { actions: [note("barbarian.tree-ghost", "Cercatore di Spiriti (Spettri degli Alberi)", "special", "Lanci parlare con le piante, solo come rituale.")] },

  /* Guardiano Ancestrale */
  [`${P}path-of-the-ancestral-guardian.spirit-shield`]: {
    actions: [rollAction("barbarian.spirit-shield", "Scudo Spirituale", "reaction", { count: at("barbarian", { 6: 2, 10: 3, 14: 4 }), sides: 6 }, "In ira: riduci di questo valore i danni che una creatura entro 9 m che puoi vedere sta per subire.", { when: RAGING })],
  },
  [`${P}path-of-the-ancestral-guardian.consult-the-spirits`]: { actions: [note("barbarian.consult-spirits", "Consultare gli Spiriti", "action", "Lanci chiaroveggenza o divinazione senza slot.", "barbarian.consult-spirits")] },

  /* Araldo della Tempesta */
  [`${P}path-of-the-storm-herald.storm-aura`]: {
    choices: [{ id: "barbarian.storm-aura", kind: "custom", label: "Ambiente della tempesta", count: 1, from: ["Deserto", "Mare", "Tundra"] }],
    dice: [{ id: "barbarian.storm-aura.sea", name: "Aura del Mare (fulmine)", dice: { count: at("barbarian", { 3: 1, 10: 2, 15: 3, 20: 4 }), sides: 6 }, damageType: "lightning", note: "Tiro salvezza su Destrezza per dimezzare" }],
    actions: [note("barbarian.storm-aura", "Aura della Tempesta", "bonus", "In ira, aura di 3 m. Deserto: danni da fuoco a ogni altra creatura (2, poi 3 al 5°, 4 al 10°, 5 al 15°, 6 al 20°). Mare: una creatura subisce danni da fulmine. Tundra: PF temporanei a ogni creatura che scegli (gli stessi valori del deserto).", undefined)],
  },
  [`${P}path-of-the-storm-herald.raging-storm`]: { actions: [note("barbarian.raging-storm", "Tempesta Furiosa", "reaction", "Deserto: chi ti colpisce subisce fuoco pari a metà del livello. Mare: chi colpisci, TS Forza o prono. Tundra: una creatura nell'aura, TS Forza o velocità 0.")] },

  /* Zelota */
  [`${P}path-of-the-zealot.divine-fury`]: { dice: [{ id: "barbarian.divine-fury", name: "Furia Divina", dice: "1d6", note: "Al primo colpo di ogni turno in ira, più metà del livello da barbaro; radiosi o necrotici" }] },
  [`${P}path-of-the-zealot.fanatical-focus`]: { actions: [note("barbarian.fanatical-focus", "Concentrazione Fanatica", "free", "In ira, una volta per ira: ritiri un tiro salvezza fallito.")] },
  [`${P}path-of-the-zealot.zealous-presence`]: { actions: [note("barbarian.zealous-presence", "Presenza Zelante", "bonus", "Fino a 10 creature entro 18 m: vantaggio a tiri per colpire e tiri salvezza fino all'inizio del tuo prossimo turno.", "barbarian.zealous-presence")] },

  /* Furioso da Battaglia */
  [`${P}path-of-the-battlerager.battlerager-armor`]: {
    actions: [rollAction("barbarian.battlerager-armor", "Attacco con le punte", "bonus", "1d4", "Con l'armatura chiodata, in ira: attacco con le punte (aggiungi Forza, danni perforanti). In lotta, all'afferrare: 3 danni perforanti.", { when: RAGING })],
  },
  [`${P}path-of-the-battlerager.reckless-abandon`]: { actions: [note("barbarian.reckless-abandon", "Abbandono Sconsiderato", "free", "Con Attacco Irruento in ira: PF temporanei pari al modificatore di Costituzione (minimo 1).")] },
  [`${P}path-of-the-battlerager.battlerager-charge`]: { actions: [note("barbarian.battlerager-charge", "Carica del Furioso", "bonus", "In ira: Scatto come azione bonus.")] },

  /* Gigante */
  [`${P}path-of-the-giant.giant-power`]: {
    effects: [{ type: "grant", target: "language", values: ["giant"] }],
    choices: [{ id: "barbarian.giant-power.cantrip", kind: "spell", label: "Trucchetto del Gigante", count: 1, from: ["druidcraft", "thaumaturgy"], spell: { ability: "wis" } }],
  },
  [`${P}path-of-the-giant.elemental-cleaver`]: {
    dice: [{ id: "barbarian.elemental-cleaver", name: "Mannaia Elementale", dice: { count: at("barbarian", { 6: 1, 14: 2 }), sides: 6 }, note: "Danni extra (acido, freddo, fuoco, fulmine o tuono) con l'arma infusa in ira" }],
    actions: [note("barbarian.elemental-cleaver", "Mannaia Elementale", "bonus", "Entrando in ira infondi un'arma: diventa da lancio (6/18 m), torna in mano e fa danni extra del tipo scelto.", undefined)],
  },
  [`${P}path-of-the-giant.mighty-impel`]: { actions: [note("barbarian.mighty-impel", "Spinta Possente", "bonus", "In ira: sposti una creatura Media o più piccola entro portata in uno spazio libero entro 9 m (TS Forza se non consenziente).")] },

  /* Bestia */
  [`${P}path-of-the-beast.form-of-the-beast`]: {
    actions: [note("barbarian.form-of-the-beast", "Forma della Bestia", "special", "Entrando in ira: morso (1d8, una volta per turno recuperi PF pari al bonus di competenza se sei sotto metà), artigli (1d6, un attacco extra) o coda (1d8, portata 3 m; reazione: +1d8 alla CA).")],
    dice: [{ id: "barbarian.beast-tail", name: "Coda: bonus alla CA", dice: "1d8", note: "Reazione, quando vieni colpito" }],
  },
  [`${P}path-of-the-beast.infectious-fury`]: {
    actions: [rollAction("barbarian.infectious-fury", "Furia Contagiosa", "free", "2d12", "Quando colpisci con le armi naturali: TS Saggezza o il bersaglio attacca un'altra creatura con la reazione, oppure subisce questi danni psichici.", { resource: "barbarian.infectious-fury" })],
  },
  [`${P}path-of-the-beast.call-the-hunt`]: { actions: [note("barbarian.call-the-hunt", "Richiamo della Caccia", "special", "Entrando in ira: fino a tanti alleati quanto il modificatore di Costituzione ottengono 1d6 danni una volta per turno; tu ottieni 5 PF temporanei per ognuno.", "barbarian.call-the-hunt")] },

  /* Magia Selvaggia */
  [`${P}path-of-wild-magic.magical-awareness`]: { actions: [note("barbarian.magical-awareness", "Consapevolezza Magica", "action", "Fino alla fine del tuo prossimo turno percepisci incantesimi e oggetti magici entro 18 m.", "barbarian.magical-awareness")] },
  [`${P}path-of-wild-magic.wild-surge`]: { actions: [rollAction("barbarian.wild-surge", "Impeto Selvaggio", "special", "1d8", "Entrando in ira: tira sulla tabella della Magia Selvaggia del barbaro.")] },
  [`${P}path-of-wild-magic.bolstering-magic`]: {
    actions: [
      rollAction("barbarian.bolstering-magic", "Magia Rinforzante: bonus", "action", "1d3", "Una creatura che tocchi aggiunge il dado ai tiri per colpire e alle prove per 10 minuti.", { resource: "barbarian.bolstering-magic" }),
      rollAction("barbarian.bolstering-magic.slot", "Magia Rinforzante: slot", "action", "1d3", "Una creatura che tocchi recupera uno slot di questo livello o inferiore.", { resource: "barbarian.bolstering-magic" }),
    ],
  },
  [`${P}path-of-wild-magic.unstable-backlash`]: { actions: [rollAction("barbarian.unstable-backlash", "Contraccolpo Instabile", "reaction", "1d8", "In ira, quando subisci danni o fallisci un tiro salvezza: nuovo effetto dalla tabella della Magia Selvaggia.", { when: RAGING })] },
};
