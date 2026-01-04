// script.js

// --- VARIÁVEIS GLOBAIS DE JOGO E CANVAS ---
let canvas;
let ctx;
let bird, blocks, score, frames, gameState, currentWordSet;
let backgroundX; 
let highscore = 0; 
const highscoreKey = 'flappySinonimoHighscore'; 

// --- SPRITE DO PÁSSARO ---
const birdSprite = new Image();
let birdSpriteLoaded = false;
birdSprite.onload = function() {
    birdSpriteLoaded = true;
};
// *** MUDE ESTE CAMINHO PELO URL OU CAMINHO LOCAL DA SUA IMAGEM DO PÁSSARO ***
birdSprite.src = 'bird.png'; 
const BIRD_COLOR = '#ffda56'; 

// --- SPRITE DE FUNDO ---
const backgroundSprite = new Image();
let backgroundSpriteLoaded = false;
backgroundSprite.onload = function() {
    backgroundSpriteLoaded = true;
};
// *** MUDE ESTE CAMINHO PELO URL OU CAMINHO LOCAL DA SUA IMAGEM DE FUNDO ***
backgroundSprite.src = 'bg.png'; 
const SKY_COLOR = '#70c5ce'; 

// --- DADOS DO JOGO (Banco de Sinônimos - Palavras Comuns e Perfeitas) ---
const bancoDePalavras = [    
    // Sinônimos Perfeitos (do artigo e vocabulário)
    { chave: "ALFABETO", correto: "ABECEDÁRIO", distrator: ["NÚMEROS", "GRAFITE", "SÍMBOLO"] },
    { chave: "VOCABULÁRIO", correto: "LÉXICO", distrator: ["SINTAXE", "PROSA", "VERBO"] },
    { chave: "LÍNGUA", correto: "IDIOMA", distrator: ["FALA", "SOTAQUE", "DIALETO"] }, 
    { chave: "MATRIMÔNIO", correto: "CASAMENTO", distrator: ["DIVÓRCIO", "AMIZADE", "LAÇO"] },
    { chave: "FALECER", correto: "MORRER", distrator: ["VIVER", "RENASCER", "EXISTIR"] },
    { chave: "APÓS", correto: "DEPOIS", distrator: ["ANTES", "DURANTE", "HOJE"] },
    { chave: "BELO", correto: "BONITO", distrator: ["FEIO", "ESTRANHO", "SUJO"] },
    
    // Sinônimos Comuns (Alta Precisão)
    { chave: "ALEGRE", correto: "FELIZ", distrator: ["TRISTE", "CALMO", "IRRITADO"] },    
    { chave: "RÁPIDO", correto: "VELOZ", distrator: ["LENTO", "DEVAGAR", "PARADO"] },    
    { chave: "INÍCIO", correto: "COMEÇO", distrator: ["FIM", "MEIO", "PARADA"] },    
    { chave: "AMPLIAR", correto: "AUMENTAR", distrator: ["DIMINUIR", "REDUZIR", "FECHAR"] },
    { chave: "CALMO", correto: "SERENO", distrator: ["AGITADO", "BRAVO", "NERVOSO"] },    
    { chave: "GRANDE", correto: "ENORME", distrator: ["PEQUENO", "MINÚSCULO", "CURTO"] },    
    { chave: "CORRETO", correto: "CERTO", distrator: ["ERRADO", "FALSO", "DUVIDOSO"] },    
    { chave: "FÁCIL", correto: "SIMPLES", distrator: ["DIFÍCIL", "COMPLEXO", "COMPLICADO"] },    
    { chave: "JUNTAR", correto: "UNIR", distrator: ["SEPARAR", "DIVIDIR", "QUEBRAR"] },    
    { chave: "MUDAR", correto: "ALTERAR", distrator: ["MANTER", "FIXAR", "PRESERVAR"] },    
    { chave: "NOVO", correto: "RECENTE", distrator: ["VELHO", "ANTIGO", "PASSADO"] },    
    { chave: "PAZ", correto: "TRANQUILIDADE", distrator: ["GUERRA", "CAOS", "BARULHO"] },    
    { chave: "SUBIR", correto: "ASCENDER", distrator: ["DESCER", "CAIR", "PARAR"] },    
    { chave: "TERMINAR", correto: "FINALIZAR", distrator: ["COMEÇAR", "INICIAR", "PROLONGAR"] },    
    { chave: "VERDADE", correto: "SINCERIDADE", distrator: ["MENTIRA", "FALSIDADE", "DUVIDA"] },    
    { chave: "FORTE", correto: "POTENTE", distrator: ["FRACO", "FRÁGIL", "SUAVE"] },    
    { chave: "DESISTIR", correto: "ABANDONAR", distrator: ["INSISTIR", "CONTINUAR", "COMEÇAR"] },    
    { chave: "IRADO", correto: "ENFURECIDO", distrator: ["CONTENTE", "CALMO", "FELIZ"] },    
    { chave: "CHEGAR", correto: "ATINGIR", distrator: ["SAIR", "PARTIR", "CAIR"] },    
    { chave: "RESIDIR", correto: "MORAR", distrator: ["VISITAR", "VIAJAR", "PASSAR"] }
];

// --- Variáveis Globais Otimizadas para 800x1000 ---
let gravity = 0.6;
let flapStrength = -10; 
let blockSpeed = 2.0;   
let blockWidth = 140;   
let paddingY = 15;      
let blockFrequency = 350; 
let totalBlocks = 4;    

let blockHeight = 0; 

const groundColor = '#ded895';
const groundHeight = 10;

// --- Objeto Bird (Com lógica de sprite aprimorada) ---
function Bird() {    
    this.x = 100; 
    this.y = canvas.height / 2;    
    this.width = 80;     
    this.height = 60;    
    this.velocity = 0;

    this.draw = function() {        
        if (gameState !== 'gameover') {
            ctx.save();                        
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            ctx.translate(centerX, centerY);                        
            let angle = (this.velocity / 10) * (Math.PI / 4); 
            if (angle > Math.PI / 2) angle = Math.PI / 2; 
            if (angle < -Math.PI / 4) angle = -Math.PI / 4; 
            ctx.rotate(angle);
            
            // Desenho do Pássaro (Sprite ou Fallback - Círculo)
            if (birdSpriteLoaded) {                
                ctx.drawImage(birdSprite, -this.width / 2, -this.height / 2, this.width, this.height);
            } else {                
                ctx.fillStyle = BIRD_COLOR; 
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 4; 
                ctx.stroke();
            }
            ctx.restore(); 
        } else {             
            // Fallback simples para game over
            ctx.fillStyle = BIRD_COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }    
    }

    this.update = function() {        
        this.velocity += gravity;        
        this.y += this.velocity;

        if (this.y + this.height > canvas.height - groundHeight) {            
            this.y = canvas.height - groundHeight - this.height;            
            this.velocity = 0;            
            gameOver("Você bateu no chão!");
        }        
        if (this.y < 0) {            
            this.y = 0;            
            this.velocity = 0;
        }
    }

    this.flap = function() {        
        if (gameState === 'playing') {           
           this.velocity = flapStrength;
        } else if (gameState === 'start') {
            startGame();
            this.velocity = flapStrength;
        }
    }
}

// --- Bloco de Palavra ---
function WordBlock(word, isCorrect, yPos) {    
    this.x = canvas.width;    
    this.y = yPos;    
    this.width = blockWidth;    
    this.height = blockHeight; 
    this.word = word;
    this.isCorrect = isCorrect;
    this.collided = false;
    this.scored = false;       
    this.isColumnBase = false; 
    
    this.draw = function() {
        ctx.fillStyle = this.isCorrect ? '#ffffffff' : '#f0f0f0'; 
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = this.isCorrect ? '#000000ff' : '#333333'; 
        ctx.lineWidth = 4;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'black';
        ctx.font = "20px 'Press Start 2P', sans-serif"; 
        ctx.textAlign = "center";
        ctx.fillText(this.word, this.x + this.width / 2, this.y + this.height / 2 + 6); 
    }

    this.update = function() {        
        this.x -= blockSpeed;
    }
}

// --- Lógica de Colisão e Geração ---
function handleBlocks() {    
    // 1. Geração de Nova Coluna     
    if (frames % blockFrequency === 0) {
        const novoSet = bancoDePalavras[Math.floor(Math.random() * bancoDePalavras.length)];
        currentWordSet = novoSet;
                
        let palavrasDaColuna = [novoSet.correto, ...novoSet.distrator];
        while (palavrasDaColuna.length < totalBlocks) {
            const allWords = bancoDePalavras.flatMap(set => set.distrator);
            const randomDistractor = allWords[Math.floor(Math.random() * allWords.length)];
            if (!palavrasDaColuna.includes(randomDistractor)) { 
                 palavrasDaColuna.push(randomDistractor);
            }
        }
        palavrasDaColuna = palavrasDaColuna.slice(0, totalBlocks); 
        palavrasDaColuna.sort(() => Math.random() - 0.5);

        const startY = 0; 
        for (let i = 0; i < totalBlocks; i++) {
            const palavra = palavrasDaColuna[i];
            const isCorrect = (palavra === novoSet.correto);
            const yPos = startY + (i * (blockHeight + paddingY)); 
                        
            const novoBloco = new WordBlock(palavra, isCorrect, yPos);
            if (isCorrect) { 
                 novoBloco.isColumnBase = true;
            }
            blocks.push(novoBloco);
        }
    }

    // 2. Loop de Colisão, Pontuação e Movimento 
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        block.update();
        block.draw();

        if (block.x + block.width < 0) {
            blocks.splice(i, 1);
            continue; 
        }

        const isColliding = (
            bird.x < block.x + block.width &&
            bird.x + bird.width > block.x &&
            bird.y < block.y + block.height &&
            bird.y + bird.height > block.y
        );

        if (isColliding) {
            if (block.isCorrect) {
                block.collided = true;
            } else {
                gameOver(`Você bateu em: ${block.word}! O correto era: ${currentWordSet.correto}`);
                return;
            }
        }
                
        if (block.isColumnBase && block.collided && !block.scored && block.x + block.width < bird.x) {
            score++;
            block.scored = true;
            removeBlockColumn(block.x); 
        }
                
        if (block.isColumnBase && !block.collided && block.x + block.width < bird.x) { 
             gameOver(`Você perdeu a correspondência! Era: ${currentWordSet.correto}`); 
             return;
        }
    }
}

function removeBlockColumn(xPos) {
    for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].x === xPos) {
            blocks.splice(i, 1);
        }
    }
}

// --- Desenha a palavra-chave no topo ---
function drawKeyWord() {
    if (gameState === 'playing' && currentWordSet) {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6; 
        ctx.font = "30px 'Press Start 2P', sans-serif"; 
        ctx.textAlign = "center";

        const text = currentWordSet.chave;
        
        ctx.strokeText(text, canvas.width / 2, 120); 
        ctx.fillText(text, canvas.width / 2, 120);
        
        ctx.fillStyle = 'black';
        ctx.font = "16px sans-serif";
        ctx.fillText("Busque o Sinônimo:", canvas.width / 2, 155); 
    }
}

// --- Funções de Recorde (Highscore) ---
function loadHighscore() { 
    const storedScore = localStorage.getItem(highscoreKey);
    highscore = storedScore ? parseInt(storedScore) : 0;
}

function saveHighscore(newScore) { 
    if (newScore > highscore) {
        highscore = newScore;
        localStorage.setItem(highscoreKey, newScore.toString());
    }
}

// --- Funções de Estado e Desenho ---

function init() {
    // ** CÁLCULO DINÂMICO DA ALTURA DO BLOCO **
    const availableHeight = canvas.height - groundHeight;
    const totalPadding = (totalBlocks - 1) * paddingY;
    blockHeight = (availableHeight - totalPadding) / totalBlocks;

    bird = new Bird();
    blocks = [];
    score = 0;
    frames = 0;
    gameState = 'start';
    currentWordSet = { chave: "JOGAR", correto: "", distrator: [] }; 
    
    backgroundX = 0; 
    loadHighscore(); 
    
    drawStartScreen();
}

function clearCanvas() {
    if (backgroundSpriteLoaded) {
        // Desenha a imagem principal (Loop 1)
        ctx.drawImage(backgroundSprite, backgroundX, 0, canvas.width, canvas.height);
        // Desenha a imagem de continuação (Loop 2) imediatamente após a primeira
        ctx.drawImage(backgroundSprite, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    } else {
        // Fallback para cor sólida
        ctx.fillStyle = SKY_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawStartScreen() { 
    clearCanvas(); 
    bird.draw();  
    drawGround(); 
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    
    ctx.fillStyle = "white"; 
    ctx.font = "36px 'Press Start 2P', sans-serif"; 
    ctx.textAlign = "center"; 
    ctx.fillText("VOA-PALAVRA", canvas.width / 2, canvas.height / 2 - 150); 
    
    ctx.font = "24px 'Press Start 2P', sans-serif"; 
    ctx.fillText("Busque o Sinônimo!", canvas.width / 2, canvas.height / 2);
    
    ctx.font = "20px sans-serif"; 
    ctx.fillText("Toque ou ESPAÇO para começar", canvas.width / 2, canvas.height / 2 + 100);
    
    // Exibe o Recorde na tela inicial
    ctx.fillStyle = "#ffe066"; 
    ctx.font = "18px 'Press Start 2P', sans-serif"; 
    ctx.fillText(`Recorde: ${highscore}`, canvas.width / 2, canvas.height / 2 + 180);
}


function drawGameOverScreen(message) { 
    clearCanvas(); 
    blocks.forEach(block => block.draw()); 
    bird.draw(); 
    drawGround();

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff6b6b"; 
    ctx.font = "40px 'Press Start 2P', sans-serif"; 
    ctx.textAlign = "center"; 
    ctx.fillText("ERRO!", canvas.width / 2, canvas.height / 2 - 180);

    ctx.fillStyle = "white"; 
    ctx.font = "18px sans-serif"; 
    const lines = message.split('!').map(s => s.trim());
    ctx.fillText(lines[0] + '!', canvas.width / 2, canvas.height / 2 - 60);
    ctx.fillText(lines[1] ? lines[1].trim() : '', canvas.width / 2, canvas.height / 2 - 30);

    ctx.fillStyle = "#ffe066"; 
    ctx.font = "30px 'Press Start 2P', sans-serif"; 
    ctx.fillText(`Pontos: ${score}`, canvas.width / 2, canvas.height / 2 + 80);

    // Exibe o Recorde na tela de Game Over
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', sans-serif"; 
    ctx.fillText(`Recorde: ${highscore}`, canvas.width / 2, canvas.height / 2 + 130);

    ctx.font = "20px sans-serif"; 
    ctx.fillText("Toque para reiniciar", canvas.width / 2, canvas.height / 2 + 230);
}


function drawScore() {
    // Desenha a Pontuação Atual (Canto Superior Direito)
    ctx.fillStyle = "white";
    ctx.font = "40px 'Press Start 2P', sans-serif"; 
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.strokeText(score, canvas.width - 80, 70); 
    ctx.fillText(score, canvas.width - 80, 70);

    // Desenha o Recorde (Canto Superior Esquerdo)
    ctx.font = "16px sans-serif";
    ctx.textAlign = "left";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    const hsText = `Recorde: ${highscore}`;
    ctx.strokeText(hsText, 30, 40);
    ctx.fillText(hsText, 30, 40);
}

function drawGround() {
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}


function startGame() {
    gameState = 'playing';
    blocks = []; 
    frames = 0; 
    score = 0; 
    bird.y = canvas.height / 2;
    bird.velocity = 0;
}

function gameOver(message) {
    if (gameState === 'gameover') return; 
    gameState = 'gameover';
    
    saveHighscore(score); 
    
    setTimeout(() => drawGameOverScreen(message), 50); 
}

function restartGame() {
    if (gameState === 'gameover') {
        init(); 
    }
}

// --- Loop Principal ---
function gameLoop() {
    if (gameState === 'playing') {
        
        // Movimenta e repete o fundo (Parallax)
        if (backgroundSpriteLoaded) {
            const bgSpeedFactor = 0.3; 
            backgroundX -= blockSpeed * bgSpeedFactor;
            
            if (backgroundX <= -canvas.width) {
                backgroundX = 0;
            }
        }
        
        clearCanvas(); 
        frames++;

        handleBlocks(); 
        
        drawKeyWord(); 
        
        bird.update(); 
        bird.draw(); 
        drawGround(); 
        drawScore(); 
    } 
        
    requestAnimationFrame(gameLoop);
}

// --- Controles ---
function handleInput() {
    if (gameState === 'playing' || gameState === 'start') {
        bird.flap();
    } else if (gameState === 'gameover') {
        restartGame();
    }
}


// --- BLOCO DE INICIALIZAÇÃO SEGURO ---
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('flappyCanvas');
    
    if (!canvas) {
        console.error("Erro: O elemento CANVAS com o ID 'flappyCanvas' não foi encontrado. Verifique se o arquivo index.html está estruturado corretamente.");
        return; 
    }
    
    ctx = canvas.getContext('2d');
    
    // Configura os ouvintes de eventos
    canvas.addEventListener('click', handleInput);
    canvas.addEventListener('touchstart', function(event) {
        event.preventDefault(); 
        handleInput();
    });

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault(); 
            handleInput();
        }
    });

    // Inicia o jogo
    init(); 
    requestAnimationFrame(gameLoop);
});
