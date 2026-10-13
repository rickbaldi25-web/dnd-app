import type { BackgroundDef } from "@dnd/engine";
import { GAMING_SETS } from "../items/equipment.js";

export const soldier: BackgroundDef = {
  id: "soldier",
  name: "Soldato",
  abilities: ["str", "dex", "con"],
  featId: "savage-attacker",
  skills: ["athletics", "intimidation"],
  toolChoice: { label: "Set da gioco (Soldato)", from: GAMING_SETS },
};

export const criminal: BackgroundDef = {
  id: "criminal",
  name: "Criminale",
  abilities: ["dex", "con", "int"],
  featId: "alert",
  skills: ["sleight-of-hand", "stealth"],
  tools: ["thieves-tools"],
};
