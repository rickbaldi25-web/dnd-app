import { useEffect, useState, useSyncExternalStore } from "react";
import { applyHomebrew, contentVersion, subscribeContent } from "../content";
import { repo, type Homebrew } from "../data";

const EMPTY: Homebrew = { items: [], spells: [] };

/**
 * Carica i contenuti propri della campagna e li aggiunge al registro finché il componente è montato.
 * Restituisce anche un numero che cambia a ogni modifica del registro: chi calcola qualcosa
 * dai contenuti lo mette tra le dipendenze per ricalcolare.
 */
export function useHomebrew(campaignId: string | undefined): { homebrew: Homebrew; version: number } {
  const [homebrew, setHomebrew] = useState<Homebrew>(EMPTY);
  useEffect(() => {
    if (!campaignId) return;
    const off = repo.watchHomebrew(campaignId, (h) => {
      const next = h ?? EMPTY;
      setHomebrew(next);
      applyHomebrew(next);
    });
    return () => {
      off();
      setHomebrew(EMPTY);
      applyHomebrew(null);
    };
  }, [campaignId]);
  const version = useSyncExternalStore(subscribeContent, contentVersion);
  return { homebrew, version };
}
