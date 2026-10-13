import { applyDamage, applyHealing, applyProposal, computeSheet, longRest, shortRest, type AutomationLevel, type CharacterData, type ComputedSheet } from "@dnd/engine";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { InitiativePanel } from "../components/Initiative";
import { CONDITIONS, registry } from "../content";
import { repo, type Campaign as CampaignData } from "../data";
import { useAuth } from "../firebase/auth";
import { useLog } from "../state/log";
import { usePresence } from "../state/presence";

const AUTOMATION_LABEL: Record<AutomationLevel, string> = { manual: "Manuale", assisted: "Assistita", full: "Completa" };

function sheetOf(ch: CharacterData): ComputedSheet | null {
  try {
    return computeSheet(ch, registry);
  } catch {
    return null;
  }
}

/** Un personaggio del gruppo: ciò che serve al tavolo, più i comandi rapidi del Master. */
export function PartyCard({ ch, canEdit, mine, online, current = false }: { ch: CharacterData; canEdit: boolean; mine: boolean; online: boolean; current?: boolean }) {
  const { push } = useLog();
  const [amount, setAmount] = useState("");
  const sheet = useMemo(() => sheetOf(ch), [ch]);
  if (!sheet) {
    return (
      <li className="panel party-card">
        <h2>{ch.name}</h2>
        <p className="muted small">Dati che il motore non riconosce.</p>
      </li>
    );
  }
  const s = ch.state;
  const max = sheet.hpMax.value;
  const classes = Object.entries(sheet.classLevels)
    .map(([id, n]) => `${registry.classes.get(id)?.name ?? id} ${n}`)
    .join(" / ");
  const sc = sheet.spellcasting;
  const slots = [...(sc?.slots ?? []).map((p) => `${p.level}° ${p.remaining}/${p.max}`), ...(sc?.pact ? [`Patto ${sc.pact.level}° ${sc.pact.remaining}/${sc.pact.max}`] : [])];
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const setConditions = (conditions: string[]) => repo.updateCharacter(ch, { ...ch, state: { ...s, conditions } }).catch(failed);
  const act = (kind: "damage" | "heal") => {
    const p = kind === "damage" ? applyDamage(ch, sheet, n) : applyHealing(ch, sheet, n);
    repo.updateCharacter(ch, applyProposal(ch, p)).catch((e) => push({ title: "Salvataggio non riuscito", lines: [String(e?.message ?? e)], tone: "bad" }));
    push({ title: `${ch.name}: ${kind === "damage" ? "danno" : "cura"} ${n}`, lines: p.lines, rolls: [], tone: kind === "damage" ? "bad" : "good" });
    setAmount("");
  };
  return (
    <li className={`panel party-card ${s.hpCurrent === 0 ? "is-down" : ""} ${current ? "is-open" : ""}`}>
      <header className="panel-head">
        <h2>
          <span className={`presence-dot ${online ? "is-online" : ""}`} role="img" aria-label={online ? "Connesso" : "Non connesso"} title={online ? "Connesso" : "Non connesso"} />
          {ch.name}
        </h2>
        <span className="muted small">{classes}</span>
      </header>
      <div className="party-hp">
        <span className="party-hp-number">
          {s.hpCurrent}
          <span className="muted"> / {max}</span>
          {s.hpTemp > 0 && <span className="party-temp"> +{s.hpTemp}</span>}
        </span>
        <span className="party-bar" role="img" aria-label={`Punti ferita ${s.hpCurrent} su ${max}`}>
          <span style={{ width: `${max ? Math.min(100, (s.hpCurrent / max) * 100) : 0}%` }} />
        </span>
      </div>
      <p className="party-stats">
        <span>CA {sheet.ac.value}</span>
        <span>Percezione passiva {sheet.passivePerception}</span>
        <span>Iniziativa {sheet.initiative.value >= 0 ? "+" : ""}{sheet.initiative.value}</span>
      </p>
      {(s.conditions.length > 0 || s.exhaustion > 0 || sc?.concentration) && (
        <p className="party-tags">
          {s.conditions.map((c) =>
            canEdit ? (
              <button key={c} className="tag tag-bad tag-btn" aria-label={`Togli ${CONDITIONS[c] ?? c}`} onClick={() => setConditions(s.conditions.filter((x) => x !== c))}>
                {CONDITIONS[c] ?? c} ×
              </button>
            ) : (
              <span key={c} className="tag tag-bad">
                {CONDITIONS[c] ?? c}
              </span>
            ),
          )}
          {s.exhaustion > 0 && <span className="tag tag-bad">Indebolimento {s.exhaustion}</span>}
          {sc?.concentration && <span className="tag">Concentrazione: {sc.concentration.name}</span>}
        </p>
      )}
      {slots.length > 0 && <p className="small">Slot: {slots.join(" · ")}</p>}
      {sheet.resources.length > 0 && <p className="small muted">{sheet.resources.map((r) => `${r.name} ${r.remaining}/${r.max}`).join(" · ")}</p>}
      {canEdit && (
        <div className="row">
          <input type="number" min={0} value={amount} placeholder="PF" aria-label={`Punti ferita per ${ch.name}`} className="party-amount" onChange={(e) => setAmount(e.currentTarget.value)} />
          <button className="btn btn-danger" disabled={!n} onClick={() => act("damage")}>
            Danno
          </button>
          <button className="btn btn-heal" disabled={!n} onClick={() => act("heal")}>
            Cura
          </button>
          <select value="" aria-label={`Aggiungi una condizione a ${ch.name}`} onChange={(e) => e.currentTarget.value && setConditions([...s.conditions, e.currentTarget.value])}>
            <option value="">Condizione…</option>
            {Object.entries(CONDITIONS)
              .filter(([id]) => !s.conditions.includes(id))
              .map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
          </select>
        </div>
      )}
      {(canEdit || mine) && !current && (
        <Link className="link-btn" to={`/c/${ch.id}`}>
          Apri la scheda
        </Link>
      )}
    </li>
  );
}

export function Campaign() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const { push } = useLog();
  const [campaign, setCampaign] = useState<CampaignData | null | undefined>(undefined);
  const [party, setParty] = useState<CharacterData[]>([]);
  const [own, setOwn] = useState<CharacterData[]>([]);
  const [copied, setCopied] = useState(false);

  const online = usePresence(id);
  useEffect(() => repo.watchCampaign(id, setCampaign), [id]);
  useEffect(() => repo.watchCampaignCharacters(id, setParty), [id]);
  useEffect(() => (user ? repo.watchCharacters(user.uid, setOwn) : undefined), [user]);

  if (!user || campaign === undefined) return <main className="page"><p className="muted">Caricamento…</p></main>;
  if (campaign === null) {
    return (
      <main className="page narrow">
        <p>Questa campagna non esiste o è stata eliminata.</p>
        <Link to="/campaigns">Torna alle campagne</Link>
      </main>
    );
  }

  const isDm = campaign.dmUid === user.uid;
  const save = (prev: CharacterData, next: CharacterData) =>
    repo.updateCharacter(prev, next).catch((e) => push({ title: "Salvataggio non riuscito", lines: [String(e?.message ?? e)], tone: "bad" }));
  const link = (ch: CharacterData, on: boolean) => save(ch, { ...ch, campaignId: on ? campaign.id : undefined });
  const restAll = (kind: "short" | "long") => {
    for (const ch of party) {
      try {
        save(ch, applyProposal(ch, kind === "long" ? longRest(ch, registry) : shortRest(ch, registry)));
      } catch (e) {
        push({ title: `${ch.name}: riposo non applicato`, lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
      }
    }
    push({ title: kind === "long" ? "Riposo lungo per il gruppo" : "Riposo breve per il gruppo", lines: [`${party.length} personaggi`], rolls: [], tone: "good" });
  };
  const leave = async () => {
    if (!window.confirm(`Uscire da ${campaign.name}? I tuoi personaggi vengono scollegati.`)) return;
    for (const ch of own.filter((c) => c.campaignId === campaign.id)) await save(ch, { ...ch, campaignId: undefined });
    await repo.leaveCampaign(campaign.id, user.uid).catch((e) => push({ title: "Uscita non riuscita", lines: [String(e?.message ?? e)], tone: "bad" }));
    nav("/campaigns");
  };
  const others = online.filter((p) => p.uid !== user.uid).map((p) => p.name);
  const copy = async () => {
    await navigator.clipboard?.writeText(campaign.id).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="page">
      <header className="sheet-head">
        <Link to="/campaigns" className="back" aria-label="Torna alle campagne">
          ‹
        </Link>
        <div className="sheet-title">
          <h1>{campaign.name}</h1>
          <p className="muted">
            {isDm ? "Sei il Master" : `Master: ${campaign.dmName}`} · {campaign.memberUids.length} giocatori
          </p>
          <p className="small">
            <span className="presence-dot is-online" role="img" aria-label="Connessi" /> {others.length ? `Connessi ora: ${others.join(", ")}` : "Nessun altro connesso"}
          </p>
        </div>
        <div className="sheet-tools">
          {own
            .filter((ch) => ch.campaignId === campaign.id)
            .map((ch) => (
              <Link key={ch.id} className="btn btn-primary" to={`/c/${ch.id}`}>
                Scheda di {ch.name}
              </Link>
            ))}
          <span className="campaign-code" title="Codice da dare ai giocatori">
            {campaign.id}
          </span>
          <button className="btn" onClick={copy}>
            {copied ? "Copiato" : "Copia codice"}
          </button>
        </div>
      </header>

      {!isDm && campaign.automationLock && <p className="muted small">Il Master ha fissato l'automazione delle schede su: {AUTOMATION_LABEL[campaign.automationLock]}.</p>}
      {isDm && (
        <div className="row campaign-tools">
          <label className="small">
            Automazione delle schede{" "}
            <select
              value={campaign.automationLock ?? ""}
              onChange={(e) => repo.setAutomationLock(campaign.id, (e.currentTarget.value || null) as AutomationLevel | null).catch((err) => push({ title: "Salvataggio non riuscito", lines: [String(err?.message ?? err)], tone: "bad" }))}
            >
              <option value="">Ognuno sceglie la sua</option>
              <option value="manual">Manuale per tutti</option>
              <option value="assisted">Assistita per tutti</option>
              <option value="full">Completa per tutti</option>
            </select>
          </label>
        </div>
      )}
      {isDm && party.length > 0 && (
        <div className="row campaign-tools">
          <button className="btn" onClick={() => restAll("short")}>
            Riposo breve per tutti
          </button>
          <button className="btn" onClick={() => restAll("long")}>
            Riposo lungo per tutti
          </button>
        </div>
      )}

      {party.length === 0 && (
        <section className="panel empty">
          <p>
            Nessun personaggio collegato.{" "}
            {isDm ? "Dai il codice ai giocatori: entrano dalla pagina Campagne e collegano un personaggio." : "Collega uno dei tuoi personaggi qui sotto."}
          </p>
        </section>
      )}
      <InitiativePanel campaignId={campaign.id} party={party} isDm={isDm} uid={user.uid} />

      <ul className="party">
        {party.map((ch) => (
          <PartyCard key={ch.id} ch={ch} canEdit={isDm} mine={ch.ownerUid === user.uid} online={online.some((p) => p.uid === ch.ownerUid)} />
        ))}
      </ul>

      <section className="panel">
        <h2>I tuoi personaggi</h2>
        {own.length === 0 && (
          <p className="muted">
            Non hai personaggi. <Link to="/new">Creane uno</Link> e poi collegalo qui.
          </p>
        )}
        <ul className="inv-list">
          {own.map((ch) => {
            const here = ch.campaignId === campaign.id;
            const elsewhere = !!ch.campaignId && !here;
            return (
              <li key={ch.id}>
                <label className="inv-equip">
                  <input type="checkbox" checked={here} onChange={(e) => link(ch, e.currentTarget.checked)} />
                  <span>{ch.name}</span>
                </label>
                {elsewhere && <span className="muted small">ora in un'altra campagna: spuntandolo lo sposti qui</span>}
              </li>
            );
          })}
        </ul>
        <p className="muted small">Spunta un personaggio per portarlo in questa campagna: il Master e gli altri giocatori lo vedranno.</p>
      </section>

      {!isDm && campaign.memberUids.includes(user.uid) && (
        <button className="btn btn-danger-quiet" onClick={leave}>
          Esci dalla campagna
        </button>
      )}
      {isDm && (
        <button
          className="btn btn-danger-quiet"
          onClick={async () => {
            if (!window.confirm(`Eliminare la campagna ${campaign.name}? I personaggi restano ai giocatori.`)) return;
            await repo.deleteCampaign(campaign.id);
            nav("/campaigns");
          }}
        >
          Elimina campagna
        </button>
      )}
    </main>
  );
}
