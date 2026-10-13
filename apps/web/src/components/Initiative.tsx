import { computeSheet, rollD20, type CharacterData, type MonsterDef } from "@dnd/engine";
import { useEffect, useMemo, useState } from "react";
import { loadMonsters, registry } from "../content";
import { repo, type Encounter, type EncounterMonster, type MonsterSecret } from "../data";
import { useLog } from "../state/log";

/** Una riga dell'ordine di iniziativa: un personaggio o un mostro. */
export interface Combatant {
  id: string;
  name: string;
  kind: "pc" | "monster";
  initiative: number | null;
  character?: CharacterData;
}

/** Ordine dei turni: iniziativa più alta prima; chi non l'ha ancora va in fondo. A parità, prima i personaggi. */
export function initiativeOrder(party: CharacterData[], monsters: EncounterMonster[]): Combatant[] {
  const all: Combatant[] = [
    ...party.map((ch): Combatant => ({ id: ch.id, name: ch.name, kind: "pc", initiative: ch.state.initiative ?? null, character: ch })),
    ...monsters.map((m): Combatant => ({ id: m.id, name: m.name, kind: "monster", initiative: m.initiative })),
  ];
  return all
    .map((c, i) => ({ c, i }))
    .sort((a, b) => (b.c.initiative ?? -Infinity) - (a.c.initiative ?? -Infinity) || a.i - b.i)
    .map((x) => x.c);
}

export function useEncounter(campaignId: string | undefined): Encounter | null {
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  useEffect(() => {
    setEncounter(null);
    return campaignId ? repo.watchEncounter(campaignId, setEncounter) : undefined;
  }, [campaignId]);
  return encounter;
}

function initiativeBonus(ch: CharacterData): number {
  try {
    return computeSheet(ch, registry).initiative.value;
  } catch {
    return 0;
  }
}

/** Campo dell'iniziativa: si scrive il risultato del dado tirato al tavolo, oppure si fa tirare all'app. */
function InitiativeInput({ value, bonus, label, onChange }: { value: number | null; bonus: number; label: string; onChange: (v: number | null, rolled?: { dice: number[]; total: number }) => void }) {
  const [text, setText] = useState(value === null ? "" : String(value));
  useEffect(() => setText(value === null ? "" : String(value)), [value]);
  const commit = () => {
    const v = text.trim() === "" ? null : Math.round(Number(text));
    if (v !== value && (v === null || Number.isFinite(v))) onChange(v);
  };
  return (
    <span className="init-input">
      <input type="number" value={text} placeholder="—" aria-label={`Iniziativa di ${label}`} onChange={(e) => setText(e.currentTarget.value)} onBlur={commit} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
      <button
        className="btn btn-quiet"
        title={`Tira 1d20${bonus >= 0 ? "+" : ""}${bonus}`}
        aria-label={`Tira l'iniziativa di ${label}`}
        onClick={() => {
          const r = rollD20(bonus);
          onChange(r.total, { dice: r.rolls, total: r.total });
        }}
      >
        Tira
      </button>
    </span>
  );
}

/** Aggiunta di mostri: dalla raccolta importata (con ricerca) oppure scritti a mano. */
function AddMonster({ onAdd }: { onAdd: (m: { name: string; hp: number; ac: number; bonus: number }, count: number) => void }) {
  const [library, setLibrary] = useState<MonsterDef[] | null>(null);
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [ac, setAc] = useState("");
  const [bonus, setBonus] = useState("0");
  const [count, setCount] = useState("1");
  // La raccolta è grande: si scarica alla prima volta che il Master tocca il campo.
  const open = () => {
    if (!library) loadMonsters().then(setLibrary).catch(() => setLibrary([]));
  };
  const q = name.trim().toLowerCase();
  const matches = useMemo(() => (library && q.length >= 2 ? library.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 8) : []), [library, q]);
  const pick = (m: MonsterDef) => {
    setName(m.name);
    setHp(String(m.hp));
    setAc(String(m.ac));
    setBonus(String(Math.floor((m.abilities.dex - 10) / 2)));
  };
  const exact = matches.length === 1 && matches[0]!.name.toLowerCase() === q;
  return (
    <div className="add-monster">
      <div className="row">
        <input value={name} placeholder="Nome del mostro" aria-label="Nome del mostro" onFocus={open} onChange={(e) => { open(); setName(e.currentTarget.value); }} />
        <input type="number" value={hp} placeholder="PF" aria-label="Punti ferita" className="short-input" onChange={(e) => setHp(e.currentTarget.value)} />
        <input type="number" value={ac} placeholder="CA" aria-label="Classe armatura" className="short-input" onChange={(e) => setAc(e.currentTarget.value)} />
        <label className="small">
          Iniz.{" "}
          <input type="number" value={bonus} aria-label="Bonus all'iniziativa" className="short-input" onChange={(e) => setBonus(e.currentTarget.value)} />
        </label>
        <label className="small">
          Quanti{" "}
          <input type="number" min={1} max={20} value={count} aria-label="Quanti" className="short-input" onChange={(e) => setCount(e.currentTarget.value)} />
        </label>
        <button
          className="btn"
          disabled={!name.trim()}
          onClick={() => {
            onAdd({ name: name.trim(), hp: Math.max(1, Number(hp) || 1), ac: Number(ac) || 10, bonus: Number(bonus) || 0 }, Math.max(1, Math.min(20, Number(count) || 1)));
            setName("");
            setHp("");
            setAc("");
            setBonus("0");
            setCount("1");
          }}
        >
          Aggiungi
        </button>
      </div>
      {matches.length > 0 && !exact && (
        <ul className="monster-matches">
          {matches.map((m) => (
            <li key={m.id}>
              <button className="link-btn" onClick={() => pick(m)}>
                {m.name}
              </button>{" "}
              <span className="muted small">
                GS {m.cr} · PF {m.hp} · CA {m.ac}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Riquadro dell'iniziativa nella pagina della campagna. */
export function InitiativePanel({ campaignId, party, isDm, uid }: { campaignId: string; party: CharacterData[]; isDm: boolean; uid: string }) {
  const { push } = useLog();
  const encounter = useEncounter(campaignId);
  const [secrets, setSecrets] = useState<Record<string, MonsterSecret>>({});
  const [damage, setDamage] = useState<Record<string, string>>({});
  useEffect(() => (isDm ? repo.watchMonsterSecrets(campaignId, setSecrets) : undefined), [campaignId, isDm]);

  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const save = (next: Encounter) => repo.saveEncounter(campaignId, next).catch(failed);
  const saveSecrets = (next: Record<string, MonsterSecret>) => repo.saveMonsterSecrets(campaignId, next).catch(failed);
  const setPcInitiative = (ch: CharacterData, v: number | null) => repo.updateCharacter(ch, { ...ch, state: { ...ch.state, initiative: v } }).catch(failed);

  if (!encounter?.active) {
    if (!isDm) return null;
    return (
      <section className="panel initiative">
        <div className="row between">
          <h2>Iniziativa</h2>
          <button className="btn btn-primary" onClick={() => save({ active: true, round: 1, monsters: [] })}>
            Inizia combattimento
          </button>
        </div>
        <p className="muted small">Ognuno tira il suo dado e scrive il risultato, oppure lo fa tirare all'app. Tu aggiungi i mostri.</p>
      </section>
    );
  }

  const order = initiativeOrder(party, encounter.monsters);
  const ready = order.filter((c) => c.initiative !== null);
  const current = order.find((c) => c.id === encounter.currentId);
  const next = () => {
    if (!ready.length) return;
    const i = ready.findIndex((c) => c.id === encounter.currentId);
    const wrapped = i >= 0 && i === ready.length - 1;
    save({ ...encounter, currentId: ready[(i + 1) % ready.length]!.id, round: encounter.round + (wrapped ? 1 : 0) });
  };
  const end = () => {
    if (!window.confirm("Terminare il combattimento? Iniziative e mostri vengono azzerati.")) return;
    save({ active: false, round: 1, monsters: [] });
    saveSecrets({});
    for (const ch of party) if (ch.state.initiative != null) setPcInitiative(ch, null);
  };
  const setMonster = (id: string, patch: Partial<EncounterMonster>) => save({ ...encounter, monsters: encounter.monsters.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  const removeMonster = (id: string) => {
    save({ ...encounter, monsters: encounter.monsters.filter((m) => m.id !== id), currentId: encounter.currentId === id ? undefined : encounter.currentId });
    const { [id]: _gone, ...rest } = secrets;
    saveSecrets(rest);
  };
  const addMonsters = (m: { name: string; hp: number; ac: number; bonus: number }, count: number) => {
    const added: EncounterMonster[] = [];
    const nextSecrets = { ...secrets };
    const taken = encounter.monsters.filter((x) => x.name === m.name || x.name.startsWith(`${m.name} `)).length;
    for (let i = 0; i < count; i++) {
      const id = `m-${Date.now().toString(36)}-${i}`;
      // Più mostri uguali si numerano, così al tavolo si distinguono.
      added.push({ id, name: count > 1 || taken > 0 ? `${m.name} ${taken + i + 1}` : m.name, initiative: null });
      nextSecrets[id] = { hp: m.hp, hpMax: m.hp, ac: m.ac, initiativeBonus: m.bonus };
    }
    save({ ...encounter, monsters: [...encounter.monsters, ...added] });
    saveSecrets(nextSecrets);
  };
  const hit = (id: string, sign: 1 | -1) => {
    const s = secrets[id];
    const n = Math.max(0, Math.floor(Number(damage[id]) || 0));
    if (!s || !n) return;
    saveSecrets({ ...secrets, [id]: { ...s, hp: Math.max(0, Math.min(s.hpMax, s.hp - sign * n)) } });
    setDamage({ ...damage, [id]: "" });
  };

  return (
    <section className="panel initiative">
      <div className="row between">
        <h2>
          Iniziativa <span className="muted small">round {encounter.round}</span>
        </h2>
        {isDm && (
          <span className="row">
            <button className="btn btn-primary" disabled={!ready.length} onClick={next}>
              {current ? "Prossimo turno" : "Primo turno"}
            </button>
            <button className="btn btn-quiet" onClick={end}>
              Termina
            </button>
          </span>
        )}
      </div>
      <ol className="init-list">
        {order.map((c) => {
          const mine = c.character?.ownerUid === uid;
          const canSet = isDm || mine;
          const secret = c.kind === "monster" ? secrets[c.id] : undefined;
          return (
            <li key={c.id} className={`${c.id === encounter.currentId ? "is-current" : ""} ${secret && secret.hp === 0 ? "is-down" : ""}`}>
              {canSet ? (
                <InitiativeInput
                  value={c.initiative}
                  label={c.name}
                  bonus={c.character ? initiativeBonus(c.character) : (secret?.initiativeBonus ?? 0)}
                  onChange={(v, rolled) => {
                    if (c.character) setPcInitiative(c.character, v);
                    else setMonster(c.id, { initiative: v });
                    if (rolled) push({ title: `Iniziativa di ${c.name}`, lines: [], rolls: [{ label: "d20", expr: "1d20", dice: rolled.dice, total: rolled.total }] });
                  }}
                />
              ) : (
                <span className="init-value">{c.initiative ?? "—"}</span>
              )}
              <span className="init-name">
                {c.name}
                {c.id === encounter.currentId && <span className="tag"> di turno</span>}
              </span>
              {isDm && secret && (
                <span className="init-monster">
                  <span>
                    PF {secret.hp}/{secret.hpMax} · CA {secret.ac}
                  </span>
                  <input type="number" min={0} value={damage[c.id] ?? ""} placeholder="PF" aria-label={`Punti ferita per ${c.name}`} className="short-input" onChange={(e) => setDamage({ ...damage, [c.id]: e.currentTarget.value })} />
                  <button className="btn btn-danger" onClick={() => hit(c.id, 1)}>
                    Danno
                  </button>
                  <button className="btn btn-heal" onClick={() => hit(c.id, -1)}>
                    Cura
                  </button>
                  <button className="icon-btn" aria-label={`Togli ${c.name}`} onClick={() => removeMonster(c.id)}>
                    ×
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {order.length === 0 && <p className="muted small">Nessuno in combattimento: collega dei personaggi o aggiungi dei mostri.</p>}
      {isDm && <AddMonster onAdd={addMonsters} />}
    </section>
  );
}

/** Nella scheda: di chi è il turno, e il campo per la propria iniziativa. */
export function TurnBanner({ ch, onInitiative }: { ch: CharacterData; onInitiative: (v: number | null) => void }) {
  const { push } = useLog();
  const encounter = useEncounter(ch.campaignId);
  const [party, setParty] = useState<CharacterData[]>([]);
  const active = !!encounter?.active;
  useEffect(() => (active && ch.campaignId ? repo.watchCampaignCharacters(ch.campaignId, setParty) : undefined), [active, ch.campaignId]);
  if (!encounter?.active) return null;
  const order = initiativeOrder(party, encounter.monsters);
  const current = order.find((c) => c.id === encounter.currentId);
  const myTurn = encounter.currentId === ch.id;
  return (
    <section className={`panel turn-banner ${myTurn ? "is-mine" : ""}`} aria-live="polite">
      <p>
        <strong>{myTurn ? "È il tuo turno" : current ? `Turno di ${current.name}` : "Combattimento iniziato"}</strong> <span className="muted small">round {encounter.round}</span>
      </p>
      <label className="small">
        La tua iniziativa{" "}
        <InitiativeInput
          value={ch.state.initiative ?? null}
          label={ch.name}
          bonus={initiativeBonus(ch)}
          onChange={(v, rolled) => {
            onInitiative(v);
            if (rolled) push({ title: "Iniziativa", lines: [], rolls: [{ label: "d20", expr: "1d20", dice: rolled.dice, total: rolled.total }] });
          }}
        />
      </label>
    </section>
  );
}
