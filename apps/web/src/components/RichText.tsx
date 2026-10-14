import { Fragment } from "react";

/** "**Titolo.** testo" → titoletto in grassetto. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>,
  );
}

/**
 * Testo delle regole: un paragrafo per riga, titoletti tra due asterischi doppi e righe che iniziano
 * con "•" o "-" come elenco puntato.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks: ({ list: string[] } | string)[] = [];
  for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const item = /^[•\-–]\s+(.*)$/.exec(line);
    const last = blocks.at(-1);
    if (item && typeof last === "object") last.list.push(item[1]!);
    else if (item) blocks.push({ list: [item[1]!] });
    else blocks.push(line);
  }
  return (
    <div className={`rich-text ${className ?? ""}`}>
      {blocks.map((b, i) =>
        typeof b === "string" ? (
          <p key={i}>{inline(b)}</p>
        ) : (
          <ul key={i}>
            {b.list.map((x, j) => (
              <li key={j}>{inline(x)}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
