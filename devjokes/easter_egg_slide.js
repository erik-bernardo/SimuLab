/**
 * easter_egg_slide.js
 * Ativa um Easter Egg visual onde o logo-ícone desliza pela tela
 * com um rastro de estrelas.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÃO ---
    const secretCode = ['G', 'A', 'B', 'R', 'I', 'E', 'L']; 
    let codeIndex = 0; 
    const targetElement = document.body;
    const logoSrc = 'dados/logo-icon.png'; // 💡 AJUSTE o caminho para seu ícone, se necessário!

    // --- 2. CSS PARA O EASTER EGG ---
    const eggStyles = `
        /* Estilo para o ícone animado */
        #egg-icon {
            position: fixed;
            width: 80px;
            height: 80px;
            z-index: 9999;
            pointer-events: none; /* Ignora cliques no ícone */
            transform: translate(0, 0); /* Garante que as transformações funcionem */
        }

        /* Estilo para as partículas do rastro */
        .trail-star {
            position: fixed;
            width: 10px;
            height: 10px;
            background-color: #D2691E; /* Sua cor principal */
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            z-index: 9998;
            /* Animação para o desvanecimento */
            animation: fadeOut 1s ease-out forwards;
        }

        @keyframes fadeOut {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0.5);
                opacity: 0;
            }
        }
    `;
    
    // Injeta os estilos no <head>
    const styleSheet = document.createElement("style");
    styleSheet.innerText = eggStyles;
    document.head.appendChild(styleSheet);


    // --- 3. FUNÇÕES DE ANIMAÇÃO E LÓGICA ---
    let animationInterval;
    let iconElement;
    
    // Função para gerar o rastro de partículas
    function generateTrail(x, y) {
        // Gera algumas partículas aleatórias para o rastro
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('div');
            star.classList.add('trail-star');
            
            // Adiciona um pequeno desvio aleatório na posição inicial
            const randX = x + Math.random() * 20 - 10;
            const randY = y + Math.random() * 20 - 10;
            
            star.style.left = `${randX}px`;
            star.style.top = `${randY}px`;
            
            // Define o tempo de vida da estrela
            star.style.animationDuration = `${0.8 + Math.random() * 0.4}s`; 

            targetElement.appendChild(star);

            // Remove a partícula do DOM após a animação
            star.addEventListener('animationend', () => star.remove());
        }
    }

    // Função principal de animação do ícone
    function animateIcon() {
        // Cria a trajetória (um caminho simples em forma de seno/cosseno)
        const time = Date.now() / 1500; // Controla a velocidade
        const amplitude = window.innerHeight / 2 - 100; // Altura máxima
        const offsetX = window.innerWidth / 2;
        const offsetY = window.innerHeight / 2;
        
        // Posições baseadas no tempo
        const x = offsetX + Math.sin(time * 0.8) * (offsetX - 100);
        const y = offsetY + Math.cos(time * 1.2) * amplitude;

        iconElement.style.left = `${x - 40}px`; // -40 para centralizar
        iconElement.style.top = `${y - 40}px`;

        // Gera o rastro na posição atual
        generateTrail(x, y);
    }
    
    // --- 4. CONTROLE DO EASTER EGG ---

    function activateEasterEgg() {
        console.log("%c 🚀 SimuLab: Modo Foguete Ativado! 🚀", 
            "background: #D2691E; color: white; padding: 5px; border-radius: 5px; font-size: 1.1em;");

        // Cria e insere o ícone
        iconElement = document.createElement('img');
        iconElement.src = logoSrc;
        iconElement.id = 'egg-icon';
        targetElement.appendChild(iconElement);

        // Inicia o loop de animação a cada 50ms
        animationInterval = setInterval(animateIcon, 50);

        // Remove o event listener (para evitar que seja acionado repetidamente)
        document.removeEventListener('keydown', handleKeyDown);

        // Define um temporizador para reverter o efeito após 10 segundos
        setTimeout(() => {
            deactivateEasterEgg();
        }, 10000); // Exibe por 10 segundos
    }

    function deactivateEasterEgg() {
        // Para a animação
        clearInterval(animationInterval);
        
        // Remove o ícone do DOM
        if (iconElement) {
            iconElement.remove();
        }

        // Remove quaisquer partículas remanescentes
        document.querySelectorAll('.trail-star').forEach(star => star.remove());

        // Restaura o event listener
        document.addEventListener('keydown', handleKeyDown);
    }
    
    // --- 5. LÓGICA DE DETECÇÃO DA SEQUÊNCIA ---

    function handleKeyDown(e) {
        // Impede que a sequência seja acionada se o usuário estiver digitando em um input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        const pressedKey = e.key.toUpperCase();
        
        if (pressedKey === secretCode[codeIndex]) {
            codeIndex++;
            
            if (codeIndex === secretCode.length) {
                activateEasterEgg();
                codeIndex = 0; 
            }
        } else {
            codeIndex = 0;
        }
    }

    // Inicia a escuta por teclas
    document.addEventListener('keydown', handleKeyDown);
});
