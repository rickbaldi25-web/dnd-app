import {
  AUTOMATION_POLICY,
  applyProposal,
  computeSheet,
  resolveAutomation,
  type AutomationLevel,
  type CharacterData,
  type ComputedSheet,
  type Proposal,
} from "@dnd/engine";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { registry } from "../content";
import { repo } from "../data";
import { useHomebrew } from "./homebrew";
import { usePresence } from "./presence";
import { useAuth } from "../firebase/auth";
import { useLog } from "./log";

export interface CharacterController {
  /** Personaggio con l'automazione già risolta: da passare alle funzioni del motore. */
  ch: CharacterData;
  /** Automazione impostata sul personaggio (undefined = eredita la preferenza utente). */
  ownAutomation?: AutomationLevel;
  sheet: ComputedSheet;
  automation: AutomationLevel;
  /** Il Master ha fissato l'automazione per tutta la campagna: il giocatore non può cambiarla. */
  automationLocked: boolean;
  /** Master della campagna del personaggio, se ne ha una. */
  campaignDmUid?: string;
  /** Modifica diretta (input dell'utente): si salva sempre. */
  update: (fn: (ch: CharacterData) => CharacterData) => void;
  /** Esito calcolato dal motore: applicato, proposto o solo mostrato secondo l'automazione. */
  act: (p: Proposal, opts?: { direct?: boolean }) => void;
  pending: Proposal | null;
  confirm: () => void;
  cancel: () => void;
}

export function useUserAutomation() {
  const { user } = useAuth();
  const [pref, setPref] = useState<AutomationLevel | undefined>();
  useEffect(() => {
    if (!user) return;
    repo.getPrefs(user.uid).then((p) => setPref(p.automation)).catch(() => undefined);
  }, [user]);
  const save = useCallback(
    (a: AutomationLevel) => {
      setPref(a);
      if (user) repo.savePrefs(user.uid, { automation: a }).catch(() => undefined);
    },
    [user],
  );
  return [pref, save] as const;
}

export function useCharacter(id: string) {
  const [ch, setCh] = useState<CharacterData | null | undefined>(undefined);
  const [pending, setPending] = useState<Proposal | null>(null);
  const [userAutomation] = useUserAutomation();
  const { push } = useLog();
  const latest = useRef<CharacterData | null>(null);

  useEffect(() => repo.watchCharacter(id, (c) => {
    latest.current = c;
    setCh(c);
  }), [id]);

  // Se il personaggio è in una campagna: il blocco del Master vince, e chi tiene aperta la scheda risulta connesso.
  const campaignId = ch?.campaignId;
  const [campaignLock, setCampaignLock] = useState<AutomationLevel | undefined>();
  const [campaignDmUid, setCampaignDmUid] = useState<string | undefined>();
  useEffect(() => {
    setCampaignLock(undefined);
    setCampaignDmUid(undefined);
    return campaignId
      ? repo.watchCampaign(campaignId, (c) => {
          setCampaignLock(c?.automationLock);
          setCampaignDmUid(c?.dmUid);
        })
      : undefined;
  }, [campaignId]);
  usePresence(campaignId);
  const { version: contentVersion } = useHomebrew(campaignId);

  const automation = resolveAutomation({ campaignLock, character: ch?.settings.automation, user: userAutomation });

  const resolved = useMemo(() => (ch ? { ...ch, settings: { ...ch.settings, automation } } : null), [ch, automation]);

  const sheet = useMemo(() => {
    if (!resolved) return null;
    try {
      return computeSheet(resolved, registry, { automation });
    } catch (e) {
      console.error(e);
      return null;
    }
    // contentVersion: gli oggetti e gli incantesimi della campagna sono arrivati o cambiati.
  }, [resolved, automation, contentVersion]);

  const persist = useCallback(
    (next: CharacterData) => {
      const prev = latest.current;
      latest.current = next;
      setCh(next); // aggiornamento ottimistico
      // Solo i campi cambiati rispetto all'ultima versione vista: il resto può averlo toccato qualcun altro.
      (prev ? repo.updateCharacter(prev, next) : repo.saveCharacter(next)).catch((e) => push({ title: "Salvataggio non riuscito", lines: [String(e?.message ?? e)], tone: "bad" }));
    },
    [push],
  );

  const update = useCallback(
    (fn: (c: CharacterData) => CharacterData) => {
      if (latest.current) persist(fn(latest.current));
    },
    [persist],
  );

  const act = useCallback(
    (p: Proposal, opts: { direct?: boolean } = {}) => {
      const cur = latest.current;
      if (!cur) return;
      if (p.blocked) {
        push({ title: p.title, lines: [p.blocked], rolls: p.rolls, tone: "bad" });
        return;
      }
      const policy = AUTOMATION_POLICY[automation];
      // Gli input diretti (danno, cura dall'apposito campo) si applicano sempre.
      if (opts.direct || policy.autoApply) {
        persist(applyProposal(cur, p));
        push({ title: p.title, lines: p.lines, rolls: p.rolls, tone: "good" });
      } else if (!policy.computeActions) {
        push({ title: p.title, lines: p.lines, rolls: p.rolls });
      } else {
        setPending(p);
      }
    },
    [automation, persist, push],
  );

  const confirm = useCallback(() => {
    if (pending && latest.current) {
      persist(applyProposal(latest.current, pending));
      push({ title: pending.title, lines: pending.lines, rolls: pending.rolls, tone: "good" });
    }
    setPending(null);
  }, [pending, persist, push]);

  const cancel = useCallback(() => setPending(null), []);

  const controller: CharacterController | null =
    resolved && sheet
      ? { ch: resolved, ownAutomation: ch?.settings.automation, sheet, automation, automationLocked: !!campaignLock, campaignDmUid, update, act, pending, confirm, cancel }
      : null;

  return { loading: ch === undefined, missing: ch === null, broken: !!ch && !sheet, controller };
}
