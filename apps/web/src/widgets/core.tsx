import {
  ABILITIES,
  applyDamage,
  applyHealing,
  critDice,
  formatMod,
  longRest,
  roll,
  rollD20,
  setTempHp,
  setToggle,
  shortRest,
  useAction as runAction,
  type Coin,
  type Die,
  type RollMode,
  type Stat,
} from "@dnd/engine";
import { createContext, useContext, useEffect, useState } from "react";
import { ABILITY_NAMES, CONDITIONS, DAMAGE_TYPES, SENSES, TIMING, ftToM, isHomebrew, itemName, registry } from "../content";
import { COINS, ItemSearch } from "../components/ItemSearch";
import { RichText } from "../components/RichText";
import { giveTo } from "../components/Loot";
import { useLog } from "../state/log";
import type { CharacterController } from "../state/useCharacter";
import type { WidgetProps } from "./registry";

/* ------------------------------------------------------------------ */
/* Utilità comuni                                                      */
/* ------------------------------------------------------------------ */

/** Modalità "Correggi valori": i numeri diventano campi che impostano un override. */
export const EditModeContext = createContext(false);

export function Panel({ title, children, aside, className = "" }: { title?: string; children: React.ReactNode; aside?: React.ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      {(title || aside) && (
        <header className="panel-head">
          {title && <h2>{title}</h2>}
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

export function breakdown(s: Stat): string {
  const lines = s.parts.map((p) => `${p.label}: ${formatMod(p.value)}`);
  if (s.overridden) lines.push(`Forzato a mano (calcolato: ${s.computed})`);
  return lines.join("\n");
}

/** Numero con dettaglio del calcolo; in modalità correzione diventa un campo di override. */
export function StatNumber({ c, path, s, signed = false }: { c: CharacterController; path: string; s: Stat; signed?: boolean }) {
  const edit = useContext(EditModeContext) && c.automation !== "full";
  if (edit) {
    return (
      <input
        className="stat-input"
        type="number"
        defaultValue={s.value}
        aria-label={`Valore per ${path}`}
        onBlur={(e) => {
          const v = e.currentTarget.value;
          c.update((ch) => {
            const overrides = { ...ch.overrides };
            if (v === "" || Number(v) === s.computed) delete overrides[path];
            else overrides[path] = Number(v);
            return { ...ch, overrides };
          });
        }}
      />
    );
  }
  return (
    <span className={`stat-number ${s.overridden ? "is-overridden" : ""}`} title={breakdown(s)}>
      {signed ? formatMod(s.value) : s.value}
    </span>
  );
}

export function useRoller() {
  const { push } = useLog();
  return (label: string, bonus: number, mode: RollMode = "normal") => {
    const r = rollD20(bonus, mode);
    push({
      title: label,
      lines: [mode === "normal" ? "" : mode === "advantage" ? "Con vantaggio" : "Con svantaggio", r.nat20 ? "20 naturale!" : r.nat1 ? "1 naturale." : ""].filter(Boolean),
      rolls: [{ label: "d20", expr: `1d20${formatMod(bonus)}`, dice: r.rolls, total: r.total }],
      tone: r.nat20 ? "good" : r.nat1 ? "bad" : "info",
    });
  };
}

/* ------------------------------------------------------------------ */
/* Vitali                                                              */
/* ------------------------------------------------------------------ */

export function HpWidget({ c }: WidgetProps) {
  const { ch, sheet } = c;
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const max = sheet.hpMax.value;
  const cur = ch.state.hpCurrent;
  const pct = max ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0;
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  const done = () => setAmount("");

  return (
    <Panel className="hp-panel" title="Punti ferita">
      <div className="hp-readout">
        <span className={`hp-current ${cur === 0 ? "is-down" : pct <= 50 ? "is-bloodied" : ""}`}>{cur}</span>
        <span className="hp-max">
          / <StatNumber c={c} path="hp.max" s={sheet.hpMax} />
        </span>
        {ch.state.hpTemp > 0 && <span className="hp-temp" title="PF temporanei">+{ch.state.hpTemp} temp</span>}
      </div>
      <div className="hp-bar" role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={cur} aria-label="Punti ferita">
        <div className="hp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="hp-controls">
        <input
          className="hp-amount"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
          aria-label="Quantità"
        />
        <button className="btn btn-danger" disabled={!n} onClick={() => (c.act(applyDamage(ch, sheet, n, { type: type || undefined, typeLabel: DAMAGE_TYPES[type] }), { direct: true }), done())}>
          Danno
        </button>
        <button className="btn btn-heal" disabled={!n} onClick={() => (c.act(applyHealing(ch, sheet, n), { direct: true }), done())}>
          Cura
        </button>
        <button className="btn" disabled={!n} onClick={() => (c.act(setTempHp(ch, n), { direct: true }), done())}>
          Temp
        </button>
      </div>
      <label className="hp-type">
        <span className="muted">Tipo di danno</span>
        <select value={type} onChange={(e) => setType(e.currentTarget.value)}>
          <option value="">qualsiasi</option>
          {Object.entries(DAMAGE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
              {sheet.resistances.includes(k) ? " (resistente)" : sheet.immunities.includes(k) ? " (immune)" : ""}
            </option>
          ))}
        </select>
      </label>
    </Panel>
  );
}

export function CombatStatsWidget({ c }: WidgetProps) {
  const { sheet } = c;
  const roller = useRoller();
  return (
    <Panel className="combat-panel">
      <dl className="combat-grid">
        <div className="combat-ac">
          <dt>CA</dt>
          <dd>
            <StatNumber c={c} path="ac" s={sheet.ac} />
          </dd>
        </div>
        <div>
          <dt>Iniziativa</dt>
          <dd>
            <button className="roll-btn" onClick={() => roller("Iniziativa", sheet.initiative.value, sheet.initiative.advantage ? "advantage" : "normal")}>
              <StatNumber c={c} path="initiative" s={sheet.initiative} signed />
              {sheet.initiative.advantage && <span className="adv" title="Vantaggio">V</span>}
            </button>
          </dd>
        </div>
        <div>
          <dt>Velocità</dt>
          <dd title={breakdown(sheet.speed)}>{ftToM(sheet.speed.value)}</dd>
        </div>
        <div>
          <dt>Competenza</dt>
          <dd>{formatMod(sheet.proficiencyBonus)}</dd>
        </div>
        <div>
          <dt>Percezione passiva</dt>
          <dd>{sheet.passivePerception}</dd>
        </div>
        {sheet.critRange < 20 && (
          <div>
            <dt>Critico</dt>
            <dd>{sheet.critRange}–20</dd>
          </div>
        )}
      </dl>
      {(sheet.senses.length > 0 || sheet.resistances.length > 0) && (
        <p className="traits">
          {sheet.senses.map((s) => (
            <span key={s.sense}>
              {SENSES[s.sense] ?? s.sense} {ftToM(s.range)}
            </span>
          ))}
          {sheet.resistances.length > 0 && <span>Resistenze: {sheet.resistances.map((r) => DAMAGE_TYPES[r] ?? r).join(", ")}</span>}
        </p>
      )}
    </Panel>
  );
}

/** Oltre questo massimo i pallini non si contano più a colpo d'occhio: si passa a un contatore. */
const PIPS_MAX = 12;

/** Pallini (o contatore, se sono tanti) di una risorsa: si toccano per spendere o recuperare. */
export function ResourcePips({ c, r }: { c: CharacterController; r: CharacterController["sheet"]["resources"][number] }) {
  const setRemaining = (rem: number) =>
    c.update((ch) => ({ ...ch, state: { ...ch.state, resourcesSpent: { ...ch.state.resourcesSpent, [r.id]: r.max - rem } } }));
  return r.max > PIPS_MAX ? (
    <div className="counter">
      <button className="btn" aria-label="Spendi 1" disabled={r.remaining <= 0} onClick={() => setRemaining(r.remaining - 1)}>
        −
      </button>
      <input
        type="number"
        min={0}
        max={r.max}
        value={r.remaining}
        aria-label={`${r.name}: rimasti su ${r.max}`}
        onChange={(e) => setRemaining(Math.max(0, Math.min(r.max, Number(e.currentTarget.value) || 0)))}
      />
      <button className="btn" aria-label="Recupera 1" disabled={r.remaining >= r.max} onClick={() => setRemaining(r.remaining + 1)}>
        +
      </button>
    </div>
  ) : (
    <div className="pips" role="group" aria-label={`${r.name}: ${r.remaining} su ${r.max}`}>
      {Array.from({ length: r.max }, (_, i) => {
        const filled = i < r.remaining;
        return (
          <button
            key={i}
            className={`pip ${filled ? "is-filled" : ""}`}
            aria-label={filled ? `Spendi (resta ${i})` : `Recupera (arriva a ${i + 1})`}
            onClick={() => setRemaining(filled ? i : i + 1)}
          />
        );
      })}
    </div>
  );
}

/** Interruttore di uno stato di classe (Ira, Forma selvatica...): attivarlo può spendere un uso. */
export function ToggleSwitch({ c, t }: { c: CharacterController; t: CharacterController["sheet"]["toggles"][number] }) {
  const onAction = c.sheet.actions.find((a) => a.outcome?.kind === "toggleOn" && a.outcome.toggle === t.id);
  const flip = () => {
    if (!t.active && onAction) c.act(runAction(c.ch, registry, onAction.id));
    else c.act(setToggle(c.ch, t.id, !t.active), { direct: true });
  };
  return (
    <button className="toggle" role="switch" aria-checked={t.active} onClick={flip} disabled={!t.available && !t.active}>
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-text">
        <span className="toggle-label">{t.name}</span>
        {onAction?.cost && !t.active && <span className="muted small">Attivarla spende 1 uso</span>}
        {!t.available && !t.active && <span className="muted small">Non disponibile ora</span>}
      </span>
    </button>
  );
}

export function ResourceWidget({ c, w }: WidgetProps) {
  const r = c.sheet.resources.find((x) => x.id === w.ref);
  if (!r) return null;
  const accent = (w.props?.accent as string) ?? "copper";
  const setRemaining = (rem: number) =>
    c.update((ch) => ({ ...ch, state: { ...ch.state, resourcesSpent: { ...ch.state.resourcesSpent, [r.id]: r.max - rem } } }));
  const recovery = [r.shortRest ? `riposo breve (${r.shortRest === "all" ? "tutti" : `+${r.shortRest}`})` : "", "riposo lungo (tutti)"].filter(Boolean).join(" e ");
  return (
    <Panel className={`resource-panel accent-${accent}`} title={r.name} aside={<span className="muted">{r.remaining}/{r.max}</span>}>
      {r.max > PIPS_MAX ? (
        <div className="counter">
          <button className="btn" aria-label="Spendi 1" disabled={r.remaining <= 0} onClick={() => setRemaining(r.remaining - 1)}>
            −
          </button>
          <input
            type="number"
            min={0}
            max={r.max}
            value={r.remaining}
            aria-label={`${r.name}: rimasti su ${r.max}`}
            onChange={(e) => setRemaining(Math.max(0, Math.min(r.max, Number(e.currentTarget.value) || 0)))}
          />
          <button className="btn" aria-label="Recupera 1" disabled={r.remaining >= r.max} onClick={() => setRemaining(r.remaining + 1)}>
            +
          </button>
        </div>
      ) : (
        <div className="pips" role="group" aria-label={`${r.name}: ${r.remaining} su ${r.max}`}>
          {Array.from({ length: r.max }, (_, i) => {
            const filled = i < r.remaining;
            return (
              <button
                key={i}
                className={`pip ${filled ? "is-filled" : ""}`}
                aria-label={filled ? `Spendi (resta ${i})` : `Recupera (arriva a ${i + 1})`}
                onClick={() => setRemaining(filled ? i : i + 1)}
              />
            );
          })}
        </div>
      )}
      <p className="muted small">Recupero con {recovery}</p>
    </Panel>
  );
}

export function ToggleWidget({ c, w }: WidgetProps) {
  const t = c.sheet.toggles.find((x) => x.id === w.ref);
  if (!t) return null;
  const accent = (w.props?.accent as string) ?? "copper";
  const onAction = c.sheet.actions.find((a) => a.outcome?.kind === "toggleOn" && a.outcome.toggle === t.id);
  const flip = () => {
    if (!t.active && onAction) c.act(runAction(c.ch, registry, onAction.id));
    else c.act(setToggle(c.ch, t.id, !t.active), { direct: true });
  };
  return (
    <Panel className={`toggle-panel accent-${accent} ${t.active ? "is-active" : ""}`}>
      <button className="toggle" role="switch" aria-checked={t.active} onClick={flip} disabled={!t.available && !t.active}>
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-text">
          <span className="toggle-label">{t.name}</span>
          {onAction?.cost && !t.active && <span className="muted small">Attivarla spende 1 uso</span>}
        </span>
      </button>
      {!t.available && <p className="muted small">Non disponibile ora.</p>}
    </Panel>
  );
}

export function HeroicInspirationWidget({ c }: WidgetProps) {
  const on = c.ch.state.heroicInspiration;
  return (
    <Panel className={`toggle-panel accent-gold ${on ? "is-active" : ""}`}>
      <button
        className="toggle"
        role="switch"
        aria-checked={on}
        onClick={() => c.update((ch) => ({ ...ch, state: { ...ch.state, heroicInspiration: !on } }))}
      >
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-label">Ispirazione Eroica</span>
      </button>
    </Panel>
  );
}

export function DeathSavesWidget({ c }: WidgetProps) {
  const { push } = useLog();
  const s = c.ch.state;
  if (s.hpCurrent > 0) return null;
  const set = (deathSaves: typeof s.deathSaves) => c.update((ch) => ({ ...ch, state: { ...ch.state, deathSaves } }));
  const rollSave = () => {
    const r = rollD20(0);
    const ds = { ...s.deathSaves };
    let line: string;
    if (r.nat20) {
      c.update((ch) => ({
        ...ch,
        state: { ...ch.state, hpCurrent: 1, deathSaves: { success: 0, failure: 0 }, conditions: ch.state.conditions.filter((x) => x !== "unconscious") },
      }));
      push({ title: "TS contro morte", lines: ["20 naturale: torni a 1 PF!"], rolls: [{ label: "d20", expr: "1d20", dice: r.rolls, total: r.total }], tone: "good" });
      return;
    }
    if (r.nat1) {
      ds.failure = Math.min(3, ds.failure + 2);
      line = "1 naturale: due fallimenti.";
    } else if (r.total >= 10) {
      ds.success = Math.min(3, ds.success + 1);
      line = ds.success === 3 ? "Stabilizzato." : "Successo.";
    } else {
      ds.failure = Math.min(3, ds.failure + 1);
      line = "Fallimento.";
    }
    if (ds.failure === 3) line = "Tre fallimenti: il personaggio muore.";
    set(ds);
    push({ title: "TS contro morte", lines: [line], rolls: [{ label: "d20", expr: "1d20", dice: r.rolls, total: r.total }], tone: r.total >= 10 ? "good" : "bad" });
  };
  const marks = (kind: "success" | "failure") =>
    [0, 1, 2].map((i) => (
      <input
        key={i}
        type="checkbox"
        className={`death-mark ${kind}`}
        checked={s.deathSaves[kind] > i}
        aria-label={`${kind === "success" ? "Successo" : "Fallimento"} ${i + 1}`}
        onChange={(e) => set({ ...s.deathSaves, [kind]: e.currentTarget.checked ? i + 1 : i })}
      />
    ));
  return (
    <Panel className="death-panel" title="Tiri salvezza contro morte" aside={<button className="btn" onClick={rollSave}>Tira</button>}>
      <div className="death-row">
        <span>Successi</span>
        {marks("success")}
      </div>
      <div className="death-row">
        <span>Fallimenti</span>
        {marks("failure")}
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Gioco                                                               */
/* ------------------------------------------------------------------ */

/** Un'azione di classe, con i campi per ciò che il giocatore deve decidere (quanti punti, quali slot). */
export function ActionRow({ c, a }: { c: CharacterController; a: CharacterController["sheet"]["actions"][number] }) {
  const [amount, setAmount] = useState(1);
  const [slots, setSlots] = useState<Record<string, number>>({});
  const [slotLevel, setSlotLevel] = useState(1);
  const res = a.cost ? c.sheet.resources.find((r) => r.id === a.cost!.resource) : undefined;
  const pools = c.sheet.spellcasting?.slots ?? [];
  const kind = a.outcome?.kind;
  const maxLevel = a.outcome?.kind === "recoverSlots" ? (a.outcome.maxLevel ?? 9) : 9;
  const spent = pools.filter((p) => p.spent > 0 && p.level <= maxLevel);
  const levels = a.outcome?.kind === "resourceToSlot" ? a.outcome.costs.map((_, i) => i + 1) : pools.filter((p) => p.remaining > 0).map((p) => p.level);
  const use = () => {
    c.act(runAction(c.ch, registry, a.id, undefined, { amount, slots, slotLevel }));
    setSlots({});
  };
  return (
    <li className={a.available ? "" : "is-unavailable"}>
      <div>
        <strong>{a.name}</strong>
        <span className="muted small">
          {" "}
          {[TIMING[a.timing], res ? `${res.name} ${res.remaining}/${res.max}` : "", a.roll?.dice ?? ""].filter(Boolean).join(", ")}
        </span>
        {a.description && <p className="small muted">{a.description}</p>}
        {a.cost?.variable && (
          <label className="action-param small">
            Quanti punti{" "}
            <input type="number" min={1} max={res?.remaining ?? 1} value={amount} onChange={(e) => setAmount(Number(e.currentTarget.value) || 1)} />
          </label>
        )}
        {kind === "recoverSlots" &&
          (spent.length ? (
            <div className="action-param small">
              Slot da recuperare:
              {spent.map((p) => (
                <label key={p.level}>
                  {" "}
                  {p.level}°{" "}
                  <input
                    type="number"
                    min={0}
                    max={p.spent}
                    value={slots[String(p.level)] ?? 0}
                    onChange={(e) => setSlots({ ...slots, [String(p.level)]: Math.max(0, Math.min(p.spent, Number(e.currentTarget.value) || 0)) })}
                  />
                </label>
              ))}
            </div>
          ) : (
            <p className="small muted">Nessuno slot speso da recuperare.</p>
          ))}
        {(kind === "slotToResource" || kind === "resourceToSlot") && levels.length > 0 && (
          <label className="action-param small">
            Slot di livello{" "}
            <select value={slotLevel} onChange={(e) => setSlotLevel(Number(e.currentTarget.value))}>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}°
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <button className="btn" onClick={use}>
        Usa
      </button>
    </li>
  );
}

export function ActionsWidget({ c }: WidgetProps) {
  const { push } = useLog();
  const actions = c.sheet.actions.filter((a) => a.outcome?.kind !== "toggleOn" && a.outcome?.kind !== "toggleOff");
  const dice = c.sheet.dice;
  if (!actions.length && !dice.length) return null;
  const rollDice = (d: (typeof dice)[number]) => {
    const r = roll(d.expr);
    push({ title: d.name, lines: d.damageType ? [DAMAGE_TYPES[d.damageType] ?? d.damageType] : [], rolls: [{ label: d.name, expr: d.expr, dice: r.rolls.map((x) => x.value), total: r.total }] });
  };
  return (
    <Panel title="Azioni di classe" className="actions-panel">
      <ul className="action-list">
        {dice.map((d) => (
          <li key={d.id}>
            <div>
              <strong>{d.name}</strong> <span className="muted small">{d.expr}</span>
              {d.note && <p className="small muted">{d.note}</p>}
            </div>
            <button className="btn" onClick={() => rollDice(d)}>
              Tira
            </button>
          </li>
        ))}
        {actions.map((a) => (
          <ActionRow key={a.id} c={c} a={a} />
        ))}
      </ul>
    </Panel>
  );
}

const MASTERY_IT: Record<string, string> = {
  Cleave: "Fendere",
  Graze: "Sfiorare",
  Nick: "Intaccare",
  Push: "Spingere",
  Sap: "Fiaccare",
  Slow: "Rallentare",
  Topple: "Rovesciare",
  Vex: "Irritare",
};

export function AttacksWidget({ c }: WidgetProps) {
  const { push } = useLog();
  const reckless = !!c.ch.state.toggles.reckless;
  if (!c.sheet.attacks.length) {
    return (
      <Panel title="Attacchi" className="attacks-panel">
        <p className="muted">Equipaggia un'arma dall'inventario per vederla qui.</p>
      </Panel>
    );
  }
  const attack = (a: (typeof c.sheet.attacks)[number]) => {
    const mode: RollMode = reckless && a.ability === "str" ? "advantage" : "normal";
    const hit = rollD20(a.toHit.value, mode);
    const crit = hit.kept >= a.critRange;
    // Critico: si tirano due volte i dadi del danno, il bonus resta uno.
    const dmgExpr = crit ? critDice(a.damage) : a.damage;
    const dmg = roll(dmgExpr);
    push({
      title: a.name,
      lines: [crit ? "Colpo critico!" : hit.nat1 ? "1 naturale: mancato." : "", mode === "advantage" ? "Vantaggio (Irruento)" : ""].filter(Boolean),
      rolls: [
        { label: "Per colpire", expr: `1d20${formatMod(a.toHit.value)}`, dice: hit.rolls, total: hit.total },
        { label: `Danno ${DAMAGE_TYPES[a.damageType] ?? a.damageType}`, expr: dmgExpr, dice: dmg.rolls.map((x) => x.value), total: dmg.total },
      ],
      tone: crit ? "good" : hit.nat1 ? "bad" : "info",
    });
  };
  return (
    <Panel title="Attacchi" className="attacks-panel">
      <table className="attack-table">
        <thead>
          <tr>
            <th scope="col">Arma</th>
            <th scope="col">Colpire</th>
            <th scope="col">Danno</th>
            <th scope="col">
              <span className="sr-only">Tira</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {c.sheet.attacks.map((a) => (
            <tr key={a.itemId}>
              <td>
                {a.name}
                {a.mastery && (
                  <span className={`mastery ${a.masteryActive ? "is-active" : ""}`} title={a.masteryActive ? "Maestria attiva" : "Maestria non scelta"}>
                    {MASTERY_IT[a.mastery] ?? a.mastery}
                  </span>
                )}
              </td>
              <td>
                <StatNumber c={c} path={`attack.${a.itemId}`} s={a.toHit} signed />
              </td>
              <td>
                {a.damage} <span className="muted small">{DAMAGE_TYPES[a.damageType]}</span>
              </td>
              <td>
                <button className="btn" onClick={() => attack(a)}>
                  Attacca
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export function ConditionsWidget({ c }: WidgetProps) {
  const { conditions, exhaustion, conditionRounds = {} } = c.ch.state;
  const toggle = (k: string) =>
    c.update((ch) => {
      const { [k]: _gone, ...rounds } = ch.state.conditionRounds ?? {};
      return { ...ch, state: { ...ch.state, conditions: conditions.includes(k) ? conditions.filter((x) => x !== k) : [...conditions, k], conditionRounds: rounds } };
    });
  const setExh = (n: number) => c.update((ch) => ({ ...ch, state: { ...ch.state, exhaustion: Math.max(0, Math.min(6, n)) } }));
  return (
    <Panel title="Condizioni" className="conditions-panel">
      <div className="chips">
        {Object.entries(CONDITIONS).map(([k, v]) => (
          <button key={k} className={`chip ${conditions.includes(k) ? "is-on" : ""}`} aria-pressed={conditions.includes(k)} onClick={() => toggle(k)}>
            {v}
            {conditions.includes(k) && conditionRounds[k] ? ` (${conditionRounds[k]})` : ""}
          </button>
        ))}
      </div>
      <div className="stepper">
        <span>Indebolimento</span>
        <button className="icon-btn" onClick={() => setExh(exhaustion - 1)} aria-label="Riduci indebolimento" disabled={exhaustion === 0}>
          −
        </button>
        <strong aria-live="polite">{exhaustion}</strong>
        <button className="icon-btn" onClick={() => setExh(exhaustion + 1)} aria-label="Aumenta indebolimento" disabled={exhaustion === 6}>
          +
        </button>
        {exhaustion > 0 && (
          <span className="muted small">
            {exhaustion === 6 ? "Morte" : `−${exhaustion * 2} ai d20, −${ftToM(exhaustion * 5)}`}
          </span>
        )}
      </div>
    </Panel>
  );
}

export function HitDiceWidget({ c }: WidgetProps) {
  const [spend, setSpend] = useState<Partial<Record<Die, number>>>({});
  const total = Object.values(spend).reduce((a, b) => a + (b ?? 0), 0);
  return (
    <Panel title="Dadi Vita e riposi" className="hitdice-panel">
      <ul className="hd-list">
        {c.sheet.hitDice.map((h) => {
          const left = h.total - h.spent;
          const n = spend[h.die] ?? 0;
          return (
            <li key={h.die}>
              <span>
                <strong>{h.die}</strong> {left}/{h.total}
              </span>
              <span className="stepper">
                <button className="icon-btn" aria-label={`Meno ${h.die}`} disabled={n === 0} onClick={() => setSpend({ ...spend, [h.die]: n - 1 })}>
                  −
                </button>
                <span>{n}</span>
                <button className="icon-btn" aria-label={`Più ${h.die}`} disabled={n >= left} onClick={() => setSpend({ ...spend, [h.die]: n + 1 })}>
                  +
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="row">
        <button
          className="btn"
          onClick={() => {
            c.act(shortRest(c.ch, registry, spend));
            setSpend({});
          }}
        >
          Riposo breve{total ? ` (${total} dadi)` : ""}
        </button>
        <button className="btn" onClick={() => c.act(longRest(c.ch, registry))}>
          Riposo lungo
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Scheda                                                              */
/* ------------------------------------------------------------------ */

export function AbilitiesWidget({ c }: WidgetProps) {
  const roller = useRoller();
  return (
    <Panel title="Caratteristiche" className="abilities-panel">
      <div className="ability-grid">
        {ABILITIES.map((a) => {
          const v = c.sheet.abilities[a];
          return (
            <button key={a} className="ability" onClick={() => roller(`Prova di ${ABILITY_NAMES[a].name}`, v.mod)} title={breakdown(v.score)}>
              <span className="ability-name">{ABILITY_NAMES[a].name}</span>
              <span className="ability-mod">{formatMod(v.mod)}</span>
              <span className="ability-score">{v.score.value}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

export function SavesWidget({ c }: WidgetProps) {
  const roller = useRoller();
  return (
    <Panel title="Tiri salvezza" className="saves-panel">
      <ul className="check-list">
        {ABILITIES.map((a) => {
          const s = c.sheet.saves[a];
          return (
            <li key={a}>
              <button className="check-row" onClick={() => roller(`TS su ${ABILITY_NAMES[a].name}`, s.mod.value, s.advantage ? "advantage" : "normal")}>
                <span className={`prof-dot ${s.proficient ? "is-prof" : ""}`} aria-label={s.proficient ? "Competente" : "Non competente"} />
                <span className="check-name">{ABILITY_NAMES[a].name}</span>
                {s.advantage && <span className="adv" title="Vantaggio">V</span>}
                <StatNumber c={c} path={`save.${a}`} s={s.mod} signed />
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function SkillsWidget({ c }: WidgetProps) {
  const roller = useRoller();
  const list = Object.entries(c.sheet.skills).sort(([, a], [, b]) => a.name.localeCompare(b.name, "it"));
  return (
    <Panel title="Abilità" className="skills-panel">
      <ul className="check-list">
        {list.map(([id, s]) => (
          <li key={id}>
            <button className="check-row" onClick={() => roller(s.name, s.mod.value, s.advantage ? "advantage" : "normal")}>
              <span className={`prof-dot ${s.expertise ? "is-expert" : s.proficient ? "is-prof" : ""}`} aria-label={s.expertise ? "Maestria" : s.proficient ? "Competente" : "Non competente"} />
              <span className="check-name">
                {s.name} <span className="muted small">{ABILITY_NAMES[s.ability].short.toLowerCase()}</span>
              </span>
              {s.advantage && <span className="adv" title="Vantaggio">V</span>}
              <StatNumber c={c} path={`skill.${id}`} s={s.mod} signed />
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function FeaturesWidget({ c }: WidgetProps) {
  return (
    <Panel title="Privilegi e tratti" className="features-panel">
      <div className="feature-list">
        {c.sheet.features.map((f) => (
          <details key={f.id}>
            <summary>
              <span>{f.name}</span> <span className="muted small">{f.source}</span>
            </summary>
            {f.description && <RichText text={f.description} />}
          </details>
        ))}
      </div>
    </Panel>
  );
}

/** Borsello: un campo per moneta, si salva uscendo dal campo. */
export function Purse({ c }: WidgetProps) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const value = (coin: Coin) => draft[coin] ?? String(c.ch.coins?.[coin] ?? 0);
  const commit = (coin: Coin) => {
    const text = draft[coin];
    if (text === undefined) return;
    const n = Math.max(0, Math.floor(Number(text) || 0));
    if (n !== (c.ch.coins?.[coin] ?? 0)) c.update((ch) => ({ ...ch, coins: { ...ch.coins, [coin]: n } }));
    setDraft(({ [coin]: _done, ...rest }) => rest);
  };
  return (
    <div className="purse" role="group" aria-label="Borsello">
      {COINS.map((coin) => (
        <label key={coin.id} title={coin.name}>
          <span>{coin.short}</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={value(coin.id)}
            aria-label={coin.name}
            onChange={(e) => setDraft({ ...draft, [coin.id]: e.currentTarget.value })}
            onBlur={() => commit(coin.id)}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
        </label>
      ))}
    </div>
  );
}

export function InventoryWidget({ c, w }: WidgetProps) {
  const setEq = (idx: number, patch: Partial<(typeof c.ch.equipment)[number]> | null) =>
    c.update((ch) => {
      const equipment = [...ch.equipment];
      if (patch === null) equipment.splice(idx, 1);
      else equipment[idx] = { ...equipment[idx]!, ...patch };
      return { ...ch, equipment };
    });
  return (
    <Panel title={(w.props?.title as string) ?? "Inventario"} className="inventory-panel">
      {w.props?.purse !== false && <Purse c={c} w={w} />}
      {c.ch.equipment.length === 0 && <p className="muted">Nessun oggetto. Cercane uno qui sotto.</p>}
      <ul className="inv-list">
        {c.ch.equipment.map((e, i) => (
          <li key={`${e.itemId}-${i}`}>
            <label className="inv-equip">
              <input type="checkbox" checked={!!e.equipped} onChange={(ev) => setEq(i, { equipped: ev.currentTarget.checked })} />
              <span>{itemName(e.itemId)}</span>
            </label>
            {(e.quantity ?? 1) > 1 && <span className="muted">×{e.quantity}</span>}
            <button className="icon-btn" aria-label={`Rimuovi ${itemName(e.itemId)}`} onClick={() => setEq(i, null)}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <ItemSearch allowCustom allowCoins label="Aggiungi all'inventario" onPick={(p) => c.update((ch) => giveTo(ch, p))} />
      <p className="muted small">Spunta un oggetto per indossarlo o impugnarlo. Scrivendo «30 mo» le monete vanno nel borsello.</p>
    </Panel>
  );
}

export function NotesWidget({ c }: WidgetProps) {
  const [text, setText] = useState(c.ch.notes ?? "");
  useEffect(() => setText(c.ch.notes ?? ""), [c.ch.notes]);
  return (
    <Panel title="Note" className="notes-panel">
      <textarea
        className="notes"
        rows={6}
        value={text}
        placeholder="Legami, debiti, nomi da ricordare…"
        onChange={(e) => setText(e.currentTarget.value)}
        onBlur={() => text !== (c.ch.notes ?? "") && c.update((ch) => ({ ...ch, notes: text }))}
      />
    </Panel>
  );
}
