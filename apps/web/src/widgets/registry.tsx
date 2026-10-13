import type { WidgetRef } from "@dnd/engine";
import type { ComponentType } from "react";
import type { CharacterController } from "../state/useCharacter";
import {
  AbilitiesWidget,
  ActionsWidget,
  AttacksWidget,
  CombatStatsWidget,
  ConditionsWidget,
  DeathSavesWidget,
  FeaturesWidget,
  HeroicInspirationWidget,
  HitDiceWidget,
  HpWidget,
  InventoryWidget,
  NotesWidget,
  ResourceWidget,
  SavesWidget,
  SkillsWidget,
  ToggleWidget,
} from "./core";

export interface WidgetProps {
  c: CharacterController;
  w: WidgetRef;
}

/**
 * Zone della scheda:
 * - "vitals": sempre in alto, ciò che si usa a ogni turno (PF, CA, risorse di classe)
 * - "play":   azioni, attacchi, condizioni
 * - "sheet":  la parte "statica" (caratteristiche, abilità, privilegi, inventario)
 */
export type Zone = "vitals" | "play" | "sheet";

interface WidgetDef {
  component: ComponentType<WidgetProps>;
  zone: Zone;
  /** Larghezza nella griglia desktop. */
  span?: 1 | 2;
}

/**
 * Registro widget: il motore dice QUALI widget servono (in base ai privilegi),
 * il frontend decide COME disegnarli. Un nuovo privilegio di classe con un
 * widget nuovo = una riga qui + il componente.
 */
export const WIDGETS: Record<string, WidgetDef> = {
  hp: { component: HpWidget, zone: "vitals" },
  "combat-stats": { component: CombatStatsWidget, zone: "vitals" },
  resource: { component: ResourceWidget, zone: "vitals" },
  toggle: { component: ToggleWidget, zone: "vitals" },
  "heroic-inspiration": { component: HeroicInspirationWidget, zone: "vitals" },
  "death-saves": { component: DeathSavesWidget, zone: "vitals" },
  actions: { component: ActionsWidget, zone: "play" },
  attacks: { component: AttacksWidget, zone: "play", span: 2 },
  conditions: { component: ConditionsWidget, zone: "play" },
  "hit-dice": { component: HitDiceWidget, zone: "play" },
  abilities: { component: AbilitiesWidget, zone: "sheet", span: 2 },
  saves: { component: SavesWidget, zone: "sheet" },
  skills: { component: SkillsWidget, zone: "sheet" },
  features: { component: FeaturesWidget, zone: "sheet", span: 2 },
  inventory: { component: InventoryWidget, zone: "sheet" },
  notes: { component: NotesWidget, zone: "sheet" },
};

/** Widget aggiunti dal frontend, non legati a un privilegio. */
export const EXTRA_WIDGETS: WidgetRef[] = [{ widget: "actions" }];
