import { useEffect, useState } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from "react-router";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { AuthProvider, useAuth } from "./firebase/auth";
import { Campaign } from "./pages/Campaign";
import { Campaigns } from "./pages/Campaigns";
import { Characters } from "./pages/Characters";
import { Credits } from "./pages/Credits";
import { Login } from "./pages/Login";
import { NewCharacter } from "./pages/NewCharacter";
import { Sheet } from "./pages/Sheet";
import { LogProvider, LogStack } from "./state/log";

function TopBar() {
  const { user, localMode, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  // su telefono il menu è a scomparsa: si richiude da solo quando cambi pagina
  useEffect(() => setOpen(false), [pathname]);
  return (
    <nav className={`topbar ${open ? "is-open" : ""}`}>
      <NavLink to="/" className="brand">
        <img src="/logo.png" alt="" className="brand-mark" />
        Brock's DnD
      </NavLink>
      <button className="icon-btn menu-btn" aria-label={open ? "Chiudi il menu" : "Apri il menu"} aria-expanded={open} aria-controls="topbar-menu" onClick={() => setOpen(!open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div className="topbar-menu" id="topbar-menu">
        <span className="topbar-links">
          <NavLink to="/" end>
            Personaggi
          </NavLink>
          <NavLink to="/campaigns">Campagne</NavLink>
        </span>
        <span className="topbar-user">
          <ThemeSwitch />
          {localMode ? (
            <span className="muted small" title="Senza Firebase: i dati restano in questo browser">Modalità locale</span>
          ) : (
            <>
              {user?.photoUrl && <img src={user.photoUrl} alt="" className="avatar" referrerPolicy="no-referrer" />}
              <span className="small topbar-name">{user?.name}</span>
              <button className="link-btn" onClick={signOut}>
                Esci
              </button>
            </>
          )}
        </span>
      </div>
    </nav>
  );
}

function Shell() {
  const { user, loading, denied, signOut } = useAuth();
  if (loading) return <main className="page"><p className="muted">Un attimo…</p></main>;
  if (!user) return <Login />;
  if (denied) {
    return (
      <main className="page narrow">
        <h1 className="page-title">Accesso non autorizzato</h1>
        <p>
          L'indirizzo {user.email ?? "con cui sei entrato"} non è nella lista di chi può usare questa app. Chiedi a chi la gestisce di aggiungerti, poi riprova.
        </p>
        <button className="btn" onClick={signOut}>
          Esci e cambia account
        </button>
      </main>
    );
  }
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/new" element={<NewCharacter />} />
        <Route path="/c/:id" element={<Sheet />} />
        <Route path="/crediti" element={<Credits />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<Campaign />} />
        <Route path="*" element={<Characters />} />
      </Routes>
      <footer className="app-foot">
        <Link to="/crediti">Crediti e licenze</Link>
      </footer>
      <LogStack />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LogProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </LogProvider>
    </AuthProvider>
  );
}
