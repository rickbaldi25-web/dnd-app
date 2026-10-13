import { describe, expect, it } from "vitest";
import { srd } from "../../content-srd/src/index.js";
import {
  applyDamage,
  applyProposal,
  castSpell,
  computeSheet,
  createCharacter,
  createRegistry,
  endConcentration,
  longRest,
  seededRng,
  shortRest,
  spellDice,
  type AutomationLevel,
  type CharacterData,
  type ClassDef,
  type ContentPack,
  type SpellDef,
} from "../src/index.js";

/* Classi e incantesimi di prova: le classi vere arrivano nel pacchetto SRD. */

const caster = (id: string, name: string, extra: Partial<ClassDef>): ClassDef => ({
  id,
  name,
  hitDie: "d8",
  primaryAbility: ["int", "cha"],
  proficiencies: { saves: ["int", "wis"] },
  multiclassProficiencies: {},
  skillChoice: { count: 0, from: [] },
  subclassLevel: 3,
  features: [],
  ...extra,
});

const spell = (id: string, name: string, level: number, lists: string[], extra: Partial<SpellDef> = {}): SpellDef => ({
  id,
  name,
  level,
  school: "evocation",
  castingTime: "Azione",
  range: "18 m",
  components: "V, S",
  duration: "Istantanea",
  lists,
  description: "",
  ...extra,
});

const testPack: ContentPack = {
  id: "test",
  name: "Prova",
  classes: [
    caster("t-mage", "Mago di prova", {
      spellcasting: { ability: "int", progression: "full", list: "t-mage", cantrips: [3, 3, 3, 4], prepared: [4, 5, 6, 7, 9, 10, 11], spellbook: true },
    }),
    caster("t-knight", "Cavaliere di prova", {
      spellcasting: { ability: "cha", progression: "half", list: "t-knight", prepared: [2, 3, 4, 5, 6] },
      features: [
        {
          id: "t-knight.oath",
          name: "Giuramento di prova",
          level: 1,
          spells: [{ spellId: "bless" }, { spellId: "fireball", minLevel: { by: "t-knight", level: 9 } }],
        },
      ],
    }),
    caster("t-pact", "Fattucchiere di prova", {
      spellcasting: { ability: "cha", progression: "pact", list: "t-pact", cantrips: [2], prepared: [2, 3, 4, 5] },
    }),
  ],
  subclasses: [
    {
      id: "fighter.t-eldritch",
      classId: "fighter",
      name: "Cavaliere mistico di prova",
      spellcasting: { ability: "int", progression: "third", list: "t-mage", cantrips: [0, 0, 2], prepared: [0, 0, 3, 4], fromLevel: 3 },
      features: [],
    },
  ],
  spells: [
    spell("fire-bolt", "Dardo di fuoco", 0, ["t-mage"], { attack: "ranged", roll: { kind: "damage", dice: "1d10", damageType: "fuoco", cantripScaling: true } }),
    spell("light", "Luce", 0, ["t-mage"]),
    spell("eldritch-blast", "Deflagrazione occulta", 0, ["t-pact"], { attack: "ranged", roll: { kind: "damage", dice: "1d10", damageType: "forza" } }),
    spell("magic-missile", "Dardo incantato", 1, ["t-mage"], { roll: { kind: "damage", dice: "3d4+3", damageType: "forza", perSlotLevel: "1d4+1" } }),
    spell("detect-magic", "Individuazione del magico", 1, ["t-mage", "t-knight"], { ritual: true, concentration: true, duration: "fino a 10 minuti" }),
    spell("cure-wounds", "Cura ferite", 1, ["t-knight"], { roll: { kind: "heal", dice: "2d8", addMod: true, perSlotLevel: "2d8" } }),
    spell("bless", "Benedizione", 1, ["t-knight"], { concentration: true, duration: "fino a 1 minuto" }),
    spell("hex", "Sortilegio", 1, ["t-pact"], { concentration: true, duration: "fino a 1 ora" }),
    spell("hold-person", "Blocca persone", 2, ["t-mage", "t-pact"], { save: "wis", concentration: true, duration: "fino a 1 minuto" }),
    spell("fireball", "Palla di fuoco", 3, ["t-mage"], { save: "dex", roll: { kind: "damage", dice: "8d6", damageType: "fuoco", perSlotLevel: "1d6" } }),
  ],
};

const reg = createRegistry(srd, testPack);
const sheetOf = (ch: CharacterData) => computeSheet(ch, reg);
const errors = (ch: CharacterData) => sheetOf(ch).issues.filter((i) => i.severity === "error" && i.code.startsWith("spell")).map((i) => i.code);

/** Int 16, Car 16: CD 13 e +5 a colpire al livello 1 con entrambe. */
function make(levels: string[], patch: Partial<CharacterData> = {}, automation: AutomationLevel = "full"): CharacterData {
  const ch = createCharacter(
    {
      id: "t",
      name: "Prova",
      speciesId: "dwarf",
      backgroundId: "soldier",
      classId: levels[0]!,
      abilityScores: { str: 13, dex: 12, con: 13, int: 16, wis: 10, cha: 16 },
      backgroundBoosts: { str: 2, con: 1 },
      automation,
    },
    reg,
  );
  return { ...ch, levels: levels.map((classId) => ({ classId, hp: "avg" as const })), ...patch };
}
const times = (classId: string, n: number) => Array.from({ length: n }, () => classId);
const mageSpells = { "t-mage": { cantrips: ["fire-bolt", "light"], prepared: ["magic-missile", "detect-magic"] } };

describe("Incantatore pieno", () => {
  it("livello 1: slot, CD, tiro per colpire, quanti incantesimi", () => {
    const sc = sheetOf(make(["t-mage"], { spells: mageSpells })).spellcasting!;
    expect(sc.slots).toEqual([{ level: 1, max: 2, spent: 0, remaining: 2 }]);
    const src = sc.sources[0]!;
    expect(src).toMatchObject({ id: "t-mage", ability: "int", cantripsMax: 3, preparedMax: 4, maxSpellLevel: 1 });
    expect(src.saveDC.value).toBe(13);
    expect(src.attackBonus.value).toBe(5);
    expect(sc.spells.map((s) => s.spellId)).toEqual(["fire-bolt", "light", "magic-missile", "detect-magic"]);
    expect(sc.spells[0]).toMatchObject({ attackBonus: 5, roll: "1d10" });
  });

  it("gli slot crescono con il livello; al 20 la tabella completa", () => {
    expect(sheetOf(make(times("t-mage", 5))).spellcasting!.slots.map((s) => s.max)).toEqual([4, 3, 2]);
    expect(sheetOf(make(times("t-mage", 20))).spellcasting!.slots.map((s) => s.max)).toEqual([4, 3, 3, 3, 3, 2, 2, 1, 1]);
  });

  it("chi non lancia incantesimi non ha la sezione", () => {
    expect(sheetOf(make(["fighter"])).spellcasting).toBeUndefined();
  });

  it("i trucchetti crescono ai livelli 5, 11 e 17", () => {
    const at = (n: number) => sheetOf(make(times("t-mage", n), { spells: mageSpells })).spellcasting!.spells.find((s) => s.spellId === "fire-bolt")!.roll;
    expect([at(4), at(5), at(11), at(17)]).toEqual(["1d10", "2d10", "3d10", "4d10"]);
  });

  it("Indebolimento: penalità al tiro per colpire, non alla CD", () => {
    const ch = make(["t-mage"]);
    const src = sheetOf({ ...ch, state: { ...ch.state, exhaustion: 1 } }).spellcasting!.sources[0]!;
    expect(src.attackBonus.value).toBe(3);
    expect(src.saveDC.value).toBe(13);
  });
});

describe("Lanciare un incantesimo", () => {
  it("spende lo slot più basso e tira i danni", () => {
    const ch = make(times("t-mage", 3), { spells: mageSpells });
    const p = castSpell(ch, reg, "magic-missile", {}, seededRng(1));
    expect(p.blocked).toBeUndefined();
    expect(p.state.spellSlotsSpent).toEqual({ "1": 1 });
    expect(p.rolls[0]!.expr).toBe("3d4+3");
  });

  it("a slot superiore: più dadi e slot giusto", () => {
    const ch = make(times("t-mage", 3), { spells: mageSpells });
    const p = castSpell(ch, reg, "magic-missile", { slotLevel: 2 }, seededRng(1));
    expect(p.title).toContain("2°");
    expect(p.state.spellSlotsSpent).toEqual({ "2": 1 });
    expect(p.rolls[0]!.expr).toBe("4d4+4");
  });

  it("finiti gli slot di 1° passa da solo a quelli di 2°", () => {
    const ch = make(times("t-mage", 3), { spells: mageSpells });
    const spent = { ...ch, state: { ...ch.state, spellSlotsSpent: { "1": 4 } } };
    expect(castSpell(spent, reg, "magic-missile").state.spellSlotsSpent).toEqual({ "1": 4, "2": 1 });
  });

  it("senza slot: bloccato in completa, solo avviso in assistita", () => {
    const ch = make(["t-mage"], { spells: mageSpells });
    const empty = { ...ch, state: { ...ch.state, spellSlotsSpent: { "1": 2 } } };
    expect(castSpell(empty, reg, "magic-missile").blocked).toBeTruthy();
    const assisted = castSpell({ ...empty, settings: { automation: "assisted" } }, reg, "magic-missile");
    expect(assisted.blocked).toBeUndefined();
    expect(assisted.lines.join(" ")).toContain("Attenzione");
  });

  it("i trucchetti non spendono slot e tirano per colpire", () => {
    const ch = make(["t-mage"], { spells: mageSpells });
    const p = castSpell(ch, reg, "fire-bolt", {}, seededRng(3));
    expect(p.state.spellSlotsSpent).toEqual({});
    expect(p.rolls.map((r) => r.label)).toEqual(["Tiro per colpire", "Danni (fuoco)"]);
    expect(p.rolls[0]!.expr).toBe("1d20+5");
  });

  it("tiro salvezza: la scheda indica caratteristica e CD", () => {
    const ch = make(times("t-mage", 5), { spells: { "t-mage": { cantrips: [], prepared: ["fireball"] } } });
    const p = castSpell(ch, reg, "fireball", {}, seededRng(2));
    expect(p.lines.join(" ")).toContain("Destrezza, CD 14");
    expect(p.rolls[0]!.expr).toBe("8d6");
  });

  it("rituale: nessuno slot", () => {
    const ch = make(["t-mage"], { spells: mageSpells });
    expect(castSpell(ch, reg, "detect-magic", { ritual: true }).state.spellSlotsSpent).toEqual({});
    expect(castSpell(ch, reg, "magic-missile", { ritual: true }).blocked).toBeTruthy();
  });

  it("in manuale tira i dadi ma non tocca la scheda", () => {
    const ch = make(times("t-mage", 3), { spells: mageSpells }, "manual");
    const p = castSpell(ch, reg, "magic-missile", { slotLevel: 2 }, seededRng(1));
    expect(p.state).toBe(ch.state);
    expect(p.rolls[0]!.expr).toBe("4d4+4");
  });

  it("un incantesimo non preparato non si può lanciare", () => {
    expect(() => castSpell(make(["t-mage"]), reg, "fireball")).toThrow();
  });
});

describe("Concentrazione", () => {
  const ch = make(times("t-mage", 3), { spells: { "t-mage": { cantrips: [], prepared: ["detect-magic", "hold-person"] } } });

  it("un nuovo incantesimo a concentrazione sostituisce il precedente", () => {
    const a = applyProposal(ch, castSpell(ch, reg, "detect-magic"));
    expect(sheetOf(a).spellcasting!.concentration).toEqual({ spellId: "detect-magic", name: "Individuazione del magico" });
    const p = castSpell(a, reg, "hold-person");
    expect(p.lines.join(" ")).toContain("Termina la concentrazione su Individuazione del magico");
    expect(p.state.concentration?.spellId).toBe("hold-person");
  });

  it("subire danni chiede il TS; a 0 PF la concentrazione cade", () => {
    const a = applyProposal(ch, castSpell(ch, reg, "detect-magic"));
    const hit = applyDamage(a, sheetOf(a), 3);
    expect(hit.lines.join(" ")).toContain("CD 10");
    expect(hit.state.concentration).not.toBeNull();
    const down = applyDamage(a, sheetOf(a), a.state.hpCurrent);
    expect(down.state.concentration).toBeNull();
  });

  it("si può terminare a mano e il riposo lungo la azzera", () => {
    const a = applyProposal(ch, castSpell(ch, reg, "detect-magic"));
    expect(endConcentration(a).state.concentration).toBeNull();
    const rested = longRest(a, reg).state;
    expect(rested.concentration).toBeNull();
    expect(rested.spellSlotsSpent).toEqual({});
  });
});

describe("Mezzo incantatore e incantesimi sempre preparati", () => {
  it("slot dal livello 1, per eccesso", () => {
    const slots = (n: number) => sheetOf(make(times("t-knight", n))).spellcasting!.slots.map((s) => s.max);
    expect(slots(1)).toEqual([2]);
    expect(slots(4)).toEqual([3]);
    expect(slots(5)).toEqual([4, 2]);
    expect(slots(20)).toEqual([4, 3, 3, 3, 2]);
  });

  it("gli incantesimi del giuramento non contano tra i preparati", () => {
    const ch = make(times("t-knight", 2), { spells: { "t-knight": { cantrips: [], prepared: ["cure-wounds", "detect-magic", "bless"] } } });
    const s = sheetOf(ch);
    const bless = s.spellcasting!.spells.filter((x) => x.spellId === "bless");
    expect(bless).toHaveLength(1);
    expect(bless[0]!.always).toBe(true);
    expect(s.issues.map((i) => i.code)).toContain("spells.redundant");
    expect(errors(ch)).toEqual([]);
  });

  it("gli incantesimi concessi rispettano il livello minimo", () => {
    const has = (n: number) => sheetOf(make(times("t-knight", n))).spellcasting!.spells.some((x) => x.spellId === "fireball");
    expect(has(8)).toBe(false);
    expect(has(9)).toBe(true);
  });

  it("la cura aggiunge il modificatore e raddoppia i dadi a slot superiore", () => {
    const ch = make(times("t-knight", 5), { spells: { "t-knight": { cantrips: [], prepared: ["cure-wounds"] } } });
    expect(castSpell(ch, reg, "cure-wounds", {}, seededRng(4)).rolls[0]).toMatchObject({ label: "Cura", expr: "2d8+3" });
    expect(castSpell(ch, reg, "cure-wounds", { slotLevel: 2 }, seededRng(4)).rolls[0]!.expr).toBe("4d8+3");
  });
});

describe("Magia del Patto", () => {
  const pactSpells = { "t-pact": { cantrips: ["eldritch-blast"], prepared: ["hex", "hold-person"] } };

  it("pochi slot, tutti dello stesso livello, separati da quelli normali", () => {
    const sc = sheetOf(make(times("t-pact", 3), { spells: pactSpells })).spellcasting!;
    expect(sc.slots).toEqual([]);
    expect(sc.pact).toEqual({ level: 2, max: 2, spent: 0, remaining: 2 });
    expect(sc.sources[0]!.maxSpellLevel).toBe(2);
    expect(sheetOf(make(times("t-pact", 17))).spellcasting!.pact).toMatchObject({ level: 5, max: 4 });
  });

  it("si lancia sempre al livello dello slot e torna con il riposo breve", () => {
    const ch = make(times("t-pact", 3), { spells: pactSpells });
    const p = castSpell(ch, reg, "hex");
    expect(p.title).toContain("2°");
    expect(p.state.pactSlotsSpent).toBe(1);
    const rested = shortRest(applyProposal(ch, p), reg);
    expect(rested.state.pactSlotsSpent).toBe(0);
    expect(rested.lines).toContain("Slot del Patto recuperati.");
  });

  it("finiti gli slot: bloccato in completa", () => {
    const ch = make(times("t-pact", 3), { spells: pactSpells });
    expect(castSpell({ ...ch, state: { ...ch.state, pactSlotsSpent: 2 } }, reg, "hex").blocked).toBeTruthy();
  });
});

describe("Multiclasse", () => {
  it("i livelli da incantatore si sommano in un'unica tabella", () => {
    const sc = sheetOf(make([...times("t-mage", 3), ...times("t-knight", 2)])).spellcasting!;
    expect(sc.slots.map((s) => s.max)).toEqual([4, 3]); // 3 + metà di 2 = 4
    expect(sc.sources.map((s) => [s.id, s.maxSpellLevel])).toEqual([
      ["t-mage", 2],
      ["t-knight", 1],
    ]);
  });

  it("con il Patto: prima gli slot normali, poi quelli del Patto", () => {
    const ch = make(["t-mage", "t-pact", "t-pact"], { spells: mageSpells });
    const sc = sheetOf(ch).spellcasting!;
    expect(sc.slots.map((s) => s.max)).toEqual([2]);
    expect(sc.pact).toMatchObject({ level: 1, max: 2 });
    const first = castSpell(ch, reg, "magic-missile");
    expect(first.state).toMatchObject({ spellSlotsSpent: { "1": 1 }, pactSlotsSpent: 0 });
    const empty = { ...ch, state: { ...ch.state, spellSlotsSpent: { "1": 2 } } };
    expect(castSpell(empty, reg, "magic-missile").state.pactSlotsSpent).toBe(1);
    expect(castSpell(ch, reg, "magic-missile", { pact: true }).state).toMatchObject({ spellSlotsSpent: {}, pactSlotsSpent: 1 });
  });
});

describe("Sottoclasse con incantesimi (un terzo)", () => {
  const knight = (n: number, extra: string[] = []) =>
    sheetOf(make([...times("fighter", n), ...extra], { subclasses: { fighter: "fighter.t-eldritch" } })).spellcasting;

  it("parte dal livello 3 e segue la tabella della sottoclasse", () => {
    expect(knight(2)).toBeUndefined();
    expect(knight(3)!.slots.map((s) => s.max)).toEqual([2]);
    expect(knight(4)!.slots.map((s) => s.max)).toEqual([3]);
    expect(knight(7)!.slots.map((s) => s.max)).toEqual([4, 2]);
    expect(knight(3)!.sources[0]).toMatchObject({ id: "fighter", ability: "int", cantripsMax: 2, preparedMax: 3 });
  });

  it("nel multiclasse conta un terzo per difetto", () => {
    expect(knight(4, ["t-mage"])!.slots.map((s) => s.max)).toEqual([3]); // 1 + 1 = 2
    expect(knight(5, ["t-mage"])!.slots.map((s) => s.max)).toEqual([3]); // 1 + 1 = 2
    expect(knight(6, ["t-mage"])!.slots.map((s) => s.max)).toEqual([4, 2]); // 2 + 1 = 3
  });
});

describe("Controlli sugli incantesimi scelti", () => {
  it("troppi, fuori lista, di livello troppo alto, trucchetto tra i preparati", () => {
    expect(errors(make(["t-mage"], { spells: { "t-mage": { cantrips: [], prepared: ["cure-wounds"] } } }))).toEqual(["spells.list"]);
    expect(errors(make(["t-mage"], { spells: { "t-mage": { cantrips: [], prepared: ["fireball"] } } }))).toEqual(["spells.level"]);
    expect(errors(make(["t-mage"], { spells: { "t-mage": { cantrips: [], prepared: ["light"] } } }))).toEqual(["spells.kind"]);
    expect(errors(make(["t-knight"], { spells: { "t-knight": { cantrips: [], prepared: ["cure-wounds", "detect-magic", "cure-wounds"] } } }))).toEqual([
      "spells.prepared.excess",
      "spells.duplicate",
    ]);
  });

  it("libro degli incantesimi: si prepara solo ciò che contiene", () => {
    const ch = make(["t-mage"], { spells: { "t-mage": { cantrips: [], prepared: ["magic-missile"], spellbook: ["detect-magic"] } } });
    expect(errors(ch)).toEqual(["spells.spellbook"]);
  });

  it("avvisa se restano incantesimi da scegliere; in manuale tace", () => {
    const ch = make(["t-mage"], { spells: mageSpells });
    expect(sheetOf(ch).issues.find((i) => i.code === "spells.pending")?.message).toContain("trucchetti 2/3, preparati 2/4");
    expect(sheetOf({ ...ch, settings: { automation: "manual" } }).issues).toEqual([]);
  });
});

describe("Incantesimi da privilegi senza classe (specie, talenti)", () => {
  const gift = {
    id: "gift",
    name: "Dono fatato",
    resources: [{ id: "gift", name: "Dono fatato", max: 1, longRest: "all" as const }],
    spells: [{ spellId: "detect-magic", ability: "wis" as const, resource: "gift" }],
  };

  it("usano la propria caratteristica e la risorsa al posto dello slot", () => {
    const ch = make(["fighter"], { customFeatures: [gift] });
    const sc = sheetOf(ch).spellcasting!;
    expect(sc.sources).toEqual([]);
    expect(sc.spells[0]).toMatchObject({ spellId: "detect-magic", ability: "wis", always: true, resource: "gift" });
    const p = castSpell(ch, reg, "detect-magic", { useResource: true });
    expect(p.blocked).toBeUndefined();
    expect(p.state.resourcesSpent.gift).toBe(1);
    expect(castSpell(applyProposal(ch, p), reg, "detect-magic", { useResource: true }).blocked).toBeTruthy();
  });
});

describe("Dadi degli incantesimi", () => {
  it("slot superiore con dadi diversi e bonus piatto", () => {
    const o = { spellLevel: 1, characterLevel: 1, mod: 3 };
    expect(spellDice({ kind: "damage", dice: "3d4+3", perSlotLevel: "1d4+1" }, { ...o, slotLevel: 3 })).toBe("5d4+5");
    expect(spellDice({ kind: "damage", dice: "2d8", perSlotLevel: "1d6" }, { ...o, slotLevel: 2 })).toBe("2d8+1d6");
    expect(spellDice({ kind: "heal", dice: "2d8", addMod: true }, o)).toBe("2d8+3");
  });
});
