import { initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, initializeFirestore, type Firestore } from "firebase/firestore";

const env = import.meta.env;

export const useEmulators = env.VITE_USE_EMULATORS === "true";
/** Senza configurazione Firebase l'app gira in modalità locale (localStorage, niente login). */
export const firebaseEnabled = useEmulators || !!env.VITE_FIREBASE_API_KEY;

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (firebaseEnabled) {
  app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY ?? "demo-key",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID ?? "demo-dnd",
    appId: env.VITE_FIREBASE_APP_ID,
  });
  auth = getAuth(app);
  // ignoreUndefinedProperties: i campi opzionali del personaggio possono essere undefined.
  db = initializeFirestore(app, { ignoreUndefinedProperties: true });
  if (useEmulators) {
    // Raggiungibile anche dai telefoni in LAN: usa l'host da cui è servita la pagina.
    const host = window.location.hostname;
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
  }
}

export { app, auth, db };
