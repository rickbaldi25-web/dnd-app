import { rateEncounter, type CharacterData, type MonsterDef } from "@dnd/engine";
import { importCampaign } from "@dnd/importer";
import { useEffect, useMemo, useState } from "react";
import { loadMonsters } from "../content";
import { repo, type AdventureChapter, type AdventureDoc, type AdventureMeta, type AdventureNote, type EncounterPlan, type LootItem, type MonsterSecret } from "../data";
import { buildAdventure, embeddableUrl, type BuiltAdventure } from "../state/adventure";
import { useLog } from "../state/log";
import { startPlan } from "./EncounterBuilder";
import { useEncounter } from "./Initiative";
import { MonsterStatBlock } from "./MonsterStatBlock";

const DIFFICULTY: Record<string, string> = { trivial: "Banale", easy: "Facile", medium: "Medio", hard: "Difficile", deadly: "Mortale" };

/** Una nota apribile: titolo, testo a parte. */
function Note({ note, open = false }: { note: AdventureNote; open?: boolean }) {
  return (
    <details className="adventure-note" open={open}>
      <summary>
        <span>{note.title || "Nota"}</span>
      </summary>
      <p className="handout-text">{note.text}</p>
    </details>
  );
}

/** Documenti esterni (il PDF dell'avventura, mappe): si leggono qui dentro, senza cambiare pagina. */
function Documents({ meta, save }: { meta: AdventureMeta; save: (m: AdventureMeta) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const ok = /^https:\/\//.test(url.trim());
  const add = () => {
    if (!ok) return;
    const doc: AdventureDoc = { title: title.trim() || "Documento", url: url.trim() };
    save({ ...meta, docs: [...meta.docs, doc] });
    setTitle("");
    setUrl("");
    setOpen(doc.url);
  };
  return (
    <section className="panel adventure-docs">
      <h2>Documenti</h2>
      <p className="muted small">Il PDF dell'avventura o una mappa, da un indirizzo online (Google Drive condiviso, Dropbox, un sito). Si legge qui sotto; alcuni siti non si lasciano incorporare e vanno aperti in una nuova scheda.</p>
      <ul className="handout-list">
        {meta.docs.map((d) => (
          <li key={d.url} className={open === d.url ? "is-open" : ""}>
            <div className="row between">
              <button className="disclosure" aria-expanded={open === d.url} onClick={() => setOpen(open === d.url ? null : d.url)}>
                {d.title}
              </button>
              <span className="row">
                <a className="link-btn" href={d.url} target="_blank" rel="noreferrer">
                  Nuova scheda
                </a>
                <button className="icon-btn" aria-label={`Togli ${d.title}`} onClick={() => save({ ...meta, docs: meta.docs.filter((x) => x.url !== d.url) })}>
                  ×
                </button>
              </span>
            </div>
            {open === d.url && <iframe className="doc-frame" src={embeddableUrl(d.url)} title={d.title} referrerPolicy="no-referrer" />}
          </li>
        ))}
      </ul>
      <div className="row">
        <input value={title} placeholder="Titolo" aria-label="Titolo del documento" onChange={(e) => setTitle(e.currentTarget.value)} />
        <input value={url} placeholder="https://…" aria-label="Indirizzo del documento" onChange={(e) => setUrl(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className="btn" disabled={!ok} onClick={add}>
          Aggiungi
        </button>
      </div>
    </section>
  );
}

/** Caricamento di un file di campagna (Game Master 5): anteprima e conferma prima di salvare. */
function ImportBox({ campaignId, meta, chapters, plans }: { campaignId: string; meta: AdventureMeta | null; chapters: AdventureChapter[]; plans: EncounterPlan[] }) {
  const { push } = useLog();
  const [built, setBuilt] = useState<BuiltAdventure | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const read = async (file: File) => {
    setError("");
    setBuilt(null);
    setBusy(true);
    try {
      const campaign = importCampaign(await file.text());
      setBuilt(buildAdventure(campaign, await loadMonsters()));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };
  const confirm = async () => {
    if (!built) return;
    setBusy(true);
    try {
      // Si sostituisce l'avventura precedente con i suoi incontri; quelli scritti a mano restano.
      await repo.deleteAdventure(campaignId, chapters.map((c) => c.id), false);
      for (const ch of built.chapters) await repo.saveAdventureChapter(campaignId, ch);
      await repo.saveAdventureMeta(campaignId, { ...built.meta, docs: meta?.docs ?? [] });
      await repo.saveEncounterPlans(campaignId, [...plans.filter((p) => !p.source), ...built.plans]);
      push({ title: `Avventura importata: ${built.meta.name}`, lines: [`${built.chapters.length} capitoli, ${built.plans.length} incontri pronti`], rolls: [], tone: "good" });
      setBuilt(null);
    } catch (e) {
      push({ title: "Importazione non riuscita", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
    } finally {
      setBusy(false);
    }
  };
  const encounters = built?.chapters.reduce((n, c) => n + c.encounters.length, 0) ?? 0;
  const npcs = built?.chapters.reduce((n, c) => n + c.npcs.length, 0) ?? 0;
  return (
    <div className="adventure-import">
      <label className="btn">
        {meta ? "Importa un'altra avventura" : "Importa un'avventura (XML)"}
        <input type="file" accept=".xml,text/xml" hidden onChange={(e) => e.currentTarget.files?.[0] && read(e.currentTarget.files[0])} />
      </label>
      {busy && <p className="muted small">Leggo il file…</p>}
      {error && <p className="small tag-bad-text">{error}</p>}
      {built && (
        <div className="end-combat">
          <h3>{built.meta.name}</h3>
          <p className="small">
            {built.chapters.length} capitoli, {encounters} incontri ({built.plans.length} con mostri, pronti da lanciare), {npcs} PNG.
          </p>
          {built.unmatched.length > 0 && <p className="muted small">Senza scheda nella raccolta: {built.unmatched.join(", ")}. In combattimento avranno PF e CA ma non la scheda completa; i PNG la hanno qui nell'Avventura.</p>}
          {meta && <p className="small">Sostituisce «{meta.name}» e i suoi incontri importati. Gli incontri che hai scritto tu restano.</p>}
          <div className="row">
            <button className="btn btn-primary" disabled={busy} onClick={confirm}>
              Importa
            </button>
            <button className="btn btn-quiet" onClick={() => setBuilt(null)}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** La parola cercata compare nel testo? */
const has = (q: string, ...texts: (string | undefined)[]) => !q || texts.some((t) => t?.toLowerCase().includes(q));

/**
 * L'avventura della campagna, solo per il Master: capitoli con note, PNG e incontri, più i documenti esterni.
 * onLaunched si chiama quando un incontro parte, per passare alla vista di combattimento.
 */
export function AdventurePanel({ campaignId, party, onLaunched }: { campaignId: string; party: CharacterData[]; onLaunched: () => void }) {
  const { push } = useLog();
  const encounter = useEncounter(campaignId);
  const [meta, setMeta] = useState<AdventureMeta | null>(null);
  const [chapters, setChapters] = useState<AdventureChapter[]>([]);
  const [plans, setPlans] = useState<EncounterPlan[]>([]);
  const [secrets, setSecrets] = useState<Record<string, MonsterSecret>>({});
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [combatNotes, setCombatNotes] = useState<AdventureNote[]>([]);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [library, setLibrary] = useState<MonsterDef[] | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => repo.watchAdventure(campaignId, (m, c) => (setMeta(m), setChapters(c))), [campaignId]);
  useEffect(() => repo.watchEncounterPlans(campaignId, setPlans), [campaignId]);
  useEffect(() => repo.watchMonsterSecrets(campaignId, setSecrets), [campaignId]);
  useEffect(() => repo.watchLoot(campaignId, setLoot), [campaignId]);
  useEffect(() => repo.watchCombatNotes(campaignId, setCombatNotes), [campaignId]);
  // La raccolta dei mostri serve solo aprendo un capitolo: le schede degli incontri vengono da lì.
  useEffect(() => {
    if ((openChapter || query) && !library) loadMonsters().then(setLibrary).catch(() => setLibrary([]));
  }, [openChapter, query, library]);
  const byName = useMemo(() => new Map((library ?? []).map((m) => [m.name.toLowerCase(), m])), [library]);

  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const saveMeta = (m: AdventureMeta) => {
    setMeta(m);
    repo.saveAdventureMeta(campaignId, m).catch(failed);
  };
  const levels = party.map((ch) => Math.max(1, ch.levels.length));
  const q = query.trim().toLowerCase();
  const launch = (plan: EncounterPlan) => {
    startPlan(campaignId, encounter, secrets, plan, loot, combatNotes).catch(failed);
    push({ title: `${plan.name}: mostri in combattimento`, lines: plan.entries.map((e) => `${e.count} × ${e.name}`), rolls: [] });
    onLaunched();
  };
  const remove = () => {
    if (!meta || !window.confirm(`Togliere «${meta.name}» dalla campagna? Spariscono capitoli e incontri importati; documenti e incontri scritti a mano restano.`)) return;
    repo.deleteAdventure(campaignId, chapters.map((c) => c.id), false).catch(failed);
    saveMeta({ name: "", notes: [], items: [], docs: meta.docs });
    repo.saveEncounterPlans(campaignId, plans.filter((p) => !p.source)).catch(failed);
  };

  const imported = !!meta?.name;
  return (
    <>
      <section className="panel adventure">
        <div className="row between">
          <h2>{imported ? meta!.name : "Avventura"}</h2>
          {imported && (
            <button className="btn btn-danger-quiet" onClick={remove}>
              Togli l'avventura
            </button>
          )}
        </div>
        {!imported && <p className="muted small">Carica il file XML di un'avventura (formato Game Master 5): capitoli, note, PNG e incontri entrano nella campagna, e ogni scontro diventa un incontro pronto da lanciare. Lo vedi solo tu.</p>}
        <ImportBox campaignId={campaignId} meta={imported ? meta : null} chapters={chapters} plans={plans} />
        {imported && (
          <input type="search" className="adventure-search" value={query} placeholder="Cerca in note, PNG e incontri" aria-label="Cerca nell'avventura" onChange={(e) => setQuery(e.currentTarget.value)} />
        )}
        {imported && (meta!.notes.length > 0 || meta!.items.length > 0) && !q && (
          <div className="feature-list">
            {meta!.notes.map((n, i) => (
              <Note key={`n${i}`} note={n} />
            ))}
            {meta!.items.map((n, i) => (
              <Note key={`i${i}`} note={{ ...n, title: `Oggetto: ${n.title}` }} />
            ))}
          </div>
        )}
      </section>

      {chapters.map((ch) => {
        const notes = ch.notes.filter((n) => has(q, n.title, n.text));
        const npcs = ch.npcs.filter((n) => has(q, n.label, n.monster.name));
        const encounters = ch.encounters.map((e, i) => ({ e, i })).filter(({ e }) => has(q, e.name, ...e.groups.map((g) => g.label), ...e.notes.flatMap((n) => [n.title, n.text])));
        if (q && !notes.length && !npcs.length && !encounters.length) return null;
        const open = !!q || openChapter === ch.id;
        return (
          <section key={ch.id} className={`panel chapter ${open ? "is-open" : ""}`}>
            <button className="disclosure chapter-head" aria-expanded={open} onClick={() => setOpenChapter(open && !q ? null : ch.id)}>
              {ch.name}{" "}
              <span className="muted small">
                {ch.encounters.length} incontri · {ch.npcs.length} PNG · {ch.notes.length} note
              </span>
            </button>
            {open && (
              <div className="chapter-body">
                {notes.length > 0 && (
                  <div className="feature-list">
                    {notes.map((n, i) => (
                      <Note key={i} note={n} open={!!q} />
                    ))}
                  </div>
                )}
                {npcs.length > 0 && (
                  <>
                    <h3>PNG</h3>
                    <div className="feature-list">
                      {npcs.map((n, i) => (
                        <details key={i} className="adventure-note">
                          <summary>
                            <span>{n.label}</span> <span className="muted small">{n.monster.name !== n.label ? n.monster.name : ""} · GS {n.monster.cr}</span>
                          </summary>
                          <MonsterStatBlock monster={n.monster} name={n.label} />
                        </details>
                      ))}
                    </div>
                  </>
                )}
                {encounters.length > 0 && (
                  <>
                    <h3>Incontri</h3>
                    <ul className="plan-list">
                      {encounters.map(({ e, i }) => {
                        const plan = plans.find((p) => p.id === e.planId);
                        const rating = plan ? rateEncounter(levels, plan.entries) : null;
                        return (
                          <li key={i}>
                            <div className="row between">
                              <strong>{e.name}</strong>
                              <span className="plan-summary">
                                {e.groups.length > 0 && <span className="muted small">{e.groups.map((g) => `${g.count} × ${g.label}`).join(", ")}</span>}
                                {rating?.difficulty && <span className={`tag diff-${rating.difficulty}`}>{DIFFICULTY[rating.difficulty]}</span>}
                                {plan && (
                                  <button className="btn btn-primary" onClick={() => launch(plan)}>
                                    {encounter?.active ? "Aggiungi al combattimento" : "Inizia"}
                                  </button>
                                )}
                              </span>
                            </div>
                            {(e.notes.length > 0 || e.treasure.length > 0 || e.groups.length > 0) && (
                              <div className="feature-list">
                                {e.notes.map((n, j) => (
                                  <Note key={j} note={n} open={!!q && has(q, n.title, n.text)} />
                                ))}
                                {e.treasure.length > 0 && <Note note={{ title: "Tesoro", text: e.treasure.map((t) => `${t.quantity > 1 ? `${t.quantity} × ` : ""}${t.name}`).join("\n") }} />}
                                {e.groups.map((g, j) => {
                                  const sheet = byName.get(g.name.toLowerCase());
                                  return sheet ? (
                                    <details key={`m${j}`} className="adventure-note">
                                      <summary>
                                        <span>Scheda: {g.label}</span> <span className="muted small">GS {g.cr}</span>
                                      </summary>
                                      <MonsterStatBlock monster={sheet} name={g.label} />
                                    </details>
                                  ) : null;
                                })}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            )}
          </section>
        );
      })}

      <Documents meta={meta ?? { name: "", notes: [], items: [], docs: [] }} save={saveMeta} />
    </>
  );
}
