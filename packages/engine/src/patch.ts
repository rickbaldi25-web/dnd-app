import type { CharacterData, CharacterState } from "./types.js";

/**
 * Una modifica proposta dal motore. In automazione "assisted" la UI la mostra
 * e chiede conferma; in "full" la applica subito; in "manual" non viene prodotta.
 * È serializzabile, così il Master può vederla nel log di sessione.
 */
export interface Proposal {
  title: string;
  lines: string[];
  rolls: { label: string; expr: string; dice: number[]; total: number }[];
  /** Nuovo stato completo dopo la modifica. */
  state: CharacterState;
  /** Eventuali altre parti del personaggio modificate (livelli, scelte...). */
  character?: Partial<CharacterData>;
  blocked?: string; // motivo per cui non si può applicare
}

export function applyProposal(ch: CharacterData, p: Proposal): CharacterData {
  if (p.blocked) throw new Error(p.blocked);
  return { ...ch, ...(p.character ?? {}), state: p.state };
}

export function cloneState(s: CharacterState): CharacterState {
  return structuredClone(s);
}

/* ------------------------------------------------------------------ */
/* Salvataggi a campi: solo ciò che è cambiato                         */
/* ------------------------------------------------------------------ */

/** Un campo cambiato tra due versioni di un documento. Senza value = campo rimosso. */
export interface FieldChange {
  path: string[];
  value?: unknown;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);

/**
 * Differenze tra due versioni, campo per campo. Gli oggetti si confrontano in profondità;
 * liste e valori semplici si sostituiscono interi. Serve a salvare solo ciò che si è toccato,
 * così due persone che modificano campi diversi dello stesso personaggio non si sovrascrivono.
 */
export function diffFields(prev: unknown, next: unknown, path: string[] = []): FieldChange[] {
  if (same(prev, next)) return [];
  if (!isRecord(prev) || !isRecord(next)) return next === undefined ? [{ path }] : [{ path, value: next }];
  const out: FieldChange[] = [];
  for (const key of new Set([...Object.keys(prev), ...Object.keys(next)])) out.push(...diffFields(prev[key], next[key], [...path, key]));
  return out;
}

/** Applica le differenze a un documento, senza modificare l'originale. */
export function applyFieldChanges<T>(doc: T, changes: FieldChange[]): T {
  const root = structuredClone(doc) as Record<string, unknown>;
  for (const c of changes) {
    if (c.path.length === 0) continue;
    let node = root;
    for (const key of c.path.slice(0, -1)) {
      if (!isRecord(node[key])) node[key] = {};
      node = node[key] as Record<string, unknown>;
    }
    const last = c.path.at(-1)!;
    if (c.value === undefined) delete node[last];
    else node[last] = c.value;
  }
  return root as T;
}
