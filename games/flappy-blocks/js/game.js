// js/game.js - Motor do Flappy Bird

const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// --- Variáveis Globais Configuráveis (serão controladas pelos blocos) ---
let config = {
    gravity: 0.5,
    flapStrength: -8,
    pipeSpeed: 2,
    pipeGap: 100,
    pipeFrequency: 90,
    initialBirdY: canvas.height / 2
};

// --- Estado do Jogo ---
let bird;
let pipes = [];
let score = 0;
let frames = 0;
let gameState = 'start'; // 'start', 'playing', 'gameover'
let gameLoopAnimationId = null;

// --- Constantes Visuais ---
const birdColor = '#f2a613';
const pipeColor = '#73bf2e';
const groundColor = '#ded895';
const skyColor = '#70c5ce';
const groundHeight = 100;

// --- Objeto Bird ---
function Bird() {
    this.x = 50;
    this.y = config.initialBirdY;
    this.width = 34;
    this.height = 24;
    this.velocity = 0;

    this.draw = function() {
        ctx.fillStyle = birdColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.update = function() {
        this.velocity += config.gravity;
        this.y += this.velocity;
        if (this.y + this.height > canvas.height - groundHeight) {
            this.y = canvas.height - groundHeight - this.height;
            this.velocity = 0;
            triggerGameOver();
        }
         if (this.y < 0) { this.y = 0; this.velocity = 0; }
    }

    this.flap = function(strength = config.flapStrength) {
        if (gameState === 'playing') {
           this.velocity = strength;
        }
    }

    this.setY = function(yPos) {
        if (gameState === 'playing' || gameState === 'start') { // Evita mudar Y em game over
             const maxY = canvas.height - groundHeight - this.height;
             this.y = Math.max(0, Math.min(yPos, maxY)); // Garante que fique dentro dos limites
        }
    }
}

// --- Canos ---
function Pipe(isTop, height) {
    this.x = canvas.width; this.y = isTop ? 0 : canvas.height - height - groundHeight; this.width = 52; this.height = height; this.passed = false;
    this.draw = function() { ctx.fillStyle = pipeColor; ctx.fillRect(this.x, this.y, this.width, this.height); ctx.fillStyle = '#53821d'; if(isTop) { ctx.fillRect(this.x - 2, this.y + this.height - 20, this.width + 4, 20); } else { ctx.fillRect(this.x - 2, this.y, this.width + 4, 20); } }
    this.update = function() { this.x -= config.pipeSpeed; }
}

function handlePipes() {
    if (frames > 0 && frames % Math.floor(config.pipeFrequency) === 0) {
        const minHeight = 40; // Um pouco menor para garantir espaço
        const maxPipeHeight = canvas.height - groundHeight - config.pipeGap - minHeight;
         if (maxPipeHeight < minHeight) { // Garante que a altura máxima não seja menor que a mínima
            console.warn("Abertura do cano muito grande ou altura do chão/minima muito altos. Ajustando...");
             config.pipeGap = canvas.height - groundHeight - (minHeight * 2); // Ajusta gap
             if (config.pipeGap < 50) config.pipeGap = 50; // Mínimo gap
         }

        const topHeight = Math.floor(Math.random() * (maxPipeHeight - minHeight + 1)) + minHeight;
        const bottomHeight = canvas.height - groundHeight - topHeight - config.pipeGap;
        pipes.push(new Pipe(true, topHeight));
        pipes.push(new Pipe(false, bottomHeight));
    }

     for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        pipes[i].draw();
        if (pipes[i].x + pipes[i].width < 0) { pipes.splice(i, 1); continue; }
         if ( bird && bird.x < pipes[i].x + pipes[i].width && bird.x + bird.width > pipes[i].x && bird.y < pipes[i].y + pipes[i].height && bird.y + bird.height > pipes[i].y ) {
              triggerGameOver();
         }
         if ( bird && !pipes[i].passed && pipes[i].x + pipes[i].width / 2 < bird.x) {
             if (pipes[i].y === 0) {
                 pipes[i].passed = true;
                 if (i + 1 < pipes.length && pipes[i+1].x === pipes[i].x) { pipes[i+1].passed = true; }
                 triggerPassPipe();
             }
         }
     }
}

// --- Chão ---
function drawGround() { ctx.fillStyle = groundColor; ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight); ctx.fillStyle = '#b7a96b'; ctx.fillRect(0, canvas.height - groundHeight, canvas.width, 10); }

// --- Funções de Estado e Eventos (Podem ser Sobrescritas pelos Blocos) ---
var onGameStarts = function() { console.log("Evento: Jogo Iniciado (Padrão)"); };
var onClickOrTap = function() { console.log("Evento: Clique/Toque (Padrão)"); if (bird) bird.flap(); };
var onHitObstacle = function() { if (gameState === 'gameover') return; console.log("Evento: Bateu (Padrão)! Score:", score); stopGameLoop(); drawGameOverScreen(); };
var onPassPipe = function() { score++; console.log("Evento: Passou Cano (Padrão), Score:", score); };
var onEveryFrame = function() { if(bird) bird.update(); }; // Padrão é aplicar gravidade

// --- Funções Auxiliares (Chamadas internamente ou pelos blocos) ---
function initGame() {
    console.log("initGame chamado");
    stopGameLoop(); // Garante que parou
    bird = new Bird(); // Cria novo pássaro com y inicial da config
    pipes = []; score = 0; frames = 0; gameState = 'start';
    drawStartScreen();
}

function startGame() {
    if (gameState === 'start') {
        gameState = 'playing';
        pipes = []; frames = 0; score = 0;
        if(!bird) { // Se por algum motivo não existe, cria
             bird = new Bird();
        }
        bird.y = config.initialBirdY; // Reseta posição Y
        bird.velocity = 0; // Reseta velocidade
        onGameStarts(); // Chama o evento
        if (!gameLoopAnimationId) { gameLoopAnimationId = requestAnimationFrame(gameLoop); } // Inicia loop
    }
}

function triggerGameOver() { if (gameState !== 'playing') return; gameState = 'gameover'; onHitObstacle(); }
function triggerPassPipe() { if (gameState === 'playing') { onPassPipe(); } }
function forceGameOver() { if (gameState === 'playing') { triggerGameOver(); } }
function forceRestartGame() { console.log("Reiniciando via forceRestartGame..."); stopGameLoop(); initGame(); }
function stopGameLoop() { if (gameLoopAnimationId) { cancelAnimationFrame(gameLoopAnimationId); gameLoopAnimationId = null; console.log("Game loop parado."); } }

// --- Desenho de Telas ---
 function drawStartScreen() { clearCanvas(); if(bird) bird.draw(); drawGround(); ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "white"; ctx.font = "20px sans-serif"; ctx.textAlign = "center"; ctx.fillText("Use os Blocos e Clique", canvas.width / 2, canvas.height / 2 - 30); ctx.fillText("'Executar Blocos'", canvas.width / 2, canvas.height / 2 ); ctx.fillText("Depois clique aqui para iniciar", canvas.width / 2, canvas.height / 2 + 30); }
 function drawGameOverScreen() { clearCanvas(); pipes.forEach(pipe => pipe.draw()); if(bird) bird.draw(); drawGround(); ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "white"; ctx.font = "30px sans-serif"; ctx.textAlign = "center"; ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40); ctx.font = "20px sans-serif"; ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2); ctx.font = "16px sans-serif"; ctx.fillText("Clique 'Reiniciar Jogo'", canvas.width / 2, canvas.height / 2 + 40); }
 function drawScore() { ctx.fillStyle = "white"; ctx.font = "30px sans-serif"; ctx.textAlign = "center"; ctx.strokeStyle = "black"; ctx.lineWidth = 3; ctx.strokeText(score, canvas.width / 2, 50); ctx.fillText(score, canvas.width / 2, 50); }
 function clearCanvas() { ctx.fillStyle = skyColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }

// --- Loop Principal ---
function gameLoop() {
    if (gameState === 'playing') {
        clearCanvas(); frames++;
        onEveryFrame(); // Chama evento (pode conter bird.update())
        handlePipes();
        if(bird) bird.draw();
        drawGround(); drawScore();
    } else if (gameState === 'start') { /* Aguarda input */ }
      else if (gameState === 'gameover') { stopGameLoop(); return; } // Para o loop

    gameLoopAnimationId = requestAnimationFrame(gameLoop);
}

// --- Controles ---
function handleInput() {
     if (gameState === 'start') { startGame(); onClickOrTap(); } // Primeiro clique inicia E chama evento
     else if (gameState === 'playing') { onClickOrTap(); } // Cliques seguintes só chamam evento
     // else if (gameState === 'gameover') { /* Botão Reiniciar agora faz isso */ }
}

// Event Listeners (serão adicionados em main.js após Blockly carregar)
