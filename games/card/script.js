// --- DADOS DO JOGO ---
const PHILOSOPHERS = {
    CEFALO: {
        name: "Céfalo",
        definition: "Justiça é ser honesto, dizer a verdade e devolver o que se deve (a justiça tradicional).",
    },
    POLEMARCO: {
        name: "Polemarco",
        definition: "Justiça é fazer o bem aos amigos e o mal aos inimigos.",
    },
    TRASIMACO: {
        name: "Trasímaco",
        definition: "Justiça é simplesmente 'a vantagem do mais forte' e injustiça é preferível.",
    },
};

const DILEMMAS = [
    // --- CÉFALO: Devolver o que se deve/Verdade ---
    {
        philosopher: 'CEFALO',
        title: "O Tesouro Esquecido",
        text: "Um fazendeiro humilde encontrou uma grande quantia de moedas de ouro enterradas em seu campo, pertencentes ao seu vizinho, um comerciante rico e avarento. O fazendeiro poderia usar o dinheiro para salvar sua família da fome iminente.",
        choices: [
            { id: 'A', label: "Devolver o Tesouro", action: "O fazendeiro deve devolver o tesouro ao comerciante, pois é o que se deve.", isCorrect: true, explanation: "Céfalo se apega à regra tradicional de devolver a propriedade, ignorando as consequências éticas complexas (o contraexemplo de Sócrates)." },
            { id: 'B', label: "Usar para a Família", action: "O fazendeiro deve usar o tesouro para salvar sua família, pois a necessidade moral é maior que a dívida material.", isCorrect: false, explanation: "Esta é a refutação de Sócrates a Céfalo: a justiça não pode ser apenas seguir a regra cegamente." }
        ]
    },
    {
        philosopher: 'CEFALO',
        title: "A Arma do Amigo",
        text: "Um amigo lhe emprestou sua espada e seu escudo. Ele retorna para buscá-los, mas está claramente tomado pela loucura e pela fúria, e pode usá-los para ferir inocentes.",
        choices: [
            { id: 'A', label: "Devolver a Arma", action: "Devolver o que se deve ao dono, pois a justiça é cumprir a palavra e a dívida.", isCorrect: true, explanation: "Para Céfalo, a justiça é a regra clara: devolver a dívida, mesmo que seja uma arma a um insano. (Embora Sócrates refute isso, é o que Céfalo defenderia)." },
            { id: 'B', label: "Reter a Arma", action: "Reter a arma até que ele se acalme, pois devolver a um insano seria prejudicial.", isCorrect: false, explanation: "Esta seria a postura de Sócrates, provando que a definição de Céfalo é inadequada, mas não a própria postura de Céfalo." }
        ]
    },
    
    // --- POLEMARCO: Bem aos amigos, mal aos inimigos ---
    {
        philosopher: 'POLEMARCO',
        title: "O Inimigo Vencedor",
        text: "Seu rival político, que sempre tentou prejudicar você e sua família (seu inimigo), acaba de perder todo seu patrimônio em um incêndio. Ele pede ajuda à Pólis.",
        choices: [
            { id: 'A', label: "Negar Ajuda", action: "A Pólis deve negar qualquer auxílio, pois a justiça é fazer o mal (prejudicar) aos inimigos.", isCorrect: true, explanation: "Polemarco define a justiça como prejudicar aqueles que merecem o rótulo de 'inimigo'." },
            { id: 'B', label: "Prestar Auxílio", action: "A Pólis deve ajudar, pois a justiça envolve melhorar, e não piorar, as pessoas.", isCorrect: false, explanation: "Esta é a refutação de Sócrates a Polemarco: a justiça jamais pode causar dano." }
        ]
    },
    {
        philosopher: 'POLEMARCO',
        title: "O Aliado Suspeito",
        text: "Um aliado comercial de longa data (seu amigo) está sendo julgado por fraude. Há evidências fracas contra ele, mas a condenação beneficiaria financeiramente seus outros amigos.",
        choices: [
            { id: 'A', label: "Defender Cegamente", action: "Você deve defendê-lo incondicionalmente no tribunal, pois a justiça é fazer o bem aos amigos.", isCorrect: true, explanation: "A definição de Polemarco é subjetiva e baseada no benefício mútuo: deve-se sempre beneficiar o amigo." },
            { id: 'B', label: "Buscar a Verdade", action: "Você deve procurar a verdade objetiva, mesmo que isso prejudique seu amigo e beneficie o inimigo.", isCorrect: false, explanation: "Sócrates argumenta que a justiça é uma arte objetiva (como a medicina) e não pode ser definida por laços emocionais." }
        ]
    },
    
    // --- TRASIMACO: Vantagem do Mais Forte/Injustiça é lucro ---
    {
        philosopher: 'TRASIMACO',
        title: "O Imposto Justo",
        text: "O Conselho precisa criar uma nova lei de impostos. Você é um legislador poderoso e a lei beneficia claramente os ricos e o seu grupo, mas prejudica os cidadãos mais pobres.",
        choices: [
            { id: 'A', label: "Implementar a Lei", action: "A lei deve ser implementada como está, pois a justiça é a vantagem do grupo no poder.", isCorrect: true, explanation: "Para Trasímaco, a justiça é um termo político usado para descrever o que o poder dominante decide, e o poder busca seu próprio benefício." },
            { id: 'B', label: "Revisar a Lei", action: "A lei deve ser revisada para beneficiar os governados, pois a arte de governar serve ao objeto de seu cuidado.", isCorrect: false, explanation: "Esta é a refutação de Sócrates a Trasímaco, comparando o governante a um médico que cura o paciente, não a si mesmo." }
        ]
    },
    {
        philosopher: 'TRASIMACO',
        title: "O Tirano e o Pastor",
        text: "Um tirano local governa a Pólis de forma opressora, roubando e matando para seu próprio lucro e prazer. Os cidadãos o veem como injusto.",
        choices: [
            { id: 'A', label: "Elogiar o Tirano", action: "O tirano é o ser mais justo, pois age para sua máxima vantagem e alcança o maior lucro e poder.", isCorrect: true, explanation: "Trasímaco afirma que a injustiça completa é preferível à justiça e que a vida mais lucrativa e feliz é a do tirano." },
            { id: 'B', label: "Condenar o Tirano", action: "O tirano é o ser mais injusto, pois a verdadeira felicidade só é alcançada por meio da justiça e da virtude.", isCorrect: false, explanation: "Esta é a visão de Sócrates, que argumenta que a vida justa, mesmo que sem poder, é inerentemente mais feliz." }
        ]
    }
];

// --- VARIÁVEIS DE ESTADO ---
let currentDilemmaIndex = 0;
let score = { correct: 0, total: DILEMMAS.length };
let isSwiping = false;
let startX = 0;
let currentX = 0;
let isRoundFinished = false; // NOVA FLAG para bloquear o swipe após a escolha
let shuffledChoices = [];


// --- ELEMENTOS DOM ---
const philosopherNameEl = document.getElementById('current-philosopher');
const philosopherDefEl = document.getElementById('philosopher-definition');
const dilemmaTitleEl = document.getElementById('dilemma-title');
const dilemmaTextEl = document.getElementById('dilemma-text');
const decisionCardEl = document.getElementById('decision-card');
const feedbackPanelEl = document.getElementById('feedback-panel');
const feedbackMessageEl = document.getElementById('feedback-message');
const nextButtonEl = document.getElementById('next-button');
const labelLeftEl = document.getElementById('label-left');
const labelRightEl = document.getElementById('label-right');


// --- FUNÇÕES DE JOGABILIDADE ---

function shuffleChoices(choices) {
    let array = [...choices];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadDilemma() {
    if (currentDilemmaIndex >= DILEMMAS.length) {
        endGame();
        return;
    }

    isRoundFinished = false; // Reset da flag de rodada
    
    const dilemma = DILEMMAS[currentDilemmaIndex];
    const philosopherData = PHILOSOPHERS[dilemma.philosopher];
    
    shuffledChoices = shuffleChoices(dilemma.choices);

    // Atualiza info do Filósofo e Dilema
    philosopherNameEl.textContent = philosopherData.name;
    philosopherDefEl.textContent = `"${philosopherData.definition}"`;
    dilemmaTitleEl.textContent = `Dilema ${currentDilemmaIndex + 1}: ${dilemma.title}`;
    dilemmaTextEl.textContent = dilemma.text;

    // Atualiza labels de swipe (Opção 0 na esquerda, Opção 1 na direita)
    labelLeftEl.innerHTML = `**ESQUERDA:** ${shuffledChoices[0].action}`;
    labelRightEl.innerHTML = `**DIREITA:** ${shuffledChoices[1].action}`;
    
    resetCardPosition();
    feedbackPanelEl.classList.add('hidden');
}

function handleSwipe(direction) { // 'left' ou 'right'
    if (isRoundFinished) return; // Bloqueia múltiplas chamadas
    isRoundFinished = true;
    
    const dilemma = DILEMMAS[currentDilemmaIndex];
    
    // Pega a opção baseada na direção e no array embaralhado
    const chosenOption = (direction === 'right') ? shuffledChoices[1] : shuffledChoices[0]; 
    
    let isCorrect = chosenOption.isCorrect;
    
    // Animação final: o cartão que desliza para fora
    const rotation = (direction === 'right') ? 30 : -30;
    const translation = (direction === 'right') ? window.innerWidth : -window.innerWidth;
    decisionCardEl.style.transition = 'transform 0.4s ease-in'; // Adiciona transição para o movimento final
    decisionCardEl.style.transform = `translate(${translation}px, 0) rotate(${rotation}deg)`;
    
    // Dá o feedback
    setTimeout(() => {
        if (isCorrect) {
            score.correct++;
            feedbackMessageEl.innerHTML = `<strong>Decisão CORRETA!</strong> Isso se alinha com a visão de ${PHILOSOPHERS[dilemma.philosopher].name}. <br><br> ${chosenOption.explanation}`;
            feedbackMessageEl.className = 'feedback-correct';
        } else {
            // Encontra a explicação da resposta correta no array original para o feedback
            const correctOption = dilemma.choices.find(c => c.isCorrect); 
            
            feedbackMessageEl.innerHTML = `<strong>Decisão INCORRETA.</strong> Essa não é a postura do filósofo. <br><br> A resposta correta seria: ${correctOption.action}. <br> ${correctOption.explanation}`;
            feedbackMessageEl.className = 'feedback-incorrect';
        }

        feedbackPanelEl.classList.remove('hidden');
        decisionCardEl.style.transition = 'none'; // Remove transição para o reset
    }, 400); // Tempo para a animação de swipe terminar antes de mostrar o painel
    
}

function endGame() {
    philosopherNameEl.textContent = "FIM DO JULGAMENTO";
    philosopherDefEl.textContent = "A Pólis agradece seus esforços.";
    dilemmaTitleEl.textContent = "Resultados Finais";
    dilemmaTextEl.textContent = `Você completou o Julgamento, acertando ${score.correct} de ${score.total} dilemas filosóficos.`;
    
    decisionCardEl.style.display = 'none'; // Esconde o card
    feedbackPanelEl.classList.remove('hidden');
    feedbackMessageEl.innerHTML = `<h2 style="color:white; margin: 0;">Pontuação Final: ${score.correct}/${score.total}</h2>`;
    feedbackMessageEl.className = 'feedback-default';
    nextButtonEl.textContent = "REINICIAR JOGO";
    nextButtonEl.onclick = () => {
        currentDilemmaIndex = 0;
        score.correct = 0;
        decisionCardEl.style.display = 'flex';
        nextButtonEl.textContent = "PRÓXIMO DILEMA";
        nextButtonEl.onclick = () => { currentDilemmaIndex++; loadDilemma(); };
        loadDilemma();
    };
}


// --- LÓGICA DE SWIPE CORRIGIDA ---

function resetCardPosition() {
    decisionCardEl.style.transform = 'translate(0, 0) rotate(0deg)';
    decisionCardEl.classList.remove('swiping');
    
    labelLeftEl.classList.remove('visible');
    labelRightEl.classList.remove('visible');
}

// Função auxiliar para obter a coordenada X do evento
function getClientX(event) {
    return event.clientX || (event.touches && event.touches[0].clientX);
}

decisionCardEl.addEventListener('pointerdown', (e) => {
    if (isRoundFinished) return; // Não permite se a rodada já terminou
    
    isSwiping = true;
    startX = getClientX(e);
    currentX = startX; // Garante que currentX seja inicializado
    decisionCardEl.classList.add('swiping');
    decisionCardEl.setPointerCapture(e.pointerId);
});

decisionCardEl.addEventListener('pointermove', (e) => {
    if (!isSwiping || isRoundFinished) return;

    currentX = getClientX(e);
    const deltaX = currentX - startX;
    
    // Rotação sutil e movimento lateral
    const rotation = deltaX / 20; 
    decisionCardEl.style.transform = `translate(${deltaX}px, 0) rotate(${rotation}deg)`;

    const visibilityThreshold = 30; // Distância mínima para a label aparecer
    
    // Mostrar labels de swipe
    if (deltaX < -visibilityThreshold) { // Arrasta para esquerda
        labelLeftEl.classList.add('visible');
        labelRightEl.classList.remove('visible');
    } else if (deltaX > visibilityThreshold) { // Arrasta para direita
        labelRightEl.classList.add('visible');
        labelLeftEl.classList.remove('visible');
    } else {
        labelLeftEl.classList.remove('visible');
        labelRightEl.classList.remove('visible');
    }
});

decisionCardEl.addEventListener('pointerup', (e) => {
    if (!isSwiping || isRoundFinished) return;
    isSwiping = false;
    decisionCardEl.classList.remove('swiping'); 
    decisionCardEl.releasePointerCapture(e.pointerId); 

    const deltaX = currentX - startX; // Usa a última posição válida (currentX)
    const swipeThreshold = decisionCardEl.offsetWidth * 0.4; 

    if (deltaX < -swipeThreshold) {
        // Swipe para a esquerda
        handleSwipe('left');
    } else if (deltaX > swipeThreshold) {
        // Swipe para a direita
        handleSwipe('right');
    } else {
        // Não foi um swipe suficiente, retorna o card
        resetCardPosition();
    }
    // Garante que os labels de swipe desapareçam
    labelLeftEl.classList.remove('visible');
    labelRightEl.classList.remove('visible');
});


// --- CONTROLE DE FLUXO ---
nextButtonEl.addEventListener('click', () => {
    currentDilemmaIndex++;
    loadDilemma();
});

// Inicialização
document.addEventListener('DOMContentLoaded', loadDilemma);
