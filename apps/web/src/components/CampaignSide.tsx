import type { CharacterData } from "@dnd/engine";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { repo, type Campaign } from "../data";
import { PartyCard } from "../pages/Campaign";
import { usePresence } from "../state/presence";
import { InitiativePanel } from "./Initiative";

const OPEN_KEY = "dnd.campaign-side.open";

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

/**
 * La campagna accanto alla scheda: iniziativa e gruppo senza cambiare pagina.
 * Chi guarda vede ciò che vedrebbe nella pagina della campagna (il Master ha i suoi comandi).
 */
export function CampaignSide({ campaignId, currentId, uid, onClose }: { campaignId: string; currentId: string; uid: string; onClose: () => void }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [party, setParty] = useState<CharacterData[]>([]);
  const online = usePresence(campaignId);
  useEffect(() => repo.watchCampaign(campaignId, setCampaign), [campaignId]);
  useEffect(() => repo.watchCampaignCharacters(campaignId, setParty), [campaignId]);
  if (!campaign) return null;
  const isDm = campaign.dmUid === uid;
  return (
    <aside className="campaign-side" aria-label={`Campagna ${campaign.name}`}>
      <header className="row between">
        <div>
          <h2>{campaign.name}</h2>
          <Link className="link-btn" to={`/campaigns/${campaign.id}`}>
            Apri la campagna
          </Link>
        </div>
        <button className="icon-btn" aria-label="Chiudi il pannello della campagna" onClick={onClose}>
          ×
        </button>
      </header>
      <InitiativePanel campaignId={campaign.id} party={party} isDm={isDm} uid={uid} />
      <ul className="party">
        {party.map((ch) => (
          <PartyCard key={ch.id} ch={ch} canEdit={isDm} mine={ch.ownerUid === uid} online={online.some((p) => p.uid === ch.ownerUid)} current={ch.id === currentId} />
        ))}
      </ul>
    </aside>
  );
}
