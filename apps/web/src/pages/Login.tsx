import { useState } from "react";
import { useAuth } from "../firebase/auth";
import { useEmulators } from "../firebase/config";

/** Un d20 visto di fronte, solo contorni: sta dietro al medaglione come un sigillo. */
function D20() {
  return (
    <svg className="login-d20" viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <polygon points="100,6 181,53 181,147 100,194 19,147 19,53" />
        <polygon points="100,46 152,136 48,136" />
        <path d="M100 6 L100 46 M181 53 L152 136 M181 53 L100 46 M19 53 L100 46 M19 53 L48 136 M181 147 L152 136 M19 147 L48 136 M100 194 L152 136 M100 194 L48 136" />
      </g>
    </svg>
  );
}

export function Login() {
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  return (
    <main className="login">
      <div className="login-card">
        <div className="login-seal">
          <D20 />
          <img src="/logo.png" alt="" className="login-mark" />
        </div>
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
