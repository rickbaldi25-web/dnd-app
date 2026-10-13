import { srd } from "../../content-srd/src/index.js";
import { createCharacter, createRegistry, type AutomationLevel, type CharacterData } from "../src/index.js";

export const reg = createRegistry(srd);

/** Barbaro nano soldato, liv. 1 (array standard). For 17, Des 13, Cos 15. */
export function makeBarbarian(automation: AutomationLevel = "full"): CharacterData {
  return createCharacter(
    {
      id: "bruna",
      name: "Bruna Spaccaroccia",
      speciesId: "dwarf",
      backgroundId: "soldier",
      classId: "barbarian",
      abilityScores: { str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
      backgroundBoosts: { str: 2, con: 1 },
      choices: {
        "barbarian.skills": ["perception", "survival"],
        "barbarian.weaponMastery": ["greataxe", "handaxe"],
        "background.tool": ["dice-set"],
      },
      equipment: [{ itemId: "greataxe", equipped: true }, { itemId: "handaxe", quantity: 2 }],
      automation,
    },
    reg,
  );
}

/** Guerriero umano criminale, liv. 1, arciere. Des 17, Cos 15, Robusto da Versatile. */
export function makeFighter(automation: AutomationLevel = "full"): CharacterData {
  return createCharacter(
    {
      id: "lino",
      name: "Lino Freccia",
      speciesId: "human",
      backgroundId: "criminal",
      classId: "fighter",
      abilityScores: { str: 8, dex: 15, con: 14, int: 12, wis: 13, cha: 10 },
      backgroundBoosts: { dex: 2, con: 1 },
      choices: {
        "fighter.skills": ["perception", "athletics"],
        "fighter.weaponMastery": ["longbow", "shortsword", "dagger"],
        "fighter.fighting-style": ["fs-archery"],
        "human.skillful": ["insight"],
        "human.versatile": ["tough"],
      },
      equipment: [
        { itemId: "leather", equipped: true },
        { itemId: "longbow", equipped: true },
        { itemId: "shortsword", equipped: true },
      ],
      automation,
    },
    reg,
  );
}
