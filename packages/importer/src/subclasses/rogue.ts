/** Archetipi del Ladro. */
import { at, note, rollAction, uses, type Mechanics } from "./helpers.ts";

const P = "rogue.";
const PSI = "rogue.psionic-energy";
const PSI_DIE = { sides: at("rogue", { 3: 6, 5: 8, 11: 10, 17: 12 }) };

export const ROGUE: Record<string, Mechanics> = {
  /* Mistificatore Arcano */
  [`${P}arcane-trickster.mage-hand-legerdemain`]: {
    spells: [{ spellId: "mage-hand", ability: "int" }],
    actions: [note("rogue.mage-hand-legerdemain", "Mano Magica Lesta", "bonus", "Con la mano magica invisibile: riponi o prendi oggetti da un'altra creatura, usi arnesi da scasso a distanza.")],
  },
  [`${P}arcane-trickster.magical-ambush`]: { actions: [note("rogue.magical-ambush", "Imboscata Magica", "special", "Se sei nascosto quando lanci un incantesimo, il bersaglio ha svantaggio al tiro salvezza.")] },
  [`${P}arcane-trickster.versatile-trickster`]: { actions: [note("rogue.versatile-trickster", "Mistificatore Versatile", "bonus", "La mano magica distrae una creatura entro 1,5 m da lei: vantaggio ai tuoi attacchi contro di essa per il turno.")] },
  [`${P}arcane-trickster.spell-thief`]: { actions: [note("rogue.spell-thief", "Ladro di Incantesimi", "reaction", "Chi ti bersaglia con un incantesimo: TS con la tua CD o l'incantesimo fallisce e lo rubi per 8 ore.", "rogue.spell-thief")] },

  /* Assassino */
  [`${P}assassin.assassinate`]: { actions: [note("rogue.assassinate", "Assassinare", "special", "Vantaggio contro chi non ha ancora agito; ogni colpo contro una creatura sorpresa è critico.")] },
  [`${P}assassin.imposter`]: { actions: [note("rogue.imposter", "Impostore", "special", "Dopo 3 ore di studio imiti alla perfezione voce, scrittura e modi di una persona.")] },
  [`${P}assassin.death-strike`]: { actions: [note("rogue.death-strike", "Colpo Mortale", "free", "Colpendo una creatura sorpresa: TS Costituzione (CD 8 + Destrezza + competenza) o i danni raddoppiano.")] },

  /* Furfante */
  [`${P}thief.fast-hands`]: { actions: [note("rogue.fast-hands", "Mani Veloci", "bonus", "Con l'Azione Scaltra: Rapidità di Mano, arnesi da scasso o Usare un Oggetto.")] },
  [`${P}thief.supreme-sneak`]: { effects: [{ type: "advantage", on: "skill.stealth", label: "Furtività Suprema (muovendoti a metà velocità)" }] },
  [`${P}thief.thiefs-reflexes`]: { actions: [note("rogue.thiefs-reflexes", "Riflessi del Ladro", "special", "Nel primo round di combattimento hai due turni: il secondo all'iniziativa meno 10.")] },

  /* Indagatore */
  [`${P}inquisitive.insightful-fighting`]: {
    actions: [note("rogue.insightful-fighting", "Combattimento Intuitivo", "bonus", "Prova di Intuizione contro Inganno della creatura: se riesci, Attacco Furtivo contro di lei senza vantaggio per 1 minuto.")],
  },
  [`${P}inquisitive.eye-for-detail`]: { actions: [note("rogue.eye-for-detail", "Occhio per i Dettagli", "bonus", "Prova di Percezione per trovare una creatura o un oggetto nascosti, o di Indagare per scoprire indizi.")] },
  [`${P}inquisitive.steady-eye`]: { effects: [{ type: "advantage", on: "skill.perception", label: "Occhio Fermo (muovendoti a metà velocità)" }, { type: "advantage", on: "skill.investigation", label: "Occhio Fermo (muovendoti a metà velocità)" }] },
  [`${P}inquisitive.unerring-eye`]: {
    resources: [uses("rogue.unerring-eye", "Occhio Infallibile", { max: [1, { mod: "wis" }] })],
    actions: [note("rogue.unerring-eye", "Occhio Infallibile", "action", "Percepisci illusioni, mutaforma e magia di trasmutazione entro 9 m.", "rogue.unerring-eye")],
  },
  [`${P}inquisitive.eye-for-weakness`]: { dice: [{ id: "rogue.eye-for-weakness", name: "Occhio per le Debolezze", dice: "3d6", note: "Si somma all'Attacco Furtivo contro chi hai letto con Combattimento Intuitivo" }] },

  /* Mente Criminale */
  [`${P}mastermind.master-of-intrigue`]: { effects: [{ type: "grant", target: "tool", values: ["disguise-kit", "forgery-kit"] }], choices: [{ id: "rogue.master-of-intrigue", kind: "language", label: "Maestro dell'Intrigo: lingue", count: 2 }] },
  [`${P}mastermind.master-of-tactics`]: { actions: [note("rogue.master-of-tactics", "Maestro di Tattiche", "bonus", "Aiuti come azione bonus, anche una creatura entro 9 m da te.")] },
  [`${P}mastermind.misdirection`]: { actions: [note("rogue.misdirection", "Depistaggio", "reaction", "Un attacco contro di te colpisce invece una creatura che ti fa da copertura.")] },

  /* Esploratore */
  [`${P}scout.skirmisher`]: { actions: [note("rogue.skirmisher", "Schermagliatore", "reaction", "Quando un nemico finisce il turno entro 1,5 m: ti muovi di metà velocità senza provocare attacchi di opportunità.")] },
  [`${P}scout.ambush-master`]: {
    effects: [{ type: "advantage", on: "initiative", label: "Maestro delle Imboscate" }],
    actions: [note("rogue.ambush-master", "Maestro delle Imboscate", "special", "Nel primo turno di combattimento: chi colpisci per primo concede vantaggio a tutti fino al tuo prossimo turno.")],
  },
  [`${P}scout.sudden-strike`]: { actions: [note("rogue.sudden-strike", "Colpo Improvviso", "bonus", "Dopo l'azione di Attacco: un altro attacco (Attacco Furtivo possibile contro un bersaglio diverso).")] },

  /* Spadaccino */
  [`${P}swashbuckler.fancy-footwork`]: { actions: [note("rogue.fancy-footwork", "Gioco di Gambe", "special", "Chi attacchi in mischia non può farti attacchi di opportunità per il resto del turno.")] },
  [`${P}swashbuckler.rakish-audacity`]: { effects: [{ type: "bonus", target: "initiative", value: { mod: "cha" }, label: "Audacia Sfrontata" }] },
  [`${P}swashbuckler.panache`]: { actions: [note("rogue.panache", "Panache", "action", "Prova di Persuasione contro Intuizione: un nemico ha svantaggio contro altri e non ti lascia; un non ostile è affascinato per 1 minuto.")] },
  [`${P}swashbuckler.elegant-maneuver`]: { actions: [note("rogue.elegant-maneuver", "Manovra Elegante", "bonus", "Vantaggio alla prossima prova di Acrobazia o Atletica in questo turno.")] },
  [`${P}swashbuckler.master-duelist`]: { actions: [note("rogue.master-duelist", "Duellante Maestro", "free", "Ritiri un attacco mancato con vantaggio.", "rogue.master-duelist")] },

  /* Fantasma */
  [`${P}phantom.whispers-of-the-dead`]: { actions: [note("rogue.whispers-of-the-dead", "Sussurri dei Morti", "special", "Dopo un riposo: competenza in un'abilità o uno strumento a scelta fino al prossimo riposo.")] },
  [`${P}phantom.wails-from-the-grave`]: {
    actions: [rollAction("rogue.wails-from-the-grave", "Lamenti dalla Tomba", "free", { count: { div: [{ div: [{ level: "rogue" }, 2], round: "up" }, 2], round: "up" }, sides: 6 }, "Dopo l'Attacco Furtivo: un'altra creatura entro 9 m subisce danni necrotici pari a metà dei dadi dell'Attacco Furtivo.", { resource: "rogue.wails-from-the-grave" })],
  },
  [`${P}phantom.tokens-of-the-departed`]: { actions: [note("rogue.tokens-of-the-departed", "Ricordi dei Defunti", "reaction", "Quando una creatura muore entro 9 m: crei un ricordo dell'anima (massimo pari al bonus di competenza). Con un ricordo: vantaggio a TS di Costituzione e su morte; lo distruggi per usare i Lamenti senza spenderli.")] },
  [`${P}phantom.ghost-walk`]: {
    resources: [uses("rogue.ghost-walk", "Passo Spettrale", 1)],
    actions: [note("rogue.ghost-walk", "Passo Spettrale", "bonus", "Per 10 minuti: volo 3 m, fluttui, gli attacchi contro di te hanno svantaggio e attraversi oggetti. Senza usi: distruggi un ricordo dell'anima.", "rogue.ghost-walk")],
  },
  [`${P}phantom.deaths-friend`]: { actions: [note("rogue.deaths-friend", "Amico della Morte", "special", "I Lamenti colpiscono anche il bersaglio dell'Attacco Furtivo; a fine riposo lungo, se non hai ricordi, ne ottieni uno.")] },

  /* Lama dell'Anima */
  [`${P}soulknife.psionic-power`]: {
    actions: [
      rollAction("rogue.psi-bolstered-knack", "Destrezza Psionica", "free", PSI_DIE, "Prova fallita con un'abilità o strumento in cui hai competenza: aggiungi il dado (lo spendi solo se riesci).", { resource: PSI }),
      rollAction("rogue.psychic-whispers", "Sussurri Psichici", "action", PSI_DIE, "Comunicazione telepatica con fino a tante creature quanto il bonus di competenza, per tante ore quanto il dado.", { resource: PSI }),
      note("rogue.psionic-recovery", "Recuperare energia psionica", "bonus", "Recuperi un dado di energia psionica (una volta per riposo breve): segnalo togliendo un utilizzo speso."),
    ],
  },
  [`${P}soulknife.psychic-blades`]: {
    actions: [
      rollAction("rogue.psychic-blade", "Lama Psichica", "action", "1d6", "Attacco in mischia o da lancio (18 m) con Destrezza o Forza: danni psichici (più il modificatore).", { plus: { mod: "dex" } }),
      rollAction("rogue.psychic-blade.bonus", "Seconda Lama Psichica", "bonus", "1d4", "Dopo aver attaccato con una Lama Psichica: un'altra lama (danni psichici più il modificatore).", { plus: { mod: "dex" } }),
    ],
  },
  [`${P}soulknife.soul-blades`]: {
    actions: [
      rollAction("rogue.homing-strikes", "Colpi a Ricerca", "free", PSI_DIE, "Un attacco con Lama Psichica mancato: aggiungi il dado al tiro (lo spendi solo se colpisci).", { resource: PSI }),
      note("rogue.psychic-teleportation", "Teletrasporto Psichico", "bonus", "Lanci una lama e ti teletrasporti dove atterra: distanza pari a 3 m per il valore del dado.", PSI),
    ],
  },
  [`${P}soulknife.psychic-veil`]: {
    resources: [uses("rogue.psychic-veil", "Velo Psichico", 1)],
    actions: [note("rogue.psychic-veil", "Velo Psichico", "action", "Invisibile per 1 ora o finché non infliggi danni o costringi a un TS. Senza usi: un dado di energia psionica.", "rogue.psychic-veil")],
  },
  [`${P}soulknife.rend-mind`]: {
    resources: [uses("rogue.rend-mind", "Lacerare la Mente", 1)],
    actions: [note("rogue.rend-mind", "Lacerare la Mente", "free", "Con l'Attacco Furtivo di una Lama Psichica: TS Saggezza o il bersaglio è stordito per 1 minuto. Senza usi: 3 dadi di energia psionica.", "rogue.rend-mind")],
  },
};
