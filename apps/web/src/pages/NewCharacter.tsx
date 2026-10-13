import {
  ABILITIES,
  POINT_BUY_BUDGET,
  POINT_BUY_COST,
  STANDARD_ARRAY,
  createCharacter,
  pointBuySpent,
  type Ability,
  type AutomationLevel,
} from "@dnd/engine";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AutomationSwitch } from "../components/AutomationSwitch";
import { ABILITY_NAMES, registry } from "../content";
import { repo } from "../data";
import { useAuth } from "../firebase/auth";
import { useUserAutomation } from "../state/useCharacter";

type Method = "standard" | "pointbuy" | "free";

const EMPTY: Record<Ability, number> = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };

export function NewCharacter() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [pref] = useUserAutomation();
  const [name, setName] = useState("");
  const [speciesId, setSpecies] = useState([...registry.species.keys()][0]!);
  const [backgroundId, setBackground] = useState([...registry.backgrounds.keys()][0]!);
  const [classId, setClass] = useState([...registry.classes.keys()][0]!);
  const [method, setMethod] = useState<Method>("standard");
  const [standard, setStandard] = useState<Partial<Record<Ability, number>>>({});
  const [scores, setScores] = useState<Record<Ability, number>>(EMPTY);
  const [pattern, setPattern] = useState<"21" | "111">("21");
  const [plus2, setPlus2] = useState<Ability | "">("");
  const [plus1, setPlus1] = useState<Ability | "">("");
  const [automation, setAutomation] = useState<AutomationLevel | undefined>();
  const [saving, setSaving] = useState(false);

  const bg = registry.backgrounds.get(backgroundId)!;
  const cls = registry.classes.get(classId)!;

  const finalBase: Record<Ability, number> | null = useMemo(() => {
    if (method === "standard") {
      if (ABILITIES.some((a) => standard[a] === undefined)) return null;
      return standard as Record<Ability, number>;
    }
    return scores;
  }, [method, standard, scores]);

  const boosts: Partial<Record<Ability, number>> =
    pattern === "111"
      ? Object.fromEntries(bg.abilities.map((a) => [a, 1]))
      : plus2 && plus1 && plus2 !== plus1
        ? { [plus2]: 2, [plus1]: 1 }
        : {};

  const spent = pointBuySpent(scores);
  const problems: string[] = [];
  if (!name.trim()) problems.push("Dai un nome al personaggio.");
  if (!finalBase) problems.push("Assegna tutti i valori dell'array standard.");
  if (method === "pointbuy" && (spent === null || spent > POINT_BUY_BUDGET)) problems.push(`Point buy: massimo ${POINT_BUY_BUDGET} punti, punteggi da 8 a 15.`);
  if (Object.keys(boosts).length === 0) problems.push(`Scegli i bonus di caratteristica del background (${bg.name}).`);

  const usedStandard = (except: Ability) =>
    ABILITIES.filter((a) => a !== except && standard[a] !== undefined).map((a) => standard[a]!);

  const submit = async () => {
    if (problems.length || !finalBase || !user) return;
    setSaving(true);
    const ch = createCharacter(
      {
        id: crypto.randomUUID(),
        name: name.trim(),
        speciesId,
        backgroundId,
        classId,
        abilityScores: finalBase,
        backgroundBoosts: boosts,
        automation,
        ownerUid: user.uid,
      },
      registry,
    );
    try {
      await repo.saveCharacter(ch);
      nav(`/c/${ch.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page narrow">
      <h1 className="page-title">Nuovo personaggio</h1>

      <section className="panel form">
        <label className="field">
          <span>Nome</span>
          <input value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="Es. Bruna Spaccaroccia" autoFocus />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Specie</span>
            <select value={speciesId} onChange={(e) => setSpecies(e.currentTarget.value)}>
              {[...registry.species.values()].map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Classe</span>
            <select value={classId} onChange={(e) => setClass(e.currentTarget.value)}>
              {[...registry.classes.values()].map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.hitDie})
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Background</span>
            <select
              value={backgroundId}
              onChange={(e) => {
                setBackground(e.currentTarget.value);
                setPlus1("");
                setPlus2("");
              }}
            >
              {[...registry.backgrounds.values()].map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="muted small">
          {cls.name}: caratteristica principale {cls.primaryAbility.map((a) => ABILITY_NAMES[a].name).join(" o ")}. Abilità, maestrie e altre scelte si completano nella scheda.
        </p>
      </section>

      <section className="panel form">
        <h2>Caratteristiche</h2>
        <div className="segmented" role="radiogroup" aria-label="Metodo">
          {(
            [
              ["standard", "Array standard"],
              ["pointbuy", "Point buy"],
              ["free", "Valori liberi"],
            ] as const
          ).map(([k, l]) => (
            <button key={k} role="radio" aria-checked={method === k} className={method === k ? "is-on" : ""} onClick={() => setMethod(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="score-grid">
          {ABILITIES.map((a) => (
            <label key={a} className="field score-field">
              <span>{ABILITY_NAMES[a].name}</span>
              {method === "standard" ? (
                <select
                  value={standard[a] ?? ""}
                  onChange={(e) => setStandard({ ...standard, [a]: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
                >
                  <option value="">—</option>
                  {STANDARD_ARRAY.filter((v) => {
                    const used = usedStandard(a);
                    return !used.includes(v);
                  }).map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  min={method === "pointbuy" ? 8 : 1}
                  max={method === "pointbuy" ? 15 : 20}
                  value={scores[a]}
                  onChange={(e) => setScores({ ...scores, [a]: Number(e.currentTarget.value) })}
                />
              )}
              {boosts[a] ? <span className="boost">+{boosts[a]}</span> : null}
            </label>
          ))}
        </div>
        {method === "pointbuy" && (
          <p className={spent !== null && spent <= POINT_BUY_BUDGET ? "muted" : "warn"}>
            Punti spesi: {spent ?? "valori fuori tabella"} su {POINT_BUY_BUDGET}. Costi: {Object.entries(POINT_BUY_COST).map(([s, c]) => `${s}=${c}`).join(", ")}
          </p>
        )}

        <h3>Bonus del background</h3>
        <p className="muted small">
          {bg.name} aumenta {bg.abilities.map((a) => ABILITY_NAMES[a].name).join(", ")}.
        </p>
        <div className="segmented" role="radiogroup" aria-label="Distribuzione">
          <button role="radio" aria-checked={pattern === "21"} className={pattern === "21" ? "is-on" : ""} onClick={() => setPattern("21")}>
            +2 e +1
          </button>
          <button role="radio" aria-checked={pattern === "111"} className={pattern === "111" ? "is-on" : ""} onClick={() => setPattern("111")}>
            +1 a tutte e tre
          </button>
        </div>
        {pattern === "21" && (
          <div className="field-row">
            <label className="field">
              <span>+2 a</span>
              <select value={plus2} onChange={(e) => setPlus2(e.currentTarget.value as Ability)}>
                <option value="">—</option>
                {bg.abilities.map((a) => (
                  <option key={a} value={a} disabled={a === plus1}>
                    {ABILITY_NAMES[a].name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>+1 a</span>
              <select value={plus1} onChange={(e) => setPlus1(e.currentTarget.value as Ability)}>
                <option value="">—</option>
                {bg.abilities.map((a) => (
                  <option key={a} value={a} disabled={a === plus2}>
                    {ABILITY_NAMES[a].name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </section>

      <section className="panel form">
        <AutomationSwitch value={automation} inherited={pref ?? "assisted"} onChange={setAutomation} />
      </section>

      {problems.length > 0 && (
        <ul className="problems">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <div className="row end">
        <button className="btn btn-quiet" onClick={() => nav("/")}>
          Annulla
        </button>
        <button className="btn btn-primary" disabled={problems.length > 0 || saving} onClick={submit}>
          Crea personaggio
        </button>
      </div>
    </main>
  );
}
