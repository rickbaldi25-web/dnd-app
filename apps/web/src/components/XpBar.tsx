import { levelForXp, nextLevelXp, XP_FOR_LEVEL } from "@dnd/engine";
import { useState } from "react";
import type { CharacterController } from "../state/useCharacter";

const pe = (n: number) => n.toLocaleString("it-IT");

/**
 * Punti esperienza del personaggio: barra verso il livello successivo, campo per aggiungerne
 * (o toglierne, con un numero negativo) e l'avviso quando i PE bastano per salire.
 */
export function XpBar({ c, onLevelUp }: { c: CharacterController; onLevelUp: () => void }) {
  const [add, setAdd] = useState("");
  const xp = c.ch.xp ?? 0;
  const level = c.sheet.level;
  const next = nextLevelXp(level);
  const reachable = levelForXp(xp);
  const from = XP_FOR_LEVEL[Math.min(level, 20) - 1] ?? 0;
  const share = next === null ? 1 : Math.max(0, Math.min(1, (xp - from) / (next - from)));
  const n = Math.trunc(Number(add) || 0);
  const commit = () => {
    if (!n) return;
    c.update((ch) => ({ ...ch, xp: Math.max(0, (ch.xp ?? 0) + n) }));
    setAdd("");
  };
  return (
    <section className={`panel xp-bar ${reachable > level ? "can-level" : ""}`} aria-label="Punti esperienza">
      <div className="xp-line">
        <strong>PE {pe(xp)}</strong>
        <span className="muted small">{next === null ? "livello massimo" : `prossimo livello a ${pe(next)}`}</span>
      </div>
      <span className="party-bar xp-track" role="img" aria-label={`${Math.round(share * 100)}% verso il livello successivo`}>
        <span style={{ width: `${share * 100}%` }} />
      </span>
      <div className="row xp-tools">
        <input type="number" value={add} placeholder="PE" aria-label="PE da aggiungere (negativo per toglierli)" className="short-input" onChange={(e) => setAdd(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && commit()} />
        <button className="btn" disabled={!n} onClick={commit}>
          {n < 0 ? "Togli" : "Aggiungi"}
        </button>
        {reachable > level && (
          <button className="btn btn-primary" onClick={onLevelUp}>
            Puoi salire al {reachable}° livello
          </button>
        )}
      </div>
    </section>
  );
}
