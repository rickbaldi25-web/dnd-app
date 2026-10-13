import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { repo, type Campaign } from "../data";
import { useAuth } from "../firebase/auth";

/** Elenco delle campagne dell'utente, con i due modi per averne una: crearla o entrare con un codice. */
export function Campaigns() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [list, setList] = useState<Campaign[] | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => (user ? repo.watchCampaigns(user.uid, setList) : undefined), [user]);
  if (!user) return null;

  const create = async () => {
    setError("");
    try {
      const c = await repo.createCampaign(name.trim(), { uid: user.uid, name: user.name });
      nav(`/campaigns/${c.id}`);
    } catch (e) {
      setError(`Creazione non riuscita: ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  const join = async () => {
    setError("");
    try {
      const c = await repo.joinCampaign(code.trim().toUpperCase(), user.uid);
      nav(`/campaigns/${c.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <main className="page narrow">
      <h1 className="page-title">Campagne</h1>

      {list === null && <p className="muted">Caricamento…</p>}
      {list?.length === 0 && (
        <section className="panel empty">
          <p>Non fai ancora parte di nessuna campagna. Creane una se sei il Master, oppure entra con il codice che ti ha dato il Master.</p>
        </section>
      )}
      <ul className="char-list">
        {list?.map((c) => (
          <li key={c.id}>
            <Link to={`/campaigns/${c.id}`} className="char-card">
              <span className="char-name">{c.name}</span>
              <span className="muted">{c.dmUid === user.uid ? "Sei il Master" : `Master: ${c.dmName}`}</span>
              <span className="char-hp">{c.memberUids.length} giocatori</span>
            </Link>
          </li>
        ))}
      </ul>

      {error && <p className="problems is-error">{error}</p>}

      <section className="panel">
        <h2>Entra in una campagna</h2>
        <p className="muted small">Scrivi il codice di 8 caratteri che ti ha dato il Master.</p>
        <div className="row">
          <input value={code} maxLength={8} placeholder="Codice" aria-label="Codice della campagna" className="code-input" onChange={(e) => setCode(e.currentTarget.value.toUpperCase())} />
          <button className="btn btn-primary" disabled={code.trim().length !== 8} onClick={join}>
            Entra
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Crea una campagna</h2>
        <p className="muted small">Chi la crea ne è il Master: vede e modifica i personaggi collegati.</p>
        <div className="row">
          <input value={name} placeholder="Nome della campagna" aria-label="Nome della campagna" onChange={(e) => setName(e.currentTarget.value)} />
          <button className="btn" disabled={!name.trim()} onClick={create}>
            Crea
          </button>
        </div>
      </section>
    </main>
  );
}
