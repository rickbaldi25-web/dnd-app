import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface LogEntry {
  id: number;
  title: string;
  lines: string[];
  rolls?: { label: string; expr: string; dice: number[]; total: number }[];
  tone?: "info" | "good" | "bad" | "warn";
}

interface LogApi {
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
  const push = useCallback(
    (e: Omit<LogEntry, "id">) => {
      const id = ++seq;
      setEntries((xs) => [...xs.slice(-3), { ...e, id }]);
      window.setTimeout(() => dismiss(id), 7000);
    },
    [dismiss],
  );
  return <Ctx.Provider value={{ entries, push, dismiss }}>{children}</Ctx.Provider>;
}

export function useLog(): LogApi {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLog fuori da LogProvider");
  return v;
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
