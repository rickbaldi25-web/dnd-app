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
});

/* File veri: solo sul computer che ha i manuali e le traduzioni. */

const root = resolve(import.meta.dirname, "../../..");
const xml = resolve(root, "manuali/Official Only.xml");
const dir = resolve(root, "packages/content-private/translations/it");

describe.skipIf(!existsSync(xml) || !existsSync(dir))("traduzioni dei manuali ufficiali", () => {
  it("ogni voce tradotta esiste e le classi sono in italiano fino al 3° livello", () => {
    const { pack } = importCompendium(readFileSync(xml, "utf8"), { id: "official-2014", name: "Manuali ufficiali 2014", ruleset: "2014" });
    const files = readdirSync(dir).filter((f) => f.endsWith(".txt"));
    const report = applyTranslations(
      pack,
      files.flatMap((f) => parseTranslations(readFileSync(resolve(dir, f), "utf8"), f)),
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
