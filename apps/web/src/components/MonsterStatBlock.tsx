import { ABILITIES, formatMod, roll, rollD20, type MonsterDef, type MonsterEntry } from "@dnd/engine";
import { ABILITY_NAMES } from "../content";
import { useLog } from "../state/log";

const mod = (score: number) => Math.floor((score - 10) / 2);

function Entries({ title, list, monster }: { title: string; list: MonsterEntry[] | undefined; monster: string }) {
  const { push } = useLog();
  if (!list?.length) return null;
  const attack = (e: MonsterEntry) => {
    if (!e.attack) return;
    const hit = rollD20(e.attack.bonus);
    const dmg = roll(e.attack.damage);
    push({
      title: `${monster}: ${e.name}`,
      lines: hit.nat20 ? ["20 naturale: colpo critico."] : hit.nat1 ? ["1 naturale."] : [],
      rolls: [
        { label: "Tiro per colpire", expr: `1d20${formatMod(e.attack.bonus)}`, dice: hit.rolls, total: hit.total },
        { label: "Danni", expr: e.attack.damage, dice: dmg.rolls.map((x) => x.value), total: Math.max(0, dmg.total) },
      ],
    });
  };
  return (
    <div className="stat-entries">
      <h3>{title}</h3>
      {list.map((e, i) => (
        <p key={`${e.name}-${i}`}>
          <strong>{e.name}.</strong> {e.text}{" "}
          {e.attack && (
            <button className="btn btn-quiet stat-roll" onClick={() => attack(e)}>
              Tira {formatMod(e.attack.bonus)} · {e.attack.damage}
            </button>
          )}
        </p>
      ))}
    </div>
  );
}

/** Scheda di un mostro, per il Master: statistiche, tratti e azioni con gli attacchi pronti da tirare. */
export function MonsterStatBlock({ monster: m, name }: { monster: MonsterDef; name?: string }) {
  const { push } = useLog();
  const label = name ?? m.name;
  const check = (what: string, bonus: number) => {
    const r = rollD20(bonus);
    push({ title: `${label}: ${what}`, lines: [], rolls: [{ label: "d20", expr: `1d20${formatMod(bonus)}`, dice: r.rolls, total: r.total }] });
  };
  const facts: [string, string | undefined][] = [
    ["Tiri salvezza", m.saves && Object.entries(m.saves).map(([a, v]) => `${ABILITY_NAMES[a as keyof typeof ABILITY_NAMES].short} ${formatMod(v ?? 0)}`).join(", ")],
    ["Abilità", m.skills && Object.entries(m.skills).map(([s, v]) => `${s} ${formatMod(v)}`).join(", ")],
    ["Vulnerabilità", m.vulnerabilities],
    ["Resistenze", m.resistances],
    ["Immunità", m.immunities],
    ["Immunità alle condizioni", m.conditionImmunities],
    ["Sensi", [m.senses, m.passivePerception !== undefined ? `Percezione passiva ${m.passivePerception}` : ""].filter(Boolean).join(", ")],
    ["Linguaggi", m.languages],
    ["Sfida", m.cr],
  ];
  return (
    <div className="stat-block">
      <p className="muted small">
        {[m.size, m.type, m.alignment].filter(Boolean).join(", ")}
        {m.source ? ` · ${m.source}` : ""}
      </p>
      <p>
        <strong>CA</strong> {m.ac}
        {m.acNote ? ` (${m.acNote})` : ""} · <strong>PF</strong> {m.hp}
        {m.hpFormula ? ` (${m.hpFormula})` : ""} · <strong>Velocità</strong> {m.speed}
      </p>
      <div className="stat-abilities">
        {ABILITIES.map((a) => (
          <button key={a} className="ability" title={`Prova di ${ABILITY_NAMES[a].name}`} onClick={() => check(`prova di ${ABILITY_NAMES[a].name}`, mod(m.abilities[a]))}>
            <span className="ability-name">{ABILITY_NAMES[a].short}</span>
            <strong>{formatMod(mod(m.abilities[a]))}</strong>
            <span className="muted small">{m.abilities[a]}</span>
          </button>
        ))}
      </div>
      <dl className="stat-facts">
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      <Entries title="Tratti" list={m.traits} monster={label} />
      <Entries title="Azioni" list={m.actions} monster={label} />
      <Entries title="Reazioni" list={m.reactions} monster={label} />
      <Entries title="Azioni leggendarie" list={m.legendary} monster={label} />
    </div>
  );
}
