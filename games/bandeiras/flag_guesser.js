// flag_guesser.js - Adivinhe a Bandeira (Digitação)

// --- DOM ELEMENTS (Atualizados) ---
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const currentFlagImage = document.getElementById('current-flag'); 
const npcStatement = document.getElementById('npc-statement'); 
const answerInput = document.getElementById('answer-input'); // NOVO
const submitButton = document.getElementById('submit-button'); // NOVO
const feedbackMessage = document.getElementById('feedback-message');
const overlay = document.getElementById('overlay');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// --- CONSTANTS ---
const TIME_LIMIT = 60; // Tempo total de jogo em segundos
const BASE_SCORE = 10; // Pontuação por acerto

// --- GAME STATE ---
let gameState = 'waiting';
let score = 0;
let timeLeft = TIME_LIMIT;
let currentQuestion = null;
let intervalTimer = null;
let isAnimating = false;

// --- FLAG BANK (COM URLs REAIS - Mantido) ---
const FLAG_BANK = [
    { flag_url: "https://flagcdn.com/br.svg", correct_name: "Brasil"},
    { flag_url: "https://flagcdn.com/ar.svg", correct_name: "Argentina"},
    { flag_url: "https://flagcdn.com/jp.svg", correct_name: "Japão"},
    { flag_url: "https://flagcdn.com/it.svg", correct_name: "Itália"},
    { flag_url: "https://flagcdn.com/es.svg", correct_name: "Espanha"},
    { flag_url: "https://flagcdn.com/fr.svg", correct_name: "França"},
    { flag_url: "https://flagcdn.com/de.svg", correct_name: "Alemanha"},
    { flag_url: "https://flagcdn.com/pt.svg", correct_name: "Portugal"},
    { flag_url: "https://flagcdn.com/us.svg", correct_name: "Estados Unidos"},
    { flag_url: "https://flagcdn.com/ca.svg", correct_name: "Canadá"},
    { flag_url: "https://flagcdn.com/cn.svg", correct_name: "China"},
    // Adicione mais bandeiras aqui!
];

// --- FUNÇÕES AUXILIARES ---

/**
 * Normaliza uma string: remove acentos, espaços extras e converte para minúsculo.
 * @param {string} str - A string a ser normalizada.
 * @returns {string} A string normalizada.
 */
function normalizeString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD") // Decompõe os caracteres (ex: á -> a + ´)
        .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
        .trim(); // Remove espaços em branco no início e fim
}


// --- FUNÇÕES DE JOGO ---

/**
 * Inicializa o jogo.
 */
function initializeGame() {
    score = 0;
    timeLeft = TIME_LIMIT;
    gameState = 'playing';
    scoreValue.textContent = score;
    timerValue.textContent = timeLeft;
    feedbackMessage.textContent = '';
    
    gameOverScreen.classList.add('hidden');
    overlay.classList.add('hidden');
    startButton.classList.add('hidden');

    // Habilita o input
    answerInput.disabled = false;
    submitButton.disabled = false;
    answerInput.value = '';
    
    startGameTimer();
    loadNextQuestion();
}

/**
 * Inicia o timer do jogo. (Mantido)
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
 * Carrega a próxima bandeira/pergunta.
 */
function loadNextQuestion() {
    // Escolhe uma pergunta aleatória do banco
    const randomIndex = Math.floor(Math.random() * FLAG_BANK.length);
    currentQuestion = FLAG_BANK[randomIndex];

    // Atualiza a interface
    currentFlagImage.src = currentQuestion.flag_url;
    currentFlagImage.alt = `Bandeira de ${currentQuestion.correct_name}`;
    npcStatement.textContent = "De qual país é esta bandeira?";
    
    // Limpa o input e restaura o foco
    answerInput.value = '';
    answerInput.focus();
    
    feedbackMessage.textContent = '';
    answerInput.classList.remove('correct', 'incorrect');
    isAnimating = false;
}

/**
 * Verifica a resposta do jogador.
 */
function checkAnswer() {
    if (gameState !== 'playing' || isAnimating) return;
    isAnimating = true;

    const userAnswer = normalizeString(answerInput.value);
    const correctAnswer = normalizeString(currentQuestion.correct_name);
    
    const correct = userAnswer === correctAnswer;

    answerInput.disabled = true;
    submitButton.disabled = true;

    if (correct) {
        score += BASE_SCORE;
        scoreValue.textContent = score;
        answerInput.classList.add('correct');
        feedbackMessage.textContent = `✅ Certo! ${currentQuestion.correct_name}!`;
    } else {
        score = Math.max(0, score - BASE_SCORE / 2); // Penalidade
        scoreValue.textContent = score;
        answerInput.classList.add('incorrect');
        feedbackMessage.textContent = `❌ Errado! A bandeira é de ${currentQuestion.correct_name}.`;
    }

    // Espera para carregar a próxima pergunta
    setTimeout(() => {
        if (timeLeft > 0) {
            answerInput.disabled = false;
            submitButton.disabled = false;
            loadNextQuestion();
        }
    }, 1500);
}

/**
 * Encerra o jogo. (Mantido)
 */
function endGame() {
    gameState = 'finished';
    if (intervalTimer) clearInterval(intervalTimer);

    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    answerInput.disabled = true;
    submitButton.disabled = true;
}

// --- EVENT LISTENERS ---
startButton.addEventListener('click', initializeGame);
restartButton.addEventListener('click', initializeGame);
submitButton.addEventListener('click', checkAnswer);

// Permite submeter a resposta pressionando Enter no campo de texto
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && gameState === 'playing' && !answerInput.disabled) {
        checkAnswer();
    }
});

// Inicialização da tela
if (gameState === 'waiting') {
    gameOverScreen.classList.add('hidden');
    overlay.classList.remove('hidden');
    startButton.classList.remove('hidden');
}
