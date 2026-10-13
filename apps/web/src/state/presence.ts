import { useEffect, useState } from "react";
import { PRESENCE_TTL_MS, repo, type Presence } from "../data";
import { useAuth } from "../firebase/auth";

const HEARTBEAT_MS = 30_000;

/**
 * Segnala che l'utente è nella campagna finché la pagina resta aperta,
 * e restituisce chi è connesso adesso. Senza campagna non fa nulla.
 */
export function usePresence(campaignId: string | undefined): Presence[] {
  const { user } = useAuth();
  const [list, setList] = useState<Presence[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!campaignId || !user) return;
    // Anche con la scheda in secondo piano: al tavolo si tiene aperta mentre si guarda altro.
    const beat = () => void repo.touchPresence(campaignId, { uid: user.uid, name: user.name }).catch(() => undefined);
    beat();
    const timer = setInterval(beat, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", beat);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", beat);
    };
  }, [campaignId, user]);

  useEffect(() => {
    setList([]);
    return campaignId ? repo.watchPresence(campaignId, setList) : undefined;
  }, [campaignId]);

  // I segnali scadono da soli: si ricontrolla l'ora a intervalli anche se non arriva nulla di nuovo.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);

  return list.filter((p) => now - p.at < PRESENCE_TTL_MS);
}
