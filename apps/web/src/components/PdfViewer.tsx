import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

/*
 * Lettore PDF dentro l'app (PDF.js di Mozilla): funziona uguale su computer e telefono,
 * a differenza del visualizzatore del browser. Disegna solo le pagine che si stanno guardando,
 * così anche un manuale di centinaia di pagine resta leggero.
 */

/** PDF.js è grande: si scarica la prima volta che si apre un documento. */
async function pdfjs() {
  const lib = await import("pdfjs-dist");
  lib.GlobalWorkerOptions.workerSrc ||= new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  return lib;
}

/** Spazio tra una pagina e l'altra, in pixel: serve a calcolare quale pagina si sta guardando. */
const GAP = 8;

/** Una pagina, alla larghezza del lettore. Si disegna quando è vicina allo schermo. */
function Page({ doc, n, width, ratio, visible }: { doc: PDFDocumentProxy; n: number; width: number; ratio: number; visible: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    // Lontano dallo schermo la pagina si cancella: su telefono la memoria è poca.
    if (!visible || !width) {
      canvas.current.width = 0;
      return;
    }
    let cancelled = false;
    let task: { cancel: () => void; promise: Promise<void> } | undefined;
    doc.getPage(n).then((page) => {
      if (cancelled || !canvas.current) return;
      const base = page.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (width / base.width) * dpr });
      const c = canvas.current;
      c.width = viewport.width;
      c.height = viewport.height;
      task = page.render({ canvasContext: c.getContext("2d")!, viewport });
      task.promise.catch(() => undefined);
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [visible, width, doc, n]);
  return (
    <div className="pdf-page" id={`pdf-pagina-${n}`} style={{ height: width * ratio, marginBottom: GAP }}>
      <canvas ref={canvas} aria-label={`Pagina ${n}`} />
    </div>
  );
}

/** Mostra un PDF da un file del computer (Blob) o da un indirizzo che permette di leggerlo. */
/**
 * Testo di ogni pagina, per la ricerca. Le colonne e i riquadri dei manuali escono mescolati,
 * ma per trovare dove si parla di qualcosa basta.
 */
export async function extractPages(source: Blob, onProgress?: (done: number, total: number) => void): Promise<string[]> {
  const lib = await pdfjs();
  const doc = await lib.getDocument({ data: new Uint8Array(await source.arrayBuffer()) }).promise;
  try {
    const pages: string[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const content = await (await doc.getPage(n)).getTextContent();
      pages.push(content.items.map((i) => ("str" in i ? i.str + (i.hasEOL ? "\n" : " ") : "")).join("").replace(/[ \t]+/g, " ").trim());
      onProgress?.(n, doc.numPages);
    }
    return pages;
  } finally {
    doc.destroy();
  }
}

export function PdfViewer({ source, title, onFail, jumpTo }: { source: Blob | string; title: string; onFail?: () => void; jumpTo?: { page: number; at: number } }) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [ratio, setRatio] = useState(1.3);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [goTo, setGoTo] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    let alive = true;
    let loaded: PDFDocumentProxy | undefined;
    setDoc(null);
    setError("");
    (async () => {
      try {
        const lib = await pdfjs();
        const data = typeof source === "string" ? { url: source } : { data: new Uint8Array(await source.arrayBuffer()) };
        loaded = await lib.getDocument(data).promise;
        const first = (await loaded.getPage(1)).getViewport({ scale: 1 });
        if (!alive) return;
        setRatio(first.height / first.width);
        setDoc(loaded);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
        onFail?.();
      }
    })();
    return () => {
      alive = false;
      loaded?.destroy();
    };
  }, [source, onFail]);

  // La larghezza delle pagine segue quella del lettore (e lo zoom).
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    setBoxWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const width = Math.max(0, boxWidth - 16) * zoom;
  // Pagine da disegnare: quelle vicine alla posizione di scorrimento. Le altre restano spazi vuoti della misura giusta.
  const [scrollTop, setScrollTop] = useState(0);
  const pageH = width * ratio + GAP;
  const viewH = box.current?.clientHeight ?? 800;
  const first = pageH ? Math.max(1, Math.floor(scrollTop / pageH)) : 1;
  const last = pageH ? Math.ceil((scrollTop + viewH) / pageH) + 1 : 2;

  const scrollToPage = (n: number) => {
    const el = box.current;
    if (!el || !pageH) return;
    el.scrollTop = (Math.max(1, n) - 1) * pageH;
    setScrollTop(el.scrollTop);
  };
  const jump = () => {
    scrollToPage(Math.floor(Number(goTo)));
    setGoTo("");
  };
  // Salto chiesto da fuori (un risultato della ricerca): appena il documento è pronto.
  const ready = !!doc && pageH > 0;
  useEffect(() => {
    if (ready && jumpTo) scrollToPage(jumpTo.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, jumpTo]);

  return (
    <div className="pdf-viewer">
      <div className="row pdf-tools">
        <span className="small muted">{doc ? `${doc.numPages} pagine` : error ? "" : "Apro il documento…"}</span>
        <button className="btn btn-quiet" aria-label="Rimpicciolisci" disabled={zoom <= 0.5} onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
          −
        </button>
        <span className="small">{Math.round(zoom * 100)}%</span>
        <button className="btn btn-quiet" aria-label="Ingrandisci" disabled={zoom >= 3} onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
          +
        </button>
        {doc && (
          <label className="small">
            Pagina{" "}
            <input type="number" min={1} max={doc.numPages} value={goTo} className="short-input" aria-label="Vai alla pagina" onChange={(e) => setGoTo(e.currentTarget.value)} onKeyDown={(e) => e.key === "Enter" && jump()} />
          </label>
        )}
      </div>
      {error && <p className="small tag-bad-text">Non riesco ad aprire «{title}»: {error}</p>}
      <div ref={box} className="pdf-pages" aria-label={title} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
        {doc && width > 0 && Array.from({ length: doc.numPages }, (_, i) => <Page key={i} doc={doc} n={i + 1} width={width} ratio={ratio} visible={i + 1 >= first && i + 1 <= last} />)}
      </div>
    </div>
  );
}
