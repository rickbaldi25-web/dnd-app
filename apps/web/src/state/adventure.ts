import type { Coin, MonsterDef } from "@dnd/engine";
import type { ImportedCampaign } from "@dnd/importer";
import { registry } from "../content";
import type { AdventureChapter, AdventureMeta, AdventureNote, EncounterPlan, PlanEntry, TreasureItem } from "../data";

/*
 * Da un'avventura importata ai dati dell'app: un documento per capitolo con note, PNG e incontri,
 * più un incontro preparato per ogni scontro con dei mostri, già diviso per capitolo.
 */

const COIN_NAMES: Record<string, Coin> = { platinum: "pp", gold: "gp", electrum: "ep", silver: "sp", copper: "cp" };
/** I testi lunghi degli oggetti scritti a mano si accorciano: servono come promemoria, non come manuale. */
const MAX_TEXT = 1500;

function toTreasure(t: { name: string; quantity: number; text?: string }): TreasureItem {
  const coin = /^(platinum|gold|electrum|silver|copper)\s+pieces?$/i.exec(t.name.trim());
  if (coin) return { name: "", quantity: t.quantity, coin: COIN_NAMES[coin[1]!.toLowerCase()]! };
  const known = [...registry.items.values()].find((i) => i.name.toLowerCase() === t.name.toLowerCase() || i.nameEn?.toLowerCase() === t.name.toLowerCase());
  if (known) return { name: known.name, quantity: t.quantity, itemId: known.id };
  return { name: t.name, quantity: t.quantity, ...(t.text ? { notes: t.text.slice(0, MAX_TEXT) } : {}) };
}

export interface BuiltAdventure {
  meta: AdventureMeta;
  chapters: AdventureChapter[];
  plans: EncounterPlan[];
  /** Mostri che non si trovano nella raccolta: in combattimento non avranno la scheda. */
  unmatched: string[];
}

export function buildAdventure(c: ImportedCampaign, library: MonsterDef[]): BuiltAdventure {
  const byName = new Map(library.map((m) => [m.name.toLowerCase(), m]));
  const unmatched = new Set<string>();
  const plans: EncounterPlan[] = [];
  const chapters: AdventureChapter[] = c.chapters.map((ch, ci) => {
    const id = `cap-${String(ci + 1).padStart(2, "0")}`;
    return {
      id,
      order: ci,
      name: ch.name,
      notes: ch.notes,
      npcs: ch.npcs.filter(Boolean),
      encounters: ch.encounters.map((enc, ei) => {
        // Mostri uguali si raggruppano: "Goblin 1", "Goblin 2" diventano 2 × Goblin.
        const groups = new Map<string, { label: string; count: number; hp: number; ac: number; cr: string; name: string; bonus: number; monsterId?: string }>();
        for (const x of enc.combatants) {
          const lib = byName.get(x.monster.name.toLowerCase());
          if (!lib) unmatched.add(x.monster.name);
          const label = x.label.replace(/\s+\d+$/, "");
          const cr = lib?.cr ?? x.monster.cr;
          const key = `${label}|${x.monster.hp}|${x.monster.ac}|${cr}`;
          const g = groups.get(key);
          if (g) g.count++;
          else groups.set(key, { label, count: 1, hp: x.monster.hp, ac: x.monster.ac, cr, name: x.monster.name, bonus: Math.floor((x.monster.abilities.dex - 10) / 2), ...(lib ? { monsterId: lib.id } : {}) });
        }
        const list = [...groups.values()];
        const planId = list.length ? `p-avv-${ci + 1}-${ei + 1}` : undefined;
        if (planId) {
          const entries: PlanEntry[] = list.map((g) => ({ name: g.label, count: g.count, hp: g.hp, ac: g.ac, initiativeBonus: g.bonus, cr: g.cr, ...(g.monsterId ? { monsterId: g.monsterId } : {}) }));
          const treasure = enc.treasure.map(toTreasure);
          plans.push({ id: planId, name: enc.name, chapter: ch.name, entries, ...(treasure.length ? { treasure } : {}), ...(enc.notes.length ? { notes: enc.notes } : {}), source: { chapterId: id, index: ei } });
        }
        return {
          name: enc.name,
          notes: enc.notes,
          treasure: enc.treasure.map((t) => ({ name: t.name, quantity: t.quantity, ...(t.text ? { text: t.text.slice(0, MAX_TEXT) } : {}) })),
          groups: list.map(({ label, count, hp, ac, cr, name }) => ({ label, count, hp, ac, cr, name })),
          ...(planId ? { planId } : {}),
        };
      }),
    };
  });
  const items: AdventureNote[] = c.items.map((i) => ({ title: i.name, text: i.text ?? "" }));
  return { meta: { name: c.name, notes: c.notes, items, docs: [], importedAt: Date.now() }, chapters, plans, unmatched: [...unmatched].sort() };
}

/** I link di Google Drive si aprono nell'anteprima incorporabile; gli altri restano come sono. */
export function embeddableUrl(url: string): string {
  const drive = /^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\//.exec(url);
  return drive ? `https://drive.google.com/file/d/${drive[1]}/preview` : url;
}
