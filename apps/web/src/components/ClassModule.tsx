import { roll } from "@dnd/engine";
import { DAMAGE_TYPES, registry } from "../content";
import { useLog } from "../state/log";
import type { CharacterController } from "../state/useCharacter";
import { ActionRow, Panel, ResourcePips, ToggleSwitch } from "../widgets/core";

/**
 * Riquadro dedicato a ogni classe: raccoglie ciò che il motore calcola per quella classe (stati da attivare,
 * risorse, dadi con un nome, azioni, opzioni scelte) sotto il nome della sua meccanica principale.
 * Il titolo e la nota cambiano per classe; il contenuto viene dai dati, quindi vale anche per le sottoclassi.
 */
const MODULES: Record<string, { title: string; note?: string; accent: string }> = {
  barbarian: { title: "Ira", note: "Mentre sei in ira: vantaggio alle prove e ai TS di Forza, danni bonus in mischia con la Forza, resistenza ai danni contundenti, perforanti e taglienti.", accent: "blood" },
  bard: { title: "Ispirazione bardica", note: "Con un'azione bonus dai un dado a una creatura entro 18 metri che può sentirti.", accent: "gold" },
  cleric: { title: "Incanalare divinità", accent: "gold" },
  druid: { title: "Forma selvatica", accent: "verdigris" },
  fighter: { title: "Tecniche di combattimento", accent: "copper" },
  monk: { title: "Ki e arti marziali", accent: "copper" },
  paladin: { title: "Poteri sacri", accent: "gold" },
  ranger: { title: "Arti del ranger", accent: "verdigris" },
  rogue: { title: "Colpi del ladro", note: "Attacco furtivo: una volta per turno, con un'arma accurata o a distanza, se hai vantaggio o un alleato è entro 1,5 metri dal bersaglio.", accent: "copper" },
  sorcerer: { title: "Fonte della magia", accent: "blood" },
  warlock: { title: "Patto", accent: "copper" },
  wizard: { title: "Magia arcana", accent: "copper" },
  artificer: { title: "Ingegno dell'artefice", accent: "copper" },
};

type Sheet = CharacterController["sheet"];

/** Opzioni di classe scelte (suppliche, manovre, metamagie...), raggruppate per il privilegio che le concede. */
function chosenOptions(sheet: Sheet, classId: string) {
  const groups = new Map<string, string[]>();
  for (const f of sheet.features) {
    if (f.classId !== classId || f.kind !== "class") continue;
    const i = f.source.indexOf(": ");
    if (i < 0) continue;
    const group = f.source.slice(0, i);
    groups.set(group, [...(groups.get(group) ?? []), f.name]);
  }
  return [...groups];
}

export function ClassModule({ c, classId }: { c: CharacterController; classId: string }) {
  const { push } = useLog();
  const { sheet } = c;
  const cls = registry.classes.get(classId);
  const mod = MODULES[classId] ?? { title: cls?.name ?? classId, accent: "copper" };
  const mine = <T extends { classId?: string }>(list: T[]) => list.filter((x) => x.classId === classId);
  const toggles = mine(sheet.toggles);
  const resources = mine(sheet.resources);
  const dice = mine(sheet.dice);
  const actions = mine(sheet.actions).filter((a) => a.outcome?.kind !== "toggleOn" && a.outcome?.kind !== "toggleOff");
  const options = chosenOptions(sheet, classId);
  const pact = classId === "warlock" ? sheet.spellcasting?.pact : undefined;
  const martialArts = classId === "monk" ? dice.find((d) => /arti marziali|martial/i.test(d.name)) : undefined;
  const empty = !toggles.length && !resources.length && !dice.length && !actions.length && !options.length && !pact;
  if (empty) return null;

  const rollDice = (d: Sheet["dice"][number]) => {
    const r = roll(d.expr);
    push({ title: d.name, lines: d.damageType ? [DAMAGE_TYPES[d.damageType] ?? d.damageType] : [], rolls: [{ label: d.name, expr: d.expr, dice: r.rolls.map((x) => x.value), total: r.total }] });
  };

  return (
    <Panel className={`class-module accent-${mod.accent}`} title={mod.title} aside={<span className="muted small">{cls?.name} {sheet.classLevels[classId]}</span>}>
      {mod.note && <p className="muted small class-note">{mod.note}</p>}

      {(toggles.length > 0 || martialArts) && (
        <div className="module-row">
          {toggles.map((t) => (
            <div key={t.id} className={`module-toggle ${t.active ? "is-active" : ""}`}>
              <ToggleSwitch c={c} t={t} />
            </div>
          ))}
          {martialArts && (
            <button className="module-die" onClick={() => rollDice(martialArts)} title={martialArts.note}>
              <span className="module-die-value">{martialArts.expr}</span>
              <span className="muted small">{martialArts.name}</span>
            </button>
          )}
        </div>
      )}

      {resources.map((r) => {
        const recovery = r.shortRest ? "riposo breve o lungo" : "riposo lungo";
        return (
          <div key={r.id} className="module-resource">
            <div className="row between">
              <strong>{r.name}</strong>
              <span className="muted small">
                {r.remaining}/{r.max} · torna con {recovery}
              </span>
            </div>
            <ResourcePips c={c} r={r} />
          </div>
        );
      })}

      {pact && (
        <div className="module-resource">
          <div className="row between">
            <strong>Slot del patto ({pact.level}°)</strong>
            <span className="muted small">
              {pact.remaining}/{pact.max} · tornano con riposo breve
            </span>
          </div>
        </div>
      )}

      {dice.filter((d) => d !== martialArts).length > 0 && (
        <div className="module-dice">
          {dice
            .filter((d) => d !== martialArts)
            .map((d) => (
              <button key={d.id} className="module-die" onClick={() => rollDice(d)} title={d.note}>
                <span className="module-die-value">{d.expr}</span>
                <span className="muted small">{d.name}</span>
              </button>
            ))}
        </div>
      )}

      {actions.length > 0 && (
        <ul className="action-list">
          {actions.map((a) => (
            <ActionRow key={a.id} c={c} a={a} />
          ))}
        </ul>
      )}

      {options.map(([group, names]) => (
        <p key={group} className="module-options small">
          <strong>{group}:</strong> {names.join(", ")}
        </p>
      ))}
    </Panel>
  );
}
