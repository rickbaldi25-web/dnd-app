import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { repo } from "../data";

export interface LogEntry {
  id: number;
  title: string;
  lines: string[];
  rolls?: { label: string; expr: string; dice: number[]; total: number }[];
  tone?: "info" | "good" | "bad" | "warn";
}

/** Dove finiscono i tiri oltre che a schermo: la campagna aperta, a nome di chi. */
export interface ShareTarget {
  campaignId: string;
  uid: string;
  author: string;
  /** Solo il Master può tirare in segreto. */
  canHide: boolean;
}

const SECRET_KEY = "dnd.rolls.secret";
export function isSecretRolling(): boolean {
  try {
    return localStorage.getItem(SECRET_KEY) === "1";
  } catch {
    return false;
  }
}
export function setSecretRolling(on: boolean) {
  try {
    localStorage.setItem(SECRET_KEY, on ? "1" : "0");
  } catch {
    /* ignora */
  }
}

interface LogApi {
  share: (target: ShareTarget | null) => void;
  entries: LogEntry[];
  push: (e: Omit<LogEntry, "id">) => void;
  dismiss: (id: number) => void;
}

const Ctx = createContext<LogApi | null>(null);
let seq = 0;

/** Registro dei tiri e degli esiti, mostrato come pila di avvisi. */
export function LogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const dismiss = useCallback((id: number) => setEntries((xs) => xs.filter((x) => x.id !== id)), []);
  const target = useRef<ShareTarget | null>(null);
  const share = useCallback((t: ShareTarget | null) => {
    target.current = t;
  }, []);
  const push = useCallback(
    (e: Omit<LogEntry, "id">) => {
      const t = target.current;
      // Solo i tiri di dado vanno alla campagna: gli avvisi restano a chi li ha provocati.
      if (t && e.rolls?.length) {
        const secret = t.canHide && isSecretRolling();
        repo.addRoll(t.campaignId, { uid: t.uid, author: t.author, title: e.title, rolls: e.rolls, at: Date.now(), ...(secret ? { secret: true } : {}) }).catch(() => undefined);
      }
      const id = ++seq;
      setEntries((xs) => [...xs.slice(-3), { ...e, id }]);
      window.setTimeout(() => dismiss(id), 7000);
    },
    [dismiss],
  );
  return <Ctx.Provider value={{ share, entries, push, dismiss }}>{children}</Ctx.Provider>;
}

export function useLog(): LogApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLog fuori da LogProvider");
  return v;
}

/** Finché il componente è montato, i tiri vanno anche al registro di questa campagna. */
export function useShareRolls(target: ShareTarget | null) {
  const { share } = useLog();
  const key = target ? `${target.campaignId}|${target.uid}|${target.author}|${target.canHide}` : "";
  useEffect(() => {
    share(target);
    return () => share(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, share]);
}

export function LogStack() {
  const { entries, dismiss } = useLog();
  return (
    <div className="log-stack" aria-live="polite">
      {entries.map((e) => (
        <div key={e.id} className={`log-entry tone-${e.tone ?? "info"}`}>
          <div className="log-head">
            <strong>{e.title}</strong>
            <button className="icon-btn" onClick={() => dismiss(e.id)} aria-label="Chiudi">
              ×
            </button>
          </div>
          {e.rolls?.map((r, i) => (
            <div key={i} className="log-roll">
              <span className="log-total">{r.total}</span>
              <span className="muted">
                {r.label}: {r.expr} [{r.dice.join(", ")}]
              </span>
            </div>
          ))}
          {e.lines.map((l, i) => (
            <div key={i} className="log-line">
              {l}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
