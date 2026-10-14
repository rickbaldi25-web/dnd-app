import { crXp, rateEncounter, type CharacterData, type EncounterDifficulty } from "@dnd/engine";
import { useEffect, useState } from "react";
import { repo, type AdventureNote, type Encounter, type EncounterPlan, type LootItem, type MonsterSecret, type PlanEntry } from "../data";
import { useLog } from "../state/log";
import { AddMonster, useEncounter, withMonsters } from "./Initiative";
import { TreasureEditor, withTreasure } from "./Loot";

const DIFFICULTY: Record<EncounterDifficulty, string> = { trivial: "Banale", easy: "Facile", medium: "Medio", hard: "Difficile", deadly: "Mortale" };
const pe = (n: number) => n.toLocaleString("it-IT");

/** Capitoli presenti, nell'ordine in cui compaiono. */
const chaptersOf = (plans: EncounterPlan[]) => [...new Set(plans.map((p) => p.chapter ?? "").filter(Boolean))];
/** La ricerca guarda il nome dell'incontro e quello dei mostri. */
function matchesPlan(plan: EncounterPlan, query: string, chapter: string): boolean {
  if (chapter && (plan.chapter ?? "") !== chapter) return false;
  const q = query.trim().toLowerCase();
  return !q || plan.name.toLowerCase().includes(q) || plan.entries.some((e) => e.name.toLowerCase().includes(q));
}

/** Porta i mostri di un incontro preparato in combattimento: lo apre se non ce n'è uno, altrimenti li aggiunge. */
export function startPlan(campaignId: string, encounter: Encounter | null, secrets: Record<string, MonsterSecret>, plan: EncounterPlan, loot: LootItem[], combatNotes: AdventureNote[] = []): Promise<unknown> {
  const running = encounter?.active ? encounter : { active: true, round: 1, monsters: [] };
  const next = withMonsters(
    running,
    encounter?.active ? secrets : {},
    plan.entries.map((e) => ({ monster: { name: e.name, hp: e.hp, ac: e.ac, bonus: e.initiativeBonus, ...(e.monsterId ? { monsterId: e.monsterId } : {}), ...(e.cr ? { cr: e.cr } : {}) }, count: e.count })),
  );
  return Promise.all([
    repo.saveEncounter(campaignId, next.encounter),
    repo.saveMonsterSecrets(campaignId, next.secrets),
    ...(plan.treasure?.length ? [repo.saveLoot(campaignId, withTreasure(loot, plan.treasure))] : []),
    // Le note si sommano a quelle già in corso se l'incontro si aggiunge a un combattimento aperto.
    ...(plan.notes?.length ? [repo.saveCombatNotes(campaignId, [...(encounter?.active ? combatNotes : []), ...plan.notes.map((n) => ({ ...n, title: `${plan.name}: ${n.title}` }))])] : []),
  ]);
}

/**
 * Fuori dal combattimento: gli incontri già pronti, da lanciare con un tasto.
 * onPrepare porta alla scheda dove si preparano.
 */
export function QuickEncounters({ campaignId, party, onPrepare }: { campaignId: string; party: CharacterData[]; onPrepare: () => void }) {
  const { push } = useLog();
  const encounter = useEncounter(campaignId);
  const [plans, setPlans] = useState<EncounterPlan[]>([]);
  const [loot, setLoot] = useState<LootItem[]>([]);
  useEffect(() => repo.watchEncounterPlans(campaignId, setPlans), [campaignId]);
  useEffect(() => repo.watchLoot(campaignId, setLoot), [campaignId]);
  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const levels = party.map((ch) => Math.max(1, ch.levels.length));
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("");
  const all = plans.filter((p) => p.entries.length > 0);
  const chapters = chaptersOf(all);
  const ready = all.filter((p) => matchesPlan(p, query, chapters.includes(chapter) ? chapter : ""));
  return (
    <section className="panel quick-encounters">
      <div className="row between">
        <h2>Incontri pronti</h2>
        <button className="link-btn" onClick={onPrepare}>
          Prepara
        </button>
      </div>
      {(all.length > 5 || chapters.length > 0) && (
        <div className="row plan-filters">
          <input type="search" value={query} placeholder="Cerca incontro o mostro" aria-label="Cerca tra gli incontri pronti" onChange={(e) => setQuery(e.currentTarget.value)} />
          {chapters.length > 0 && (
            <select value={chapter} aria-label="Capitolo" onChange={(e) => setChapter(e.currentTarget.value)}>
              <option value="">Tutti i capitoli</option>
              {chapters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      {all.length === 0 && <p className="muted small">Nessun incontro preparato. Puoi iniziare un combattimento vuoto e aggiungere i mostri al momento.</p>}
      {all.length > 0 && ready.length === 0 && <p className="muted small">Nessun incontro corrisponde.</p>}
      <ul className="quick-list">
        {ready.map((plan) => {
          const rating = rateEncounter(levels, plan.entries);
          return (
            <li key={plan.id}>
              <span className="quick-name">
                <strong>{plan.name}</strong>
                <span className="muted small">{plan.entries.map((e) => `${e.count} × ${e.name}`).join(", ")}</span>
              </span>
              {rating.difficulty && <span className={`tag diff-${rating.difficulty}`}>{DIFFICULTY[rating.difficulty]}</span>}
              <button
                className="btn btn-primary"
                onClick={() => {
                  // In questo riquadro non c'è mai un combattimento in corso: si parte da zero.
                  startPlan(campaignId, encounter, {}, plan, loot).catch(failed);
                  push({ title: `${plan.name}: mostri in combattimento`, lines: plan.entries.map((e) => `${e.count} × ${e.name}`), rolls: [] });
                }}
              >
                Inizia
              </button>
            </li>
          );
        })}
      </ul>
      <button className="btn" onClick={() => repo.saveEncounter(campaignId, { active: true, round: 1, monsters: [] }).catch(failed)}>
        Combattimento vuoto
      </button>
    </section>
  );
}

/** Incontri preparati dal Master, con il conto dei PE rispetto al gruppo. I giocatori non li vedono. */
export function EncounterBuilder({ campaignId, party, onLaunch }: { campaignId: string; party: CharacterData[]; onLaunch?: () => void }) {
  const { push } = useLog();
  const encounter = useEncounter(campaignId);
  const [plans, setPlans] = useState<EncounterPlan[]>([]);
  const [secrets, setSecrets] = useState<Record<string, MonsterSecret>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [query, setQuery] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");
  const [difficulty, setDifficulty] = useState<EncounterDifficulty | "">("");
  const [closed, setClosed] = useState<string[]>([]);
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [combatNotes, setCombatNotes] = useState<AdventureNote[]>([]);
  useEffect(() => repo.watchCombatNotes(campaignId, setCombatNotes), [campaignId]);
  useEffect(() => repo.watchEncounterPlans(campaignId, setPlans), [campaignId]);
  useEffect(() => repo.watchLoot(campaignId, setLoot), [campaignId]);
  useEffect(() => repo.watchMonsterSecrets(campaignId, setSecrets), [campaignId]);

  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const save = (next: EncounterPlan[]) => {
    setPlans(next);
    repo.saveEncounterPlans(campaignId, next).catch(failed);
  };
  const patch = (id: string, change: Partial<EncounterPlan>) => save(plans.map((p) => (p.id === id ? { ...p, ...change } : p)));
  const levels = party.map((ch) => Math.max(1, ch.levels.length));
  const budget = rateEncounter(levels, []).thresholds;

  const chapters = chaptersOf(plans);
  const chapter = chapters.includes(chapterFilter) ? chapterFilter : "";
  const filtering = !!query.trim() || !!difficulty;
  const visible = plans.filter((p) => matchesPlan(p, query, chapter) && (!difficulty || rateEncounter(levels, p.entries).difficulty === difficulty));
  // Un gruppo per capitolo, nell'ordine in cui compaiono; in fondo gli incontri senza capitolo.
  const groups = [...chapters, ""].map((c) => ({ chapter: c, plans: visible.filter((p) => (p.chapter ?? "") === c) })).filter((g) => g.plans.length > 0);
  const create = () => {
    const id = `p-${Date.now().toString(36)}`;
    // Con un capitolo scelto nel filtro, il nuovo incontro nasce lì.
    save([...plans, { id, name: newName.trim() || `Incontro ${plans.length + 1}`, ...(chapter ? { chapter } : {}), entries: [] }]);
    setNewName("");
    setOpenId(id);
  };
  const launch = (plan: EncounterPlan) => {
    startPlan(campaignId, encounter, secrets, plan, loot, combatNotes).catch(failed);
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
      {plans.length > 0 && (
        <div className="row plan-filters">
          <input type="search" value={query} placeholder="Cerca incontro o mostro" aria-label="Cerca tra gli incontri" onChange={(e) => setQuery(e.currentTarget.value)} />
          {chapters.length > 0 && (
            <select value={chapter} aria-label="Capitolo" onChange={(e) => setChapterFilter(e.currentTarget.value)}>
              <option value="">Tutti i capitoli</option>
              {chapters.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          {levels.length > 0 && (
            <select value={difficulty} aria-label="Difficoltà" onChange={(e) => setDifficulty(e.currentTarget.value as EncounterDifficulty | "")}>
              <option value="">Ogni difficoltà</option>
              {(Object.keys(DIFFICULTY) as EncounterDifficulty[]).map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY[d]}
                </option>
              ))}
            </select>
          )}
          {visible.length !== plans.length && (
            <span className="muted small">
              {visible.length} di {plans.length}
            </span>
          )}
        </div>
      )}
      {plans.length > 0 && visible.length === 0 && <p className="muted small">Nessun incontro corrisponde.</p>}
      <datalist id="capitoli-incontri">
        {chapters.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {groups.map((g) => {
        // Cercando si aprono tutti i capitoli: altrimenti i risultati resterebbero nascosti.
        const shut = !filtering && closed.includes(g.chapter);
        return (
        <div key={g.chapter || "-"} className="plan-chapter">
          {chapters.length > 0 && (
            <button className="disclosure chapter-head" aria-expanded={!shut} onClick={() => setClosed(shut ? closed.filter((c) => c !== g.chapter) : [...closed, g.chapter])}>
              {g.chapter || "Senza capitolo"} <span className="muted small">{g.plans.length}</span>
            </button>
          )}
          {!shut && (
      <ul className="plan-list">
        {g.plans.map((plan) => {
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
                  <label className="small">
                    Capitolo{" "}
                    <input
                      defaultValue={plan.chapter ?? ""}
                      key={plan.chapter ?? ""}
                      list="capitoli-incontri"
                      placeholder="nessuno"
                      aria-label="Capitolo dell'incontro"
                      onBlur={(e) => {
                        const v = e.currentTarget.value.trim();
                        if (v === (plan.chapter ?? "")) return;
                        const { chapter: _old, ...rest } = plan;
                        save(plans.map((p) => (p.id === plan.id ? { ...rest, ...(v ? { chapter: v } : {}) } : p)));
                      }}
                    />
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
                  {plan.notes?.map((n, i) => (
                    <details key={i} className="adventure-note">
                      <summary>
                        <span>{n.title || "Nota"}</span>
                      </summary>
                      <p className="handout-text">{n.text}</p>
                    </details>
                  ))}
                  <TreasureEditor items={plan.treasure ?? []} onChange={(treasure) => patch(plan.id, { treasure })} />
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
          )}
        </div>
        );
      })}
      <div className="row">
        <input value={newName} placeholder="Nome del nuovo incontro" aria-label="Nome del nuovo incontro" onChange={(e) => setNewName(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && create()} />
        <button className="btn" onClick={create}>
          Nuovo incontro
        </button>
      </div>
    </section>
  );
}
