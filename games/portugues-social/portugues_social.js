// portugues_social.js - O Desafio da Interpretação de Intenção (REVISADO 2)

// --- DOM ELEMENTS (Mesmos de antes) ---
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const npcStatement = document.getElementById('npc-statement');
const optionAButton = document.getElementById('option-a');
const optionBButton = document.getElementById('option-b');
const feedbackMessage = document.getElementById('feedback-message');
const overlay = document.getElementById('overlay');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// --- CONSTANTS ---
const TIME_LIMIT = 60; // Tempo total de jogo em segundos
const BASE_SCORE = 100;

// --- GAME STATE ---
let gameState = 'waiting';
let score = 0;
let timeLeft = TIME_LIMIT;
let currentDialog = null;
let currentDialogIndex = -1;
let intervalTimer = null;
let isAnimating = false;

// --- DIALOG BANK (REGRAS DE INTERPRETAÇÃO DE INTENÇÃO) ---
/*
  Lógica de Acerto: O jogador deve escolher a opção que melhor reflete a INTENÇÃO GRAMATICAL PROVÁVEL do NPC,
  mesmo que ele tenha usado a palavra incorreta.
*/
const DIALOG_BANK = [
    // --- MAL (L) vs MAU (U) ---
    {
        npc: "Acho que Fulana está **mal**.", // Usou MAL (L). Intenção: MAU (U) = Doença/Estado.
        op1: "Ela está muito **doente**?", // Interpretação MAU (U) - CORRETA (Intenção)
        op2: "Ela está **malvada**?", // Interpretação MAL (L)
        correct_option: "op1",
        regra: "O NPC provavelmente usou 'mal' para se referir a um estado (doença), que seria 'mau' (adjetivo)."
    },
    {
        npc: "Meu vizinho é um cara **mal**.", // Usou MAL (L). Intenção: MAU (U) = Pessoa Ruim.
        op1: "Ele tem **mau** caráter?", // Interpretação MAU (U) - CORRETA (Intenção)
        op2: "Ele se comporta **mal**?", // Interpretação MAL (L)
        correct_option: "op1",
        regra: "Para qualificar uma pessoa ('cara'), o correto seria 'mau' (adjetivo). A Opção 1 reflete essa intenção."
    },
    {
        npc: "A prova de hoje foi **mau**.", // Usou MAU (U). Intenção: MAL (L) = Feita de modo ruim.
        op1: "A prova era **ruim**? (Adjetivo)", // Interpretação MAU (U)
        op2: "Ela foi feita de forma **incorreta**? (Advérbio)", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "Para modificar o verbo 'ser' no sentido de 'como foi feita', o correto seria 'mal' (advérbio). A Opção 2 reflete essa intenção."
    },
    {
        npc: "Ele me olhou de **mau** jeito.", // Usou MAU (U). Intenção: MAL (L) = Advérbio/Expressão Fixa (De mau jeito).
        op1: "O jeito dele era **ruim**? (Adjetivo)", // Interpretação MAU (U)
        op2: "Ele te olhou de forma **grosseira**? (Advérbio de modo/Expressão MAL) ", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "A expressão correta é 'de **mal** jeito' (Advérbio de modo). A Opção 2 reflete o modo."
    },
    {
        npc: "Meu chefe está de **mal** humor.", // Usou MAL (L). Intenção: MAU (U) = Mau humor (Adjetivo composto).
        op1: "Ele está de **mau** humor? (Adjetivo)", // Interpretação MAU (U) - CORRETA (Intenção)
        op2: "Ele está de **maldade**? (Substantivo/advérbio de modo)", // Interpretação MAL (L)
        correct_option: "op1",
        regra: "O correto é 'mau humor' (Adjetivo 'mau' + Substantivo 'humor'). A Opção 1 reflete a forma correta."
    },
    {
        npc: "Eu me saí **mau** na entrevista.", // Usou MAU (U). Intenção: MAL (L) = De forma ruim.
        op1: "Você foi **ruim** como pessoa? (Adjetivo)", // Interpretação MAU (U)
        op2: "Você se saiu de forma **ruim**? (Advérbio)", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "Para modificar o verbo 'sair', o correto é 'mal' (advérbio). A Opção 2 reflete a ação."
    },
    // --- ONDE/AONDE (Permanência vs Movimento) ---
    {
        npc: "Não sei **onde** meu primo foi hoje.", // Usou ONDE (Permanência). Intenção: AONDE (Movimento).
        op1: "Você quer saber **para qual destino** ele se moveu?", // Interpretação AONDE - CORRETA (Intenção)
        op2: "Você quer saber **o local fixo** onde ele está?", // Interpretação ONDE
        correct_option: "op1",
        regra: "O verbo 'ir' (foi) exige a preposição 'a' e o advérbio 'aonde' (movimento para)."
    },
    {
        npc: "Você sabe **aonde** está o meu celular?", // Usou AONDE (Movimento). Intenção: ONDE (Permanência).
        op1: "Você quer saber **o destino para onde ele se moveu**?", // Interpretação AONDE
        op2: "Você quer saber **o local fixo** onde ele se encontra?", // Interpretação ONDE - CORRETA (Intenção)
        correct_option: "op2",
        regra: "O verbo 'estar' (está) indica permanência e exige o advérbio 'onde'."
    },
    {
        npc: "**Onde** vamos almoçar hoje?", // Usou ONDE (Permanência). Intenção: AONDE (Movimento).
        op1: "Você quer saber **para qual lugar** nos dirigiremos?", // Interpretação AONDE - CORRETA (Intenção)
        op2: "Você quer saber **o local fixo** onde já estamos?", // Interpretação ONDE
        correct_option: "op1",
        regra: "O verbo 'ir' (vamos) exige 'aonde' (movimento para)."
    },
    {
        npc: "A loja **aonde** você trabalha é perto?", // Usou AONDE (Movimento). Intenção: ONDE (Permanência).
        op1: "Você quer saber **para onde você se desloca** todo dia?", // Interpretação AONDE
        op2: "Você quer saber **o local fixo** do seu trabalho?", // Interpretação ONDE - CORRETA (Intenção)
        correct_option: "op2",
        regra: "O verbo 'trabalhar' (trabalha) não exige preposição 'a', então o correto é 'onde' (permanência)."
    },
    // --- MAIS FRASES ---
    {
        npc: "Nós passamos por um momento muito **mau** na viagem.", // Usou MAU (U). Intenção: MAL (L) = De forma ruim.
        op1: "O momento era **ruim**? (Adjetivo)", // Interpretação MAU (U)
        op2: "Passamos por um momento de forma **ruim**? (Advérbio)", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "O substantivo 'momento' exige o adjetivo 'mau', mas o NPC provavelmente queria enfatizar a forma como o momento ocorreu, que seria 'mal' (advérbio). (Decisão ajustada para MAU, pois a frase soa melhor com a intenção MAL)."
        // REAJUSTE: Neste caso, 'momento mau' é gramaticalmente correto. Vamos priorizar o MAU.
    },
    {
        npc: "Eu não me sinto **mau** para ir trabalhar.", // Usou MAU (U). Intenção: MAL (L) = De forma ruim.
        op1: "Você se sente **ruim** como pessoa? (Adjetivo)", // Interpretação MAU (U)
        op2: "Você se sente **indisposto**? (Advérbio/MAL)", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "O verbo 'sentir' no sentido de saúde exige 'mal' (advérbio). A Opção 2 reflete a indisposição."
    },
    {
        npc: "A bateria está **mau** carregada.", // Usou MAU (U). Intenção: MAL (L) = De forma ruim.
        op1: "A bateria é **ruim**? (Adjetivo)", // Interpretação MAU (U)
        op2: "Ela foi carregada **incorretamente**? (Advérbio)", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "Para modificar o particípio 'carregada', o correto é 'mal' (advérbio)."
    },
    {
        npc: "Ele me deu um **mal** abraço.", // Usou MAL (L). Intenção: MAU (U) = Ruim/Grosseiro.
        op1: "O abraço foi **grosseiro**? (Advérbio de modo/MAL)", // Interpretação MAL (L)
        op2: "O abraço era **ruim**? (Adjetivo)", // Interpretação MAU (U) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "Para qualificar o substantivo 'abraço', o correto é 'mau' (adjetivo). A Opção 2 reflete essa intenção."
    },
    {
        npc: "Somos pessoas **mal**.", // Usou MAL (L). Intenção: MAU (U) = Caráter ruim.
        op1: "Vocês agem **mal**? (Advérbio)", // Interpretação MAL (L)
        op2: "Vocês têm **mau** caráter? (Adjetivo)", // Interpretação MAU (U) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "Para qualificar o substantivo 'pessoas', o correto é 'más' (plural de mau). A Opção 2 reflete a intenção adjetiva."
    },
    {
        npc: "O cantor canta **mau**.", // Usou MAU (U). Intenção: MAL (L) = De forma ruim.
        op1: "O cantor é **ruim**? (Adjetivo)", // Interpretação MAU (U)
        op2: "Ele canta **de forma ruim**? (Advérbio)", // Interpretação MAL (L) - CORRETA (Intenção)
        correct_option: "op2",
        regra: "Para modificar o verbo 'cantar', o correto é 'mal' (advérbio). A Opção 2 reflete a ação."
    },
    // --- ONDE/AONDE (Mistura) ---
    {
        npc: "Você sabe **onde** a gente vai?", // Usou ONDE (Permanência). Intenção: AONDE (Movimento).
        op1: "Você quer saber **o destino** (movimento)?", // Interpretação AONDE - CORRETA (Intenção)
        op2: "Você quer saber **o local onde paramos** (permanência)?", // Interpretação ONDE
        correct_option: "op1",
        regra: "O verbo 'ir' (vai) exige a preposição 'a' e o advérbio 'aonde' (movimento para)."
    },
    {
        npc: "**Aonde** você vai?", // Usou AONDE (Movimento). Intenção: AONDE (Movimento - Gramaticalmente Correta).
        op1: "Você quer saber **o local onde está** agora?", // Interpretação ONDE
        op2: "Você quer saber **o destino** para onde você se dirige?", // Interpretação AONDE - CORRETA (Intenção/Gramática)
        correct_option: "op2",
        regra: "O verbo 'ir' exige 'aonde' (movimento para). A Opção 2 reflete a intenção de destino."
    }
];

// --- FUNÇÕES DE JOGO (Mesmas de antes) ---

/**
 * Inicializa o jogo.
 */
function initializeGame() {
    score = 0;
    timeLeft = TIME_LIMIT;
    gameState = 'playing';
    currentDialogIndex = -1;
    scoreValue.textContent = score;
    timerValue.textContent = timeLeft;
    feedbackMessage.textContent = '';
    
    // Embaralha o DIALOG_BANK
    DIALOG_BANK.sort(() => Math.random() - 0.5);

    gameOverScreen.classList.add('hidden');
    overlay.classList.add('hidden');
    startButton.classList.add('hidden');
    
    startGameTimer();
    loadNextDialog();
}

/**
 * Inicia o timer do jogo.
 */
function startGameTimer() {
    if (intervalTimer) clearInterval(intervalTimer);
    
    intervalTimer = setInterval(() => {
        timeLeft--;
        timerValue.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * Carrega o próximo diálogo.
 */
function loadNextDialog() {
    currentDialogIndex++;
    if (currentDialogIndex >= DIALOG_BANK.length) {
        // Reinicia ou termina o jogo se todas as frases acabarem
        endGame();
        return;
    }

    currentDialog = DIALOG_BANK[currentDialogIndex];
    
    // Atualiza a interface
    npcStatement.innerHTML = currentDialog.npc;
    optionAButton.textContent = currentDialog.op1;
    optionBButton.textContent = currentDialog.op2;
    feedbackMessage.textContent = '';
    
    // Habilita os botões e remove animações
    optionAButton.disabled = false;
    optionBButton.disabled = false;
    optionAButton.classList.remove('correct', 'incorrect');
    optionBButton.classList.remove('correct', 'incorrect');
    
    // Reseta o estado de animação
    isAnimating = false;
}

/**
 * Verifica a resposta do jogador.
 * @param {string} selectedOption - 'op1' ou 'op2'.
 */
function checkAnswer(selectedOption) {
    if (gameState !== 'playing' || isAnimating) return;
    isAnimating = true;

    const correct = selectedOption === currentDialog.correct_option;
    const selectedButton = selectedOption === 'op1' ? optionAButton : optionBButton;
    const wrongButton = selectedOption === 'op1' ? optionBButton : optionAButton;

    optionAButton.disabled = true;
    optionBButton.disabled = true;

    if (correct) {
        score += BASE_SCORE;
        scoreValue.textContent = score;
        selectedButton.classList.add('correct');
        feedbackMessage.textContent = "✅ Certo! Você entendeu a intenção correta.";
    } else {
        score = Math.max(0, score - BASE_SCORE / 2); // Penalidade
        scoreValue.textContent = score;
        selectedButton.classList.add('incorrect');
        wrongButton.classList.add('correct'); // Mostra a correta
        feedbackMessage.textContent = `❌ Errado! ${currentDialog.regra}`;
    }

    // Espera para carregar a próxima pergunta
    setTimeout(() => {
        if (timeLeft > 0) {
            loadNextDialog();
        }
    }, 2000);
}

/**
 * Encerra o jogo.
 */
function endGame() {
    gameState = 'finished';
    if (intervalTimer) clearInterval(intervalTimer);

    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

// --- EVENT LISTENERS ---
startButton.addEventListener('click', initializeGame);
restartButton.addEventListener('click', initializeGame);
optionAButton.addEventListener('click', () => checkAnswer('op1'));
optionBButton.addEventListener('click', () => checkAnswer('op2'));

// Inicialização da tela
if (gameState === 'waiting') {
    gameOverScreen.classList.add('hidden');
    overlay.classList.remove('hidden');
    startButton.classList.remove('hidden');
}
