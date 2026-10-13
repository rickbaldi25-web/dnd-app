import { featsByTag } from "@dnd/engine";
import { useState } from "react";
import { optionLabel, registry } from "../content";
import type { CharacterController } from "../state/useCharacter";

type Pending = CharacterController["sheet"]["pendingChoices"][number];

function optionsFor(c: CharacterController, p: Pending): string[] {
  if (p.kind === "subclass") {
    const classId = p.id.split(".")[0]!;
    return [...registry.subclasses.values()].filter((s) => s.classId === classId).map((s) => s.id);
  }
  if (Array.isArray(p.from)) return p.from;
  if (p.from && "tag" in p.from) return featsByTag(registry, p.from.tag).map((f) => f.id);
  if (p.kind === "weaponMastery") return [...registry.items.values()].filter((i) => i.kind === "weapon").map((i) => i.id);
  return [];
}

/** Scelte ancora da fare (abilità, maestrie, stile, sottoclasse...). Compare solo se ce ne sono. */
export function ChoicesPanel({ c }: { c: CharacterController }) {
  const pending = c.sheet.pendingChoices;
  if (!pending.length) return null;
  return (
    <section className="panel choices-panel" aria-labelledby="choices-title">
      <header className="panel-head">
        <h2 id="choices-title">Da completare</h2>
      </header>
      {pending.map((p) => (
        <ChoiceRow key={p.id} c={c} p={p} />
      ))}
    </section>
  );
}

function ChoiceRow({ c, p }: { c: CharacterController; p: Pending }) {
  const current = p.kind === "subclass" ? [] : (c.ch.choices[p.id] ?? []);
  const [picked, setPicked] = useState<string[]>(current);
  const options = optionsFor(c, p).filter((o) => !(p.kind === "skill" && registry.backgrounds.get(c.ch.backgroundId)?.skills.includes(o)));
  const need = p.required;
  const flip = (o: string) =>
    setPicked((xs) => (xs.includes(o) ? xs.filter((x) => x !== o) : need === 1 ? [o] : xs.length < need ? [...xs, o] : xs));
  const save = () =>
    c.update((ch) =>
      p.kind === "subclass"
        ? { ...ch, subclasses: { ...ch.subclasses, [p.id.split(".")[0]!]: picked[0]! } }
        : { ...ch, choices: { ...ch.choices, [p.id]: picked } },
    );
  return (
    <div className="choice">
      <p>
        <strong>{p.label}</strong>{" "}
        <span className="muted">
          scegli {need}, {picked.length} selezionat{picked.length === 1 ? "a" : "e"}
        </span>
      </p>
      <div className="chips">
        {options.map((o) => (
          <button key={o} className={`chip ${picked.includes(o) ? "is-on" : ""}`} aria-pressed={picked.includes(o)} onClick={() => flip(o)}>
            {optionLabel(p.kind, o)}
          </button>
        ))}
      </div>
      <button className="btn btn-primary" disabled={picked.length !== need} onClick={save}>
        Conferma
      </button>
    </div>
  );
}
