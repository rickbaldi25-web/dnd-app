import type { AdventureChapter, AdventureNote } from "../data/repository.ts";

/*
 * Firestore regge al massimo 1 MB per documento. Un capitolo si salva in un documento solo;
 * se da solo è più grande, si divide in parti ("Capitolo 4 (parte 2)") tenendo insieme note, PNG e incontri.
 */

/** Margine sotto il limite di Firestore, che conta anche nomi dei campi e struttura. */
export const DOC_LIMIT = 800_000;
const encoder = new TextEncoder();
export const byteSize = (x: unknown) => encoder.encode(JSON.stringify(x)).length;

/** Una nota sola più grande di un documento si accorcia, segnalandolo nel testo. */
function fitNote(n: AdventureNote, limit: number): AdventureNote {
  if (byteSize(n) <= limit) return n;
  return { ...n, text: `${n.text.slice(0, Math.floor(limit / 4))}\n\n[Testo accorciato: troppo lungo per essere salvato per intero.]` };
}

export function splitChapter(ch: AdventureChapter, limit = DOC_LIMIT): AdventureChapter[] {
  if (byteSize(ch) <= limit) return [ch];
  type Piece = { kind: "notes"; v: AdventureNote } | { kind: "npcs"; v: AdventureChapter["npcs"][number] } | { kind: "encounters"; v: AdventureChapter["encounters"][number] };
  const pieces: Piece[] = [
    ...ch.notes.map((v): Piece => ({ kind: "notes", v: fitNote(v, limit / 2) })),
    ...ch.npcs.map((v): Piece => ({ kind: "npcs", v })),
    ...ch.encounters.map((v): Piece => ({ kind: "encounters", v: { ...v, notes: v.notes.map((n) => fitNote(n, limit / 2)) } })),
  ];
  const parts: AdventureChapter[] = [];
  let current: AdventureChapter | null = null;
  let size = 0;
  for (const p of pieces) {
    const s = byteSize(p.v);
    if (!current || size + s > limit) {
      const n: number = parts.length + 1;
      current = { id: `${ch.id}-${n}`, order: ch.order + n / 100, name: `${ch.name} (parte ${n})`, notes: [], npcs: [], encounters: [] };
      parts.push(current);
      size = byteSize(current);
    }
    if (p.kind === "notes") current.notes.push(p.v);
    else if (p.kind === "npcs") current.npcs.push(p.v);
    else current.encounters.push(p.v);
    size += s;
  }
  return parts;
}
