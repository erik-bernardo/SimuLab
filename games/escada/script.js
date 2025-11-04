// script.js

// --- DADOS DO JOGO ---
const BOARD_SIZE = 100; // Total de casas: 0 a 99

// 1. Definição das 100 casas
const BOARD_CELLS = [];
for (let i = 0; i < BOARD_SIZE; i++) {
    let theme = 'GRAMÁTICA DIVERSA';
    if (i === 0) theme = 'start';
    else if (i === BOARD_SIZE - 1) theme = 'final';
    
    // Regras de distribuição de temas para 100 casas
    else if (i % 4 === 1) theme = 'ACENTUAÇÃO';
    else if (i % 4 === 2) theme = 'CRASE';
    else if (i % 4 === 3) theme = 'GRAMÁTICA DIVERSA';
    else if (i % 4 === 0 && i !== 0 && i !== BOARD_SIZE -1) theme = 'GERAL'; 
    
    BOARD_CELLS.push({ 
        id: i, 
        theme: theme, 
        label: (i === 0) ? 'INÍCIO' : (i === BOARD_SIZE - 1) ? 'FIM!' : i.toString() 
    });
}

// 2. Banco de Perguntas (LÍNGUA PORTUGUESA) - MANTIDO
const QUESTIONS_BY_THEME = {
    'ACENTUAÇÃO': [
        { q: "Assinale a alternativa em que todas as palavras são acentuadas pela mesma regra:", options: ["a) herói, chapéu, anzóis", "b) lágrima, relâmpago, óculos", "c) vírus, bônus, armazéns"], answer: "a) herói, chapéu, anzóis" },
        { q: "Qual palavra deve ser acentuada por ser proparoxítona?", options: ["a) rubrica", "b) gratuito", "c) ínterim"], answer: "c) ínterim" },
        { q: "Qual é a regra que justifica a acentuação das palavras saúde e país?", options: ["a) São oxítonas.", "b) São paroxítonas terminadas em ditongo.", "c) É a regra do hiato com 'i' ou 'u' tônicos, seguidos ou não de 's'."], answer: "c) É a regra do hiato com 'i' ou 'u' tônicos, seguidos ou não de 's'." },
        { q: "Assinale a opção em que a acentuação da palavra está incorreta:", options: ["a) cafèzinho", "b) juízo", "c) também"], answer: "a) cafèzinho" },
        { q: "As palavras história e mágoa são acentuadas por serem:", options: ["a) Proparoxítonas.", "b) Paroxítonas terminadas em ditongo crescente.", "c) Oxítonas terminadas em vogal."], answer: "b) Paroxítonas terminadas em ditongo crescente." },
        { q: "Qual das palavras a seguir não deve ser acentuada?", options: ["a) trofeu", "b) série (substantivo)", "c) baú"], answer: "a) trofeu" },
        { q: "Acentue corretamente a palavra se necessário: pudico, juiz, juri.", options: ["a) pudíco, juíz, júri", "b) pudico, juiz, júri", "c) púdico, juíz, jurí"], answer: "b) pudico, juiz, júri" },
        { q: "Em qual alternativa a regra de acentuação é a das oxítonas terminadas em a, e, o (seguidas ou não de s)?", options: ["a) cipó, você, sabiá", "b) atrás, refém, parabéns", "c) táxi, fáceis, lápis"], answer: "a) cipó, você, sabiá" },
        { q: "A palavra pônei é acentuada pela regra das paroxítonas terminadas em:", options: ["a) ditongo oral.", "b) tritongo.", "c) encontro vocálico."], answer: "a) ditongo oral." },
        { q: "O que as palavras também e alguém têm em comum na sua regra de acentuação?", options: ["a) São paroxítonas.", "b) São oxítonas terminadas em 'em' ou 'ens'.", "c) São proparoxítonas."], answer: "b) São oxítonas terminadas em 'em' ou 'ens'." },
        { q: "Retire o acento das palavras acentuadas indevidamente: rítmo, hífen, álcool.", options: ["a) ritmo, hifen, álcool", "b) ritmo, hífen, alcool", "c) rítmo, hífen, álcool"], answer: "b) ritmo, hífen, alcool" },
        { q: "Qual é a única palavra do grupo que deve ser acentuada?", options: ["a) ruim", "b) caju", "c) baú"], answer: "c) baú" },
        { q: "O Novo Acordo Ortográfico aboliu o acento diferencial em qual par de palavras?", options: ["a) pôde / pode", "b) para / pára (verbo)", "c) tem / têm"], answer: "b) para / pára (verbo)" },
        { q: "A palavra feiura perdeu o acento. Qual é a regra que explica isso?", options: ["a) O 'u' tônico anterior a 'r' não é mais acentuado.", "b) O 'u' tônico em hiato, quando precede ditongo, não é mais acentuado.", "c) O 'i' e o 'u' dos ditongos abertos não são mais acentuados."], answer: "b) O 'u' tônico em hiato, quando precede ditongo, não é mais acentuado." },
        { q: "A palavra proparoxítona é acentuada. Por quê?", options: ["a) Por ser terminada em vogal.", "b) Porque todas as proparoxítonas são acentuadas.", "c) Porque tem ditongo."], answer: "b) Porque todas as proparoxítonas são acentuadas." },
        { q: "Qual palavra a seguir é acentuada por ser paroxítona terminada em ditongo?", options: ["a) armário", "b) céu", "c) óculos"], answer: "a) armário" },
        { q: "Em qual opção há erro de acentuação?", options: ["a) eles vêm", "b) ela contêm", "c) eles mantêm"], answer: "b) ela contêm" },
        { q: "Qual é a regra geral de acentuação que se aplica a todas as proparoxítonas?", options: ["a) São acentuadas se terminadas em vogal.", "b) São acentuadas se terminadas em a, e, o.", "c) Todas são acentuadas."], answer: "c) Todas são acentuadas." },
        { q: "As palavras vêem e leem perderam o acento. Por quê?", options: ["a) Perderam o acento porque o 'e' não é mais tônico.", "b) O acento diferencial foi abolido.", "c) O acento circunflexo no 'e' tônico dos verbos crer, ler, dar e ver (e derivados) nas formas com vogal dobrada foi abolido."], answer: "c) O acento circunflexo no 'e' tônico dos verbos crer, ler, dar e ver (e derivados) nas formas com vogal dobrada foi abolido." },
    ],
    'CRASE': [
        { q: "Assinale a alternativa em que o emprego da crase está incorreto:", options: ["a) Voltaremos àquela cidade.", "b) A prova será realizada às 10 horas.", "c) Dirigiu-se à ela com educação."], answer: "c) Dirigiu-se à ela com educação." },
        { q: "Em qual opção o uso da crase é facultativo?", options: ["a) Fomos à feira.", "b) Refiro-me à Maria.", "c) Ele foi à praia."], answer: "b) Refiro-me à Maria." },
        { q: "Qual é a regra fundamental para o uso da crase?", options: ["a) A crase é a união da preposição a com o artigo feminino a (ou o 'a' inicial de pronomes demonstrativos).", "b) A crase ocorre apenas antes de palavras masculinas.", "c) A crase ocorre sempre que houver um artigo feminino."], answer: "a) A crase é a união da preposição a com o artigo feminino a (ou o 'a' inicial de pronomes demonstrativos)." },
        { q: "Complete com a ou à: 'Ele se referiu _ garotas e ofereceu flores _ elas.'", options: ["a) às / a", "b) a / à", "c) às / às"], answer: "a) às / a" },
        { q: "O que acontece com o acento grave (crase) antes de um verbo?", options: ["a) É obrigatório.", "b) Nunca ocorre crase antes de verbo.", "c) É facultativo."], answer: "b) Nunca ocorre crase antes de verbo." },
        { q: "Complete com a ou à: 'Chegamos _ tempo para assistir _ palestra.'", options: ["a) a / à", "b) à / a", "c) à / à"], answer: "a) a / à" },
        { q: "Assinale onde a crase é obrigatória:", options: ["a) Daqui a duas horas o avião decola.", "b) Estávamos frente a frente.", "c) Saímos à noite, sob a luz do luar."], answer: "c) Saímos à noite, sob a luz do luar." },
        { q: "Qual a função do acento grave (crase) em locuções adverbiais femininas, como 'às pressas' ou 'à vontade'?", options: ["a) Indica que a preposição é obrigatória.", "b) Marca a fusão da preposição a com o artigo a antes do substantivo feminino que compõe a locução.", "c) É usado apenas para marcar ênfase."], answer: "b) Marca a fusão da preposição a com o artigo a antes do substantivo feminino que compõe a locução." },
        { q: "Justifique a ausência de crase em: 'Ele viaja a cavalo.'", options: ["a) 'Cavalo' é um substantivo masculino.", "b) A crase só ocorre antes de locuções adverbiais de tempo.", "c) O verbo 'viajar' não exige preposição."], answer: "a) 'Cavalo' é um substantivo masculino." },
        { q: "Substitua o termo sublinhado por outro, mantendo ou não a crase: 'O professor deu atenção à aluna.' (Substituir por 'ao aluno').", options: ["a) O professor deu atenção ao aluno. (A crase desaparece).", "b) O professor deu atenção à aluno. (A crase permanece).", "c) O professor deu atenção a o aluno. (A preposição se separa)."], answer: "a) O professor deu atenção ao aluno. (A crase desaparece)." },
        { q: "Em qual dos pronomes demonstrativos ocorre crase?", options: ["a) essa", "b) esta", "c) aquela"], answer: "c) aquela" },
        { q: "Complete: 'O time jogou _ moda do técnico.'", options: ["a) a", "b) à", "c) as"], answer: "b) à" },
        { q: "Qual a diferença de sentido entre 'chegar a casa' e 'chegar à casa'?", options: ["a) Não há diferença.", "b) 'chegar a casa' significa chegar ao próprio lar, e 'chegar à casa' significa chegar a uma casa específica.", "c) 'chegar à casa' está incorreto."], answer: "b) 'chegar a casa' significa chegar ao próprio lar, e 'chegar à casa' significa chegar a uma casa específica." },
        { q: "Explique a regra do 'Vou a, volto da, crase há; Vou a, volto de, crase pra quê?'", options: ["a) É uma regra mnemônica para o uso da crase antes de nomes de lugares.", "b) Indica o uso da crase apenas para cidades.", "c) Significa que a crase só ocorre se o verbo exigir 'de'."], answer: "a) É uma regra mnemônica para o uso da crase antes de nomes de lugares." },
        { q: "Por que não usamos crase antes de pronomes pessoais? Exemplo: 'Entreguei a carta a ela.'", options: ["a) Pronomes pessoais não admitem artigo.", "b) A preposição a é proibida antes de pronomes pessoais.", "c) Os pronomes pessoais não exigem complemento."], answer: "a) Pronomes pessoais não admitem artigo." },
    ],
    'GRAMÁTICA DIVERSA': [
        { q: "Assinale a alternativa em que a palavra está escrita incorretamente:", options: ["a) exceção", "b) ascensão", "c) expontâneo"], answer: "c) expontâneo" },
        { q: "A palavra 'porquê' deve ser usada quando:", options: ["a) Estiver no início da frase interrogativa.", "b) For um substantivo e estiver antecedido de artigo ou pronome.", "c) For uma conjunção explicativa."], answer: "b) For um substantivo e estiver antecedido de artigo ou pronome." },
        { q: "Qual a função principal da vírgula na frase: 'Os alunos, que estudaram bastante, passaram no concurso.'", options: ["a) Separar um aposto.", "b) Isolar uma oração subordinada adjetiva explicativa.", "c) Separar o sujeito do predicado."], answer: "b) Isolar uma oração subordinada adjetiva explicativa." },
        { q: "Complete a frase, respeitando a concordância verbal: '_ fazer três anos que ele se mudou para cá.'", options: ["a) Vão", "b) Faz", "c) Fazem"], answer: "b) Faz" },
        { q: "Identifique a palavra que é um substantivo sobrecomum:", options: ["a) a criança", "b) o cônjuge", "c) o estudante"], answer: "a) a criança" },
        { q: "Qual a classe gramatical da palavra destacada: 'Ele é um homem bastante inteligente.'", options: ["a) Adjetivo", "b) Advérbio", "c) Pronome"], answer: "b) Advérbio" },
        { q: "Em qual alternativa a colocação pronominal está incorreta?", options: ["a) Me disseram que você voltaria.", "b) Eu te amo.", "c) Ele se machucou."], answer: "a) Me disseram que você voltaria." },
        { q: "Assinale a frase em que o uso do hífen está correto:", options: ["a) anti-social", "b) super-homem", "c) auto-escola"], answer: "b) super-homem" },
        { q: "Qual a diferença entre 'mas' e 'mais'?", options: ["a) Mas é conjunção adversativa; mais é advérbio de intensidade.", "b) Mas é advérbio; mais é conjunção.", "c) Ambos significam adição."], answer: "a) Mas é conjunção adversativa; mais é advérbio de intensidade." },
        { q: "Complete com seção, sessão ou cessão: 'A _ de direitos do imóvel ocorreu durante a _ de cinema.'", options: ["a) sessão / cessão", "b) cessão / sessão", "c) seção / sessão"], answer: "b) cessão / sessão" },
        { q: "Reescreva a frase, corrigindo a concordância nominal: 'As blusas e os sapatos estavam meio sujos.'", options: ["a) As blusas e os sapatos estavam sujos.", "b) As blusas e os sapatos estavam meios sujos.", "c) As blusas e os sapatos estavam meia sujos."], answer: "a) As blusas e os sapatos estavam sujos." },
        { q: "Qual a função sintática do termo em destaque: 'A chuva, forte e constante, alagou a cidade.'", options: ["a) Aposto", "b) Adjunto Adnominal", "c) Sujeito"], answer: "b) Adjunto Adnominal" },
        { q: "Qual a função do ponto e vírgula?", options: ["a) Interromper a frase.", "b) Separar orações coordenadas com certa extensão ou que já contêm vírgula.", "c) Marcar uma pergunta."], answer: "b) Separar orações coordenadas com certa extensão ou que já contêm vírgula." },
        { q: "Qual a diferença entre o uso de há (verbo haver) e a (preposição) em relação ao tempo?", options: ["a) Há indica tempo futuro ou distância; a indica tempo passado.", "b) Há indica tempo passado; a indica tempo futuro ou distância;", "c) Ambos indicam tempo passado."], answer: "b) Há indica tempo passado; a indica tempo futuro ou distância," },
        { q: "Qual é o tipo de predicado na oração: 'O aluno chegou atrasado.'", options: ["a) Predicado nominal", "b) Predicado verbal", "c) Predicado verbo-nominal"], answer: "c) Predicado verbo-nominal" },
    ],
    
};

// 3. Mapeamento de Cobras e Escadas
const LADDERS_AND_SNAKES = {
    4: 14, 18: 38, 30: 70, 55: 85, 72: 95,
    98: 78, 80: 50, 65: 35, 45: 25, 22: 2, 
};

// Estrutura para a criação visual
const COBRA_ESCADA_POSITIONS = [
    { type: 'escada', start: 4, end: 14, class: 'escada-1' }, { type: 'escada', start: 18, end: 38, class: 'escada-2' },
    { type: 'escada', start: 30, end: 70, class: 'escada-3' }, { type: 'escada', start: 55, end: 85, class: 'escada-4' },
    { type: 'escada', start: 72, end: 95, class: 'escada-5' },
    { type: 'cobra', start: 98, end: 78, class: 'cobra-1' }, { type: 'cobra', start: 80, end: 50, class: 'cobra-2' },
    { type: 'cobra', start: 65, end: 35, class: 'cobra-3' }, { type: 'cobra', start: 45, end: 25, class: 'cobra-4' },
    { type: 'cobra', start: 22, end: 2, class: 'cobra-5' },
];

// --- VARIÁVEIS DE ESTADO ---
let players = [];
let currentPlayerIndex = 0;
let diceResult = 0;
let gameStatus = 'setup'; 
const QUESTION_POOL = JSON.parse(JSON.stringify(QUESTIONS_BY_THEME)); 

// --- VARIÁVEIS DOM ---
const $boardDisplay = document.getElementById('board-display');
const $numPlayers = document.getElementById('num-players');
const $setupButton = document.getElementById('setup-button');
const $gameSetup = document.getElementById('game-setup');
const $turnDisplay = document.getElementById('turn-display');
const $currentPlayerName = document.getElementById('current-player-name');
const $rollDiceButton = document.getElementById('roll-dice-button');
const $diceResult = document.getElementById('dice-result');
const $quizArea = document.getElementById('quiz-area');
const $questionText = document.getElementById('question-text');
const $themeText = document.getElementById('theme-text');
const $optionsContainer = document.getElementById('options-container');
const $feedbackMessage = document.getElementById('feedback-message');
const $continueButton = document.getElementById('continue-button');
const $scoreBoard = document.getElementById('score-board');
const $playersList = document.getElementById('players-list');
const $darkModeToggle = document.getElementById('dark-mode-toggle');


// --- FUNÇÕES DE POSICIONAMENTO (CORRIGIDAS) ---

/**
 * Retorna as coordenadas TOP e LEFT em porcentagem para centralizar o peão na célula.
 */
function getCellCenterPosition(cellId, playerIndex) {
    // 1. Determina a Linha e Coluna no grid 10x10 (lógica boustrophedon)
    const cell = BOARD_CELLS[cellId];
    const row = Math.floor(cell.id / 10); 
    const isOddRow = row % 2 !== 0; 
    
    let col;
    if (isOddRow) {
        // Linhas ímpares (Contagem da direita para a esquerda)
        col = 9 - (cell.id % 10);
    } else {
        // Linhas pares (Contagem da esquerda para a direita)
        col = cell.id % 10;
    }

    // A posição do centro da célula é: (posição inicial da célula) + (metade do tamanho da célula)
    // 9 - row é para inverter a contagem, pois a linha 0 (casa 0) está no fundo (90%)
    const center_top = (9 - row) * 10 + 5; 
    const center_left = col * 10 + 5; 
    
    // Deslocamento para separar os peões na mesma casa (em pixels)
    const OFFSET = 5; 
    const offsetX = playerIndex * OFFSET;
    const offsetY = playerIndex * OFFSET;
    
    return {
        top: `${center_top}%`,
        left: `${center_left}%`,
        offsetX: offsetX,
        offsetY: offsetY
    };
}

function createBoardVisuals() {
    // 1. Gera as 100 células (Lógica inalterada, pois usa porcentagem e está correta)
    $boardDisplay.innerHTML = ''; 
    
    for(let i = 0; i < BOARD_SIZE; i++) {
        const cell = BOARD_CELLS[i];
        const row = Math.floor(i / 10); 
        const isOddRow = row % 2 !== 0; 
        
        let col;
        if (isOddRow) {
            col = 9 - (i % 10);
        } else {
            col = i % 10;
        }

        const topPosition = (9 - row) * 10; 
        const leftPosition = col * 10;

        const cellDiv = document.createElement('div');
        cellDiv.id = `cell-${cell.id}`;
        
        let cssClass = '';
        if (cell.theme === 'start') cssClass = 'start';
        else if (cell.theme === 'final') cssClass = 'final';
        else if (cell.theme === 'ACENTUAÇÃO') cssClass = 'quimica'; 
        else if (cell.theme === 'CRASE') cssClass = 'historia'; 
        else if (cell.theme === 'GRAMÁTICA DIVERSA') cssClass = 'matematica'; 
        else if (cell.theme === 'GERAL') cssClass = 'geral'; 

        cellDiv.className = `board-cell ${cssClass}`;
        cellDiv.innerHTML = `<span class="cell-label">${cell.label}</span>`;
        
        cellDiv.style.top = `${topPosition}%`;
        cellDiv.style.left = `${leftPosition}%`;
        
        $boardDisplay.appendChild(cellDiv);
    }
    
    // 2. Adiciona os visuais de Cobras e Escadas (Ícones)
    COBRA_ESCADA_POSITIONS.forEach(item => {
        const line = document.createElement('div');
        line.id = `link-${item.start}-${item.end}`;
        line.className = `board-link ${item.type}`;
        
        const icon = document.createElement('i');
        icon.className = `fas fa-${item.type === 'escada' ? 'angle-double-up' : 'angle-double-down'}`;
        line.appendChild(icon);
        
        const startCell = BOARD_CELLS[item.start];
        const startRow = Math.floor(startCell.id / 10);
        const isOddRow = startRow % 2 !== 0; 
        let startCol;
        if (isOddRow) {
            startCol = 9 - (startCell.id % 10);
        } else {
            startCol = startCell.id % 10;
        }

        const topPosition = (9 - startRow) * 10 + 2; 
        const leftPosition = startCol * 10 + 2; 
        
        line.style.top = `${topPosition}%`;
        line.style.left = `${leftPosition}%`;
        line.style.width = '10%'; 
        line.style.height = '10%';
        
        $boardDisplay.appendChild(line);
    });

    // 3. Adiciona os peões e os associa aos jogadores
    players.forEach((player, index) => {
        const token = document.getElementById(`player-token-${player.id}`);
        $boardDisplay.appendChild(token); 
        
        token.classList.remove('hidden');
        player.token = token; 
    });
    
    // Posiciona todos na casa 0
    updateBoardAndTokens();
}

function updateBoardAndTokens() {
    // Reposiciona todos os peões usando o cálculo percentual
    players.forEach((player, index) => {
        if (player.token) {
            const pos = getCellCenterPosition(player.position, index);
            
            // 1. Define o ponto de origem do peão (centro da célula)
            player.token.style.top = pos.top;
            player.token.style.left = pos.left;
            
            // 2. Translação: -50% para centralizar o peão + o offset em pixels para separar
            player.token.style.transform = `translate(calc(-50% + ${pos.offsetX}px), calc(-50% + ${pos.offsetY}px))`;
        }
    });

    // 3. Atualiza o placar
    $playersList.innerHTML = players.map(p => 
        `<li class="${p.id === players[currentPlayerIndex].id ? 'current-player-text' : ''}">
            <span class="player-${p.id}-text">${p.name} (P${p.id})</span>: Casa ${p.position}
        </li>`
    ).join('');
}


// --- LÓGICA DO JOGO ---

function startGame() {
    const num = parseInt($numPlayers.value);
    
    players = [];
    for (let i = 1; i <= num; i++) {
        let playerName = prompt(`Defina o nome para o Jogador ${i}:`);
        if (!playerName || playerName.trim() === "") {
            playerName = `Jogador ${i}`; 
        }

        players.push({
            id: i,
            name: playerName,
            position: 0,
            score: 0,
            token: null
        });
    }
    currentPlayerIndex = 0;
    gameStatus = 'rolling';

    $gameSetup.classList.add('hidden');
    $turnDisplay.classList.remove('hidden');
    $scoreBoard.classList.remove('hidden');
    $rollDiceButton.disabled = false;
    $diceResult.classList.add('hidden');
    
    createBoardVisuals(); 
    updateTurnDisplay();
}

function updateTurnDisplay() {
    const player = players[currentPlayerIndex];
    $currentPlayerName.textContent = player.name;
    $currentPlayerName.className = `player-${player.id}-text`; 
}

// NOVO: Função para animar o lançamento do dado
function animateDice(finalResult, duration = 800) {
    return new Promise(resolve => {
        const startTime = Date.now();
        $diceResult.style.backgroundColor = 'var(--accent-color)'; // Cor de animação
        
        const interval = setInterval(() => {
            if (Date.now() - startTime < duration) {
                // Rola um número aleatório
                const random = Math.floor(Math.random() * 6) + 1;
                $diceResult.textContent = random;
            } else {
                // Pousa no resultado final
                clearInterval(interval);
                $diceResult.textContent = finalResult;
                $diceResult.style.backgroundColor = 'var(--error-color)'; // Cor final
                resolve();
            }
        }, 100); 
    });
}


async function rollDice() {
    if (gameStatus !== 'rolling') return;
    
    const roll = Math.floor(Math.random() * 6) + 1; 
    diceResult = roll;
    $diceResult.classList.remove('hidden');
    $rollDiceButton.disabled = true; 
    
    // Espera a animação do dado terminar
    await animateDice(roll); 
    
    gameStatus = 'quizzing';
    setTimeout(showQuestion, 500); 
}


function showQuestion() {
    const player = players[currentPlayerIndex];
    const currentCell = BOARD_CELLS[player.position];
    const theme = currentCell.theme;
    
    if (theme === 'start' || theme === 'final') {
        $questionText.textContent = "Casa especial. Avance automaticamente.";
        handleAnswer(true);
        return;
    }
    
    const questions = QUESTION_POOL[theme] || QUESTION_POOL['GERAL'];
    
    if (questions.length === 0) {
        $questionText.textContent = "Todas as perguntas deste tema foram esgotadas. Avance!";
        handleAnswer(true); 
        return;
    }
    
    const qIndex = Math.floor(Math.random() * questions.length);
    const question = questions[qIndex];
    questions.splice(qIndex, 1); 
    
    $themeText.textContent = `TEMA: ${theme.toUpperCase()}`;
    $questionText.textContent = question.q;
    $optionsContainer.innerHTML = '';
    $feedbackMessage.classList.add('hidden');
    $quizArea.classList.remove('hidden');
    
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = option;
        btn.onclick = () => checkAnswer(btn, option, question.answer);
        $optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedButton, selectedAnswer, correctAnswer) {
    document.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
    
    const isCorrect = selectedAnswer === correctAnswer;
    
    selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // Procura e destaca a resposta correta se o jogador errou
    if (!isCorrect) {
        document.querySelectorAll('.option-button').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }

    $feedbackMessage.textContent = isCorrect 
        ? `CORRETO! ${players[currentPlayerIndex].name} avançará ${diceResult} casas.` 
        : `ERRADO. A resposta correta era: ${correctAnswer}. ${players[currentPlayerIndex].name} permanece na casa ${players[currentPlayerIndex].position}.`;
    $feedbackMessage.classList.remove('hidden');
    
    $continueButton.textContent = 'CONTINUAR';
    $continueButton.classList.remove('hidden');
    $continueButton.onclick = () => handleAnswer(isCorrect);
}

function handleAnswer(wasCorrect) {
    $quizArea.classList.add('hidden');
    $continueButton.classList.add('hidden');
    gameStatus = 'moving';
    
    if (wasCorrect) {
        movePlayer(players[currentPlayerIndex], diceResult);
    } else {
        // Sem alerta, o feedback já foi dado na tela do quiz
        endTurn();
    }
}

function movePlayer(player, steps) {
    let newPosition = player.position + steps;
    
    if (newPosition >= BOARD_SIZE - 1) {
        newPosition = BOARD_SIZE - 1;
        player.position = newPosition;
        updateBoardAndTokens();
        
        setTimeout(() => {
             alert(`${player.name} VENCEU o jogo!`);
             gameStatus = 'finished';
             $rollDiceButton.disabled = true;
        }, 800);
        return;
    }
    
    player.position = newPosition;
    updateBoardAndTokens(); 
    
    setTimeout(() => { 
        const destination = LADDERS_AND_SNAKES[newPosition];
        if (destination !== undefined) {
            let message = '';
            
            if (destination > newPosition) {
                message = `${player.name} encontrou uma ESCADA (Casa ${newPosition})! Avança para a casa ${destination}.`;
            } else {
                message = `${player.name} caiu em uma COBRA (Casa ${newPosition})! Regride para a casa ${destination}.`;
            }
            
            player.position = destination; 
            updateBoardAndTokens(); 
            // Uso de setTimeout dentro de alert para melhor UX em movimentos encadeados
            setTimeout(() => {
                 alert(message);
                 endTurn();
            }, 500);
        } else {
            endTurn();
        }
    }, 500); 
}

function endTurn() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    gameStatus = 'rolling';
    $rollDiceButton.disabled = false;
    $diceResult.classList.add('hidden');
    updateTurnDisplay();
    updateBoardAndTokens(); 
}

// --- LÓGICA DO MODO ESCURO (Mantida) ---
function loadDarkModePreference() {
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        $darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
        document.body.classList.remove('dark-mode');
        $darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'enabled');
        $darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
    } else {
        localStorage.setItem('dark-mode', 'disabled');
        $darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
    }
}


// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do Modo Escuro
    loadDarkModePreference();
    $darkModeToggle.addEventListener('click', toggleDarkMode);

    // Eventos do Jogo
    $setupButton.addEventListener('click', startGame);
    $rollDiceButton.addEventListener('click', rollDice);
    
    // Atualiza a posição dos peões se o tabuleiro for redimensionado (para manter o alinhamento perfeito)
    window.addEventListener('resize', updateBoardAndTokens);
});
