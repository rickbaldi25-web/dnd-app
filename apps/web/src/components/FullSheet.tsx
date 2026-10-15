import {
  ABILITIES,
  applyDamage,
  applyHealing,
  formatMod,
  levelForXp,
  rollD20,
  setTempHp,
  type Ability,
} from "@dnd/engine";
import { useEffect, useState } from "react";
import {
  ABILITY_NAMES,
  CONDITIONS,
  DAMAGE_TYPES,
  SENSES,
  SPECIES_LABEL,
  TOOLS,
  ftToM,
  itemName,
  registry,
} from "../content";
import { useLog } from "../state/log";
import type { CharacterController } from "../state/useCharacter";
import {
  ActionRow,
  AttacksWidget,
  HitDiceWidget,
  InventoryWidget,
  NotesWidget,
  Panel,
  Purse,
  ResourcePips,
  StatNumber,
  ToggleSwitch,
  breakdown,
  useRoller,
} from "../widgets/core";
import { Picker, SlotRow, SpellTable } from "../widgets/spells";
import { ClassModule } from "./ClassModule";
import { RichText } from "./RichText";

/*
 * Scheda completa, sul modello del foglio ufficiale in italiano: due pagine.
 *  1. Personaggio: intestazione (identità, livello, CA, PF, Dadi Vita, TS contro morte), caratteristiche con
 *     tiri salvezza e abilità sotto ciascuna, competenze; a destra iniziativa e compagnia, armi, moduli di
 *     classe, privilegi di classe, tratti della specie e talenti.
 *  2. Incantesimi e storia: incantatore, slot, tabella degli incantesimi; aspetto, storia, lingue,
 *     equipaggiamento con sintonia, denari.
 * In combattimento CombatSheet usa gli stessi pezzi, ridotti a ciò che serve nel turno.
 */

type Page = "pg" | "storia";
const PAGE_KEY = "scheda.pagina";

/* ------------------------------------------------------------------ */
/* Nomi                                                                */
/* ------------------------------------------------------------------ */

const SIZES: Record<string, string> = {
  Tiny: "Minuscola",
  Small: "Piccola",
  Medium: "Media",
  Large: "Grande",
  Huge: "Enorme",
  Gargantuan: "Mastodontica",
};
const sizeName = (s?: string) =>
  s
    ? s
        .replace(
          /\b(Tiny|Small|Medium|Large|Huge|Gargantuan)\b/g,
          (m) => SIZES[m] ?? m,
        )
        .replace(/\bor\b/g, "o")
    : "—";

const SPEEDS: Record<string, string> = {
  fly: "volo",
  swim: "nuoto",
  climb: "scalata",
  burrow: "scavo",
};

const LANGUAGES: Record<string, string> = {
  common: "Comune",
  dwarvish: "Nanico",
  elvish: "Elfico",
  giant: "Gigante",
  gnomish: "Gnomesco",
  goblin: "Goblin",
  halfling: "Halfling",
  orc: "Orchesco",
  abyssal: "Abissale",
  celestial: "Celestiale",
  draconic: "Draconico",
  "deep-speech": "Lingua delle profondità",
  infernal: "Infernale",
  primordial: "Primordiale",
  sylvan: "Silvano",
  undercommon: "Sottocomune",
  thieves: "Gergo ladresco",
  "thieves-cant": "Gergo ladresco",
  druidic: "Druidico",
  aquan: "Aquan",
  auran: "Auran",
  ignan: "Ignan",
  terran: "Terran",
};
const capital = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
const languageName = (id: string) => LANGUAGES[id] ?? capital(id);

const WEAPON_GROUPS: Record<string, string> = {
  simple: "Armi semplici",
  martial: "Armi da guerra",
  firearms: "Armi da fuoco",
};
const weaponName = (id: string) =>
  WEAPON_GROUPS[id] ?? registry.items.get(id)?.name ?? capital(id);
const toolName = (id: string) =>
  registry.items.get(id)?.name ?? TOOLS[id] ?? capital(id);

/* ------------------------------------------------------------------ */
/* Intestazione                                                        */
/* ------------------------------------------------------------------ */

function Identity({ c }: { c: CharacterController }) {
  const { ch, sheet } = c;
  const classes = Object.entries(sheet.classLevels)
    .map(([cid, n]) => `${registry.classes.get(cid)?.name ?? cid} ${n}`)
    .join(" / ");
  const subs = Object.values(ch.subclasses)
    .map((s) => registry.subclasses.get(s)?.name ?? s)
    .join(" / ");
  const fields: [string, string][] = [
    ["Background", registry.backgrounds.get(ch.backgroundId)?.name ?? "—"],
    ["Classe", classes || "—"],
    [SPECIES_LABEL, registry.species.get(ch.speciesId)?.name ?? "—"],
    ["Sottoclasse", subs || "—"],
  ];
  return (
    <section className="fs-box fs-identity" aria-label="Identità">
      <dl>
        {fields.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function LevelBox({
  c,
  onLevelUp,
}: {
  c: CharacterController;
  onLevelUp: () => void;
}) {
  const ready =
    !c.milestone &&
    levelForXp(c.ch.xp ?? 0) > c.sheet.level &&
    c.sheet.level < 20;
  return (
    <section className="fs-box fs-level" aria-label="Livello">
      <span className="fs-label">Livello</span>
      <span className="fs-big">{c.sheet.level}</span>
      {!c.milestone && (
        <span className="fs-sub">
          {(c.ch.xp ?? 0).toLocaleString("it-IT")} PE
        </span>
      )}
      {ready && (
        <button className="btn btn-primary btn-small" onClick={onLevelUp}>
          Sali
        </button>
      )}
    </section>
  );
}

function ArmorClass({ c }: { c: CharacterController }) {
  const shield = c.ch.equipment.some(
    (e) => e.equipped && registry.items.get(e.itemId)?.kind === "shield",
  );
  return (
    <section className="fs-box fs-ac" aria-label="Classe Armatura">
      <span className="fs-label">CA</span>
      <span className="fs-big">
        <StatNumber c={c} path="ac" s={c.sheet.ac} />
      </span>
      <span className="fs-sub">{shield ? "con scudo" : "senza scudo"}</span>
    </section>
  );
}

function HitPoints({ c }: { c: CharacterController }) {
  const { ch, sheet } = c;
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const max = sheet.hpMax.value;
  const cur = ch.state.hpCurrent;
  const pct = max ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0;
  const n = Math.max(0, Math.floor(Number(amount) || 0));
  const done = () => setAmount("");
  return (
    <section className="fs-box fs-hp" aria-label="Punti ferita">
      <div className="fs-hp-numbers">
        <div>
          <span className="fs-label">Attuali</span>
          <span
            className={`fs-big hp-current ${cur === 0 ? "is-down" : pct <= 50 ? "is-bloodied" : ""}`}
          >
            {cur}
          </span>
        </div>
        <div>
          <span className="fs-label">Temp</span>
          <span className="fs-mid">{ch.state.hpTemp || "—"}</span>
        </div>
        <div>
          <span className="fs-label">Max</span>
          <span className="fs-mid">
            <StatNumber c={c} path="hp.max" s={sheet.hpMax} />
          </span>
        </div>
      </div>
      <div
        className="hp-bar"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={cur}
        aria-label="Punti ferita"
      >
        <div className="hp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="fs-hp-controls">
        <input
          className="hp-amount"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
          aria-label="Quantità"
        />
        <button
          className="btn btn-danger"
          disabled={!n}
          onClick={() => (
            c.act(
              applyDamage(ch, sheet, n, {
                type: type || undefined,
                typeLabel: DAMAGE_TYPES[type],
              }),
              { direct: true },
            ),
            done()
          )}
        >
          Danno
        </button>
        <button
          className="btn btn-heal"
          disabled={!n}
          onClick={() => (
            c.act(applyHealing(ch, sheet, n), { direct: true }),
            done()
          )}
        >
          Cura
        </button>
        <button
          className="btn"
          disabled={!n}
          onClick={() => (c.act(setTempHp(ch, n), { direct: true }), done())}
        >
          Temp
        </button>
        <select
          value={type}
          aria-label="Tipo di danno"
          onChange={(e) => setType(e.currentTarget.value)}
        >
          <option value="">tipo: qualsiasi</option>
          {Object.entries(DAMAGE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
              {sheet.resistances.includes(k)
                ? " (resistente)"
                : sheet.immunities.includes(k)
                  ? " (immune)"
                  : ""}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function HitDiceBox({ c }: { c: CharacterController }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="fs-box fs-hd" aria-label="Dadi Vita">
      <span className="fs-label">Dadi Vita</span>
      {c.sheet.hitDice.map((h) => (
        <span key={h.die} className="fs-mid">
          {h.total - h.spent}
          <span className="fs-sub">
            /{h.total} {h.die}
          </span>
        </span>
      ))}
      <button
        className="link-btn small"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Chiudi" : "Riposa"}
      </button>
      {open && (
        <div className="fs-popover">
          <HitDiceWidget c={c} w={{ widget: "hit-dice" }} />
        </div>
      )}
    </section>
  );
}

function DeathSaves({ c }: { c: CharacterController }) {
  const { push } = useLog();
  const s = c.ch.state;
  const set = (deathSaves: typeof s.deathSaves) =>
    c.update((ch) => ({ ...ch, state: { ...ch.state, deathSaves } }));
  const rollSave = () => {
    const r = rollD20(0);
    const ds = { ...s.deathSaves };
    if (r.nat20) {
      c.update((ch) => ({
        ...ch,
        state: {
          ...ch.state,
          hpCurrent: 1,
          deathSaves: { success: 0, failure: 0 },
          conditions: ch.state.conditions.filter((x) => x !== "unconscious"),
        },
      }));
      push({
        title: "TS contro morte",
        lines: ["20 naturale: torni a 1 PF!"],
        rolls: [{ label: "d20", expr: "1d20", dice: r.rolls, total: r.total }],
        tone: "good",
      });
      return;
    }
    let line: string;
    if (r.nat1) {
      ds.failure = Math.min(3, ds.failure + 2);
      line = "1 naturale: due fallimenti.";
    } else if (r.total >= 10) {
      ds.success = Math.min(3, ds.success + 1);
      line = ds.success === 3 ? "Stabilizzato." : "Successo.";
    } else {
      ds.failure = Math.min(3, ds.failure + 1);
      line = "Fallimento.";
    }
    if (ds.failure === 3) line = "Tre fallimenti: il personaggio muore.";
    set(ds);
    push({
      title: "TS contro morte",
      lines: [line],
      rolls: [{ label: "d20", expr: "1d20", dice: r.rolls, total: r.total }],
      tone: r.total >= 10 ? "good" : "bad",
    });
  };
  const marks = (kind: "success" | "failure") =>
    [0, 1, 2].map((i) => (
      <input
        key={i}
        type="checkbox"
        className={`diamond ${kind}`}
        checked={s.deathSaves[kind] > i}
        aria-label={`${kind === "success" ? "Successo" : "Fallimento"} ${i + 1}`}
        onChange={(e) =>
          set({ ...s.deathSaves, [kind]: e.currentTarget.checked ? i + 1 : i })
        }
      />
    ));
  return (
    <section
      className={`fs-box fs-death ${s.hpCurrent === 0 ? "is-dying" : ""}`}
      aria-label="Tiri salvezza contro morte"
    >
      <span className="fs-label">TS contro morte</span>
      <div className="fs-death-row">
        {marks("success")}
        <span className="fs-sub">successi</span>
      </div>
      <div className="fs-death-row">
        {marks("failure")}
        <span className="fs-sub">fallimenti</span>
      </div>
      {s.hpCurrent === 0 && (
        <button className="btn btn-small" onClick={rollSave}>
          Tira
        </button>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pagina 1: caratteristiche                                           */
/* ------------------------------------------------------------------ */

function AbilityBlock({ c, a }: { c: CharacterController; a: Ability }) {
  const roller = useRoller();
  const v = c.sheet.abilities[a];
  const save = c.sheet.saves[a];
  const skills = Object.entries(c.sheet.skills)
    .filter(([, s]) => s.ability === a)
    .sort(([, x], [, y]) => x.name.localeCompare(y.name, "it"));
  const name = ABILITY_NAMES[a].name;
  return (
    <section className="fs-ability" aria-label={name}>
      <h3>{name}</h3>
      <button
        className="fs-ability-score"
        onClick={() => roller(`Prova di ${name}`, v.mod)}
        title={breakdown(v.score)}
      >
        <span className="fs-ability-mod">{formatMod(v.mod)}</span>
        <span className="fs-ability-raw">{v.score.value}</span>
      </button>
      <ul className="check-list">
        <li className="fs-save">
          <button
            className="check-row"
            onClick={() =>
              roller(
                `TS su ${name}`,
                save.mod.value,
                save.advantage ? "advantage" : "normal",
              )
            }
          >
            <span
              className={`prof-dot ${save.proficient ? "is-prof" : ""}`}
              aria-label={save.proficient ? "Competente" : "Non competente"}
            />
            <span className="check-name">Tiro salvezza</span>
            {save.advantage && (
              <span className="adv" title="Vantaggio">
                V
              </span>
            )}
            <StatNumber c={c} path={`save.${a}`} s={save.mod} signed />
          </button>
        </li>
        {skills.map(([id, s]) => (
          <li key={id}>
            <button
              className="check-row"
              onClick={() =>
                roller(
                  s.name,
                  s.mod.value,
                  s.advantage ? "advantage" : "normal",
                )
              }
            >
              <span
                className={`prof-dot ${s.expertise ? "is-expert" : s.proficient ? "is-prof" : ""}`}
                aria-label={
                  s.expertise
                    ? "Maestria"
                    : s.proficient
                      ? "Competente"
                      : "Non competente"
                }
              />
              <span className="check-name">{s.name}</span>
              {s.advantage && (
                <span className="adv" title="Vantaggio">
                  V
                </span>
              )}
              <StatNumber c={c} path={`skill.${id}`} s={s.mod} signed />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Inspiration({ c }: { c: CharacterController }) {
  const on = c.ch.state.heroicInspiration;
  return (
    <section className={`fs-box fs-stat ${on ? "is-on" : ""}`}>
      <span className="fs-label">Ispirazione</span>
      <button
        className={`diamond-btn ${on ? "is-on" : ""}`}
        role="switch"
        aria-checked={on}
        aria-label="Ispirazione"
        onClick={() =>
          c.update((ch) => ({
            ...ch,
            state: { ...ch.state, heroicInspiration: !on },
          }))
        }
      />
    </section>
  );
}

function Training({ c }: { c: CharacterController }) {
  const p = c.sheet.proficiencies;
  const armor = new Set(p.armor);
  const all = armor.has("all") || armor.has("any");
  const kinds: [string, string][] = [
    ["light", "leggera"],
    ["medium", "media"],
    ["heavy", "pesante"],
    ["shield", "scudi"],
  ];
  return (
    <Panel title="Addestramento e competenze" className="fs-training">
      <p className="fs-armor" aria-label="Competenza nelle armature">
        {kinds.map(([k, label]) => {
          const has =
            all || armor.has(k) || (k === "shield" && armor.has("shields"));
          return (
            <span key={k} className={has ? "is-on" : ""}>
              <span className="diamond-mark" aria-hidden /> {label}
            </span>
          );
        })}
      </p>
      <dl className="fs-prof-list">
        <dt>Armi</dt>
        <dd>{p.weapons.length ? p.weapons.map(weaponName).join(", ") : "—"}</dd>
        <dt>Strumenti</dt>
        <dd>{p.tools.length ? p.tools.map(toolName).join(", ") : "—"}</dd>
      </dl>
    </Panel>
  );
}

/** In combattimento (`combat`) restano solo i valori che servono nel turno. */
function StatStrip({
  c,
  combat = false,
}: {
  c: CharacterController;
  combat?: boolean;
}) {
  const { sheet } = c;
  const roller = useRoller();
  const species = registry.species.get(c.ch.speciesId);
  const other = Object.entries(sheet.speeds).filter(
    ([m, v]) => m !== "walk" && v > 0,
  );
  return (
    <div className="fs-strip">
      {!combat && (
        <section className="fs-box fs-stat">
          <span className="fs-label">Bonus di competenza</span>
          <span className="fs-mid">{formatMod(sheet.proficiencyBonus)}</span>
        </section>
      )}
      <Inspiration c={c} />
      <section className="fs-box fs-stat">
        <span className="fs-label">Iniziativa</span>
        <button
          className="roll-btn fs-mid"
          onClick={() =>
            roller(
              "Iniziativa",
              sheet.initiative.value,
              sheet.initiative.advantage ? "advantage" : "normal",
            )
          }
        >
          <StatNumber c={c} path="initiative" s={sheet.initiative} signed />
          {sheet.initiative.advantage && (
            <span className="adv" title="Vantaggio">
              V
            </span>
          )}
        </button>
      </section>
      <section className="fs-box fs-stat" title={breakdown(sheet.speed)}>
        <span className="fs-label">Velocità</span>
        <span className="fs-mid">{ftToM(sheet.speed.value)}</span>
        {other.length > 0 && (
          <span className="fs-sub">
            {other.map(([m, v]) => `${SPEEDS[m] ?? m} ${ftToM(v)}`).join(", ")}
          </span>
        )}
      </section>
      {!combat && (
        <section className="fs-box fs-stat">
          <span className="fs-label">Taglia</span>
          <span className="fs-mid fs-text">{sizeName(species?.size)}</span>
        </section>
      )}
      <section className="fs-box fs-stat">
        <span className="fs-label">Percezione passiva</span>
        <span className="fs-mid">{sheet.passivePerception}</span>
      </section>
      {(sheet.senses.length > 0 ||
        sheet.resistances.length > 0 ||
        sheet.immunities.length > 0 ||
        sheet.critRange < 20) && (
        <p className="fs-traits small">
          {sheet.senses.map((s) => (
            <span key={s.sense}>
              {SENSES[s.sense] ?? s.sense} {ftToM(s.range)}
            </span>
          ))}
          {sheet.resistances.length > 0 && (
            <span>
              Resistenze:{" "}
              {sheet.resistances.map((r) => DAMAGE_TYPES[r] ?? r).join(", ")}
            </span>
          )}
          {sheet.immunities.length > 0 && (
            <span>
              Immunità:{" "}
              {sheet.immunities.map((r) => DAMAGE_TYPES[r] ?? r).join(", ")}
            </span>
          )}
          {sheet.critRange < 20 && (
            <span>Critico con {sheet.critRange}–20</span>
          )}
          {sheet.attacksPerAction > 1 && (
            <span>{sheet.attacksPerAction} attacchi per azione</span>
          )}
        </p>
      )}
    </div>
  );
}

function FeatureBox({
  title,
  list,
  className = "",
  empty,
}: {
  title: string;
  list: CharacterController["sheet"]["features"];
  className?: string;
  empty: string;
}) {
  return (
    <Panel title={title} className={`fs-features ${className}`}>
      {list.length === 0 && <p className="muted small">{empty}</p>}
      <div className="feature-list">
        {list.map((f) => (
          <details key={`${f.source}-${f.id}`}>
            <summary>
              <span>{f.name}</span>{" "}
              <span className="muted small">{f.source}</span>
            </summary>
            {f.description && <RichText text={f.description} />}
          </details>
        ))}
      </div>
    </Panel>
  );
}

/** Risorse, stati e azioni che non vengono da una classe (specie, talenti, oggetti). */
function OtherActions({ c }: { c: CharacterController }) {
  const { sheet } = c;
  const toggles = sheet.toggles.filter((t) => !t.classId);
  const resources = sheet.resources.filter((r) => !r.classId);
  const actions = sheet.actions.filter(
    (a) =>
      !a.classId &&
      a.outcome?.kind !== "toggleOn" &&
      a.outcome?.kind !== "toggleOff",
  );
  if (!toggles.length && !resources.length && !actions.length) return null;
  return (
    <Panel title="Altre risorse e azioni" className="actions-panel">
      {toggles.length > 0 && (
        <div className="module-row">
          {toggles.map((t) => (
            <div
              key={t.id}
              className={`module-toggle ${t.active ? "is-active" : ""}`}
            >
              <ToggleSwitch c={c} t={t} />
            </div>
          ))}
        </div>
      )}
      {resources.map((r) => (
        <div key={r.id} className="module-resource">
          <div className="row between">
            <strong>{r.name}</strong>
            <span className="muted small">
              {r.remaining}/{r.max} · torna con{" "}
              {r.shortRest ? "riposo breve o lungo" : "riposo lungo"}
            </span>
          </div>
          <ResourcePips c={c} r={r} />
        </div>
      ))}
      {actions.length > 0 && (
        <ul className="action-list">
          {actions.map((a) => (
            <ActionRow key={a.id} c={c} a={a} />
          ))}
        </ul>
      )}
    </Panel>
  );
}

/** Condizioni in forma compatta: le attive come etichette da togliere, un menu per aggiungerne, l'indebolimento. */
function Conditions({ c }: { c: CharacterController }) {
  const { conditions, exhaustion, conditionRounds = {} } = c.ch.state;
  const toggle = (k: string) =>
    c.update((ch) => {
      const { [k]: _gone, ...rounds } = ch.state.conditionRounds ?? {};
      return {
        ...ch,
        state: {
          ...ch.state,
          conditions: conditions.includes(k)
            ? conditions.filter((x) => x !== k)
            : [...conditions, k],
          conditionRounds: rounds,
        },
      };
    });
  const setExh = (n: number) =>
    c.update((ch) => ({
      ...ch,
      state: { ...ch.state, exhaustion: Math.max(0, Math.min(6, n)) },
    }));
  const free = Object.entries(CONDITIONS).filter(
    ([k]) => !conditions.includes(k),
  );
  return (
    <Panel title="Condizioni" className="fs-conditions">
      <div className="fs-cond-row">
        {conditions.map((k) => (
          <button
            key={k}
            className="chip is-on"
            onClick={() => toggle(k)}
            aria-label={`Togli ${CONDITIONS[k] ?? k}`}
          >
            {CONDITIONS[k] ?? k}
            {conditionRounds[k] ? ` (${conditionRounds[k]})` : ""} ×
          </button>
        ))}
        {conditions.length === 0 && (
          <span className="muted small">Nessuna</span>
        )}
        <select
          value=""
          aria-label="Aggiungi una condizione"
          onChange={(e) =>
            e.currentTarget.value && toggle(e.currentTarget.value)
          }
        >
          <option value="">+ aggiungi</option>
          {free.map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="stepper">
        <span>Indebolimento</span>
        <button
          className="icon-btn"
          onClick={() => setExh(exhaustion - 1)}
          aria-label="Riduci indebolimento"
          disabled={exhaustion === 0}
        >
          −
        </button>
        <strong aria-live="polite">{exhaustion}</strong>
        <button
          className="icon-btn"
          onClick={() => setExh(exhaustion + 1)}
          aria-label="Aumenta indebolimento"
          disabled={exhaustion === 6}
        >
          +
        </button>
        {exhaustion > 0 && (
          <span className="muted small">
            {exhaustion === 6 ? "Morte" : `livello ${exhaustion}`}
          </span>
        )}
      </div>
    </Panel>
  );
}

function PageCharacter({ c }: { c: CharacterController }) {
  const f = c.sheet.features;
  // Le opzioni scelte (suppliche, manovre...) stanno già nei moduli di classe: qui solo i privilegi veri.
  const classFeatures = f.filter(
    (x) => x.kind === "class" && !x.source.includes(": "),
  );
  const speciesTraits = f.filter((x) => x.kind === "species");
  const feats = f.filter(
    (x) => x.kind === "feat" || x.kind === "background" || x.kind === "custom",
  );
  return (
    <div className="fs-page fs-page-1">
      <StatStrip c={c} />
      <div className="fs-abilities">
        {ABILITIES.map((a) => (
          <AbilityBlock key={a} c={c} a={a} />
        ))}
      </div>
      <div className="fs-columns">
        <div className="fs-left">
          {Object.keys(c.sheet.classLevels).map((id) => (
            <ClassModule key={id} c={c} classId={id} />
          ))}
          <OtherActions c={c} />
          <Conditions c={c} />
          <Training c={c} />
        </div>
        <div className="fs-main">
          <AttacksWidget c={c} w={{ widget: "attacks" }} />
          <FeatureBox
            title="Privilegi di classe"
            list={classFeatures}
            className="fs-class-features"
            empty="Nessun privilegio di classe."
          />
          <div className="fs-pair">
            <FeatureBox
              title={`Tratti della ${SPECIES_LABEL.toLowerCase()}`}
              list={speciesTraits}
              empty="Nessun tratto."
            />
            <FeatureBox
              title="Talenti e background"
              list={feats}
              empty="Nessun talento."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagina 2: incantesimi e storia                                      */
/* ------------------------------------------------------------------ */

function Spellcasting({ c }: { c: CharacterController }) {
  const sc = c.sheet.spellcasting;
  const [picking, setPicking] = useState<string | null>(null);
  if (!sc) {
    return (
      <Panel title="Incantesimi" className="fs-spells">
        <p className="muted">Questo personaggio non lancia incantesimi.</p>
      </Panel>
    );
  }
  return (
    <Panel title="Trucchetti e incantesimi preparati" className="fs-spells">
      <div className="fs-spell-top">
        <div className="fs-casters">
          {sc.sources.map((s) => {
            const missing =
              s.cantrips.length < s.cantripsMax ||
              s.prepared.length < s.preparedMax;
            const open = picking === s.id;
            return (
              <div key={s.id} className="fs-caster">
                <dl className="fs-caster-stats">
                  <div>
                    <dt>Classe</dt>
                    <dd>{s.name}</dd>
                  </div>
                  <div>
                    <dt>Caratteristica</dt>
                    <dd>{ABILITY_NAMES[s.ability].name}</dd>
                  </div>
                  <div>
                    <dt>Modificatore</dt>
                    <dd>{formatMod(c.sheet.abilities[s.ability].mod)}</dd>
                  </div>
                  <div>
                    <dt>CD tiro salvezza</dt>
                    <dd>
                      <span title={breakdown(s.saveDC)}>{s.saveDC.value}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>Bonus di attacco</dt>
                    <dd>
                      <span title={breakdown(s.attackBonus)}>
                        {formatMod(s.attackBonus.value)}
                      </span>
                    </dd>
                  </div>
                </dl>
                <button
                  className={`btn ${missing && !open ? "btn-primary" : ""}`}
                  aria-expanded={open}
                  onClick={() => setPicking(open ? null : s.id)}
                >
                  {open
                    ? "Chiudi"
                    : missing
                      ? "Scegli incantesimi"
                      : "Cambia incantesimi"}
                </button>
                {open && <Picker c={c} s={s} />}
              </div>
            );
          })}
        </div>
        {(sc.slots.length > 0 || sc.pact) && (
          <div className="fs-slots" aria-label="Slot incantesimo">
            {sc.slots.map((p) => (
              <SlotRow
                key={p.level}
                c={c}
                pool={p}
                label={`Livello ${p.level}`}
                target={p.level}
              />
            ))}
            {sc.pact && (
              <SlotRow
                c={c}
                pool={sc.pact}
                label={`Patto (${sc.pact.level}°)`}
                target="pact"
              />
            )}
          </div>
        )}
      </div>

      {sc.concentration && (
        <p className="concentration">
          Concentrazione su <strong>{sc.concentration.name}</strong>
        </p>
      )}

      <SpellTable c={c} several={sc.sources.length > 1} />
    </Panel>
  );
}

/** Campo di testo della scheda che si salva quando si esce. */
function TextField({
  c,
  field,
  label,
  rows,
  placeholder,
}: {
  c: CharacterController;
  field: "appearance" | "backstory" | "alignment";
  label: string;
  rows?: number;
  placeholder?: string;
}) {
  const saved = c.ch[field] ?? "";
  const [text, setText] = useState(saved);
  useEffect(() => setText(saved), [saved]);
  const commit = () =>
    text !== saved && c.update((ch) => ({ ...ch, [field]: text }));
  return rows ? (
    <textarea
      className="notes"
      rows={rows}
      value={text}
      aria-label={label}
      placeholder={placeholder}
      onChange={(e) => setText(e.currentTarget.value)}
      onBlur={commit}
    />
  ) : (
    <input
      type="text"
      value={text}
      aria-label={label}
      placeholder={placeholder}
      onChange={(e) => setText(e.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
    />
  );
}

function Attunement({ c }: { c: CharacterController }) {
  const magic = c.ch.equipment
    .map((e, i) => ({ e, i, item: registry.items.get(e.itemId) }))
    .filter((x) => x.item && "attunement" in x.item && x.item.attunement);
  const attuned = c.ch.equipment.filter((e) => e.attuned).length;
  if (!magic.length)
    return <p className="muted small">Nessun oggetto che richiede sintonia.</p>;
  return (
    <ul className="fs-attune">
      {magic.map(({ e, i }) => (
        <li key={`${e.itemId}-${i}`}>
          <label>
            <input
              type="checkbox"
              className="diamond"
              checked={!!e.attuned}
              disabled={!e.attuned && attuned >= 3}
              onChange={(ev) =>
                c.update((ch) => {
                  const equipment = [...ch.equipment];
                  equipment[i] = {
                    ...equipment[i]!,
                    attuned: ev.currentTarget.checked,
                  };
                  return { ...ch, equipment };
                })
              }
            />{" "}
            {itemName(e.itemId)}
          </label>
        </li>
      ))}
      <li className="muted small">{attuned}/3 in sintonia</li>
    </ul>
  );
}

/** Le lingue calcolate dal motore; se mancano (spesso sono solo descritte), il testo dei tratti «Linguaggi». */
function Languages({ c }: { c: CharacterController }) {
  const known = c.sheet.proficiencies.languages;
  if (known.length) return <p>{known.map(languageName).join(", ")}</p>;
  const traits = c.sheet.features.filter(
    (f) =>
      f.description && /^(linguaggi|lingue|languages)$/i.test(f.name.trim()),
  );
  if (!traits.length) return <p className="muted">—</p>;
  return (
    <>
      {traits.map((f) => (
        <div key={`${f.source}-${f.id}`} className="small">
          <RichText text={f.description!} />
          <p className="muted small">{f.source}</p>
        </div>
      ))}
    </>
  );
}

function PageStory({ c }: { c: CharacterController }) {
  const gear = (
    <>
      <InventoryWidget
        c={c}
        w={{
          widget: "inventory",
          props: { title: "Equipaggiamento", purse: false },
        }}
      />
      <div className="fs-stack">
        <Panel title="Denari" className="fs-coins">
          <Purse c={c} w={{ widget: "inventory" }} />
        </Panel>
        <Panel title="Sintonia con un oggetto magico" className="fs-attune-box">
          <Attunement c={c} />
        </Panel>
      </div>
    </>
  );
  const caster = !!c.sheet.spellcasting;
  return (
    <div className="fs-page fs-page-2">
      {caster && <Spellcasting c={c} />}
      <div className="fs-row-3">
        <Panel title="Aspetto" className="fs-text-box">
          <TextField
            c={c}
            field="appearance"
            label="Aspetto"
            rows={4}
            placeholder="Età, altezza, occhi, capelli, segni particolari…"
          />
        </Panel>
        <Panel title="Storia e tratti caratteriali" className="fs-text-box">
          <TextField
            c={c}
            field="backstory"
            label="Storia e tratti caratteriali"
            rows={7}
            placeholder="Da dove vieni, tratti, ideali, legami, difetti…"
          />
          <label className="fs-inline">
            <span className="fs-label">Allineamento</span>
            <TextField
              c={c}
              field="alignment"
              label="Allineamento"
              placeholder="es. Neutrale buono"
            />
          </label>
        </Panel>
        <Panel title="Lingue" className="fs-languages">
          <Languages c={c} />
        </Panel>
      </div>
      <div className="fs-row-gear">{gear}</div>
      <NotesWidget c={c} w={{ widget: "notes" }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scheda completa                                                     */
/* ------------------------------------------------------------------ */

export function FullSheet({
  c,
  onLevelUp,
}: {
  c: CharacterController;
  onLevelUp: () => void;
}) {
  const [page, setPage] = useState<Page>(() => {
    try {
      return (localStorage.getItem(PAGE_KEY) as Page) === "storia"
        ? "storia"
        : "pg";
    } catch {
      return "pg";
    }
  });
  const go = (p: Page) => {
    setPage(p);
    try {
      localStorage.setItem(PAGE_KEY, p);
    } catch {
      /* senza memoria del browser la pagina riparte dalla prima */
    }
  };
  const caster = !!c.sheet.spellcasting;
  return (
    <div className="full-sheet">
      <div className="fs-head">
        <Identity c={c} />
        <LevelBox c={c} onLevelUp={onLevelUp} />
        <ArmorClass c={c} />
        <HitPoints c={c} />
        <HitDiceBox c={c} />
        <DeathSaves c={c} />
      </div>
      <nav className="fs-tabs" role="tablist" aria-label="Pagine della scheda">
        <button
          role="tab"
          aria-selected={page === "pg"}
          className={page === "pg" ? "is-on" : ""}
          onClick={() => go("pg")}
        >
          Personaggio
        </button>
        <button
          role="tab"
          aria-selected={page === "storia"}
          className={page === "storia" ? "is-on" : ""}
          onClick={() => go("storia")}
        >
          {caster ? "Incantesimi e storia" : "Storia ed equipaggiamento"}
        </button>
      </nav>
      {page === "pg" ? <PageCharacter c={c} /> : <PageStory c={c} />}
    </div>
  );
}

/** Tiri salvezza in una riga di sei pulsanti, per la vista di combattimento. */
function SavesRow({ c }: { c: CharacterController }) {
  const roller = useRoller();
  return (
    <Panel title="Tiri salvezza" className="fs-saves">
      <div className="fs-saves-grid">
        {ABILITIES.map((a) => {
          const save = c.sheet.saves[a];
          const name = ABILITY_NAMES[a].name;
          return (
            <button
              key={a}
              className={`fs-save-btn ${save.proficient ? "is-prof" : ""}`}
              onClick={() =>
                roller(
                  `TS su ${name}`,
                  save.mod.value,
                  save.advantage ? "advantage" : "normal",
                )
              }
              title={save.proficient ? "Competente" : undefined}
            >
              <span className="fs-label">{ABILITY_NAMES[a].short}</span>
              <span className="fs-mid">{formatMod(save.mod.value)}</span>
              {save.advantage && (
                <span className="adv" title="Vantaggio">
                  V
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

/**
 * Vista di combattimento: gli stessi pezzi della scheda completa, solo quelli del turno.
 * In alto CA, PF e TS contro morte; a sinistra i moduli di classe, le condizioni e i TS; a destra, larga,
 * attacchi e incantesimi.
 */
export function CombatSheet({ c }: { c: CharacterController }) {
  return (
    <div className="full-sheet fs-combat">
      <div className="fs-combat-head">
        <ArmorClass c={c} />
        <HitPoints c={c} />
        <DeathSaves c={c} />
      </div>
      <StatStrip c={c} combat />
      <div className="fs-columns fs-combat-cols">
        <div className="fs-left">
          {Object.keys(c.sheet.classLevels).map((id) => (
            <ClassModule key={id} c={c} classId={id} />
          ))}
          <OtherActions c={c} />
          <Conditions c={c} />
          <SavesRow c={c} />
        </div>
        <div className="fs-main">
          <AttacksWidget c={c} w={{ widget: "attacks" }} />
          {c.sheet.spellcasting && <Spellcasting c={c} />}
        </div>
      </div>
    </div>
  );
}
