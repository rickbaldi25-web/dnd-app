import { computeSheet, type AutomationLevel, type CharacterData } from "@dnd/engine";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AutomationSwitch } from "../components/AutomationSwitch";
import { registry } from "../content";
import { repo } from "../data";
import { useAuth } from "../firebase/auth";
import { useUserAutomation } from "../state/useCharacter";

function summary(ch: CharacterData): string {
  try {
    const s = computeSheet(ch, registry, { automation: "manual" });
    const classes = Object.entries(s.classLevels)
      .map(([id, n]) => `${registry.classes.get(id)?.name ?? id} ${n}`)
      .join(" / ");
    return `${registry.species.get(ch.speciesId)?.name ?? ""}, ${classes}`;
  } catch {
    return "Dati incompleti";
  }
}

export function Characters() {
  const { user } = useAuth();
  const [list, setList] = useState<CharacterData[] | null>(null);
  const [pref, setPref] = useUserAutomation();

  useEffect(() => (user ? repo.watchCharacters(user.uid, setList) : undefined), [user]);

  return (
    <main className="page narrow">
      <div className="row between">
        <h1 className="page-title">I tuoi personaggi</h1>
        <Link className="btn btn-primary" to="/new">
          Nuovo personaggio
        </Link>
      </div>

      {list === null && <p className="muted">Caricamento…</p>}
      {list?.length === 0 && (
        <section className="panel empty">
          <p>Non hai ancora personaggi. Creane uno: le scelte di classe si completano direttamente nella scheda.</p>
        </section>
      )}
      <ul className="char-list">
        {list?.map((ch) => (
          <li key={ch.id}>
            <Link to={`/c/${ch.id}`} className="char-card">
              <span className="char-name">{ch.name}</span>
              <span className="muted">{summary(ch)}</span>
              <span className="char-hp">
                {ch.state.hpCurrent} PF
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="panel">
        <h2>Preferenza predefinita</h2>
        <p className="muted small">Vale per tutti i personaggi che non hanno un'impostazione propria.</p>
        <AutomationSwitch value={pref} inherited={"assisted" as AutomationLevel} onChange={(v) => v && setPref(v)} allowInherit={false} />
      </section>
    </main>
  );
}
