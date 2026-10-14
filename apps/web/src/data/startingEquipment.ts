/*
 * Equipaggiamento iniziale delle classi (Manuale del Giocatore 2014, Artefice da Tasha).
 * Nei compendi importati c'è solo come testo: qui le scelte sono scritte con gli id degli oggetti.
 */

/** Un oggetto preciso, oppure uno da scegliere da un gruppo ("un'arma semplice"). */
export type Thing = { id: string; qty?: number } | { pick: PickKind; qty?: number };
export type PickKind = "simple" | "simpleMelee" | "martial" | "martialMelee" | "instrument" | "arcaneFocus" | "holySymbol" | "druidicFocus";
/** Una delle alternative di una scelta: (a), (b), (c). */
export type Option = Thing[];
export interface StartingKit {
  /** Ogni scelta ha due o tre alternative. */
  choices: Option[][];
  /** Ciò che si riceve comunque. */
  fixed: Thing[];
  /** In alternativa all'equipaggiamento: monete d'oro da tirare. */
  wealth: { dice: string; times: number };
}

const id = (x: string, qty?: number): Thing => (qty ? { id: x, qty } : { id: x });
const pick = (k: PickKind, qty?: number): Thing => (qty ? { pick: k, qty } : { pick: k });

/** Armi base dei manuali, senza varianti argentate o armi da fuoco. */
export const BASE_WEAPONS: Record<"simple" | "martial", { melee: string[]; ranged: string[] }> = {
  simple: {
    melee: ["club", "dagger", "greatclub", "handaxe", "javelin", "light-hammer", "mace", "quarterstaff", "sickle", "spear"],
    ranged: ["light-crossbow", "dart", "shortbow", "sling"],
  },
  martial: {
    melee: ["battleaxe", "flail", "glaive", "greataxe", "greatsword", "halberd", "lance", "longsword", "maul", "morningstar", "pike", "rapier", "scimitar", "shortsword", "trident", "war-pick", "warhammer", "whip"],
    ranged: ["blowgun", "hand-crossbow", "heavy-crossbow", "longbow", "net"],
  },
};
export const PICKS: Record<PickKind, { label: string; ids: string[] }> = {
  simple: { label: "un'arma semplice", ids: [...BASE_WEAPONS.simple.melee, ...BASE_WEAPONS.simple.ranged] },
  simpleMelee: { label: "un'arma semplice da mischia", ids: BASE_WEAPONS.simple.melee },
  martial: { label: "un'arma da guerra", ids: [...BASE_WEAPONS.martial.melee, ...BASE_WEAPONS.martial.ranged] },
  martialMelee: { label: "un'arma da guerra da mischia", ids: BASE_WEAPONS.martial.melee },
  instrument: { label: "uno strumento musicale", ids: ["bagpipes", "drum", "dulcimer", "flute", "horn", "lute", "lyre", "pan-flute", "shawm", "viol"] },
  arcaneFocus: { label: "un focus arcano", ids: ["crystal", "orb", "rod", "staff", "wand"] },
  holySymbol: { label: "un simbolo sacro", ids: ["amulet", "emblem", "reliquary"] },
  druidicFocus: { label: "un focus druidico", ids: ["sprig-of-mistletoe", "totem", "wooden-staff", "yew-wand"] },
};

const PACK = { dungeoneer: id("dungeoneers-pack"), explorer: id("explorers-pack"), priest: id("priests-pack"), scholar: id("scholars-pack"), burglar: id("burglars-pack"), diplomat: id("diplomats-pack"), entertainer: id("entertainers-pack") };
const CROSSBOW = [id("light-crossbow"), id("crossbow-bolts", 20)];

export const STARTING_KITS: Record<string, StartingKit> = {
  barbarian: {
    choices: [[[id("greataxe")], [pick("martialMelee")]], [[id("handaxe", 2)], [pick("simple")]]],
    fixed: [PACK.explorer, id("javelin", 4)],
    wealth: { dice: "2d4", times: 10 },
  },
  bard: {
    choices: [[[id("rapier")], [id("longsword")], [pick("simple")]], [[PACK.diplomat], [PACK.entertainer]], [[id("lute")], [pick("instrument")]]],
    fixed: [id("leather-armor"), id("dagger")],
    wealth: { dice: "5d4", times: 10 },
  },
  cleric: {
    choices: [[[id("mace")], [id("warhammer")]], [[id("scale-mail")], [id("leather-armor")], [id("chain-mail")]], [CROSSBOW, [pick("simple")]], [[PACK.priest], [PACK.explorer]]],
    fixed: [id("shield"), pick("holySymbol")],
    wealth: { dice: "5d4", times: 10 },
  },
  druid: {
    choices: [[[id("shield")], [pick("simple")]], [[id("scimitar")], [pick("simpleMelee")]]],
    fixed: [id("leather-armor"), PACK.explorer, pick("druidicFocus")],
    wealth: { dice: "2d4", times: 10 },
  },
  fighter: {
    choices: [[[id("chain-mail")], [id("leather-armor"), id("longbow"), id("arrows", 20)]], [[pick("martial"), id("shield")], [pick("martial"), pick("martial")]], [CROSSBOW, [id("handaxe", 2)]], [[PACK.dungeoneer], [PACK.explorer]]],
    fixed: [],
    wealth: { dice: "5d4", times: 10 },
  },
  monk: {
    choices: [[[id("shortsword")], [pick("simple")]], [[PACK.dungeoneer], [PACK.explorer]]],
    fixed: [id("dart", 10)],
    wealth: { dice: "5d4", times: 1 },
  },
  paladin: {
    choices: [[[pick("martial"), id("shield")], [pick("martial"), pick("martial")]], [[id("javelin", 5)], [pick("simpleMelee")]], [[PACK.priest], [PACK.explorer]]],
    fixed: [id("chain-mail"), pick("holySymbol")],
    wealth: { dice: "5d4", times: 10 },
  },
  ranger: {
    choices: [[[id("scale-mail")], [id("leather-armor")]], [[id("shortsword", 2)], [pick("simpleMelee"), pick("simpleMelee")]], [[PACK.dungeoneer], [PACK.explorer]]],
    fixed: [id("longbow"), id("arrows", 20)],
    wealth: { dice: "5d4", times: 10 },
  },
  rogue: {
    choices: [[[id("rapier")], [id("shortsword")]], [[id("shortbow"), id("arrows", 20)], [id("shortsword")]], [[PACK.burglar], [PACK.dungeoneer], [PACK.explorer]]],
    fixed: [id("leather-armor"), id("dagger", 2), id("thieves-tools")],
    wealth: { dice: "4d4", times: 10 },
  },
  sorcerer: {
    choices: [[CROSSBOW, [pick("simple")]], [[id("component-pouch")], [pick("arcaneFocus")]], [[PACK.dungeoneer], [PACK.explorer]]],
    fixed: [id("dagger", 2)],
    wealth: { dice: "3d4", times: 10 },
  },
  warlock: {
    choices: [[CROSSBOW, [pick("simple")]], [[id("component-pouch")], [pick("arcaneFocus")]], [[PACK.scholar], [PACK.dungeoneer]]],
    fixed: [id("leather-armor"), pick("simple"), id("dagger", 2)],
    wealth: { dice: "4d4", times: 10 },
  },
  wizard: {
    choices: [[[id("quarterstaff")], [id("dagger")]], [[id("component-pouch")], [pick("arcaneFocus")]], [[PACK.scholar], [PACK.explorer]]],
    fixed: [id("spellbook")],
    wealth: { dice: "4d4", times: 10 },
  },
  artificer: {
    choices: [[[id("studded-leather-armor")], [id("scale-mail")]]],
    fixed: [pick("simple"), pick("simple"), ...CROSSBOW, id("thieves-tools"), PACK.dungeoneer],
    wealth: { dice: "5d4", times: 10 },
  },
};

/** Un pezzo dell'equipaggiamento del background: un oggetto dei manuali, uno scritto a mano o delle monete. */
export interface BackgroundGear {
  name: string;
  quantity: number;
  itemId?: string;
  notes?: string;
  gp?: number;
}

const WORDS: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twenty: 20, fifty: 50 };

/** Divide "a, b (c, d), and e" sulle virgole che non stanno tra parentesi. */
function splitTop(text: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim().replace(/^and\s+/i, "").trim()).filter(Boolean);
}

/**
 * Equipaggiamento del background dalla sua riga "Equipment: ..." nella descrizione.
 * findItem cerca un oggetto dei manuali per nome; quello che non si trova resta scritto a mano.
 */
export function backgroundGear(description: string | undefined, findItem: (name: string) => string | undefined): BackgroundGear[] {
  const line = description?.match(/Equipment:\s*([^\n]*)/)?.[1];
  if (!line) return [];
  const out: BackgroundGear[] = [];
  for (const raw of splitTop(line.replace(/\.$/, ""))) {
    let phrase = raw;
    const coins = /containing\s+(\d+)\s*gp/i.exec(phrase);
    if (coins) {
      out.push({ name: "", quantity: 1, gp: Number(coins[1]) });
      phrase = phrase.replace(/\s*containing\s+\d+\s*gp/i, "");
    }
    const notes = /\(([^)]*)\)/.exec(phrase)?.[1];
    phrase = phrase.replace(/\s*\([^)]*\)/g, "").trim();
    let quantity = 1;
    const num = /^(\d+|two|three|four|five|six|seven|eight|nine|ten|twenty|fifty)\s+/i.exec(phrase);
    if (num) {
      quantity = Number(num[1]) || WORDS[num[1]!.toLowerCase()] || 1;
      phrase = phrase.slice(num[0].length);
    }
    phrase = phrase.replace(/^(a set of|a|an|the|some)\s+/i, "").trim();
    if (!phrase) continue;
    const itemId = findItem(phrase) ?? findItem(phrase.replace(/^belt\s+/i, "")) ?? findItem(phrase.replace(/s$/, ""));
    out.push({ name: itemId ? phrase : phrase[0]!.toUpperCase() + phrase.slice(1), quantity, ...(itemId ? { itemId } : {}), ...(notes ? { notes } : {}) });
  }
  return out;
}
