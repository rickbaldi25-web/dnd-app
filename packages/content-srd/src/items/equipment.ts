import type { ArmorDef, GearDef, ShieldDef, WeaponDef } from "@dnd/engine";

export const armor: ArmorDef[] = [
  { id: "padded", name: "Armatura imbottita", kind: "armor", category: "light", baseAC: 11, dexCap: null, stealthDisadvantage: true },
  { id: "leather", name: "Armatura di cuoio", kind: "armor", category: "light", baseAC: 11, dexCap: null },
  { id: "studded-leather", name: "Cuoio borchiato", kind: "armor", category: "light", baseAC: 12, dexCap: null },
  { id: "hide", name: "Armatura di pelle", kind: "armor", category: "medium", baseAC: 12, dexCap: 2 },
  { id: "chain-shirt", name: "Giaco di maglia", kind: "armor", category: "medium", baseAC: 13, dexCap: 2 },
  { id: "scale-mail", name: "Corazza a scaglie", kind: "armor", category: "medium", baseAC: 14, dexCap: 2, stealthDisadvantage: true },
  { id: "breastplate", name: "Corazza di piastre", kind: "armor", category: "medium", baseAC: 14, dexCap: 2 },
  { id: "half-plate", name: "Mezza armatura", kind: "armor", category: "medium", baseAC: 15, dexCap: 2, stealthDisadvantage: true },
  { id: "ring-mail", name: "Corazza ad anelli", kind: "armor", category: "heavy", baseAC: 14, dexCap: 0, stealthDisadvantage: true },
  { id: "chain-mail", name: "Cotta di maglia", kind: "armor", category: "heavy", baseAC: 16, dexCap: 0, strength: 13, stealthDisadvantage: true },
  { id: "splint", name: "Armatura a strisce", kind: "armor", category: "heavy", baseAC: 17, dexCap: 0, strength: 15, stealthDisadvantage: true },
  { id: "plate", name: "Armatura completa", kind: "armor", category: "heavy", baseAC: 18, dexCap: 0, strength: 15, stealthDisadvantage: true },
];

export const shields: ShieldDef[] = [{ id: "shield", name: "Scudo", kind: "shield", bonus: 2 }];

const w = (x: Omit<WeaponDef, "kind">): WeaponDef => ({ kind: "weapon", ...x });

export const weapons: WeaponDef[] = [
  // Semplici da mischia
  w({ id: "club", name: "Randello", category: "simple", range: "melee", damage: "1d4", damageType: "bludgeoning", properties: ["light"], mastery: "Slow" }),
  w({ id: "dagger", name: "Pugnale", category: "simple", range: "melee", damage: "1d4", damageType: "piercing", properties: ["finesse", "light", "thrown"], mastery: "Nick", rangeFt: [20, 60] }),
  w({ id: "handaxe", name: "Ascia", category: "simple", range: "melee", damage: "1d6", damageType: "slashing", properties: ["light", "thrown"], mastery: "Vex", rangeFt: [20, 60] }),
  w({ id: "javelin", name: "Giavellotto", category: "simple", range: "melee", damage: "1d6", damageType: "piercing", properties: ["thrown"], mastery: "Slow", rangeFt: [30, 120] }),
  w({ id: "mace", name: "Mazza", category: "simple", range: "melee", damage: "1d6", damageType: "bludgeoning", properties: [], mastery: "Sap" }),
  w({ id: "quarterstaff", name: "Bastone ferrato", category: "simple", range: "melee", damage: "1d6", damageType: "bludgeoning", properties: ["versatile"], versatile: "1d8", mastery: "Topple" }),
  w({ id: "spear", name: "Lancia", category: "simple", range: "melee", damage: "1d6", damageType: "piercing", properties: ["thrown", "versatile"], versatile: "1d8", mastery: "Sap", rangeFt: [20, 60] }),
  // Semplici a distanza
  w({ id: "light-crossbow", name: "Balestra leggera", category: "simple", range: "ranged", damage: "1d8", damageType: "piercing", properties: ["ammunition", "loading", "two-handed"], mastery: "Slow", rangeFt: [80, 320] }),
  w({ id: "shortbow", name: "Arco corto", category: "simple", range: "ranged", damage: "1d6", damageType: "piercing", properties: ["ammunition", "two-handed"], mastery: "Vex", rangeFt: [80, 320] }),
  // Da guerra da mischia
  w({ id: "battleaxe", name: "Ascia da battaglia", category: "martial", range: "melee", damage: "1d8", damageType: "slashing", properties: ["versatile"], versatile: "1d10", mastery: "Topple" }),
  w({ id: "greataxe", name: "Ascia bipenne", category: "martial", range: "melee", damage: "1d12", damageType: "slashing", properties: ["heavy", "two-handed"], mastery: "Cleave" }),
  w({ id: "greatsword", name: "Spadone", category: "martial", range: "melee", damage: "2d6", damageType: "slashing", properties: ["heavy", "two-handed"], mastery: "Graze" }),
  w({ id: "longsword", name: "Spada lunga", category: "martial", range: "melee", damage: "1d8", damageType: "slashing", properties: ["versatile"], versatile: "1d10", mastery: "Sap" }),
  w({ id: "maul", name: "Maglio", category: "martial", range: "melee", damage: "2d6", damageType: "bludgeoning", properties: ["heavy", "two-handed"], mastery: "Topple" }),
  w({ id: "rapier", name: "Stocco", category: "martial", range: "melee", damage: "1d8", damageType: "piercing", properties: ["finesse"], mastery: "Vex" }),
  w({ id: "scimitar", name: "Scimitarra", category: "martial", range: "melee", damage: "1d6", damageType: "slashing", properties: ["finesse", "light"], mastery: "Nick" }),
  w({ id: "shortsword", name: "Spada corta", category: "martial", range: "melee", damage: "1d6", damageType: "piercing", properties: ["finesse", "light"], mastery: "Vex" }),
  w({ id: "warhammer", name: "Martello da guerra", category: "martial", range: "melee", damage: "1d8", damageType: "bludgeoning", properties: ["versatile"], versatile: "1d10", mastery: "Push" }),
  // Da guerra a distanza
  w({ id: "longbow", name: "Arco lungo", category: "martial", range: "ranged", damage: "1d8", damageType: "piercing", properties: ["ammunition", "heavy", "two-handed"], mastery: "Slow", rangeFt: [150, 600] }),
];

export const gear: GearDef[] = [
  { id: "explorers-pack", name: "Dotazione da esploratore", kind: "gear" },
];

export const MELEE_WEAPON_IDS = weapons.filter((x) => x.range === "melee").map((x) => x.id);
export const ALL_WEAPON_IDS = weapons.map((x) => x.id);

/** Strumenti usati dai background di questo pacchetto. */
export const GAMING_SETS = ["dice-set", "dragonchess-set", "playing-cards", "three-dragon-ante"];
