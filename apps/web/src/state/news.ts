import { useEffect, useRef, useState } from "react";
import { repo, type Handout, type SessionNote } from "../data";
import { useLog } from "./log";

/*
 * Novità della campagna per un giocatore: handout appena mostrati e riassunti nuovi nel Diario.
 * Ciò che è già stato aperto si ricorda nel browser, per campagna.
 */
type Kind = "handouts" | "sessions";
const SEEN_EVENT = "dnd-seen";
const key = (kind: Kind, campaignId: string) => `dnd.${kind}.seen.${campaignId}`;

export function readSeen(kind: Kind, campaignId: string): Record<string, string | number> {
  try {
    return JSON.parse(localStorage.getItem(key(kind, campaignId)) ?? "{}");
  } catch {
    return {};
  }
}
export function markSeen(kind: Kind, campaignId: string, id: string, value: string | number) {
  try {
    localStorage.setItem(key(kind, campaignId), JSON.stringify({ ...readSeen(kind, campaignId), [id]: value }));
  } catch {
    /* storage bloccato: resta segnato solo per questa visita */
  }
  window.dispatchEvent(new Event(SEEN_EVENT));
}
/** Si aggiorna quando qualcosa viene segnato come visto, anche da un altro riquadro della pagina. */
export function useSeen(kind: Kind, campaignId: string): Record<string, string | number> {
  const [seen, setSeen] = useState(() => readSeen(kind, campaignId));
  useEffect(() => {
    const refresh = () => setSeen(readSeen(kind, campaignId));
    refresh();
    window.addEventListener(SEEN_EVENT, refresh);
    return () => window.removeEventListener(SEEN_EVENT, refresh);
  }, [kind, campaignId]);
  return seen;
}

/** Quando un handout è stato mostrato l'ultima volta: cambia se il Master lo rimostra. */
export const handoutStamp = (h: Handout) => h.revealedAt ?? h.createdAt;
export const isNewHandout = (h: Handout, seen: Record<string, string | number>) => Number(seen[h.id] ?? 0) < handoutStamp(h);

/** Impronta del riassunto: se il Master lo riscrive torna a contare come nuovo. */
export function recapStamp(s: SessionNote): string {
  let sum = 0;
  for (let i = 0; i < s.recap.length; i++) sum = (sum * 31 + s.recap.charCodeAt(i)) | 0;
  return `${s.recap.length}:${sum}`;
}
export const isNewRecap = (s: SessionNote, seen: Record<string, string | number>) => !!s.recap.trim() && seen[s.id] !== recapStamp(s);

export interface CampaignNews {
  handouts: number;
  diary: number;
}

/**
 * Conta le novità e avvisa quando ne arriva una mentre la pagina è aperta.
 * Il Master non ha novità: le cose le scrive lui.
 */
export function useCampaignNews(campaignId: string | undefined, uid: string | undefined, isDm: boolean): CampaignNews {
  const { push } = useLog();
  const [handouts, setHandouts] = useState<Handout[]>([]);
  const [sessions, setSessions] = useState<SessionNote[]>([]);
  const active = !!campaignId && !!uid && !isDm;
  const seenHandouts = useSeen("handouts", campaignId ?? "");
  const seenSessions = useSeen("sessions", campaignId ?? "");
  const known = useRef<{ handouts: Record<string, number> | null; sessions: Record<string, string> | null }>({ handouts: null, sessions: null });

  useEffect(() => {
    known.current = { handouts: null, sessions: null };
    setHandouts([]);
    setSessions([]);
    if (!active) return;
    const stopHandouts = repo.watchHandouts(campaignId, { uid, isDm: false }, setHandouts);
    const stopSessions = repo.watchSessions(campaignId, setSessions);
    return () => {
      stopHandouts();
      stopSessions();
    };
  }, [active, campaignId, uid]);

  // Avviso solo per ciò che arriva dopo l'apertura, non per quello che c'era già.
  useEffect(() => {
    if (!active) return;
    const now = Object.fromEntries(handouts.map((h) => [h.id, handoutStamp(h)]));
    const before = known.current.handouts;
    if (before) {
      const fresh = handouts.filter((h) => (before[h.id] ?? 0) < now[h.id]!);
      if (fresh.length) push({ title: fresh.length === 1 ? "Nuovo handout" : "Nuovi handout", lines: fresh.map((h) => h.title), rolls: [], tone: "good" });
    }
    known.current.handouts = now;
  }, [handouts, active, push]);
  useEffect(() => {
    if (!active) return;
    const now = Object.fromEntries(sessions.filter((s) => s.recap.trim()).map((s) => [s.id, recapStamp(s)]));
    const before = known.current.sessions;
    if (before) {
      const fresh = sessions.filter((s) => now[s.id] && before[s.id] !== now[s.id]);
      if (fresh.length) push({ title: "Nuovo riassunto nel Diario", lines: fresh.map((s) => s.title), rolls: [], tone: "good" });
    }
    known.current.sessions = now;
  }, [sessions, active, push]);

  if (!active) return { handouts: 0, diary: 0 };
  return { handouts: handouts.filter((h) => isNewHandout(h, seenHandouts)).length, diary: sessions.filter((s) => isNewRecap(s, seenSessions)).length };
}
