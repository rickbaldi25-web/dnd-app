import { applyDamage, applyHealing, applyProposal, computeSheet, type CharacterData, type ComputedSheet } from "@dnd/engine";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { CONDITIONS, ftToM, registry, SENSES } from "../content";
import { repo, type ConditionTimer } from "../data";
import { makeTimer, timerKey, type ConditionAnchor } from "../state/conditionTimers";
import { AnchorSelect, useEncounter } from "./Initiative";
import { useLog } from "../state/log";

function sheetOf(ch: CharacterData): ComputedSheet | null {
  try {
    return computeSheet(ch, registry);
  } catch {
    return null;
  }
}

/** Un personaggio del gruppo: ciò che serve al tavolo, più i comandi rapidi del Master. */
export function PartyCard({ ch, canEdit, mine, online, current = false }: { ch: CharacterData; canEdit: boolean; mine: boolean; online: boolean; current?: boolean }) {
  const { push } = useLog();
  const [amount, setAmount] = useState("");
  const [rounds, setRounds] = useState("");
  const [anchor, setAnchor] = useState<ConditionAnchor>("round");
  const encounter = useEncounter(canEdit ? ch.campaignId : undefined);
  const sheet = useMemo(() => sheetOf(ch), [ch]);
  if (!sheet) {
    return (
      <li className="panel party-card">
        <h2>{ch.name}</h2>
        <p className="muted small">Dati che il motore non riconosce.</p>
      </li>
    );
  }
  const s = ch.state;
  const max = sheet.hpMax.value;
  const classes = Object.entries(sheet.classLevels)
    .map(([id, n]) => `${registry.classes.get(id)?.name ?? id} ${n}`)
    .join(" / ");
  const sc = sheet.spellcasting;
  const slots = [...(sc?.slots ?? []).map((p) => `${p.level}° ${p.remaining}/${p.max}`), ...(sc?.pact ? [`Patto ${sc.pact.level}° ${sc.pact.remaining}/${sc.pact.max}`] : [])];
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const durations = s.conditionRounds ?? {};
  /** Toglie o mette il timer della condizione nel combattimento in corso. */
  const setTimer = (id: string, timer: ConditionTimer | null) => {
    if (!encounter?.active || !ch.campaignId) return;
    const { [timerKey(ch.id, id)]: _old, ...timers } = encounter.timers ?? {};
    if (!timer && !_old) return;
    repo.saveEncounter(ch.campaignId, { ...encounter, timers: timer ? { ...timers, [timerKey(ch.id, id)]: timer } : timers }).catch(failed);
  };
  const addCondition = (id: string) => {
    const n = Math.floor(Number(rounds) || 0);
    repo.updateCharacter(ch, { ...ch, state: { ...s, conditions: [...s.conditions, id], conditionRounds: n > 0 ? { ...durations, [id]: n } : durations } }).catch(failed);
    if (n > 0) setTimer(id, makeTimer(anchor, ch.id, encounter?.currentId));
    setRounds("");
  };
  const removeCondition = (id: string) => {
    const { [id]: _gone, ...rest } = durations;
    repo.updateCharacter(ch, { ...ch, state: { ...s, conditions: s.conditions.filter((x) => x !== id), conditionRounds: rest } }).catch(failed);
    setTimer(id, null);
  };
  const conditionLabel = (id: string) => `${CONDITIONS[id] ?? id}${durations[id] ? ` (${durations[id]})` : ""}`;
  const act = (kind: "damage" | "heal") => {
    const p = kind === "damage" ? applyDamage(ch, sheet, n) : applyHealing(ch, sheet, n);
    repo.updateCharacter(ch, applyProposal(ch, p)).catch((e) => push({ title: "Salvataggio non riuscito", lines: [String(e?.message ?? e)], tone: "bad" }));
    push({ title: `${ch.name}: ${kind === "damage" ? "danno" : "cura"} ${n}`, lines: p.lines, rolls: [], tone: kind === "damage" ? "bad" : "good" });
    setAmount("");
  };
  return (
    <li className={`panel party-card ${s.hpCurrent === 0 ? "is-down" : ""} ${current ? "is-open" : ""}`}>
      <header className="panel-head">
        <h2>
          <span className={`presence-dot ${online ? "is-online" : ""}`} role="img" aria-label={online ? "Connesso" : "Non connesso"} title={online ? "Connesso" : "Non connesso"} />
          {ch.name}
        </h2>
        <span className="muted small">{classes}</span>
      </header>
      <div className="party-hp">
        <span className="party-hp-number">
          {s.hpCurrent}
          <span className="muted"> / {max}</span>
          {s.hpTemp > 0 && <span className="party-temp"> +{s.hpTemp}</span>}
        </span>
        <span className="party-bar" role="img" aria-label={`Punti ferita ${s.hpCurrent} su ${max}`}>
          <span style={{ width: `${max ? Math.min(100, (s.hpCurrent / max) * 100) : 0}%` }} />
        </span>
      </div>
      <dl className="party-stats">
        <div>
          <dt>CA</dt>
          <dd>{sheet.ac.value}</dd>
        </div>
        <div>
          <dt>Perc. passiva</dt>
          <dd>{sheet.passivePerception}</dd>
        </div>
        <div>
          <dt>Iniziativa</dt>
          <dd>
            {sheet.initiative.value >= 0 ? "+" : ""}
            {sheet.initiative.value}
          </dd>
        </div>
      </dl>
      {(s.conditions.length > 0 || s.exhaustion > 0 || sc?.concentration) && (
        <p className="party-tags">
          {s.conditions.map((c) =>
            canEdit ? (
              <button key={c} className="tag tag-bad tag-btn" aria-label={`Togli ${CONDITIONS[c] ?? c}`} onClick={() => removeCondition(c)}>
                {conditionLabel(c)} ×
              </button>
            ) : (
              <span key={c} className="tag tag-bad">
                {conditionLabel(c)}
              </span>
            ),
          )}
          {s.exhaustion > 0 && <span className="tag tag-bad">Indebolimento {s.exhaustion}</span>}
          {sc?.concentration && <span className="tag">Concentrazione: {sc.concentration.name}</span>}
        </p>
      )}
      {slots.length > 0 && <p className="small">Slot: {slots.join(" · ")}</p>}
      {sheet.resources.length > 0 && <p className="small muted">{sheet.resources.map((r) => `${r.name} ${r.remaining}/${r.max}`).join(" · ")}</p>}
      {canEdit && (
        <div className="party-controls">
          <input type="number" min={0} value={amount} placeholder="PF" aria-label={`Punti ferita per ${ch.name}`} className="party-amount" onChange={(e) => setAmount(e.currentTarget.value)} />
          <button className="btn btn-danger" disabled={!n} onClick={() => act("damage")}>
            Danno
          </button>
          <button className="btn btn-heal" disabled={!n} onClick={() => act("heal")}>
            Cura
          </button>
          <input type="number" min={1} value={rounds} placeholder="round" title="Durata in round: vuoto = finché non la togli" aria-label={`Durata in round della condizione per ${ch.name}`} className="party-amount" onChange={(e) => setRounds(e.currentTarget.value)} />
          {encounter?.active && Number(rounds) > 0 && <AnchorSelect value={anchor} hasActor={!!encounter.currentId} label={ch.name} onChange={setAnchor} />}
          <select value="" aria-label={`Aggiungi una condizione a ${ch.name}`} onChange={(e) => e.currentTarget.value && addCondition(e.currentTarget.value)}>
            <option value="">Condizione…</option>
            {Object.entries(CONDITIONS)
              .filter(([id]) => !s.conditions.includes(id))
              .map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
          </select>
        </div>
      )}
      {(canEdit || mine) && !current && (
        <Link className="link-btn party-open" to={`/c/${ch.id}`}>
          Apri la scheda
        </Link>
      )}
    </li>
  );
}

/**
 * Il gruppo in una riga: PF, CA e condizioni di ognuno. Toccando un nome si apre sotto la sua carta completa.
 * currentId = chi è di turno, da evidenziare.
 */
export function PartyStrip({ party, canEdit, uid, online, currentId }: { party: CharacterData[]; canEdit: boolean; uid: string; online: string[]; currentId?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = party.find((ch) => ch.id === openId);
  if (!party.length) return null;
  return (
    <div className="party-strip-wrap">
      <ul className="party-strip" aria-label="Gruppo">
        {party.map((ch) => {
          const sheet = sheetOf(ch);
          const max = sheet?.hpMax.value ?? 0;
          const hp = ch.state.hpCurrent;
          return (
            <li key={ch.id}>
              <button className={`party-chip ${ch.id === currentId ? "is-current" : ""} ${hp === 0 ? "is-down" : ""} ${openId === ch.id ? "is-open" : ""}`} aria-expanded={openId === ch.id} onClick={() => setOpenId(openId === ch.id ? null : ch.id)}>
                <span className="party-chip-name">
                  <span className={`presence-dot ${online.includes(ch.ownerUid ?? "") ? "is-online" : ""}`} />
                  {ch.name}
                </span>
                <span className="party-chip-hp">
                  {hp}
                  <span className="muted">/{max}</span>
                  {ch.state.hpTemp > 0 && <span className="party-temp"> +{ch.state.hpTemp}</span>}
                  {sheet && <span className="muted small"> · CA {sheet.ac.value}</span>}
                </span>
                <span className="party-bar" aria-hidden="true">
                  <span style={{ width: `${max ? Math.min(100, (hp / max) * 100) : 0}%` }} />
                </span>
                {ch.state.conditions.length > 0 && <span className="party-chip-tags">{ch.state.conditions.map((c) => CONDITIONS[c] ?? c).join(", ")}</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {open && (
        <ul className="party party-strip-open">
          <PartyCard ch={open} canEdit={canEdit} mine={open.ownerUid === uid} online={online.includes(open.ownerUid ?? "")} />
        </ul>
      )}
    </div>
  );
}

const passive = (sheet: ComputedSheet, skill: string): number | null => {
  const s = sheet.skills[skill];
  return s ? 10 + s.mod.value + (s.advantage ? 5 : 0) : null;
};

/** Tabella per il Master: punteggi passivi, sensi, velocità e lingue di tutto il gruppo, affiancati. */
export function PartyGlance({ party }: { party: CharacterData[] }) {
  const rows = party.map((ch) => ({ ch, sheet: sheetOf(ch) })).filter((r): r is { ch: CharacterData; sheet: ComputedSheet } => !!r.sheet);
  if (!rows.length) return null;
  const best = (get: (s: ComputedSheet) => number | null) => Math.max(...rows.map((r) => get(r.sheet) ?? -Infinity));
  const cols: { label: string; title: string; get: (s: ComputedSheet) => number | null }[] = [
    { label: "Perc.", title: "Percezione passiva", get: (s) => s.passivePerception },
    { label: "Indag.", title: "Indagare passiva", get: (s) => passive(s, "investigation") },
    { label: "Intuiz.", title: "Intuizione passiva", get: (s) => passive(s, "insight") },
  ];
  const tops = cols.map((c) => best(c.get));
  return (
    <section className="panel party-glance">
      <h2>A colpo d'occhio</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Personaggio</th>
              {cols.map((c) => (
                <th key={c.label} scope="col" title={c.title} className="num">
                  {c.label}
                </th>
              ))}
              <th scope="col">Sensi</th>
              <th scope="col" className="num">
                Velocità
              </th>
              <th scope="col">Lingue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ ch, sheet }) => (
              <tr key={ch.id}>
                <th scope="row">{ch.name}</th>
                {cols.map((c, i) => {
                  const v = c.get(sheet);
                  return (
                    <td key={c.label} className={`num ${v !== null && v === tops[i] ? "is-best" : ""}`}>
                      {v ?? "—"}
                    </td>
                  );
                })}
                <td>{sheet.senses.map((x) => `${SENSES[x.sense] ?? x.sense} ${ftToM(x.range)}`).join(", ") || "—"}</td>
                <td className="num">{ftToM(sheet.speed.value)}</td>
                <td className="small">{sheet.proficiencies.languages.join(", ") || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
