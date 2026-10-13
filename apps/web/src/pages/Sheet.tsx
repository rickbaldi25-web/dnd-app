import type { WidgetRef } from "@dnd/engine";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AutomationSwitch } from "../components/AutomationSwitch";
import { CampaignSide, useCampaignSide } from "../components/CampaignSide";
import { ChoicesPanel } from "../components/ChoicesPanel";
import { TurnBanner } from "../components/Initiative";
import { LevelUpDialog } from "../components/LevelUpDialog";
import { ProposalDialog } from "../components/ProposalDialog";
import { registry } from "../content";
import { repo } from "../data";
import { useAuth } from "../firebase/auth";
import { useShareRolls } from "../state/log";
import { useCharacter, useUserAutomation, type CharacterController } from "../state/useCharacter";
import { EditModeContext } from "../widgets/core";
import { EXTRA_WIDGETS, WIDGETS, type Zone } from "../widgets/registry";

const ZONES: { zone: Zone; label: string }[] = [
  { zone: "vitals", label: "In gioco" },
  { zone: "play", label: "Turno" },
  { zone: "sheet", label: "Scheda" },
];

function Zones({ c }: { c: CharacterController }) {
  const refs: WidgetRef[] = [...c.sheet.widgets, ...EXTRA_WIDGETS];
  return (
    <>
      {ZONES.map(({ zone, label }) => {
        const items = refs.filter((w) => WIDGETS[w.widget]?.zone === zone);
        return (
          <section key={zone} id={`zona-${zone}`} className={`zone zone-${zone}`} aria-label={label}>
            {items.map((w, i) => {
              const def = WIDGETS[w.widget]!;
              const Cmp = def.component;
              return (
                <div key={`${w.widget}-${w.ref ?? i}`} className={`cell span-${def.span ?? 1}`}>
                  <Cmp c={c} w={w} />
                </div>
              );
            })}
          </section>
        );
      })}
    </>
  );
}

/** Su telefono: barra fissa in basso per saltare alle tre zone; evidenzia quella sullo schermo. */
function ZoneTabs() {
  const [active, setActive] = useState<Zone>("vitals");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id.replace("zona-", "") as Zone);
      },
      // conta la zona che attraversa la fascia alta dello schermo
      { rootMargin: "-20% 0px -60% 0px" },
    );
    for (const { zone } of ZONES) {
      const el = document.getElementById(`zona-${zone}`);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);
  return (
    <nav className="tabbar" aria-label="Sezioni della scheda">
      {ZONES.map(({ zone, label }) => (
        <a key={zone} href={`#zona-${zone}`} className={active === zone ? "is-on" : ""} aria-current={active === zone ? "true" : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}

export function Sheet() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { loading, missing, broken, controller: c } = useCharacter(id);
  const [pref] = useUserAutomation();
  const [edit, setEdit] = useState(false);
  const [lvlOpen, setLvlOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sideOpen, setSideOpen] = useCampaignSide();
  const { user } = useAuth();

  // I tiri fatti dalla scheda finiscono nel registro della campagna, a nome del personaggio.
  const shareCampaign = c?.ch.campaignId;
  useShareRolls(shareCampaign && user ? { campaignId: shareCampaign, uid: user.uid, author: c.ch.name, canHide: c.campaignDmUid === user.uid } : null);

  // La scheda reagisce alla vita: da metà PF in giù le luci dello sfondo crescono (theme.css).
  const hpCur = c?.ch.state.hpCurrent;
  const hpMax = c?.sheet.hpMax.value;
  useEffect(() => {
    if (hpCur === undefined || !hpMax) return;
    const low = Math.max(0, Math.min(1, 1 - hpCur / (hpMax / 2)));
    document.documentElement.style.setProperty("--hp-low", low.toFixed(2));
    return () => {
      document.documentElement.style.removeProperty("--hp-low");
    };
  }, [hpCur, hpMax]);

  if (loading) return <main className="page"><p className="muted">Caricamento della scheda…</p></main>;
  if (missing) return <main className="page"><p>Questo personaggio non esiste o non hai accesso.</p><Link to="/">Torna ai personaggi</Link></main>;
  if (broken || !c) return <main className="page"><p>La scheda contiene dati che il motore non riconosce. Controlla la console per i dettagli.</p></main>;

  const { ch, sheet } = c;
  const classes = Object.entries(sheet.classLevels)
    .map(([cid, n]) => {
      const sub = ch.subclasses[cid] ? registry.subclasses.get(ch.subclasses[cid]!)?.name : undefined;
      return `${registry.classes.get(cid)?.name ?? cid} ${n}${sub ? ` (${sub})` : ""}`;
    })
    .join(" / ");
  const raging = !!ch.state.toggles.raging;
  const warnings = sheet.issues.filter((i) => i.severity !== "info" && i.code !== "choice.pending");

  return (
    <EditModeContext.Provider value={edit}>
      <main className={`page sheet ${raging ? "is-raging" : ""} ${ch.campaignId && sideOpen ? "has-side" : ""}`}>
        <header className="sheet-head">
          <Link to="/" className="back" aria-label="Torna ai personaggi">
            ‹
          </Link>
          <div className="sheet-title">
            <h1>{ch.name}</h1>
            <p className="muted">
              {registry.species.get(ch.speciesId)?.name}, {classes}, {registry.backgrounds.get(ch.backgroundId)?.name}
            </p>
          </div>
          <div className="sheet-tools">
            {ch.campaignId && (
              <button className={`btn ${sideOpen ? "" : "btn-primary"}`} aria-expanded={sideOpen} onClick={() => setSideOpen(!sideOpen)}>
                {sideOpen ? "Nascondi campagna" : "Campagna"}
              </button>
            )}
            <button className="btn" onClick={() => setLvlOpen(true)} disabled={sheet.level >= 20}>
              Sali di livello
            </button>
            {c.automation !== "full" && (
              <button className={`btn ${edit ? "btn-primary" : ""}`} aria-pressed={edit} onClick={() => setEdit(!edit)}>
                {edit ? "Fine correzioni" : "Correggi valori"}
              </button>
            )}
            <button className="btn btn-quiet" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(!settingsOpen)}>
              Impostazioni
            </button>
          </div>
        </header>

        {settingsOpen && (
          <section className="panel settings">
            {c.automationLocked && <p className="muted small">Il Master ha fissato l'automazione per tutta la campagna: la scelta qui sotto torna a valere quando toglie il blocco.</p>}
            <AutomationSwitch
              value={c.ownAutomation}
              inherited={pref ?? "assisted"}
              onChange={(v) => c.update((x) => ({ ...x, settings: { ...x.settings, automation: v } }))}
            />
            {Object.keys(ch.overrides).length > 0 && (
              <p>
                {Object.keys(ch.overrides).length} valori corretti a mano.{" "}
                <button className="link-btn" onClick={() => c.update((x) => ({ ...x, overrides: {} }))}>
                  Torna ai valori calcolati
                </button>
              </p>
            )}
            <button
              className="btn btn-danger-quiet"
              onClick={async () => {
                if (window.confirm(`Eliminare ${ch.name}? Non si può annullare.`)) {
                  await repo.deleteCharacter(ch.id);
                  nav("/");
                }
              }}
            >
              Elimina personaggio
            </button>
          </section>
        )}

        {edit && <p className="edit-banner">Modalità correzione: tocca un numero per forzarlo. Lascialo uguale al calcolato per annullare.</p>}

        {ch.campaignId && !sideOpen && <TurnBanner ch={ch} onInitiative={(v) => c.update((x) => ({ ...x, state: { ...x.state, initiative: v } }))} />}
        <ChoicesPanel c={c} />
        {warnings.length > 0 && (
          <ul className="problems">
            {warnings.map((w, i) => (
              <li key={i} className={w.severity === "error" ? "is-error" : ""}>
                {w.message}
              </li>
            ))}
          </ul>
        )}

        <Zones c={c} />
        <ZoneTabs />

        {ch.campaignId && sideOpen && user && <CampaignSide campaignId={ch.campaignId} currentId={ch.id} uid={user.uid} onClose={() => setSideOpen(false)} />}

        <ProposalDialog c={c} />
        <LevelUpDialog c={c} open={lvlOpen} onClose={() => setLvlOpen(false)} />
      </main>
    </EditModeContext.Provider>
  );
}
