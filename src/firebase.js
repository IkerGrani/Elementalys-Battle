import { initializeApp } from "https://esm.sh/firebase/app";
import { getAnalytics } from "https://esm.sh/firebase/analytics";
import { getAuth } from "https://esm.sh/firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMjyZ5gMH57KmbtzHzebvUDKJhlDI7-sk",
  authDomain: "elementalys-battle.firebaseapp.com",
  projectId: "elementalys-battle",
  storageBucket: "elementalys-battle.firebasestorage.app",
  messagingSenderId: "811738272401",
  appId: "1:811738272401:web:7ec884b2252fc9dae2e530",
  measurementId: "G-JVTFBMNVH2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
