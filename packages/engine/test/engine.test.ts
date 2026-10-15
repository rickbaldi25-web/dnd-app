import { describe, expect, it } from "vitest";
import {
  applyDamage,
  applyProposal,
  computeSheet,
  levelUp,
  longRest,
  parseDice,
  resolveAutomation,
  roll,
  seededRng,
  setTempHp,
  shortRest,
  useAction,
  type CharacterData,
} from "../src/index.js";
import { makeBarbarian, makeFighter, reg } from "./fixtures.js";

const sheetOf = (ch: CharacterData) => computeSheet(ch, reg);
const withState = (ch: CharacterData, patch: Partial<CharacterData["state"]>): CharacterData => ({
  ...ch,
  state: { ...ch.state, ...patch },
});
const equip = (ch: CharacterData, ...ids: string[]): CharacterData => ({
  ...ch,
  equipment: ids.map((itemId) => ({ itemId, equipped: true })),
});

describe("Barbaro nano soldato, liv. 1", () => {
  const ch = makeBarbarian();
  const s = sheetOf(ch);

  it("caratteristiche con i bonus del background 2024", () => {
    expect(s.abilities.str.score.value).toBe(17);
    expect(s.abilities.con.score.value).toBe(15);
    expect(s.abilities.str.mod).toBe(3);
  });

  it("PF: d12 pieno + Cos + Robustezza Nanica", () => {
    expect(s.hpMax.value).toBe(12 + 2 + 1);
    expect(ch.state.hpCurrent).toBe(15);
  });

  it("CA con Difesa Senza Armatura (10 + Des + Cos), anche con scudo", () => {
    expect(s.ac.value).toBe(13);
    expect(sheetOf(equip(ch, "shield")).ac.value).toBe(15);
  });

  it("competenze: TS, background, scelte di classe, passiva", () => {
    expect(s.proficiencyBonus).toBe(2);
    expect(s.saves.str.mod.value).toBe(5);
    expect(s.saves.str.proficient).toBe(true);
    expect(s.saves.dex.proficient).toBe(false);
    expect(s.skills.athletics!.mod.value).toBe(5);
    expect(s.skills.intimidation!.mod.value).toBe(2);
    expect(s.skills.perception!.mod.value).toBe(3);
    expect(s.passivePerception).toBe(13);
    expect(s.proficiencies.tools).toContain("dice-set");
  });

  it("specie: velocità, scurovisione, resistenza al veleno", () => {
    expect(s.speed.value).toBe(30);
    expect(s.senses).toContainEqual({ sense: "darkvision", range: 120 });
    expect(s.resistances).toEqual(["poison"]);
  });

  it("Ira: 2 usi, widget e azione disponibili", () => {
    expect(s.resources.find((r) => r.id === "rage")).toMatchObject({ max: 2, remaining: 2 });
    expect(s.widgets).toContainEqual(expect.objectContaining({ widget: "resource", ref: "rage" }));
    expect(s.actions.find((a) => a.id === "rage.start")?.available).toBe(true);
  });

  it("nessuna scelta in sospeso e nessun errore", () => {
    expect(s.pendingChoices).toEqual([]);
    expect(s.issues.filter((i) => i.severity === "error")).toEqual([]);
  });

  it("attacco con ascia bipenne, maestria attiva", () => {
    const axe = s.attacks.find((a) => a.itemId === "greataxe")!;
    expect(axe.toHit.value).toBe(5);
    expect(axe.damage).toBe("1d12+3");
    expect(axe.masteryActive).toBe(true);
    expect(axe.mastery).toBe("Cleave");
  });
});

describe("Ira in gioco", () => {
  it("entrare in Ira spende un uso e attiva i bonus", () => {
    const ch = makeBarbarian();
    const p = useAction(ch, reg, "rage.start");
    expect(p.blocked).toBeUndefined();
    const raging = applyProposal(ch, p);
    const s = sheetOf(raging);
    expect(raging.state.toggles.raging).toBe(true);
    expect(s.resources.find((r) => r.id === "rage")!.remaining).toBe(1);
    expect(s.attacks[0]!.damage).toBe("1d12+5");
    expect(s.resistances).toEqual(expect.arrayContaining(["poison", "bludgeoning", "piercing", "slashing"]));
    expect(s.saves.str.advantage).toBe(true);
    expect(s.skills.athletics!.advantage).toBe(true);
  });

  it("danno tagliente dimezzato in Ira", () => {
    const ch = applyProposal(makeBarbarian(), useAction(makeBarbarian(), reg, "rage.start"));
    const p = applyDamage(ch, sheetOf(ch), 11, { type: "slashing" });
    expect(p.state.hpCurrent).toBe(15 - 5);
  });

  it("in armatura pesante l'Ira non dà benefici e non si può attivare", () => {
    const ch = withState(equip(makeBarbarian(), "chain-mail", "greataxe"), { toggles: { raging: true } });
    const s = sheetOf(ch);
    expect(s.resistances).toEqual(["poison"]);
    expect(s.actions.find((a) => a.id === "rage.start")!.available).toBe(false);
    expect(s.issues.some((i) => i.code === "armor.untrained")).toBe(true);
  });

  it("in automazione completa non si entra in Ira senza usi", () => {
    const ch = withState(makeBarbarian("full"), { resourcesSpent: { rage: 2 } });
    expect(useAction(ch, reg, "rage.start").blocked).toBeTruthy();
    const assisted = { ...ch, settings: { automation: "assisted" as const } };
    expect(useAction(assisted, reg, "rage.start").blocked).toBeUndefined();
  });
});

describe("Passaggio di livello", () => {
  it("barbaro 1 → 3 con la media: PF, Ira, nuovi privilegi e scelte", () => {
    let ch = makeBarbarian();
    ch = levelUp(ch, reg, "barbarian", "avg").next;
    const r = levelUp(ch, reg, "barbarian", "avg");
    ch = r.next;
    const s = sheetOf(ch);
    expect(s.level).toBe(3);
    expect(s.hpMax.value).toBe(15 + (7 + 2 + 1) * 2);
    expect(ch.state.hpCurrent).toBe(s.hpMax.value);
    expect(s.resources.find((x) => x.id === "rage")!.max).toBe(3);
    expect(r.gained.map((f) => f.id)).toEqual(expect.arrayContaining(["barbarian.primal-knowledge", "barbarian.subclass"]));
    expect(s.pendingChoices.map((c) => c.id).sort()).toEqual(["barbarian.primal-knowledge", "barbarian.subclass"]);
    expect(s.saves.dex.advantage).toBe(true); // Percezione del Pericolo
    expect(s.toggles.map((t) => t.id)).toContain("reckless");
  });

  it("Conoscenza Primordiale: Furtività con la Forza in Ira", () => {
    let ch = makeBarbarian();
    ch = levelUp(ch, reg, "barbarian", "avg").next;
    ch = levelUp(ch, reg, "barbarian", "avg").next;
    ch = { ...ch, subclasses: { barbarian: "barbarian.berserker" }, choices: { ...ch.choices, "barbarian.primal-knowledge": ["athletics"] } };
    expect(sheetOf(ch).skills.stealth!.mod.value).toBe(1); // Des
    const raging = withState(ch, { toggles: { raging: true } });
    expect(sheetOf(raging).skills.stealth!.ability).toBe("str");
    expect(sheetOf(raging).skills.stealth!.mod.value).toBe(3);
    expect(sheetOf(raging).features.map((f) => f.id)).toContain("berserker.frenzy");
  });

  it("PF tirati dal motore con RNG fisso", () => {
    const r = levelUp(makeBarbarian(), reg, "barbarian", "roll", seededRng(42));
    const rolled = r.rolls[0]!.total;
    expect(rolled).toBeGreaterThanOrEqual(1);
    expect(rolled).toBeLessThanOrEqual(12);
    expect(sheetOf(r.next).hpMax.value).toBe(15 + rolled + 2 + 1);
  });

  it("multiclasse senza 13 nella caratteristica primaria: bloccato in automazione completa", () => {
    const ch = makeFighter("full"); // For 8
    const r = levelUp(ch, reg, "barbarian", "avg");
    expect(r.blocked).toMatch(/13/);
    const assisted = levelUp({ ...ch, settings: { automation: "assisted" } }, reg, "barbarian", "avg");
    expect(assisted.blocked).toBeUndefined();
    expect(assisted.issues.some((i) => i.code === "multiclass.prereq")).toBe(true);
  });

  it("multiclasse: niente TS della seconda classe, ma competenze ridotte", () => {
    const base = makeBarbarian();
    const s = sheetOf(levelUp(base, reg, "fighter", "avg").next);
    expect(s.classLevels).toEqual({ barbarian: 1, fighter: 1 });
    expect(s.proficiencies.armor).toContain("light");
    expect(s.proficiencies.armor).not.toContain("heavy");
    expect(s.saves.str.proficient).toBe(true);
    expect(s.hitDice).toEqual([
      { die: "d12", total: 1, spent: 0 },
      { die: "d10", total: 1, spent: 0 },
    ]);
  });
});

describe("Guerriero umano criminale, arciere", () => {
  const ch = makeFighter();
  const s = sheetOf(ch);

  it("PF con Robusto (talento d'origine da Versatile)", () => {
    expect(s.hpMax.value).toBe(10 + 2 + 2);
  });

  it("Allerta: competenza all'iniziativa", () => {
    expect(s.initiative.value).toBe(3 + 2);
  });

  it("Stile: Tiro sull'arco lungo; la spada corta usa la Des (accurata)", () => {
    const bow = s.attacks.find((a) => a.itemId === "longbow")!;
    expect(bow.toHit.value).toBe(3 + 2 + 2);
    expect(bow.damage).toBe("1d8+3");
    const sword = s.attacks.find((a) => a.itemId === "shortsword")!;
    expect(sword.ability).toBe("dex");
    expect(sword.toHit.value).toBe(5);
  });

  it("CA con cuoio, e +1 con Stile: Difesa", () => {
    expect(s.ac.value).toBe(11 + 3);
    const def = { ...ch, choices: { ...ch.choices, "fighter.fighting-style": ["fs-defense"] } };
    expect(sheetOf(def).ac.value).toBe(15);
  });

  it("cotta di maglia con For 8: CA 16, velocità −10", () => {
    const heavy = sheetOf(equip(ch, "chain-mail"));
    expect(heavy.ac.value).toBe(16);
    expect(heavy.speed.value).toBe(20);
  });

  it("abilità da background, classe e specie", () => {
    expect(s.skills.stealth!.proficient).toBe(true);
    expect(s.skills.insight!.proficient).toBe(true);
    expect(s.proficiencies.tools).toContain("thieves-tools");
  });
});

describe("Recuperare Energie e riposi", () => {
  it("automazione completa: cura e spende l'uso", () => {
    const ch = withState(makeFighter("full"), { hpCurrent: 3 });
    const p = useAction(ch, reg, "second-wind.use", seededRng(7));
    const healed = p.rolls[0]!.total;
    expect(p.rolls[0]!.expr).toBe("1d10+1");
    expect(p.state.hpCurrent).toBe(Math.min(14, 3 + healed));
    expect(p.state.resourcesSpent["second-wind"]).toBe(1);
  });

  it("automazione manuale: tira il dado ma non tocca la scheda", () => {
    const ch = withState(makeFighter("manual"), { hpCurrent: 3 });
    const p = useAction(ch, reg, "second-wind.use", seededRng(7));
    expect(p.rolls).toHaveLength(1);
    expect(p.state).toBe(ch.state);
  });

  it("riposo breve: +1 uso di Recuperare Energie, Dadi Vita spesi", () => {
    const ch = withState(makeFighter(), { hpCurrent: 4, resourcesSpent: { "second-wind": 2 } });
    const p = shortRest(ch, reg, { d10: 1 }, seededRng(1));
    expect(p.state.resourcesSpent["second-wind"]).toBe(1);
    expect(p.state.hitDiceSpent.d10).toBe(1);
    expect(p.state.hpCurrent).toBe(Math.min(14, 4 + p.rolls[0]!.total));
  });

  it("riposo breve con Dadi Vita insufficienti: bloccato in completa", () => {
    const ch = withState(makeFighter(), { hitDiceSpent: { d10: 1 } });
    expect(shortRest(ch, reg, { d10: 1 }).blocked).toBeTruthy();
  });

  it("riposo lungo: tutto ripristinato, Indebolimento −1", () => {
    const ch = withState(makeBarbarian(), {
      hpCurrent: 2,
      hpTemp: 5,
      hitDiceSpent: { d12: 1 },
      resourcesSpent: { rage: 2 },
      toggles: { raging: true },
      exhaustion: 2,
    });
    const s = longRest(ch, reg).state;
    expect(s).toMatchObject({ hpCurrent: 15, hpTemp: 0, hitDiceSpent: {}, resourcesSpent: { rage: 0 }, toggles: {}, exhaustion: 1 });
  });
});

describe("Punti ferita", () => {
  it("i PF temporanei assorbono per primi e non si sommano", () => {
    let ch = makeFighter();
    ch = applyProposal(ch, setTempHp(ch, 5));
    ch = applyProposal(ch, setTempHp(ch, 3));
    expect(ch.state.hpTemp).toBe(5);
    const p = applyDamage(ch, sheetOf(ch), 8);
    expect(p.state).toMatchObject({ hpTemp: 0, hpCurrent: 14 - 3 });
  });

  it("a 0 PF: privo di sensi; danno massiccio: morte", () => {
    const ch = makeFighter();
    const down = applyDamage(ch, sheetOf(ch), 20);
    expect(down.state.hpCurrent).toBe(0);
    expect(down.state.conditions).toContain("unconscious");
    expect(down.state.deathSaves.failure).toBe(0);
    const dead = applyDamage(ch, sheetOf(ch), 14 + 14);
    expect(dead.state.deathSaves.failure).toBe(3);
  });
});

describe("Livelli di automazione", () => {
  it("override applicato in manuale/assistita, ignorato in completa", () => {
    const base = { ...makeFighter(), overrides: { ac: 20 } };
    const manual = sheetOf({ ...base, settings: { automation: "manual" } });
    expect(manual.ac).toMatchObject({ value: 20, computed: 14, overridden: true });
    const full = sheetOf({ ...base, settings: { automation: "full" } });
    expect(full.ac.value).toBe(14);
    expect(full.issues.some((i) => i.code === "override.ignored")).toBe(true);
  });

  it("in manuale nessun avviso di regola", () => {
    const ch = { ...makeFighter("manual"), backgroundBoosts: { str: 3 } };
    expect(sheetOf(ch).issues).toEqual([]);
    const assisted = sheetOf({ ...ch, settings: { automation: "assisted" } });
    expect(assisted.issues.map((i) => i.code)).toEqual(expect.arrayContaining(["background.boosts.ability", "background.boosts.pattern"]));
  });

  it("precedenza: blocco del Master > personaggio > utente > default", () => {
    expect(resolveAutomation({})).toBe("assisted");
    expect(resolveAutomation({ user: "manual" })).toBe("manual");
    expect(resolveAutomation({ user: "manual", character: "full" })).toBe("full");
    expect(resolveAutomation({ user: "manual", character: "full", campaignLock: "assisted" })).toBe("assisted");
  });
});

describe("Indebolimento (2024)", () => {
  it("−2 per livello ai tiri di d20, −5 ft di velocità", () => {
    const s = sheetOf(withState(makeFighter(), { exhaustion: 2 }));
    expect(s.initiative.value).toBe(5 - 4);
    expect(s.saves.str.mod.value).toBe(-1 + 2 - 4);
    expect(s.speed.value).toBe(20);
    expect(s.passivePerception).toBe(10 + 1 + 2); // il passivo non subisce la penalità
  });
});

describe("Campione", () => {
  it("critico con 19 e vantaggio all'iniziativa", () => {
    let ch = makeFighter();
    ch = levelUp(ch, reg, "fighter", "avg").next;
    ch = levelUp(ch, reg, "fighter", "avg").next;
    ch = { ...ch, subclasses: { fighter: "fighter.champion" } };
    const s = sheetOf(ch);
    expect(s.critRange).toBe(19);
    expect(s.attacks[0]!.critRange).toBe(19);
    expect(s.initiative.advantage).toBe(true);
    expect(s.resources.find((r) => r.id === "action-surge")!.max).toBe(1);
    expect(s.pendingChoices).toEqual([]);
  });
});

describe("Dadi", () => {
  it("interpreta espressioni", () => {
    expect(parseDice("2d6+1d4-1")).toEqual({
      dice: [
        { count: 2, sides: 6, sign: 1 },
        { count: 1, sides: 4, sign: 1 },
      ],
      flat: -1,
    });
    expect(() => parseDice("2x6")).toThrow();
  });

  it("tiri deterministici con seed", () => {
    expect(roll("4d6", seededRng(3)).total).toBe(roll("4d6", seededRng(3)).total);
    const r = roll("3d8+2", seededRng(9));
    expect(r.total).toBe(r.rolls.reduce((a, x) => a + x.value, 0) + 2);
  });
});

describe("Correzioni a mano", () => {
  const manual = (ch: CharacterData): CharacterData => ({ ...ch, settings: { automation: "manual" } });

  it("un privilegio tolto perde i suoi effetti ma resta elencato per rimetterlo", () => {
    const ch = { ...manual(makeBarbarian()), disabledFeatures: ["dwarf.toughness"] };
    const s = sheetOf(ch);
    expect(s.hpMax.value).toBe(12 + 2);
    expect(s.features.some((f) => f.id === "dwarf.toughness")).toBe(false);
    expect(s.disabledFeatures.map((f) => f.id)).toEqual(["dwarf.toughness"]);
  });

  it("i privilegi scritti a mano vanno nel riquadro scelto", () => {
    const ch = { ...manual(makeBarbarian()), customFeatures: [{ id: "custom.a", name: "Benedizione del villaggio", section: "species" as const }] };
    expect(sheetOf(ch).features.find((f) => f.id === "custom.a")).toMatchObject({ kind: "custom", section: "species" });
  });

  it("competenze aggiunte e tolte, maestria compresa", () => {
    const ch = {
      ...manual(makeBarbarian()),
      proficiencyEdits: { add: { skills: ["stealth"], languages: ["elvish"], tools: ["thieves-tools"] }, remove: { skills: ["perception"] } },
    };
    const s = sheetOf(ch);
    expect(s.skills.stealth!.proficient).toBe(true);
    expect(s.skills.perception!.proficient).toBe(false);
    expect(s.proficiencies.languages).toContain("elvish");
    expect(s.proficiencies.tools).toContain("thieves-tools");
  });

  it("in automazione completa le correzioni non contano", () => {
    const ch = { ...makeBarbarian(), settings: { automation: "full" as const }, disabledFeatures: ["dwarf.toughness"], proficiencyEdits: { add: { skills: ["stealth"] } } };
    const s = sheetOf(ch);
    expect(s.hpMax.value).toBe(12 + 2 + 1);
    expect(s.skills.stealth!.proficient).toBe(false);
  });
});
