// acento_speed.js - Versão Final (Com Combo Ajustado e Feedback Flutuante)

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container'); 
const scoreValue = document.getElementById('score-value');
const lifeValue = document.getElementById('life-value');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const feedbackBox = document.getElementById('feedback-box');
const messageText = document.getElementById('message-text');
const ruleTip = document.getElementById('rule-tip');

// 💡 NOVAS VARIÁVEIS DE FEEDBACK FLUTUANTE
const educationalTipBox = document.getElementById('educational-tip-box');
const tipText = document.getElementById('tip-text');
let tipTimer = 0;
const TIP_DURATION = 3500; // 3.5 segundos de exibição


// --- CONSTANTES DE JOGO ---
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const NUM_LANES = 3; 
const PLAYER_LANE_Y = GAME_HEIGHT * 0.85; 
const PLAYER_SIZE = 50; 
const CARD_WIDTH = GAME_WIDTH * 0.2;
const CARD_HEIGHT = GAME_HEIGHT * 0.15;

const LANE_X_POSITIONS = [ 
    GAME_WIDTH * 0.2, 
    GAME_WIDTH * 0.5, 
    GAME_WIDTH * 0.8  
]; 

const CARD_START_Y = -CARD_HEIGHT; 
const CARD_COLLECT_Y = GAME_HEIGHT * 0.75; 

const BASE_SPEED = 0.05; 
const MAX_SPEED = 0.5; 
const SPEED_INCREMENT = 0.0000008; 
const SPEED_BOOST = 0.005;         

const PLAYER_MOVE_RATE = 0.2; 
const CAMERA_TILT_MAX = 5; 

// Constantes de Espaçamento e Frequência (AJUSTADAS)
const NORMAL_CARD_SPACING_Y = GAME_HEIGHT * 0.4; 
const WAVE_CARD_SPACING_Y = GAME_HEIGHT * 0.25; 
const WAVE_COOLDOWN = 6000; 


// Cores
const BG_SKY_COLOR = '#87ceeb';
const LANE_SIDE_COLOR = '#6a5acd';
const LANE_CENTER_COLOR = '#9370db';
const PLAYER_COLOR = '#000000';
const CARD_BORDER_COLOR = '#000000';
const CARD_BG_COLOR = '#ffffff';
const CARD_TEXT_COLOR = '#000000';
const FLASH_ACERTO_COLOR = 'rgba(66, 244, 127, 0.4)'; 
const FLASH_ERRO_COLOR = 'rgba(255, 82, 82, 0.4)';  
const TRAIL_LINE_COLOR = '#eeeeee'; 
const DANGER_OVERLAY_COLOR = 'rgba(255, 0, 0, 0.2)';

// --- ESTADO DO JOGO ---
let gameState = 'waiting'; 
let score = 0;
let lives = 3;
let speed = BASE_SPEED;
let playerTargetLane = 1; 
let playerCurrentX = LANE_X_POSITIONS[1]; 
let cards = []; 
let lastTime = 0;
let lastWordIndex = -1; 
let comboCount = 0;        
let hitFlashTimer = 0; 
const FLASH_DURATION = 150; 
let comboDisplayAlpha = 0; 
const COMBO_FADE_SPEED = 0.05; 
let floatingScores = []; 
let trailOffset = 0;     

let errorHistory = {}; 
let dangerousLaneTimer = 0; 
const DANGEROUS_LANE_DURATION = 1500; 
const DANGER_INTERVAL_MIN = 8000;
const DANGER_INTERVAL_MAX = 15000;
let nextDangerTime = DANGER_INTERVAL_MAX;

let waveModeActive = false;
let waveCardsRemaining = 0;
const WAVE_MIN_LENGTH = 3;
const WAVE_MAX_LENGTH = 7;
let nextWaveTimer = WAVE_COOLDOWN;


// --- BANCO DE PALAVRAS (Mantido) ---
const WORD_BANK = [
    ["Lâmpada", "Lampada", "Lampadá", "Regra: Todas as proparoxítonas são acentuadas."],
    ["cálculo", "calculo", "calculó", "Regra: Todas as proparoxítonas são acentuadas."],
    ["médico", "medico", "medicó", "Regra: Todas as proparoxítonas são acentuadas."],
    ["Árvore", "Arvore", "Arvorê", "Regra: Todas as proparoxítonas são acentuadas."],
    ["Sílaba", "Silaba", "Silabá", "Regra: Todas as proparoxítonas são acentuadas."],
    ["Café", "Cafe", "Cáfè", "Regra: Oxítonas terminadas em A, E, O (seguidas ou não de S) são acentuadas."],
    ["Avô", "Avo", "Avó", "Regra: Oxítonas terminadas em A, E, O (seguidas ou não de S) são acentuadas."],
    ["Parabéns", "Parabens", "ParábenS", "Regra: Oxítonas terminadas em EM/ENS são acentuadas."],
    ["Armazém", "Armazem", "Armazêm", "Regra: Oxítonas terminadas em EM/ENS são acentuadas."],
    ["Vatapá", "Vatapa", "Vátapa", "Regra: Oxítonas terminadas em A, E, O (seguidas ou não de S) são acentuadas."],
    ["Tênis", "Tenis", "Tenís", "Regra: Paroxítonas terminadas em I(s) são acentuadas."],
    ["Vírus", "Virus", "Virús", "Regra: Paroxítonas terminadas em US são acentuadas."],
    ["Fácil", "Facil", "Facíl", "Regra: Paroxítonas terminadas em L são acentuadas."],
    ["História", "Historia", "Historía", "Regra: Paroxítonas terminadas em ditongo são acentuadas."],
    ["Órgão", "Orgao", "Orgáo", "Regra: Paroxítonas terminadas em ÃO são acentuadas."],
    ["Júri", "Juri", "Jurí", "Regra: Paroxítonas terminadas em I(s) são acentuadas."],
    ["Saúde", "Saude", "Saudé", "Regra: Acentua-se I e U tônicos quando sozinhos ou seguidos de S, formando hiato."],
    ["Piauí", "Piaui", "Piaúi", "Regra: Acentua-se I e U tônicos quando sozinhos ou seguidos de S, formando hiato."],
    ["País", "Pais", "PaísS", "Regra: Acentua-se I e U tônicos quando sozinhos ou seguidos de S, formando hiato."],
    ["Baú", "Bau", "BaÚ", "Regra: Acentua-se I e U tônicos quando sozinhos ou seguidos de S, formando hiato."],
    ["Pé", "Pe", "Pê", "Regra: Monossílabos tônicos terminados em A, E, O (seguidos ou não de S) são acentuados."],
    ["Nós", "Nos", "NoS", "Regra: Monossílabos tônicos terminados em A, E, O (seguidos ou não de S) são acentuados."],
    ["Lá", "La", "LáS", "Regra: Monossílabos tônicos terminados em A, E, O (seguidos ou não de S) são acentuados."],
];

// --- FUNÇÕES DE FEEDBACK FLUTUANTE ---

function showFloatingFeedback(rule, correctWord) {
    // Texto em negrito para a palavra correta e a regra
    tipText.innerHTML = `<span style="font-weight:bold; color: yellow;">ERRO:</span> A correta era **${correctWord}**.<br>${rule}`;
    
    // Mostra a caixa e inicia o timer
    educationalTipBox.style.opacity = '1';
    tipTimer = TIP_DURATION;
}

function updateFloatingFeedback(deltaTime) {
    if (tipTimer > 0) {
        tipTimer -= deltaTime;
        if (tipTimer <= 0) {
            // Esconde a caixa
            educationalTipBox.style.opacity = '0';
        }
    }
}


// --- FUNÇÕES DE DESENHO (Mantidas) ---

function drawBackground(deltaTime) {
    ctx.fillStyle = BG_SKY_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const laneWidth = LANE_X_POSITIONS[1] - LANE_X_POSITIONS[0] + CARD_WIDTH; 
    const drawY = PLAYER_LANE_Y - PLAYER_SIZE;

    trailOffset = (trailOffset + speed * deltaTime * 5) % 80;

    ctx.fillStyle = LANE_SIDE_COLOR;
    ctx.fillRect(LANE_X_POSITIONS[0] - laneWidth / 2, drawY, laneWidth, GAME_HEIGHT - drawY);
    ctx.fillStyle = LANE_CENTER_COLOR; 
    ctx.fillRect(LANE_X_POSITIONS[1] - laneWidth / 2, drawY, laneWidth, GAME_HEIGHT - drawY);
    ctx.fillStyle = LANE_SIDE_COLOR;
    ctx.fillRect(LANE_X_POSITIONS[2] - laneWidth / 2, drawY, laneWidth, GAME_HEIGHT - drawY);
    
    if (dangerousLaneTimer > 0) {
        ctx.fillStyle = DANGER_OVERLAY_COLOR;
        const targetCard = cards.find(card => card.y > CARD_START_Y + 10 && card.y < GAME_HEIGHT);
        const targetLaneIndex = targetCard ? targetCard.correctLane : 1;
        const dangerX = LANE_X_POSITIONS[targetLaneIndex] - laneWidth / 2;
        ctx.fillRect(dangerX, drawY, laneWidth, GAME_HEIGHT - drawY);
    }

    ctx.strokeStyle = TRAIL_LINE_COLOR; 
    ctx.lineWidth = 4;
    const lineX1 = LANE_X_POSITIONS[0] + laneWidth / 2;
    const lineX2 = LANE_X_POSITIONS[1] + laneWidth / 2;
    const lineSpacing = 40; 
    
    for (let i = 0; i < 20; i++) {
        let y = drawY + (i * lineSpacing) - trailOffset;
        if (y > GAME_HEIGHT) continue;
        if (y < drawY) continue; 

        ctx.beginPath();
        ctx.moveTo(lineX1, y);
        ctx.lineTo(lineX1, y + lineSpacing / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(lineX2, y);
        ctx.lineTo(lineX2, y + lineSpacing / 2);
        ctx.stroke();
    }
}

function drawPlayer() {
    ctx.fillStyle = PLAYER_COLOR;
    const pX = playerCurrentX;
    const pY = PLAYER_LANE_Y;
    
    let sizeScale = 1;
    const laneDifference = Math.abs(LANE_X_POSITIONS[playerTargetLane] - playerCurrentX);
    const maxDifference = LANE_X_POSITIONS[1] - LANE_X_POSITIONS[0];
    if (laneDifference > 1) {
        sizeScale = 1 - (laneDifference / maxDifference) * 0.1; 
    }

    const currentSize = PLAYER_SIZE * sizeScale;
    
    ctx.beginPath();
    ctx.arc(pX, pY, currentSize * 0.4, 0, Math.PI * 2); 
    ctx.fill();
    ctx.fillRect(pX - currentSize * 0.2, pY, currentSize * 0.4, currentSize * 0.7); 
    ctx.closePath();
}

function drawCard(card) {
    const { x, y, words, laneIndex } = card;
    const word = words[laneIndex]; 
    const cardX = x - CARD_WIDTH / 2;
    const cardY = y;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(x, cardY - 40);
    ctx.lineTo(x - 15, cardY - 20);
    ctx.lineTo(x + 15, cardY - 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = CARD_BORDER_COLOR;
    ctx.lineWidth = 4;
    ctx.fillStyle = CARD_BG_COLOR;
    ctx.fillRect(cardX, cardY, CARD_WIDTH, CARD_HEIGHT);
    ctx.strokeRect(cardX, cardY, CARD_WIDTH, CARD_HEIGHT);
    ctx.fillStyle = CARD_TEXT_COLOR;
    ctx.font = `bold ${CARD_HEIGHT * 0.3}px 'Press Start 2P', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, x, cardY + CARD_HEIGHT / 2);
}

function drawCombo(deltaTime) {
    if (comboCount >= 2 && comboDisplayAlpha < 1.0) {
        comboDisplayAlpha = Math.min(1.0, comboDisplayAlpha + COMBO_FADE_SPEED * (deltaTime / 16.6)); 
    } else if (comboCount < 2 && comboDisplayAlpha > 0) {
        comboDisplayAlpha = Math.max(0, comboDisplayAlpha - COMBO_FADE_SPEED * (deltaTime / 16.6)); 
    }
    if (comboDisplayAlpha > 0) {
        const comboText = `${comboCount}X COMBO!`;
        const baseSize = 40;
        const fontSize = baseSize + Math.min(20, comboCount * 2); 
        ctx.font = `bold ${fontSize}px 'Press Start 2P', cursive`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = comboDisplayAlpha; 
        ctx.strokeStyle = 'rgba(0, 0, 0, ' + comboDisplayAlpha + ')';
        ctx.lineWidth = 10;
        ctx.strokeText(comboText, GAME_WIDTH / 2, GAME_HEIGHT / 3);
        ctx.fillStyle = comboCount >= 5 ? '#42f47f' : 'yellow'; 
        ctx.fillText(comboText, GAME_WIDTH / 2, GAME_HEIGHT / 3);
        ctx.globalAlpha = 1.0; 
    }
}

function drawHitFlash() {
    if (hitFlashTimer !== 0) {
        const alpha = Math.abs(hitFlashTimer) / (FLASH_DURATION * 2); 
        ctx.globalAlpha = alpha;
        ctx.fillStyle = hitFlashTimer > 0 ? FLASH_ACERTO_COLOR : FLASH_ERRO_COLOR; 
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.globalAlpha = 1.0;
    }
}

function drawFloatingScores(deltaTime) {
    let activeScores = [];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < floatingScores.length; i++) {
        let fs = floatingScores[i];
        fs.y -= deltaTime * 0.15; 
        fs.alpha -= deltaTime * 0.003; 
        if (fs.alpha > 0) {
            ctx.globalAlpha = fs.alpha;
            ctx.font = fs.bonus ? "bold 24px 'Press Start 2P'" : "20px 'Press Start 2P'";
            ctx.fillStyle = fs.bonus ? '#42f47f' : '#FFFFFF';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.strokeText(fs.text, fs.x, fs.y);
            ctx.fillText(fs.text, fs.x, fs.y);
            activeScores.push(fs);
        }
    }
    ctx.globalAlpha = 1.0;
    floatingScores = activeScores;
}

// --- LÓGICA DO JOGO ---

function getWordIndexWithDifficulty() {
    let weightedIndexes = [];
    const maxErrors = Math.max(0, ...Object.values(errorHistory));
    
    for(let i = 0; i < WORD_BANK.length; i++) {
        const errorCount = errorHistory[i] || 0;
        let weight = 1; 

        if (errorCount > 0) {
            weight += Math.min(2, errorCount / maxErrors * 2);
        }
        
        for(let j = 0; j < Math.ceil(weight); j++) {
            weightedIndexes.push(i);
        }
    }
    
    const newIndex = weightedIndexes[Math.floor(Math.random() * weightedIndexes.length)];
    
    if (newIndex === lastWordIndex) {
        return Math.floor(Math.random() * WORD_BANK.length);
    }
    
    return newIndex;
}

function generateCards() {
    let wordIndex = getWordIndexWithDifficulty();
    lastWordIndex = wordIndex;

    const wordEntry = WORD_BANK[wordIndex];
    const correctLane = Math.floor(Math.random() * NUM_LANES);
    
    let wordsInSet = []; 
    let wrongOptions = [wordEntry[1], wordEntry[2]].filter(w => w !== null);
    
    for(let i = 0; i < NUM_LANES; i++) {
        if (i === correctLane) {
            wordsInSet.push(wordEntry[0]); 
        } else {
            wordsInSet.push(wrongOptions[i % wrongOptions.length] || "Erro"); 
        }
    }

    for(let i = 0; i < NUM_LANES; i++) {
        cards.push({
            x: LANE_X_POSITIONS[i],
            y: CARD_START_Y, 
            words: wordsInSet, 
            correctLane: correctLane, 
            laneIndex: i, 
            ruleTip: wordEntry[3], 
            passed: false,
            cleaned: false,
            wordIndex: wordIndex 
        });
    }

    if (waveModeActive) {
        waveCardsRemaining--;
    }
}

function updateGame(deltaTime) {
    if (gameState !== 'running') return;

    speed = Math.min(MAX_SPEED, speed + SPEED_INCREMENT * deltaTime); 

    // Lógica de Perigo (Timer)
    if (nextDangerTime > 0) {
        nextDangerTime -= deltaTime;
    } else if (dangerousLaneTimer <= 0) {
        dangerousLaneTimer = DANGEROUS_LANE_DURATION;
        nextDangerTime = Math.random() * (DANGER_INTERVAL_MAX - DANGER_INTERVAL_MIN) + DANGER_INTERVAL_MIN;
    }
    if (dangerousLaneTimer > 0) {
        dangerousLaneTimer -= deltaTime;
    }
    
    // Lógica de Onda de Cards
    if (!waveModeActive) {
        nextWaveTimer -= deltaTime;
        if (nextWaveTimer <= 0) {
            waveModeActive = true;
            waveCardsRemaining = Math.floor(Math.random() * (WAVE_MAX_LENGTH - WAVE_MIN_LENGTH + 1)) + WAVE_MIN_LENGTH;
        }
    } else if (waveCardsRemaining <= 0) {
        waveModeActive = false;
        nextWaveTimer = WAVE_COOLDOWN;
    }


    // Câmera Tilt
    const laneX = LANE_X_POSITIONS[playerTargetLane];
    const maxLaneDist = LANE_X_POSITIONS[1] - LANE_X_POSITIONS[0];
    const currentDist = playerCurrentX - laneX;
    let tiltRatio = currentDist / maxLaneDist; 
    
    const currentTilt = CAMERA_TILT_MAX * tiltRatio * 0.5; 
    gameContainer.style.transform = `rotateZ(${currentTilt}deg) scale(1.02)`;


    // Movimento e Flash Timer
    const targetX = LANE_X_POSITIONS[playerTargetLane];
    const deltaX = targetX - playerCurrentX;
    playerCurrentX += deltaX * PLAYER_MOVE_RATE;
    if (Math.abs(deltaX) < 1) { 
        playerCurrentX = targetX;
    }
    hitFlashTimer = hitFlashTimer > 0 ? hitFlashTimer - deltaTime : Math.min(0, hitFlashTimer + deltaTime);

    let activeCards = [];
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.y += speed * deltaTime; 

        if (card.y >= CARD_COLLECT_Y && !card.passed) {
            card.passed = true; 
            
            const isDangerZone = dangerousLaneTimer > 0 && card.laneIndex === card.correctLane;
            let errorOccurred = false;

            if (card.laneIndex === card.correctLane) { 
                
                if (playerTargetLane === card.correctLane && !isDangerZone) {
                    // ACERTO
                    comboCount++; 
                    let points = 10 + comboCount * 2; 
                    score += points;
                    scoreValue.textContent = score;
                    speed = Math.min(MAX_SPEED, speed + SPEED_BOOST); 
                    hitFlashTimer = FLASH_DURATION; 
                    floatingScores.push({ text: `+${points}`, x: LANE_X_POSITIONS[card.laneIndex], y: CARD_COLLECT_Y - 50, alpha: 1.0, bonus: (comboCount * 2) > 0 });
                    errorHistory[card.wordIndex] = 0;
                    
                } else {
                    // ERRO (Perigo ou Omissão)
                    errorOccurred = true;
                }
            } else if (playerTargetLane === card.laneIndex) {
                // ERRO: Colidiu com card ERRADO
                errorOccurred = true;
            }
            
            if (errorOccurred) {
                // 💡 ACIONA FEEDBACK FLUTUANTE SEM PAUSAR
                showFloatingFeedback(card.ruleTip, card.words[card.correctLane]);
                
                lives--;
                updateLivesDisplay();
                comboCount = 0; 
                hitFlashTimer = -FLASH_DURATION * 2; 
                gameContainer.classList.add('shake');
                setTimeout(() => gameContainer.classList.remove('shake'), 200);
                errorHistory[card.wordIndex] = (errorHistory[card.wordIndex] || 0) + 1;
                if (lives <= 0) { gameOver(); return; }
            }
        }
        
        if (card.y < GAME_HEIGHT || !card.cleaned) { 
            activeCards.push(card);
        }
    }
    
    cards = activeCards;

    // LÓGICA DE GERAÇÃO DE CARDS (APLICANDO O NOVO ESPAÇAMENTO)
    let minSpacing = NORMAL_CARD_SPACING_Y;
    if (waveModeActive) {
        minSpacing = WAVE_CARD_SPACING_Y;
    }

    if (cards.length === 0 || cards[cards.length - 1].y > minSpacing) {
         if (waveModeActive && waveCardsRemaining > 0) {
             generateCards();
         } 
         else if (!waveModeActive) {
             generateCards();
         }
    }
}

// --- LOOP PRINCIPAL E CONTROLES ---

let animationFrameId;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    updateGame(deltaTime);
    updateFloatingFeedback(deltaTime); // 💡 NOVO: Atualiza o timer da dica flutuante

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    drawBackground(deltaTime); 
    cards.forEach(card => drawCard(card));
    drawPlayer();

    drawFloatingScores(deltaTime); 
    drawCombo(deltaTime); 
    drawHitFlash(); 

    if (gameState === 'running') {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function handleKeyPress(e) {
    if (gameState === 'waiting' && e.key === 'Enter') { startGame(); return; }
    if (gameState !== 'running') return;
    
    if (e.keyCode === 37) { playerTargetLane = Math.max(0, playerTargetLane - 1); } 
    else if (e.keyCode === 39) { playerTargetLane = Math.min(NUM_LANES - 1, playerTargetLane + 1); }
    
    playerCurrentX = LANE_X_POSITIONS[playerTargetLane]; 
}

function updateLivesDisplay() {
    lifeValue.textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
}

function startGame() {
    gameState = 'running';
    score = 0;
    lives = 3;
    speed = BASE_SPEED; 
    playerTargetLane = 1;
    playerCurrentX = LANE_X_POSITIONS[1];
    cards = [];
    comboCount = 0;
    hitFlashTimer = 0; 
    comboDisplayAlpha = 0; 
    floatingScores = [];
    trailOffset = 0; 
    
    errorHistory = {}; 
    dangerousLaneTimer = 0; 
    nextDangerTime = DANGER_INTERVAL_MAX;

    waveModeActive = false; 
    waveCardsRemaining = 0;
    nextWaveTimer = WAVE_COOLDOWN;
    
    gameContainer.style.transform = '';

    scoreValue.textContent = score;
    updateLivesDisplay();
    gameOverScreen.classList.add('hidden');
    feedbackBox.classList.add('hidden'); 
    
    // 💡 Reseta o feedback flutuante ao iniciar
    educationalTipBox.style.opacity = '0';
    tipTimer = 0;
    
    generateCards(); 
    
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState = 'gameover';
    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
    cancelAnimationFrame(animationFrameId);
    gameContainer.style.transform = ''; 
    educationalTipBox.style.opacity = '0'; // Esconde o feedback ao terminar
}

// --- INICIALIZAÇÃO ---

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', startGame);

function init() {
    canvas.width = GAME_WIDTH; 
    canvas.height = GAME_HEIGHT; 
    
    gameOverScreen.classList.add('hidden'); 
    
    messageText.textContent = "ACENTO SPEED: VERSÃO DE APRENDIZADO FINAL!";
    ruleTip.textContent = "Feedback de erro aparece na lateral, o jogo não pausa. Mantenha o ritmo! ENTER para começar.";
    feedbackBox.classList.remove('hidden'); 
    feedbackBox.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    
    // Garante que o feedback flutuante não apareça no início
    educationalTipBox.style.opacity = '0';
}

init();
