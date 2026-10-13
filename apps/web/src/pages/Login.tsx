import { useState } from "react";
import { useAuth } from "../firebase/auth";
import { useEmulators } from "../firebase/config";

export function Login() {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  return (
    <main className="login">
      <div className="login-card">
        <h1 className="login-title">Schede & Sessioni</h1>
        <p>Le schede del tuo gruppo, sempre aggiornate: al tavolo dal telefono o a distanza.</p>
        <button
          className="btn btn-primary btn-large"
          onClick={() => signIn().catch((e) => setError(e?.code === "auth/popup-closed-by-user" ? "" : "Accesso non riuscito. Riprova."))}
        >
          Accedi con Google
        </button>
        {error && <p className="warn">{error}</p>}
        {useEmulators && <p className="muted small">Emulatore attivo: puoi creare un account Google di prova nella finestra che si apre.</p>}
      </div>
    </main>
  );
}
