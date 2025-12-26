// Importações necessárias dos módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. SUBSTITUA PELOS SEUS DADOS COPIADOS DO CONSOLE
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "seu-id",
    appId: "seu-app-id"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 2. FUNÇÃO DE CADASTRO (Chamada pelo seu HTML)
window.cadastrarComRole = async (email, senha, cargo, nickname) => {
    try {
        // Cria o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Cria o "perfil" do usuário no Firestore (Banco de Dados)
        await setDoc(doc(db, "usuarios", user.uid), {
            nome: nickname,
            email: email,
            role: cargo,
            dataCriacao: new Date()
        });

        alert(`Bem-vindo, ${nickname}! Conta de ${cargo} criada.`);
        window.location.href = "index.html"; // Redireciona para a home

    } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar: " + error.message);
    }
};

// 3. FUNÇÃO DE LOGIN (Chamada pelo seu HTML)
window.logarComRole = async (email, senha) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Busca os dados do usuário no Firestore para saber se é aluno ou prof
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dados = docSnap.data();
            alert(`Olá novamente, ${dados.nome}!`);
            
            // Redirecionamento inteligente
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
