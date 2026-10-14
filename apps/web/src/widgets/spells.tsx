import {
  castSpell,
  endConcentration,
  formatMod,
  setSlotsSpent,
  spellsForList,
  type ComputedSpell,
  type ComputedSpellSource,
  type SlotPool,
  type SpellDef,
  type SpellSelection,
} from "@dnd/engine";
import { useState } from "react";
import { RichText } from "../components/RichText";
import { ABILITY_NAMES, registry } from "../content";
import type { CharacterController } from "../state/useCharacter";
import { Panel } from "./core";
import type { WidgetProps } from "./registry";

const SCHOOLS: Record<string, string> = {
  abjuration: "abiurazione",
  conjuration: "evocazione",
  divination: "divinazione",
  enchantment: "ammaliamento",
  evocation: "invocazione",
  illusion: "illusione",
  necromancy: "necromanzia",
  transmutation: "trasmutazione",
};

const levelLabel = (level: number) => (level === 0 ? "Trucchetti" : `${level}° livello`);

/** Oltre questo numero l'elenco chiede di affinare la ricerca invece di allungarsi. */
const MAX_ROWS = 60;

/* ------------------------------------------------------------------ */
/* Slot                                                                */
/* ------------------------------------------------------------------ */

function SlotRow({ c, pool, label, target }: { c: CharacterController; pool: SlotPool; label: string; target: number | "pact" }) {
  // Correzione a mano, come i pallini delle risorse: si salva senza passare dal registro.
  const set = (remaining: number) => c.update((ch) => ({ ...ch, state: setSlotsSpent(ch, target, pool.max - remaining).state }));
  return (
    <div className="slot-row">
      <span className="slot-label">{label}</span>
      <div className="pips" role="group" aria-label={`Slot ${label}: ${pool.remaining} su ${pool.max}`}>
        {Array.from({ length: pool.max }, (_, i) => {
          const filled = i < pool.remaining;
          return (
            <button
              key={i}
              className={`pip pip-small ${filled ? "is-filled" : ""}`}
              aria-label={filled ? `Spendi (restano ${i})` : `Recupera (arrivi a ${i + 1})`}
              onClick={() => set(filled ? i : i + 1)}
            />
          );
        })}
      </div>
      <span className="muted small">
        {pool.remaining}/{pool.max}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Incantesimi pronti                                                  */
/* ------------------------------------------------------------------ */

function SpellText({ spell }: { spell: SpellDef }) {
  return (
    <>
      <p className="muted small">
        {[spell.castingTime, spell.range, spell.components, spell.duration].filter(Boolean).join(" · ")}
      </p>
      <RichText className="spell-text" text={spell.description} />
      {spell.higherLevels && <RichText className="spell-text" text={`**A livelli superiori.** ${spell.higherLevels}`} />}
    </>
  );
}

function tags(s: { level: number; school: string; concentration?: boolean; ritual?: boolean }, extra: string[] = []): string {
  return [SCHOOLS[s.school] ?? s.school, s.concentration ? "concentrazione" : "", s.ritual ? "rituale" : "", ...extra].filter(Boolean).join(", ");
}

function ReadySpell({ c, e }: { c: CharacterController; e: ComputedSpell }) {
  const spell = registry.spells.get(e.spellId);
  const sc = c.sheet.spellcasting!;
  if (!spell) return null;
  const cast = (opts: Parameters<typeof castSpell>[3] = {}) => c.act(castSpell(c.ch, registry, e.spellId, { sourceId: e.sourceId, ...opts }));
  const pools = sc.slots.filter((p) => p.level >= e.level && p.remaining > 0);
  const pactOk = sc.pact && sc.pact.level >= e.level && sc.pact.remaining > 0;
  const resource = e.resource ? c.sheet.resources.find((r) => r.id === e.resource) : undefined;
  const numbers = [e.attackBonus !== undefined ? `attacco ${formatMod(e.attackBonus)}` : "", e.saveDC !== undefined && e.save ? `TS ${ABILITY_NAMES[e.save].short} CD ${e.saveDC}` : "", e.roll ?? ""].filter(Boolean);
  return (
    <details className="spell">
      <summary>
        <span>
          {e.name} <span className="muted small">{tags(e, e.always ? ["sempre preparato"] : [])}</span>
        </span>
        <span className="muted small">{numbers.join(" · ")}</span>
      </summary>
      <SpellText spell={spell} />
      <div className="row">
        {e.level === 0 ? (
          <button className="btn btn-primary" onClick={() => cast()}>
            Lancia
          </button>
        ) : (
          <>
            {pools.map((p) => (
              <button key={p.level} className={`btn ${p.level === pools[0]!.level ? "btn-primary" : ""}`} onClick={() => cast({ slotLevel: p.level })}>
                Slot di {p.level}°
              </button>
            ))}
            {pactOk && (
              <button className="btn" onClick={() => cast({ pact: true })}>
                Slot del Patto ({sc.pact!.level}°)
              </button>
            )}
            {resource && resource.remaining > 0 && (
              <button className="btn" onClick={() => cast({ useResource: true })}>
                Senza slot ({resource.name})
              </button>
            )}
            {e.ritual && (
              <button className="btn" onClick={() => cast({ ritual: true })}>
                Rituale
              </button>
            )}
            {!pools.length && !pactOk && <span className="muted small">Nessuno slot disponibile per questo incantesimo.</span>}
          </>
        )}
      </div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Scelta degli incantesimi                                            */
/* ------------------------------------------------------------------ */

type Tab = "cantrips" | "prepared" | "book";

function Picker({ c, s }: { c: CharacterController; s: ComputedSpellSource }) {
  const [tab, setTab] = useState<Tab>(s.cantripsMax > s.cantrips.length ? "cantrips" : s.spellbook ? "book" : "prepared");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<number | "all">("all");
  const sel: SpellSelection = c.ch.spells?.[s.id] ?? { cantrips: [], prepared: [] };
  const book = sel.spellbook ?? [];
  const known = s.changeOn === "levelUp";
  const preparedLabel = known ? "Conosciuti" : "Preparati";

  const all = spellsForList(registry, s.list, Math.max(1, s.maxSpellLevel));
  const pool =
    tab === "cantrips"
      ? all.filter((x) => x.level === 0)
      : tab === "book" || !s.spellbook
        ? all.filter((x) => x.level > 0)
        : all.filter((x) => x.level > 0 && book.includes(x.id));
  const chosen = tab === "cantrips" ? sel.cantrips : tab === "prepared" ? sel.prepared : book;
  const max = tab === "cantrips" ? s.cantripsMax : tab === "prepared" ? s.preparedMax : undefined;
  const full = max !== undefined && chosen.length >= max;
  const q = query.trim().toLowerCase();
  const shown = pool.filter((x) => (level === "all" || x.level === level) && (!q || x.name.toLowerCase().includes(q) || x.nameEn?.toLowerCase().includes(q)));
  const levels = [...new Set(pool.map((x) => x.level))];

  const toggle = (id: string) =>
    c.update((ch) => {
      const cur: SpellSelection = ch.spells?.[s.id] ?? { cantrips: [], prepared: [] };
      const flip = (list: string[]) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
      const next: SpellSelection =
        tab === "cantrips"
          ? { ...cur, cantrips: flip(cur.cantrips) }
          : tab === "prepared"
            ? { ...cur, prepared: flip(cur.prepared) }
            : // Togliere un incantesimo dal libro lo toglie anche dai preparati.
              { ...cur, spellbook: flip(cur.spellbook ?? []), prepared: (cur.spellbook ?? []).includes(id) ? cur.prepared.filter((x) => x !== id) : cur.prepared };
      return { ...ch, spells: { ...ch.spells, [s.id]: next } };
    });

  const tabs: { id: Tab; label: string }[] = [
    ...(s.cantripsMax > 0 ? [{ id: "cantrips" as const, label: `Trucchetti ${sel.cantrips.length}/${s.cantripsMax}` }] : []),
    ...(s.spellbook ? [{ id: "book" as const, label: `Libro ${book.length}` }] : []),
    { id: "prepared", label: `${preparedLabel} ${sel.prepared.length}/${s.preparedMax}` },
  ];

  return (
    <div className="spell-picker">
      <div className="chips" role="tablist" aria-label={`Incantesimi da ${s.name}`}>
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`chip ${tab === t.id ? "is-on" : ""}`} onClick={() => { setTab(t.id); setLevel("all"); }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "book" && <p className="muted small">Il libro parte con sei incantesimi di 1° livello e ne guadagna due a ogni livello da mago, più quelli che copi durante le avventure.</p>}
      {tab === "prepared" && s.spellbook && book.length === 0 && <p className="muted small">Il libro è vuoto: aggiungi prima gli incantesimi al libro.</p>}
      <div className="row spell-filters">
        <input type="search" value={query} placeholder="Cerca per nome…" aria-label="Cerca un incantesimo" onChange={(e) => setQuery(e.currentTarget.value)} />
        {levels.length > 1 && (
          <select value={String(level)} aria-label="Livello" onChange={(e) => setLevel(e.currentTarget.value === "all" ? "all" : Number(e.currentTarget.value))}>
            <option value="all">Tutti i livelli</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {levelLabel(l)}
              </option>
            ))}
          </select>
        )}
      </div>
      <ul className="spell-options">
        {shown.slice(0, MAX_ROWS).map((x) => {
          const on = chosen.includes(x.id);
          return (
            <li key={x.id}>
              <input type="checkbox" checked={on} disabled={!on && full} aria-label={x.name} onChange={() => toggle(x.id)} />
              <details className="spell">
                <summary>
                  <span>{x.name}</span>
                  <span className="muted small">{[x.level > 0 ? `${x.level}°` : "", tags(x)].filter(Boolean).join(" · ")}</span>
                </summary>
                <SpellText spell={x} />
              </details>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p className="muted small">Nessun incantesimo corrisponde.</p>}
      {shown.length > MAX_ROWS && <p className="muted small">Altri {shown.length - MAX_ROWS}: affina la ricerca o scegli un livello.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Riquadro                                                            */
/* ------------------------------------------------------------------ */

export function SpellsWidget({ c }: WidgetProps) {
  const sc = c.sheet.spellcasting;
  const [picking, setPicking] = useState<string | null>(null);
  if (!sc) return null;
  const byLevel = new Map<number, ComputedSpell[]>();
  for (const e of sc.spells) byLevel.set(e.level, [...(byLevel.get(e.level) ?? []), e]);
  const several = sc.sources.length > 1;

  return (
    <Panel title="Incantesimi" className="spells-panel">
      {sc.sources.map((s) => {
        const missing = s.cantrips.length < s.cantripsMax || s.prepared.length < s.preparedMax;
        const open = picking === s.id;
        return (
          <div key={s.id} className="spell-source">
            <div className="row between">
              <p>
                <strong>{s.name}</strong>{" "}
                <span className="muted">
                  {ABILITY_NAMES[s.ability].name} · CD {s.saveDC.value} · attacco {formatMod(s.attackBonus.value)}
                </span>
              </p>
              <button className={`btn ${missing && !open ? "btn-primary" : ""}`} aria-expanded={open} onClick={() => setPicking(open ? null : s.id)}>
                {open ? "Chiudi" : missing ? "Scegli incantesimi" : "Cambia incantesimi"}
              </button>
            </div>
            {open && <Picker c={c} s={s} />}
          </div>
        );
      })}

      {(sc.slots.length > 0 || sc.pact) && (
        <div className="slots">
          {sc.slots.map((p) => (
            <SlotRow key={p.level} c={c} pool={p} label={`${p.level}°`} target={p.level} />
          ))}
          {sc.pact && <SlotRow c={c} pool={sc.pact} label={`Patto ${sc.pact.level}°`} target="pact" />}
        </div>
      )}

      {sc.concentration && (
        <p className="concentration">
          Concentrazione su <strong>{sc.concentration.name}</strong>{" "}
          <button className="link-btn" onClick={() => c.act(endConcentration(c.ch), { direct: true })}>
            Termina
          </button>
        </p>
      )}

      {sc.spells.length === 0 && <p className="muted">Nessun incantesimo pronto: sceglili qui sopra.</p>}
      {[...byLevel.entries()].map(([level, list]) => (
        <div key={level} className="spell-level">
          <h3>{levelLabel(level)}</h3>
          <div className="feature-list">
            {list.map((e) => (
              <ReadySpell key={`${e.sourceId}-${e.spellId}`} c={c} e={several ? { ...e, name: `${e.name} (${e.sourceName})` } : e} />
            ))}
          </div>
        </div>
      ))}
    </Panel>
  );
}
