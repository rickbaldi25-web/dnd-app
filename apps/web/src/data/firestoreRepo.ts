import { diffFields, type AutomationLevel, type CharacterData } from "@dnd/engine";
import {
  collection,
  arrayRemove,
  arrayUnion,
  addDoc,
  deleteDoc,
  deleteField,
  doc,
  FieldPath,
  limit,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { newCampaignCode, type Campaign, type Encounter, type EncounterPlan, type Handout, type Homebrew, type MonsterSecret, type Presence, type SharedRoll, type Repository, type UserPrefs } from "./repository";

/** Toglie i campi tecnici di Firestore prima di passare il personaggio al motore. */
function toCharacter(id: string, data: Record<string, unknown>): CharacterData {
  const { updatedAt: _u, createdAt: _c, ...rest } = data;
  return { ...(rest as unknown as CharacterData), id };
}

export function firestoreRepo(db: Firestore): Repository {
  const characters = collection(db, "characters");
  const campaigns = collection(db, "campaigns");
  const toCampaign = (id: string, data: Record<string, unknown>): Campaign => ({
    id,
    name: String(data.name ?? ""),
    dmUid: String(data.dmUid ?? ""),
    dmName: String(data.dmName ?? ""),
    memberUids: (data.memberUids as string[] | undefined) ?? [],
    ...(data.automationLock ? { automationLock: data.automationLock as AutomationLevel } : {}),
  });
  const presence = (campaignId: string) => collection(db, "campaigns", campaignId, "presence");
  return {
    watchCharacters(ownerUid, cb) {
      const q = query(characters, where("ownerUid", "==", ownerUid), orderBy("name"));
      return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toCharacter(d.id, d.data()))));
    },
    watchCharacter(id, cb) {
      // onSnapshot: la scheda si aggiorna in tempo reale (es. danno applicato dal Master).
      return onSnapshot(doc(characters, id), (d) => cb(d.exists() ? toCharacter(d.id, d.data()) : null));
    },
    async saveCharacter(ch) {
      await setDoc(doc(characters, ch.id), { ...ch, updatedAt: serverTimestamp() });
    },
    async updateCharacter(prev, next) {
      const changes = diffFields(prev, next).filter((c) => c.path.length > 0);
      if (!changes.length) return;
      // FieldPath, non "a.b.c": gli id delle risorse contengono punti ("barbarian.rage").
      const rest = changes.flatMap((c) => [new FieldPath(...c.path), c.value === undefined ? deleteField() : c.value]);
      await updateDoc(doc(characters, next.id), "updatedAt", serverTimestamp(), ...rest);
    },
    async deleteCharacter(id) {
      await deleteDoc(doc(characters, id));
    },
    watchCampaigns(uid, cb) {
      // Due interrogazioni (da Master e da giocatore), poi unite.
      const found = { dm: [] as Campaign[], member: [] as Campaign[] };
      const emit = () => cb([...found.dm, ...found.member.filter((m) => !found.dm.some((d) => d.id === m.id))].sort((a, b) => a.name.localeCompare(b.name)));
      const offDm = onSnapshot(query(campaigns, where("dmUid", "==", uid)), (snap) => {
        found.dm = snap.docs.map((d) => toCampaign(d.id, d.data()));
        emit();
      });
      const offMember = onSnapshot(query(campaigns, where("memberUids", "array-contains", uid)), (snap) => {
        found.member = snap.docs.map((d) => toCampaign(d.id, d.data()));
        emit();
      });
      return () => {
        offDm();
        offMember();
      };
    },
    watchCampaign(id, cb) {
      return onSnapshot(doc(campaigns, id), (d) => cb(d.exists() ? toCampaign(d.id, d.data()) : null), () => cb(null));
    },
    watchCampaignCharacters(campaignId, cb) {
      const q = query(characters, where("campaignId", "==", campaignId), orderBy("name"));
      return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toCharacter(d.id, d.data()))), () => cb([]));
    },
    async createCampaign(name, dm) {
      const campaign: Campaign = { id: newCampaignCode(), name, dmUid: dm.uid, dmName: dm.name, memberUids: [] };
      const { id, ...data } = campaign;
      await setDoc(doc(campaigns, id), { ...data, createdAt: serverTimestamp() });
      return campaign;
    },
    async joinCampaign(code, uid) {
      const ref = doc(campaigns, code);
      const found = await getDoc(ref);
      if (!found.exists()) throw new Error("Nessuna campagna con questo codice.");
      const campaign = toCampaign(found.id, found.data());
      if (campaign.dmUid !== uid && !campaign.memberUids.includes(uid)) await updateDoc(ref, { memberUids: arrayUnion(uid) });
      return campaign;
    },
    async deleteCampaign(id) {
      await deleteDoc(doc(campaigns, id));
    },
    async setAutomationLock(id, level) {
      await updateDoc(doc(campaigns, id), { automationLock: level ?? deleteField() });
    },
    async leaveCampaign(id, uid) {
      await updateDoc(doc(campaigns, id), { memberUids: arrayRemove(uid) });
      await deleteDoc(doc(presence(id), uid)).catch(() => undefined);
    },
    watchEncounter(campaignId, cb) {
      return onSnapshot(doc(db, "campaigns", campaignId, "state", "encounter"), (d) => cb(d.exists() ? (d.data() as Encounter) : null), () => cb(null));
    },
    async saveEncounter(campaignId, encounter) {
      await setDoc(doc(db, "campaigns", campaignId, "state", "encounter"), encounter);
    },
    watchMonsterSecrets(campaignId, cb) {
      const ref = doc(db, "campaigns", campaignId, "secret", "encounter");
      return onSnapshot(ref, (d) => cb(((d.data()?.monsters as Record<string, MonsterSecret>) ?? {})), () => cb({}));
    },
    async saveMonsterSecrets(campaignId, secrets) {
      await setDoc(doc(db, "campaigns", campaignId, "secret", "encounter"), { monsters: secrets });
    },
    watchEncounterPlans(campaignId, cb) {
      return onSnapshot(doc(db, "campaigns", campaignId, "secret", "plans"), (d) => cb((d.data()?.plans as EncounterPlan[]) ?? []), () => cb([]));
    },
    async saveEncounterPlans(campaignId, plans) {
      await setDoc(doc(db, "campaigns", campaignId, "secret", "plans"), { plans });
    },
    watchHandouts(campaignId, viewer, cb) {
      const col = collection(db, "campaigns", campaignId, "handouts");
      const read = (d: { id: string; data(): Record<string, unknown> }) => ({ ...(d.data() as unknown as Omit<Handout, "id">), id: d.id });
      if (viewer.isDm) return onSnapshot(col, (snap) => cb(snap.docs.map(read)), () => cb([]));
      // Le regole fanno leggere a un giocatore solo ciò che gli è stato mostrato: servono due ricerche, poi unite.
      let forAll: Handout[] = [];
      let forMe: Handout[] = [];
      const emit = () => cb([...forAll, ...forMe.filter((h) => !forAll.some((x) => x.id === h.id))]);
      const stopAll = onSnapshot(query(col, where("everyone", "==", true)), (snap) => { forAll = snap.docs.map(read); emit(); }, () => { forAll = []; emit(); });
      const stopMine = onSnapshot(query(col, where("visibleTo", "array-contains", viewer.uid)), (snap) => { forMe = snap.docs.map(read); emit(); }, () => { forMe = []; emit(); });
      return () => {
        stopAll();
        stopMine();
      };
    },
    async saveHandout(campaignId, handout) {
      const { id, ...data } = handout;
      await setDoc(doc(db, "campaigns", campaignId, "handouts", id), data);
    },
    async deleteHandout(campaignId, id) {
      await deleteDoc(doc(db, "campaigns", campaignId, "handouts", id));
    },
    watchHomebrew(campaignId, cb) {
      return onSnapshot(doc(db, "campaigns", campaignId, "state", "homebrew"), (d) => cb(d.exists() ? { items: d.data().items ?? [], spells: d.data().spells ?? [] } : null), () => cb(null));
    },
    async saveHomebrew(campaignId, homebrew) {
      await setDoc(doc(db, "campaigns", campaignId, "state", "homebrew"), homebrew);
    },
    async addRoll(campaignId, roll) {
      // I tiri segreti stanno in una raccolta a parte, che le regole aprono solo al Master.
      await addDoc(collection(db, "campaigns", campaignId, roll.secret ? "secretRolls" : "rolls"), roll);
    },
    async clearRolls(campaignId) {
      for (const name of ["rolls", "secretRolls"]) {
        const snap = await getDocs(collection(db, "campaigns", campaignId, name));
        // Un batch regge 500 scritture: si procede a blocchi.
        for (let i = 0; i < snap.docs.length; i += 400) {
          const batch = writeBatch(db);
          for (const d of snap.docs.slice(i, i + 400)) batch.delete(d.ref);
          await batch.commit();
        }
      }
    },
    watchRolls(campaignId, secret, cb) {
      const q = query(collection(db, "campaigns", campaignId, secret ? "secretRolls" : "rolls"), orderBy("at", "desc"), limit(30));
      return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ ...(d.data() as Omit<SharedRoll, "id">), id: d.id }))), () => cb([]));
    },
    async touchPresence(campaignId, user) {
      await setDoc(doc(presence(campaignId), user.uid), { name: user.name, at: Date.now() });
    },
    watchPresence(campaignId, cb) {
      return onSnapshot(
        presence(campaignId),
        (snap) => cb(snap.docs.map((d): Presence => ({ uid: d.id, name: String(d.data().name ?? ""), at: Number(d.data().at ?? 0) }))),
        () => cb([]),
      );
    },
    async getPrefs(uid) {
      const d = await getDoc(doc(db, "users", uid));
      return (d.data()?.prefs as UserPrefs) ?? {};
    },
    async savePrefs(uid, prefs) {
      await setDoc(doc(db, "users", uid), { prefs }, { merge: true });
    },
  };
}
