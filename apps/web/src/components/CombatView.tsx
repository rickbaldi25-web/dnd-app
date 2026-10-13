import type { CharacterData, MonsterDef } from "@dnd/engine";
import { useEffect, useState } from "react";
import { loadMonsters } from "../content";
import { repo, type MonsterSecret } from "../data";
import { initiativeOrder, InitiativePanel, useEncounter } from "./Initiative";
import { MonsterStatBlock } from "./MonsterStatBlock";
import { PartyCard, PartyStrip } from "./PartyCard";
import { RollLog } from "./RollLog";

/**
 * La campagna durante un combattimento: il gruppo in una riga, l'iniziativa,
 * e accanto la scheda di chi è di turno (il mostro per il Master, il personaggio per tutti).
 */
export function CombatView({ campaignId, party, isDm, uid, online, showRolls }: { campaignId: string; party: CharacterData[]; isDm: boolean; uid: string; online: string[]; showRolls: boolean }) {
  const encounter = useEncounter(campaignId);
  const [secrets, setSecrets] = useState<Record<string, MonsterSecret>>({});
  const [library, setLibrary] = useState<MonsterDef[] | null>(null);
  useEffect(() => (isDm ? repo.watchMonsterSecrets(campaignId, setSecrets) : undefined), [campaignId, isDm]);

  const order = encounter ? initiativeOrder(party, encounter.monsters) : [];
  const ready = order.filter((c) => c.initiative !== null);
  const at = ready.findIndex((c) => c.id === encounter?.currentId);
  const current = at >= 0 ? ready[at] : undefined;
  const next = at >= 0 && ready.length > 1 ? ready[(at + 1) % ready.length] : undefined;
  const monsterId = current?.kind === "monster" ? secrets[current.id]?.monsterId : undefined;
  // La raccolta dei mostri è grande: si scarica la prima volta che tocca a un mostro che ne fa parte.
  useEffect(() => {
    if (monsterId && !library) loadMonsters().then(setLibrary).catch(() => setLibrary([]));
  }, [monsterId, library]);
  const statBlock = monsterId ? library?.find((m) => m.id === monsterId) : undefined;

  return (
    <>
      <PartyStrip party={party} canEdit={isDm} uid={uid} online={online} currentId={encounter?.currentId} />
      <div className="combat-layout">
        <InitiativePanel campaignId={campaignId} party={party} isDm={isDm} uid={uid} />
        <div className="combat-side">
          <section className="panel spotlight" aria-live="polite">
            <h2>
              Di turno {next && <span className="muted small">poi {next.name}</span>}
            </h2>
            {!current && <p className="muted small">{isDm ? "Raccogli le iniziative e premi «Primo turno»." : "Il Master non ha ancora dato il primo turno."}</p>}
            {current?.character && (
              <ul className="party">
                <PartyCard ch={current.character} canEdit={isDm} mine={current.character.ownerUid === uid} online={online.includes(current.character.ownerUid ?? "")} />
              </ul>
            )}
            {current?.kind === "monster" && !isDm && <p className="spotlight-name">{current.name}</p>}
            {current?.kind === "monster" && isDm && (statBlock ? <MonsterStatBlock monster={statBlock} name={current.name} /> : <p className="muted small">{!monsterId ? `${current.name}: aggiunto a mano, senza scheda.` : library ? "Scheda non trovata nella raccolta." : "Carico la scheda…"}</p>)}
          </section>
          {showRolls && <RollLog campaignId={campaignId} isDm={isDm} />}
        </div>
      </div>
    </>
  );
}
