import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD3-eHPjAMn2bh9OSKOxoOegYnz5u0TKss",
    authDomain: "simulab-236af.firebaseapp.com",
    projectId: "simulab-236af",
    storageBucket: "simulab-236af.firebasestorage.app",
    messagingSenderId: "896702101080",
    appId: "1:896702101080:web:978462e9f99fdb4cb07c2d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Objeto Global
window.userSession = {
    isReady: false, // Indica se o Firebase já terminou de procurar
    isLoggedIn: false,
    uid: null,
    nome: null,
    turma: null,
    role: null,
    fotoUrl: null
};

// Escuta em tempo real
onAuthStateChanged(auth, (user) => {
    if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                window.userSession = {
                    isReady: true,
                    isLoggedIn: true,
                    uid: user.uid,
                    nome: data.nome,
                    turma: data.turma,
                    role: data.role,
                    fotoUrl: data.fotoUrl
                };
            }
            // Dispara evento avisando que os dados chegaram ou mudaram
            window.dispatchEvent(new CustomEvent("sessionUpdate", { detail: window.userSession }));
        });
    } else {
        window.userSession.isReady = true;
        window.userSession.isLoggedIn = false;
        window.userSession.role = 'guest';
        window.dispatchEvent(new CustomEvent("sessionUpdate", { detail: window.userSession }));
    }
});
