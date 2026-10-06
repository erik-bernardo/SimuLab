// porquê_blast.js - Porquê Blast: Shooter Gramatical (Versão FINAL com Animação de Bala)

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container'); 
const scoreValue = document.getElementById('score-value');
const lifeValue = document.getElementById('life-value');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const feedbackBox = document.getElementById('feedback-box');
const educationalTipBox = document.getElementById('educational-tip-box');
const tipText = document.getElementById('tip-text');

// Elementos DOM do Card
const cardDOMContainer = document.getElementById('card-dom-container');
const cardPartStart = document.getElementById('card-part-start');
const cardPartEnd = document.getElementById('card-part-end');

let tipTimer = 0;
const TIP_DURATION = 3500; 

// --- CONSTANTES DE JOGO ---
const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const NUM_LANES = 4; 
const PLAYER_LANE_Y = GAME_HEIGHT * 0.90; 
const CARD_HEIGHT = 120; 
const CARD_WIDTH = GAME_WIDTH * 0.95; 

// Constantes da Bala
const BULLET_SPEED = 2.0; 
const BULLET_RADIUS = 8; 

const LANE_X_POSITIONS = [ 
    GAME_WIDTH * 0.15, 
    GAME_WIDTH * 0.38, 
    GAME_WIDTH * 0.62, 
    GAME_WIDTH * 0.85  
]; 

const CARD_START_Y = -CARD_HEIGHT; 
const LINE_OF_FIRE_Y = PLAYER_LANE_Y - CARD_HEIGHT / 2; 
const DANGER_LINE_Y = PLAYER_LANE_Y + 10; 

const BASE_SPEED = 0.08; 
const MAX_SPEED = 0.6; 
const SPEED_INCREMENT = 0.000001; 
const SPEED_BOOST = 0.008; 

const PLAYER_MOVE_RATE = 0.2; 
const FLASH_DURATION = 150; 
const CARD_SPACING_Y = GAME_HEIGHT * 0.3; 

const REGRAS_MAP = {
    'Por que': 0, 'Porque': 1, 'Por quê': 2, 'O porquê': 3,
};

// --- BANCO DE PALAVRAS ---
const WORD_BANK = [
    // --- PORQUE (Junto, sem acento: Resposta/Causa/Explicação - Substituível por 'pois', 'já que') ---
    ["Ele não foi à festa (Porque) estava doente.", "Porque", "JUNTO e sem acento: É uma resposta ou explicação (causa)."],
    ["Chorou (Porque) machucou o joelho no recreio.", "Porque", "JUNTO e sem acento: É uma resposta ou explicação (causa)."],
    ["Não durmo bem (Porque) não consigo relaxar à noite.", "Porque", "JUNTO e sem acento: É uma resposta ou explicação (causa)."],
    ["Leve o casaco (Porque) está fazendo muito frio.", "Porque", "JUNTO e sem acento: É uma explicação (motivação)."],
    ["Atrasou-se, (Porque) não se preparou com antecedência.", "Porque", "JUNTO e sem acento: Introduzindo uma explicação/causa."],
    ["Ficamos contentes (Porque) o show foi cancelado.", "Porque", "JUNTO e sem acento: Introduzindo uma explicação/causa."],
    ["Eu liguei (Porque) queria te dar os parabéns.", "Porque", "JUNTO e sem acento: É uma resposta ou explicação (causa)."],
    ["(Porque) sou paciente, as pessoas abusam da minha bondade.", "Porque", "JUNTO e sem acento: Conjunção causal que inicia a oração."],
    ["Comi o bolo inteiro (Porque) estava delicioso.", "Porque", "JUNTO e sem acento: É uma resposta ou explicação (causa)."],
    ["Você veio até aqui (Porque) não conseguiu telefonar?", "Porque", "JUNTO e sem acento: Embora seja pergunta, a função é explicativa ('já que')."],
    ["Decidi pesquisar (Porque) tinha muita curiosidade sobre o assunto.", "Porque", "JUNTO e sem acento: É uma explicação (causa)."],
    ["Ele se atrasou, (Porque) o trânsito estava horrível.", "Porque", "JUNTO e sem acento: É uma explicação ou justificativa."],
    ["Não fui ao mercado (Porque) esqueci a carteira em casa.", "Porque", "JUNTO e sem acento: É uma explicação da ausência."],
    ["Vamos estudar agora (Porque) a prova está chegando.", "Porque", "JUNTO e sem acento: É uma explicação para a ação."],
    ["A criança gritava (Porque) estava com medo do escuro.", "Porque", "JUNTO e sem acento: É a causa do grito."],
    ["Eu te ajudo com prazer (Porque) sou seu amigo.", "Porque", "JUNTO e sem acento: É a causa da ajuda."],
    ["Escolheu aquele curso (Porque) sempre sonhou em ser médico.", "Porque", "JUNTO e sem acento: É a causa da escolha."],
    ["Perdeu o avião (Porque) chegou atrasado no aeroporto.", "Porque", "JUNTO e sem acento: É a causa da perda."],
    ["Saí da sala (Porque) precisava de um pouco de ar fresco.", "Porque", "JUNTO e sem acento: É o motivo da saída."],
    ["O alarme disparou (Porque) alguém abriu a janela.", "Porque", "JUNTO e sem acento: É a causa do disparo."],
    
    // --- POR QUE (Separado, sem acento: Pergunta / Pronome Relativo - Substituível por 'Por qual motivo', 'pelo qual') ---
    ["(Por que) você não me ligou ontem à noite?", "Por que", "SEPARADO e sem acento: Início de pergunta direta ('Por qual motivo')."],
    ["Desejo saber (Por que) você voltou tão tarde para casa.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual razão')."],
    ["(Por que) razão você está tão bravo comigo?", "Por que", "SEPARADO e sem acento: Pergunta direta, com a palavra 'razão' ou 'motivo' implícita ou explícita."],
    ["As causas (Por que) luto, são muito importantes.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelas quais')."],
    ["Não sei (Por que) eu não quero ir ao cinema.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual motivo')."],
    ["O caminho (Por que) passamos era estreito e perigoso.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelo qual')."],
    ["(Por que) você está chorando tanto agora?", "Por que", "SEPARADO e sem acento: Pergunta direta ('Por qual motivo')."],
    ["Ele perguntou (Por que) eu estava tão gentil de repente.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual razão')."],
    ["Os obstáculos (Por que) ela passou a tornaram mais forte.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelos quais')."],
    ["(Por que) motivo ele se atrasou tanto hoje?", "Por que", "SEPARADO e sem acento: Pergunta direta, com 'motivo' explícito."],
    ["Não entendo (Por que) as pessoas agem assim.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual razão')."],
    ["(Por que) não pedimos pizza para o jantar?", "Por que", "SEPARADO e sem acento: Pergunta com sentido de sugestão ('Por qual razão')."],
    ["Os problemas (Por que) me preocupo são financeiros.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelos quais')."],
    ["Queria saber (Por que) eles se mudaram tão de repente.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual motivo')."],
    ["(Por que) o Sol nasce no leste e se põe no oeste?", "Por que", "SEPARADO e sem acento: Pergunta direta ('Por qual razão')."],
    ["A rua (Por que) caminhamos estava deserta.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pela qual')."],
    ["Gostaria de saber (Por que) ele sempre chega atrasado.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual motivo')."],
    ["(Por que) você não me contou a verdade antes?", "Por que", "SEPARADO e sem acento: Pergunta direta ('Por qual motivo')."],
    ["Este é o fim (Por que) devemos lutar.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelo qual')."],
    ["Não sei (Por que) ela insistiu em ir sozinha.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual razão')."],

    // --- POR QUÊ (Separado, com acento: Final de frase - Antes de ponto final, interrogação ou exclamação) ---
    ["Você não comeu nada? (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase interrogativa (antes do ponto)."],
    ["Ele saiu correndo. Ninguém sabe (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase (antes do ponto final)."],
    ["Você não vai viajar? Diga-me (Por quê)!", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase (antes do ponto de exclamação)."],
    ["Não foi convidada, mas não entendi (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da oração ou frase."],
    ["Ele está nervoso. Eu me pergunto (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase interrogativa."],
    ["Você aceitaria um emprego como este? (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Eu sei que você está mentindo, mas não sei (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da oração."],
    ["O jantar não foi servido. (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Eles não vieram à reunião. (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Fazer todo esse esforço extra, (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Ele reclamou do preço, sem saber (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da oração."],
    ["Você não quer falar com ele? Diga (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Ela não se desculpou, e ninguém sabe (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Você voltou tão cedo, (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Ele parou de falar de repente. (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Eles estavam angustiados ontem, sem saber (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da oração."],
    ["Será que ela não vai me perdoar? (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Eu não terminei a tarefa. E (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Não sei por qual motivo, mas ele foi embora. (Por quê)?", "Por quê", "SEPARADO e com acento: Usado no FINAL da frase."],
    ["Ele insistiu em sair sem dizer (Por quê).", "Por quê", "SEPARADO e com acento: Usado no FINAL da oração."],

    // --- O PORQUÊ (Junto, com acento: Substantivo/Motivo - Precedido por artigo/pronome) ---
    ["Gostaria de saber (O porquê) do seu sorriso.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo'), sempre precedido por um determinante."],
    ["Não consigo entender (O porquê) de sua ausência.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Você não vai à festa? Diga-me ao menos um (O porquê).", "O porquê", "JUNTO e acentuado: É um substantivo ('um motivo')."],
    ["Ele acrescentou irritado sem atinar com (O porquê) de sua revolta.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Existem muitos (O porquê) para justificar esta atitude.", "O porquê", "JUNTO e acentuado: Flexionado no plural ('os motivos')."],
    ["Ainda não foi explicado (O porquê) do cancelamento da aula.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Me dê pelo menos um (O porquê) que justifique esse drama.", "O porquê", "JUNTO e acentuado: Precedido por um numeral ('um motivo')."],
    ["Qual é (O porquê) de tanta festa e comemoração?", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo'), precedido de artigo."],
    ["Ninguém me disse (O porquê) daquela decisão.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Quero entender (O porquê) de tanto barulho nesta manhã.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["O (O porquê) de não estar conversando é porque quero concentração.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Não sabia (O porquê) de tanta ansiedade e nervosismo.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Diga-me um (O porquê) para eu me convencer a comprar aquilo.", "O porquê", "JUNTO e acentuado: Precedido pelo numeral 'um' ('um motivo')."],
    ["Ela não fala mais comigo, e eu não sei (O porquê).", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Não me importo com seus (O porquê), só sei que está errado.", "O porquê", "JUNTO e acentuado: Flexionado no plural ('os motivos')."],
    ["Houve uma razão, mas não entendi bem (O porquê) dela.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Deve haver um (O porquê) para ela não ter vindo hoje.", "O porquê", "JUNTO e acentuado: É um substantivo ('um motivo')."],
    ["Eles brigaram, mas o (O porquê) da briga é segredo.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Não sei qual (O porquê) de tanta pressa agora.", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    ["Qual é (O porquê) que justifica essa confusão toda?", "O porquê", "JUNTO e acentuado: É um substantivo ('o motivo')."],
    
    // --- POR QUE (Pronome Relativo - Substituível por 'pelo qual', 'pela qual' e suas flexões) ---
    ["Os caminhos (Por que) andei eram repletos de espinhos.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelos quais')."],
    ["A razão (Por que) ela sempre me liga é para pedir ajuda.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pela qual')."],
    ["Os motivos (Por que) eu lutei foram válidos.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelos quais')."],
    ["O túnel (Por que) passamos existe há muitos anos.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelo qual')."],
    ["A amiga (Por que) me arrisquei não passava de uma falsa.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pela qual')."],
    ["A verdade (Por que) ele sempre me liga é simples.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pela qual')."],
    ["A causa (Por que) ele foi demitido ainda é incerta.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pela qual')."],
    ["Os lugares (Por que) passamos eram encantadores.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelos quais')."],
    ["As dificuldades (Por que) passei me fortaleceram.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelas quais')."],
    ["O argumento (Por que) ele defendeu a tese era fraco.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelo qual')."],

    // --- MISTURADO: POR QUE (Pergunta Indireta) / POR QUE (Pronome Relativo) ---
    ["Ninguém soube o motivo (Por que) ele foi demitido.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelo qual')."],
    ["Quero entender (Por que) você não veio à festa.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual razão')."],
    ["Não entendi (Por que) você está me contando isso.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual motivo')."],
    ["O sofrimento (Por que) passei foi muito grande.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelo qual')."],
    ["(Por que) rota devemos seguir agora para chegar lá?", "Por que", "SEPARADO e sem acento: Pergunta direta ('Por qual')."],
    ["Explique (Por que) o resultado deu errado.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual motivo')."],
    ["Eu não sei (Por que) me sinto tão estranho hoje.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual razão')."],
    ["As consequências (Por que) lutamos são reais.", "Por que", "SEPARADO e sem acento: Pronome relativo ('pelas quais')."],
    ["(Por que) estamos aqui neste momento?", "Por que", "SEPARADO e sem acento: Pergunta direta ('Por qual razão')."],
    ["Não sei dizer (Por que) ele agiu com tanta frieza.", "Por que", "SEPARADO e sem acento: Pergunta indireta ('Por qual motivo')."],
];

// --- ESTADO DO JOGO ---
let gameState = 'waiting'; 
let score = 0;
let lives = 3;
let speed = BASE_SPEED;
let playerTargetLane = 0; 
let playerCurrentX = LANE_X_POSITIONS[0]; 
let activeCard = null; 
let lastTime = 0;
let lastWordIndex = -1; 
let comboCount = 0;        
let hitFlashTimer = 0; 
let floatingScores = []; 
let trailOffset = 0; 
let errorHistory = {}; 
let isShooting = false; 
let bullets = []; // Array para rastrear projéteis ativos

// --- FUNÇÕES DE FEEDBACK E HUD ---

function showFloatingFeedback(rule, correctWord, errorType = 'ERRO!') {
    tipText.innerHTML = `<span style="font-weight:bold; color: #FF4500;">${errorType}</span> A correta era **${correctWord}**.<br>Regra: ${rule}`;
    educationalTipBox.style.opacity = '1';
    tipTimer = TIP_DURATION;
}

function updateFloatingFeedback(deltaTime) {
    if (tipTimer > 0) {
        tipTimer -= deltaTime;
        if (tipTimer <= 0) {
            educationalTipBox.style.opacity = '0';
        }
    }
}

function updateLivesDisplay() {
    lifeValue.textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
}

// --- FUNÇÕES DE DESENHO (NO CANVAS) ---

function drawBackground(deltaTime) {
    ctx.fillStyle = '#10103A'; 
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const laneWidth = (GAME_WIDTH * 0.8) / NUM_LANES;
    const colors = ['#00BFFF', '#3CB371', '#FFD700', '#FF4500']; 
    const lineSpacing = 60; 
    trailOffset = (trailOffset + speed * deltaTime * 5) % lineSpacing;

    for (let i = 0; i < NUM_LANES; i++) {
        const laneStartX = LANE_X_POSITIONS[i] - laneWidth / 2;
        
        ctx.fillStyle = colors[i] + '40'; 
        ctx.fillRect(laneStartX, LINE_OF_FIRE_Y, laneWidth, GAME_HEIGHT - LINE_OF_FIRE_Y);

        ctx.strokeStyle = colors[i] + 'AA';
        ctx.lineWidth = 2;
        
        for (let j = 0; j < 15; j++) {
            let y = LINE_OF_FIRE_Y + (j * lineSpacing) - trailOffset;
            if (y > GAME_HEIGHT) continue;
            
            ctx.beginPath();
            ctx.moveTo(LANE_X_POSITIONS[i], y);
            ctx.lineTo(LANE_X_POSITIONS[i], y + lineSpacing / 2);
            ctx.stroke();
        }
    }
    
    // Linha de perigo/passagem (vermelha)
    ctx.strokeStyle = '#FF4500';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, DANGER_LINE_Y);
    ctx.lineTo(GAME_WIDTH, DANGER_LINE_Y);
    ctx.stroke();

    // Desenha o alvo na pista (lacuna do card)
    if (activeCard) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(activeCard.x, activeCard.y + CARD_HEIGHT / 2, 12, 0, Math.PI * 2); 
        ctx.fill();
    }
}

function drawPlayer() {
    const pX = playerCurrentX;
    const pY = PLAYER_LANE_Y;
    
    ctx.fillStyle = '#666';
    ctx.fillRect(pX - 25, pY, 50, 15);
    
    const municaoCor = ['#00BFFF', '#3CB371', '#FFD700', '#FF4500'][playerTargetLane];
    ctx.fillStyle = municaoCor;
    ctx.beginPath();
    ctx.arc(pX, pY, 20, Math.PI, 0);
    ctx.fill();
    
    const canoLength = isShooting ? 30 : 40;
    ctx.fillRect(pX - 10, pY - canoLength, 20, canoLength); 
}

function drawBullets() {
    for (const bullet of bullets) {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BULLET_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawHitFlash() { 
    if (hitFlashTimer > 0) {
        const alpha = hitFlashTimer / FLASH_DURATION;
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } 
    else if (hitFlashTimer < 0) {
        const alpha = -hitFlashTimer / FLASH_DURATION / 2;
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
}

function drawCombo() { 
    if (comboCount > 1) {
        let comboDisplayAlpha = 1.0; 
        ctx.globalAlpha = comboDisplayAlpha;
        ctx.fillStyle = 'yellow';
        ctx.font = "bold 36px 'Press Start 2P', cursive";
        ctx.textAlign = 'center';
        ctx.fillText(`COMBO x${comboCount}!`, GAME_WIDTH / 2, GAME_HEIGHT * 0.2);
        ctx.globalAlpha = 1.0;
    }
}

function drawFloatingScores(deltaTime) { 
    let activeScores = [];
    ctx.font = "bold 18px 'Press Start 2P', cursive";
    ctx.textAlign = 'center';
    
    for (const scoreItem of floatingScores) {
        scoreItem.y -= 0.1 * deltaTime; 
        scoreItem.alpha -= 0.005 * deltaTime;
        
        if (scoreItem.alpha > 0) {
            ctx.globalAlpha = scoreItem.alpha;
            ctx.fillStyle = scoreItem.bonus ? '#FFD700' : '#00FF66';
            ctx.fillText(scoreItem.text, scoreItem.x, scoreItem.y);
            activeScores.push(scoreItem);
        }
    }
    
    ctx.globalAlpha = 1.0;
    floatingScores = activeScores;
}


// --- LÓGICA DO JOGO ---

function getWordIndexWithDifficulty() { 
    let weightedIndexes = [];
    const maxErrors = Math.max(1, ...Object.values(errorHistory)); 
    
    for(let i = 0; i < WORD_BANK.length; i++) {
        const errorCount = errorHistory[i] || 0;
        let weight = 1; 

        if (errorCount > 0) {
            weight += (errorCount / maxErrors) * 3; 
        }
        
        for(let j = 0; j < Math.ceil(weight); j++) {
            weightedIndexes.push(i);
        }
    }
    
    let newIndex = weightedIndexes[Math.floor(Math.random() * weightedIndexes.length)];
    
    if (newIndex === lastWordIndex && WORD_BANK.length > 1) {
        newIndex = (newIndex + 1) % WORD_BANK.length;
    }
    
    return newIndex;
}

function generateNewCard() {
    if (activeCard) return; 

    let wordIndex = getWordIndexWithDifficulty();
    lastWordIndex = wordIndex;

    const [fraseComLacuna, respostaCorreta, regra] = WORD_BANK[wordIndex];
    const correctLane = REGRAS_MAP[respostaCorreta]; 
    
    const parts = fraseComLacuna.split(respostaCorreta);

    activeCard = {
        x: LANE_X_POSITIONS[correctLane], 
        y: CARD_START_Y, 
        frase: fraseComLacuna, 
        correctLane: correctLane, 
        ruleTip: regra, 
        passed: false, 
        missed: false, 
        wordIndex: wordIndex,
        resposta: respostaCorreta,
        partStart: parts[0].trim(),
        partEnd: parts[1] ? parts[1].trim() : ''
    };
    
    cardPartStart.textContent = activeCard.partStart;
    cardPartEnd.textContent = activeCard.partEnd;
    cardDOMContainer.style.opacity = '1';
    cardDOMContainer.style.width = CARD_WIDTH + 'px'; 
}

function updateCardPosition() {
    if (activeCard) {
        cardDOMContainer.style.top = activeCard.y + 'px';
    } else {
        cardDOMContainer.style.opacity = '0';
        cardDOMContainer.style.top = CARD_START_Y + 'px';
    }
}

function destroyCard(card, isHit) {
    activeCard = null;
    cardDOMContainer.style.opacity = '0';
    setTimeout(generateNewCard, 500); 
}

function updateBullets(deltaTime) {
    let activeBullets = [];
    
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y -= BULLET_SPEED * deltaTime;
        
        if (activeCard && !bullet.hitDetected) {
            
            // Verifica a colisão de altura (atingiu o centro da lacuna)
            const cardCenterY = activeCard.y + CARD_HEIGHT / 2;
            
            if (bullet.y <= cardCenterY) {
                
                // Se o projétil for para a pista da lacuna
                if (bullet.lane === activeCard.correctLane) {
                    bullet.hitDetected = true; 

                    if (bullet.correct) {
                        // ACERTO PERFEITO
                        comboCount++; 
                        let points = 50 + comboCount * 10; 
                        score += points;
                        scoreValue.textContent = score;
                        speed = Math.min(MAX_SPEED, speed + SPEED_BOOST); 
                        hitFlashTimer = FLASH_DURATION; 
                        floatingScores.push({ text: `+${points}`, x: activeCard.x, y: activeCard.y, alpha: 1.0, bonus: (comboCount > 1) });
                        errorHistory[activeCard.wordIndex] = 0;
                        destroyCard(activeCard, true);
                    } else {
                        // ERRO DE MUNIÇÃO (Bala errada na pista certa)
                        activeCard.missed = true; 
                        showFloatingFeedback(activeCard.ruleTip, activeCard.resposta, 'ERRO! (Munição Errada)');
                        
                        lives--;
                        updateLivesDisplay();
                        comboCount = 0; 
                        hitFlashTimer = -FLASH_DURATION * 2; 
                        gameContainer.classList.add('shake');
                        setTimeout(() => gameContainer.classList.remove('shake'), 200);
                        errorHistory[activeCard.wordIndex] = (errorHistory[activeCard.wordIndex] || 0) + 1;
                        
                        destroyCard(activeCard, false);
                        if (lives <= 0) { gameOver(); return; }
                    }
                } else {
                     // A bala está na pista errada, ela continua subindo e é removida quando sair da tela.
                }
            }
        }

        // Mantém a bala ativa se ainda estiver na tela
        if (bullet.y > 0) {
            activeBullets.push(bullet);
        }
    }
    bullets = activeBullets;
}


function updateGame(deltaTime) {
    if (gameState !== 'running') return;

    speed = Math.min(MAX_SPEED, speed + SPEED_INCREMENT * deltaTime); 

    const targetX = LANE_X_POSITIONS[playerTargetLane];
    const deltaX = targetX - playerCurrentX;
    playerCurrentX += deltaX * PLAYER_MOVE_RATE * deltaTime * 0.1;

    hitFlashTimer = hitFlashTimer > 0 ? hitFlashTimer - deltaTime : Math.min(0, hitFlashTimer + deltaTime);

    if (activeCard) {
        activeCard.y += speed * deltaTime; 
        updateCardPosition();

        // LÓGICA: PERDA POR OMISSÃO (PASSOU DA LINHA DE PERIGO)
        if (activeCard.y >= DANGER_LINE_Y && !activeCard.missed) {
            activeCard.missed = true; 
            
            showFloatingFeedback(activeCard.ruleTip, activeCard.resposta, 'ERRO! (Omissão)');
            
            lives--;
            updateLivesDisplay();
            comboCount = 0; 
            hitFlashTimer = -FLASH_DURATION * 2; 
            gameContainer.classList.add('shake');
            setTimeout(() => gameContainer.classList.remove('shake'), 200);
            errorHistory[activeCard.wordIndex] = (errorHistory[activeCard.wordIndex] || 0) + 1;

            destroyCard(activeCard, false);
            
            if (lives <= 0) { gameOver(); return; }
            return;
        }
    } else {
        generateNewCard(); 
    }
}

// 💡 Função de Tiro (SPACE)
function handleShoot() {
    if (gameState !== 'running' || !activeCard) return;
    
    isShooting = true;
    setTimeout(() => isShooting = false, 100); 

    const card = activeCard;
    const bulletLane = playerTargetLane;
    
    // Cria um novo projétil no array `bullets`
    bullets.push({
        x: playerCurrentX,
        y: PLAYER_LANE_Y - 40, 
        lane: bulletLane,
        color: ['#00BFFF', '#3CB371', '#FFD700', '#FF4500'][bulletLane],
        hitDetected: false, 
        correct: bulletLane === card.correctLane 
    });
    
    // Combo é quebrado se atirar no tempo errado ou errado.
    // Se o tiro for correto, ele é refeito na colisão da bala.
    if (bulletLane !== card.correctLane) {
        comboCount = 0; 
    }
}


// --- LOOP PRINCIPAL E CONTROLES ---

let animationFrameId;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    updateGame(deltaTime);
    updateBullets(deltaTime); // Atualiza e verifica a colisão das balas
    updateFloatingFeedback(deltaTime); 

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    drawBackground(deltaTime); 
    drawPlayer();
    drawBullets(); // Desenha a animação da bala

    drawFloatingScores(deltaTime); 
    drawCombo(deltaTime); 
    drawHitFlash(); 

    if (gameState === 'running') {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

function handleKeyPress(e) {
    const key = e.key;

    if ((gameState === 'waiting' || gameState === 'gameover') && key === 'Enter') { 
        startGame(); 
        feedbackBox.classList.add('hidden'); 
        gameOverScreen.classList.add('hidden');
        return; 
    }
    
    if (gameState !== 'running') return;
    
    // Ação de Tiro
    if (key === ' ') { 
        e.preventDefault(); 
        handleShoot(); 
        return;
    }
    
    // Ação de Troca de Pista/Munição
    let newLane = playerTargetLane;

    if (key === 'ArrowLeft') { 
        newLane = Math.max(0, playerTargetLane - 1); 
    } 
    else if (key === 'ArrowRight') { 
        newLane = Math.min(NUM_LANES - 1, playerTargetLane + 1); 
    }
    else if (key === '1') { newLane = 0; } 
    else if (key === '2') { newLane = 1; }
    else if (key === '3') { newLane = 2; }
    else if (key === '4') { newLane = 3; }
    
    playerTargetLane = newLane;
    playerCurrentX = LANE_X_POSITIONS[playerTargetLane]; 
}

function startGame() {
    gameState = 'running';
    score = 0;
    lives = 3;
    speed = BASE_SPEED; 
    playerTargetLane = 0; 
    playerCurrentX = LANE_X_POSITIONS[0];
    activeCard = null;
    bullets = []; // Limpa balas
    comboCount = 0;
    hitFlashTimer = 0; 
    floatingScores = [];
    trailOffset = 0; 
    errorHistory = {}; 
    
    scoreValue.textContent = score;
    updateLivesDisplay();
    gameOverScreen.classList.add('hidden');
    
    educationalTipBox.style.opacity = '0';
    tipTimer = 0;
    
    generateNewCard(); 
    
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameState = 'gameover';
    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
    cancelAnimationFrame(animationFrameId);
    gameContainer.style.transform = ''; 
    educationalTipBox.style.opacity = '0'; 
    cardDOMContainer.style.opacity = '0';
}

function init() {
    canvas.width = GAME_WIDTH; 
    canvas.height = GAME_HEIGHT; 
    
    gameOverScreen.classList.add('hidden'); 
    
    document.getElementById('restart-button').addEventListener('click', () => { startGame(); feedbackBox.classList.add('hidden'); });
    document.getElementById('retry-button').addEventListener('click', () => { startGame(); gameOverScreen.classList.add('hidden'); });
    document.addEventListener('keydown', handleKeyPress);
    
    updateLivesDisplay();
}

init();
