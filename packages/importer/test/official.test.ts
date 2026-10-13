import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { computeSheet, createCharacter, createRegistry, longRest, useAction, type CharacterData, type ContentPack } from "@dnd/engine";
import { describe, expect, it } from "vitest";
import { importCompendium, parseXml } from "../src/index.ts";

/* Formato: un compendio minimo, sempre disponibile. */

const MINI = `<?xml version="1.0"?>
<compendium version="5">
  <class>
    <name>Knight</name><hd>10</hd>
    <proficiency>Strength, Constitution, Athletics, History, Perception</proficiency>
    <spellAbility>Intelligence</spellAbility><numSkills>2</numSkills>
    <armor>light armor, shields</armor><weapons>simple weapons, longswords</weapons><tools>none</tools>
    <autolevel level="1"><feature optional="YES"><name>Starting Knight</name><text>Riassunto.</text></feature></autolevel>
    <autolevel level="1">
      <feature><name>Rally</name><text>Heal yourself.</text><text>Source: Test Book p. 1</text></feature>
      <counter><name>Rally</name><value>1</value><reset>S</reset></counter>
    </autolevel>
    <autolevel level="1"><feature><name>Style</name><text>Pick one.</text></feature></autolevel>
    <autolevel level="1"><feature optional="YES"><name>Style: Guard</name><text>You guard.</text><modifier category="bonus">ac +1</modifier></feature></autolevel>
    <autolevel level="1"><feature optional="YES"><name>Style: Rush</name><text>You rush.</text><modifier category="bonus">speed +10</modifier></feature></autolevel>
    <autolevel level="3"><slots optional="YES">2, 2</slots></autolevel>
    <autolevel level="3"><feature><name>Order</name><text>Choose an order.</text></feature></autolevel>
    <autolevel level="3"><feature optional="YES"><name>Order: Order of Spells</name><text>You study magic.</text></feature></autolevel>
    <autolevel level="3"><feature optional="YES"><name>Spellcasting (Order of Spells)</name><text>You cast.</text></feature></autolevel>
    <autolevel level="3"><feature optional="YES"><name>Order: Order of Steel</name><text>You train.</text></feature></autolevel>
    <autolevel level="3"><feature optional="YES"><name>Iron Skin (Order of Steel)</name><text>Tough.</text><special>unarmored defense constitution</special></feature></autolevel>
    <autolevel level="4" scoreImprovement="YES"><feature><name>Ability Score Improvement</name><text>Improve.</text></feature></autolevel>
    <autolevel level="5"><counter><name>Rally</name><value>2</value><reset>S</reset></counter></autolevel>
  </class>
  <race><name>Elf, Test</name><size>M</size><speed>35</speed><ability>Dex 2, Int 1</ability>
    <trait><name>Description</name><text>Tall folk.</text></trait>
    <trait><name>Darkvision</name><text>You can see in dim light within 60 feet of you.</text></trait>
  </race>
  <background><name>Guard</name><proficiency>Athletics, Perception</proficiency>
    <trait><name>Description</name><text>You stood watch.</text></trait>
    <trait><name>Watcher's Eye</name><text>You find the watch post.</text></trait>
  </background>
  <feat><name>Hardy</name><prerequisite>Constitution 13</prerequisite><text>Tougher.</text><modifier category="ability score">constitution +1</modifier></feat>
  <spell><name>Spark</name><level>0</level><school>EV</school><time>1 action</time><range>60 feet</range><components>V, S</components><duration>Instantaneous</duration>
    <classes>Wizard, Knight (Order of Spells)</classes>
    <text>Make a ranged spell attack. On a hit, the target takes 1d8 fire damage.</text>
    <text>	The spell's damage increases by 1d8 when you reach 5th level (2d8).</text><roll>1d8</roll></spell>
  <item><name>Longsword</name><type>M</type><weight>3</weight><value>15</value><dmg1>1d8</dmg1><dmg2>1d10</dmg2><dmgType>S</dmgType><property>M,V</property></item>
  <item><name>Chain Mail</name><type>HA</type><ac>16</ac><strength>13</strength><stealth>1</stealth></item>
  <item><name>Ring of Tests</name><type>RG</type><magic>YES</magic><detail>rare (requires attunement)</detail><text>It tests.</text></item>
  <monster><name>Test Goblin</name><size>S</size><type>humanoid</type><ac>15 (leather armor, shield)</ac><hp>7 (2d6)</hp><speed>30 ft.</speed>
    <str>8</str><dex>14</dex><con>10</con><int>10</int><wis>8</wis><cha>8</cha><save>Dex +4</save><skill>Stealth +6</skill><passive>9</passive><cr>1/4</cr>
    <trait><name>Source</name><text>Test Book p. 9</text></trait>
    <trait><name>Nimble</name><text>It is quick.</text></trait>
    <action><name>Scimitar</name><text>Melee Weapon Attack: +4 to hit.</text><attack>|4|1d6+2</attack></action>
  </monster>
</compendium>`;

describe("Lettore XML", () => {
  it("attributi, entità e tag chiusi su se stessi", () => {
    const root = parseXml(`<a x="1 &amp; 2"><b/><c>Tom &apos;n&apos; Jerry</c></a>`);
    const a = root.children[0]!;
    expect(a.attrs.x).toBe("1 & 2");
    expect(a.children.map((c) => c.tag)).toEqual(["b", "c"]);
    expect(a.children[1]!.text).toBe("Tom 'n' Jerry");
  });
});

describe("Importazione di un compendio", () => {
  const { pack, stats } = importCompendium(MINI, { id: "mini", name: "Mini" });
  const knight = pack.classes![0]!;
  const feature = (name: string) => knight.features.find((f) => f.name === name)!;

  it("classe: dado vita, competenze, abilità a scelta", () => {
    expect(knight).toMatchObject({ id: "knight", hitDie: "d10", subclassLevel: 3, skillChoice: { count: 2, from: ["athletics", "history", "perception"] } });
    expect(knight.proficiencies).toMatchObject({ saves: ["str", "con"], armor: ["light", "shield"], weapons: ["simple", "longsword"] });
    expect(knight.features.map((f) => f.name)).toEqual(["Rally", "Style", "Order", "Ability Score Improvement"]);
  });

  it("contatori: risorsa con tabella per livello e recupero a riposo breve", () => {
    const r = feature("Rally").resources![0]!;
    expect(r).toMatchObject({ id: "knight.rally", shortRest: "all", longRest: "all" });
    expect((r.max as { table: { values: number[] } }).table.values.slice(0, 6)).toEqual([1, 1, 1, 1, 2, 2]);
    expect(feature("Rally").source).toBe("Test Book p. 1");
  });

  it("opzioni di un privilegio: una scelta più un talento per opzione", () => {
    expect(feature("Style").choices).toEqual([{ id: "knight.style", kind: "feat", label: "Style", count: 1, from: { tag: "opt:knight.style" } }]);
    const rush = pack.feats!.find((f) => f.id === "knight.style.rush")!;
    expect(rush).toMatchObject({ category: "option", tags: ["opt:knight.style"] });
    expect(rush.feature.effects).toEqual([{ type: "bonus", target: "speed.walk", value: 10, label: "Rush" }]);
    expect(stats.unmappedModifiers).toEqual({ "bonus: ac N": 1 });
  });

  it("sottoclassi: privilegi, descrizione e incantesimi a un terzo", () => {
    expect(pack.subclasses!.map((s) => s.id)).toEqual(["knight.order-of-spells", "knight.order-of-steel"]);
    const spells = pack.subclasses![0]!;
    expect(spells.description).toBe("You study magic.");
    expect(spells.spellcasting).toMatchObject({ ability: "int", progression: "third", fromLevel: 3 });
    expect(pack.subclasses![1]!.features[0]!.effects![0]).toMatchObject({ type: "acFormula" });
    expect(knight.spellcasting).toBeUndefined();
  });

  it("aumenti di caratteristica: scelta tra aumento e talento", () => {
    expect(feature("Ability Score Improvement").choices![0]).toMatchObject({ id: "knight.asi-4", kind: "feat", from: { tag: "general" } });
    expect(pack.feats!.map((f) => f.id)).toEqual(expect.arrayContaining(["asi", "hardy"]));
    expect(pack.feats!.find((f) => f.id === "hardy")).toMatchObject({ prerequisiteText: "Constitution 13" });
  });

  it("specie e background", () => {
    const elf = pack.species![0]!;
    expect(elf).toMatchObject({ id: "elf-test", size: "Medium", speed: 35, description: "Tall folk." });
    expect(elf.features[0]!.effects).toEqual([
      { type: "bonus", target: "ability.dex", value: 2, label: "Elf, Test" },
      { type: "bonus", target: "ability.int", value: 1, label: "Elf, Test" },
    ]);
    expect(elf.features[1]!.effects).toEqual([{ type: "sense", sense: "darkvision", range: 60 }]);
    expect(pack.backgrounds![0]).toMatchObject({ id: "guard", skills: ["athletics", "perception"], description: "You stood watch." });
    expect(pack.backgrounds![0]!.features!.map((f) => f.name)).toEqual(["Watcher's Eye"]);
  });

  it("incantesimi, oggetti, mostri", () => {
    expect(pack.spells![0]).toMatchObject({
      id: "spark",
      level: 0,
      school: "evocation",
      timing: "action",
      attack: "ranged",
      lists: ["wizard", "knight.order-of-spells"],
      roll: { kind: "damage", dice: "1d8", damageType: "fire", cantripScaling: true },
    });
    expect(pack.items![0]).toMatchObject({ kind: "weapon", category: "martial", damage: "1d8", versatile: "1d10", properties: ["versatile"], weight: 3 });
    expect(pack.items![1]).toMatchObject({ kind: "armor", category: "heavy", baseAC: 16, dexCap: 0, strength: 13, stealthDisadvantage: true });
    expect(pack.items![2]).toMatchObject({ kind: "gear", category: "ring", magic: true, rarity: "rare", attunement: true });
    expect(pack.monsters![0]).toMatchObject({ id: "test-goblin", ac: 15, acNote: "leather armor, shield", hp: 7, hpFormula: "2d6", cr: "1/4", saves: { dex: 4 }, skills: { stealth: 6 }, source: "Test Book p. 9" });
    expect(pack.monsters![0]!.actions[0]!.attack).toEqual({ bonus: 4, damage: "1d6+2" });
    expect(pack.monsters![0]!.traits.map((t) => t.name)).toEqual(["Nimble"]);
  });

  it("il personaggio importato si calcola: specie, risorsa, opzione scelta, sottoclasse", () => {
    const reg = createRegistry(pack);
    expect(reg.ruleset).toBe("2014");
    const base = createCharacter(
      { id: "t", name: "Prova", speciesId: "elf-test", backgroundId: "guard", classId: "knight", abilityScores: { str: 15, dex: 12, con: 14, int: 13, wis: 10, cha: 8 }, choices: { "knight.skills": ["history", "perception"], "knight.style": ["knight.style.rush"] } },
      reg,
    );
    const ch: CharacterData = { ...base, levels: Array.from({ length: 5 }, () => ({ classId: "knight", hp: "avg" as const })), subclasses: { knight: "knight.order-of-spells" } };
    const s = computeSheet(ch, reg);
    expect(s.abilities.dex.score.value).toBe(14);
    expect(s.speed.value).toBe(45);
    expect(s.skills.athletics!.proficient).toBe(true);
    expect(s.resources.find((r) => r.id === "knight.rally")).toMatchObject({ max: 2 });
    expect(s.spellcasting!.slots.map((p) => p.max)).toEqual([3]);
    expect(s.issues.filter((i) => i.severity === "error")).toEqual([]);
  });
});

describe("Regole 2014 nel motore", () => {
  const { pack } = importCompendium(MINI, { id: "mini", name: "Mini" });
  const reg = createRegistry(pack);
  const knight = (level: number, state: Partial<CharacterData["state"]> = {}): CharacterData => {
    const base = createCharacter({ id: "t", name: "Prova", speciesId: "elf-test", backgroundId: "guard", classId: "knight", abilityScores: { str: 15, dex: 12, con: 14, int: 13, wis: 10, cha: 8 } }, reg);
    return { ...base, levels: Array.from({ length: level }, () => ({ classId: "knight", hp: "avg" as const })), state: { ...base.state, ...state } };
  };

  it("background senza aumenti di caratteristica: nessun avviso", () => {
    expect(computeSheet(knight(1), reg).issues.map((i) => i.code)).not.toContain("background.boosts.missing");
  });

  it("Indebolimento a soglie: svantaggi, velocità dimezzata, PF massimi dimezzati, velocità 0", () => {
    const at = (exhaustion: number) => computeSheet(knight(4, { exhaustion }), reg);
    const fresh = at(0);
    expect(fresh.speed.value).toBe(35);
    expect(fresh.disadvantages).toEqual([]);
    expect(at(1).disadvantages.map((d) => d.on)).toEqual(["check.all"]);
    expect(at(1).saves.str.mod.value).toBe(fresh.saves.str.mod.value); // nessuna penalità numerica
    expect(at(1).passivePerception).toBe(fresh.passivePerception - 5);
    expect(at(2).speed.value).toBe(17);
    expect(at(3).disadvantages.map((d) => d.on)).toEqual(["check.all", "attack.all", "save.all"]);
    expect(at(4).hpMax.value).toBe(Math.floor(fresh.hpMax.value / 2));
    expect(at(5).speed.value).toBe(0);
  });

  it("riposo lungo: torna metà dei Dadi Vita, almeno uno", () => {
    expect(longRest(knight(6, { hitDiceSpent: { d10: 5 } }), reg).state.hitDiceSpent).toEqual({ d10: 2 });
    expect(longRest(knight(1, { hitDiceSpent: { d10: 1 } }), reg).state.hitDiceSpent).toEqual({ d10: 0 });
  });
});

/* I manuali veri non stanno nel repository: questi controlli girano solo dove ci sono. */

const OFFICIAL = resolve(import.meta.dirname, "../../../manuali/Official Only.xml");

describe.skipIf(!existsSync(OFFICIAL))("Compendio ufficiale 2014", () => {
  let pack: ContentPack;
  const load = () => (pack ??= importCompendium(readFileSync(OFFICIAL, "utf8"), { id: "official-2014", name: "Ufficiali 2014" }).pack);
  const cls = (id: string) => load().classes!.find((c) => c.id === id)!;

  it("le 13 classi ufficiali, con le sottoclassi del manuale base", () => {
    const ids = load().classes!.map((c) => c.id);
    expect(ids).toEqual(expect.arrayContaining(["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorcerer", "warlock", "wizard", "artificer"]));
    const subs = load().subclasses!.map((s) => s.id);
    expect(subs).toEqual(expect.arrayContaining(["fighter.champion", "fighter.eldritch-knight", "cleric.life-domain", "wizard.school-of-evocation", "warlock.the-fiend", "rogue.thief"]));
    expect(new Set(subs).size).toBe(subs.length);
  });

  it("livello della sottoclasse e progressione degli incantesimi per classe", () => {
    expect(cls("cleric").subclassLevel).toBe(1);
    expect(cls("wizard").subclassLevel).toBe(2);
    expect(cls("fighter").subclassLevel).toBe(3);
    expect(cls("wizard").spellcasting).toMatchObject({ ability: "int", progression: "full", spellbook: true });
    expect(cls("paladin").spellcasting).toMatchObject({ ability: "cha", progression: "half", fromLevel: 2 });
    expect(cls("warlock").spellcasting).toMatchObject({ progression: "pact", changeOn: "levelUp" });
    expect(cls("artificer").spellcasting).toMatchObject({ progression: "half" });
    expect(cls("barbarian").spellcasting).toBeUndefined();
    expect(load().subclasses!.find((s) => s.id === "fighter.eldritch-knight")!.spellcasting).toMatchObject({ progression: "third", fromLevel: 3, list: "wizard" });
  });

  it("ogni classe si calcola dal livello 1 al 20 con ogni sottoclasse, senza eccezioni", () => {
    const reg = createRegistry(load());
    const species = load().species!.find((s) => s.id === "human")!.id;
    const bg = load().backgrounds!.find((b) => b.id === "soldier")!.id;
    for (const c of load().classes!) {
      const base = createCharacter({ id: "t", name: "Prova", speciesId: species, backgroundId: bg, classId: c.id, abilityScores: { str: 13, dex: 13, con: 13, int: 13, wis: 13, cha: 13 } }, reg);
      const subs = [undefined, ...load().subclasses!.filter((s) => s.classId === c.id).map((s) => s.id)];
      for (const sub of subs) {
        for (const level of [1, 3, 5, 11, 20]) {
          const ch: CharacterData = { ...base, levels: Array.from({ length: level }, () => ({ classId: c.id, hp: "avg" as const })), subclasses: sub ? { [c.id]: sub } : {} };
          expect(() => computeSheet(ch, reg), `${c.id} ${sub ?? ""} liv. ${level}`).not.toThrow();
        }
      }
    }
  });

  it("numeri noti: Guerriero, Mago, Paladino, Warlock", () => {
    const reg = createRegistry(load());
    const sheet = (classId: string, level: number, sub?: string) => {
      const base = createCharacter({ id: "t", name: "Prova", speciesId: "human", backgroundId: "soldier", classId, abilityScores: { str: 15, dex: 13, con: 14, int: 16, wis: 12, cha: 16 } }, reg);
      return computeSheet({ ...base, levels: Array.from({ length: level }, () => ({ classId, hp: "avg" as const })), subclasses: sub ? { [classId]: sub } : {} }, reg);
    };
    const fighter = sheet("fighter", 17);
    expect(fighter.resources.find((r) => r.id === "fighter.action-surge")).toMatchObject({ max: 2, shortRest: "all" });
    expect(fighter.saves.str.proficient && fighter.saves.con.proficient).toBe(true);
    expect(sheet("fighter", 7, "fighter.eldritch-knight").spellcasting!.slots.map((p) => p.max)).toEqual([4, 2]);
    const wizard = sheet("wizard", 5).spellcasting!;
    expect(wizard.slots.map((p) => p.max)).toEqual([4, 3, 2]);
    expect(wizard.sources[0]).toMatchObject({ cantripsMax: 4, preparedMax: 5 + 3 }); // livello + Int (17 con l'umano)
    expect(sheet("paladin", 1).spellcasting).toBeUndefined();
    expect(sheet("paladin", 5).spellcasting!.slots.map((p) => p.max)).toEqual([4, 2]);
    expect(sheet("warlock", 5).spellcasting!.pact).toMatchObject({ level: 3, max: 2 });
    expect(sheet("barbarian", 1).ac.value).toBe(10 + 2 + 2); // Difesa Senza Armatura: Des 14 e Cos 15 con l'umano
  });
});

describe.skipIf(!existsSync(OFFICIAL))("Compendio ufficiale 2014: opzioni di classe e risorse", () => {
  let pack: ContentPack;
  const load = () => (pack ??= importCompendium(readFileSync(OFFICIAL, "utf8"), { id: "official-2014", name: "Ufficiali 2014" }).pack);
  const features = () => [...load().classes!, ...load().subclasses!].flatMap((c) => c.features);
  const options = (featureId: string) => load().feats!.filter((f) => f.tags?.includes(`opt:${featureId}`));

  it("suppliche, manovre e infusioni sono opzioni, non incantesimi", () => {
    expect(options("warlock.eldritch-invocations").length).toBeGreaterThan(40);
    expect(options("fighter.battle-master.combat-superiority").length).toBeGreaterThan(15);
    expect(options("artificer.infuse-item").length).toBeGreaterThan(10);
    const fake = ["eldritch-invocations", "maneuvers", "artificer-infusions"];
    expect(load().spells!.filter((s) => s.lists.some((l) => fake.includes(l)))).toEqual([]);
    expect(load().feats!.find((f) => f.id === "warlock.eldritch-invocations.ascendant-step")).toMatchObject({
      name: "Ascendant Step",
      prerequisites: { minLevel: { by: "warlock", level: 9 } },
    });
  });

  it("uno stregone di 3° livello sceglie due opzioni di Metamagia, tre al 10°", () => {
    const reg = createRegistry(load());
    const base = createCharacter({ id: "t", name: "Prova", speciesId: "human", backgroundId: "sage", classId: "sorcerer", abilityScores: { str: 8, dex: 14, con: 14, int: 10, wis: 12, cha: 15 } }, reg);
    const pending = (level: number) =>
      computeSheet({ ...base, levels: Array.from({ length: level }, () => ({ classId: "sorcerer", hp: "avg" as const })) }, reg).pendingChoices.find((p) => p.id === "sorcerer.metamagic");
    expect(pending(2)).toBeUndefined();
    expect(pending(3)).toMatchObject({ required: 2 });
    expect(pending(10)).toMatchObject({ required: 3 });
  });

  it("le risorse stanno sul privilegio che le descrive", () => {
    const owner = (resourceId: string) => [...features(), ...load().feats!.map((f) => f.feature)].find((f) => f.resources?.some((r) => r.id === resourceId))?.id;
    expect(owner("sorcerer.sorcery-points")).toBe("sorcerer.font-of-magic");
    expect(owner("artificer.defensive-field")).toBe("artificer.armorer.armor-model");
    expect(owner("ranger.natures-veil")).toMatch(/natures-veil/);
    expect(owner("warlock.accursed-specter")).toMatch(/accursed-specter/);
  });
});

describe.skipIf(!existsSync(OFFICIAL))("Compendio ufficiale 2014: meccaniche codificate a mano", () => {
  let reg: ReturnType<typeof createRegistry>;
  const registry = () => (reg ??= createRegistry(importCompendium(readFileSync(OFFICIAL, "utf8"), { id: "official-2014", name: "Ufficiali 2014" }).pack));
  const hero = (classId: string, level: number, extra: Partial<CharacterData> = {}): CharacterData => {
    const base = createCharacter({ id: "t", name: "Prova", speciesId: "human", backgroundId: "sage", classId, abilityScores: { str: 14, dex: 14, con: 14, int: 14, wis: 14, cha: 10 } }, registry());
    return { ...base, levels: Array.from({ length: level }, () => ({ classId, hp: "avg" as const })), ...extra };
  };

  it("Guerriero: Recuperare Energie cura, Attacco Extra, critico del Campione", () => {
    const s = computeSheet(hero("fighter", 11, { subclasses: { fighter: "fighter.champion" } }), registry());
    expect(s.attacksPerAction).toBe(3);
    expect(s.critRange).toBe(19);
    expect(s.actions.find((a) => a.id === "fighter.second-wind")).toMatchObject({ timing: "bonus", outcome: { kind: "heal" } });
  });

  it("Ladro: dadi dell'Attacco Furtivo e Maestria da scegliere", () => {
    const s = computeSheet(hero("rogue", 5), registry());
    expect(s.dice.find((d) => d.id === "rogue.sneak-attack")).toMatchObject({ expr: "3d6" });
    expect(s.pendingChoices.find((p) => p.id === "rogue.expertise")).toMatchObject({ required: 2 });
  });

  it("Chierico della Vita: incantesimi di dominio sempre preparati e armature pesanti", () => {
    const s = computeSheet(hero("cleric", 3, { subclasses: { cleric: "cleric.life-domain" } }), registry());
    const always = s.spellcasting!.spells.filter((x) => x.always).map((x) => x.spellId);
    expect(always).toEqual(expect.arrayContaining(["bless", "cure-wounds", "lesser-restoration", "spiritual-weapon"]));
    expect(always).not.toContain("beacon-of-hope"); // arriva al 5° livello
    expect(s.proficiencies.armor).toContain("heavy");
    expect(s.actions.map((a) => a.id)).toEqual(expect.arrayContaining(["cleric.turn-undead", "cleric.preserve-life"]));
  });

  it("Mago: Recupero Arcano riporta slot per metà livello", () => {
    const ch = hero("wizard", 4);
    const spent = { ...ch, state: { ...ch.state, spellSlotsSpent: { "1": 2, "2": 1 } } };
    const p = useAction(spent, registry(), "wizard.arcane-recovery", undefined, { slots: { "2": 1 } });
    expect(p.blocked).toBeUndefined();
    expect(p.state.spellSlotsSpent).toMatchObject({ "1": 2, "2": 0 });
    expect(useAction(spent, registry(), "wizard.arcane-recovery", undefined, { slots: { "1": 2, "2": 1 } }).lines.join(" ")).toMatch(/2 livelli/);
  });
});

describe.skipIf(!existsSync(OFFICIAL))("Compendio ufficiale 2014: meccaniche delle altre classi", () => {
  let reg: ReturnType<typeof createRegistry>;
  const registry = () => (reg ??= createRegistry(importCompendium(readFileSync(OFFICIAL, "utf8"), { id: "official-2014", name: "Ufficiali 2014" }).pack));
  const hero = (classId: string, level: number, extra: Partial<CharacterData> = {}): CharacterData => {
    const base = createCharacter({ id: "t", name: "Prova", speciesId: "human", backgroundId: "sage", classId, abilityScores: { str: 14, dex: 14, con: 14, int: 14, wis: 14, cha: 14 } }, registry());
    return { ...base, levels: Array.from({ length: level }, () => ({ classId, hp: "avg" as const })), ...extra };
  };
  const state = (ch: CharacterData, patch: Partial<CharacterData["state"]>): CharacterData => ({ ...ch, state: { ...ch.state, ...patch } });

  it("ogni classe si calcola dal 1° al 20° livello e ogni azione si può usare", () => {
    for (const cls of registry().classes.values()) {
      for (const level of [1, 2, 3, 5, 11, 20]) {
        const ch = hero(cls.id, level);
        const s = computeSheet(ch, registry());
        for (const a of s.actions) expect(() => useAction(ch, registry(), a.id, undefined, { amount: 1, slotLevel: 1 }), `${cls.id} ${level}: ${a.id}`).not.toThrow();
      }
    }
  });

  it("Barbaro: l'Ira si attiva, dà danni e resistenze, e si spegne", () => {
    const ch = hero("barbarian", 9);
    const on = useAction(ch, registry(), "barbarian.rage");
    expect(on.state.toggles.raging).toBe(true);
    expect(on.state.resourcesSpent["barbarian.rage"]).toBe(1);
    const raging = computeSheet(state(ch, on.state), registry());
    expect(raging.resistances).toEqual(expect.arrayContaining(["bludgeoning", "piercing", "slashing"]));
    expect(raging.advantages.map((a) => a.on)).toEqual(expect.arrayContaining(["save.str", "save.dex"]));
    expect(computeSheet(ch, registry()).resistances).toEqual([]);
    expect(useAction(state(ch, on.state), registry(), "barbarian.rage.end").state.toggles.raging).toBe(false);
  });

  it("Monaco: dado delle Arti Marziali e ki speso dalla Raffica di Colpi", () => {
    const ch = hero("monk", 5);
    const s = computeSheet(ch, registry());
    expect(s.attacks.find((a) => a.unarmed)?.damage).toMatch(/^1d6/);
    expect(useAction(ch, registry(), "monk.flurry-of-blows").state.resourcesSpent["monk.ki"]).toBe(1);
  });

  it("Bardo e Paladino: risorse legate al Carisma, aura ai tiri salvezza", () => {
    expect(computeSheet(hero("bard", 5), registry()).resources.find((r) => r.id === "bard.bardic-inspiration")).toMatchObject({ max: 2 });
    expect(computeSheet(hero("bard", 5), registry()).dice.find((d) => d.id === "bard.bardic-inspiration")).toMatchObject({ expr: "1d8" });
    const pal = computeSheet(hero("paladin", 6), registry());
    expect(pal.resources.find((r) => r.id === "paladin.divine-sense")).toMatchObject({ max: 3 });
    expect(pal.saves.int.mod.value).toBe(2 + 2); // modificatore + Aura di Protezione
  });

  it("Stregone: punti stregoneria in slot e viceversa", () => {
    const ch = hero("sorcerer", 5);
    const made = useAction(ch, registry(), "sorcerer.create-slot", undefined, { slotLevel: 2 });
    expect(made.state.resourcesSpent["sorcerer.sorcery-points"]).toBe(3);
    expect(made.state.spellSlotsBonus).toMatchObject({ "2": 1 });
    const back = useAction(state(ch, { resourcesSpent: { "sorcerer.sorcery-points": 4 } }), registry(), "sorcerer.convert-slot", undefined, { slotLevel: 3 });
    expect(back.state.resourcesSpent["sorcerer.sorcery-points"]).toBe(1);
  });

  it("Warlock dell'Immondo: le azioni del patrono compaiono e si usano", () => {
    const ch = hero("warlock", 3, { subclasses: { warlock: "warlock.the-fiend" } });
    expect(useAction(ch, registry(), "warlock.dark-ones-blessing").lines.join(" ")).toMatch(/PF temporanei/);
  });

  it("Druido della Terra: gli incantesimi del terreno scelto sono sempre preparati", () => {
    const ch = hero("druid", 5, { subclasses: { druid: "druid.circle-of-the-land" }, choices: { "druid.optional": ["druid.optional.circle-of-the-land-forest"] } });
    const always = computeSheet(ch, registry()).spellcasting!.spells.filter((x) => x.always).map((x) => x.spellId);
    expect(always).toEqual(expect.arrayContaining(["barkskin", "spider-climb", "call-lightning", "plant-growth"]));
  });
});
