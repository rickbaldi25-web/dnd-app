import { applyProposal, longRest, shortRest, type AutomationLevel, type CharacterData } from "@dnd/engine";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { EncounterBuilder, QuickEncounters } from "../components/EncounterBuilder";
import { HandoutsPanel } from "../components/Handouts";
import { HomebrewPanel } from "../components/Homebrew";
import { AdventurePanel } from "../components/Adventure";
import { Badge, CampaignDrawer } from "../components/CampaignSide";
import { CombatView } from "../components/CombatView";
import { useEncounter } from "../components/Initiative";
import { LootPanel } from "../components/Loot";
import { PartyCard, PartyGlance } from "../components/PartyCard";
import { RollLog } from "../components/RollLog";
import { SessionNotes } from "../components/SessionNotes";
import { registry } from "../content";
import { repo, type Campaign as CampaignData } from "../data";
import { useAuth } from "../firebase/auth";
import { useLog, useShareRolls } from "../state/log";
import { useHomebrew } from "../state/homebrew";
import { useCampaignNews } from "../state/news";
import { usePresence } from "../state/presence";

const AUTOMATION_LABEL: Record<AutomationLevel, string> = { manual: "Manuale", assisted: "Assistita", full: "Completa" };

export function Campaign() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const { push } = useLog();
  const [campaign, setCampaign] = useState<CampaignData | null | undefined>(undefined);
  const [party, setParty] = useState<CharacterData[]>([]);
  const [own, setOwn] = useState<CharacterData[]>([]);
  const [copied, setCopied] = useState(false);
  const [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const online = usePresence(id);
  const fighting = !!useEncounter(id)?.active;
  // A combattimento finito chi era rimasto su "Al tavolo" torna alla vista del momento, così al prossimo segue di nuovo il combattimento.
  const wasFighting = useRef(fighting);
  useEffect(() => {
    if (wasFighting.current && !fighting && params.get("scheda") === "tavolo") setParams({}, { replace: true });
    wasFighting.current = fighting;
  }, [fighting, params, setParams]);
  const { homebrew } = useHomebrew(id);
  const amDm = !!campaign && !!user && campaign.dmUid === user.uid;
  const news = useCampaignNews(campaign?.id, user?.uid, amDm);
  useShareRolls(campaign && user ? { campaignId: campaign.id, uid: user.uid, author: amDm ? "Master" : user.name, canHide: amDm } : null);
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
  // La scheda aperta sta nell'indirizzo: resta al ricaricamento e il tasto indietro torna alla precedente.
  const tabs = [
    ...(fighting ? [{ id: "combattimento", label: "Combattimento" }] : []),
    { id: "tavolo", label: "Esplorazione" },
    ...(isDm ? [{ id: "incontri", label: "Incontri", prep: true }, { id: "avventura", label: "Avventura" }] : []),
    { id: "diario", label: "Diario", prep: !isDm },
    { id: "contenuti", label: "Contenuti" },
    { id: "gestione", label: "Gestione" },
  ];
  // Senza una scelta nell'indirizzo vale la vista del momento: il combattimento se ce n'è uno, altrimenti il tavolo.
  const home = fighting ? "combattimento" : "tavolo";
  const tab = tabs.find((t) => t.id === params.get("scheda"))?.id ?? home;
  const go = (id: string) => setParams(id === home ? {} : { scheda: id });
  const onlineUids = online.map((p) => p.uid);
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
    <main className={`page campaign ${drawer ? "has-side" : ""}`}>
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
          <span className="campaign-invite" title="Codice da dare ai giocatori">
            <span className="muted small">Codice</span>
            <span className="campaign-code">{campaign.id}</span>
            <button className="btn" onClick={copy}>
              {copied ? "Copiato" : "Copia"}
            </button>
          </span>
        </div>
      </header>

      <nav className="tabs" role="tablist" aria-label="Sezioni della campagna">
        {tabs.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`pannello-${t.id}`} className={`${tab === t.id ? "is-on" : ""} ${t.id === "combattimento" ? "is-combat" : ""} ${"prep" in t && t.prep ? "starts-group" : ""}`} onClick={() => go(t.id)}>
            {t.label}
            <Badge n={t.id === "tavolo" ? news.handouts : t.id === "diario" ? news.diary : 0} />
          </button>
        ))}
      </nav>

      {/* Le sezioni restano tutte montate: cambiando scheda non si perde ciò che si stava scrivendo né gli avvisi. */}
      {fighting && (
        <div role="tabpanel" id="pannello-combattimento" aria-labelledby="tab-combattimento" className="tab-panel" hidden={tab !== "combattimento"}>
          <CombatView campaignId={campaign.id} party={party} isDm={isDm} uid={user.uid} online={onlineUids} showRolls={tab === "combattimento"} />
        </div>
      )}

      <div role="tabpanel" id="pannello-tavolo" aria-labelledby="tab-tavolo" className="tab-panel" hidden={tab !== "tavolo"}>
        {!isDm && campaign.automationLock && <p className="muted small">Il Master ha fissato l'automazione delle schede su: {AUTOMATION_LABEL[campaign.automationLock]}.</p>}
        {party.length === 0 && (
          <section className="panel empty">
            <p>
              Nessun personaggio collegato.{" "}
              {isDm ? "Dai il codice ai giocatori: entrano dalla pagina Campagne e collegano un personaggio." : "Collega uno dei tuoi personaggi dalla scheda Gestione."}
            </p>
          </section>
        )}
        {/* A sinistra ciò che si gioca (iniziativa, gruppo), a destra ciò che si consulta */}
        <div className="campaign-layout">
          <div className="campaign-main">
            {fighting ? (
              <section className="panel turn-banner">
                <p>
                  <strong>Combattimento in corso</strong>
                </p>
                <button className="btn btn-primary" onClick={() => go("combattimento")}>
                  Vai al combattimento
                </button>
              </section>
            ) : null}
            {isDm && <PartyGlance party={party} />}

            {party.length > 0 && (
              <div className="row between section-row">
                <h2 className="section-title">
                  Gruppo <span className="muted small">{party.length} personaggi</span>
                </h2>
                {isDm && (
                  <span className="campaign-rests">
                    <button className="btn" onClick={() => restAll("short")}>
                      Riposo breve per tutti
                    </button>
                    <button className="btn" onClick={() => restAll("long")}>
                      Riposo lungo per tutti
                    </button>
                  </span>
                )}
              </div>
            )}
            <ul className="party">
              {party.map((ch) => (
                <PartyCard key={ch.id} ch={ch} canEdit={isDm} mine={ch.ownerUid === user.uid} online={online.some((p) => p.uid === ch.ownerUid)} />
              ))}
            </ul>
          </div>

          <aside className="campaign-aside">
            {isDm && !fighting && <QuickEncounters campaignId={campaign.id} party={party} onPrepare={() => go("incontri")} />}
            {isDm && !fighting && <LootPanel campaignId={campaign.id} party={party} />}

            {tab !== "combattimento" && <RollLog campaignId={campaign.id} isDm={isDm} />}

            <HandoutsPanel campaignId={campaign.id} isDm={isDm} uid={user.uid} party={party} />
          </aside>
        </div>
      </div>

      {isDm && (
        <div role="tabpanel" id="pannello-incontri" aria-labelledby="tab-incontri" className="tab-panel" hidden={tab !== "incontri"}>
          <EncounterBuilder campaignId={campaign.id} party={party} onLaunch={() => setParams({})} />
        </div>
      )}

      {isDm && (
        <div role="tabpanel" id="pannello-avventura" aria-labelledby="tab-avventura" className="tab-panel" hidden={tab !== "avventura"}>
          <AdventurePanel campaignId={campaign.id} party={party} onLaunched={() => setParams({})} />
        </div>
      )}

      <div role="tabpanel" id="pannello-diario" aria-labelledby="tab-diario" className="tab-panel" hidden={tab !== "diario"}>
        <SessionNotes campaignId={campaign.id} isDm={isDm} />
      </div>

      <div role="tabpanel" id="pannello-contenuti" aria-labelledby="tab-contenuti" className="tab-panel" hidden={tab !== "contenuti"}>
        <HomebrewPanel campaignId={campaign.id} homebrew={homebrew} isDm={isDm} />
      </div>

      <div role="tabpanel" id="pannello-gestione" aria-labelledby="tab-gestione" className="tab-panel" hidden={tab !== "gestione"}>
        {isDm && (
          <section className="panel campaign-toolbar" aria-label="Comandi del Master">
            <label className="small">
              <span className="muted">Automazione delle schede</span>
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
          </section>
        )}

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
      </div>
      <CampaignDrawer campaignId={campaign.id} uid={user.uid} sections={["handout", "diario", "gruppo"]} news={news} open={drawer} onToggle={setDrawer} />
    </main>
  );
}
