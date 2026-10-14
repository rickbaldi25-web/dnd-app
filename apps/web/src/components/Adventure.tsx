import { rateEncounter, type CharacterData, type MonsterDef } from "@dnd/engine";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadMonsters } from "../content";
import { repo, type AdventureChapter, type AdventureDoc, type AdventureMeta, type AdventureNote, type EncounterPlan, type LootItem, type MonsterSecret } from "../data";
import { buildAdventure, embeddableUrl, type BuiltAdventure } from "../state/adventure";
import { useLocalFiles, type LocalFile } from "../state/localFiles";
import { useLog } from "../state/log";
import { startPlan } from "./EncounterBuilder";
import { useEncounter } from "./Initiative";
import { MonsterStatBlock } from "./MonsterStatBlock";
import { extractPages, PdfViewer } from "./PdfViewer";

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

/** Un pezzo di testo intorno alla parola trovata. */
function snippet(text: string, q: string): string {
  const at = text.toLowerCase().indexOf(q);
  const from = Math.max(0, at - 70);
  return `${from > 0 ? "…" : ""}${text.slice(from, at + q.length + 90).replace(/\s+/g, " ")}…`;
}

/**
 * Un PDF dal computer: lo legge il lettore dell'app, che funziona anche su telefono,
 * con la ricerca nel testo e il salto alla pagina trovata.
 */
function LocalViewer({ file, setPages }: { file: LocalFile; setPages: (f: LocalFile, pages: string[]) => Promise<void> }) {
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<string | null>(null);
  const [jumpTo, setJumpTo] = useState<{ page: number; at: number } | undefined>();
  const q = query.trim().toLowerCase();
  const hits = useMemo(() => (q.length >= 3 && file.pages ? file.pages.flatMap((t, i) => (t.toLowerCase().includes(q) ? [{ page: i + 1, text: snippet(t, q) }] : [])).slice(0, 40) : []), [q, file.pages]);
  const index = async () => {
    setProgress("Leggo il testo…");
    try {
      const pages = await extractPages(file.blob, (done, total) => setProgress(`Leggo il testo: pagina ${done} di ${total}`));
      await setPages(file, pages);
      setProgress(null);
    } catch (e) {
      setProgress(`Testo non leggibile: ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  return (
    <>
      <div className="row pdf-search">
        {file.pages ? (
          <input type="search" value={query} placeholder="Cerca nel PDF (almeno 3 lettere)" aria-label={`Cerca in ${file.title}`} onChange={(e) => setQuery(e.currentTarget.value)} />
        ) : (
          <button className="btn" disabled={!!progress && progress.startsWith("Leggo")} onClick={index}>
            Rendi cercabile il testo
          </button>
        )}
        {progress && <span className="muted small">{progress}</span>}
      </div>
      {file.pages && file.pages.every((p) => !p) && <p className="muted small">Questo PDF non contiene testo (sono immagini scansionate): la ricerca non trova nulla.</p>}
      {q.length >= 3 && file.pages && (
        <ul className="pdf-hits">
          {hits.length === 0 && <li className="muted small">Nessuna pagina contiene «{query.trim()}».</li>}
          {hits.map((h) => (
            <li key={h.page}>
              <button className="link-btn" onClick={() => setJumpTo({ page: h.page, at: Date.now() })}>
                Pagina {h.page}
              </button>{" "}
              <span className="small muted">{h.text}</span>
            </li>
          ))}
        </ul>
      )}
      <PdfViewer source={file.blob} title={file.title} jumpTo={jumpTo} />
    </>
  );
}

/**
 * Un documento online. I PDF a indirizzo diretto li legge il lettore dell'app; Google Drive e i siti
 * che non lasciano leggere il file si mostrano incorporati come pagina.
 */
function RemoteDoc({ doc }: { doc: AdventureDoc }) {
  const embed = embeddableUrl(doc.url);
  const [frame, setFrame] = useState(embed !== doc.url || !/\.pdf(\?|#|$)/i.test(doc.url));
  const fail = useCallback(() => setFrame(true), []);
  return frame ? <iframe className="doc-frame" src={embed} title={doc.title} referrerPolicy="no-referrer" /> : <PdfViewer source={doc.url} title={doc.title} onFail={fail} />;
}

/** PDF tenuti nel browser di questo computer: non vanno online. */
function LocalDocuments({ campaignId }: { campaignId: string }) {
  const { push } = useLog();
  const { files, unavailable, add, remove, setPages } = useLocalFiles(campaignId);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const mb = (n: number) => `${(n / 1024 / 1024).toLocaleString("it-IT", { maximumFractionDigits: 1 })} MB`;
  return (
    <div className="local-docs">
      <h3>Su questo computer</h3>
      {unavailable ? (
        <p className="muted small">Questo browser non lascia salvare file (per esempio in una finestra anonima): usa un indirizzo online qui sotto.</p>
      ) : (
        <>
          <ul className="handout-list">
            {files.map((f) => (
              <li key={f.id} className={open === f.id ? "is-open" : ""}>
                <div className="row between">
                  <button className="disclosure" aria-expanded={open === f.id} onClick={() => setOpen(open === f.id ? null : f.id)}>
                    {f.title}
                  </button>
                  <span className="row">
                    <span className="muted small">{mb(f.size)}</span>
                    <button
                      className="icon-btn"
                      aria-label={`Togli ${f.title} da questo computer`}
                      onClick={() => window.confirm(`Togliere «${f.title}» da questo browser? Il file sul computer resta.`) && remove(f.id)}
                    >
                      ×
                    </button>
                  </span>
                </div>
                {open === f.id && <LocalViewer file={f} setPages={setPages} />}
              </li>
            ))}
          </ul>
          <label className="btn">
            {busy ? "Salvo…" : "Aggiungi un PDF dal computer"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              hidden
              onChange={async (e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (!file) return;
                setBusy(true);
                try {
                  await add(file);
                } catch (err) {
                  push({ title: "PDF non salvato", lines: [String(err instanceof Error ? err.message : err)], tone: "bad" });
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          <p className="muted small">Il file resta nel browser di questo dispositivo e non va online: su un altro dispositivo va aggiunto di nuovo.</p>
        </>
      )}
      <h3>Online</h3>
    </div>
  );
}

/** Documenti esterni (il PDF dell'avventura, mappe): si leggono qui dentro, senza cambiare pagina. */
function Documents({ campaignId, meta, save }: { campaignId: string; meta: AdventureMeta; save: (m: AdventureMeta) => void }) {
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
      <LocalDocuments campaignId={campaignId} />
      <p className="muted small">Il PDF dell'avventura o una mappa da un indirizzo online (Google Drive condiviso, Dropbox, un sito): si apre da ogni dispositivo. Alcuni siti non si lasciano incorporare e vanno aperti in una nuova scheda.</p>
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
            {open === d.url && <RemoteDoc doc={d} />}
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
      // L'importatore è grande e serve di rado: si scarica solo adesso.
      const { importCampaign } = await import("@dnd/importer");
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

      <Documents campaignId={campaignId} meta={meta ?? { name: "", notes: [], items: [], docs: [] }} save={saveMeta} />
    </>
  );
}
