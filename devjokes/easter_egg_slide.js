/**
 * easter_egg_slide.js
 * Ativa um Easter Egg visual onde o logo-ícone desliza pela tela
 * deixando um rastro de arco-íris gerado via CSS, preenchendo a tela.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÃO ---
    const secretCode = ['G', 'A', 'B', 'R', 'I', 'E', 'L']; 
    let codeIndex = 0; 
    const targetElement = document.body;
    const logoSrc = 'devjokes/gabriel.png'; // Caminho para o ícone que se move

    // --- 2. CSS PARA O EASTER EGG ---
    const eggStyles = `
        /* Estilo para o ícone animado */
        #egg-icon {
            position: fixed;
            width: 80px;
            height: 80px;
            z-index: 9999;
            pointer-events: none; /* Ignora cliques no ícone */
            transform: translate(-50%, -50%); /* Centraliza o ícone no ponto (left, top) */
            /* Transição para suavizar o movimento, se houver saltos */
            transition: left 0.05s linear, top 0.05s linear; 
        }

        /* Estilo para as partículas do rastro de arco-íris geradas por CSS */
        .trail-rainbow-css {
            position: fixed;
            width: 0px; /* Começa pequeno */
            height: 0px;
            border-radius: 50%; /* Para ser circular */
            pointer-events: none;
            opacity: 0;
            z-index: 9998;
            background: radial-gradient(circle at center, 
                violet 0%, indigo 14%, blue 28%, green 42%, yellow 56%, orange 70%, red 84%, transparent 100%);
            /* Animação para expandir e desvanecer */
            animation: expandAndFade 3s ease-out forwards; /* Mais longo para preencher mais */
        }

        @keyframes expandAndFade {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            20% {
                opacity: 0.9;
            }
            100% {
                transform: scale(20); /* Expande bastante para preencher a tela */
                opacity: 0;
            }
        }
    `;
    
    // Injeta os estilos no <head>
    const styleSheet = document.createElement("style");
    styleSheet.innerText = eggStyles;
    document.head.appendChild(styleSheet);


    // --- 3. FUNÇÕES DE ANIMAÇÃO E LÓGICA ---
    let animationFrameId; // Usaremos requestAnimationFrame para animações mais suaves
    let iconElement;
    let isActive = false; // Estado para controlar se o Easter Egg está ativo ou não
    
    // Função para gerar o rastro de arco-íris (divs com gradiente)
    function generateTrail(x, y) {
        if (!isActive) return; // Não gera rastro se não estiver ativo

        const rainbowTrail = document.createElement('div');
        rainbowTrail.classList.add('trail-rainbow-css');
        
        // Posição central do rastro
        rainbowTrail.style.left = `${x}px`;
        rainbowTrail.style.top = `${y}px`;
        
        // Define o tempo de vida da partícula
        rainbowTrail.style.animationDuration = `${2.5 + Math.random() * 1}s`; // Varia entre 2.5s e 3.5s

        targetElement.appendChild(rainbowTrail);

        // Remove a partícula do DOM após a animação
        rainbowTrail.addEventListener('animationend', () => rainbowTrail.remove());
    }

    // Função principal de animação do ícone e rastro
    function animateLoop() {
        if (!isActive) {
            cancelAnimationFrame(animationFrameId);
            return;
        }

        const time = Date.now() / 1500; // Controla a velocidade geral do movimento
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Caminho de movimento: figura de Lissajous ou padrões complexos
        // Ajustado para preencher mais a tela e ter mais variações
        const x = (width / 2) + Math.sin(time * 0.6) * (width / 2.5) + Math.cos(time * 1.3) * (width / 8);
        const y = (height / 2) + Math.cos(time * 0.8) * (height / 2.5) + Math.sin(time * 1.5) * (height / 10);

        // Atualiza a posição do ícone
        iconElement.style.left = `${x}px`;
        iconElement.style.top = `${y}px`;

        // Gera o rastro na posição atual
        // Ajustado para gerar rastro a cada 30ms para um preenchimento mais denso
        if (Date.now() % 30 < 10) { // Cria um rastro a cada ~30ms
             generateTrail(x, y);
        }
       
        animationFrameId = requestAnimationFrame(animateLoop); // Próximo frame
    }
    
    // --- 4. CONTROLE DO EASTER EGG ---

    function activateEasterEgg() {
        if (isActive) return; // Evita ativar múltiplas vezes

        console.log("%c 🌈🚀 SIMULAB EM MODO ARCO-ÍRIS INFINITO! 🚀🌈", 
            "background: linear-gradient(to right, violet, indigo, blue, green, yellow, orange, red); color: white; padding: 5px; border-radius: 5px; font-size: 1.2em;");

        isActive = true; // Define o estado como ativo

        // Cria e insere o ícone (se ainda não existir)
        if (!iconElement) {
            iconElement = document.createElement('img');
            iconElement.src = logoSrc;
            iconElement.id = 'egg-icon';
            targetElement.appendChild(iconElement);
        }
        
        // Garante que o ícone esteja visível
        iconElement.style.display = 'block';

        // Remove o event listener (para evitar que seja acionado repetidamente)
        document.removeEventListener('keydown', handleKeyDown);

        // Inicia o loop de animação
        animationFrameId = requestAnimationFrame(animateLoop);

        // Não desativa automaticamente, pois o pedido é para preencher infinitamente.
        // O usuário precisará recarregar a página para desativar.
    }

    function deactivateEasterEgg() {
        // Esta função não será chamada automaticamente para o modo infinito
        // Mas está aqui caso você queira um botão de "desativar" futuramente.
        isActive = false;
        clearInterval(animationInterval); // Parar a antiga animação, se houver
        cancelAnimationFrame(animationFrameId); // Parar o requestAnimationFrame
        
        if (iconElement) {
            iconElement.remove(); // Remove o ícone
            iconElement = null;
        }

        // Remove quaisquer rastros remanescentes
        document.querySelectorAll('.trail-rainbow-css').forEach(el => el.remove());

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
                codeIndex = 0; // Reseta para permitir reativar, se desejar (mas não é necessário para "infinito")
            }
        } else {
            codeIndex = 0;
        }
    }

    // Inicia a escuta por teclas
    document.addEventListener('keydown', handleKeyDown);
});
