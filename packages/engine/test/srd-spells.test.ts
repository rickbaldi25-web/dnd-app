import { describe, expect, it } from "vitest";
import { srd } from "../../content-srd/src/index.js";
import { castSpell, createCharacter, createRegistry, seededRng, spellsForList, type CharacterData, type ContentPack } from "../src/index.js";

/* Il catalogo degli incantesimi SRD è generato: qui si controlla che sia integro e si lanci. */

const CLASSES = ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"];
const testPack: ContentPack = {
  id: "test-srd-spells",
  name: "Prova",
  classes: [
    {
      id: "t-wiz",
      name: "Mago di prova",
      hitDie: "d6",
      primaryAbility: ["int"],
      proficiencies: { saves: ["int", "wis"] },
      multiclassProficiencies: {},
      skillChoice: { count: 0, from: [] },
      subclassLevel: 3,
      spellcasting: { ability: "int", progression: "full", list: "wizard", cantrips: [3], prepared: [4, 5, 6, 7, 9, 10, 11, 12, 14] },
      features: [],
    },
    {
      id: "t-cle",
      name: "Chierico di prova",
      hitDie: "d8",
      primaryAbility: ["wis"],
      proficiencies: { saves: ["wis", "cha"] },
      multiclassProficiencies: {},
      skillChoice: { count: 0, from: [] },
      subclassLevel: 3,
      spellcasting: { ability: "wis", progression: "full", list: "cleric", cantrips: [3], prepared: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16] },
      features: [],
    },
  ],
};
const reg = createRegistry(srd, testPack);
const spell = (id: string) => reg.spells.get(id)!;

function caster(classId: string, level: number, prepared: string[], cantrips: string[] = []): CharacterData {
  const ch = createCharacter(
    {
      id: "t",
      name: "Prova",
      speciesId: "dwarf",
      backgroundId: "soldier",
      classId,
      abilityScores: { str: 10, dex: 12, con: 13, int: 16, wis: 16, cha: 10 },
      backgroundBoosts: { str: 2, con: 1 },
      automation: "full",
    },
    reg,
  );
  return { ...ch, levels: Array.from({ length: level }, () => ({ classId, hp: "avg" as const })), spells: { [classId]: { cantrips, prepared } } };
}

describe("Catalogo incantesimi SRD", () => {
  const all = srd.spells!;

  it("339 incantesimi, id unici, campi obbligatori compilati", () => {
    expect(all).toHaveLength(339);
    expect(new Set(all.map((s) => s.id)).size).toBe(339);
    for (const s of all) {
      expect(s.name, s.id).toBeTruthy();
      expect(s.nameEn, s.id).toBeTruthy();
      expect(s.description.length, s.id).toBeGreaterThan(40);
      expect(s.level, s.id).toBeGreaterThanOrEqual(0);
      expect(s.level, s.id).toBeLessThanOrEqual(9);
      expect(s.lists.length, s.id).toBeGreaterThan(0);
      for (const l of s.lists) expect(CLASSES, s.id).toContain(l);
      for (const f of [s.castingTime, s.range, s.components, s.duration]) expect(f, s.id).toBeTruthy();
    }
  });

  it("ogni classe da incantatore ha trucchetti (tranne i mezzi incantatori) e incantesimi", () => {
    for (const c of CLASSES) {
      const list = spellsForList(reg, c);
      expect(list.length, c).toBeGreaterThan(20);
      if (c !== "paladin" && c !== "ranger") expect(list[0]!.level, c).toBe(0);
    }
    expect(spellsForList(reg, "wizard", 1).every((s) => s.level <= 1)).toBe(true);
  });

  it("dati di alcuni incantesimi noti", () => {
    expect(spell("fireball")).toMatchObject({
      name: "Palla di fuoco",
      level: 3,
      school: "evocation",
      save: "dex",
      lists: ["wizard", "sorcerer"],
      roll: { kind: "damage", dice: "8d6", damageType: "fire", perSlotLevel: "1d6" },
    });
    expect(spell("fire-bolt")).toMatchObject({ level: 0, attack: "ranged", roll: { dice: "1d10", cantripScaling: true } });
    expect(spell("cure-wounds").roll).toEqual({ kind: "heal", dice: "2d8", addMod: true, perSlotLevel: "2d8" });
    expect(spell("detect-magic")).toMatchObject({ ritual: true, concentration: true });
    expect(spell("shield").timing).toBe("reaction");
    expect(spell("healing-word").timing).toBe("bonus");
    expect(spell("conjure-animals")).toMatchObject({ save: "dex", roll: { dice: "3d10", damageType: "slashing" } });
    expect(spell("conjure-woodland-beings").save).toBe("wis");
  });

  it("le correzioni a mano si applicano", () => {
    expect(spell("web").roll).toBeUndefined();
    expect(spell("shocking-grasp").attack).toBe("melee");
    expect(spell("false-life").roll).toMatchObject({ kind: "tempHp", dice: "2d4+4" });
  });

  it("testo pulito: niente parole spezzate dall'a capo, titoletti in grassetto", () => {
    const text = all.map((s) => s.description).join("\n");
    expect(text).not.toMatch(/\p{Ll}- \p{Ll}/u);
    expect(spell("alarm").description).toContain("**Allarme acustico.**");
    expect(spell("fireball").higherLevels).toBe("I danni aumentano di 1d6 per ogni slot di livello superiore al 3º.");
  });
});

describe("Lanciare incantesimi SRD", () => {
  it("Palla di fuoco a slot di 5°: 10d6 e CD del lanciatore", () => {
    const p = castSpell(caster("t-wiz", 9, ["fireball"]), reg, "fireball", { slotLevel: 5 }, seededRng(1));
    expect(p.blocked).toBeUndefined();
    expect(p.rolls[0]).toMatchObject({ label: "Danni (fuoco)", expr: "10d6" });
    expect(p.lines.join(" ")).toContain("Destrezza, CD 15");
  });

  it("Dardo di fuoco al livello 5: tiro per colpire e 2d10", () => {
    const p = castSpell(caster("t-wiz", 5, [], ["fire-bolt"]), reg, "fire-bolt", {}, seededRng(1));
    expect(p.rolls.map((r) => r.expr)).toEqual(["1d20+6", "2d10"]);
  });

  it("cure: Parola guaritrice con modificatore, Guarigione a valore fisso", () => {
    const ch = caster("t-cle", 11, ["healing-word", "heal"]);
    expect(castSpell(ch, reg, "healing-word", {}, seededRng(1)).rolls[0]).toMatchObject({ label: "Cura", expr: "2d4+3" });
    expect(castSpell(ch, reg, "heal", {}, seededRng(1)).rolls[0]!.total).toBe(70);
    expect(castSpell({ ...ch, levels: [...ch.levels, ...ch.levels.slice(0, 2)] }, reg, "heal", { slotLevel: 7 }, seededRng(1)).rolls[0]!.total).toBe(80);
  });
});
