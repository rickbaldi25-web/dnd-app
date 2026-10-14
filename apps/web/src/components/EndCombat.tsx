import { crXp, type CharacterData } from "@dnd/engine";
import { useEffect, useState } from "react";
import { repo, type EncounterMonster, type MonsterSecret, type SessionNote } from "../data";
import { today } from "./SessionNotes";

const pe = (n: number) => n.toLocaleString("it-IT");

/**
 * Chiusura del combattimento: il Master spunta i mostri sconfitti e i loro PE finiscono nel Diario,
 * nella sessione che sceglie. Si può anche chiudere senza assegnare nulla.
 */
export function EndCombat({
  campaignId,
  monsters,
  secrets,
  party,
  onDone,
  onCancel,
  onError,
}: {
  campaignId: string;
  monsters: EncounterMonster[];
  secrets: Record<string, MonsterSecret>;
  party: CharacterData[];
  onDone: () => void;
  onCancel: () => void;
  onError: (e: unknown) => void;
}) {
  const [sessions, setSessions] = useState<SessionNote[] | null>(null);
  // Di partenza contano come sconfitti quelli arrivati a zero punti ferita.
  const [beaten, setBeaten] = useState<string[]>(() => monsters.filter((m) => secrets[m.id]?.hp === 0).map((m) => m.id));
  const [manual, setManual] = useState("");
  const [label, setLabel] = useState("Combattimento");
  const [target, setTarget] = useState<string | null>(null);
  const [milestone, setMilestone] = useState(false);
  const [toSheets, setToSheets] = useState(true);
  useEffect(() => repo.watchSessions(campaignId, setSessions), [campaignId]);
  useEffect(() => repo.watchCampaign(campaignId, (c) => setMilestone(c?.progression === "milestone")), [campaignId]);
  const partySize = party.length;

  const sorted = [...(sessions ?? [])].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  // La sessione di oggi se c'è già, altrimenti una nuova.
  const sessionId = target ?? sorted.find((s) => s.date === today())?.id ?? "new";
  const auto = monsters.filter((m) => beaten.includes(m.id)).reduce((sum, m) => sum + crXp(secrets[m.id]?.cr), 0);
  const total = manual.trim() === "" ? auto : Math.max(0, Math.floor(Number(manual) || 0));
  const unrated = monsters.filter((m) => beaten.includes(m.id) && !secrets[m.id]?.cr).length;

  const award = async () => {
    const entry = { label: label.trim() || "Combattimento", xp: total, at: Date.now() };
    const session = sorted.find((s) => s.id === sessionId);
    const next: SessionNote = session
      ? { ...session, awards: [...(session.awards ?? []), entry] }
      : { id: `s-${Date.now().toString(36)}`, title: `Sessione ${sorted.length + 1}`, date: today(), recap: "", createdAt: Date.now(), awards: [entry] };
    try {
      await repo.saveSession(campaignId, next);
      // La quota di ognuno si somma ai PE della sua scheda.
      const share = partySize ? Math.floor(total / partySize) : 0;
      if (!milestone && toSheets && share) for (const ch of party) await repo.updateCharacter(ch, { ...ch, xp: (ch.xp ?? 0) + share });
      onDone();
    } catch (e) {
      onError(e);
    }
  };

  return (
    <div className="end-combat">
      <h3>Fine del combattimento</h3>
      {monsters.length > 0 ? (
        <ul className="end-list">
          {monsters.map((m) => {
            const cr = secrets[m.id]?.cr;
            const on = beaten.includes(m.id);
            return (
              <li key={m.id}>
                <label className="inv-equip">
                  <input type="checkbox" checked={on} onChange={() => setBeaten(on ? beaten.filter((x) => x !== m.id) : [...beaten, m.id])} />
                  <span>{m.name}</span>
                </label>
                <span className="muted small">{cr ? `GS ${cr} · ${pe(crXp(cr))} PE` : "senza GS"}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="muted small">Nessun mostro in questo combattimento.</p>
      )}
      {unrated > 0 && <p className="muted small">{unrated === 1 ? "Un mostro spuntato è" : `${unrated} mostri spuntati sono`} senza grado di sfida: aggiungi i suoi PE a mano nel totale.</p>}
      <div className="row">
        <label className="small">
          PE al gruppo{" "}
          <input type="number" min={0} value={manual} placeholder={String(auto)} aria-label="PE da assegnare al gruppo" className="short-input xp-input" onChange={(e) => setManual(e.currentTarget.value)} />
        </label>
        {partySize > 0 && total > 0 && <span className="muted small">{pe(Math.floor(total / partySize))} a testa</span>}
      </div>
      <div className="row">
        <label className="small">
          Voce nel Diario <input value={label} aria-label="Nome della voce nel Diario" onChange={(e) => setLabel(e.currentTarget.value)} />
        </label>
        <label className="small">
          Sessione{" "}
          <select value={sessionId} aria-label="Sessione del Diario" onChange={(e) => setTarget(e.currentTarget.value)}>
            <option value="new">Nuova sessione di oggi</option>
            {sorted.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!milestone && partySize > 0 && (
        <label className="inv-equip small">
          <input type="checkbox" checked={toSheets} onChange={(e) => setToSheets(e.currentTarget.checked)} />
          <span>Aggiungi la quota anche alle schede dei personaggi</span>
        </label>
      )}
      <div className="row">
        <button className="btn btn-primary" disabled={!total || sessions === null} onClick={award}>
          Assegna {pe(total)} PE e termina
        </button>
        <button className="btn" onClick={onDone}>
          Termina senza PE
        </button>
        <button className="btn btn-quiet" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </div>
  );
}
