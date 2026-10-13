import { describe, expect, it } from "vitest";
import { srd } from "../../content-srd/src/index.js";
import {
  adjustResource,
  applyProposal,
  computeSheet,
  createCharacter,
  createRegistry,
  critDice,
  evalValue,
  longRest,
  seededRng,
  useAction,
  type AutomationLevel,
  type CharacterData,
  type ClassDef,
  type Condition,
  type ContentPack,
  type EvalContext,
} from "../src/index.js";

/* Classi di prova che usano le meccaniche di classe una per una. */

const UNARMORED: Condition = { all: [{ armor: "none" }, { shield: false }] };
const base = (id: string, name: string, extra: Partial<ClassDef>): ClassDef => ({
  id,
  name,
  hitDie: "d8",
  primaryAbility: ["dex", "cha"],
  proficiencies: { saves: ["str", "dex"], weapons: ["simple"] },
  multiclassProficiencies: {},
  skillChoice: { count: 0, from: [] },
  subclassLevel: 3,
  features: [],
  ...extra,
});
const asi = (level: number) => ({
  id: `t-monk.asi-${level}`,
  name: "Aumento dei punteggi",
  level,
  choices: [{ id: `t-monk.asi-${level}`, kind: "feat" as const, label: `Talento (livello ${level})`, count: 1, from: { tag: "general" } }],
});

const pack: ContentPack = {
  id: "test-mechanics",
  name: "Prova",
  classes: [
    base("t-monk", "Monaco di prova", {
      features: [
        {
          id: "t-monk.martial-arts",
          name: "Arti marziali",
          level: 1,
          effects: [
            { type: "martialArts", die: { table: { by: "t-monk", values: [6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 12] } }, when: UNARMORED },
            { type: "acFormula", value: { sum: [10, { mod: "dex" }, { mod: "wis" }] }, when: UNARMORED },
            { type: "bonus", target: "initiative", value: 1, when: { not: { feature: "feat.alert" } }, label: "Riflessi" },
            { type: "bonus", target: "ac", value: 1, when: { minLevel: { by: "t-monk", level: 10 } }, label: "Maestro" },
          ],
          dice: [{ id: "sneak", name: "Colpo furtivo", dice: { count: { div: [{ level: "t-monk" }, 2], round: "up" }, sides: 6 }, note: "Una volta per turno" }],
          resources: [{ id: "touch", name: "Tocco curativo", max: { times: [{ level: "t-monk" }, 5] }, longRest: "all" }],
          actions: [{ id: "touch.use", name: "Tocco curativo", timing: "bonus", cost: { resource: "touch", amount: 1, variable: true }, outcome: { kind: "heal" } }],
        },
        {
          id: "t-monk.movement",
          name: "Movimento senza armatura",
          level: 2,
          effects: [{ type: "bonus", target: "speed.walk", value: 10, when: UNARMORED }],
          choices: [{ id: "t-monk.expertise", kind: "expertise", label: "Maestria", count: 2 }],
        },
        { id: "t-monk.radiant", name: "Pugni radiosi", level: 3, effects: [{ type: "damageDice", on: "unarmed", dice: "1d4", damageType: "radiant" }] },
        asi(4),
        { id: "t-monk.extra-attack", name: "Attacco extra", level: 5, effects: [{ type: "extraAttack", attacks: 2 }] },
        {
          id: "t-monk.wings",
          name: "Ali",
          level: 6,
          effects: [
            { type: "speed", mode: "fly", value: "walk" },
            { type: "grant", target: "conditionImmunity", values: ["frightened"] },
            { type: "bonus", target: "skill.unproficient", value: { prof: 0.5 }, label: "Factotum" },
          ],
        },
        asi(8),
        {
          id: "t-monk.perfect",
          name: "Corpo perfetto",
          level: 20,
          effects: [
            { type: "bonus", target: "ability.dex", value: 4 },
            { type: "abilityMax", ability: "dex", value: 25 },
          ],
        },
      ],
    }),
    base("t-sorc", "Stregone di prova", {
      spellcasting: { ability: "cha", progression: "full", list: "t-sorc", prepared: [2, 3, 4, 5, 6] },
      features: [
        {
          id: "t-sorc.font",
          name: "Fonte di magia",
          level: 1,
          resources: [
            { id: "sp", name: "Punti stregoneria", max: { level: "t-sorc" }, longRest: "all" },
            { id: "recovery", name: "Recupero", max: 1, longRest: "all" },
          ],
          actions: [
            { id: "sp.to-slot", name: "Crea slot", timing: "bonus", outcome: { kind: "resourceToSlot", resource: "sp", costs: [2, 3, 5, 6, 7] } },
            { id: "sp.from-slot", name: "Converti slot", timing: "free", outcome: { kind: "slotToResource", resource: "sp" } },
            {
              id: "recovery.use",
              name: "Recupero",
              timing: "special",
              cost: { resource: "recovery", amount: 1 },
              outcome: { kind: "recoverSlots", budget: { div: [{ level: "t-sorc" }, 2], round: "up" }, maxLevel: 5 },
            },
          ],
        },
      ],
    }),
    base("t-lock", "Fattucchiere di prova", {
      spellcasting: { ability: "cha", progression: "pact", list: "t-sorc", prepared: [2] },
      features: [
        { id: "t-lock.cunning", name: "Astuzia", level: 1, actions: [{ id: "cunning.use", name: "Astuzia", timing: "special", outcome: { kind: "recoverPact", fraction: 0.5 } }] },
      ],
    }),
  ],
  feats: [
    {
      id: "asi",
      name: "Aumento dei punteggi di caratteristica",
      category: "general",
      repeatable: true,
      feature: { id: "feat.asi", name: "Aumento dei punteggi", choices: [{ id: "abilities", kind: "abilityBoost", label: "Aumento dei punteggi", count: 2, repeat: true }] },
    },
    {
      id: "t-boon",
      name: "Dono epico di prova",
      category: "general",
      prerequisites: { minLevel: { by: "total", level: 19 } },
      feature: { id: "feat.t-boon", name: "Dono epico", choices: [{ id: "t-boon.ability", kind: "abilityBoost", label: "Dono epico", count: 1, max: 30 }] },
    },
    { id: "t-trick", name: "Trucco di prova", category: "general", prerequisites: { features: ["t-monk.wings"] }, feature: { id: "feat.t-trick", name: "Trucco" } },
  ],
  spells: [
    { id: "t-bolt", name: "Saetta", level: 1, school: "evocation", castingTime: "Azione", range: "18 m", components: "V", duration: "Istantanea", lists: ["t-sorc"], description: "" },
    { id: "t-other", name: "Altro", level: 1, school: "evocation", castingTime: "Azione", range: "18 m", components: "V", duration: "Istantanea", lists: ["altrove"], description: "" },
    { id: "t-big", name: "Grosso", level: 3, school: "evocation", castingTime: "Azione", range: "18 m", components: "V", duration: "Istantanea", lists: ["t-sorc"], description: "" },
  ],
};

const reg = createRegistry(srd, pack);
const sheetOf = (ch: CharacterData) => computeSheet(ch, reg);
const codes = (ch: CharacterData) => sheetOf(ch).issues.filter((i) => i.severity === "error").map((i) => i.code);
const times = (classId: string, n: number) => Array.from({ length: n }, () => classId);

/** For 10, Des 16, Sag 14, Car 16. */
function make(classId: string, level = 1, patch: Partial<CharacterData> = {}, automation: AutomationLevel = "full"): CharacterData {
  const ch = createCharacter(
    {
      id: "t",
      name: "Prova",
      speciesId: "dwarf",
      backgroundId: "soldier",
      classId,
      abilityScores: { str: 10, dex: 14, con: 12, int: 10, wis: 14, cha: 16 },
      backgroundBoosts: { dex: 2, con: 1 },
      automation,
    },
    reg,
  );
  return { ...ch, levels: times(classId, level).map((id) => ({ classId: id, hp: "avg" as const })), ...patch };
}
const equip = (ch: CharacterData, ...ids: string[]): CharacterData => ({ ...ch, equipment: ids.map((itemId) => ({ itemId, equipped: true })) });
const attack = (ch: CharacterData, id: string) => sheetOf(ch).attacks.find((a) => a.itemId === id)!;

describe("Colpo senz'armi e Arti Marziali", () => {
  it("chiunque ha il colpo senz'armi: 1 + Forza", () => {
    const fighter = attack(make("fighter"), "unarmed");
    expect(fighter).toMatchObject({ name: "Colpo senz'armi", ability: "str", damage: "1", unarmed: true });
    expect(fighter.toHit.value).toBe(2);
    const weak = make("fighter", 1, { abilityScores: { str: 6, dex: 14, con: 12, int: 10, wis: 14, cha: 16 } });
    expect(attack(weak, "unarmed").damage).toBe("0");
  });

  it("le armi restano prima del colpo senz'armi", () => {
    expect(sheetOf(equip(make("fighter"), "longsword")).attacks.map((a) => a.itemId)).toEqual(["longsword", "unarmed"]);
  });

  it("Arti Marziali: Destrezza e dado, che cresce con il livello", () => {
    const u = attack(make("t-monk"), "unarmed");
    expect(u).toMatchObject({ ability: "dex", damage: "1d6+3" });
    expect(u.toHit.value).toBe(5);
    expect(attack(make("t-monk", 5), "unarmed").damage).toBe("1d8+3");
    expect(attack(make("t-monk", 17), "unarmed").damage).toBe("1d12+3");
  });

  it("armi da monaco: Destrezza e dado migliore; le altre armi no", () => {
    const ch = equip(make("t-monk"), "dagger", "handaxe", "longsword");
    expect(attack(ch, "dagger").damage).toBe("1d6+3"); // 1d4 → 1d6
    expect(attack(ch, "handaxe")).toMatchObject({ ability: "dex", damage: "1d6+3" });
    expect(attack(ch, "longsword")).toMatchObject({ ability: "str", damage: "1d8" });
  });

  it("con l'armatura le Arti Marziali non valgono", () => {
    const ch = equip(make("t-monk"), "leather", "dagger");
    expect(attack(ch, "unarmed")).toMatchObject({ ability: "str", damage: "1" });
    expect(attack(ch, "dagger").damage).toBe("1d4+3"); // resta accurata
    expect(sheetOf(ch).ac.value).toBe(14);
    expect(sheetOf(make("t-monk")).ac.value).toBe(15);
  });

  it("dadi in più a ogni colpo solo sugli attacchi indicati", () => {
    const ch = equip(make("t-monk", 3), "handaxe");
    expect(attack(ch, "unarmed").extraDamage).toEqual([{ label: "Pugni radiosi", dice: "1d4", damageType: "radiant" }]);
    expect(attack(ch, "handaxe").extraDamage).toEqual([]);
  });
});

describe("Attacco Extra, dadi con nome, velocità", () => {
  it("attacchi per azione", () => {
    expect(sheetOf(make("t-monk", 4)).attacksPerAction).toBe(1);
    expect(sheetOf(make("t-monk", 5)).attacksPerAction).toBe(2);
  });

  it("i dadi con nome crescono con il livello", () => {
    const sneak = (n: number) => sheetOf(make("t-monk", n)).dice.find((d) => d.id === "sneak")!.expr;
    expect([sneak(1), sneak(5), sneak(20)]).toEqual(["1d6", "3d6", "10d6"]);
  });

  it("volo pari alla camminata, immunità alle condizioni", () => {
    const s = sheetOf(make("t-monk", 6));
    expect(s.speed.value).toBe(40);
    expect(s.speeds).toEqual({ fly: 40 });
    expect(s.conditionImmunities).toEqual(["frightened"]);
    expect(sheetOf(make("t-monk", 5)).speeds).toEqual({});
  });

  it("bonus solo alle abilità senza competenza", () => {
    const s = sheetOf(make("t-monk", 6));
    expect(s.skills.stealth!.mod.value).toBe(3 + 1); // metà competenza, per difetto
    expect(s.skills.athletics!.mod.value).toBe(0 + 3);
  });

  it("condizioni su privilegi posseduti e sul livello", () => {
    expect(sheetOf(make("t-monk")).initiative.value).toBe(3 + 1);
    const alert = { ...make("t-monk"), backgroundId: "criminal" };
    expect(sheetOf(alert).initiative.value).toBe(3 + 2);
    expect(sheetOf(make("t-monk", 9)).ac.value).toBe(15);
    expect(sheetOf(make("t-monk", 10)).ac.value).toBe(16);
  });
});

describe("Aumenti di caratteristica e talenti", () => {
  const withAsi = (level: number, choices: Record<string, string[]>, patch: Partial<CharacterData> = {}) => make("t-monk", level, { choices, ...patch });

  it("scelto il talento, compare la scelta dei punteggi", () => {
    const s = sheetOf(withAsi(4, { "t-monk.asi-4": ["asi"] }));
    expect(s.pendingChoices.map((c) => [c.id, c.required])).toContainEqual(["t-monk.asi-4/abilities", 2]);
  });

  it("+2 a una caratteristica oppure +1 a due; lo stesso talento a livelli diversi", () => {
    const ch = withAsi(8, {
      "t-monk.asi-4": ["asi"],
      "t-monk.asi-4/abilities": ["dex", "dex"],
      "t-monk.asi-8": ["asi"],
      "t-monk.asi-8/abilities": ["dex", "wis"],
    });
    const s = sheetOf(ch);
    expect(s.abilities.dex.score.value).toBe(19);
    expect(s.abilities.wis.score.value).toBe(15);
    expect(s.features.map((f) => f.id)).toEqual(expect.arrayContaining(["feat.asi@t-monk.asi-4", "feat.asi@t-monk.asi-8"]));
    expect(codes(ch)).toEqual([]);
  });

  it("tetto a 20 per gli aumenti; i privilegi possono superarlo", () => {
    const scores = { str: 10, dex: 17, con: 12, int: 10, wis: 14, cha: 16 }; // 19 con il background
    const choices = { "t-monk.asi-4": ["asi"], "t-monk.asi-4/abilities": ["dex", "dex"] };
    const at4 = sheetOf(withAsi(4, choices, { abilityScores: scores }));
    expect(at4.abilities.dex.score.value).toBe(20);
    expect(at4.abilities.dex.score.parts.map((p) => p.label)).toContain("Massimo 20");
    expect(sheetOf(withAsi(20, choices, { abilityScores: scores })).abilities.dex.score.value).toBe(24);
  });

  it("un Dono Epico porta oltre il 20", () => {
    const scores = { str: 10, dex: 18, con: 12, int: 10, wis: 14, cha: 16 };
    const ch = withAsi(19, { "t-monk.asi-4": ["t-boon"], "t-boon.ability": ["dex"] }, { abilityScores: scores });
    expect(sheetOf(ch).abilities.dex.score.value).toBe(21);
  });

  it("prerequisiti dei talenti: livello e privilegi", () => {
    expect(codes(withAsi(4, { "t-monk.asi-4": ["t-boon"] }))).toContain("feat.prerequisite");
    expect(codes(withAsi(4, { "t-monk.asi-4": ["t-trick"] }))).toContain("feat.prerequisite");
    expect(codes(withAsi(6, { "t-monk.asi-4": ["t-trick"] }))).not.toContain("feat.prerequisite");
  });

  it("maestria: raddoppia la competenza, e la richiede", () => {
    const ok = make("t-monk", 2, { choices: { "t-monk.expertise": ["athletics", "intimidation"] } });
    expect(sheetOf(ok).skills.athletics).toMatchObject({ expertise: true });
    expect(sheetOf(ok).skills.athletics!.mod.value).toBe(4);
    expect(codes(ok)).toEqual([]);
    expect(codes(make("t-monk", 2, { choices: { "t-monk.expertise": ["athletics", "stealth"] } }))).toContain("expertise.unproficient");
  });
});

describe("Risorse a quantità variabile", () => {
  it("si spende quanto si sceglie e si cura di altrettanto", () => {
    const ch = make("t-monk", 2);
    const hurt = { ...ch, state: { ...ch.state, hpCurrent: 1 } };
    expect(sheetOf(hurt).resources.find((r) => r.id === "touch")!.max).toBe(10);
    const p = useAction(hurt, reg, "touch.use", seededRng(1), { amount: 4 });
    expect(p.blocked).toBeUndefined();
    expect(p.state.hpCurrent).toBe(5);
    expect(p.state.resourcesSpent.touch).toBe(4);
    expect(useAction(hurt, reg, "touch.use", seededRng(1), { amount: 11 }).blocked).toBeTruthy();
  });

  it("regolazione a mano, entro i limiti", () => {
    const ch = make("t-monk", 2);
    const spent = applyProposal(ch, adjustResource(ch, sheetOf(ch), "touch", -3));
    expect(spent.state.resourcesSpent.touch).toBe(3);
    expect(adjustResource(spent, sheetOf(spent), "touch", 50).state.resourcesSpent.touch).toBe(0);
    expect(adjustResource(spent, sheetOf(spent), "touch", -8).blocked).toBeTruthy();
  });
});

describe("Slot e risorse", () => {
  const sorc = (state: Partial<CharacterData["state"]> = {}) => {
    const ch = make("t-sorc", 5);
    return { ...ch, state: { ...ch.state, ...state } };
  };
  const slotsOf = (ch: CharacterData) => sheetOf(ch).spellcasting!.slots.map((s) => [s.max, s.spent]);

  it("creare uno slot: rimpiazza uno speso, altrimenti è in più fino al riposo lungo", () => {
    const fresh = sorc();
    const extra = applyProposal(fresh, useAction(fresh, reg, "sp.to-slot", seededRng(1), { slotLevel: 1 }));
    expect(extra.state.resourcesSpent.sp).toBe(2);
    expect(slotsOf(extra)[0]).toEqual([5, 0]);
    expect(slotsOf(applyProposal(extra, longRest(extra, reg)))[0]).toEqual([4, 0]);

    const used = sorc({ spellSlotsSpent: { "1": 2 } });
    expect(slotsOf(applyProposal(used, useAction(used, reg, "sp.to-slot", seededRng(1), { slotLevel: 1 })))[0]).toEqual([4, 1]);
  });

  it("creare uno slot: costo per livello e controlli", () => {
    expect(useAction(sorc(), reg, "sp.to-slot", seededRng(1), { slotLevel: 3 }).state.resourcesSpent.sp).toBe(5);
    expect(useAction(sorc(), reg, "sp.to-slot", seededRng(1), { slotLevel: 4 }).blocked).toMatch(/costa 6/);
    expect(useAction(sorc(), reg, "sp.to-slot").blocked).toBeTruthy();
  });

  it("convertire uno slot in punti, senza superare il massimo", () => {
    const p = useAction(sorc({ resourcesSpent: { sp: 5 } }), reg, "sp.from-slot", seededRng(1), { slotLevel: 2 });
    expect(p.state.resourcesSpent.sp).toBe(3);
    expect(p.state.spellSlotsSpent).toEqual({ "2": 1 });
    expect(useAction(sorc({ resourcesSpent: { sp: 1 } }), reg, "sp.from-slot", seededRng(1), { slotLevel: 2 }).state.resourcesSpent.sp).toBe(0);
    expect(useAction(sorc(), reg, "sp.from-slot", seededRng(1), { slotLevel: 4 }).blocked).toBeTruthy();
  });

  it("recuperare slot a scelta entro il budget", () => {
    const spent = sorc({ spellSlotsSpent: { "1": 2, "2": 1, "3": 1 } });
    const p = useAction(spent, reg, "recovery.use", seededRng(1), { slots: { "1": 1, "2": 1 } });
    expect(p.blocked).toBeUndefined();
    expect(p.state.spellSlotsSpent).toEqual({ "1": 1, "2": 0, "3": 1 });
    expect(p.state.resourcesSpent.recovery).toBe(1);
    expect(useAction(spent, reg, "recovery.use", seededRng(1), { slots: { "3": 1, "1": 1 } }).blocked).toMatch(/3 livelli/);
    expect(useAction(spent, reg, "recovery.use", seededRng(1), { slots: { "2": 2 } }).blocked).toBeTruthy();
    expect(useAction(spent, reg, "recovery.use").blocked).toBeTruthy();
  });

  it("recuperare metà degli slot del Patto, per eccesso", () => {
    const lock = (level: number, spent: number) => {
      const ch = make("t-lock", level);
      return useAction({ ...ch, state: { ...ch.state, pactSlotsSpent: spent } }, reg, "cunning.use");
    };
    expect(lock(5, 2).state.pactSlotsSpent).toBe(1);
    expect(lock(11, 3).state.pactSlotsSpent).toBe(1);
    expect(lock(5, 0).blocked).toBeTruthy();
  });
});

describe("Incantesimi scelti da un privilegio", () => {
  const gift = {
    id: "gift",
    name: "Iniziato",
    choices: [
      { id: "gift.ability", kind: "custom" as const, label: "Caratteristica", count: 1, from: ["int", "wis", "cha"] },
      { id: "gift.spell", kind: "spell" as const, label: "Incantesimo", count: 1, spell: { list: "t-sorc", level: 1, abilityFrom: "gift.ability" } },
    ],
  };
  const withGift = (spell: string) => make("fighter", 1, { customFeatures: [gift], choices: { "gift.ability": ["wis"], "gift.spell": [spell] } });

  it("diventano sempre preparati, con la caratteristica scelta", () => {
    expect(sheetOf(withGift("t-bolt")).spellcasting!.spells[0]).toMatchObject({ spellId: "t-bolt", ability: "wis", always: true });
    expect(codes(withGift("t-bolt"))).not.toContain("choice.invalid");
  });

  it("fuori lista o di livello sbagliato: errore", () => {
    expect(codes(withGift("t-other"))).toContain("choice.invalid");
    expect(codes(withGift("t-big"))).toContain("choice.invalid");
  });
});

describe("Valori e dadi", () => {
  const ctx: EvalContext = {
    mods: { str: 0, dex: 3, con: 1, int: 0, wis: 2, cha: 3 },
    scores: { str: 10, dex: 16, con: 12, int: 10, wis: 14, cha: 16 },
    proficiencyBonus: 3,
    totalLevel: 5,
    classLevels: { x: 5 },
    toggles: {},
    conditions: [],
    armor: "none",
    shield: false,
  };

  it("moltiplicazione e divisione", () => {
    expect(evalValue({ times: [{ level: "x" }, 5] }, ctx)).toBe(25);
    expect(evalValue({ div: [{ level: "x" }, 2] }, ctx)).toBe(2);
    expect(evalValue({ div: [{ level: "x" }, 2], round: "up" }, ctx)).toBe(3);
  });

  it("critico: raddoppiano i dadi, non i bonus", () => {
    expect(critDice("1d8+3")).toBe("2d8+3");
    expect(critDice("2d6+1d4-1")).toBe("4d6+2d4-1");
    expect(critDice("4")).toBe("4");
  });
});
