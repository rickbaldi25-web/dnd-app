import type {
  BackgroundDef,
  ClassDef,
  ContentPack,
  FeatDef,
  ItemDef,
  SkillDef,
  SpeciesDef,
  SpellDef,
  SubclassDef,
} from "./types.js";

/**
 * Registro dei contenuti: unisce più pacchetti (SRD, homebrew di campagna,
 * homebrew personale). A parità di id vince l'ultimo pacchetto caricato,
 * così l'homebrew può sovrascrivere l'SRD.
 */
export interface Registry {
  packs: string[];
  classes: Map<string, ClassDef>;
  subclasses: Map<string, SubclassDef>;
  species: Map<string, SpeciesDef>;
  backgrounds: Map<string, BackgroundDef>;
  feats: Map<string, FeatDef>;
  items: Map<string, ItemDef>;
  skills: Map<string, SkillDef>;
  spells: Map<string, SpellDef>;
}

export function createRegistry(...packs: ContentPack[]): Registry {
  const r: Registry = {
    packs: [],
    classes: new Map(),
    subclasses: new Map(),
    species: new Map(),
    backgrounds: new Map(),
    feats: new Map(),
    items: new Map(),
    skills: new Map(),
    spells: new Map(),
  };
  for (const p of packs) {
    r.packs.push(p.id);
    for (const x of p.classes ?? []) r.classes.set(x.id, x);
    for (const x of p.subclasses ?? []) r.subclasses.set(x.id, x);
    for (const x of p.species ?? []) r.species.set(x.id, x);
    for (const x of p.backgrounds ?? []) r.backgrounds.set(x.id, x);
    for (const x of p.feats ?? []) r.feats.set(x.id, x);
    for (const x of p.items ?? []) r.items.set(x.id, x);
    for (const x of p.skills ?? []) r.skills.set(x.id, x);
    for (const x of p.spells ?? []) r.spells.set(x.id, x);
  }
  return r;
}

export function must<T>(map: Map<string, T>, id: string, what: string): T {
  const v = map.get(id);
  if (!v) throw new Error(`${what} non trovato: "${id}"`);
  return v;
}

export function featsByTag(r: Registry, tag: string): FeatDef[] {
  return [...r.feats.values()].filter((f) => f.category === tag || f.tags?.includes(tag));
}
