import type { CharacterData } from "@dnd/engine";
import { useEffect, useMemo, useRef, useState } from "react";
import { repo, type Handout } from "../data";
import { useLog } from "../state/log";

/** Solo indirizzi https: è l'unica cosa che finisce in un attributo src. */
function safeImageUrl(raw: string): string | undefined {
  try {
    const url = new URL(raw.trim());
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

const seenKey = (campaignId: string) => `dnd.handouts.seen.${campaignId}`;
function readSeen(campaignId: string): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(seenKey(campaignId)) ?? "{}");
  } catch {
    return {};
  }
}

function HandoutForm({ initial, onSave, onCancel }: { initial?: Handout; onSave: (h: { title: string; text: string; imageUrl?: string }) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [image, setImage] = useState(initial?.imageUrl ?? "");
  const url = image.trim() ? safeImageUrl(image) : undefined;
  const badUrl = !!image.trim() && !url;
  return (
    <div className="homebrew-form">
      <input value={title} placeholder="Titolo" aria-label="Titolo dell'handout" onChange={(e) => setTitle(e.currentTarget.value)} />
      <textarea value={text} rows={5} placeholder="Testo: la lettera, la descrizione, l'indizio…" aria-label="Testo dell'handout" onChange={(e) => setText(e.currentTarget.value)} />
      <input value={image} placeholder="Indirizzo di un'immagine (https://…), facoltativo" aria-label="Indirizzo dell'immagine" onChange={(e) => setImage(e.currentTarget.value)} />
      {badUrl && <p className="small tag-bad-text">L'indirizzo deve cominciare con https://</p>}
      {url && <img className="handout-image" src={url} alt="Anteprima" referrerPolicy="no-referrer" />}
      <div className="row">
        <button className="btn btn-primary" disabled={!title.trim() || badUrl} onClick={() => onSave({ title: title.trim(), text: text.trim(), ...(url ? { imageUrl: url } : {}) })}>
          Salva
        </button>
        <button className="btn btn-quiet" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </div>
  );
}

/**
 * Handout della campagna. Il Master li prepara nascosti e sceglie a chi mostrarli;
 * ogni giocatore vede solo quelli che gli sono stati mostrati.
 */
export function HandoutsPanel({ campaignId, isDm, uid, party, compact = false }: { campaignId: string; isDm: boolean; uid: string; party: CharacterData[]; compact?: boolean }) {
  const { push } = useLog();
  const [list, setList] = useState<Handout[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [seen, setSeen] = useState<Record<string, number>>(() => readSeen(campaignId));
  const known = useRef<Record<string, number> | null>(null);

  useEffect(() => {
    known.current = null;
    setSeen(readSeen(campaignId));
    return repo.watchHandouts(campaignId, { uid, isDm }, setList);
  }, [campaignId, uid, isDm]);

  // Avviso quando il Master mostra qualcosa di nuovo, ma non per ciò che c'era già all'apertura.
  useEffect(() => {
    if (isDm) return;
    const now = Object.fromEntries(list.map((h) => [h.id, h.revealedAt ?? h.createdAt]));
    if (known.current) {
      const fresh = list.filter((h) => (known.current![h.id] ?? 0) < now[h.id]!);
      if (fresh.length) push({ title: fresh.length === 1 ? "Nuovo handout" : "Nuovi handout", lines: fresh.map((h) => h.title), rolls: [], tone: "good" });
    }
    known.current = now;
  }, [list, isDm, push]);

  /** I giocatori a cui si può mostrare un handout: chi ha un personaggio nella campagna. */
  const players = useMemo(() => {
    const names = new Map<string, string[]>();
    for (const ch of party) if (ch.ownerUid && ch.ownerUid !== uid) names.set(ch.ownerUid, [...(names.get(ch.ownerUid) ?? []), ch.name]);
    return [...names].map(([id, chars]) => ({ uid: id, label: chars.join(", ") }));
  }, [party, uid]);

  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const save = (h: Handout) => repo.saveHandout(campaignId, h).catch(failed);
  const markSeen = (h: Handout) => {
    const next = { ...seen, [h.id]: h.revealedAt ?? h.createdAt };
    setSeen(next);
    try {
      localStorage.setItem(seenKey(campaignId), JSON.stringify(next));
    } catch {
      /* storage bloccato: resta segnato solo per questa visita */
    }
  };
  const toggle = (h: Handout) => {
    setOpenId(openId === h.id ? null : h.id);
    if (!isDm) markSeen(h);
  };
  const isNew = (h: Handout) => !isDm && (seen[h.id] ?? 0) < (h.revealedAt ?? h.createdAt);
  const sorted = [...list].sort((a, b) => (isDm ? b.createdAt - a.createdAt : (b.revealedAt ?? b.createdAt) - (a.revealedAt ?? a.createdAt)));

  if (!isDm && list.length === 0) {
    if (compact) return null;
    return (
      <section className="panel handouts">
        <h2>Handout</h2>
        <p className="muted small">Qui compare ciò che il Master ti mostra: lettere, mappe, ritratti.</p>
      </section>
    );
  }

  const status = (h: Handout) => {
    if (h.everyone) return "Visibile a tutti";
    const who = players.filter((p) => h.visibleTo.includes(p.uid)).map((p) => p.label);
    return who.length ? `Visibile a: ${who.join("; ")}` : "Nascosto";
  };

  return (
    <section className="panel handouts">
      <div className="row between">
        <h2>Handout</h2>
        {isDm && editing !== "new" && (
          <button className="btn" onClick={() => setEditing("new")}>
            Nuovo handout
          </button>
        )}
      </div>
      {isDm && editing === "new" && (
        <HandoutForm
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            save({ id: `h-${Date.now().toString(36)}`, ...data, everyone: false, visibleTo: [], createdAt: Date.now() });
            setEditing(null);
          }}
        />
      )}
      {isDm && list.length === 0 && editing !== "new" && <p className="muted small">Prepara lettere, mappe e ritratti: restano nascosti finché non decidi a chi mostrarli.</p>}
      <ul className="handout-list">
        {sorted.map((h) => {
          const open = openId === h.id;
          const hidden = !h.everyone && h.visibleTo.length === 0;
          return (
            <li key={h.id} className={open ? "is-open" : ""}>
              <div className="row between">
                <button className="disclosure" aria-expanded={open} onClick={() => toggle(h)}>
                  {h.title}
                  {isNew(h) && <span className="tag handout-new"> nuovo</span>}
                </button>
                {isDm && <span className={`tag ${hidden ? "" : "diff-easy"}`}>{status(h)}</span>}
              </div>
              {open && editing === h.id && (
                <HandoutForm
                  initial={h}
                  onCancel={() => setEditing(null)}
                  onSave={(data) => {
                    const { imageUrl: _old, ...rest } = h;
                    save({ ...rest, ...data });
                    setEditing(null);
                  }}
                />
              )}
              {open && editing !== h.id && (
                <div className="handout-body">
                  {h.imageUrl && safeImageUrl(h.imageUrl) && (
                    <a href={safeImageUrl(h.imageUrl)} target="_blank" rel="noreferrer">
                      <img className="handout-image" src={safeImageUrl(h.imageUrl)} alt={h.title} referrerPolicy="no-referrer" loading="lazy" />
                    </a>
                  )}
                  {h.text && <p className="handout-text">{h.text}</p>}
                  {isDm && (
                    <div className="handout-tools">
                      <div className="row">
                        <button className="btn btn-primary" disabled={h.everyone} onClick={() => save({ ...h, everyone: true, revealedAt: Date.now() })}>
                          Mostra a tutti
                        </button>
                        <button className="btn" disabled={hidden} onClick={() => save({ ...h, everyone: false, visibleTo: [] })}>
                          Nascondi
                        </button>
                        <button className="btn btn-quiet" onClick={() => setEditing(h.id)}>
                          Modifica
                        </button>
                        <button
                          className="btn btn-danger-quiet"
                          onClick={() => {
                            if (window.confirm(`Eliminare l'handout ${h.title}?`)) repo.deleteHandout(campaignId, h.id).catch(failed);
                          }}
                        >
                          Elimina
                        </button>
                      </div>
                      {!h.everyone && players.length > 0 && (
                        <div className="row handout-players">
                          <span className="small muted">Solo a:</span>
                          {players.map((p) => {
                            const on = h.visibleTo.includes(p.uid);
                            return (
                              <label key={p.uid} className="inv-equip small">
                                <input
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => save({ ...h, visibleTo: on ? h.visibleTo.filter((x) => x !== p.uid) : [...h.visibleTo, p.uid], ...(on ? {} : { revealedAt: Date.now() }) })}
                                />
                                <span>{p.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      {!h.everyone && players.length === 0 && <p className="small muted">Per mostrarlo a un solo giocatore serve che abbia un personaggio collegato alla campagna.</p>}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
