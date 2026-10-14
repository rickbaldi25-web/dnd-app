/** Archetipi del Guerriero. */
import { at, atLeastOne, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "fighter.";
const PSI = "fighter.psionic-energy";
const PSI_DIE = { sides: at("fighter", { 3: 6, 5: 8, 11: 10, 17: 12 }) };
const GIANT = "giants-might";

export const FIGHTER: Record<string, Mechanics> = {
  /* Maestro di Battaglia */
  [`${P}battle-master.student-of-war`]: { choices: [{ id: "fighter.student-of-war", kind: "tool", label: "Studente di Guerra: strumenti da artigiano", count: 1 }] },
  [`${P}battle-master.know-your-enemy`]: { actions: [note("fighter.know-your-enemy", "Conosci il Nemico", "special", "Dopo 1 minuto di osservazione: scopri se una creatura ti è pari, superiore o inferiore in due caratteristiche a scelta.")] },

  /* Campione */
  [`${P}champion.additional-fighting-style`]: { choices: [{ id: "fighter.champion.fighting-style", kind: "feat", label: "Stile di Combattimento aggiuntivo", count: 1, from: { tag: "opt:fighter.fighting-style" } }] },

  /* Cavaliere Mistico */
  [`${P}eldritch-knight.weapon-bond`]: { actions: [note("fighter.weapon-bond", "Legame con l'Arma", "bonus", "Richiami in mano un'arma legata, se è sullo stesso piano.")] },
  [`${P}eldritch-knight.war-magic`]: { actions: [note("fighter.war-magic", "Magia da Guerra", "bonus", "Dopo aver lanciato un trucchetto con l'azione: un attacco con un'arma. Dal 18°, anche dopo un incantesimo.")] },
  [`${P}eldritch-knight.eldritch-strike`]: { actions: [note("fighter.eldritch-strike", "Colpo Mistico", "free", "Quando colpisci con un'arma, il bersaglio ha svantaggio al prossimo tiro salvezza contro un tuo incantesimo prima della fine del tuo prossimo turno.")] },
  [`${P}eldritch-knight.arcane-charge`]: { actions: [note("fighter.arcane-charge", "Carica Arcana", "free", "Quando usi Azione Impetuosa: ti teletrasporti fino a 9 m.")] },

  /* Arciere Arcano */
  [`${P}arcane-archer.arcane-archers-lore`]: {
    choices: [
      { id: "fighter.arcane-archer.skill", kind: "skill", label: "Sapere dell'Arciere Arcano", count: 1, from: ["arcana", "nature"] },
      { id: "fighter.arcane-archer.cantrip", kind: "spell", label: "Sapere dell'Arciere Arcano: trucchetto", count: 1, from: ["prestidigitation", "druidcraft"], spell: { ability: "int" } },
    ],
  },
  [`${P}arcane-archer.arcane-shot`]: {
    resources: [uses("fighter.arcane-shot", "Tiro Arcano", 2, "short")],
    actions: [note("fighter.arcane-shot", "Tiro Arcano", "free", "Quando colpisci con una freccia: applichi una delle tue opzioni di Tiro Arcano (una volta per turno).", "fighter.arcane-shot")],
  },
  [`${P}arcane-archer.curving-shot`]: { actions: [note("fighter.curving-shot", "Tiro Curvo", "bonus", "Dopo un attacco mancato con una freccia magica: ritiri contro un altro bersaglio entro 18 m dal primo.")] },

  /* Cavaliere */
  [`${P}cavalier.bonus-proficiency`]: { choices: [{ id: "fighter.cavalier.skill", kind: "skill", label: "Competenza Bonus", count: 1, from: ["animal-handling", "history", "insight", "performance", "persuasion"] }] },
  [`${P}cavalier.unwavering-mark`]: {
    resources: [uses("fighter.unwavering-mark", "Marchio Incrollabile", atLeastOne({ mod: "str" }))],
    actions: [
      note("fighter.unwavering-mark", "Marchio Incrollabile", "free", "Chi colpisci in mischia è marchiato fino alla fine del tuo prossimo turno: svantaggio ad attaccare altri vicino a te."),
      note("fighter.unwavering-mark.strike", "Colpo del Marchio", "bonus", "Il marchiato ha ferito un altro: un attacco con vantaggio e danni extra pari a metà del livello da guerriero.", "fighter.unwavering-mark"),
    ],
  },
  [`${P}cavalier.warding-maneuver`]: {
    resources: [uses("fighter.warding-maneuver", "Manovra Protettiva", atLeastOne({ mod: "con" }))],
    actions: [rollAction("fighter.warding-maneuver", "Manovra Protettiva", "reaction", "1d8", "Tu o una creatura entro 1,5 m sta per essere colpita: aggiungi il dado alla sua CA; se colpisce lo stesso, ha resistenza ai danni.", { resource: "fighter.warding-maneuver" })],
  },
  [`${P}cavalier.ferocious-charger`]: { actions: [note("fighter.ferocious-charger", "Caricatore Feroce", "free", "Dopo 3 m in linea retta, se colpisci: TS Forza o il bersaglio cade prono (una volta per turno).")] },

  /* Samurai */
  [`${P}samurai.bonus-proficiency`]: { choices: [{ id: "fighter.samurai.skill", kind: "skill", label: "Competenza Bonus", count: 1, from: ["history", "insight", "performance", "persuasion"] }] },
  [`${P}samurai.fighting-spirit`]: { actions: [note("fighter.fighting-spirit", "Spirito Combattivo", "bonus", "Vantaggio ai tiri per colpire con un'arma per questo turno e PF temporanei (5, poi 10 al 10°, 15 al 15°).", "fighter.fighting-spirit")] },
  [`${P}samurai.rapid-strike`]: { actions: [note("fighter.rapid-strike", "Colpo Rapido", "free", "Rinunci al vantaggio di un attacco per fare un attacco in più (una volta per turno).")] },
  [`${P}samurai.strength-before-death`]: {
    resources: [uses("fighter.strength-before-death", "Forza prima della Morte", 1)],
    actions: [note("fighter.strength-before-death", "Forza prima della Morte", "reaction", "Quando scendi a 0 PF: un turno extra subito, prima di cadere.", "fighter.strength-before-death")],
  },

  /* Cavaliere del Drago Purpureo */
  [`${P}purple-dragon-knight.rallying-cry`]: { actions: [note("fighter.rallying-cry", "Grido di Raccolta", "free", "Quando usi Recuperare Energie: fino a tre alleati entro 18 m recuperano PF pari al tuo livello da guerriero.")] },
  [`${P}purple-dragon-knight.inspiring-surge`]: { actions: [note("fighter.inspiring-surge", "Impeto Ispiratore", "free", "Con Azione Impetuosa: un alleato entro 18 m (due dal 18°) fa un attacco con la reazione.")] },
  [`${P}purple-dragon-knight.bulwark`]: { actions: [note("fighter.bulwark", "Baluardo", "free", "Con Indomito su un TS di Intelligenza, Saggezza o Carisma: anche un alleato entro 18 m ritira lo stesso tiro salvezza.")] },

  /* Cavaliere dell'Eco */
  [`${P}echo-knight.manifest-echo`]: { actions: [note("fighter.manifest-echo", "Manifestare l'Eco", "bonus", "Crei un'eco (CA 14 + competenza, 1 PF) entro 4,5 m: puoi attaccare dal suo spazio e scambiarti di posto con lei.")] },
  [`${P}echo-knight.unleash-incarnation`]: {
    resources: [uses("fighter.unleash-incarnation", "Liberare l'Incarnazione", atLeastOne({ mod: "con" }))],
    actions: [note("fighter.unleash-incarnation", "Liberare l'Incarnazione", "free", "Con l'azione di Attacco: un attacco in più dalla posizione dell'eco.", "fighter.unleash-incarnation")],
  },
  [`${P}echo-knight.echo-avatar`]: { actions: [note("fighter.echo-avatar", "Avatar dell'Eco", "action", "Vedi e senti attraverso l'eco per 10 minuti; la puoi allontanare fino a 300 m.")] },
  [`${P}echo-knight.shadow-martyr`]: {
    resources: [uses("fighter.shadow-martyr", "Martire d'Ombra", 1, "short")],
    actions: [note("fighter.shadow-martyr", "Martire d'Ombra", "reaction", "L'eco si teletrasporta vicino a una creatura che sta per essere attaccata e diventa il bersaglio dell'attacco.", "fighter.shadow-martyr")],
  },
  [`${P}echo-knight.reclaim-potential`]: {
    resources: [uses("fighter.reclaim-potential", "Recuperare Potenziale", atLeastOne({ mod: "con" }))],
    actions: [rollAction("fighter.reclaim-potential", "Recuperare Potenziale", "free", "2d6", "Quando l'eco viene distrutta: PF temporanei.", { resource: "fighter.reclaim-potential", plus: { mod: "con" }, outcome: { kind: "tempHp" } })],
  },

  /* Guerriero Psionico */
  [`${P}psi-warrior.psionic-power`]: {
    actions: [
      rollAction("fighter.protective-field", "Campo Protettivo", "reaction", PSI_DIE, "Riduci i danni a te o a una creatura entro 9 m del dado + Intelligenza.", { resource: PSI, plus: { mod: "int" } }),
      rollAction("fighter.psionic-strike", "Colpo Psionico", "free", PSI_DIE, "Dopo aver colpito con un'arma una creatura entro 9 m: danni da forza extra (dado + Intelligenza).", { resource: PSI, plus: { mod: "int" } }),
      note("fighter.telekinetic-movement", "Movimento Telecinetico", "action", "Sposti un oggetto o una creatura consenziente Grande o più piccola entro 9 m fino a 9 m.", PSI),
      note("fighter.psionic-recovery", "Recuperare energia psionica", "bonus", "Recuperi un dado di energia psionica (una volta per riposo breve): segnalo togliendo un utilizzo speso."),
    ],
  },
  [`${P}psi-warrior.telekinetic-adept`]: {
    actions: [
      note("fighter.psi-powered-leap", "Balzo Psionico", "bonus", "Velocità di volare pari al doppio di quella di camminare fino alla fine del turno.", PSI),
      note("fighter.telekinetic-thrust", "Spinta Telecinetica", "free", "Con il Colpo Psionico: TS Forza o il bersaglio cade prono o è spinto di 3 m."),
    ],
  },
  [`${P}psi-warrior.guarded-mind`]: {
    effects: [{ type: "grant", target: "resistance", values: ["psychic"] }],
    actions: [note("fighter.guarded-mind", "Mente Protetta", "free", "All'inizio del turno, se sei affascinato o spaventato, spendi un dado per terminare quegli effetti.", PSI)],
  },
  [`${P}psi-warrior.bulwark-of-force`]: {
    resources: [uses("fighter.bulwark-of-force", "Baluardo di Forza", 1)],
    actions: [note("fighter.bulwark-of-force", "Baluardo di Forza", "bonus", "Fino a tante creature quanto il modificatore di Intelligenza, entro 9 m: mezza copertura per 1 minuto.", "fighter.bulwark-of-force")],
  },
  [`${P}psi-warrior.telekinetic-master`]: {
    resources: [uses("fighter.telekinetic-master", "Maestro Telecinetico", 1)],
    spells: [{ spellId: "telekinesis", ability: "int", resource: "fighter.telekinetic-master" }],
  },

  /* Cavaliere Runico */
  [`${P}rune-knight.bonus-proficiency`]: { effects: [{ type: "grant", target: "tool", values: ["smiths-tools"] }, { type: "grant", target: "language", values: ["giant"] }] },
  [`${P}rune-knight.rune-carver`]: {
    choices: [{ id: "fighter.runes", kind: "custom", label: "Rune conosciute", count: at("fighter", { 3: 2, 7: 3, 10: 4, 15: 5 }), from: ["Nube", "Fuoco", "Gelo", "Pietra", "Collina (7°)", "Tempesta (7°)"] }],
    actions: [note("fighter.invoke-rune", "Invocare una runa", "special", "Usi il potere di una runa incisa: ognuna una volta per riposo breve (dal 15° due volte).")],
  },
  [`${P}rune-knight.giants-might`]: {
    toggles: [{ id: GIANT, name: "Potenza del Gigante" }],
    actions: [
      { id: "fighter.giants-might", name: "Potenza del Gigante", timing: "bonus", cost: { resource: "fighter.giants-might", amount: 1 }, outcome: { kind: "toggleOn", toggle: GIANT }, when: { not: { toggle: GIANT } }, description: "Per 1 minuto: taglia Grande, vantaggio a prove e TS di Forza, danni extra una volta per turno." },
      { id: "fighter.giants-might.end", name: "Termina la Potenza del Gigante", timing: "free", outcome: { kind: "toggleOff", toggle: GIANT }, when: { toggle: GIANT } },
    ],
    effects: [
      { type: "advantage", on: "check.str", when: { toggle: GIANT }, label: "Potenza del Gigante" },
      { type: "advantage", on: "save.str", when: { toggle: GIANT }, label: "Potenza del Gigante" },
    ],
    dice: [{ id: "fighter.giants-might", name: "Potenza del Gigante", dice: { sides: at("fighter", { 3: 6, 10: 8, 18: 10 }) }, note: "Una volta per turno, a un colpo con un'arma mentre sei grande", when: { toggle: GIANT } }],
  },
  [`${P}rune-knight.runic-shield`]: { actions: [note("fighter.runic-shield", "Scudo Runico", "reaction", "Un attacco che colpisce una creatura entro 18 m: l'attaccante ritira il d20 e deve usare il nuovo risultato.", "fighter.runic-shield")] },
};

