// 1. Importações (Apenas UMA de cada serviço)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Configuração
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
const provider = new GoogleAuthProvider();

// --- CADASTRO ---
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

// --- LOGIN ---
window.logarComRole = async (email, senha) => {
    const btn = document.getElementById('btnAcao');
    const originalText = btn.innerText;
    try {
        btn.innerText = "Carregando..."; 
        btn.disabled = true;

        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dados = docSnap.data();
            alert(`Olá novamente, ${dados.nome}!`);
            window.location.href = dados.role === 'professor' ? "painel-professor.html" : "index.html";
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao logar: Verifique suas credenciais.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

// --- LOGIN COM GOOGLE ---
window.loginGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const docRef = doc(doc(db, "usuarios", user.uid));
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
        window.location.href = "index.html";
    } catch (error) {
        console.error("Erro no Google Login:", error);
    }
};

// --- RECUPERAR SENHA ---
window.recuperarSenha = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Sucesso! Verifique seu e-mail para redefinir a senha.");
    } catch (error) {
        console.error("Erro ao recuperar:", error);
        alert("Erro ao enviar e-mail. Verifique se o endereço está correto.");
    }
};
