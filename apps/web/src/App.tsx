import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { AuthProvider, useAuth } from "./firebase/auth";
import { Campaign } from "./pages/Campaign";
import { Campaigns } from "./pages/Campaigns";
import { Characters } from "./pages/Characters";
import { Login } from "./pages/Login";
import { NewCharacter } from "./pages/NewCharacter";
import { Sheet } from "./pages/Sheet";
import { LogProvider, LogStack } from "./state/log";

function TopBar() {
  const { user, localMode, signOut } = useAuth();
  return (
    <nav className="topbar">
      <a href="/" className="brand">
        Schede & Sessioni
      </a>
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
            <span className="small">{user?.name}</span>
            <button className="link-btn" onClick={signOut}>
              Esci
            </button>
          </>
        )}
      </span>
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
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<Campaign />} />
        <Route path="*" element={<Characters />} />
      </Routes>
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
