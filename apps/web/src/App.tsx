import { BrowserRouter, Route, Routes } from "react-router";
import { ThemeSwitch } from "./components/ThemeSwitch";
import { AuthProvider, useAuth } from "./firebase/auth";
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
  const { user, loading } = useAuth();
  if (loading) return <main className="page"><p className="muted">Un attimo…</p></main>;
  if (!user) return <Login />;
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/new" element={<NewCharacter />} />
        <Route path="/c/:id" element={<Sheet />} />
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
