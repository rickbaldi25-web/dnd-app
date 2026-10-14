/**
 * Traduzioni dei contenuti importati.
 *
 * I compendi sono in inglese: le traduzioni stanno in file di testo a parte e si
 * applicano dopo l'importazione, così rifare l'importazione non le perde.
 * Gli id non cambiano mai (derivano dal nome inglese): cambiano solo nomi e testi.
 *
 * Formato di un file:
 *
 *   Tutto ciò che precede la prima intestazione è un commento libero.
 *
 *   @@ feature barbarian.rage | Ira
 *   Testo italiano del privilegio, su quante righe serve.
 *
 *   @@ subclass barbarian.path-of-the-berserker | Cammino del Berserker
 *
 * L'intestazione è "@@ tipo id | Nome". Senza testo sotto, cambia solo il nome.
 *
 * Per i mostri il testo ha una forma sua: prima i dati ("campo: valore", campi in MONSTER_FIELDS),
 * poi le voci, ognuna introdotta dal nome inglese che sostituisce e seguita dal testo (se manca resta l'inglese):
 *
 *   @@ monster goblin | Goblin
 *   tipo: umanoide (goblinoide)
 *   sensi: scurovisione 18 m
 *   @ Nimble Escape | Fuga agile
 *   Il goblin può effettuare l'azione di Disimpegno o di Nascondersi come azione bonus in ognuno dei suoi turni.
 */
import type { ContentPack, Feature, MonsterDef, MonsterEntry } from "@dnd/engine";

export const TRANSLATION_KINDS = ["class", "subclass", "feature", "feat", "resource", "species", "background", "spell", "item", "monster"] as const;
export type TranslationKind = (typeof TRANSLATION_KINDS)[number];

export interface Translation {
  kind: TranslationKind;
  id: string;
  name: string;
  description?: string;
}

export interface TranslationReport {
  /** Voci applicate, per tipo. */
  applied: Partial<Record<TranslationKind, number>>;
  /** Voci il cui id non esiste nel pacchetto ("tipo id"): di solito un refuso. */
  missing: string[];
}

export function parseTranslations(text: string, file = "traduzioni"): Translation[] {
  const out: Translation[] = [];
  let current: Translation | undefined;
  let body: string[] = [];
  const close = () => {
    if (!current) return;
    const description = body.join("\n").trim();
    if (description) current.description = description;
    out.push(current);
    body = [];
  };
  text.split(/\r?\n/).forEach((line, i) => {
    if (!line.startsWith("@@")) {
      if (current) body.push(line.trimEnd());
      return;
    }
    close();
    const m = /^@@\s*(\S+)\s+(\S+)\s*\|\s*(.+?)\s*$/.exec(line);
    const kind = m?.[1] as TranslationKind | undefined;
    if (!m || !kind || !TRANSLATION_KINDS.includes(kind)) throw new Error(`${file}, riga ${i + 1}: intestazione non valida: ${line}`);
    current = { kind, id: m[2]!, name: m[3]! };
  });
  close();
  return out;
}

type Named = { name: string; nameEn?: string; description?: string };
type Labelled = { name?: string; label?: string };

function rename(target: Named, t: Translation) {
  target.nameEn ??= target.name;
  target.name = t.name;
  if (t.description) target.description = t.description;
}

/** Campi dei dati di un mostro che si possono tradurre, come si scrivono nel file. */
export const MONSTER_FIELDS = {
  taglia: "size",
  tipo: "type",
  allineamento: "alignment",
  ca: "acNote",
  velocità: "speed",
  sensi: "senses",
  linguaggi: "languages",
  resistenze: "resistances",
  immunità: "immunities",
  vulnerabilità: "vulnerabilities",
  "immunità condizioni": "conditionImmunities",
} as const satisfies Record<string, keyof MonsterDef>;

/** Applica a un mostro dati e voci tradotti; le voci si riconoscono dal nome inglese. */
function translateMonster(m: MonsterDef & { nameEn?: string }, t: Translation) {
  m.nameEn ??= m.name;
  m.name = t.name;
  const entries = (["traits", "actions", "reactions", "legendary"] as const).flatMap((k) => m[k] ?? []);
  const done = new Set<MonsterEntry>();
  let entry: MonsterEntry | undefined;
  let text: string[] = [];
  let inEntries = false;
  const close = () => {
    if (entry && text.length) entry.text = text.join("\n").trim();
    entry = undefined;
    text = [];
  };
  for (const line of (t.description ?? "").split("\n")) {
    const head = /^@\s*(.+?)\s*\|\s*(.+?)\s*$/.exec(line);
    if (head) {
      close();
      inEntries = true;
      entry = entries.find((e) => !done.has(e) && e.name === head[1]);
      if (entry) {
        done.add(entry);
        entry.name = head[2]!;
      }
      continue;
    }
    if (inEntries) {
      if (entry) text.push(line);
      continue;
    }
    const field = /^([^:]+):\s*(.*)$/.exec(line);
    const key = field && MONSTER_FIELDS[field[1]!.trim().toLowerCase() as keyof typeof MONSTER_FIELDS];
    if (key && field[2]) (m as unknown as Record<string, string>)[key] = field[2];
  }
  close();
}

/** In un incantesimo il paragrafo "**Ai livelli superiori.** ..." del testo tradotto va nel suo campo, come nell'originale. */
function splitHigherLevels(spell: Named & { higherLevels?: string }) {
  const m = /\n?\*\*Ai? livelli superiori\.\*\*\s*([\s\S]*)$/.exec(spell.description ?? "");
  if (!m) return;
  spell.description = spell.description!.slice(0, m.index).trim();
  spell.higherLevels = m[1]!.trim();
}

/** Risorse, azioni, scelte ed effetti che portavano il nome del privilegio lo seguono. */
function renameFeature(f: Feature, t: Translation) {
  const old = f.name;
  rename(f, t);
  const parts = [...(f.resources ?? []), ...(f.actions ?? []), ...(f.choices ?? []), ...(f.effects ?? []), ...(f.toggles ?? [])];
  for (const p of parts as Labelled[]) {
    if (p.name === old) p.name = t.name;
    if (p.label === old) p.label = t.name;
  }
}

/** Applica le traduzioni al pacchetto, modificandolo. */
export function applyTranslations(pack: ContentPack, translations: Translation[]): TranslationReport {
  const features = new Map<string, Feature[]>();
  const add = (f: Feature) => features.set(f.id, [...(features.get(f.id) ?? []), f]);
  for (const c of pack.classes ?? []) c.features.forEach(add);
  for (const s of pack.subclasses ?? []) s.features.forEach(add);
  for (const s of pack.species ?? []) s.features.forEach(add);
  for (const b of pack.backgrounds ?? []) b.features?.forEach(add);

  const byId = <T extends { id: string }>(list: T[] | undefined) => new Map((list ?? []).map((x) => [x.id, x]));
  const named: Partial<Record<TranslationKind, Map<string, Named>>> = {
    class: byId(pack.classes),
    subclass: byId(pack.subclasses),
    species: byId(pack.species),
    background: byId(pack.backgrounds),
    spell: byId(pack.spells),
    item: byId(pack.items),
  };
  const feats = byId(pack.feats);
  const monsters = byId(pack.monsters);
  const resources = new Map<string, { name: string }[]>();
  const allFeatures = [...[...features.values()].flat(), ...(pack.feats ?? []).map((f) => f.feature)];
  for (const f of allFeatures) for (const r of f.resources ?? []) resources.set(r.id, [...(resources.get(r.id) ?? []), r]);

  const report: TranslationReport = { applied: {}, missing: [] };
  for (const t of translations) {
    let found = true;
    if (t.kind === "feature") {
      const list = features.get(t.id);
      list?.forEach((f) => renameFeature(f, t));
      found = Boolean(list);
    } else if (t.kind === "feat") {
      const feat = feats.get(t.id);
      if (feat) {
        const nameEn = feat.name;
        renameFeature(feat.feature, t);
        rename(feat, { ...t, description: undefined });
        feat.nameEn = nameEn;
      }
      found = Boolean(feat);
    } else if (t.kind === "monster") {
      const monster = monsters.get(t.id);
      if (monster) translateMonster(monster, t);
      found = Boolean(monster);
    } else if (t.kind === "resource") {
      const list = resources.get(t.id);
      list?.forEach((r) => (r.name = t.name));
      found = Boolean(list);
    } else {
      const target = named[t.kind]?.get(t.id);
      if (target) rename(target, t);
      if (target && t.kind === "spell") splitHigherLevels(target as Named & { higherLevels?: string });
      found = Boolean(target);
    }
    if (found) report.applied[t.kind] = (report.applied[t.kind] ?? 0) + 1;
    else report.missing.push(`${t.kind} ${t.id}`);
  }
  return report;
}
