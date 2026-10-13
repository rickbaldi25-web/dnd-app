/**
 * Importa un compendio XML e scrive il pacchetto in packages/content-private/generated/.
 * Quella cartella è esclusa da git: i contenuti non liberi non entrano nel repository.
 *
 *   node packages/importer/scripts/import.mjs "manuali/Official Only.xml" official-2014 "Manuali ufficiali 2014"
 *
 * Dopo l'importazione applica le traduzioni di packages/content-private/translations/it/
 * (formato in src/translate.ts): dopo averle modificate basta rilanciare questo script.
 *
 * Serve Node 24 o più recente, che esegue il TypeScript direttamente.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { importCompendium } from "../src/fc5.ts";
import { applyTranslations, parseTranslations } from "../src/translate.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const [file = "manuali/Official Only.xml", id = "official-2014", name = "Manuali ufficiali 2014"] = process.argv.slice(2);
const outDir = resolve(root, "packages/content-private/generated");
// Traduzioni scritte a mano: tutti i .txt della cartella, in ordine alfabetico.
const translationsDir = resolve(root, "packages/content-private/translations/it");

const { pack, stats } = importCompendium(readFileSync(resolve(root, file), "utf8"), { id, name, ruleset: "2014" });
const translationFiles = existsSync(translationsDir) ? readdirSync(translationsDir).filter((f) => f.endsWith(".txt")).sort() : [];
const translated = applyTranslations(
  pack,
  translationFiles.flatMap((f) => parseTranslations(readFileSync(resolve(translationsDir, f), "utf8"), f)),
);
stats.translations = translated;
mkdirSync(outDir, { recursive: true });

// Un file per tipo: l'app carica i mostri solo quando servono al Master.
const { monsters, spells, items, ...core } = pack;
const write = (suffix, data) => {
  const path = resolve(outDir, `${id}.${suffix}.json`);
  const json = JSON.stringify(data);
  writeFileSync(path, json);
  return `${suffix} ${(json.length / 1e6).toFixed(1)} MB`;
};
const sizes = [write("core", core), write("spells", { id, spells }), write("items", { id, items }), write("monsters", { id, monsters })];
writeFileSync(resolve(outDir, `${id}.stats.json`), JSON.stringify(stats, null, 1));

console.log(`Importato "${file}" come ${id}`);
console.log("Voci:", Object.entries(stats.counts).map(([k, v]) => `${k} ${v}`).join(", "));
console.log("File:", sizes.join(", "));
for (const [cls, subs] of Object.entries(stats.subclasses)) console.log(`  ${cls}: ${subs.length} sottoclassi`);
const unmapped = Object.entries(stats.unmappedModifiers).sort((a, b) => b[1] - a[1]);
console.log(`Modificatori da codificare a mano: ${unmapped.reduce((a, [, v]) => a + v, 0)} (${unmapped.length} tipi)`);
for (const w of stats.warnings) console.log("Attenzione:", w);
console.log(`Meccaniche: ${stats.mechanics.applied} privilegi, ${stats.mechanics.subclassSpells} incantesimi di sottoclasse`);
for (const m of stats.mechanics.missing) console.log("Attenzione: meccanica senza privilegio corrispondente:", m);
const applied = Object.entries(translated.applied).map(([k, v]) => `${k} ${v}`).join(", ");
console.log(`Traduzioni: ${applied || "nessuna"} (${translationFiles.length} file)`);
for (const m of translated.missing) console.log("Attenzione: traduzione senza voce corrispondente:", m);
