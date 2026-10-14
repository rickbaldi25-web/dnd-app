/**
 * Ricava le traduzioni italiane ufficiali dall'SRD 5.1 italiano (CC-BY-4.0) e le scrive in
 * packages/content-private/translations/it-srd/, una cartella generata: si può rifare in ogni momento.
 * Le traduzioni scritte a mano in translations/it/ vengono applicate dopo e hanno la precedenza.
 *
 *   node packages/importer/scripts/srd-it.mjs [--report]
 *   node packages/importer/scripts/import.mjs        (poi, per applicarle)
 *
 * Serve manuali/srd/SRD_CC_v5.1_IT.raw.txt, estratto con Poppler nell'ordine in cui è scritto il PDF
 * (con le colonne al posto giusto):
 *   pdftotext -raw -enc UTF-8 SRD_CC_v5.1_IT.pdf SRD_CC_v5.1_IT.raw.txt
 * e il compendio
 * "manuali/Official Only.xml": le voci italiane si abbinano a quelle importate per caratteristiche
 * (livello, scuola, componenti, dadi...), perché gli id derivano dai nomi inglesi.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { importCompendium } from "../src/fc5.ts";
import { CLASS_FEATURES_IT, CLASS_ORDER_IT, EQUIPMENT_IT, MAGIC_IT, MAGIC_IT_BROKEN, SECTION_APPEND, SILVERED_PREFIX, VARIANT_IT } from "./srd-it-names.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const report = process.argv.includes("--report");
const outDir = resolve(root, "packages/content-private/translations/it-srd");

const { pack } = importCompendium(readFileSync(resolve(root, "manuali/Official Only.xml"), "utf8"), {
  id: "official-2014",
  name: "Manuali ufficiali 2014",
  ruleset: "2014",
});

/* ------------------------------------------------------------------ */
/* Testo dell'SRD italiano, senza piè di pagina                        */
/* ------------------------------------------------------------------ */

/** Righe che il PDF ha rovinato. */
const FIXES = {
  "Ammaliamento di 5° li Eroismoello": "Ammaliamento di 5° livello",
};

const LINES = readFileSync(resolve(root, "manuali/srd/SRD_CC_v5.1_IT.raw.txt"), "utf8")
  .replace(/\f/g, "\n")
  .split(/\r?\n/)
  .map((l) => FIXES[l.trimEnd()] ?? l.trimEnd())
  .filter((l) => l && !/^Rivendita vietata\./.test(l) && !/^Systems Reference Document 5\.1( \d+)?$/.test(l));

/** Righe spezzate dall'impaginazione → paragrafi. Un paragrafo finisce con una riga corta chiusa da punteggiatura. */
function paragraphs(lines) {
  const out = [];
  let cur = "";
  const width = Math.max(30, ...lines.map((l) => l.length)) - 12;
  for (const l of lines) {
    if (!l.trim()) {
      if (cur) out.push(cur), (cur = "");
      continue;
    }
    // Un punto elenco apre sempre un paragrafo.
    if (cur && /^[•●]/.test(l)) out.push(cur), (cur = "");
    cur = cur ? join(cur, l.trim()) : l.trim().replace(/^●/, "•");
    if (/[.:!?)»]$/.test(l) && l.length < width) out.push(cur), (cur = "");
  }
  if (cur) out.push(cur);
  return out;
}
const join = (a, b) => (a.endsWith("-") && /^\p{Ll}/u.test(b) ? a.slice(0, -1) + b : `${a} ${b}`);

const write = (file, entries) => {
  const text = [
    "File generato da packages/importer/scripts/srd-it.mjs dall'SRD 5.1 italiano (CC-BY-4.0). Non modificarlo:",
    "per correggere una voce scrivila in translations/it/, che ha la precedenza.",
    "",
    ...entries.map((e) => `@@ ${e.kind} ${e.id} | ${e.name}\n${e.description ?? ""}`.trimEnd() + "\n"),
  ].join("\n");
  writeFileSync(resolve(outDir, file), text);
};

/* ------------------------------------------------------------------ */
/* Incantesimi                                                         */
/* ------------------------------------------------------------------ */

const SCHOOL = {
  Abiurazione: "abjuration",
  Ammaliamento: "enchantment",
  Divinazione: "divination",
  Evocazione: "conjuration",
  Illusione: "illusion",
  Invocazione: "evocation",
  Necromanzia: "necromancy",
  Trasmutazione: "transmutation",
};
const SPELL_HEAD = /^(?:(\p{L}+) di (\d)° livello|Trucchetto di (\p{L}+))( \(rituale\))?$/u;

function parseItSpells() {
  const start = LINES.findIndex((l) => l === "Descrizioni degli incantesimi");
  const spells = [];
  for (let t = start + 1; t < LINES.length; t++) {
    if (!LINES[t].startsWith("Tempo di lancio:")) continue;
    // Prima ci sono l'intestazione ("Invocazione di 3° livello") e il nome, a volte separati da righe vuote.
    const prev = (k) => {
      while (!LINES[k].trim()) k--;
      return k;
    };
    const i = prev(t - 1);
    const h = SPELL_HEAD.exec(LINES[i]);
    if (!h) {
      console.log("Attenzione: intestazione di incantesimo non riconosciuta:", LINES[i]);
      continue;
    }
    const n = prev(i - 1);
    const sp = {
      name: LINES[n].trim(),
      level: h[2] ? Number(h[2]) : 0,
      school: SCHOOL[h[1] ?? capital(h[3])],
      ritual: Boolean(h[4]),
      line: n,
    };
    // Righe dei dati fino alla durata, poi la descrizione fino al nome del successivo.
    let j = t;
    const meta = [];
    while (!/^Durata:/.test(LINES[j])) meta.push(LINES[j++]);
    meta.push(LINES[j++]);
    const metaText = meta.reduce((a, l) => (/^(Tempo di lancio|Gittata|Componenti|Durata):/.test(l) ? `${a}\n${l}` : `${a} ${l}`), "").trim();
    for (const [k, re] of [["castingTime", /Tempo di lancio: (.*)/], ["range", /Gittata: (.*)/], ["components", /Componenti: (.*)/], ["duration", /Durata: (.*)/]]) {
      sp[k] = re.exec(metaText)?.[1].trim();
    }
    sp.bodyStart = j;
    spells.push(sp);
  }
  spells.forEach((sp, k) => {
    // Fine: la riga del nome del successivo.
    const end = k + 1 < spells.length ? spells[k + 1].line : endOfSpells(sp.bodyStart);
    const body = paragraphs(LINES.slice(sp.bodyStart, end))
      .join("\n")
      .replace(/\s*Ai livelli superiori\. /, "\n**Ai livelli superiori.** ");
    sp.description = body.trim();
  });
  return spells;
}
const endOfSpells = (from) => LINES.indexOf("Trappole", from);
const capital = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const dice = (s) => [...(s ?? "").matchAll(/\d+d\d+/g)].map((m) => m[0]).sort();
const letters = (c) => (c ?? "").replace(/\(.*$/s, "").replace(/[^VSM]/g, "");
const feetToM = (ft) => Math.round(ft * 0.3 * 10) / 10;
const rangeKey = (r, it) => {
  if (!r) return "";
  if (it) return (/(\d+(?:,\d+)?) metri/.exec(r)?.[1] ?? r.split(/[ (]/)[0].toLowerCase()).replace(",", ".");
  const ft = /(\d+) (?:feet|foot)/.exec(r);
  if (ft) return String(feetToM(Number(ft[1])));
  const mi = /(\d+) mile/.exec(r);
  if (mi) return `${Number(mi[1]) * 1.5}km`;
  return r.split(/[ (]/)[0].toLowerCase();
};

/** Tempo di lancio e durata ridotti a numero + unità, uguali nelle due lingue ("1 azione bonus" = "1 bonus action" → "1b"). */
const UNITS = [
  [/azione bonus|bonus action/, "b"],
  [/reazione|reaction/, "r"],
  [/azion|action/, "a"],
  [/round/, "rd"],
  [/minut/, "min"],
  [/\bor[ae]\b|hour/, "h"],
  [/giorn|day/, "d"],
  [/istantane|instantaneous/, "inst"],
  [/dissolt|dispelled/, "disp"],
  [/attivat|triggered/, "trig"],
  [/speciale|special/, "sp"],
];
const timeKey = (s) => {
  const t = (s ?? "").toLowerCase();
  const n = /(\d+)/.exec(t)?.[1] ?? "";
  const u = UNITS.filter(([re]) => re.test(t)).map(([, k]) => k)[0] ?? t;
  return `${/concentra/.test(t) ? "c" : ""}${n}${u}`;
};

function similarity(it, en) {
  let s = 0;
  const a = dice(it.description), b = dice(en.description);
  const common = a.filter((d) => b.includes(d)).length;
  s += common * 3 - Math.abs(a.length - b.length) * 2;
  if (letters(it.components) === letters(en.components)) s += 3;
  if (rangeKey(it.range, true) === rangeKey(en.range, false)) s += 4;
  if (timeKey(it.castingTime) === timeKey(en.castingTime)) s += 3;
  if (timeKey(it.duration) === timeKey(en.duration)) s += 4;
  const len = it.description.length / Math.max(1, en.description?.length ?? 1);
  s -= Math.abs(Math.log(len / 1.15)) * 4;
  return s;
}

/** Nomi in grassetto dell'SRD 5.1 inglese: limitano gli incantesimi candidati a quelli presenti nell'SRD. */
const SRD_EN_BOLD = new Set(
  [...readFileSync(resolve(root, "manuali/srd/SRD_CC_v5.1.xml"), "utf8").matchAll(/<b>([^<]+)<\/b>/g)].map((m) => norm(m[1])),
);

/** Nomi italiani ed inglesi dell'SRD 5.2.1 (pacchetto content-srd): molti nomi coincidono con quelli del 5.1. */
const SRD521 = new Map(
  [...readFileSync(resolve(root, "packages/content-srd/src/spells/data.ts"), "utf8").matchAll(/"name": "([^"]+)",\s*"nameEn": "([^"]+)"/g)].map((m) => [norm(m[1]), m[2]]),
);
/** Confronto tra nomi: minuscole, senza accenti né punteggiatura, senza il nome del mago inventore ("Melf's"). */
function norm(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/^[a-z]+'s /, "").replace(/[^a-z0-9]+/g, " ").trim();
}

/** Incantesimi importati per nome normalizzato; il nome esatto vince su quello senza inventore ("Magic Missile" su "Jim's Magic Missile"). */
function spellsByName() {
  const map = new Map();
  for (const sp of pack.spells) if (!map.has(norm(sp.name)) || norm(sp.name) === sp.name.toLowerCase()) map.set(norm(sp.name), sp);
  return map;
}

function matchSpells(itSpells) {
  const pairs = [];
  const used = new Set();
  const done = new Set();
  const take = (it, en, score, how) => {
    done.add(it);
    used.add(en.id);
    pairs.push({ it, en, score, how });
  };
  // 1. Per nome: italiano 5.1 = italiano 5.2.1 → inglese → incantesimo importato dello stesso livello.
  const byName = spellsByName();
  for (const it of itSpells) {
    const en = byName.get(norm(SRD521.get(norm(it.name)) ?? ""));
    if (en && en.level === it.level && !used.has(en.id)) take(it, en, 99, "nome");
  }
  // 2. Gli altri per caratteristiche, nello stesso livello e scuola: prima le coppie più simili.
  const candidates = [];
  for (const it of itSpells) {
    if (done.has(it)) continue;
    for (const en of pack.spells) {
      if (used.has(en.id) || en.level !== it.level || en.school !== it.school || !SRD_EN_BOLD.has(norm(en.name))) continue;
      candidates.push({ it, en, score: similarity(it, en) });
    }
  }
  candidates.sort((x, y) => y.score - x.score);
  for (const c of candidates) {
    if (done.has(c.it) || used.has(c.en.id) || c.score < 7) continue;
    take(c.it, c.en, c.score, "dati");
  }
  return { pairs, unmatched: itSpells.filter((s) => !done.has(s)) };
}

mkdirSync(outDir, { recursive: true });

/** Nomi che l'abbinamento non trova da solo: nome italiano dell'SRD 5.1 → nome inglese. */
const SPELL_ALIASES = {
  "Aura magica dell'arcanista": "Nystul's Magic Aura",
  "Conoscenza delle legende": "Legend Lore",
  "Mano arcana": "Bigby's Hand",
  "Marchio del cacciatore": "Hunter's Mark",
  "Punizione marchiante": "Branding Smite",
  "Legame planare": "Planar Binding",
  "Raggio di gelo": "Ray of Frost",
};

/**
 * Il testo estratto dal PDF a volte ha le righe fuori posto: si tiene la descrizione italiana
 * solo se ha gli stessi dadi dell'inglese e una lunghezza paragonabile, altrimenti solo il nome.
 */
function trustworthy(it, en) {
  const enText = `${en.description ?? ""} ${en.higherLevels ?? ""}`;
  const a = [...new Set(dice(it.description))].sort().join(), b = [...new Set(dice(enText))].sort().join();
  const ratio = it.description.length / Math.max(1, enText.length);
  return a === b && ratio > 0.75 && ratio < 1.9;
}

const itSpells = parseItSpells();
const spells = matchSpells(itSpells);
const spellByName = spellsByName();
const entries = new Map();
for (const { it, en } of spells.pairs) entries.set(en.id, { kind: "spell", id: en.id, name: it.name, description: trustworthy(it, en) ? it.description : undefined });
for (const [itName, enName] of Object.entries(SPELL_ALIASES)) {
  const en = spellByName.get(norm(enName));
  if (!en) console.log("Attenzione: incantesimo inglese non trovato:", enName);
  else if (!entries.has(en.id)) {
    const it = spells.unmatched.find((s) => s.name === itName);
    entries.set(en.id, { kind: "spell", id: en.id, name: itName, description: it && trustworthy(it, en) ? it.description : undefined });
  }
}
const spellEntries = [...entries.values()].sort((a, b) => a.name.localeCompare(b.name, "it"));
write("incantesimi.txt", spellEntries);
console.log(`Incantesimi: ${spellEntries.length} tradotti (${spellEntries.filter((e) => e.description).length} con il testo) su ${itSpells.length} letti dall'SRD italiano`);
if (report) {
  for (const p of spells.pairs.filter((p) => p.how === "dati").sort((a, b) => a.score - b.score)) console.log(`  ${p.score.toFixed(1)}  ${p.it.name} → ${p.en.name}`);
  for (const s of spells.unmatched) if (!SPELL_ALIASES[s.name]) console.log("  senza abbinamento:", s.name, s.level, s.school);
  for (const e of spellEntries) if (!e.description) console.log("  solo il nome:", e.name);
}

/* ------------------------------------------------------------------ */
/* Mostri                                                              */
/* ------------------------------------------------------------------ */

const SIZES = ["Minuscol", "Piccol", "Medi", "Grand", "Enorm", "Mastodontic"];
/** Intestazioni dei dati del mostro → campo. Quelle senza campo (tiri salvezza, abilità) si calcolano dai numeri. */
const MONSTER_FIELDS = [
  [/^Tiri Salvezza /i, null],
  [/^Abilità /i, null],
  [/^Vulnerabilità ai Danni /i, "vulnerabilities"],
  [/^Resistenz[ae] ai Danni /i, "resistances"],
  [/^Immunità ai Danni /i, "immunities"],
  [/^Immunità alle Condizioni /i, "conditionImmunities"],
  [/^Sensi /i, "senses"],
  [/^Linguaggi /i, "languages"],
  [/^Sfida /i, null],
];
const SECTIONS = { Azioni: "actions", Reazioni: "reactions", "Azioni leggendarie": "legendary" };
/** Una riga che apre una voce: "Nome. Testo" o "Nome (Ricarica 5-6). Testo". */
const ENTRY_START = /^([A-ZÀ-Ý][^.:•]{0,70}?)\. (?=\S)/;

function parseItMonsters() {
  const blocks = [];
  for (let c = 0; c < LINES.length; c++) {
    if (!/^Classe Armatura \d/.test(LINES[c]) || !/^Punti Ferita \d/.test(LINES[c + 1] ?? "")) continue;
    const typeLine = LINES[c - 1];
    const m = {
      name: LINES[c - 2].trim(),
      line: c - 2,
      ac: Number(/\d+/.exec(LINES[c])[0]),
      acNote: /\((.*)\)/.exec(LINES[c])?.[1],
      hpFormula: (/\(([^)]*)\)/.exec(LINES[c + 1])?.[1] ?? "").replace(/\s+/g, "").replace(/[−–]/g, "-"),
      fields: {},
    };
    const [kind, alignment] = typeLine.split(/,\s*/, 2);
    const size = kind.split(" ").find((w) => SIZES.some((s) => w.startsWith(s)));
    m.size = size;
    m.type = kind.replace(` ${size}`, "").replace(/^\p{Lu}/u, (x) => x.toLowerCase());
    m.alignment = alignment;
    // Velocità fino alla riga "FOR DES COS...", poi i sei punteggi.
    let j = c + 2;
    let speed = "";
    while (!/^FOR\b/.test(LINES[j])) speed = join(speed, LINES[j++]).trim();
    m.speed = speed.replace(/^Velocità\s*/, "");
    const scores = [];
    while (scores.length < 6 && j < c + 12) {
      j++;
      for (const s of LINES[j].matchAll(/(\d+) \([+\-−]\d+\)/g)) scores.push(Number(s[1]));
    }
    m.abilities = scores.join(",");
    j++;
    // Dati fino a "Sfida", con le righe a capo unite al campo precedente.
    let field;
    for (; j < LINES.length; j++) {
      const f = MONSTER_FIELDS.find(([re]) => re.test(LINES[j]));
      if (f) {
        field = f[1];
        if (field) m.fields[field] = LINES[j].replace(f[0], "").trim();
        if (/^Sfida /.test(LINES[j])) break;
      } else if (field) m.fields[field] = join(m.fields[field], LINES[j]);
    }
    m.bodyStart = j + 1;
    blocks.push(m);
  }
  blocks.forEach((m, k) => {
    let end = k + 1 < blocks.length ? blocks[k + 1].line : Math.min(LINES.length, m.bodyStart + 80);
    // Prima del mostro successivo possono esserci titoli di gruppo ("Angeli", "Mostri (B)"): righe brevi senza punto finale.
    while (end > m.bodyStart && LINES[end - 1].length < 40 && !/[.:)]$/.test(LINES[end - 1])) end--;
    m.sections = { traits: [], actions: [], reactions: [], legendary: [] };
    let section = "traits";
    let cur;
    for (let j = m.bodyStart; j < end; j++) {
      const l = LINES[j];
      if (SECTIONS[l]) {
        section = SECTIONS[l];
        cur = undefined;
        continue;
      }
      const start = ENTRY_START.exec(l);
      const prevEnds = j === m.bodyStart || SECTIONS[LINES[j - 1]] || /[.)]$/.test(LINES[j - 1]);
      if (start && prevEnds) {
        cur = { name: start[1], text: l.slice(start[0].length) };
        m.sections[section].push(cur);
      } else if (!cur) {
        // Testo senza nome: l'introduzione delle azioni leggendarie.
        cur = { name: "", text: l };
        m.sections[section].push(cur);
      } else cur.text = join(cur.text, l);
    }
    if (m.sections.traits.length === 0 && !m.fields.senses) console.log("Attenzione: mostro letto male:", m.name);
  });
  return blocks;
}

/** Ciò che una voce ha di confrontabile tra le lingue: dadi, bonus per colpire, CD, usi e ricariche. */
function tokens(text) {
  const t = (text ?? "").replace(/\s+/g, "").replace(/[−–]/g, "-");
  return [
    ...[...t.matchAll(/\d+d\d+/g)].map((x) => x[0]),
    ...[...t.matchAll(/\+(\d+)(?=altiro|tohit)/gi)].map((x) => `+${x[1]}`),
    ...[...t.matchAll(/(?:CD|DC)(\d+)/g)].map((x) => `cd${x[1]}`),
    ...[...t.matchAll(/(\d)\/(?:giorno|day|turno|turn)/gi)].map((x) => `${x[1]}/g`),
    ...[...t.matchAll(/(?:Ricarica|Recharge)(\d)/gi)].map((x) => `r${x[1]}`),
    ...[...(text ?? "").matchAll(/Melee|da mischia|Ranged|a distanza|Spell Attack|con incantesimo/gi)].map((x) => (/mel|misch/i.test(x[0]) ? "mischia" : /rang|dist/i.test(x[0]) ? "distanza" : "incantesimo")),
  ];
}

/** Dizionario dei nomi delle voci (inglese → italiano), costruito dagli abbinamenti sicuri. */
const ENTRY_NAMES = new Map();

function entryScore(it, en) {
  const a = tokens(`${it.name} ${it.text}`), b = tokens(`${en.name} ${en.text}`);
  const common = a.filter((x) => b.includes(x)).length;
  let s = common * 3 - Math.abs(new Set(a).size - new Set(b).size);
  if (ENTRY_NAMES.get(baseName(en.name))?.has(baseName(it.name))) s += 6;
  s += nameHints(it.name, en.name);
  if (!it.name && /^Legendary Actions/i.test(en.name)) s += 20;
  const ratio = it.text.length / Math.max(1, en.text.length);
  s -= Math.abs(Math.log(ratio / 1.2)) * 3;
  return s;
}
/** Parole dei nomi (inglese → italiano) imparate dalle voci di una parola sola: "tail" → "coda". */
const NAME_WORDS = new Map();
const words = (n) => baseName(n).split(/[^\p{L}]+/u).filter((w) => w.length > 2);
/** Grafia avvicinata tra le lingue, per riconoscere le parole simili ("amphibious" / "anfibio"). */
const spelling = (w) => w.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ph/g, "f").replace(/th/g, "t").replace(/y/g, "i").replace(/k/g, "c").replace(/m(?=[bpf])/g, "n").replace(/(.)\1/g, "$1");
function nameHints(itName, enName) {
  const iw = words(itName), ew = words(enName);
  let s = 0;
  if (ew.some((e) => iw.some((i) => NAME_WORDS.get(e)?.has(i)))) s += 5;
  // Parole con lo stesso inizio ("lanterna" / "lantern", "abaco" / "abacus"): conta quante lettere hanno in comune.
  let lcp = 0;
  for (const e of ew) for (const i of iw) {
    const [a, b] = [spelling(e), spelling(i)];
    let n = 0;
    while (n < a.length && a[n] === b[n]) n++;
    lcp = Math.max(lcp, n);
  }
  if (lcp >= 4) s += lcp;
  return s;
}

/** "Recharge 5-6", "3/Day" e simili non fanno parte del nome. */
const baseName = (n) => n.replace(/\s*\(.*\)\s*$/, "").trim().toLowerCase();

/** Abbina le voci di una sezione: prima le coppie più simili. */
function pairEntries(itList, enList) {
  const cands = [];
  itList.forEach((it, i) => enList.forEach((en, e) => cands.push({ i, e, s: entryScore(it, en) })));
  cands.sort((x, y) => y.s - x.s);
  const usedI = new Set(), usedE = new Set(), out = [];
  for (const c of cands) {
    if (usedI.has(c.i) || usedE.has(c.e)) continue;
    // Senza indizi comuni si accetta solo se è l'unica voce rimasta da entrambe le parti.
    const lastOne = itList.length - usedI.size === 1 && enList.length - usedE.size === 1;
    if (c.s < 1 && !lastOne) continue;
    usedI.add(c.i), usedE.add(c.e);
    out.push({ it: itList[c.i], en: enList[c.e], score: c.s, lastOne });
  }
  return out;
}

/** Testo affidabile: stessi dadi e lunghezza paragonabile; altrimenti resta l'inglese e si traduce solo il nome. */
function entryTrustworthy(it, en) {
  const a = [...new Set(dice(it.text))].sort().join(), b = [...new Set(dice(en.text))].sort().join();
  const ratio = it.text.length / Math.max(1, en.text.length);
  return a === b && ratio > 0.7 && ratio < 2.2;
}

function matchMonsters(blocks) {
  const sig = (m) => `${m.ac}|${(m.hpFormula ?? "").replace(/\s+/g, "")}|${typeof m.abilities === "string" ? m.abilities : Object.values(m.abilities).join(",")}`;
  const bySig = new Map();
  for (const en of pack.monsters) bySig.set(sig(en), [...(bySig.get(sig(en)) ?? []), en]);
  const used = new Set();
  const pairs = [];
  const unmatched = [];
  for (const it of blocks) {
    // A parità di statistiche si preferisce il mostro dell'SRD (stesso nome nel testo inglese), poi il Manuale dei Mostri.
    const list = (bySig.get(sig(it)) ?? []).filter((en) => !used.has(en.id));
    const en = list.find((x) => SRD_EN_BOLD.has(norm(x.name)) && /Monster Manual/.test(x.source ?? "")) ?? list.find((x) => SRD_EN_BOLD.has(norm(x.name))) ?? list[0];
    if (!en) {
      unmatched.push(it);
      continue;
    }
    used.add(en.id);
    pairs.push({ it, en });
  }
  return { pairs, unmatched };
}

function monsterEntry(it, en) {
  const lines = [];
  const typeEn = (en.type ?? "").toLowerCase();
  if (it.size) lines.push(`taglia: ${it.size}`);
  if (it.type && typeEn) lines.push(`tipo: ${it.type}`);
  if (it.alignment && en.alignment) lines.push(`allineamento: ${it.alignment}`);
  if (it.acNote && en.acNote) lines.push(`ca: ${it.acNote}`);
  if (it.speed) lines.push(`velocità: ${it.speed}`);
  const senses = it.fields.senses?.replace(/,?\s*Percezione passiva \d+,?\s*/i, ", ").replace(/^,\s*|,\s*$/g, "").trim();
  if (senses && en.senses) lines.push(`sensi: ${senses}`);
  for (const [field, label] of [["languages", "linguaggi"], ["resistances", "resistenze"], ["immunities", "immunità"], ["vulnerabilities", "vulnerabilità"], ["conditionImmunities", "immunità condizioni"]]) {
    if (it.fields[field] && en[field]) lines.push(`${label}: ${it.fields[field]}`);
  }
  let translated = 0, total = 0;
  for (const key of ["traits", "actions", "reactions", "legendary"]) {
    const enList = en[key] ?? [];
    total += enList.length;
    for (const { it: ie, en: ee } of pairEntries(it.sections[key], enList)) {
      const name = ie.name || "Azioni leggendarie";
      // Il nome italiano conserva la parte tra parentesi dell'inglese se l'SRD l'ha omessa.
      lines.push(`@ ${ee.name} | ${name}`);
      if (entryTrustworthy(ie, ee)) lines.push(ie.text.trim()), translated++;
    }
  }
  return { kind: "monster", id: en.id, name: it.name, description: lines.join("\n"), translated, total };
}

const itMonsters = parseItMonsters();
if (process.env.DBG) for (const m of itMonsters.filter((x) => x.name.match(process.env.DBG))) console.log(JSON.stringify(m.sections, null, 1));
const monsters = matchMonsters(itMonsters);
// Prima alcuni giri di prova: le coppie sicure (indizi forti, o l'unica voce rimasta) insegnano i nomi delle voci,
// così i tratti senza numeri ("Tattiche del branco") si riconoscono negli altri mostri.
for (let round = 0; round < 3; round++) for (const { it, en } of monsters.pairs) {
  for (const key of ["traits", "actions", "reactions", "legendary"]) {
    for (const p of pairEntries(it.sections[key], en[key] ?? [])) {
      if ((p.score < 5 && !p.lastOne) || !p.it.name) continue;
      const k = baseName(p.en.name);
      ENTRY_NAMES.set(k, (ENTRY_NAMES.get(k) ?? new Set()).add(baseName(p.it.name)));
      const [ew, iw] = [words(p.en.name), words(p.it.name)];
      if (ew.length === 1 && iw.length === 1) NAME_WORDS.set(ew[0], (NAME_WORDS.get(ew[0]) ?? new Set()).add(iw[0]));
    }
  }
}
const monsterEntries = monsters.pairs.map(({ it, en }) => monsterEntry(it, en)).sort((a, b) => a.name.localeCompare(b.name, "it"));
write("mostri.txt", monsterEntries);
const sum = (k) => monsterEntries.reduce((a, e) => a + e[k], 0);
console.log(`Mostri: ${monsterEntries.length} tradotti su ${itMonsters.length} letti dall'SRD italiano; voci con il testo ${sum("translated")} su ${sum("total")}`);
if (report) for (const m of monsters.unmatched) console.log("  senza abbinamento:", m.name, m.ac, m.hpFormula, m.abilities);

/* ------------------------------------------------------------------ */
/* Oggetti                                                             */
/* ------------------------------------------------------------------ */

const ITEM_HEAD = /^(Oggetto meraviglioso|Arma|Armatura|Anello|Bacchetta|Bastone|Pozione|Verga|Pergamena|Scudo|Munizione)\b[^.]*,\s*(.*)$/;

/** Gli oggetti magici dell'SRD italiano: nome, testo. */
function parseItMagicItems() {
  const from = LINES.indexOf("Oggetti magici A–Z");
  const to = LINES.indexOf("Oggetti magici senzienti", from);
  const items = [];
  for (let i = from + 1; i < to; i++) {
    if (!ITEM_HEAD.test(LINES[i]) || !/comun|rar|leggendari|manufatto|variabile/.test(LINES[i] + LINES[i + 1]) || /[.:]$/.test(LINES[i - 1])) continue;
    // La rarità può andare a capo: "non comune (+1), rara (+2) o molto" / "rara (+3)".
    let head = LINES[i];
    let j = i + 1;
    while (/\bo molto$|,$|\bo$|\(richiede$/.test(head)) head = `${head} ${LINES[j++]}`;
    items.push({ name: LINES[i - 1], line: i - 1, bodyStart: j });
  }
  items.forEach((x, k) => {
    let end = k + 1 < items.length ? items[k + 1].line : to;
    while (end > x.bodyStart && LINES[end - 1].length < 40 && !/[.:)]$/.test(LINES[end - 1])) end--;
    x.description = paragraphs(LINES.slice(x.bodyStart, end)).join("\n");
  });
  return items;
}

/** Nome dell'oggetto di base dentro il nome inglese: "Flame Tongue Longsword" → "Longsword". */
function splitBase(name, bases) {
  for (const b of bases) {
    if (name.endsWith(` ${b}`)) return { family: name.slice(0, -b.length - 1), base: b };
    if (name.startsWith(`${b} `)) return { family: name.slice(b.length + 1), base: b };
  }
  return { family: name };
}

const DAMAGE_IT = {
  acid: "acido",
  bludgeoning: "contundenti",
  cold: "freddo",
  fire: "fuoco",
  force: "forza",
  lightning: "fulmine",
  necrotic: "necrotici",
  piercing: "perforanti",
  poison: "veleno",
  psychic: "psichici",
  radiant: "radiosi",
  slashing: "taglienti",
  thunder: "tuono",
};

function itemEntries() {
  const byId = new Map(pack.items.map((x) => [x.id, x]));
  const out = [];
  const missing = [];
  // Equipaggiamento comune, dalla tabella dei nomi.
  for (const [id, name] of Object.entries(EQUIPMENT_IT)) {
    if (byId.has(id)) out.push({ kind: "item", id, name });
    else missing.push(id);
  }
  const itName = new Map(Object.entries(EQUIPMENT_IT).flatMap(([id, name]) => (byId.has(id) ? [[byId.get(id).name, name]] : [])));
  // Armi e munizioni argentate.
  const SINGLE_AMMO = { arrow: "Freccia", bolt: "Quadrello", needle: "Ago da cerbottana", "sling-bullet": "Proiettile da fionda" };
  for (const x of pack.items) {
    if (!x.id.startsWith(SILVERED_PREFIX)) continue;
    const id = x.id.slice(SILVERED_PREFIX.length);
    const base = SINGLE_AMMO[id] ?? EQUIPMENT_IT[id];
    if (!base) continue;
    // L'aggettivo concorda con la prima parola: "Spada lunga argentata", "Pugnale argentato", "Rete argentata".
    const first = base.split(" ")[0];
    out.push({ kind: "item", id: x.id, name: `${base} argentat${/a$|^Rete$/.test(first) ? "a" : "o"}` });
  }
  // Armi, armature, scudi e munizioni +1, +2, +3.
  for (const x of pack.items) {
    const m = x.magic && /^(.+) (\+\d)$/.exec(x.name);
    const base = m && itName.get(m[1] === "Shield" ? "Shield" : m[1]);
    if (base) out.push({ kind: "item", id: x.id, name: `${base} ${m[2]}` });
  }
  // Oggetti magici: le famiglie del compendio (lo stesso oggetto per ogni arma o armatura di base, le varianti tra parentesi).
  const bases = pack.items.filter((x) => !x.magic && ["weapon", "armor", "shield"].includes(x.kind)).map((x) => x.name).sort((a, b) => b.length - a.length);
  const families = new Map();
  for (const x of pack.items.filter((x) => x.magic)) {
    const { family, base } = splitBase(x.name, bases);
    const f = norm(family.replace(/\s*\([^)]*\)$/, ""));
    if (!families.has(f)) families.set(f, []);
    families.get(f).push({ item: x, base, paren: /\(([^)]*)\)$/.exec(family)?.[1] });
  }
  const magicPart = (d) => (d ?? "").split(/\n\n/)[0];
  const itItems = parseItMagicItems();
  let withText = 0;
  const unmatched = [];
  const variant = (v) => (itName.get(v) ?? VARIANT_IT[v] ?? DAMAGE_IT[v.toLowerCase()] ?? v).replace(/^\p{Lu}(?=\p{Ll})/u, (c) => c.toLowerCase());
  const magicItems = pack.items.filter((x) => x.magic);
  /** Gli oggetti inglesi di una voce di MAGIC_IT, con le parti variabili del nome. */
  const membersOf = (target) => {
    if (target.includes("*")) {
      const [kind, pattern] = target.includes("|") ? target.split("|") : [undefined, target];
      const re = new RegExp(`^${pattern.replace(/[.+?^${}()[\]\\]/g, "\\$&").replace(/\*/g, "(.+?)")}$`);
      return magicItems.filter((x) => (!kind || x.kind === kind) && re.test(x.name)).map((x) => ({ item: x, parts: re.exec(x.name).slice(1) }));
    }
    const exact = magicItems.filter((x) => norm(x.name) === norm(target));
    if (exact.length) return exact.map((x) => ({ item: x, parts: [] }));
    return (families.get(norm(target)) ?? []).map((m) => ({ item: m.item, parts: [m.base, m.paren].filter(Boolean) }));
  };
  for (const it of itItems) {
    const broken = MAGIC_IT_BROKEN[it.name];
    const target = broken?.[1] ?? MAGIC_IT[it.name];
    // "Arma +1, +2 o +3" e simili: li traducono già i nomi dell'equipaggiamento più il bonus.
    if (!target && /\+1, \+2 o \+3$/.test(it.name)) continue;
    const members = target ? membersOf(target) : [];
    if (!members.length) {
      unmatched.push(`${it.name}${target ? ` → ${target}?` : ""}`);
      continue;
    }
    // "Bacchetta del mago da guerra +1, +2 o +3" → "Bacchetta del mago da guerra +2".
    const plus = /^(.*) \+1, \+2 o \+3$/.exec(broken?.[0] ?? it.name);
    const name = plus?.[1] ?? broken?.[0] ?? it.name;
    for (const m of members) {
      const extra = m.parts.map(variant);
      if (plus) extra.length = 0;
      const trusted = [...new Set(dice(it.description))].sort().join() === [...new Set(dice(magicPart(m.item.description)))].sort().join();
      if (trusted) withText++;
      const full = plus ? `${name} ${m.parts[0] ?? ""}`.trim() : extra.length ? `${name} (${extra.join(", ")})` : name;
      out.push({ kind: "item", id: m.item.id, name: full, description: trusted ? it.description : undefined });
    }
  }
  return { entries: out, missing, unmatched, itItems: itItems.length, withText };
}

const items = itemEntries();
write("oggetti.txt", items.entries.sort((a, b) => a.name.localeCompare(b.name, "it")));
console.log(`Oggetti: ${items.entries.length} voci tradotte (${items.withText} oggetti magici con il testo, da ${items.itItems} dell'SRD italiano)`);
for (const id of items.missing) console.log("Attenzione: oggetto comune non trovato nel compendio:", id);
for (const x of items.unmatched) console.log("Attenzione: oggetto magico senza famiglia inglese:", x);

/* ------------------------------------------------------------------ */
/* Privilegi di classe                                                 */
/* ------------------------------------------------------------------ */

/** I segnalibri del PDF italiano: i titoli delle sezioni, in ordine. */
const BOOKMARKS = [...readFileSync(resolve(root, "manuali/srd/SRD_CC_v5.1_IT.xml"), "utf8").matchAll(/<item page="\d+">([^<]*)<\/item>/g)].map((m) =>
  decodeEntities(m[1]).trim(),
);
function decodeEntities(s) {
  return s.replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
/** Titoli confrontabili: minuscole, "1  livello" del segnalibro uguale a "1° livello" del testo. */
const headKey = (s) => s.toLowerCase().replace(/°/g, "").replace(/[’]/g, "'").replace(/\s+/g, " ").trim();

function classFeatureEntries() {
  const byId = new Map();
  for (const c of pack.classes) for (const f of c.features) byId.set(f.id, f);
  for (const s of pack.subclasses) for (const f of s.features) byId.set(f.id, f);
  const starts = LINES.flatMap((l, i) => (l === "Privilegi di classe" ? [i] : [])).slice(0, CLASS_ORDER_IT.length);
  const groups = [];
  for (const b of BOOKMARKS) {
    if (b === "Privilegi di classe") groups.push([]);
    else if (b === "Multiclasse") break;
    else groups.at(-1)?.push(b);
  }
  const append = new Set(SECTION_APPEND.map(headKey));
  const out = [];
  const missing = [];
  CLASS_ORDER_IT.forEach((cls, k) => {
    const map = new Map(Object.entries(CLASS_FEATURES_IT[cls]).map(([it, id]) => [headKey(it), id]));
    const end = starts[k + 1] ?? LINES.indexOf("Multiclasse");
    // Posizione di ogni titolo nel testo, a partire dal precedente (un titolo può andare a capo su due righe).
    const heads = [];
    let cursor = starts[k] + 1;
    for (const title of groups[k] ?? []) {
      const key = headKey(title);
      for (let i = cursor; i < end; i++) {
        const one = headKey(LINES[i]);
        const two = headKey(`${LINES[i]} ${LINES[i + 1] ?? ""}`);
        if (one === key || two === key) {
          heads.push({ title, key, line: i, body: one === key ? i + 1 : i + 2 });
          cursor = heads.at(-1).body;
          break;
        }
      }
    }
    let current;
    const flush = () => {
      if (!current) return;
      const text = current.parts.join("\n").trim();
      for (const id of current.ids) {
        const f = byId.get(id);
        if (f) out.push({ kind: "feature", id, name: current.name, description: text });
        else missing.push(id);
      }
      current = undefined;
    };
    heads.forEach((h, n) => {
      const body = paragraphs(LINES.slice(h.body, heads[n + 1]?.line ?? end)).join("\n");
      const target = map.get(h.key);
      if (target) {
        flush();
        const ids = target === "asi" ? [...byId.keys()].filter((id) => id.startsWith(`${cls}.ability-score-improvement`)) : [`${cls}.${target}`];
        current = { name: h.title.replace(/\s+/g, " "), ids, parts: [body] };
      } else if (current && append.has(h.key)) current.parts.push(`**${h.title.replace(/\s+/g, " ")}.** ${body}`);
      else flush();
    });
    flush();
    for (const [key] of map) if (!heads.some((h) => h.key === key)) missing.push(`${cls}: titolo non trovato "${key}"`);
  });
  return { entries: out, missing };
}

const classFeatures = classFeatureEntries();
write("privilegi.txt", classFeatures.entries);
console.log(`Privilegi di classe: ${classFeatures.entries.length} tradotti dall'SRD italiano`);
for (const m of classFeatures.missing) console.log("Attenzione: privilegio non trovato:", m);
