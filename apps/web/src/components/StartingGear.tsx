import { roll, type EquipmentEntry } from "@dnd/engine";
import { useMemo } from "react";
import { registry } from "../content";
import { backgroundGear, PICKS, STARTING_KITS, type Thing } from "../data/startingEquipment";
import { CUSTOM_ITEM } from "./Loot";

/** Le scelte fatte nel passo dell'equipaggiamento: si tengono nella pagina di creazione. */
export interface GearState {
  mode: "kit" | "gold";
  /** Alternativa scelta per ogni scelta della classe. */
  options: number[];
  /** Oggetto scelto per ogni "un'arma semplice" e simili, per posizione. */
  picks: Record<string, string>;
  gold: number | null;
}
export const EMPTY_GEAR: GearState = { mode: "kit", options: [], picks: {}, gold: null };

const nameOf = (id: string) => registry.items.get(id)?.name ?? id;
const findItem = (() => {
  let byName: Map<string, string> | null = null;
  return (name: string) => {
    byName ??= new Map([...registry.items.values()].map((i) => [i.name.toLowerCase(), i.id]));
    return byName.get(name.toLowerCase());
  };
})();

/** Cosa riceve il personaggio con le scelte fatte: oggetti per l'inventario e monete d'oro. */
export function resolveGear(classId: string, backgroundId: string, g: GearState): { equipment: EquipmentEntry[]; gp: number } {
  const kit = STARTING_KITS[classId];
  if (g.mode === "gold") return { equipment: [], gp: g.gold ?? 0 };
  const things: { thing: Thing; key: string }[] = [];
  kit?.choices.forEach((opts, i) => (opts[g.options[i] ?? 0] ?? []).forEach((thing, j) => things.push({ thing, key: `c${i}-${g.options[i] ?? 0}-${j}` })));
  kit?.fixed.forEach((thing, j) => things.push({ thing, key: `f${j}` }));
  const equipment: EquipmentEntry[] = [];
  const add = (itemId: string, qty: number, notes?: string) => {
    const at = equipment.findIndex((e) => e.itemId === itemId);
    if (at >= 0) equipment[at] = { ...equipment[at]!, quantity: (equipment[at]!.quantity ?? 1) + qty };
    else equipment.push({ itemId, ...(qty > 1 ? { quantity: qty } : {}), ...(notes ? { notes } : {}) });
  };
  for (const { thing, key } of things) add("id" in thing ? thing.id : (g.picks[key] ?? PICKS[thing.pick].ids[0]!), thing.qty ?? 1);
  let gp = 0;
  for (const b of backgroundGear(registry.backgrounds.get(backgroundId)?.description, findItem)) {
    if (b.gp) gp += b.gp;
    else add(b.itemId ?? `${CUSTOM_ITEM}${b.name}`, b.quantity, b.notes);
  }
  // Armatura, scudo e la prima arma si mettono già addosso.
  let armor = false;
  let shield = false;
  let weapon = false;
  for (const e of equipment) {
    const item = registry.items.get(e.itemId);
    if (item?.kind === "armor" && !armor) e.equipped = armor = true;
    else if (item?.kind === "shield" && !shield) e.equipped = shield = true;
    else if (item?.kind === "weapon" && !weapon) e.equipped = weapon = true;
  }
  return { equipment, gp };
}

function PickSelect({ kind, value, onChange }: { kind: keyof typeof PICKS; value: string | undefined; onChange: (id: string) => void }) {
  const ids = PICKS[kind].ids;
  return (
    <select value={value ?? ids[0]} aria-label={PICKS[kind].label} onChange={(e) => onChange(e.currentTarget.value)}>
      {ids.map((x) => (
        <option key={x} value={x}>
          {nameOf(x)}
        </option>
      ))}
    </select>
  );
}

/** Un'alternativa a parole, con i menu per gli oggetti da scegliere quando è quella selezionata. */
function Things({ things, keyOf, picks, active, setPick }: { things: Thing[]; keyOf: (j: number) => string; picks: Record<string, string>; active: boolean; setPick: (key: string, id: string) => void }) {
  return (
    <span className="gear-things">
      {things.map((t, j) => (
        <span key={j}>
          {j > 0 && " + "}
          {"id" in t ? `${t.qty && t.qty > 1 ? `${t.qty} × ` : ""}${nameOf(t.id)}` : active ? <PickSelect kind={t.pick} value={picks[keyOf(j)]} onChange={(id) => setPick(keyOf(j), id)} /> : PICKS[t.pick].label}
        </span>
      ))}
    </span>
  );
}

/** Passo della creazione: l'equipaggiamento di classe e background, oppure le monete per comprarlo. */
export function StartingGear({ classId, backgroundId, value, onChange }: { classId: string; backgroundId: string; value: GearState; onChange: (g: GearState) => void }) {
  const kit = STARTING_KITS[classId];
  const bg = useMemo(() => backgroundGear(registry.backgrounds.get(backgroundId)?.description, findItem), [backgroundId]);
  if (!kit) return null;
  const setPick = (key: string, id: string) => onChange({ ...value, picks: { ...value.picks, [key]: id } });
  const bgText = bg.map((b) => (b.gp ? `${b.gp} mo` : `${b.quantity > 1 ? `${b.quantity} × ` : ""}${b.itemId ? nameOf(b.itemId) : b.name}`)).join(", ");
  return (
    <section className="panel form starting-gear">
      <h2>Equipaggiamento iniziale</h2>
      <div className="segmented" role="radiogroup" aria-label="Equipaggiamento iniziale">
        <button role="radio" aria-checked={value.mode === "kit"} className={value.mode === "kit" ? "is-on" : ""} onClick={() => onChange({ ...value, mode: "kit" })}>
          Quello della classe
        </button>
        <button role="radio" aria-checked={value.mode === "gold"} className={value.mode === "gold" ? "is-on" : ""} onClick={() => onChange({ ...value, mode: "gold" })}>
          Monete per comprarlo
        </button>
      </div>
      {value.mode === "kit" ? (
        <>
          {kit.choices.map((opts, i) => (
            <fieldset key={i} className="gear-choice">
              <legend className="small muted">Scelta {i + 1}</legend>
              {opts.map((things, o) => {
                const on = (value.options[i] ?? 0) === o;
                return (
                  <label key={o} className="gear-option">
                    <input
                      type="radio"
                      name={`scelta-${i}`}
                      checked={on}
                      onChange={() => {
                        const options = [...value.options];
                        options[i] = o;
                        onChange({ ...value, options });
                      }}
                    />
                    <Things things={things} keyOf={(j) => `c${i}-${o}-${j}`} picks={value.picks} active={on} setPick={setPick} />
                  </label>
                );
              })}
            </fieldset>
          ))}
          {kit.fixed.length > 0 && (
            <p className="small">
              Ricevi anche: <Things things={kit.fixed} keyOf={(j) => `f${j}`} picks={value.picks} active setPick={setPick} />
            </p>
          )}
          {bgText && <p className="small">Dal background: {bgText}.</p>}
          <p className="muted small">Armatura, scudo e la prima arma risultano già indossati. Il resto si cambia poi dall'inventario.</p>
        </>
      ) : (
        <div className="row">
          <button className="btn" onClick={() => onChange({ ...value, gold: roll(kit.wealth.dice).total * kit.wealth.times })}>
            Tira {kit.wealth.dice}
            {kit.wealth.times > 1 ? ` × ${kit.wealth.times}` : ""}
          </button>
          <label className="small">
            oppure scrivi le mo{" "}
            <input type="number" min={0} value={value.gold ?? ""} className="short-input" aria-label="Monete d'oro iniziali" onChange={(e) => onChange({ ...value, gold: e.currentTarget.value === "" ? null : Math.max(0, Math.floor(Number(e.currentTarget.value) || 0)) })} />
          </label>
          {value.gold !== null && <strong>{value.gold} mo</strong>}
          <p className="muted small">Al posto dell'equipaggiamento di classe e background: gli oggetti si comprano poi dall'inventario.</p>
        </div>
      )}
    </section>
  );
}
