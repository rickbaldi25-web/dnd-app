import type { MonsterDef, SpellDef } from "@dnd/engine";
import { describe, expect, it } from "vitest";
import { localizeAttack, localizePack, metres } from "../src/index.ts";

describe("italiano automatico", () => {
  it("converte le distanze in metri", () => {
    expect([metres(5), metres(30), metres(120), metres(15)]).toEqual(["1,5", "9", "36", "4,5"]);
  });

  it("traduce gli attacchi scritti nella forma standard e lascia le frasi in più", () => {
    expect(localizeAttack("Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.")).toBe(
      "Attacco con arma da mischia: +4 al tiro per colpire, portata 1,5 m, un bersaglio. Colpito: 5 (1d6 + 2) danni taglienti.",
    );
    expect(localizeAttack("Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage plus 7 (2d6) poison damage. The target falls.")).toBe(
      "Attacco con arma a distanza: +4 al tiro per colpire, gittata 24/96 m, un bersaglio. Colpito: 5 (1d6 + 2) danni perforanti più 7 (2d6) danni veleno. The target falls.",
    );
    expect(localizeAttack("The dragon roars.")).toBe("The dragon roars.");
  });

  it("traduce i dati di mostri e incantesimi senza traduzione, e lascia stare quelli tradotti", () => {
    const monster = (over: Partial<MonsterDef & { nameEn: string }> = {}): MonsterDef => ({
      id: "x",
      name: "X",
      size: "Large",
      type: "monstrosity (shapechanger)",
      alignment: "typically chaotic evil",
      ac: 14,
      acNote: "natural armor",
      hp: 30,
      speed: "30 ft., fly 60 ft. (hover)",
      senses: "darkvision 60 ft.",
      languages: "Common, telepathy 120 ft.",
      conditionImmunities: "charmed, frightened",
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      cr: "1",
      traits: [{ name: "Pack Tactics", text: "..." }],
      actions: [{ name: "Fire Breath (Recharge 5-6)", text: "..." }],
      ...over,
    });
    const spell: SpellDef = { id: "s", name: "S", level: 1, school: "evocation", castingTime: "1 bonus action", range: "Self (15-foot cone)", components: "V", duration: "Concentration, up to 1 minute", lists: [], description: "" };
    const done = monster({ nameEn: "Y", size: "Media" });
    const pack = { id: "p", name: "p", monsters: [monster(), done], spells: [spell] };
    localizePack(pack, { "fire breath": "Soffio di fuoco" });
    expect(pack.monsters[0]).toMatchObject({
      size: "Grande",
      type: "mostruosità (mutaforma)",
      alignment: "di solito caotico malvagio",
      acNote: "armatura naturale",
      speed: "9 m, volare 18 m (fluttuare)",
      senses: "scurovisione 18 m",
      languages: "Comune, telepatia 36 m",
      conditionImmunities: "affascinato, spaventato",
    });
    expect(pack.monsters[0]!.traits[0]!.name).toBe("Tattiche del branco");
    expect(pack.monsters[0]!.actions[0]!.name).toBe("Soffio di fuoco (Ricarica 5-6)");
    expect(done.size).toBe("Media");
    expect(done.speed).toBe("30 ft., fly 60 ft. (hover)");
    expect(spell).toMatchObject({ castingTime: "1 azione bonus", range: "Incantatore (cono di 4,5 m)", duration: "Concentrazione, fino a 1 minuto" });
  });
});
