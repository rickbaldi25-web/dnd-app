import type { SpellDef } from "@dnd/engine";
import { SRD_SPELL_DATA } from "./data.js";
import { SPELL_OVERRIDES } from "./overrides.js";

/** null toglie il campo, undefined lascia quello generato. */
const pick = <T>(base: T | undefined, over: T | null | undefined): T | undefined => (over === undefined ? base : (over ?? undefined));

/** I 339 incantesimi dell'SRD 5.2.1: dati generati più le correzioni a mano. */
export const spells: SpellDef[] = SRD_SPELL_DATA.map((s) => {
  const o = SPELL_OVERRIDES[s.id];
  if (!o) return s;
  return { ...s, attack: pick(s.attack, o.attack), save: pick(s.save, o.save), roll: pick(s.roll, o.roll) };
});
