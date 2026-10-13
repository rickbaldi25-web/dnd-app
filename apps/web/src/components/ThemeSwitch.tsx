import { useEffect, useState } from "react";

type Theme = "auto" | "light" | "dark";

const KEY = "theme";
const ORDER: Theme[] = ["auto", "light", "dark"];
const LABEL: Record<Theme, string> = { auto: "automatico", light: "pergamena", dark: "notte" };

function stored(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "auto";
  } catch {
    return "auto";
  }
}

/** Tema chiaro, scuro o deciso dal dispositivo. La scelta resta in questo browser. */
export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(stored);

  useEffect(() => {
    // "auto" = nessun attributo: decide prefers-color-scheme (vedi tokens.css)
    if (theme === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    try {
      if (theme === "auto") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, theme);
    } catch {
      /* archiviazione bloccata: la scelta vale solo per questa visita */
    }
  }, [theme]);

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]!;
  return (
    <button className="btn theme-btn" onClick={() => setTheme(next)} title={`Passa a: ${LABEL[next]}`}>
      Tema: {LABEL[theme]}
    </button>
  );
}
