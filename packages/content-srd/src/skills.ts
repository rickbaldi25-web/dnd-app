import type { SkillDef } from "@dnd/engine";

export const skills: SkillDef[] = [
  { id: "acrobatics", name: "Acrobazia", ability: "dex" },
  { id: "animal-handling", name: "Addestrare Animali", ability: "wis" },
  { id: "arcana", name: "Arcano", ability: "int" },
  { id: "athletics", name: "Atletica", ability: "str" },
  { id: "deception", name: "Inganno", ability: "cha" },
  { id: "history", name: "Storia", ability: "int" },
  { id: "insight", name: "Intuizione", ability: "wis" },
  { id: "intimidation", name: "Intimidire", ability: "cha" },
  { id: "investigation", name: "Indagare", ability: "int" },
  { id: "medicine", name: "Medicina", ability: "wis" },
  { id: "nature", name: "Natura", ability: "int" },
  { id: "perception", name: "Percezione", ability: "wis" },
  { id: "performance", name: "Intrattenere", ability: "cha" },
  { id: "persuasion", name: "Persuasione", ability: "cha" },
  { id: "religion", name: "Religione", ability: "int" },
  { id: "sleight-of-hand", name: "Rapidità di Mano", ability: "dex" },
  { id: "stealth", name: "Furtività", ability: "dex" },
  { id: "survival", name: "Sopravvivenza", ability: "wis" },
];

export const ALL_SKILL_IDS = skills.map((s) => s.id);
