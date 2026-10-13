import { AUTOMATION_LABELS, type AutomationLevel } from "@dnd/engine";

const LEVELS: AutomationLevel[] = ["manual", "assisted", "full"];

/**
 * Selettore del livello di automazione.
 * `value` undefined = il personaggio eredita la preferenza dell'utente (`inherited`).
 */
export function AutomationSwitch({
  value,
  inherited,
  onChange,
  allowInherit = true,
}: {
  value: AutomationLevel | undefined;
  inherited: AutomationLevel;
  onChange: (v: AutomationLevel | undefined) => void;
  allowInherit?: boolean;
}) {
  const effective = value ?? inherited;
  return (
    <fieldset className="automation">
      <legend>Automazione</legend>
      <div className="segmented" role="radiogroup">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={effective === l}
            className={effective === l ? "is-on" : ""}
            onClick={() => onChange(l)}
            title={AUTOMATION_LABELS[l].description}
          >
            {AUTOMATION_LABELS[l].name}
          </button>
        ))}
      </div>
      <p className="muted small">
        {AUTOMATION_LABELS[effective].description}
        {allowInherit && value !== undefined && (
          <>
            {" "}
            <button className="link-btn" onClick={() => onChange(undefined)}>
              Usa la mia preferenza ({AUTOMATION_LABELS[inherited].name.toLowerCase()})
            </button>
          </>
        )}
      </p>
    </fieldset>
  );
}
