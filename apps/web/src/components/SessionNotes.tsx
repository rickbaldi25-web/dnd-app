import { useEffect, useState } from "react";
import { repo, type SessionNote } from "../data";
import { useLog } from "../state/log";
import { isNewRecap, markSeen, recapStamp, useSeen } from "../state/news";

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const showDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }) : iso;
};

const pe = (n: number) => n.toLocaleString("it-IT");
const sessionXp = (s: SessionNote) => (s.awards ?? []).reduce((sum, a) => sum + a.xp, 0);

/** PE assegnati nella sessione. Il Master può togliere una voce messa per errore. */
function Awards({ session, onRemove }: { session: SessionNote; onRemove?: (i: number) => void }) {
  if (!session.awards?.length) return null;
  return (
    <ul className="award-list">
      {session.awards.map((a, i) => (
        <li key={`${a.at}-${i}`}>
          <span>{a.label}</span>
          <strong>{pe(a.xp)} PE</strong>
          {onRemove && (
            <button className="icon-btn" aria-label={`Togli ${a.label}`} onClick={() => onRemove(i)}>
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Campi di una sessione per il Master. Si salva uscendo da un campo o con il tasto. */
function SessionEditor({ session, secret, onSave, onDelete }: { session: SessionNote; secret: string; onSave: (s: SessionNote, secret: string) => void; onDelete: () => void }) {
  const [title, setTitle] = useState(session.title);
  const [date, setDate] = useState(session.date);
  const [recap, setRecap] = useState(session.recap);
  const [notes, setNotes] = useState(secret);
  const dirty = title.trim() !== session.title || date !== session.date || recap !== session.recap || notes !== secret;
  // Gli appunti riservati arrivano dopo la sessione: si riempiono se nel frattempo non si è scritto nulla.
  useEffect(() => setNotes((mine) => (mine === "" ? secret : mine)), [secret]);
  const save = () => {
    if (dirty && title.trim() && date) onSave({ ...session, title: title.trim(), date, recap }, notes);
  };
  return (
    <div className="session-editor" onBlur={save}>
      <div className="row">
        <input value={title} aria-label="Titolo della sessione" onChange={(e) => setTitle(e.currentTarget.value)} />
        <input type="date" value={date} aria-label="Data della sessione" onChange={(e) => setDate(e.currentTarget.value)} />
      </div>
      <label className="small">
        Riassunto per i giocatori
        <textarea value={recap} rows={5} placeholder="Cosa è successo: lo leggono tutti." onChange={(e) => setRecap(e.currentTarget.value)} />
      </label>
      <label className="small">
        Appunti del Master <span className="muted">(li vedi solo tu)</span>
        <textarea value={notes} rows={5} placeholder="Trame aperte, PNG, cose da ricordare per la prossima volta." onChange={(e) => setNotes(e.currentTarget.value)} />
      </label>
      <div className="row">
        <button className="btn btn-primary" disabled={!dirty || !title.trim() || !date} onClick={save}>
          {dirty ? "Salva" : "Salvato"}
        </button>
        <button className="btn btn-danger-quiet" onClick={onDelete}>
          Elimina sessione
        </button>
      </div>
    </div>
  );
}

/** Diario della campagna: una voce per sessione, con riassunto pubblico e appunti riservati al Master. */
export function SessionNotes({ campaignId, isDm }: { campaignId: string; isDm: boolean }) {
  const { push } = useLog();
  const [sessions, setSessions] = useState<SessionNote[]>([]);
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const seen = useSeen("sessions", campaignId);
  useEffect(() => repo.watchSessions(campaignId, setSessions), [campaignId]);
  useEffect(() => (isDm ? repo.watchSessionSecrets(campaignId, setSecrets) : undefined), [campaignId, isDm]);

  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  // Ai giocatori si mostrano solo le sessioni che hanno già un riassunto.
  const shown = isDm ? sorted : sorted.filter((s) => s.recap.trim() || s.awards?.length);
  const totalXp = sessions.reduce((sum, s) => sum + sessionXp(s), 0);

  const create = () => {
    const id = `s-${Date.now().toString(36)}`;
    repo.saveSession(campaignId, { id, title: `Sessione ${sessions.length + 1}`, date: today(), recap: "", createdAt: Date.now() }).catch(failed);
    setOpenId(id);
  };
  const save = (s: SessionNote, secret: string) => {
    repo.saveSession(campaignId, s).catch(failed);
    if (secret !== (secrets[s.id] ?? "")) {
      const next = { ...secrets, [s.id]: secret };
      setSecrets(next);
      repo.saveSessionSecrets(campaignId, next).catch(failed);
    }
  };
  const remove = (s: SessionNote) => {
    if (!window.confirm(`Eliminare ${s.title}? Si perdono riassunto e appunti.`)) return;
    repo.deleteSession(campaignId, s.id).catch(failed);
    if (s.id in secrets) {
      const { [s.id]: _gone, ...rest } = secrets;
      repo.saveSessionSecrets(campaignId, rest).catch(failed);
    }
  };

  return (
    <section className="panel session-notes">
      <div className="row between">
        <h2>Note di sessione</h2>
        {isDm && (
          <button className="btn" onClick={create}>
            Nuova sessione
          </button>
        )}
      </div>
      {shown.length === 0 && <p className="muted small">{isDm ? "Una voce per serata: il riassunto per il gruppo e i tuoi appunti riservati." : "Qui compaiono i riassunti delle sessioni scritti dal Master."}</p>}
      {totalXp > 0 && (
        <p className="small">
          PE assegnati al gruppo finora: <strong>{pe(totalXp)}</strong>
        </p>
      )}
      <ul className="handout-list">
        {shown.map((s) => {
          const open = openId === s.id;
          return (
            <li key={s.id} className={open ? "is-open" : ""}>
              <div className="row between">
                <button className="disclosure" aria-expanded={open} onClick={() => {
                    setOpenId(open ? null : s.id);
                    if (!isDm) markSeen("sessions", campaignId, s.id, recapStamp(s));
                  }}
                >
                  {s.title}
                  {!isDm && isNewRecap(s, seen) && <span className="tag handout-new"> nuovo</span>}
                </button>
                <span className="muted small">
                  {showDate(s.date)}
                  {sessionXp(s) > 0 ? ` · ${pe(sessionXp(s))} PE` : ""}
                  {isDm && !s.recap.trim() ? " · senza riassunto" : ""}
                </span>
              </div>
              {open && (isDm ? <SessionEditor session={s} secret={secrets[s.id] ?? ""} onSave={save} onDelete={() => remove(s)} /> : s.recap.trim() && <p className="handout-text session-recap">{s.recap}</p>)}
              {open && <Awards session={s} onRemove={isDm ? (i) => repo.saveSession(campaignId, { ...s, awards: (s.awards ?? []).filter((_, j) => j !== i) }).catch(failed) : undefined} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
