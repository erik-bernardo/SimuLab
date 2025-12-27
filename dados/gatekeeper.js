// Aguarda o sinal do session.js
window.addEventListener("sessionUpdate", (e) => {
    const session = e.detail;

    // Se o Firebase já respondeu e não encontrou login...
    if (session.isReady && !session.isLoggedIn) {
        console.warn("Acesso negado: Usuário não autenticado.");
        window.location.href = "login.html?erro=negado";
        return;
    }

    // Bloqueio por cargo (Exemplo: Aluno tentando entrar em área de Professor)
    const urlAtual = window.location.pathname;
    if (urlAtual.includes("professor") && session.role !== "professor") {
        alert("Acesso restrito a professores.");
        window.location.href = "painel-aluno.html";
    }
});
