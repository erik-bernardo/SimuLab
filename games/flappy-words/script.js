// script.js

// --- VARIÁVEIS GLOBAIS DE JOGO E CANVAS (Declaradas, mas não inicializadas aqui) ---
let canvas;
let ctx;
let bird, blocks, score, frames, gameState, currentWordSet;
let backgroundX; // NOVO: Variável para controlar a posição do fundo

// --- SPRITE DO PÁSSARO ---
const birdSprite = new Image();
let birdSpriteLoaded = false;
birdSprite.onload = function() {
    birdSpriteLoaded = true;
};
// *** MUDE ESTE CAMINHO PELO URL OU CAMINHO LOCAL DA SUA IMAGEM DO PÁSSARO ***
birdSprite.src = 'bird.png'; 
const BIRD_COLOR = '#ffda56'; // Fallback Color

// --- SPRITE DE FUNDO ---
const backgroundSprite = new Image();
let backgroundSpriteLoaded = false;
backgroundSprite.onload = function() {
    backgroundSpriteLoaded = true;
};
// *** MUDE ESTE CAMINHO PELO URL OU CAMINHO LOCAL DA SUA IMAGEM DE FUNDO ***
backgroundSprite.src = 'bg.png'; 
const SKY_COLOR = '#70c5ce'; // Fallback Color

// --- DADOS DO JOGO (Banco de Sinônimos) ---
const bancoDePalavras = [    
    { chave: "ALEGRE", correto: "FELIZ", distrator: ["TRISTE", "RÁPIDO", "FRIO"] },    
    { chave: "RÁPIDO", correto: "VELOZ", distrator: ["LENTO", "GORDU", "ROXO"] },    
    { chave: "INÍCIO", correto: "COMEÇO", distrator: ["FIM", "MEIO", "PARADA"] },    
    { chave: "BELO", correto: "BONITO", distrator: ["FEIO", "SUJO", "FORTE"] },    
    { chave: "AMPLIAR", correto: "AUMENTAR", distrator: ["DIMINUIR", "PARAR", "SUBIR"] },
    
    { chave: "CALMO", correto: "SERENO", distrator: ["AGITADO", "BRAVO", "PERTO"] },    
    { chave: "BRILHO", correto: "ESPLENDOR", distrator: ["ESCURIDÃO", "FUMAÇA", "BARULHO"] },    
    { chave: "LIVRE", correto: "SOLTO", distrator: ["PRESO", "VERDE", "LONGE"] },    
    { chave: "GRANDE", correto: "ENORME", distrator: ["PEQUENO", "AZUL", "RARO"] },    
    { chave: "CORRETO", correto: "CERTO", distrator: ["ERRADO", "DUVIDOSO", "LENTO"] },    
    { chave: "FÁCIL", correto: "SIMPLES", distrator: ["DIFÍCIL", "COMPLEXO", "CLARO"] },    
    { chave: "IDEIA", correto: "NOÇÃO", distrator: ["OBJETO", "FATO", "SONO"] },    
    { chave: "JUNTAR", correto: "UNIR", distrator: ["SEPARAR", "QUEBRAR", "AFASTAR"] },    
    { chave: "MUDAR", correto: "ALTERAR", distrator: ["MANTER", "FIXAR", "CRIAR"] },    
    { chave: "NOVO", correto: "RECENTE", distrator: ["VELHO", "ANTIGO", "FORTE"] },    
    { chave: "PAZ", correto: "TRANQUILIDADE", distrator: ["GUERRA", "CAOS", "BARULHO"] },    
    { chave: "FRIO", correto: "DESANIMADO", distrator: ["GELADO", "FRIO", "PESADO"] },    
    { chave: "SUBIR", correto: "ASCENDER", distrator: ["DESCER", "CAIR", "PARAR"] },    
    { chave: "TERMINAR", correto: "FINALIZAR", distrator: ["COMEÇAR", "INICIAR", "PROLONGAR"] },    
    { chave: "VERDADE", correto: "SINCERIDADE", distrator: ["MENTIRA", "FALSIDADE", "DUVIDA"] },    
    { chave: "VIAGEM", correto: "JORNADA", distrator: ["PARADA", "ESTADIA", "VOLTA"] },    
    { chave: "FORTE", correto: "POTENTE", distrator: ["FRACO", "FRÁGIL", "SUAVE"] },    
    { chave: "COMER", correto: "ALIMENTAR", distrator: ["VENENOSO", "DURO", "MOLHADO"] },    
    { chave: "ADVERSIDADE", correto: "PROBLEMA", distrator: ["FACILIDADE", "BEM", "ALEGRIA"] },    
    { chave: "CONHECER", correto: "SABER", distrator: ["IGNORAR", "ESQUECER", "FALAR"] },    
    { chave: "DESEJAR", correto: "QUERER", distrator: ["REJEITAR", "RECUSAR", "NEGAR"] },    
    { chave: "ECONOMIZAR", correto: "POUPAR", distrator: ["GASTAR", "DEIXAR", "DURAR"] },    
    { chave: "FALHAR", correto: "ERRAR", distrator: ["ACERTAR", "VENCER", "PERDER"] },    
    { chave: "GENTIL", correto: "CORTÊS", distrator: ["RUDE", "BRUTO", "FORTE"] },    
    { chave: "HABITAR", correto: "MORAR", distrator: ["SAIR", "PASSAR", "VISITAR"] },    
    { chave: "IRADO", correto: "ENFURECIDO", distrator: ["CONTENTE", "CALMO", "LENTO"] },    
    { chave: "JUSTO", correto: "ÍGREGRO", distrator: ["INJUSTO", "PARCIAL", "PESADO"] },    
    { chave: "LÍMPIDO", correto: "CRISTALINO", distrator: ["SUJO", "TURVO", "VELHO"] },    
    { chave: "MAGNÍFICO", correto: "EXCELENTE", distrator: ["RUIM", "COMUM", "PEQUENO"] },    
    { chave: "NECESSÁRIO", correto: "ESSENCIAL", distrator: ["DISPENSÁVEL", "EXTRA", "VERDE"] },    
    { chave: "OBSERVAR", correto: "NOTAR", distrator: ["IGNORAR", "FALAR", "PULAR"] },    
    { chave: "PERMITIR", correto: "AUTORIZAR", distrator: ["PROIBIR", "IMPEDIR", "PARAR"] },    
    { chave: "PROTEGER", correto: "DEFENDER", distrator: ["ATACAR", "ABANDONAR", "QUEBRAR"] },    
    { chave: "REVELAR", correto: "MOSTRAR", distrator: ["ESCONDER", "GUARDAR", "MUDAR"] },    
    { chave: "SÁBIO", correto: "CULTIVADO", distrator: ["IGNORANTE", "JOVEM", "PESSIMO"] },    
    { chave: "SUCESSO", correto: "ÊXITO", distrator: ["FRACASSO", "DERROTA", "ERRO"] },    
    { chave: "TEMOR", correto: "MEDO", distrator: ["CORAGEM", "ALEGRIA", "PAZ"] },    
    { chave: "ÚNICO", correto: "EXCLUSIVO", distrator: ["COMUM", "MÚLTIPLO", "MISTO"] },    
    { chave: "VENCEDOR", correto: "TRIUNFANTE", distrator: ["PERDEDOR", "DERROTADO", "TRISTE"] },    
    { chave: "ZOMBAR", correto: "CAÇOAR", distrator: ["ELOGIAR", "RESPEITAR", "AMAR"] },    
    { chave: "INDO", correto: "PARTINDO", distrator: ["FICANDO", "CHEGANDO", "VOLTANDO"] },    
    { chave: "COMPLICADO", correto: "EMBARAÇADO", distrator: ["DESCOMPLICADO", "FÁCIL", "SIMPLES"] },    
    { chave: "BARULHO", correto: "RUÍDO", distrator: ["SILÊNCIO", "PAZ", "CALMO"] },    
    { chave: "CEDO", correto: "PRECOCEMENTE", distrator: ["TARDE", "DEPOIS", "NUNCA"] },    
    { chave: "DÚVIDA", correto: "INCERTEZA", distrator: ["CERTEZA", "VERDADE", "FATO"] },    
    { chave: "ELOGIO", correto: "LOUVOR", distrator: ["CRÍTICA", "ATAQUE", "ERRO"] },    
    { chave: "FRACO", correto: "FRÁGIL", distrator: ["FORTE", "RESISTENTE", "GRANDE"] },    
    { chave: "GRITARIA", correto: "BERRARIA", distrator: ["SUSSURRO", "SILÊNCIO", "PAZ"] },    
    { chave: "HOMENAGEM", correto: "TRIBUTO", distrator: ["ATAQUE", "CRÍTICA", "PUNIR"] },    
    { chave: "ILUMINAR", correto: "CLAREAR", distrator: ["ESURECER", "COBRIR", "APAGAR"] },    
    { chave: "JOGAR", correto: "LANÇAR", distrator: ["PEGAR", "GUARDAR", "PARAR"] },    
    { chave: "LAMENTAR", correto: "LASTIMAR", distrator: ["ALEGRAR", "COMEMORAR", "SORRIR"] },    
    { chave: "MESTRE", correto: "PROFESSOR", distrator: ["ALUNO", "APRENDIZ", "INICIANTE"] },    
    { chave: "NECESSIDADE", correto: "CARÊNCIA", distrator: ["ABUNDÂNCIA", "EXCESSO", "RIQUEZA"] },    
    { chave: "OCULTAR", correto: "ESCONDER", distrator: ["MOSTRAR", "REVELAR", "EXPOR"] },    
    { chave: "PARTILHAR", correto: "COMPARTILHAR", distrator: ["RETER", "GUARDAR", "COMPRAR"] },    
    { chave: "RECLAMAR", correto: "QUEIXAR", distrator: ["ELOGIAR", "ACEITAR", "CONCORDAR"] },    
    { chave: "SORRIR", correto: "RIR", distrator: ["CHORAR", "TRISTE", "GRITAR"] },    
    { chave: "TREMOR", correto: "ABALO", distrator: ["FIRMEZA", "PAZ", "FORTE"] },    
    { chave: "VALOR", correto: "PREÇO", distrator: ["VAZIO", "GRÁTIS", "ERRO"] },    
    { chave: "PREJUDICAR", correto: "DANIFICAR", distrator: ["AJUDAR", "REPARAR", "LOUVAR"] },    
    { chave: "ESQUECER", correto: "OLVIDAR", distrator: ["LEMBRAR", "REGISTRAR", "FALAR"] },    
    { chave: "REPETIR", correto: "REITERAR", distrator: ["PARAR", "CALAR", "SILENCIAR"] },    
    { chave: "CHEGAR", correto: "ATINGIR", distrator: ["SAIR", "PARTIR", "CAIR"] },    
    { chave: "RESIDIR", correto: "MORAR", distrator: ["VISITAR", "VIAJAR", "PULAR"] },    
    { chave: "DESISTIR", correto: "ABANDONAR", distrator: ["INSISTIR", "CONTINUAR", "COMEÇAR"] }
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
        ctx.fillStyle = this.isCorrect ? '#50e3c2' : '#f0f0f0'; 
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = this.isCorrect ? '#3cb44b' : '#333333'; 
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

// --- Lógica de Colisão e Geração (Mantida) ---
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
    
    backgroundX = 0; // NOVO: Inicializa a posição do fundo
    
    drawStartScreen();
}

/**
 * NOVO: Desenha a imagem de fundo em loop ou a cor de fallback.
 */
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

    ctx.font = "20px sans-serif"; 
    ctx.fillText("Toque para reiniciar", canvas.width / 2, canvas.height / 2 + 180);
}


function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "40px 'Press Start 2P', sans-serif"; 
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.strokeText(score, canvas.width - 80, 70); 
    ctx.fillText(score, canvas.width - 80, 70);
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
        
        // NOVO: Movimenta e repete o fundo (Parallax)
        if (backgroundSpriteLoaded) {
            const bgSpeedFactor = 0.3; // Velocidade de movimento do fundo (30% da velocidade dos blocos)
            backgroundX -= blockSpeed * bgSpeedFactor;
            
            // Quando a primeira imagem sair da tela, reseta para 0
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


// --- BLOCO DE INICIALIZAÇÃO SEGURO (Executado após o DOM carregar) ---
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
