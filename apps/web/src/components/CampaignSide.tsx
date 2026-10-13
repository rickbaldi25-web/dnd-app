import type { CharacterData } from "@dnd/engine";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { repo, type Campaign } from "../data";
import type { CampaignNews } from "../state/news";
import { usePresence } from "../state/presence";
import { HandoutsPanel } from "./Handouts";
import { InitiativePanel, useEncounter } from "./Initiative";
import { PartyCard } from "./PartyCard";
import { RollLog } from "./RollLog";
import { SessionNotes } from "./SessionNotes";

const OPEN_KEY = "dnd.campaign-side.open";
const SECTION_KEY = "dnd.campaign-side.section";

/** Aperto o chiuso: resta come l'ha lasciato l'utente; la prima volta è aperto solo dove c'è spazio. */
export function useCampaignSide() {
  const [open, setOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(OPEN_KEY);
      if (saved !== null) return saved === "1";
    } catch {
      /* storage bloccato: vale la scelta di partenza */
    }
    return typeof window !== "undefined" && window.innerWidth >= 1200;
  });
  const set = (v: boolean) => {
    setOpen(v);
    try {
      localStorage.setItem(OPEN_KEY, v ? "1" : "0");
    } catch {
      /* ignora */
    }
  };
  return [open, set] as const;
}

export type DrawerSection = "turno" | "gruppo" | "handout" | "diario" | "tiri";
const LABELS: Record<DrawerSection, string> = { turno: "Turno", gruppo: "Gruppo", handout: "Handout", diario: "Diario", tiri: "Tiri" };

export function Badge({ n }: { n: number }) {
  return n > 0 ? (
    <span className="badge" aria-label={`${n} novità`}>
      {n}
    </span>
  ) : null;
}

function DrawerBody({ campaignId, currentId, uid, sections, news, pageLink, onClose }: { campaignId: string; currentId?: string; uid: string; sections: DrawerSection[]; news: CampaignNews; pageLink: boolean; onClose: () => void }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [party, setParty] = useState<CharacterData[]>([]);
  const online = usePresence(campaignId);
  const fighting = !!useEncounter(campaignId)?.active;
  const [wanted, setWanted] = useState<string>(() => {
    try {
      return localStorage.getItem(SECTION_KEY) ?? "";
    } catch {
      return "";
    }
  });
  useEffect(() => repo.watchCampaign(campaignId, setCampaign), [campaignId]);
  useEffect(() => repo.watchCampaignCharacters(campaignId, setParty), [campaignId]);
  if (!campaign) return null;
  const isDm = campaign.dmUid === uid;
  // Il turno c'è solo durante un combattimento.
  const available = sections.filter((s) => s !== "turno" || fighting);
  const section = available.find((s) => s === wanted) ?? available[0];
  const pick = (s: DrawerSection) => {
    setWanted(s);
    try {
      localStorage.setItem(SECTION_KEY, s);
    } catch {
      /* ignora */
    }
  };
  const count = (s: DrawerSection) => (s === "handout" ? news.handouts : s === "diario" ? news.diary : 0);
  return (
    <aside className="campaign-side" aria-label={`Campagna ${campaign.name}`}>
      <header className="row between">
        <div>
          <h2>{campaign.name}</h2>
          {pageLink && (
            <Link className="link-btn" to={`/campaigns/${campaign.id}`}>
              Apri la campagna
            </Link>
          )}
        </div>
        <button className="icon-btn" aria-label="Chiudi il pannello della campagna" onClick={onClose}>
          ×
        </button>
      </header>
      <nav className="tabs drawer-tabs" role="tablist" aria-label="Sezioni del pannello">
        {available.map((s) => (
          <button key={s} role="tab" aria-selected={section === s} className={`${section === s ? "is-on" : ""} ${s === "turno" ? "is-combat" : ""}`} onClick={() => pick(s)}>
            {LABELS[s]}
            <Badge n={count(s)} />
          </button>
        ))}
      </nav>
      {section === "turno" && <InitiativePanel campaignId={campaign.id} party={party} isDm={isDm} uid={uid} />}
      {section === "gruppo" && (
        <ul className="party">
          {party.map((ch) => (
            <PartyCard key={ch.id} ch={ch} canEdit={isDm} mine={ch.ownerUid === uid} online={online.some((p) => p.uid === ch.ownerUid)} current={ch.id === currentId} />
          ))}
          {party.length === 0 && <li className="muted small">Nessun personaggio collegato.</li>}
        </ul>
      )}
      {section === "handout" && <HandoutsPanel campaignId={campaign.id} isDm={isDm} uid={uid} party={party} />}
      {section === "diario" && <SessionNotes campaignId={campaign.id} isDm={isDm} />}
      {section === "tiri" && <RollLog campaignId={campaign.id} isDm={isDm} />}
    </aside>
  );
}

/**
 * Cassetto della campagna: si apre sopra qualsiasi vista, dalla linguetta sul bordo destro.
 * Chi guarda vede ciò che vedrebbe nella pagina della campagna (il Master ha i suoi comandi).
 */
export function CampaignDrawer({
  campaignId,
  currentId,
  uid,
  sections,
  news,
  open,
  onToggle,
  pageLink = false,
}: {
  campaignId: string;
  currentId?: string;
  uid: string;
  sections: DrawerSection[];
  news: CampaignNews;
  open: boolean;
  onToggle: (open: boolean) => void;
  pageLink?: boolean;
}) {
  if (open) return <DrawerBody campaignId={campaignId} currentId={currentId} uid={uid} sections={sections} news={news} pageLink={pageLink} onClose={() => onToggle(false)} />;
  return (
    <button className="drawer-handle" aria-expanded={false} onClick={() => onToggle(true)}>
      Campagna
      <Badge n={news.handouts + news.diary} />
    </button>
  );
}
