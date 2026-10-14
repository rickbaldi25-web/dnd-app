import type { Coin, ItemDef } from "@dnd/engine";
import { useMemo, useState } from "react";
import { DAMAGE_TYPES, registry } from "../content";

/** Monete nell'ordine dei manuali italiani, dalla più preziosa. */
export const COINS: { id: Coin; short: string; name: string }[] = [
  { id: "pp", short: "mp", name: "monete di platino" },
  { id: "gp", short: "mo", name: "monete d'oro" },
  { id: "ep", short: "me", name: "monete di electrum" },
  { id: "sp", short: "ma", name: "monete d'argento" },
  { id: "cp", short: "mr", name: "monete di rame" },
];

/** Cosa si è scelto: un oggetto dei manuali, uno scritto a mano, oppure delle monete. */
export interface PickedItem {
  name: string;
  quantity: number;
  itemId?: string;
  coin?: Coin;
}

const ARMOR: Record<string, string> = { light: "leggera", medium: "media", heavy: "pesante" };
const RARITY: Record<string, string> = { common: "comune", uncommon: "non comune", rare: "raro", "very rare": "molto raro", legendary: "leggendario", artifact: "artefatto" };

/** Una riga che dice che cos'è l'oggetto: tipo, danni o CA, rarità e prezzo. */
export function itemDetail(item: ItemDef): string {
  const parts: string[] = [];
  if (item.kind === "weapon") parts.push(`Arma ${item.category === "simple" ? "semplice" : "da guerra"}${item.range === "ranged" ? " a distanza" : ""}`, `${item.damage} ${DAMAGE_TYPES[item.damageType] ?? item.damageType}`);
  else if (item.kind === "armor") parts.push(`Armatura ${ARMOR[item.category] ?? item.category}`, `CA ${item.baseAC}${item.dexCap === null ? " + Des" : item.dexCap > 0 ? ` + Des (max ${item.dexCap})` : ""}`);
  else if (item.kind === "shield") parts.push("Scudo", `CA +${item.bonus}`);
  else parts.push(!item.category || item.category === "gear" ? "Equipaggiamento" : item.category);
  if (item.magic) parts.push(item.rarity ? `magico, ${RARITY[item.rarity.toLowerCase()] ?? item.rarity}` : "magico");
  if (item.value) parts.push(`${item.value.toLocaleString("it-IT")} mo`);
  return parts.join(" · ");
}

/** "50 mo", "12ma", "3 mp": quantità e moneta. */
function parseCoins(text: string): { coin: Coin; amount: number } | null {
  const m = /^(\d+)\s*(mp|mo|me|ma|mr)$/i.exec(text.trim());
  if (!m) return null;
  const coin = COINS.find((c) => c.short === m[2]!.toLowerCase())!;
  return { coin: coin.id, amount: Number(m[1]) };
}

/**
 * Ricerca negli oggetti dei manuali, come quella dei mostri: si scrive, compaiono i risultati con i dettagli,
 * si tocca quello giusto. Con allowCustom si può tenere un nome che non è nei manuali; con allowCoins
 * si possono scrivere monete ("50 mo").
 */
export function ItemSearch({ onPick, allowCustom = false, allowCoins = false, label = "Cerca un oggetto" }: { onPick: (p: PickedItem) => void; allowCustom?: boolean; allowCoins?: boolean; label?: string }) {
  const [text, setText] = useState("");
  const [qty, setQty] = useState("1");
  const all = useMemo(() => [...registry.items.values()], []);
  const q = text.trim().toLowerCase();
  const matches = useMemo(() => {
    if (q.length < 2) return [];
    const hit = all.filter((i) => i.name.toLowerCase().includes(q) || i.nameEn?.toLowerCase().includes(q));
    // Prima quelli che cominciano con ciò che si è scritto, poi in ordine alfabetico.
    return hit.sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)) || a.name.localeCompare(b.name, "it")).slice(0, 10);
  }, [all, q]);
  const coins = allowCoins ? parseCoins(text) : null;
  const quantity = Math.max(1, Math.floor(Number(qty) || 1));
  const done = (p: PickedItem) => {
    onPick(p);
    setText("");
    setQty("1");
  };
  const pickItem = (i: ItemDef) => done({ name: i.name, quantity, itemId: i.id });
  // Invio: le monete, oppure l'unico risultato, oppure quello con il nome esatto, oppure il nome scritto a mano.
  const enter = () => {
    if (coins) return done({ name: "", quantity: coins.amount, coin: coins.coin });
    const exact = matches.find((m) => m.name.toLowerCase() === q);
    if (exact || matches.length === 1) return pickItem(exact ?? matches[0]!);
    if (allowCustom && q) done({ name: text.trim(), quantity });
  };
  return (
    <div className="item-search">
      <div className="row">
        <input type="search" value={text} placeholder={allowCoins ? "Oggetto o monete (es. 50 mo)" : "Nome dell'oggetto"} aria-label={label} onChange={(e) => setText(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && enter()} />
        {!coins && <input type="number" min={1} value={qty} aria-label="Quantità" className="short-input" onChange={(e) => setQty(e.currentTarget.value)} />}
      </div>
      {q.length >= 2 && (
        <ul className="monster-matches item-matches">
          {coins && (
            <li>
              <button className="link-btn" onClick={() => done({ name: "", quantity: coins.amount, coin: coins.coin })}>
                {coins.amount} {COINS.find((c) => c.id === coins.coin)!.short}
              </button>{" "}
              <span className="muted small">{COINS.find((c) => c.id === coins.coin)!.name}</span>
            </li>
          )}
          {matches.map((i) => (
            <li key={i.id}>
              <button className="link-btn" onClick={() => pickItem(i)}>
                {i.name}
              </button>{" "}
              <span className="muted small">{itemDetail(i)}</span>
            </li>
          ))}
          {allowCustom && !coins && !matches.some((m) => m.name.toLowerCase() === q) && (
            <li>
              <button className="link-btn" onClick={() => done({ name: text.trim(), quantity })}>
                «{text.trim()}»
              </button>{" "}
              <span className="muted small">scritto a mano, senza regole</span>
            </li>
          )}
          {!matches.length && !allowCustom && !coins && <li className="muted small">Nessun oggetto con questo nome.</li>}
        </ul>
      )}
    </div>
  );
}
