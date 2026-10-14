import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ContentPack } from "@dnd/engine";
import { describe, expect, it } from "vitest";
import { applyTranslations, importCompendium, parseTranslations } from "../src/index.ts";

const pack = (): ContentPack => ({
  id: "t",
  name: "t",
  classes: [
    {
      id: "knight",
      name: "Knight",
      hitDie: "d10",
      primaryAbility: ["str"],
      proficiencies: {},
      multiclassProficiencies: {},
      skillChoice: { count: 0, from: [] },
      subclassLevel: 3,
      features: [
        {
          id: "knight.rally",
          name: "Rally",
          level: 1,
          description: "Heal yourself.",
          resources: [
            { id: "knight.rally", name: "Rally", max: 1 },
            { id: "knight.grit", name: "Grit", max: 2 },
          ],
          choices: [{ id: "knight.rally", kind: "feat", label: "Rally", count: 1, from: { tag: "opt:knight.rally" } }],
        },
      ],
    },
  ],
  subclasses: [{ id: "knight.order-of-steel", classId: "knight", name: "Order of Steel", description: "You train.", features: [] }],
  feats: [{ id: "knight.rally.guard", name: "Guard", category: "option", feature: { id: "knight.rally.guard", name: "Rally: Guard", description: "You guard." } }],
});

const TEXT = `Commento iniziale, ignorato.

@@ class knight | Cavaliere
@@ feature knight.rally | Riscossa
Ti curi.

Seconda riga.
@@ resource knight.grit | Grinta
@@ subclass knight.order-of-steel | Ordine dell'Acciaio
@@ feat knight.rally.guard | Guardia
Fai la guardia.
@@ feature knight.nope | Niente
`;

describe("traduzioni", () => {
  it("legge intestazioni, nomi e testi", () => {
    const list = parseTranslations(TEXT);
    expect(list).toHaveLength(6);
    expect(list[1]).toEqual({ kind: "feature", id: "knight.rally", name: "Riscossa", description: "Ti curi.\n\nSeconda riga." });
    expect(list[0]!.description).toBeUndefined();
    expect(() => parseTranslations("@@ boh x | Y")).toThrow(/riga 1/);
  });

  it("cambia nomi e testi, conserva il nome inglese e segnala gli id sconosciuti", () => {
    const p = pack();
    const report = applyTranslations(p, parseTranslations(TEXT));
    const cls = p.classes![0]!;
    const rally = cls.features[0]!;
    expect([cls.name, cls.nameEn]).toEqual(["Cavaliere", "Knight"]);
    expect([rally.name, rally.nameEn, rally.description]).toEqual(["Riscossa", "Rally", "Ti curi.\n\nSeconda riga."]);
    // La risorsa e la scelta con il nome del privilegio lo seguono; l'altra risorsa ha la sua voce.
    expect(rally.resources!.map((r) => r.name)).toEqual(["Riscossa", "Grinta"]);
    expect(rally.choices![0]!.label).toBe("Riscossa");
    // Solo il nome: il testo della sottoclasse resta quello di prima.
    expect(p.subclasses![0]).toMatchObject({ name: "Ordine dell'Acciaio", nameEn: "Order of Steel", description: "You train." });
    const guard = p.feats![0]!;
    expect([guard.name, guard.nameEn, guard.feature.name, guard.feature.description]).toEqual(["Guardia", "Guard", "Guardia", "Fai la guardia."]);
    expect(report.applied).toEqual({ class: 1, feature: 1, resource: 1, subclass: 1, feat: 1 });
    expect(report.missing).toEqual(["feature knight.nope"]);
  });

  it("negli incantesimi separa il paragrafo dei livelli superiori", () => {
    const p: ContentPack = { id: "t", name: "t", spells: [{ id: "zap", name: "Zap", level: 1, school: "evocation", castingTime: "1 action", range: "60 feet", components: "V", duration: "Instantaneous", lists: [], description: "Zap.", higherLevels: "More zap." }] };
    applyTranslations(p, parseTranslations("@@ spell zap | Scossa\nGittata: 18 metri\nDurata: Istantanea\nUna scossa.\n**Ai livelli superiori.** Più scossa."));
    expect(p.spells![0]).toMatchObject({ name: "Scossa", nameEn: "Zap", range: "18 metri", duration: "Istantanea", description: "Una scossa.", higherLevels: "Più scossa." });
  });

  it("nei mostri traduce i dati e le voci riconosciute dal nome inglese", () => {
    const p: ContentPack = {
      id: "t",
      name: "t",
      monsters: [
        {
          id: "goblin",
          name: "Goblin",
          size: "Small",
          type: "humanoid",
          ac: 15,
          hp: 7,
          speed: "30 ft.",
          abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
          cr: "1/4",
          traits: [{ name: "Nimble Escape", text: "Disengage or Hide." }],
          actions: [
            { name: "Scimitar", text: "Melee.", attack: { bonus: 4, damage: "1d6+2" } },
            { name: "Shortbow", text: "Ranged." },
          ],
        },
      ],
    };
    const text = "@@ monster goblin | Goblin\ntaglia: Piccolo\nvelocità: 9 m\n@ Scimitar | Scimitarra\nMischia.\n@ Nimble Escape | Fuga agile\n@ Missing | Niente\nIgnorato.";
    expect(applyTranslations(p, parseTranslations(text)).missing).toEqual([]);
    const m = p.monsters![0]!;
    expect([m.size, m.type, m.speed]).toEqual(["Piccolo", "humanoid", "9 m"]);
    // Voce con il testo, voce con il solo nome, voce non tradotta: l'attacco pronto resta.
    expect(m.actions[0]).toEqual({ name: "Scimitarra", text: "Mischia.", attack: { bonus: 4, damage: "1d6+2" } });
    expect(m.traits[0]).toEqual({ name: "Fuga agile", text: "Disengage or Hide." });
    expect(m.actions[1]!.name).toBe("Shortbow");
  });
});

/* File veri: solo sul computer che ha i manuali e le traduzioni. */

const root = resolve(import.meta.dirname, "../../..");
const xml = resolve(root, "manuali/Official Only.xml");
const dir = resolve(root, "packages/content-private/translations/it");

describe.skipIf(!existsSync(xml) || !existsSync(dir))("traduzioni dei manuali ufficiali", () => {
  it("ogni voce tradotta esiste e le classi sono in italiano fino al 3° livello", () => {
    const { pack } = importCompendium(readFileSync(xml, "utf8"), { id: "official-2014", name: "Manuali ufficiali 2014", ruleset: "2014" });
    // Come lo script di importazione: prima le voci ricavate dall'SRD, poi quelle scritte a mano.
    const files = [resolve(dir, "../it-srd"), dir].flatMap((d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".txt")).map((f) => resolve(d, f)) : []));
    const report = applyTranslations(
      pack,
      files.flatMap((f) => parseTranslations(readFileSync(f, "utf8"), f)),
    );
    expect(report.missing).toEqual([]);
    const untranslated = pack.classes!.flatMap((c) => [
      ...(c.nameEn ? [] : [c.id]),
      ...c.features.filter((f) => (f.level ?? 1) <= 3 && !f.nameEn && !f.id.endsWith(".optional")).map((f) => f.id),
    ]);
    expect(untranslated).toEqual([]);
    expect(pack.subclasses!.filter((s) => !s.nameEn)).toEqual([]);
  });
});
