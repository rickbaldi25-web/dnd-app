import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, firebaseEnabled } from "./config";

export interface AppUser {
  uid: string;
  name: string;
  email?: string;
  photoUrl?: string;
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  /** Ha fatto l'accesso, ma il suo indirizzo non è nella lista degli ammessi. */
  denied: boolean;
  /** true se l'app gira senza Firebase (utente locale fisso). */
  localMode: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const LOCAL_USER: AppUser = { uid: "local", name: "Giocatore locale" };

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(firebaseEnabled ? null : LOCAL_USER);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u ? { uid: u.uid, name: u.displayName ?? u.email ?? "Avventuriero", email: u.email ?? undefined, photoUrl: u.photoURL ?? undefined } : null);
      setDenied(false);
      if (!u || !db) {
        setLoading(false);
        return;
      }
      // La lista degli ammessi la applicano le regole di Firestore: qui si prova a leggere il proprio
      // documento per capire subito se si è dentro, invece di mostrare un'app che non carica nulla.
      getDoc(doc(db, "users", u.uid))
        .catch((e) => {
          if (e?.code === "permission-denied") setDenied(true);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const value: AuthState = {
    user,
    loading,
    denied,
    localMode: !firebaseEnabled,
    signIn: async () => {
      if (!auth) return;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    },
    signOut: async () => {
      if (auth) await signOut(auth);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth fuori da AuthProvider");
  return v;
}
