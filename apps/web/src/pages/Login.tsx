import { useState } from "react";
import { useAuth } from "../firebase/auth";
import { Seal } from "../components/Seal";
import { useEmulators } from "../firebase/config";

export function Login() {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  return (
    <main className="login">
      <div className="login-card">
        <Seal className="login-seal" />
        <h1 className="login-title">Brock's DnD</h1>
        <div className="login-rule" aria-hidden="true">
          <span />◆<span />
        </div>
        <p className="login-motto">Benvenuto in Brockolandia</p>
        <button
          className="btn btn-primary btn-large login-btn"
          onClick={() => signIn().catch((e) => setError(e?.code === "auth/popup-closed-by-user" ? "" : "Accesso non riuscito. Riprova."))}
        >
          Accedi con Google
        </button>
        {error && <p className="warn">{error}</p>}
        {useEmulators && <p className="muted small">Emulatore attivo: puoi creare un account Google di prova nella finestra che si apre.</p>}
        <p className="login-foot">Fuori dalla mia palude bastardi</p>
      </div>
    </main>
  );
}
