import { averageHpGain, levelUp } from "@dnd/engine";
import { useEffect, useRef, useState } from "react";
import { registry } from "../content";
import type { CharacterController } from "../state/useCharacter";

export function LevelUpDialog({ c, open, onClose }: { c: CharacterController; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const first = c.ch.levels[0]?.classId ?? "fighter";
  const [classId, setClassId] = useState(first);
  const [method, setMethod] = useState<"avg" | "roll" | "table">("avg");
  const [tableRoll, setTableRoll] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const cls = registry.classes.get(classId);
  const size = cls ? parseInt(cls.hitDie.slice(1), 10) : 0;
  const tableValue = Number(tableRoll);
  const valid = method !== "table" || (Number.isInteger(tableValue) && tableValue >= 1 && tableValue <= size);

  const submit = () => {
    const hp = method === "table" ? tableValue : method;
    const r = levelUp(c.ch, registry, classId, hp);
    // Completa: si applica. Assistita: chiede conferma. Manuale: si applica (è una scelta del giocatore),
    // ma i PF attuali restano da aggiornare a mano.
    c.act(r, { direct: c.automation === "manual" });
    onClose();
  };

  return (
    <dialog ref={ref} className="dialog" onClose={onClose} aria-labelledby="lvl-title">
      <h2 id="lvl-title">Sali di livello</h2>
      <label className="field">
        <span>Classe</span>
        <select value={classId} onChange={(e) => setClassId(e.currentTarget.value)}>
          {[...registry.classes.values()].map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
              {k.id !== first ? " (multiclasse)" : ""}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="field">
        <legend>Punti ferita ({cls?.hitDie})</legend>
        <label className="radio">
          <input type="radio" checked={method === "avg"} onChange={() => setMethod("avg")} /> Media ({averageHpGain(registry, classId)})
        </label>
        <label className="radio">
          <input type="radio" checked={method === "roll"} onChange={() => setMethod("roll")} /> Tira l'app
        </label>
        <label className="radio">
          <input type="radio" checked={method === "table"} onChange={() => setMethod("table")} /> Ho tirato al tavolo:
          <input
            type="number"
            min={1}
            max={size}
            value={tableRoll}
            onFocus={() => setMethod("table")}
            onChange={(e) => setTableRoll(e.currentTarget.value)}
            className="inline-number"
            aria-label="Risultato del dado"
          />
        </label>
        <p className="muted small">Al risultato si aggiunge il modificatore di Costituzione.</p>
      </fieldset>
      <div className="row end">
        <button className="btn btn-quiet" onClick={onClose}>
          Annulla
        </button>
        <button className="btn btn-primary" disabled={!valid} onClick={submit}>
          Sali di livello
        </button>
      </div>
    </dialog>
  );
}
