import type { SpellDef } from "@dnd/engine";

/**
 * Correzioni a mano sui dati generati da scripts/build-spells.mjs.
 *
 * I tiri automatici (attacco, danni, cure) nascono da euristiche sul testo: qui
 * si sistemano i casi che il testo non permette di capire da solo. `null` toglie
 * il campo: serve quando il primo dado nel testo non è il tiro principale.
 */
type Override = { [K in "attack" | "save" | "roll"]?: SpellDef[K] | null };

export const SPELL_OVERRIDES: Record<string, Override> = {
  /* --- attacchi che il testo descrive in altro modo --- */
  "shocking-grasp": { attack: "melee" },
  "scorching-ray": { attack: "ranged" },
  "flame-blade": { attack: "melee" },

  /* --- danni di un tipo a scelta --- */
  "sorcerous-burst": { roll: { kind: "damage", dice: "1d8", cantripScaling: true } },
  "chromatic-orb": { roll: { kind: "damage", dice: "3d8", perSlotLevel: "1d8" } },
  "glyph-of-warding": { roll: { kind: "damage", dice: "5d8", perSlotLevel: "1d8" } },
  "prismatic-spray": { roll: { kind: "damage", dice: "12d6" } },

  /* --- i dadi in più a slot superiore non riguardano il tiro principale --- */
  "ice-knife": { roll: { kind: "damage", dice: "1d10", damageType: "piercing" } },

  /* --- cure e punti ferita temporanei --- */
  "prayer-of-healing": { roll: { kind: "heal", dice: "2d8", perSlotLevel: "1d8" } },
  "false-life": { roll: { kind: "tempHp", dice: "2d4+4", perSlotLevel: "5" } },
  heal: { roll: { kind: "heal", dice: "70", perSlotLevel: "10" } },

  /* --- il primo dado nel testo è un effetto secondario: nessun tiro automatico --- */
  web: { roll: null },
  "find-steed": { roll: null },
  "meld-into-stone": { roll: null },
  "bestow-curse": { roll: null },
  "control-water": { roll: null },
  "dimension-door": { roll: null },
  "contact-other-plane": { roll: null },
  teleport: { roll: null },
  wish: { roll: null },
};
