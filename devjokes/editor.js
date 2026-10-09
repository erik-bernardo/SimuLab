
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÃO ---
    // A sequência de teclas que queremos detectar (pode ser maiúscula ou minúscula)
    const secretCode = ['e', 'd', 't']; 
    const targetUrl = 'https://erik-bernardo.github.io/SimuLabb/stm3/editor.html'; // Para onde vai ser redirecionado
    
    let codeIndex = 0; // Contador para saber em qual letra estamos

    // --- LÓGICA DE DETECÇÃO ---
    function handleKeyDown(e) {
        // 1. Evita ativar se o usuário estiver digitando em um formulário
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // 2. Pega a tecla pressionada e converte para minúscula
        const pressedKey = e.key.toLowerCase();
        
        // 3. Verifica se a tecla batida é a esperada na sequência atual
        if (pressedKey === secretCode[codeIndex]) {
            codeIndex++; // Avança para a próxima letra esperada
            
            // Se chegou no final da sequência (digitou 'banana' completo)
            if (codeIndex === secretCode.length) {
                console.log("🍌 Sequência BANANA detectada! Redirecionando...");
                window.location.href = targetUrl;
                codeIndex = 0; // Reseta o índice (embora a página vá mudar)
            }
        } else {
            // 4. Se errou a letra, verifica se a letra errada é o início de uma nova sequência
            // Exemplo: se digitar "banab...", o último 'b' reinicia a contagem do zero
            if (pressedKey === secretCode[0]) {
                codeIndex = 1;
            } else {
                codeIndex = 0;
            }
        }
    }

    // Inicia a escuta por teclas
    document.addEventListener('keydown', handleKeyDown);
});
