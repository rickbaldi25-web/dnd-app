import type { Ability, ItemDef, SpellDef, SpellSchool, WeaponProperty } from "@dnd/engine";
import { importCompendium } from "@dnd/importer";
import { useState } from "react";
import { ABILITY_NAMES, DAMAGE_TYPES, registry } from "../content";
import { repo, type Homebrew } from "../data";
import { useLog } from "../state/log";

const SCHOOLS: Record<SpellSchool, string> = {
  abjuration: "Abiurazione",
  conjuration: "Evocazione",
  divination: "Divinazione",
  enchantment: "Ammaliamento",
  evocation: "Invocazione",
  illusion: "Illusione",
  necromancy: "Necromanzia",
  transmutation: "Trasmutazione",
};
const PROPERTIES: Partial<Record<WeaponProperty, string>> = { finesse: "Accurata", light: "Leggera", heavy: "Pesante", "two-handed": "A due mani", thrown: "Da lancio", reach: "Portata" };
const KINDS = { weapon: "Arma", armor: "Armatura", shield: "Scudo", gear: "Oggetto" } as const;
/** Oltre questo numero di voci il documento della campagna diventa troppo grande per Firestore. */
const MAX_ENTRIES = 300;

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
/** Gli id dei contenuti della campagna hanno un prefisso, così non si confondono con quelli dei manuali. */
const newId = (name: string, taken: Set<string>) => {
  const base = `hb.${slug(name) || "voce"}`;
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}-${i}`;
  return id;
};

/** Un oggetto senza id, tenendo distinti arma, armatura, scudo e oggetto generico. */
type NewItem = ItemDef extends infer T ? (T extends ItemDef ? Omit<T, "id"> : never) : never;

function ItemForm({ onAdd }: { onAdd: (item: NewItem) => void }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<keyof typeof KINDS>("weapon");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("simple");
  const [range, setRange] = useState<"melee" | "ranged">("melee");
  const [damage, setDamage] = useState("1d8");
  const [damageType, setDamageType] = useState<"bludgeoning" | "piercing" | "slashing">("slashing");
  const [props, setProps] = useState<WeaponProperty[]>([]);
  const [armorCat, setArmorCat] = useState<"light" | "medium" | "heavy">("light");
  const [ac, setAc] = useState("12");
  const [magic, setMagic] = useState(false);
  const submit = () => {
    const common = { name: name.trim(), ...(description.trim() ? { description: description.trim() } : {}), ...(magic ? { magic: true } : {}) };
    if (kind === "weapon") onAdd({ ...common, kind, category: category as "simple" | "martial", range, damage: damage.trim() || "1d4", damageType, properties: props });
    else if (kind === "armor") onAdd({ ...common, kind, category: armorCat, baseAC: Number(ac) || 10, dexCap: armorCat === "light" ? null : armorCat === "medium" ? 2 : 0 });
    else if (kind === "shield") onAdd({ ...common, kind, bonus: Number(ac) || 2 });
    else onAdd({ ...common, kind });
    setName("");
    setDescription("");
  };
  return (
    <div className="homebrew-form">
      <div className="row">
        <input value={name} placeholder="Nome dell'oggetto" aria-label="Nome dell'oggetto" onChange={(e) => setName(e.currentTarget.value)} />
        <select value={kind} aria-label="Tipo di oggetto" onChange={(e) => setKind(e.currentTarget.value as keyof typeof KINDS)}>
          {Object.entries(KINDS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="small">
          <input type="checkbox" checked={magic} onChange={(e) => setMagic(e.currentTarget.checked)} /> Magico
        </label>
      </div>
      {kind === "weapon" && (
        <div className="row">
          <select value={category} aria-label="Categoria" onChange={(e) => setCategory(e.currentTarget.value)}>
            <option value="simple">Semplice</option>
            <option value="martial">Da guerra</option>
          </select>
          <select value={range} aria-label="Mischia o distanza" onChange={(e) => setRange(e.currentTarget.value as "melee" | "ranged")}>
            <option value="melee">Da mischia</option>
            <option value="ranged">A distanza</option>
          </select>
          <input value={damage} placeholder="1d8+1" aria-label="Dadi di danno" className="short-input" onChange={(e) => setDamage(e.currentTarget.value)} />
          <select value={damageType} aria-label="Tipo di danno" onChange={(e) => setDamageType(e.currentTarget.value as typeof damageType)}>
            {(["slashing", "piercing", "bludgeoning"] as const).map((t) => (
              <option key={t} value={t}>
                {DAMAGE_TYPES[t]}
              </option>
            ))}
          </select>
          {Object.entries(PROPERTIES).map(([p, label]) => (
            <label key={p} className="small">
              <input type="checkbox" checked={props.includes(p as WeaponProperty)} onChange={(e) => setProps(e.currentTarget.checked ? [...props, p as WeaponProperty] : props.filter((x) => x !== p))} /> {label}
            </label>
          ))}
        </div>
      )}
      {kind === "armor" && (
        <div className="row">
          <select value={armorCat} aria-label="Categoria" onChange={(e) => setArmorCat(e.currentTarget.value as typeof armorCat)}>
            <option value="light">Leggera</option>
            <option value="medium">Media</option>
            <option value="heavy">Pesante</option>
          </select>
          <label className="small">
            CA base <input type="number" value={ac} className="short-input" onChange={(e) => setAc(e.currentTarget.value)} />
          </label>
        </div>
      )}
      {kind === "shield" && (
        <label className="small">
          Bonus alla CA <input type="number" value={ac} className="short-input" onChange={(e) => setAc(e.currentTarget.value)} />
        </label>
      )}
      <textarea rows={2} value={description} placeholder="Descrizione (facoltativa)" aria-label="Descrizione dell'oggetto" onChange={(e) => setDescription(e.currentTarget.value)} />
      <button className="btn" disabled={!name.trim()} onClick={submit}>
        Aggiungi oggetto
      </button>
    </div>
  );
}

function SpellForm({ onAdd }: { onAdd: (spell: Omit<SpellDef, "id">) => void }) {
  const casters = [...registry.classes.values()].filter((c) => c.spellcasting).sort((a, b) => a.name.localeCompare(b.name, "it"));
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [school, setSchool] = useState<SpellSchool>("evocation");
  const [castingTime, setCastingTime] = useState("1 azione");
  const [range, setRange] = useState("18 metri");
  const [components, setComponents] = useState("V, S");
  const [duration, setDuration] = useState("Istantanea");
  const [concentration, setConcentration] = useState(false);
  const [ritual, setRitual] = useState(false);
  const [lists, setLists] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [dice, setDice] = useState("");
  const [damageType, setDamageType] = useState("fire");
  const [resolve, setResolve] = useState<"" | "attack" | Ability>("");
  const submit = () => {
    const timing = /bonus/i.test(castingTime) ? "bonus" : /reazione/i.test(castingTime) ? "reaction" : /azione/i.test(castingTime) ? "action" : "special";
    onAdd({
      name: name.trim(),
      level,
      school,
      castingTime,
      timing,
      range,
      components,
      duration,
      lists,
      description: description.trim(),
      ...(concentration ? { concentration: true } : {}),
      ...(ritual ? { ritual: true } : {}),
      ...(resolve === "attack" ? { attack: "ranged" as const } : resolve ? { save: resolve } : {}),
      ...(dice.trim() ? { roll: { kind: "damage" as const, dice: dice.trim(), damageType } } : {}),
    });
    setName("");
    setDescription("");
  };
  return (
    <div className="homebrew-form">
      <div className="row">
        <input value={name} placeholder="Nome dell'incantesimo" aria-label="Nome dell'incantesimo" onChange={(e) => setName(e.currentTarget.value)} />
        <select value={level} aria-label="Livello" onChange={(e) => setLevel(Number(e.currentTarget.value))}>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={i}>
              {i === 0 ? "Trucchetto" : `${i}° livello`}
            </option>
          ))}
        </select>
        <select value={school} aria-label="Scuola" onChange={(e) => setSchool(e.currentTarget.value as SpellSchool)}>
          {Object.entries(SCHOOLS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <input value={castingTime} placeholder="Tempo di lancio" aria-label="Tempo di lancio" onChange={(e) => setCastingTime(e.currentTarget.value)} />
        <input value={range} placeholder="Gittata" aria-label="Gittata" onChange={(e) => setRange(e.currentTarget.value)} />
        <input value={components} placeholder="Componenti" aria-label="Componenti" onChange={(e) => setComponents(e.currentTarget.value)} />
        <input value={duration} placeholder="Durata" aria-label="Durata" onChange={(e) => setDuration(e.currentTarget.value)} />
        <label className="small">
          <input type="checkbox" checked={concentration} onChange={(e) => setConcentration(e.currentTarget.checked)} /> Concentrazione
        </label>
        <label className="small">
          <input type="checkbox" checked={ritual} onChange={(e) => setRitual(e.currentTarget.checked)} /> Rituale
        </label>
      </div>
      <div className="row">
        <span className="small">Chi può sceglierlo:</span>
        {casters.map((c) => (
          <label key={c.id} className="small">
            <input type="checkbox" checked={lists.includes(c.id)} onChange={(e) => setLists(e.currentTarget.checked ? [...lists, c.id] : lists.filter((x) => x !== c.id))} /> {c.name}
          </label>
        ))}
      </div>
      <div className="row">
        <select value={resolve} aria-label="Come si risolve" onChange={(e) => setResolve(e.currentTarget.value as typeof resolve)}>
          <option value="">Nessun tiro</option>
          <option value="attack">Tiro per colpire</option>
          {(Object.keys(ABILITY_NAMES) as Ability[]).map((a) => (
            <option key={a} value={a}>
              Tiro salvezza su {ABILITY_NAMES[a].name}
            </option>
          ))}
        </select>
        <input value={dice} placeholder="Danni, es. 3d6" aria-label="Dadi di danno" className="short-input" onChange={(e) => setDice(e.currentTarget.value)} />
        {dice.trim() && (
          <select value={damageType} aria-label="Tipo di danno" onChange={(e) => setDamageType(e.currentTarget.value)}>
            {Object.entries(DAMAGE_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        )}
      </div>
      <textarea rows={3} value={description} placeholder="Descrizione" aria-label="Descrizione dell'incantesimo" onChange={(e) => setDescription(e.currentTarget.value)} />
      <button className="btn" disabled={!name.trim() || lists.length === 0} onClick={submit}>
        Aggiungi incantesimo
      </button>
      {name.trim() && lists.length === 0 && <span className="muted small"> Scegli almeno una classe che può sceglierlo.</span>}
    </div>
  );
}

/** Contenuti propri della campagna: oggetti e incantesimi che il Master aggiunge a mano o importa da un file. */
export function HomebrewPanel({ campaignId, homebrew, isDm }: { campaignId: string; homebrew: Homebrew; isDm: boolean }) {
  const { push } = useLog();
  const [form, setForm] = useState<"" | "item" | "spell">("");
  const total = homebrew.items.length + homebrew.spells.length;
  const taken = new Set([...homebrew.items.map((i) => i.id), ...homebrew.spells.map((s) => s.id)]);
  const save = (next: Homebrew) => {
    if (next.items.length + next.spells.length > MAX_ENTRIES) {
      push({ title: "Troppi contenuti", lines: [`Una campagna regge fino a ${MAX_ENTRIES} voci tra oggetti e incantesimi.`], tone: "bad" });
      return;
    }
    repo.saveHomebrew(campaignId, next).catch((e) => push({ title: "Salvataggio non riuscito", lines: [String(e?.message ?? e)], tone: "bad" }));
  };
  const importFile = async (file: File) => {
    try {
      const { pack } = importCompendium(await file.text(), { id: "hb", name: file.name });
      const ids = new Set(taken);
      const withId = <T extends { id: string; name: string }>(x: T): T => {
        const id = newId(x.name, ids);
        ids.add(id);
        return { ...x, id };
      };
      const items = (pack.items ?? []).map(withId);
      const spells = (pack.spells ?? []).map(withId);
      if (!items.length && !spells.length) throw new Error("Nel file non ci sono oggetti né incantesimi.");
      save({ items: [...homebrew.items, ...items], spells: [...homebrew.spells, ...spells] });
      push({ title: "File importato", lines: [`${items.length} oggetti, ${spells.length} incantesimi`], tone: "good" });
    } catch (e) {
      push({ title: "Importazione non riuscita", lines: [e instanceof Error ? e.message : String(e)], tone: "bad" });
    }
  };
  if (!isDm && total === 0) return null;
  return (
    <section className="panel homebrew">
      <h2>Contenuti della campagna</h2>
      <p className="muted small">
        {isDm ? "Oggetti e incantesimi tuoi: compaiono nelle schede dei personaggi di questa campagna, accanto a quelli dei manuali." : "Oggetti e incantesimi aggiunti dal Master: li trovi nella tua scheda."}
      </p>
      {total === 0 && <p className="muted">Ancora nulla.</p>}
      <ul className="inv-list">
        {homebrew.items.map((i) => (
          <li key={i.id}>
            <span>
              {i.name} <span className="muted small">{KINDS[i.kind]}{i.kind === "weapon" ? `, ${i.damage} ${DAMAGE_TYPES[i.damageType]}` : i.kind === "armor" ? `, CA ${i.baseAC}` : ""}</span>
            </span>
            {isDm && (
              <button className="icon-btn" aria-label={`Elimina ${i.name}`} onClick={() => save({ ...homebrew, items: homebrew.items.filter((x) => x.id !== i.id) })}>
                ×
              </button>
            )}
          </li>
        ))}
        {homebrew.spells.map((s) => (
          <li key={s.id}>
            <span>
              {s.name} <span className="muted small">{s.level === 0 ? "trucchetto" : `incantesimo di ${s.level}°`}, {s.lists.map((l) => registry.classes.get(l)?.name ?? l).join(", ")}</span>
            </span>
            {isDm && (
              <button className="icon-btn" aria-label={`Elimina ${s.name}`} onClick={() => save({ ...homebrew, spells: homebrew.spells.filter((x) => x.id !== s.id) })}>
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      {isDm && (
        <>
          <div className="row">
            <button className={`btn ${form === "item" ? "btn-primary" : ""}`} aria-expanded={form === "item"} onClick={() => setForm(form === "item" ? "" : "item")}>
              Nuovo oggetto
            </button>
            <button className={`btn ${form === "spell" ? "btn-primary" : ""}`} aria-expanded={form === "spell"} onClick={() => setForm(form === "spell" ? "" : "spell")}>
              Nuovo incantesimo
            </button>
            <label className="btn">
              Importa un file XML
              <input
                type="file"
                accept=".xml,text/xml"
                className="sr-only"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0];
                  if (f) importFile(f);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>
          {form === "item" && <ItemForm onAdd={(item) => save({ ...homebrew, items: [...homebrew.items, { ...item, id: newId(item.name, taken) } as ItemDef] })} />}
          {form === "spell" && <SpellForm onAdd={(spell) => save({ ...homebrew, spells: [...homebrew.spells, { ...spell, id: newId(spell.name, taken) }] })} />}
        </>
      )}
    </section>
  );
}
