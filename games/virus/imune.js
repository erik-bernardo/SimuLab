// imune.js - Defesa Imunológica

// --- Configurações do Canvas ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// --- DOM Elements ---
const scoreValueDisplay = document.getElementById('score-value');
const healthValueDisplay = document.getElementById('health-value');
const gameOverlay = document.getElementById('game-overlay');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// --- Game State ---
let gameState = 'waiting';
let score = 0;
let health = 100;
let lastTime = 0;
let gameFrame;

// --- Mouse Tracking ---
let mouseX = W / 2;
let mouseY = H / 2;

// --- PROGRESSÃO DE DIFICULDADE ---
const GameConfig = {
    level: 1,
    levelTimer: 0,
    levelUpTime: 30, // Aumenta a dificuldade a cada 30 segundos
    virusBaseSpeed: 1.5,
    virusSpawnInterval: 90, // 1.5s entre spawns (inicial)
    bacteriumSpawnChance: 0.05, // 5% de chance de spawnar uma bactéria no nível 1
};

/**
 * Retorna o limite máximo de inimigos ativos na tela baseado no nível atual.
 * AJUSTADO: Nível 1 tem limite de 5.
 */
function getCurrentMaxEnemies() {
    if (GameConfig.level === 1) {
        return 5; // NOVO LIMITE MÁXIMO Nível 1
    } else if (GameConfig.level === 2) {
        return 10; // Limite máximo Nível 2
    } else {
        return 15; // Limite máximo Nível 3+
    }
}

// --- Player (Glóbulo Branco) ---
const player = {
    x: W / 2,
    y: H / 2,
    radius: 20,
    color: '#00796b',
    speed: 4, // Mantido em 4
    vx: 0,
    vy: 0
};

// --- Inimigos (Vírus e Bactérias) ---
let enemies = []; // Array unificado para vírus e bactérias
let enemySpawnTimer = 0;

// --- PROJETIL (Anticorpos) ---
let antibodies = [];
const ANTIBODY_SPEED = 10;
const ANTIBODY_COOLDOWN = 15; // Cooldown de 15 frames (0.25s)
let antibodyCooldownTimer = 0;


/**
 * Classe base para todos os inimigos.
 */
class Enemy {
    constructor(x, y, radius, color, baseSpeed, healthDamage, scoreValue) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.baseSpeed = baseSpeed;
        this.healthDamage = healthDamage;
        this.scoreValue = scoreValue;
    }

    update(dt) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const speed = this.baseSpeed * dt;
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        ctx.fillStyle = 'white';
        ctx.arc(this.x, this.y, this.radius / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Vírus: Rápido e Pequeno (Dano leve)
 */
class Virus extends Enemy {
    constructor(x, y) {
        super(x, y, 12, '#d32f2f', GameConfig.virusBaseSpeed, 10, 5);
    }
}

/**
 * Bactéria: Lenta e Grande (Dano Alto)
 */
class Bacterium extends Enemy {
    constructor(x, y) {
        super(x, y, 20, '#ff9800', GameConfig.virusBaseSpeed * 0.5, 30, 15);
        this.color = '#ff9800'; 
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x - this.radius, this.y - this.radius / 2, this.radius * 2, this.radius, this.radius / 2);
        ctx.fill();
        ctx.closePath();
    }
}


class Antibody {
    constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.radius = 5;
        this.color = '#ffeb3b'; 
        this.speed = ANTIBODY_SPEED;
        
        const dx = targetX - startX;
        const dy = targetY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.vx = (dx / distance);
            this.vy = (dy / distance);
        } else {
            this.vx = 0;
            this.vy = 0;
        }
    }

    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    isOffScreen() {
        return this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10;
    }
}


// --- Funções Principais de Jogo ---

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function updatePlayer(dt) {
    player.x += player.vx * player.speed * dt;
    player.y += player.vy * player.speed * dt;

    // Limita o jogador dentro do Canvas
    player.x = Math.max(player.radius, Math.min(W - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(H - player.radius, player.y));
}

/**
 * Ajusta o GameConfig a cada 30 segundos.
 */
function updateDifficulty(dt) {
    const framesPerSecond = 60;
    const framesPerLevelUp = framesPerSecond * GameConfig.levelUpTime; 
    
    GameConfig.levelTimer += dt;
    
    if (GameConfig.levelTimer * (1000/framesPerSecond) >= framesPerLevelUp) {
        GameConfig.level++;
        GameConfig.levelTimer = 0;
        
        // Aumenta a velocidade do vírus
        GameConfig.virusBaseSpeed *= 1.1; 
        
        // Diminui o intervalo de spawn (aumenta a frequência base)
        GameConfig.virusSpawnInterval = Math.max(10, GameConfig.virusSpawnInterval * 0.9);
        
        // Aumenta a chance de spawnar uma Bactéria
        GameConfig.bacteriumSpawnChance = Math.min(0.5, GameConfig.bacteriumSpawnChance + 0.05);

        console.log(`Nível ${GameConfig.level}: Max Enimies: ${getCurrentMaxEnemies()}`);
    }
}

/**
 * Gera um novo inimigo fora da tela, escolhendo entre Vírus e Bactéria, se o limite não foi atingido.
 */
function spawnEnemy() {
    // CHECAGEM DO LIMITE DINÂMICO AQUI
    if (enemies.length >= getCurrentMaxEnemies()) {
        return; 
    }
    
    let x, y;
    const margin = 30; 
    const side = Math.floor(Math.random() * 4);
    let EnemyClass;

    // Decide a classe do inimigo
    if (Math.random() < GameConfig.bacteriumSpawnChance) {
        EnemyClass = Bacterium;
    } else {
        EnemyClass = Virus;
    }
    
    // Calcula as coordenadas de spawn
    switch (side) {
        case 0: x = Math.random() * W; y = -margin; break;
        case 1: x = W + margin; y = Math.random() * H; break;
        case 2: x = Math.random() * W; y = H + margin; break;
        case 3: x = -margin; y = Math.random() * H; break;
    }

    enemies.push(new EnemyClass(x, y));
}

/**
 * Verifica colisão entre dois círculos.
 * @param {object} obj1 
 * @param {object} obj2 
 * @returns {boolean}
 */
function checkCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (obj1.radius + obj2.radius);
}

/**
 * Lógica principal de atualização e detecção de colisão.
 * @param {number} dt - Delta time.
 */
function updateGame(dt) {
    // Cooldown do tiro
    if (antibodyCooldownTimer > 0) {
        antibodyCooldownTimer -= dt;
    }

    // 1. Atualiza o jogador
    updatePlayer(dt);
    
    // 2. Atualiza Dificuldade
    updateDifficulty(dt);

    // 3. Spawn de inimigos
    enemySpawnTimer += dt;
    if (enemySpawnTimer * (1000/60) >= GameConfig.virusSpawnInterval) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }

    // 4. Atualiza Anticorpos
    for (let i = antibodies.length - 1; i >= 0; i--) {
        const antibody = antibodies[i];
        antibody.update(dt);

        // Remove anticorpos fora da tela
        if (antibody.isOffScreen()) {
            antibodies.splice(i, 1);
            continue;
        }
    }

    // 5. Lógica de Colisão
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(dt);
        let enemyWasHit = false;

        // Colisão A: Anticorpo vs Inimigo (Destruição)
        for (let j = antibodies.length - 1; j >= 0; j--) {
            const antibody = antibodies[j];
            if (checkCollision(antibody, enemy)) {
                score += enemy.scoreValue;
                scoreValueDisplay.textContent = score;
                enemies.splice(i, 1); // Inimigo destruído
                antibodies.splice(j, 1); // Anticorpo gasto
                enemyWasHit = true;
                break; 
            }
        }
        
        if (enemyWasHit) continue; 

        // Colisão B: Jogador vs Inimigo (Dano)
        if (checkCollision(player, enemy)) {
            health -= enemy.healthDamage;
            healthValueDisplay.textContent = Math.ceil(health);
            enemies.splice(i, 1); // Inimigo removido (fagocitado ou destruído)
            continue; 
        }
    }
    
    // 6. Verifica Game Over
    if (health <= 0) {
        endGame();
    }
    
    // Atualiza a exibição da vida (garantindo que não seja negativo)
    healthValueDisplay.textContent = Math.max(0, Math.ceil(health));
}

/**
 * Ciclo de animação (Loop do Jogo).
 * @param {number} timestamp - Tempo atual fornecido pelo requestAnimationFrame.
 */
function gameLoop(timestamp) {
    if (gameState !== 'playing') return;

    // Calcula o Delta Time (dt): ajuda a manter a velocidade constante em diferentes taxas de quadros
    const dt = (timestamp - lastTime) / (1000 / 60); 
    lastTime = timestamp;

    // 1. Limpa a tela
    ctx.clearRect(0, 0, W, H);

    // 2. Atualiza a lógica do jogo
    updateGame(dt);

    // 3. Desenha elementos
    drawPlayer();
    enemies.forEach(e => e.draw());
    antibodies.forEach(a => a.draw()); 

    // 4. Repete o loop
    gameFrame = requestAnimationFrame(gameLoop);
}

/**
 * Inicia ou reinicia o jogo.
 */
function startGame() {
    gameState = 'playing';
    score = 0;
    health = 200;
    enemies = [];
    antibodies = [];
    player.x = W / 2;
    player.y = H / 2;
    antibodyCooldownTimer = 0;
    
    // Reseta as configurações de dificuldade
    GameConfig.level = 1;
    GameConfig.levelTimer = 0;
    GameConfig.virusBaseSpeed = 0.5;
    GameConfig.virusSpawnInterval = 200; 
    GameConfig.bacteriumSpawnChance = 0.05;
    
    scoreValueDisplay.textContent = score;
    healthValueDisplay.textContent = health;
    
    gameOverlay.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    startScreen.classList.add('hidden');

    lastTime = performance.now();
    gameLoop(lastTime);
}

/**
 * Encerra o jogo.
 */
function endGame() {
    gameState = 'finished';
    cancelAnimationFrame(gameFrame);
    
    finalScoreDisplay.textContent = score;
    gameOverlay.classList.remove('hidden');
    gameOverScreen.classList.remove('hidden');
    startScreen.classList.add('hidden');
}


// --- Eventos de Controle (W A S D) ---
const keys = {};

document.addEventListener('keydown', (e) => {
    if (gameState === 'playing') {
        keys[e.key.toLowerCase()] = true;
        updateMovement();
    }
});

document.addEventListener('keyup', (e) => {
    if (gameState === 'playing') {
        keys[e.key.toLowerCase()] = false;
        updateMovement();
    }
});

function updateMovement() {
    player.vx = 0;
    player.vy = 0;

    if (keys['a']) player.vx = -1;
    if (keys['d']) player.vx = 1;
    if (keys['w']) player.vy = -1;
    if (keys['s']) player.vy = 1;

    // Normaliza o vetor de movimento
    if (player.vx !== 0 && player.vy !== 0) {
        const magnitude = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        player.vx /= magnitude;
        player.vy /= magnitude;
    }
}

// --- EVENTO DE DISPARO (Mouse Click) ---
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', (e) => {
    if (gameState === 'playing' && antibodyCooldownTimer <= 0) {
        antibodies.push(new Antibody(player.x, player.y, mouseX, mouseY));
        antibodyCooldownTimer = ANTIBODY_COOLDOWN;
    }
});


// --- Event Listeners dos Botões ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Inicialização (mostra a tela de início)
gameOverlay.classList.remove('hidden');
startScreen.classList.remove('hidden');
