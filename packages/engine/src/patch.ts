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
