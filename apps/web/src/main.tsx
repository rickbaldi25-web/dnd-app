import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadContent } from "./content";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/theme.css";
import "./styles/fullsheet.css";

const root = createRoot(document.getElementById("root")!);

/**
 * Prima i contenuti dei manuali, poi l'app: le pagine li leggono già al primo caricamento.
 * Il codice delle pagine si importa solo dopo, così parte subito il download dei contenuti.
 */
async function start() {
  root.render(<p className="boot">Carico i manuali…</p>);
  try {
    await loadContent();
    const { default: App } = await import("./App");
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (e) {
    root.render(
      <div className="boot">
        <p>Non riesco a scaricare i contenuti: {e instanceof Error ? e.message : String(e)}</p>
        <button className="btn btn-primary" onClick={start}>
          Riprova
        </button>
      </div>,
    );
  }
}
start();
