import type { AutomationLevel } from "./types.js";

/**
 * Livelli di automazione, scelti da ogni utente.
 *
 * - manual:   la scheda è un foglio intelligente. Mostra i calcoli ma ogni
 *             valore si può forzare; le azioni non toccano risorse né PF;
 *             nessun controllo sulle regole.
 * - assisted: calcola tutto e propone le modifiche (es. "Secondo Fiato: +8 PF,
 *             −1 uso. Applico?"); gli override sono permessi; le violazioni
 *             delle regole sono avvisi.
 * - full:     applica tutto da sé; gli override sono ignorati; le violazioni
 *             delle regole bloccano (level-up, uso di risorse esaurite...).
 */
export interface AutomationPolicy {
  applyOverrides: boolean;
  /** Le azioni calcolano esito e costo (tiri, cure, consumo risorse). */
  computeActions: boolean;
  /** Le modifiche calcolate si applicano senza conferma. */
  autoApply: boolean;
  /** Come trattare i problemi di regole. */
  validation: "off" | "warn" | "block";
  /** Impedire l'uso di risorse esaurite. */
  enforceResources: boolean;
}

export const AUTOMATION_POLICY: Record<AutomationLevel, AutomationPolicy> = {
  manual: { applyOverrides: true, computeActions: false, autoApply: false, validation: "off", enforceResources: false },
  assisted: { applyOverrides: true, computeActions: true, autoApply: false, validation: "warn", enforceResources: false },
  full: { applyOverrides: false, computeActions: true, autoApply: true, validation: "block", enforceResources: true },
};

export const AUTOMATION_LABELS: Record<AutomationLevel, { name: string; description: string }> = {
  manual: { name: "Manuale", description: "Inserisci tu i valori; la scheda mostra i calcoli come promemoria." },
  assisted: { name: "Assistita", description: "La scheda calcola e propone; confermi tu ogni modifica." },
  full: { name: "Completa", description: "La scheda applica le regole da sola e blocca le scelte non valide." },
};

export const DEFAULT_AUTOMATION: AutomationLevel = "assisted";

/**
 * Livello effettivo per un personaggio:
 * 1. se il Master ha bloccato la campagna su un livello, vince quello;
 * 2. altrimenti l'impostazione del personaggio;
 * 3. altrimenti la preferenza dell'utente;
 * 4. altrimenti "assisted".
 */
export function resolveAutomation(opts: {
  campaignLock?: AutomationLevel;
  character?: AutomationLevel;
  user?: AutomationLevel;
}): AutomationLevel {
  return opts.campaignLock ?? opts.character ?? opts.user ?? DEFAULT_AUTOMATION;
}
