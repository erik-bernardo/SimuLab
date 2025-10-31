/**
 * easter_egg.js
 * Adiciona o Easter Egg que é ativado pela sequência Konami (modificada).
 */

document.addEventListener('DOMContentLoaded', () => {
    // Sequência de teclas secreta: S I M U L A B
    // Key codes: S (83), I (73), M (77), U (85), L (76), A (65), B (66)
    // Para simplificar, usaremos as teclas do teclado real:
    // S, I, M, U, L, A, B
    
    // A sequência é uma array de strings, correspondendo a event.key
    const secretCode = ['S', 'I', 'M', 'U', 'L', 'A', 'B']; 
    let codeIndex = 0; // Posição atual na sequência

    // Elemento a ser modificado (o body)
    const targetElement = document.body;

    // Estilos originais (para reverter, se quisermos)
    const originalBackgroundColor = window.getComputedStyle(targetElement).backgroundColor;
    const eggBackgroundColor = '#D2691E'; // Sua cor principal
    const eggTextColor = 'white'; // Cor do texto no modo Easter Egg

    function handleKeyDown(e) {
        // Converte a tecla pressionada para maiúscula para comparação
        const pressedKey = e.key.toUpperCase();
        
        // Verifica se a tecla pressionada corresponde à próxima tecla da sequência
        if (pressedKey === secretCode[codeIndex]) {
            codeIndex++;
            
            // Se o índice atingiu o final, a sequência foi digitada corretamente
            if (codeIndex === secretCode.length) {
                activateEasterEgg();
                // Opcional: Reseta o índice para permitir a repetição do Easter Egg
                codeIndex = 0; 
            }
        } else {
            // Se a tecla estiver errada, reseta a sequência
            codeIndex = 0;
        }
    }

    function activateEasterEgg() {
        console.log("%c 🎉 EASTER EGG ATIVADO! Bem-vindo ao modo SimuLab Pro. 🎉", 
            "background: #D2691E; color: white; padding: 5px; border-radius: 5px; font-size: 1.1em;");

        // Aplica o efeito visual: muda a cor de fundo e a cor do texto
        targetElement.style.transition = 'background-color 1s ease'; // Transição suave
        targetElement.style.backgroundColor = eggBackgroundColor;
        targetElement.style.color = eggTextColor; // Mudar a cor do texto para melhor contraste

        // Remove o event listener temporariamente (para evitar que seja acionado repetidamente)
        document.removeEventListener('keydown', handleKeyDown);

        // Define um temporizador para reverter o efeito após 5 segundos
        setTimeout(() => {
            deactivateEasterEgg();
        }, 5000); 
    }

    function deactivateEasterEgg() {
        // Reverte os estilos
        targetElement.style.backgroundColor = originalBackgroundColor;
        targetElement.style.color = 'initial'; // Volta para a cor padrão do CSS (normalmente #333)

        // Restaura o event listener
        document.addEventListener('keydown', handleKeyDown);
    }

    // Inicia a escuta por teclas
    document.addEventListener('keydown', handleKeyDown);
});
