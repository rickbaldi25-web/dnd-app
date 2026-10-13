import type { ContentPack } from "@dnd/engine";
import { criminal, soldier } from "./backgrounds/backgrounds.js";
import { barbarian, berserker } from "./classes/barbarian.js";
import { champion, fighter } from "./classes/fighter.js";
import { feats } from "./feats.js";
import { armor, gear, shields, weapons } from "./items/equipment.js";
import { skills } from "./skills.js";
import { dwarf, human } from "./species/species.js";
import { spells } from "./spells/index.js";

/**
 * Contenuti SRD 5.2 (regole 2024).
 * Classi, specie e talenti hanno testi riformulati in italiano; gli incantesimi usano
 * il testo dell'SRD 5.2.1 ufficiale in italiano. Vedi CREDITS.md per l'attribuzione CC-BY-4.0.
 */
export const srd: ContentPack = {
  id: "srd-5.2",
  name: "SRD 5.2 (2024)",
  license: "CC-BY-4.0",
  classes: [barbarian, fighter],
  subclasses: [berserker, champion],
  species: [dwarf, human],
  backgrounds: [soldier, criminal],
  feats,
  items: [...armor, ...shields, ...weapons, ...gear],
  skills,
  spells,
};

export { spells } from "./spells/index.js";
export * from "./items/equipment.js";
export { skills, ALL_SKILL_IDS } from "./skills.js";
