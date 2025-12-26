// 1. Importações (Organizadas para evitar duplicidade)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Sua Configuração
const firebaseConfig = {
  apiKey: "AIzaSyD3-eHPjAMn2bh9OSKOxoOegYnz5u0TKss",
  authDomain: "simulab-236af.firebaseapp.com",
  projectId: "simulab-236af",
  storageBucket: "simulab-236af.firebasestorage.app",
  messagingSenderId: "896702101080",
  appId: "1:896702101080:web:978462e9f99fdb4cb07c2d",
  measurementId: "G-9H7YF1731Z"
};

// 3. Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // Provedor do Google

// --- FUNÇÃO DE CADASTRO ---
window.cadastrarComRole = async (email, senha, cargo, nickname) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            nome: nickname,
            email: email,
            role: cargo,
            dataCriacao: new Date()
        });

        alert(`Bem-vindo, ${nickname}! Conta de ${cargo} criada.`);
        window.location.href = "index.html"; 
    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar: " + error.message);
    }
};

// --- FUNÇÃO DE LOGIN ---
window.logarComRole = async (email, senha) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dados = docSnap.data();
            alert(`Olá novamente, ${dados.nome}!`);
            
            if (dados.role === 'professor') {
                window.location.href = "painel-professor.html";
            } else {
                window.location.href = "index.html";
            }
        }
    } catch (error) {
        alert("Erro ao logar: Verifique e-mail e senha.");
    }
};

// --- LOGIN COM GOOGLE ---
window.loginGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(doc(db, "usuarios", user.uid), {
                uid: user.uid,
                nome: user.displayName,
                email: user.email,
                role: "aluno", 
                dataCadastro: new Date()
            });
        }

        alert(`Olá, ${user.displayName}!`);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Erro no Google Login:", error);
    }
};
