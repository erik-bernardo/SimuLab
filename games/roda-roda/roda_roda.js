// DATASET DE 100 ASSUNTOS (3 PALAVRAS CADA) - MANTIDO
const DATA = [
    // ... (Mantenha o conteúdo completo da variável DATA) ...
    { subject: "Elementos da Tabela", words: ["HIDROGÊNIO", "OXIGÊNIO", "HÉLIO"] },
    { subject: "Física", words: ["ELÉTRON", "PRÓTON", "NÊUTRON"] },
    // ... (O restante dos 100 assuntos) ...
    { subject: "Acessórios de Praia", words: ["ÓCULOS", "CHAPÉU", "CANGA"] },
    { subject: "Tipos de Café", words: ["EXPRESSO", "CAPUCCINO", "MACCHIATO"] },
    // ... (etc.) ...
];

// Variáveis de Estado do Jogo (MANTIDAS)
let availableData = [...DATA]; 
let currentSubject = "";
let targetWords = [];
let guessedLetters = [];
let gameActive = false; 
let players = [];
let currentPlayerIndex = 0;
let wheelCanvas;
let wheelContext;
let wheelRotation = 0; 
let isSpinning = false;

// Configuração da Roda de Prêmios (MANTIDA)
const WHEEL_SEGMENTS = [
    { type: 'points', value: 100, label: 'R$ 100', color: '#ffb300' },
    { type: 'points', value: 200, label: 'R$ 200', color: '#4caf50' },
    { type: 'points', value: 300, label: 'R$ 300', color: '#00bcd4' },
    { type: 'points', value: 500, label: 'R$ 500', color: '#3f51b5' },
    { type: 'points', value: 1000, label: 'R$ 1000', color: '#ffeb3b' },
    { type: 'action', value: 'PASSA A VEZ', label: 'PASSA A VEZ', penalty: true, color: '#9e9e9e' },
    { type: 'action', value: 'PERDE TUDO', label: 'PERDE TUDO', penalty: true, color: '#f44336' },
    { type: 'points', value: 400, label: 'R$ 400', color: '#ff9800' },
    { type: 'points', value: 600, label: 'R$ 600', color: '#8bc34a' },
    { type: 'points', value: 700, label: 'R$ 700', color: '#00e5ff' },
    { type: 'points', value: 800, label: 'R$ 800', color: '#536dfe' },
    { type: 'action', value: 'GIRAR NOVAMENTE', label: 'GIRAR NOVAMENTE', penalty: false, color: '#9c27b0' },
];

// --- FUNÇÕES DE SETUP E PLACAR (MANTIDAS) ---
function setupGame() {
    const numPlayersInput = document.getElementById('num-players-input');
    const setupContainer = document.getElementById('player-setup');
    const gameContainer = document.querySelector('.game-container');
    
    let numPlayers = parseInt(numPlayersInput.value);

    if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 8) {
        alert("Por favor, insira um número de jogadores válido (1 a 8).");
        return;
    }

    players = [];
    for (let i = 0; i < numPlayers; i++) {
        players.push({ id: i, name: `Jogador ${i + 1}`, score: 0 });
    }
    currentPlayerIndex = 0;
    
    setupContainer.style.display = 'none';
    gameContainer.style.display = 'flex'; 
    
    drawWheel();
    startGame();
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = players.map((p, index) => {
        const isCurrent = index === currentPlayerIndex;
        return `
            <div class="player-card ${isCurrent ? 'active-player' : ''}">
                <p>${p.name}</p>
                <span class="score-value">R$ ${p.score}</span>
            </div>
        `;
    }).join('');

    const wheelList = document.getElementById('wheel-config-list');
    if (wheelList) {
        wheelList.innerHTML = WHEEL_SEGMENTS.map(s => {
            const type = s.type === 'points' ? `Pontos (${s.value})` : 'Ação';
            return `<li>${s.label} (${type})</li>`;
        }).join('');
    }
}

function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateScoreboard();
    showMessage(`Vez do ${players[currentPlayerIndex].name}. Gire a Roda!`, 'success');
    document.getElementById('spin-btn').disabled = false;
    document.getElementById('full-guess-input').disabled = false;
}

// --- FUNÇÃO drawWheel CORRIGIDA ---
function drawWheel() {
    if (!wheelContext || !wheelCanvas) return;

    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;
    const totalSegments = WHEEL_SEGMENTS.length;
    const anglePerSegment = (2 * Math.PI) / totalSegments;

    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    
    // Desenha os segmentos
    for (let i = 0; i < totalSegments; i++) {
        const segment = WHEEL_SEGMENTS[i];
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;

        // 1. Desenha o segmento (pizza)
        wheelContext.beginPath();
        wheelContext.moveTo(centerX, centerY);
        wheelContext.arc(centerX, centerY, radius, startAngle, endAngle);
        wheelContext.closePath();
        wheelContext.fillStyle = segment.color;
        wheelContext.fill();
        wheelContext.strokeStyle = 'white';
        wheelContext.lineWidth = 2;
        wheelContext.stroke();

        // 2. Desenha o texto (label)
        wheelContext.save();
        
        wheelContext.translate(centerX, centerY);
        
        // Rotaciona para o centro do segmento, mais um offset de 90 graus (PI/2)
        const textAngle = startAngle + anglePerSegment / 2 + Math.PI / 2;
        wheelContext.rotate(textAngle); 
        
        // Ajustes para caber o texto
        wheelContext.fillStyle = segment.type === 'points' ? '#000' : 'white';
        wheelContext.font = 'bold 12px Oswald'; // Fonte reduzida
        wheelContext.textAlign = 'left'; // Alinha para correr do centro para fora
        wheelContext.textBaseline = 'middle';
        
        const textRadiusStart = radius * 0.40; // Posição de início do texto
        
        wheelContext.fillText(segment.label, textRadiusStart, 0);
        
        wheelContext.restore();
    }
}
// --- FIM DA FUNÇÃO drawWheel CORRIGIDA ---


// --- FUNÇÕES DE GIRO DA RODA (MANTIDAS) ---
function spinWheel() {
    if (!gameActive || isSpinning) return;
    
    isSpinning = true;
    document.getElementById('spin-btn').disabled = true;
    
    const totalSegments = WHEEL_SEGMENTS.length;
    const anglePerSegment = 360 / totalSegments;

    const winningIndex = Math.floor(Math.random() * totalSegments);
    const result = WHEEL_SEGMENTS[winningIndex];

    let stopAngle = 360 - (winningIndex * anglePerSegment + anglePerSegment / 2) + 90;

    const revolutions = 5; 
    const finalAngle = stopAngle + revolutions * 360; 
    
    const wheelElement = document.getElementById('prize-wheel');
    
    wheelElement.style.transition = 'none';
    wheelElement.style.transform = `rotate(${wheelRotation % 360}deg)`; 
    void wheelElement.offsetWidth; 

    wheelElement.style.transition = 'transform 6s cubic-bezier(0.25, 0.1, 0.25, 1)';
    wheelElement.style.transform = `rotate(${finalAngle}deg)`;
    
    wheelRotation = finalAngle;
    
    document.getElementById('wheel-result-display').textContent = 'Girando...';
    
    setTimeout(() => {
        isSpinning = false;
        applyWheelResult(result);
    }, 6000); 
}

function applyWheelResult(result) {
    const player = players[currentPlayerIndex];

    if (result.type === 'points') {
        document.getElementById('full-guess-input').disabled = true; 
        document.getElementById('wheel-result-display').textContent = `Resultado: ${result.label}`;

        showMessage(`${player.name}, você tirou ${result.label}. Chute **QUALQUER LETRA** agora!`, 'success');
        
        const pointsValue = result.value;
        document.addEventListener('keydown', function tempGuessHandler(event) {
             if (document.activeElement.id === 'full-guess-input') return;
             
             const key = normalizeString(event.key).trim();
             const isLetter = key.length === 1 && /^[A-Z]$/.test(key);

             if (isLetter) {
                 document.removeEventListener('keydown', tempGuessHandler);
                 checkLetterGuess(key, pointsValue); 
             }
        }, { once: true });
    
    } else if (result.value === 'PERDE TUDO') {
        player.score = 0;
        document.getElementById('wheel-result-display').textContent = 'PERDE TUDO!';
        showMessage(`${player.name} perdeu tudo! Pontos zerados. Vez do próximo.`, 'error');
        updateScoreboard();
        nextPlayer();
        
    } else if (result.value === 'PASSA A VEZ') {
        document.getElementById('wheel-result-display').textContent = 'PASSA A VEZ';
        showMessage(`${player.name}, você passou a vez. Vez do próximo.`, 'error');
        nextPlayer();

    } else if (result.value === 'GIRAR NOVAMENTE') {
        document.getElementById('wheel-result-display').textContent = 'Gire Novamente!';
        showMessage(`${player.name}, gire a roda novamente!`, 'success');
        document.getElementById('spin-btn').disabled = false;
        document.getElementById('full-guess-input').disabled = false;
    }
}

function checkLetterGuess(letter, pointsValue) {
    if (!gameActive) return;

    document.getElementById('full-guess-input').disabled = false; 

    if (guessedLetters.includes(letter)) {
        showMessage(`A letra "${letter}" já foi chutada. Sua vez terminou.`, 'error');
        nextPlayer();
        return;
    }

    guessedLetters.push(letter);
    
    const targetString = normalizeString(targetWords.join(''));
    let count = 0;
    
    for(let i = 0; i < targetString.length; i++) {
        if (targetString[i] === letter) {
            count++;
        }
    }
    
    if (count > 0) {
        const totalPoints = count * pointsValue;
        players[currentPlayerIndex].score += totalPoints;
        showMessage(`"${letter}" correta! ${count}x. Você ganhou R$ ${totalPoints}! Gire novamente ou chute a Palavra.`, 'success');
        updateDisplay();
        document.getElementById('spin-btn').disabled = false;

    } else {
        showMessage(`"${letter}" não existe na frase. Vez do próximo jogador.`, 'error');
        updateDisplay();
        nextPlayer();
    }
    
    updateScoreboard();
}

function handleKeydown(event) {
    if (!gameActive) return;
    
    if (document.activeElement.id === 'full-guess-input' && event.key === 'Enter') {
        guessFullWord();
        return;
    }
}


function guessFullWord() {
    if (!gameActive) return;
    
    document.getElementById('spin-btn').disabled = true;

    const input = document.getElementById('full-guess-input');
    const guess = normalizeString(input.value).trim().replace(/\s+/g, ' '); 
    input.value = '';

    if (guess.length === 0) {
        showMessage("Por favor, insira seu palpite completo.", 'error');
        document.getElementById('spin-btn').disabled = false;
        return;
    }
    
    const targetStringNormalized = normalizeString(targetWords.join(' ')).replace(/\s+/g, ' ');

    if (guess === targetStringNormalized) {
        const bonusPoints = targetWords.length * 500;
        players[currentPlayerIndex].score += bonusPoints;
        endRound(true, `Palpite Correto! Você acertou todas as palavras e ganhou R$ ${bonusPoints} de bônus!`);
    } else {
        endRound(false, `Palpite Incorreto! A frase correta era: ${targetWords.join(' ')}. Vez do próximo jogador.`);
    }
}

function endRound(success, message) {
    gameActive = false;
    
    targetWords.forEach(word => {
        normalizeString(word).split('').forEach(l => {
            if (!guessedLetters.includes(l)) guessedLetters.push(l);
        });
    });
    updateDisplay();
    updateScoreboard();
    
    if (success) {
        showMessage(message + " Clique em 'Próximo Assunto' para continuar.", 'success');
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length; 
        showMessage(message + " Clique em 'Próximo Assunto' para continuar o jogo.", 'error');
    }
    
    document.getElementById('spin-btn').disabled = true; 
}


// --- FUNÇÕES DE UTILIDADE (MANTIDAS) ---
function startGame() {
    if (availableData.length === 0) {
        document.getElementById('message-box').innerHTML = "<span class='success'>Fim de Jogo! Todos os assuntos foram completados.</span>";
        gameActive = false;
        return;
    }
    
    document.getElementById('wheel-result-display').textContent = 'Gire a Roda para Começar!';
    document.getElementById('spin-btn').disabled = false;
    document.getElementById('full-guess-input').disabled = false; 
    
    const randomIndex = Math.floor(Math.random() * availableData.length);
    const selectedItem = availableData.splice(randomIndex, 1)[0];
    
    currentSubject = selectedItem.subject;
    targetWords = selectedItem.words;

    guessedLetters = []; 
    gameActive = true;
    
    document.getElementById('full-guess-input').value = '';

    updateDisplay();
    updateScoreboard();
    showMessage(`Novo assunto: ${currentSubject}. Começa ${players[currentPlayerIndex].name}. Gire a Roda!`, 'success');
}

function nextRound() {
    if (!gameActive) {
        startGame();
    }
}

function normalizeString(str) {
    return str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z\s]/g, "");
}

function updateDisplay() {
    const displayContainer = document.getElementById('word-display');
    displayContainer.innerHTML = "";
    let solved = true;
    
    targetWords.forEach(word => {
        const normalizedWord = normalizeString(word);
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-container';

        for (let i = 0; i < normalizedWord.length; i++) {
            const char = normalizedWord[i];
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            
            if (guessedLetters.includes(char)) {
                tile.textContent = char;
                tile.classList.add('revealed');
            } else {
                tile.textContent = ''; 
                solved = false;
            }
            wordDiv.appendChild(tile);
        }
        displayContainer.appendChild(wordDiv);
    });

    document.getElementById('category-display').textContent = `Assunto: ${currentSubject} (Restantes: ${availableData.length})`;
    
    document.getElementById('guessed-letters').innerHTML = `Letras já usadas: <span>${guessedLetters.sort().join(', ') || 'Nenhuma'}</span>`;

    if (solved && gameActive) {
        endRound(true, "Parabéns! Você descobriu todas as palavras!");
    }
}

function showMessage(msg, type = 'error') {
    const msgBox = document.getElementById('message-box');
    msgBox.textContent = msg;
    msgBox.className = type;
}


// --- INICIALIZADOR CORRIGIDO ---
document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    wheelCanvas = document.getElementById('prize-wheel');
    if (wheelCanvas) {
        wheelContext = wheelCanvas.getContext('2d');
        document.addEventListener('keydown', handleKeydown);
        updateScoreboard(); 
    } else {
        console.error("Canvas 'prize-wheel' não encontrado. Verifique roda_roda.html.");
    }

    // NOVO: Anexa o event listener ao botão 'Começar Jogo'
    const startButton = document.getElementById('start-game-btn');
    if (startButton) {
        startButton.addEventListener('click', setupGame);
    }
});
