import type { Ability, MonsterDef, MonsterEntry } from "@dnd/engine";
import { kid, kids, parseXml, val, type XmlNode } from "./xml.ts";

/*
 * Campagne nel formato di Game Master 5: <campaign> con capitoli (<adventure>), ognuno con
 * note, PNG e incontri. I mostri degli incontri sono scritti per intero oppure richiamano un PNG per uid.
 */

export interface CampaignNote {
  title: string;
  text: string;
}
export interface CampaignCombatant {
  /** Nome al tavolo: "Goblin 3", "Rose Durst". */
  label: string;
  monster: MonsterDef;
}
export interface CampaignTreasure {
  name: string;
  quantity: number;
  text?: string;
}
export interface CampaignEncounter {
  name: string;
  combatants: CampaignCombatant[];
  treasure: CampaignTreasure[];
  notes: CampaignNote[];
}
export interface CampaignNpc {
  label: string;
  monster: MonsterDef;
}
export interface CampaignChapter {
  name: string;
  notes: CampaignNote[];
  npcs: CampaignNpc[];
  encounters: CampaignEncounter[];
}
export interface ImportedCampaign {
  name: string;
  chapters: CampaignChapter[];
  /** Oggetti e note che stanno fuori dai capitoli. */
  notes: CampaignNote[];
  items: CampaignTreasure[];
}

/** Il formato scrive i gradi di sfida frazionari come numeri negativi. */
export function decodeCr(raw: string): string {
  const n = Number(raw);
  if (raw.trim() === "" || Number.isNaN(n)) return raw.trim() || "0";
  return n <= -3 ? "0" : n === -2 ? "1/8" : n === -1 ? "1/4" : n === 0 ? "1/2" : String(n);
}

const SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
const ABILITIES: Ability[] = ["str", "dex", "con", "int", "wis", "cha"];
/** Abilità in ordine alfabetico inglese, come le numera il formato. */
const SKILLS = ["acrobatics", "animal-handling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight-of-hand", "stealth", "survival"];

const textOf = (n: XmlNode) => val(n, "text").replace(/\n\t+/g, "\n");

function entries(n: XmlNode, tag: string): MonsterEntry[] {
  return kids(n, tag).map((e) => {
    const entry: MonsterEntry = { name: val(e, "name"), text: textOf(e) };
    const atk = kid(e, "attack");
    if (atk && val(atk, "atk") !== "" && val(atk, "dmg")) entry.attack = { bonus: Number(val(atk, "atk")) || 0, damage: val(atk, "dmg").replace(/\s+/g, "") };
    return entry;
  });
}

/** Scheda del mostro nel formato dell'app. key distingue le schede dello stesso nome. */
export function campaignMonster(n: XmlNode, key: string): MonsterDef {
  const scores = val(n, "abilities").split(",").map((x) => Number(x.trim()) || 10);
  const abilities = Object.fromEntries(ABILITIES.map((a, i) => [a, scores[i] ?? 10])) as Record<Ability, number>;
  const traits = entries(n, "trait");
  const srcAt = traits.findIndex((t) => t.name === "Source");
  const source = srcAt >= 0 ? traits.splice(srcAt, 1)[0]!.text : undefined;
  const skills: Record<string, number> = {};
  for (const s of kids(n, "skill")) {
    const id = SKILLS[Number(val(s, "id"))];
    if (id) skills[id] = Number(val(s, "modifier")) || 0;
  }
  const opt = (key: string, tag: string) => (val(n, tag) ? { [key]: val(n, tag) } : {});
  const list = (key: string, tag: string) => {
    const e = entries(n, tag);
    return e.length ? { [key]: e } : {};
  };
  return {
    id: key,
    name: val(n, "name") || val(n, "label"),
    size: SIZES[Number(val(n, "size"))] ?? "Medium",
    type: val(n, "type"),
    ...opt("alignment", "alignment"),
    ac: Number(val(n, "ac")) || 10,
    ...opt("acNote", "armor"),
    hp: Number(val(n, "hpMax")) || 1,
    ...opt("hpFormula", "hd"),
    speed: val(n, "speed"),
    abilities,
    ...(Object.keys(skills).length ? { skills } : {}),
    ...opt("resistances", "resist"),
    ...opt("vulnerabilities", "vulnerable"),
    ...opt("immunities", "immune"),
    ...opt("conditionImmunities", "conditionImmune"),
    ...opt("senses", "senses"),
    ...(val(n, "passive") ? { passivePerception: Number(val(n, "passive")) } : {}),
    ...opt("languages", "languages"),
    cr: decodeCr(val(n, "cr")),
    traits,
    actions: entries(n, "action"),
    ...list("reactions", "reaction"),
    ...list("legendary", "legendary"),
    ...(source ? { source } : {}),
  } as MonsterDef;
}

const notes = (n: XmlNode): CampaignNote[] => kids(n, "note").map((x) => ({ title: val(x, "name"), text: textOf(x) })).filter((x) => x.title || x.text);
const treasure = (n: XmlNode): CampaignTreasure[] =>
  kids(n, "item").map((i) => ({ name: val(i, "name"), quantity: Math.max(1, Number(val(i, "quantity")) || 1), ...(textOf(i) ? { text: textOf(i) } : {}) })).filter((i) => i.name);

export function importCampaign(xml: string): ImportedCampaign {
  const root = parseXml(xml);
  const campaign = kid(kid(root, "data") ?? root, "campaign");
  if (!campaign) throw new Error("Il file non contiene una campagna (manca <campaign>).");

  // I PNG si possono richiamare da qualsiasi capitolo: prima si raccolgono tutti.
  const npcByUid = new Map<string, CampaignNpc>();
  const chapters = kids(campaign, "adventure");
  for (const ch of chapters)
    for (const npc of kids(ch, "npc")) {
      const label = val(npc, "label") || val(npc, "name");
      npcByUid.set(val(npc, "uid"), { label, monster: campaignMonster(npc, `npc-${val(npc, "uid")}`) });
    }

  return {
    name: val(campaign, "name") || "Campagna",
    notes: notes(campaign),
    items: treasure(campaign),
    chapters: chapters.map((ch) => ({
      name: val(ch, "name"),
      notes: notes(ch),
      npcs: kids(ch, "npc").map((npc) => npcByUid.get(val(npc, "uid"))!),
      encounters: kids(ch, "encounter").map((enc) => ({
        name: val(enc, "name"),
        notes: notes(enc),
        treasure: treasure(enc),
        combatants: kids(enc, "combatant").flatMap((c): CampaignCombatant[] => {
          const m = kid(c, "monster");
          if (!m) return [];
          // Un mostro con solo l'uid richiama un PNG del capitolo.
          if (!val(m, "name") && !val(m, "abilities")) {
            const npc = npcByUid.get(val(m, "uid"));
            return npc ? [{ label: npc.label, monster: npc.monster }] : [];
          }
          return [{ label: val(m, "label") || val(m, "name"), monster: campaignMonster(m, `m-${val(enc, "uid")}-${val(m, "label") || val(m, "name")}`) }];
        }),
      })),
    })),
  };
}
