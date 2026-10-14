/** Meccaniche delle sottoclassi, una classe per file. Si aggiungono a quelle di mechanics.ts. */
import { BARBARIAN } from "./barbarian.ts";
import { BARD } from "./bard.ts";
import { CLERIC } from "./cleric.ts";
import { DRUID } from "./druid.ts";
import { FIGHTER } from "./fighter.ts";
import { MONK } from "./monk.ts";
import { PALADIN } from "./paladin.ts";
import { RANGER } from "./ranger.ts";
import { ROGUE } from "./rogue.ts";
import { SORCERER } from "./sorcerer.ts";
import { WARLOCK } from "./warlock.ts";
import { WIZARD } from "./wizard.ts";
import { ARTIFICER } from "./artificer.ts";
import type { Mechanics } from "./helpers.ts";

export const SUBCLASS_MECHANICS: Record<string, Mechanics> = { ...BARBARIAN, ...BARD, ...CLERIC, ...DRUID, ...FIGHTER, ...MONK, ...PALADIN, ...RANGER, ...ROGUE, ...SORCERER, ...WARLOCK, ...WIZARD, ...ARTIFICER };
