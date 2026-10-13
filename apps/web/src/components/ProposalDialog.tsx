import { useEffect, useRef } from "react";
import type { CharacterController } from "../state/useCharacter";

/** Automazione assistita: il motore propone, il giocatore conferma. */
export function ProposalDialog({ c }: { c: CharacterController }) {
  const ref = useRef<HTMLDialogElement>(null);
  const p = c.pending;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (!p && d.open) d.close();
  }, [p]);
  return (
    <dialog ref={ref} className="dialog" onClose={c.cancel} aria-labelledby="proposal-title">
      {p && (
        <>
          <h2 id="proposal-title">{p.title}</h2>
          {p.rolls.map((r, i) => (
            <p key={i} className="log-roll">
              <span className="log-total">{r.total}</span>
              <span className="muted">
                {r.label}: {r.expr} [{r.dice.join(", ")}]
              </span>
            </p>
          ))}
          <ul className="proposal-lines">
            {p.lines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <div className="row end">
            <button className="btn btn-quiet" onClick={c.cancel}>
              Annulla
            </button>
            <button className="btn btn-primary" onClick={c.confirm} autoFocus>
              Applica
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
