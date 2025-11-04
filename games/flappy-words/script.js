// --- DADOS DO JOGO ---
const bancoDePalavras = [
    { chave: "ALEGRE", correto: "FELIZ", distrator: ["TRISTE", "RÁPIDO"] },
    { chave: "ESCURO", correto: "NOITE", distrator: ["CLARO", "DIA"] },
    { chave: "INÍCIO", correto: "COMEÇO", distrator: ["FIM", "MEIO"] }
    // Adicionar mais conjuntos aqui...
];

// --- VARIÁVEIS DO JOGO ---
const passaro = document.getElementById('passaro');
const container = document.getElementById('jogo-container');
const palavraChaveElement = document.getElementById('palavra-chave');
const placarElement = document.getElementById('placar');
const mensagemJogo = document.getElementById('mensagem-jogo');

let velocidadeQueda = 2; // Gravidade
let velocidadeAscensao = -40; // Impulso do "voo"
let posicaoY = 150;
let placar = 0;
let jogoRodando = false;
let gameInterval, obstaculoInterval;

// --- FUNÇÕES PRINCIPAIS ---

// 1. Inicia/Reinicia o jogo
function iniciarJogo() {
    if (jogoRodando) return;
    
    posicaoY = 150;
    placar = 0;
    placarElement.textContent = "Pontos: 0";
    jogoRodando = true;
    mensagemJogo.style.display = 'none';

    // Limpa obstáculos anteriores
    document.querySelectorAll('.quadrado-obstaculo').forEach(el => el.remove());

    // Loop principal: Queda do pássaro e detecção de colisão
    gameInterval = setInterval(logicaDoJogo, 20); 
    
    // Cria novos obstáculos a cada 2 segundos
    obstaculoInterval = setInterval(criarObstaculo, 2000); 
}

// 2. Lógica de Queda e Movimento
function logicaDoJogo() {
    // Aplica gravidade e atualiza posição
    posicaoY += velocidadeQueda;
    passaro.style.top = posicaoY + 'px';

    // Se bater no chão ou no topo, FIM DE JOGO
    if (posicaoY > container.offsetHeight - passaro.offsetHeight || posicaoY < 0) {
        fimDeJogo("Você caiu! Tente novamente.");
        return;
    }

    // Move e verifica colisão dos obstáculos
    document.querySelectorAll('.quadrado-obstaculo').forEach(obstaculo => {
        let obstaculoX = obstaculo.offsetLeft - 5; // Velocidade de movimento (5px)
        obstaculo.style.left = obstaculoX + 'px';

        // Remoção de obstáculos fora da tela
        if (obstaculoX < -obstaculo.offsetWidth) {
            obstaculo.remove();
        }

        // --- LÓGICA DE COLISÃO E CORRESPONDÊNCIA ---
        if (detectarColisao(passaro, obstaculo)) {
            if (obstaculo.classList.contains('quadrado-correto')) {
                // Acertou!
                placar++;
                placarElement.textContent = `Pontos: ${placar}`;
                obstaculo.remove();
                // Gera um novo par de palavras para o pássaro
                trocarPalavraChave(); 
            } else {
                // Errou!
                fimDeJogo(`Ops! Palavra errada. A correspondência era: ${palavraChaveElement.dataset.correto}`);
            }
        }
    });
}

// 3. Salto do Pássaro
function pular(event) {
    if (!jogoRodando) {
        // Se o jogo não estiver rodando, inicia no primeiro clique
        iniciarJogo();
    } else {
        // Se estiver rodando, aplica o impulso de subida (o pulo)
        posicaoY += velocidadeAscensao;
    }
}

// 4. Criação de Obstáculos
function criarObstaculo() {
    const dados = bancoDePalavras[Math.floor(Math.random() * bancoDePalavras.length)];
    const palavrasNoNivel = [dados.correto, ...dados.distrator];
    
    // Salva a resposta correta no elemento do pássaro para verificação
    palavraChaveElement.textContent = dados.chave;
    palavraChaveElement.dataset.correto = dados.correto;

    // Embaralha as palavras para que o correto não esteja sempre na mesma posição
    palavrasNoNivel.sort(() => Math.random() - 0.5);

    palavrasNoNivel.forEach((palavra, index) => {
        const obstaculo = document.createElement('div');
        obstaculo.className = 'quadrado-obstaculo';
        obstaculo.textContent = palavra;

        // Posição vertical aleatória
        const topPos = Math.random() * (container.offsetHeight - 40);
        obstaculo.style.top = topPos + 'px';

        // Marca o quadrado correto para a lógica de colisão
        if (palavra === dados.correto) {
            obstaculo.classList.add('quadrado-correto');
        }

        container.appendChild(obstaculo);
    });
}

// 5. Função de Colisão (simples)
function detectarColisao(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    // Verifica se os retângulos se sobrepõem
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

// 6. Fim de Jogo
function fimDeJogo(mensagem) {
    clearInterval(gameInterval);
    clearInterval(obstaculoInterval);
    jogoRodando = false;
    mensagemJogo.textContent = `${mensagem} - Fim de Jogo! Pontuação Final: ${placar}. Clique para Recomeçar.`;
    mensagemJogo.style.display = 'block';
}

// 7. Troca a palavra do pássaro
function trocarPalavraChave() {
    // Remove o obstáculo anterior, precisamos de uma nova lógica de criação
    // que garanta que o pássaro só troque de palavra DEPOIS de acertar UMA coluna de obstáculos.

    // No código acima, o 'criarObstaculo' já seleciona a próxima palavra-chave.
    // É uma implementação simples, mas que funciona para este protótipo.
}

// --- EVENT LISTENERS ---
container.addEventListener('click', pular);
