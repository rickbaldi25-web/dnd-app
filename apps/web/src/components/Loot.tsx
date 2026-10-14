import type { CharacterData, EquipmentEntry } from "@dnd/engine";
import { useEffect, useState } from "react";
import { repo, type LootItem, type TreasureItem } from "../data";
import { useLog } from "../state/log";
import { COINS, ItemSearch, type PickedItem } from "./ItemSearch";

/** Gli oggetti che non sono nei manuali entrano nell'inventario con questo prefisso seguito dal nome. */
export const CUSTOM_ITEM = "custom:";

export const treasureLabel = (t: TreasureItem) => {
  if (t.coin) return `${t.quantity.toLocaleString("it-IT")} ${COINS.find((c) => c.id === t.coin)?.short ?? t.coin}`;
  return `${t.quantity > 1 ? `${t.quantity} × ` : ""}${t.name}${t.itemId ? "" : " (a mano)"}`;
};
const fromPick = (p: PickedItem): TreasureItem => ({ name: p.name, quantity: p.quantity, ...(p.itemId ? { itemId: p.itemId } : {}), ...(p.coin ? { coin: p.coin } : {}) });

/** Tesoro di un incontro preparato: lo si scrive prima, finisce nel bottino quando l'incontro parte. */
export function TreasureEditor({ items, onChange }: { items: TreasureItem[]; onChange: (items: TreasureItem[]) => void }) {
  return (
    <div className="treasure">
      <span className="small">Tesoro</span>
      {items.length > 0 && (
        <ul className="end-list">
          {items.map((t, i) => (
            <li key={`${t.name}-${i}`}>
              <span>{treasureLabel(t)}</span>
              <button className="icon-btn" aria-label={`Togli ${treasureLabel(t)}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <ItemSearch allowCustom allowCoins label="Oggetto del tesoro" onPick={(p) => onChange([...items, fromPick(p)])} />
    </div>
  );
}

/** Aggiunge al bottino il tesoro di un incontro. */
export function withTreasure(loot: LootItem[], treasure: TreasureItem[] | undefined): LootItem[] {
  const stamp = Date.now().toString(36);
  return [...loot, ...(treasure ?? []).map((t, i) => ({ ...t, id: `l-${stamp}-${loot.length + i}` }))];
}

/** Mette un oggetto nell'inventario (se c'è già ne somma la quantità) oppure le monete nel borsello. */
export function giveTo(ch: CharacterData, t: TreasureItem): CharacterData {
  if (t.coin) return { ...ch, coins: { ...ch.coins, [t.coin]: (ch.coins?.[t.coin] ?? 0) + t.quantity } };
  const itemId = t.itemId ?? `${CUSTOM_ITEM}${t.name}`;
  const at = ch.equipment.findIndex((e) => e.itemId === itemId);
  const equipment: EquipmentEntry[] = [...ch.equipment];
  if (at >= 0) equipment[at] = { ...equipment[at]!, quantity: (equipment[at]!.quantity ?? 1) + t.quantity };
  else equipment.push({ itemId, ...(t.quantity > 1 ? { quantity: t.quantity } : {}), ...(t.notes ? { notes: t.notes } : {}) });
  return { ...ch, equipment };
}

/** Il bottino ancora da consegnare: il Master lo assegna oggetto per oggetto; le monete si possono dividere tra tutti. */
export function LootPanel({ campaignId, party }: { campaignId: string; party: CharacterData[] }) {
  const { push } = useLog();
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [to, setTo] = useState<Record<string, string>>({});
  useEffect(() => repo.watchLoot(campaignId, setLoot), [campaignId]);
  const failed = (e: unknown) => push({ title: "Salvataggio non riuscito", lines: [String(e instanceof Error ? e.message : e)], tone: "bad" });
  const save = (next: LootItem[]) => {
    setLoot(next);
    repo.saveLoot(campaignId, next).catch(failed);
  };
  const give = async (t: LootItem) => {
    const ch = party.find((p) => p.id === (to[t.id] ?? party[0]?.id));
    if (!ch) return;
    try {
      await repo.updateCharacter(ch, giveTo(ch, t));
      save(loot.filter((x) => x.id !== t.id));
      push({ title: `${ch.name} riceve ${treasureLabel(t)}`, lines: [], rolls: [], tone: "good" });
    } catch (e) {
      failed(e);
    }
  };
  // Parti uguali a ognuno; l'eventuale resto rimane nel bottino.
  const split = async (t: LootItem) => {
    const share = Math.floor(t.quantity / party.length);
    if (!share) return;
    try {
      for (const ch of party) await repo.updateCharacter(ch, giveTo(ch, { ...t, quantity: share }));
      const rest = t.quantity - share * party.length;
      save(rest ? loot.map((x) => (x.id === t.id ? { ...x, quantity: rest } : x)) : loot.filter((x) => x.id !== t.id));
      push({ title: `Diviso ${treasureLabel(t)}`, lines: [`${treasureLabel({ ...t, quantity: share })} a testa${rest ? `, ne restano ${rest} nel bottino` : ""}`], rolls: [], tone: "good" });
    } catch (e) {
      failed(e);
    }
  };
  return (
    <section className="panel loot">
      <h2>Bottino da consegnare</h2>
      {loot.length === 0 && <p className="muted small">Vuoto. Il tesoro degli incontri preparati arriva qui quando l'incontro parte; puoi anche aggiungere oggetti e monete a mano.</p>}
      <ul className="end-list">
        {loot.map((t) => (
          <li key={t.id}>
            <span>{treasureLabel(t)}</span>
            <span className="row loot-give">
              {party.length > 0 && (
                <>
                  <select value={to[t.id] ?? party[0]!.id} aria-label={`A chi dare ${treasureLabel(t)}`} onChange={(e) => setTo({ ...to, [t.id]: e.currentTarget.value })}>
                    {party.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={() => give(t)}>
                    Consegna
                  </button>
                  {t.coin && party.length > 1 && t.quantity >= party.length && (
                    <button className="btn" onClick={() => split(t)}>
                      Dividi
                    </button>
                  )}
                </>
              )}
              <button className="icon-btn" aria-label={`Scarta ${treasureLabel(t)}`} onClick={() => save(loot.filter((x) => x.id !== t.id))}>
                ×
              </button>
            </span>
          </li>
        ))}
      </ul>
      <ItemSearch allowCustom allowCoins label="Aggiungi al bottino" onPick={(p) => save(withTreasure(loot, [fromPick(p)]))} />
    </section>
  );
}
