/** Lettore XML minimo: basta per i compendi, che non usano CDATA né namespace nei tag. */
export interface XmlNode {
  tag: string;
  attrs: Record<string, string>;
  children: XmlNode[];
  text: string;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (m, e: string) => {
    if (e.startsWith("#x")) return String.fromCodePoint(parseInt(e.slice(2), 16));
    if (e.startsWith("#")) return String.fromCodePoint(parseInt(e.slice(1), 10));
    return ENTITIES[e] ?? m;
  });
}

export function parseXml(xml: string): XmlNode {
  const root: XmlNode = { tag: "#root", attrs: {}, children: [], text: "" };
  const stack: XmlNode[] = [root];
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<(\/?)([A-Za-z_][\w:.-]*)([^>]*?)(\/?)>|([^<]+)/g;
  for (let m = re.exec(xml); m; m = re.exec(xml)) {
    const top = stack[stack.length - 1]!;
    if (m[5] !== undefined) {
      top.text += decodeEntities(m[5]);
    } else if (!m[2]) {
      continue; // commento o dichiarazione
    } else if (m[1]) {
      // Chiusura: si risale fino al tag corrispondente, tollerando chiusure mancanti.
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i]!.tag === m[2]) {
          stack.length = i;
          break;
        }
      }
    } else {
      const node: XmlNode = { tag: m[2], attrs: {}, children: [], text: "" };
      for (const a of m[3]!.matchAll(/([\w:.-]+)\s*=\s*"([^"]*)"/g)) node.attrs[a[1]!] = decodeEntities(a[2]!);
      top.children.push(node);
      if (!m[4]) stack.push(node);
    }
  }
  return root;
}

export const kids = (n: XmlNode, tag: string): XmlNode[] => n.children.filter((c) => c.tag === tag);
export const kid = (n: XmlNode, tag: string): XmlNode | undefined => n.children.find((c) => c.tag === tag);
/** Testo del primo figlio con quel tag, senza spazi ai lati. */
export const val = (n: XmlNode, tag: string): string => (kid(n, tag)?.text ?? "").trim();
