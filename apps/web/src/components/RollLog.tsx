import { roll } from "@dnd/engine";
import { useEffect, useState } from "react";
import { repo, type SharedRoll } from "../data";
import { isSecretRolling, setSecretRolling, useLog } from "../state/log";

const SHOWN = 25;
const DICE = [4, 6, 8, 10, 12, 20, 100];

const time = (at: number) => new Date(at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

/** Registro dei tiri della campagna: quelli di tutti, più i tiri segreti che vede solo il Master. */
export function RollLog({ campaignId, isDm }: { campaignId: string; isDm: boolean }) {
  const [open, setOpen] = useState<SharedRoll[]>([]);
  const [hidden, setHidden] = useState<SharedRoll[]>([]);
  const [secret, setSecret] = useState(isSecretRolling);
  useEffect(() => repo.watchRolls(campaignId, false, setOpen), [campaignId]);
  useEffect(() => (isDm ? repo.watchRolls(campaignId, true, setHidden) : undefined), [campaignId, isDm]);
  const { push } = useLog();
  // Un dado al volo, per chi non ha quello vero a portata di mano: finisce nel registro come gli altri tiri.
  const quick = (sides: number) => {
    const r = roll(`1d${sides}`);
    push({ title: `d${sides}`, lines: [], rolls: [{ label: `d${sides}`, expr: `1d${sides}`, dice: r.rolls.map((x) => x.value), total: r.total }] });
  };
  const all = [...open, ...(isDm ? hidden : [])].sort((a, b) => b.at - a.at).slice(0, SHOWN);

  return (
    <section className="panel roll-log">
      <div className="row between">
        <h2>Tiri</h2>
        {isDm && (
          <label className="small">
            <input
              type="checkbox"
              checked={secret}
              onChange={(e) => {
                setSecret(e.currentTarget.checked);
                setSecretRolling(e.currentTarget.checked);
              }}
            />{" "}
            I miei tiri sono segreti
          </label>
        )}
      </div>
      <div className="chips" role="group" aria-label="Tira un dado">
        {DICE.map((d) => (
          <button key={d} className="chip" onClick={() => quick(d)}>
            d{d}
          </button>
        ))}
      </div>
      {all.length === 0 && <p className="muted small">Ancora nessun tiro. Quelli fatti dalle schede compaiono qui per tutti.</p>}
      <ul className="roll-list">
        {all.map((r) => (
          <li key={r.id} className={r.secret ? "is-secret" : ""}>
            <span className="roll-total">{r.rolls[0]?.total ?? ""}</span>
            <span className="roll-what">
              <strong>{r.author}</strong> · {r.title}
              {r.secret && <span className="tag"> segreto</span>}
              <span className="muted small roll-detail">
                {r.rolls.map((x) => `${x.label}: ${x.expr} [${x.dice.join(", ")}]${r.rolls.length > 1 ? ` = ${x.total}` : ""}`).join(" · ")}
              </span>
            </span>
            <span className="muted small">{time(r.at)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
