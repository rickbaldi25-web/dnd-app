import { crXp, rateEncounter, type CharacterData, type EncounterDifficulty } from "@dnd/engine";
import { useEffect, useState } from "react";
import { repo, type EncounterPlan, type MonsterSecret, type PlanEntry } from "../data";
import { useLog } from "../state/log";
import { AddMonster, useEncounter, withMonsters } from "./Initiative";

const DIFFICULTY: Record<EncounterDifficulty, string> = { trivial: "Banale", easy: "Facile", medium: "Medio", hard: "Difficile", deadly: "Mortale" };
const pe = (n: number) => n.toLocaleString("it-IT");

/** Incontri preparati dal Master, con il conto dei PE rispetto al gruppo. I giocatori non li vedono. */
export function EncounterBuilder({ campaignId, party, onLaunch }: { campaignId: string; party: CharacterData[]; onLaunch?: () => void }) {
  const { push } = useLog();
  const encounter = useEncounter(campaignId);
  const [plans, setPlans] = useState<EncounterPlan[]>([]);
  const [secrets, setSecrets] = useState<Record<string, MonsterSecret>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  useEffect(() => repo.watchEncounterPlans(campaignId, setPlans), [campaignId]);
  useEffect(() => repo.watchMonsterSecrets(campaignId, setSecrets), [campaignId]);

  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const save = (next: EncounterPlan[]) => {
    setPlans(next);
    repo.saveEncounterPlans(campaignId, next).catch(failed);
  };
  const patch = (id: string, change: Partial<EncounterPlan>) => save(plans.map((p) => (p.id === id ? { ...p, ...change } : p)));
  const levels = party.map((ch) => Math.max(1, ch.levels.length));
  const budget = rateEncounter(levels, []).thresholds;

  const create = () => {
    const id = `p-${Date.now().toString(36)}`;
    save([...plans, { id, name: newName.trim() || `Incontro ${plans.length + 1}`, entries: [] }]);
    setNewName("");
    setOpenId(id);
  };
  const launch = (plan: EncounterPlan) => {
    const running = encounter?.active ? encounter : { active: true, round: 1, monsters: [] };
    const next = withMonsters(
      running,
      encounter?.active ? secrets : {},
      plan.entries.map((e) => ({ monster: { name: e.name, hp: e.hp, ac: e.ac, bonus: e.initiativeBonus, ...(e.monsterId ? { monsterId: e.monsterId } : {}) }, count: e.count })),
    );
    repo.saveEncounter(campaignId, next.encounter).catch(failed);
    repo.saveMonsterSecrets(campaignId, next.secrets).catch(failed);
    push({ title: `${plan.name}: mostri in combattimento`, lines: plan.entries.map((e) => `${e.count} × ${e.name}`), rolls: [] });
    onLaunch?.();
  };

  return (
    <section className="panel encounter-builder">
      <h2>Incontri preparati</h2>
      <p className="muted small">
        {levels.length
          ? `Gruppo di ${levels.length} (livelli ${levels.join(", ")}) · soglie di PE: facile ${pe(budget.easy)}, medio ${pe(budget.medium)}, difficile ${pe(budget.hard)}, mortale ${pe(budget.deadly)}`
          : "Collega dei personaggi alla campagna per avere il giudizio di difficoltà."}
      </p>
      <ul className="plan-list">
        {plans.map((plan) => {
          const rating = rateEncounter(levels, plan.entries);
          const total = plan.entries.reduce((n, e) => n + e.count, 0);
          const unrated = plan.entries.filter((e) => !e.cr).length;
          const open = openId === plan.id;
          const setEntry = (i: number, change: Partial<PlanEntry> | null) =>
            patch(plan.id, { entries: plan.entries.flatMap((e, j) => (j !== i ? [e] : change ? [{ ...e, ...change }] : [])) });
          return (
            <li key={plan.id} className={open ? "is-open" : ""}>
              <div className="row between">
                <button className="disclosure" aria-expanded={open} onClick={() => setOpenId(open ? null : plan.id)}>
                  {plan.name}
                </button>
                <span className="plan-summary">
                  <span className="muted small">
                    {total} {total === 1 ? "mostro" : "mostri"} · {pe(rating.xp)} PE
                    {rating.multiplier !== 1 && total > 0 ? ` × ${rating.multiplier.toLocaleString("it-IT")} = ${pe(rating.adjustedXp)}` : ""}
                  </span>
                  {rating.difficulty && total > 0 && <span className={`tag diff-${rating.difficulty}`}>{DIFFICULTY[rating.difficulty]}</span>}
                  <button className="btn btn-primary" disabled={!total} onClick={() => launch(plan)}>
                    {encounter?.active ? "Aggiungi al combattimento" : "Inizia"}
                  </button>
                </span>
              </div>
              {open && (
                <div className="plan-body">
                  <label className="small">
                    Nome{" "}
                    <input defaultValue={plan.name} key={plan.name} aria-label="Nome dell'incontro" onBlur={(e) => e.currentTarget.value.trim() && e.currentTarget.value.trim() !== plan.name && patch(plan.id, { name: e.currentTarget.value.trim() })} />
                  </label>
                  {plan.entries.length > 0 && (
                    <ul className="plan-entries">
                      {plan.entries.map((e, i) => (
                        <li key={i}>
                          <span className="plan-count">
                            <button className="icon-btn" aria-label={`Un ${e.name} in meno`} disabled={e.count <= 1} onClick={() => setEntry(i, { count: e.count - 1 })}>
                              −
                            </button>
                            <strong>{e.count}</strong>
                            <button className="icon-btn" aria-label={`Un ${e.name} in più`} disabled={e.count >= 20} onClick={() => setEntry(i, { count: e.count + 1 })}>
                              +
                            </button>
                          </span>
                          <span className="plan-entry-name">{e.name}</span>
                          <span className="muted small">
                            {e.cr ? `GS ${e.cr} · ${pe(crXp(e.cr))} PE` : "senza GS"} · PF {e.hp} · CA {e.ac}
                          </span>
                          <button className="icon-btn" aria-label={`Togli ${e.name}`} onClick={() => setEntry(i, null)}>
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {total > 0 && (
                    <p className="small">
                      {pe(rating.xp)} PE da dividere{levels.length ? `: ${pe(Math.floor(rating.xp / levels.length))} a testa` : ""}.
                      {unrated > 0 && <span className="muted"> {unrated === 1 ? "Un mostro è" : `${unrated} mostri sono`} senza grado di sfida e non entrano nel conto.</span>}
                    </p>
                  )}
                  <AddMonster
                    withCr
                    onAdd={(m, count) => {
                      const same = plan.entries.findIndex((e) => e.name === m.name && e.hp === m.hp && e.ac === m.ac && e.cr === m.cr);
                      if (same >= 0) return setEntry(same, { count: Math.min(20, plan.entries[same]!.count + count) });
                      const entry: PlanEntry = { name: m.name, count, hp: m.hp, ac: m.ac, initiativeBonus: m.bonus, ...(m.cr ? { cr: m.cr } : {}), ...(m.monsterId ? { monsterId: m.monsterId } : {}) };
                      patch(plan.id, { entries: [...plan.entries, entry] });
                    }}
                  />
                  <button
                    className="btn btn-danger-quiet"
                    onClick={() => {
                      if (window.confirm(`Eliminare l'incontro ${plan.name}?`)) save(plans.filter((p) => p.id !== plan.id));
                    }}
                  >
                    Elimina incontro
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="row">
        <input value={newName} placeholder="Nome del nuovo incontro" aria-label="Nome del nuovo incontro" onChange={(e) => setNewName(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && create()} />
        <button className="btn" onClick={create}>
          Nuovo incontro
        </button>
      </div>
    </section>
  );
}
