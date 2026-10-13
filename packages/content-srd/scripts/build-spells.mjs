/**
 * Genera src/spells/data.ts dagli SRD 5.2.1 ufficiali (CC-BY-4.0), italiano e inglese.
 *
 * I PDF non stanno nel repository. Per rigenerare:
 *   1. scarica IT_SRD_CC_v5.2.1.pdf e SRD_CC_v5.2.1.pdf da https://www.dndbeyond.com/srd in manuali/srd/
 *   2. per ognuno dei due, con gli strumenti di Poppler:
 *        pdftohtml -xml -i -q -enc UTF-8 IT_SRD_CC_v5.2.1.pdf IT_SRD_CC_v5.2.1
 *        pdftotext -bbox-layout -enc UTF-8 IT_SRD_CC_v5.2.1.pdf IT_SRD_CC_v5.2.1.bbox.html
 *   3. node packages/content-srd/scripts/build-spells.mjs   (--report per il riepilogo)
 *
 * Dall'italiano vengono nomi e testi, dall'inglese gli id. Le due liste sono in
 * ordine alfabetico diverso: si abbinano per livello, scuola, classi, componenti e dadi.
 * I tiri automatici (danni, cure) nascono da euristiche sul testo e si correggono in src/spells/overrides.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");
const SRD_DIR = resolve(root, "manuali/srd");
const OUT = resolve(here, "../src/spells/data.ts");
const report = process.argv.includes("--report");

/* ------------------------------------------------------------------ */
/* Lettura dell'XML di pdftohtml                                       */
/* ------------------------------------------------------------------ */

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

function readXml(file) {
  const xml = readFileSync(resolve(SRD_DIR, file), "utf8");
  const fonts = new Map();
  for (const m of xml.matchAll(/<fontspec id="(\d+)" size="(\d+)" family="([^"]+)" color="([^"]+)"/g)) {
    fonts.set(m[1], { size: Number(m[2]), family: m[3].replace(/^[A-Z]+\+/, ""), color: m[4] });
  }
  const items = [];
  let page = 0;
  for (const line of xml.split(/\r?\n/)) {
    const p = line.match(/^<page number="(\d+)"/);
    if (p) {
      page = Number(p[1]);
      continue;
    }
    const t = line.match(/^<text top="(-?\d+)" left="(-?\d+)" width="(\d+)" height="(\d+)" font="(\d+)">(.*)<\/text>$/);
    if (!t) continue;
    const raw = t[6];
    const font = fonts.get(t[5]);
    items.push({
      page,
      left: Number(t[2]),
      width: Number(t[3]),
      font,
      raw,
      text: decode(raw.replace(/<[^>]+>/g, "")),
      bold: /^(<i>)?<b>/.test(raw),
      italic: /^(<b>)?<i>/.test(raw),
      // Titoletto in grassetto a inizio paragrafo ("Utilizzo di uno slot...", "Allarme acustico.").
      runIn: /^(<i>)?<b>/.test(raw),
    });
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* Dalle righe agli incantesimi                                        */
/* ------------------------------------------------------------------ */

const LANG = {
  it: {
    file: "IT_SRD_CC_v5.2.1.xml",
    section: "Descrizioni degli incantesimi",
    header: /^(?:(\p{L}+) di (\d)º livello|Trucchetto di (\p{L}+)) \(/u,
    labels: [/^Tempo di lancio:/, /^Gittata:/, /^Component[ei]:/, /^Durata:/],
    higher: /^(Utilizzo di uno slot incantesimo di livello superiore|Trucchetto potenziato)\.\s*/,
    schools: {
      abiurazione: "abjuration",
      ammaliamento: "enchantment",
      divinazione: "divination",
      evocazione: "conjuration",
      illusione: "illusion",
      invocazione: "evocation",
      necromanzia: "necromancy",
      trasmutazione: "transmutation",
    },
    classes: { bardo: "bard", chierico: "cleric", druido: "druid", mago: "wizard", paladino: "paladin", ranger: "ranger", stregone: "sorcerer", warlock: "warlock" },
    ritual: /\s+o rituale$/i,
    concentration: /^concentrazione/i,
  },
  en: {
    file: "SRD_CC_v5.2.1.xml",
    section: "Spell Descriptions",
    header: /^(?:Level (\d) (\p{L}+)|(\p{L}+) Cantrip) \(/u,
    labels: [/^Casting Time:/, /^Range:/, /^Components?:/, /^Duration:/],
    higher: /^(Using a Higher-Level Spell Slot|Cantrip Upgrade)\.\s*/,
    schools: Object.fromEntries(["abjuration", "enchantment", "divination", "conjuration", "illusion", "evocation", "necromancy", "transmutation"].map((s) => [s, s])),
    classes: Object.fromEntries(["bard", "cleric", "druid", "wizard", "paladin", "ranger", "sorcerer", "warlock"].map((s) => [s, s])),
    ritual: /\s+or Ritual$/i,
    concentration: /^concentration/i,
  },
};

const isBody = (it) => it.font.family.startsWith("Cambria");
const isHeading = (it) => it.bold && !it.italic && /SemiBold/.test(it.font.family) && it.font.color !== "#231f20";

/**
 * Posizione delle parole da "pdftotext -bbox-layout". Serve perché l'XML di pdftohtml
 * ha i font ma non l'altezza delle righe, e a volte elenca il testo fuori ordine.
 */
function readBbox(file) {
  const pages = [];
  let page = null;
  let line = null;
  for (const l of readFileSync(resolve(SRD_DIR, file), "utf8").split(/\r?\n/)) {
    if (l.includes("<page ")) pages.push((page = []));
    else if (l.includes("<line ")) page.push((line = []));
    else {
      const w = l.match(/<word xMin="([\d.]+)" yMin="([\d.]+)"[^>]*>(.*)<\/word>/);
      if (w) line.push({ x: Number(w[1]), y: Number(w[2]), text: decode(w[3]).replace(/&apos;/g, "'") });
    }
  }
  return pages;
}

/** Dà a ogni frammento dell'XML l'altezza della parola corrispondente nella pagina. */
function locate(items, pages) {
  let prev = null;
  for (const it of items) {
    const words = it.text.trim().split(/\s+/).filter(Boolean);
    const lead = it.text.length - it.text.trimStart().length;
    const x = it.left / 1.5; // l'XML è in scala 1,5
    let best = null;
    let bestScore = -Infinity;
    // Un frammento che comincia dove finisce il precedente sta sulla stessa riga (etichetta + valore).
    const adjacent = prev && prev.page === it.page && Math.abs(it.left - (prev.left + prev.width)) <= 4;
    if (words.length && !adjacent) {
      for (const line of pages[it.page - 1] ?? []) {
        for (let i = 0; i < line.length; i++) {
          const w = line[i];
          if (w.used || !w.text.startsWith(words[0])) continue;
          const dx = Math.abs(w.x - x);
          if (dx > (lead ? 8 : 3)) continue;
          let score = w.text === words[0] ? 100 : 0;
          for (let k = 1; k < Math.min(words.length, 4); k++) if (line[i + k]?.text === words[k]) score += 10;
          // Righe uguali ("Tempo di lancio:" c'è in ogni incantesimo): a parità di testo vale
          // la prima che viene dopo il frammento precedente, nella stessa colonna.
          const after = prev && prev.col === (w.x < 290 ? 0 : 1) && w.y >= prev.y - 1 ? w.y - prev.y : 5000 + w.y;
          const total = score * 100000 - after;
          if (total > bestScore) {
            best = w;
            bestScore = total;
          }
        }
      }
    }
    it.col = it.left < 440 ? 0 : 1;
    if (best) {
      best.used = true;
      it.y = best.y;
    } else {
      // Pezzi di parola (maiuscoletto) o spazi: stanno sulla riga del frammento precedente.
      it.y = prev && prev.page === it.page ? prev.y : 0;
    }
    prev = it;
  }
}

/** Righe nell'ordine dell'XML: sulla stessa riga i frammenti che cominciano dove finisce il precedente. */
function toLinesInOrder(items) {
  const lines = [];
  for (const it of items) {
    const last = lines.at(-1);
    const prev = last?.parts.at(-1);
    if (prev && prev.page === it.page && Math.abs(it.left - (prev.left + prev.width)) <= 4) {
      last.parts.push(it);
      last.text += it.text;
      last.raw += it.raw;
    } else {
      lines.push({ parts: [it], text: it.text, raw: it.raw, left: it.left, page: it.page, first: it });
    }
  }
  return lines;
}

/** Ordina per pagina, colonna e altezza, poi unisce i frammenti della stessa riga. */
function toLines(items) {
  const col = (it) => (it.left < 440 ? 0 : 1);
  const sorted = [...items].sort((a, b) => a.page - b.page || col(a) - col(b) || a.y - b.y || a.left - b.left);
  // Stessa riga: il grassetto sta un punto più su del testo normale, l'interlinea è 12.
  const lines = [];
  for (const it of sorted) {
    const last = lines.at(-1);
    if (last && last.page === it.page && last.col === col(it) && Math.abs(it.y - last.y) <= 3) {
      last.parts.push(it);
    } else {
      lines.push({ parts: [it], page: it.page, col: col(it), y: it.y });
    }
  }
  for (const l of lines) {
    l.parts.sort((a, b) => a.left - b.left);
    l.first = l.parts[0];
    l.left = l.first.left;
    l.text = l.parts.map((p) => p.text).join("");
    l.raw = l.parts.map((p) => p.raw).join("");
  }
  return lines;
}

function parseSpells(lang) {
  const L = LANG[lang];
  const all = readXml(L.file);
  const start = all.findIndex((it) => it.font.size >= 27 && it.text.trim() === L.section);
  if (start < 0) throw new Error(`Sezione non trovata: ${L.section}`);
  let end = all.findIndex((it, i) => i > start && it.font.size >= 27 && it.text.trim().length > 2);
  if (end < 0) end = all.length;
  // Via intestazioni e numeri di pagina.
  const region = all.slice(start + 1, end).filter((it) => !/^System Reference Document/.test(it.text) && !(it.left < 60 && /^\d+$/.test(it.text.trim())) && !(it.left > 820 && /^\d+$/.test(it.text.trim())));
  // L'inglese serve solo per nomi e dati di intestazione: lì basta l'ordine dell'XML.
  if (lang === "it") locate(region, readBbox(L.file.replace(".xml", ".bbox.html")));
  const lines = lang === "it" ? toLines(region) : toLinesInOrder(region);

  // Un incantesimo comincia dalle righe di titolo che precedono la riga "Livello N scuola (classi)".
  const starts = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].first.italic || !L.header.test(lines[i].text.trim())) continue;
    let n = i;
    while (n > 0 && lines[n - 1].parts.every(isHeading)) n--;
    if (n === i) throw new Error(`Titolo non trovato prima di: ${lines[i].text}`);
    starts.push({ name: n, header: i });
  }

  const spells = [];
  starts.forEach((s, k) => {
    const stop = k + 1 < starts.length ? starts[k + 1].name : lines.length;
    // Maiuscoletto: "A" + "cid" arrivano come righe separate ma attaccate.
    const name = lines
      .slice(s.name, s.header)
      .map((l) => l.text.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    // Campi: intestazione, poi le quattro etichette, ciascuna fino alla successiva.
    const meta = { header: "" };
    let field = "header";
    let i = s.header;
    for (; i < stop; i++) {
      const line = lines[i];
      const t = line.text.trim();
      const label = L.labels.findIndex((x) => x.test(t));
      if (label >= 0) {
        field = label;
        meta[field] = t.replace(L.labels[label], "").trim();
      } else if (field === "header" ? line.first.italic : !isBody(line.first)) {
        // Le classi e i componenti lunghi vanno a capo: la riga continua il campo corrente.
        meta[field] = `${meta[field]} ${t}`.trim();
      } else break;
    }
    spells.push({ name, meta, body: lines.slice(i, stop), lang });
  });
  return spells.map((sp) => finish(sp, L));
}

/** Righe del corpo -> paragrafi. Le righe non in Cambria sono tabelle: restano una per riga. */
function paragraphs(body) {
  const out = [];
  let cur = null;
  const flush = () => {
    if (cur) out.push(cur);
    cur = null;
  };
  for (const l of body) {
    const base = l.left < 440 ? 95 : 470;
    const indent = l.left - base;
    const text = l.text.replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (!l.parts.some(isBody)) {
      flush();
      out.push({ text: l.parts.map((p) => p.text.trim()).filter(Boolean).join(" | "), table: true });
      continue;
    }
    // Due stili: paragrafo normale (prima riga rientrata, le altre no) e voce di elenco
    // con titoletto (prima riga a filo, le altre rientrate).
    const indented = indent >= 8 && indent <= 40;
    const headOpen = cur && cur.runIn !== null && !cur.runInDone;
    const bullet = text.startsWith("•");
    // Una frase lasciata a metà continua comunque: capita a cavallo di colonna o pagina,
    // o quando una riga comincia con parole in grassetto che non sono un titoletto.
    const midSentence = cur && !/[.:!?]["»”)]?$/.test(cur.text.trim()) && cur.text.trim() !== "";
    const runIn = l.first.runIn && !midSentence;
    const startsPara =
      !cur || (headOpen ? false : bullet || runIn || (midSentence && /^\p{Ll}/u.test(text) ? false : cur.hanging ? !indented : indented));
    if (startsPara) {
      flush();
      cur = { text: "", runIn: runIn ? "" : null, hanging: bullet || (runIn && !indented) };
    }
    // Il titoletto può andare a capo: si accumula finché le righe restano in grassetto.
    let piece = text;
    if (cur.runIn !== null && !cur.runInDone) {
      const m = l.raw.match(/^((?:<i><b>.*?<\/b><\/i>|<b>.*?<\/b>)+)(.*)$/);
      if (m) {
        const head = decode(m[1].replace(/<[^>]+>/g, ""));
        cur.runIn = join(cur.runIn, head.replace(/\s+/g, " ").trimStart());
        piece = decode(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
        if (piece || /[.:]\s*$/.test(head)) cur.runInDone = true;
      } else cur.runInDone = true;
    }
    cur.text = join(cur.text, piece);
  }
  flush();
  return out;
}

/** Unisce due righe, ricomponendo le parole spezzate dal trattino di a capo. */
function join(a, b) {
  if (!a) return b;
  if (!b) return a;
  if (/\p{L}-$/u.test(a) && /^\p{Ll}/u.test(b) && !/\d\p{L}*-$/u.test(a)) return a.slice(0, -1) + b;
  return `${a.replace(/\s+$/, "")} ${b}`;
}

function finish(sp, L) {
  const head = sp.meta.header.replace(/\s+/g, " ").trim();
  const m = head.match(L.header);
  const [level, schoolWord] = sp.lang === "it" ? (m[3] ? [0, m[3]] : [Number(m[2]), m[1]]) : m[3] ? [0, m[3]] : [Number(m[1]), m[2]];
  const school = L.schools[schoolWord.toLowerCase()];
  const classWords = head.slice(head.indexOf("(") + 1, head.lastIndexOf(")")).split(",").map((s) => s.trim().toLowerCase());
  const lists = classWords.map((c) => L.classes[c]);
  if (!school || lists.some((c) => !c)) throw new Error(`Intestazione non capita (${sp.name}): ${head}`);
  const [cast, range, comp, dur] = L.labels.map((_, i) => (sp.meta[i] ?? "").replace(/\s+/g, " ").trim());
  if (!cast || !range || !comp || !dur) throw new Error(`Campi mancanti (${sp.name}): ${JSON.stringify(sp.meta)}`);

  const paras = paragraphs(sp.body);
  const hi = paras.findIndex((p) => p.runIn && L.higher.test(`${p.runIn} `.replace(/\s+/g, " ")));
  const desc = hi < 0 ? paras : paras.slice(0, hi);
  const higher = hi < 0 ? [] : paras.slice(hi);
  const render = (p, skipHead) => (p.table ? p.text : p.runIn && !skipHead ? `**${p.runIn.trim()}** ${p.text}`.trim() : p.text);
  return {
    name: sp.name,
    level,
    school,
    lists,
    castingTime: cast.replace(L.ritual, ""),
    ritual: L.ritual.test(cast),
    range,
    components: comp,
    duration: dur,
    concentration: L.concentration.test(dur),
    description: desc.map((p) => render(p)).join("\n"),
    higherLevels: higher.map((p, i) => render(p, i === 0)).join("\n") || undefined,
    higherKind: hi < 0 ? undefined : /trucchetto|cantrip/i.test(higher[0].runIn) ? "cantrip" : "slot",
    hasTable: paras.some((p) => p.table),
  };
}

/* ------------------------------------------------------------------ */
/* Abbinamento italiano <-> inglese                                    */
/* ------------------------------------------------------------------ */

const diceOf = (s) => [...`${s.description} ${s.higherLevels ?? ""}`.replace(/\s+/g, "").matchAll(/\d+d\d+/g)].map((m) => m[0]).sort().join(",");
const letters = (s) => s.components.replace(/\(.*$/, "").replace(/[^VSM]/g, "");
const sig = (s, withDice) =>
  [s.level, s.school, [...s.lists].sort().join("+"), s.ritual ? "R" : "", s.concentration ? "C" : "", letters(s), withDice ? diceOf(s) : ""].join("|");

/** Coppie che i dati non distinguono: nome inglese -> nome italiano. */
const MANUAL = {
  "Ray of Frost": "Raggio di gelo",
  "Shocking Grasp": "Stretta folgorante",
  "Find Familiar": "Trova famiglio",
  "Floating Disk": "Disco fluttuante",
  Fireball: "Palla di fuoco",
  "Lightning Bolt": "Fulmine",
  Fear: "Paura",
  "Major Image": "Immagine maggiore",
  "Plant Growth": "Crescita vegetale",
  "Speak with Plants": "Parlare con i vegetali",
  Fly: "Volare",
  "Gaseous Form": "Forma gassosa",
  "Flesh to Stone": "Carne in pietra",
  "Move Earth": "Muovere il terreno",
};

function match(it, en) {
  const pairs = new Map();
  const freeIt = new Set(it);
  const freeEn = new Set(en);
  const pair = (a, b) => {
    pairs.set(a, b);
    freeIt.delete(a);
    freeEn.delete(b);
  };
  for (const [enName, itName] of Object.entries(MANUAL)) {
    const a = it.find((s) => s.name === itName);
    const b = en.find((s) => s.name === enName);
    if (!a || !b) throw new Error(`Abbinamento manuale non valido: ${enName} -> ${itName}`);
    pair(a, b);
  }
  for (const withDice of [true, false]) {
    const group = (set) => {
      const g = new Map();
      for (const s of set) g.set(sig(s, withDice), [...(g.get(sig(s, withDice)) ?? []), s]);
      return g;
    };
    const gi = group(freeIt);
    const ge = group(freeEn);
    for (const [k, a] of gi) {
      const b = ge.get(k);
      if (a.length === 1 && b?.length === 1) pair(a[0], b[0]);
    }
  }
  return { pairs, freeIt: [...freeIt], freeEn: [...freeEn] };
}

/* ------------------------------------------------------------------ */
/* Meccaniche ricavate dal testo italiano                              */
/* ------------------------------------------------------------------ */

const ABILITY = { Forza: "str", Destrezza: "dex", Costituzione: "con", Intelligenza: "int", Saggezza: "wis", Carisma: "cha" };
const DAMAGE = {
  acido: "acid",
  contundenti: "bludgeoning",
  freddo: "cold",
  fuoco: "fire",
  forza: "force",
  fulmine: "lightning",
  necrotici: "necrotic",
  perforanti: "piercing",
  veleno: "poison",
  psichici: "psychic",
  radiosi: "radiant",
  taglienti: "slashing",
  tuono: "thunder",
};
const dice = (s) => s.replace(/\s+/g, "");

function mechanics(s) {
  const d = s.description;
  const out = {};
  if (/attacco (a distanza con incantesimo|con incantesimo a distanza)/.test(d)) out.attack = "ranged";
  else if (/attacco (in mischia con (questo )?incantesimo|con incantesimo in mischia)/.test(d)) out.attack = "melee";
  const save = d.match(/tiro salvezza su (Forza|Destrezza|Costituzione|Intelligenza|Saggezza|Carisma)/);
  if (save) out.save = ABILITY[save[1]];

  const dmg = d.match(/(\d+d\d+(?: \+ \d+)?) danni (?:da )?(\p{L}+)/u);
  const heal = d.match(/punti ferita pari a (\d+d\d+)( più il (?:suo |proprio )?modificatore di caratteristica da incantatore)?/);
  const up = s.higherLevels?.match(/aument\p{L}+ di (\d+d\d+) per ogni slot/u);
  if (heal && (!dmg || heal.index < dmg.index)) {
    out.roll = { kind: "heal", dice: dice(heal[1]), ...(heal[2] ? { addMod: true } : {}) };
  } else if (dmg && DAMAGE[dmg[2]]) {
    out.roll = { kind: "damage", dice: dice(dmg[1]), damageType: DAMAGE[dmg[2]] };
    // "4d12 danni da forza più il modificatore di caratteristica da incantatore"
    const tail = d.slice(dmg.index + dmg[0].length, dmg.index + dmg[0].length + 60);
    if (/^\s*(?:più|\+) il (?:suo |proprio )?modificatore di caratteristica da incantatore/.test(tail)) out.roll.addMod = true;
  }
  if (out.roll) {
    if (s.higherKind === "slot" && up) out.roll.perSlotLevel = up[1];
    if (s.higherKind === "cantrip" && /aument\p{L}+ di \d+d\d+ quando/u.test(s.higherLevels)) out.roll.cantripScaling = true;
  }
  return out;
}

const timing = (cast) => (/^azione bonus/i.test(cast) ? "bonus" : /^azione/i.test(cast) ? "action" : /^reazione/i.test(cast) ? "reaction" : "special");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* ------------------------------------------------------------------ */

const it = parseSpells("it");
const en = parseSpells("en");
const { pairs, freeIt, freeEn } = match(it, en);

if (report || freeIt.length) {
  console.log(`Italiano: ${it.length}  Inglese: ${en.length}  Abbinati: ${pairs.size}`);
  const row = (s) => `  L${s.level} ${s.school} [${s.lists.join(",")}] ${letters(s)}${s.ritual ? " R" : ""}${s.concentration ? " C" : ""} {${diceOf(s)}}  ${s.name}`;
  if (freeIt.length) {
    console.log("\nNon abbinati (IT):\n" + freeIt.map(row).sort().join("\n"));
    console.log("\nNon abbinati (EN):\n" + freeEn.map(row).sort().join("\n"));
  }
}
if (freeIt.length) {
  console.error("\nAggiungi le coppie mancanti in MANUAL e rilancia.");
  process.exit(1);
}

const spells = it
  .map((s) => {
    const e = pairs.get(s);
    return {
      id: slug(e.name),
      name: s.name,
      // Il maiuscoletto del PDF lascia qualche parola con maiuscole a metà ("SplASh").
      nameEn: e.name.replace(/\p{L}*\p{Ll}\p{Lu}\p{L}*/gu, (w) => w.charAt(0) + w.slice(1).toLowerCase()),
      level: s.level,
      school: s.school,
      castingTime: cap(s.castingTime),
      timing: timing(s.castingTime),
      range: cap(s.range),
      components: s.components,
      duration: cap(s.duration),
      ...(s.concentration ? { concentration: true } : {}),
      ...(s.ritual ? { ritual: true } : {}),
      lists: s.lists,
      description: s.description,
      ...(s.higherLevels ? { higherLevels: s.higherLevels } : {}),
      ...mechanics(s),
    };
  })
  .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, "it"));

const ids = new Set(spells.map((s) => s.id));
if (ids.size !== spells.length) throw new Error("Id duplicati");

if (report) {
  console.log("\nTiri automatici ricavati dal testo:");
  for (const s of spells) {
    if (!s.roll && !s.attack) continue;
    const r = s.roll;
    console.log(`  L${s.level} ${s.id.padEnd(30)} ${s.attack ? `atk:${s.attack}` : ""} ${s.save ?? ""} ${r ? `${r.kind} ${r.dice} ${r.damageType ?? ""}${r.addMod ? " +mod" : ""}${r.perSlotLevel ? ` up:${r.perSlotLevel}` : ""}${r.cantripScaling ? " scaling" : ""}` : ""}`);
  }
  console.log(`\nCon tabelle nel testo: ${it.filter((s) => s.hasTable).map((s) => s.name).join(", ")}`);
}

const banner = `// File generato da scripts/build-spells.mjs: non modificarlo a mano.
// Fonte: System Reference Document 5.2.1 di Wizards of the Coast LLC, licenza CC-BY-4.0.
// Le correzioni ai tiri automatici vanno in overrides.ts.
`;
writeFileSync(OUT, `${banner}import type { SpellDef } from "@dnd/engine";\n\nexport const SRD_SPELL_DATA: SpellDef[] = ${JSON.stringify(spells, null, 1)};\n`);
console.log(`Scritti ${spells.length} incantesimi in ${OUT}`);
