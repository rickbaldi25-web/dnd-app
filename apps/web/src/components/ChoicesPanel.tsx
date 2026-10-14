import { ABILITIES, featsByTag } from "@dnd/engine";
import { useState } from "react";
import { optionLabel, registry } from "../content";
import { RichText } from "./RichText";
import type { CharacterController } from "../state/useCharacter";

type Pending = CharacterController["sheet"]["pendingChoices"][number];

/** Oltre questo numero di opzioni i pulsanti diventano un menu a tendina. */
const MANY = 24;

function optionsFor(c: CharacterController, p: Pending): string[] {
  if (p.kind === "subclass") {
    const classId = p.id.split(".")[0]!;
    return [...registry.subclasses.values()].filter((s) => s.classId === classId).map((s) => s.id);
  }
  if (Array.isArray(p.from)) return p.from;
  if (p.from && "tag" in p.from) {
    // Le opzioni con un livello minimo non ancora raggiunto non si propongono.
    return featsByTag(registry, p.from.tag)
      .filter((f) => {
        const min = f.prerequisites?.minLevel;
        return !min || (min.by === "total" ? c.sheet.level : (c.sheet.classLevels[min.by] ?? 0)) >= min.level;
      })
      .map((f) => f.id);
  }
  if (p.kind === "weaponMastery") return [...registry.items.values()].filter((i) => i.kind === "weapon").map((i) => i.id);
  if (p.kind === "abilityBoost") return [...ABILITIES];
  if (p.kind === "expertise") {
    return Object.entries(c.sheet.skills)
      .filter(([, s]) => s.proficient && !s.expertise)
      .map(([id]) => id);
  }
  return [];
}

/** Scelte ancora da fare (abilità, stile, sottoclasse, aumenti...). Compare solo se ce ne sono. */
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
  // L'ultima opzione toccata: se ne mostra il testo anche quando se ne scelgono più d'una.
  const [focus, setFocus] = useState<string | undefined>(current[0]);
  const options = optionsFor(c, p)
    .filter((o) => !(p.kind === "skill" && registry.backgrounds.get(c.ch.backgroundId)?.skills.includes(o)))
    .sort((a, b) => optionLabel(p.kind, a).localeCompare(optionLabel(p.kind, b), "it"));
  const need = p.required;
  const count = (o: string) => picked.filter((x) => x === o).length;
  // Con "repeat" la stessa opzione si può prendere più volte (+2 alla stessa caratteristica).
  const flip = (o: string) => {
    setFocus(o);
    setPicked((xs) => {
      if (p.repeat) return xs.length < need ? [...xs, o] : xs.includes(o) ? xs.filter((x) => x !== o) : xs;
      if (xs.includes(o)) return xs.filter((x) => x !== o);
      return need === 1 ? [o] : xs.length < need ? [...xs, o] : xs;
    });
  };
  const save = () =>
    c.update((ch) =>
      p.kind === "subclass"
        ? { ...ch, subclasses: { ...ch.subclasses, [p.id.split(".")[0]!]: picked[0]! } }
        : { ...ch, choices: { ...ch.choices, [p.id]: picked } },
    );
  const description = focus ? describe(p.kind, focus) : undefined;
  return (
    <div className="choice">
      <p>
        <strong>{p.label}</strong>{" "}
        <span className="muted">
          scegli {need}, {picked.length} selezionat{picked.length === 1 ? "a" : "e"}
        </span>
      </p>
      {options.length > MANY && need === 1 ? (
        <select value={picked[0] ?? ""} onChange={(e) => {
            setFocus(e.currentTarget.value || undefined);
            setPicked(e.currentTarget.value ? [e.currentTarget.value] : []);
          }} aria-label={p.label}>
          <option value="">—</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {optionLabel(p.kind, o)}
            </option>
          ))}
        </select>
      ) : (
        <div className="chips">
          {options.map((o) => (
            <button key={o} className={`chip ${picked.includes(o) ? "is-on" : ""}`} aria-pressed={picked.includes(o)} onClick={() => flip(o)}>
              {optionLabel(p.kind, o)}
              {count(o) > 1 ? ` ×${count(o)}` : ""}
            </button>
          ))}
        </div>
      )}
      {p.repeat && picked.length > 0 && (
        <button className="btn btn-quiet" onClick={() => setPicked([])}>
          Azzera
        </button>
      )}
      {description && <RichText className="muted small choice-description" text={description} />}
      <button className="btn btn-primary" disabled={picked.length !== need} onClick={save}>
        Conferma
      </button>
    </div>
  );
}

/** Testo dell'opzione scelta, per decidere senza aprire il manuale. Solo l'inizio: i testi sono lunghi. */
function describe(kind: string, id: string): string | undefined {
  const text = kind === "subclass" ? registry.subclasses.get(id)?.description : kind === "feat" ? registry.feats.get(id)?.feature.description : undefined;
  if (!text) return undefined;
  const name = kind === "subclass" ? registry.subclasses.get(id)?.name : registry.feats.get(id)?.name;
  return `${name}: ${text.length > 400 ? `${text.slice(0, 400).trimEnd()}…` : text}`;
}
