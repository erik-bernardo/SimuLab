const QUIZ_DATA = [
    // 1. WILL (Decisão Instantânea)
    {
        scenario_pt: "Seu amigo está com calor. Você decide ajudá-lo **agora**.",
        correct_sentence: "I will open the window for you.",
        blocks: ["I", "will", "open", "the", "window", "for", "you", ".", "am" , "going" , "to", "closing"],
        answer_type: "WILL (Decisão Instantânea/Oferta)"
    },
    // 2. GOING TO (Plano Prévio)
    {
        scenario_pt: "Você comprou um mapa e está com a mochila nas costas. O **plano** é claro.",
        correct_sentence: "I am going to hike tomorrow.",
        blocks: ["I", "am", "going", "to", "hike", "tomorrow", ".", "will", "forgot"],
        answer_type: "GOING TO (Plano Prévio)"
    },
    // 3. WILL (Promessa)
    {
        scenario_pt: "A professora **prometeu** dar uma nota extra se você terminar o projeto.",
        correct_sentence: "She will give us an extra grade.",
        blocks: ["She", "will", "give", "us", "an", "extra", "grade", ".", "is" , "going" , "to", "refused"],
        answer_type: "WILL (Promessa)"
    },
    // 4. GOING TO (Previsão com Evidência)
    {
        scenario_pt: "Há um buraco no teto e a água está pingando **agora**. É uma **evidência** clara.",
        correct_sentence: "The roof is going to collapse.",
        blocks: ["The", "roof", "is", "going", "to", "collapse", ".", "will", "fix"],
        answer_type: "GOING TO (Previsão com Evidência)"
    },
    // 5. WILL (Opinião/Previsão Geral)
    {
        scenario_pt: "Você acha que a temperatura geral do planeta **continuará** a subir nos próximos anos.",
        correct_sentence: "I think the temperature will rise.",
        blocks: ["I", "think", "the", "temperature", "will", "rise", ".", "is" , "going" , "to", "dropped"],
        answer_type: "WILL (Opinião/Previsão Geral)"
    },
    // --- CENÁRIOS OPOSTOS (com Distratores) ---
    // 6. GOING TO (Intenção/Plano Prévio)
    {
        scenario_pt: "Você planejou ir a uma festa e **já escolheu** a roupa durante o dia.",
        correct_sentence: "I am going to wear my best dress.",
        blocks: ["I", "am", "going", "to", "wear", "my", "best", "dress", ".", "will", "forget"],
        answer_type: "GOING TO (Plano Prévio/Intenção)"
    },
    // 7. WILL (Previsão Geral/Opinião)
    {
        scenario_pt: "Você acha que, em geral, **mais pessoas** vão praticar caminhadas no próximo verão.",
        correct_sentence: "More people will hike next summer.",
        blocks: ["More", "people", "will", "hike", "next", "summer", ".", "are", "going" , "to", "stopped"],
        answer_type: "WILL (Previsão Geral/Opinião)"
    },
    // 8. GOING TO (Evento Agendado/Plano)
    {
        scenario_pt: "A professora colocou no cronograma que **faremos** uma prova na próxima semana.",
        correct_sentence: "She is going to give us a test next week.",
        blocks: ["She", "is", "going", "to", "give", "us", "a", "test", "next", "week", ".", "will", "might"],
        answer_type: "GOING TO (Evento Agendado/Plano)"
    },
    // 9. WILL (Oferta/Decisão Instantânea)
    {
        scenario_pt: "Você percebe que a lâmpada está piscando e **se oferece** para consertá-la.",
        correct_sentence: "I will fix the lamp for you now.",
        blocks: ["I", "will", "fix", "the", "lamp", "for", "you", "now", ".", "am going to", "avoid"],
        answer_type: "WILL (Oferta/Decisão Instantânea)"
    },
    // 10. GOING TO (Intenção/Plano Pessoal)
    {
        scenario_pt: "Você decidiu fazer um curso sobre clima no próximo semestre. É seu **plano pessoal**.",
        correct_sentence: "I am going to study climate change.",
        blocks: ["I", "am", "going", "to", "study", "climate", "change", ".", "will", "postpone"],
        answer_type: "GOING TO (Intenção/Plano Pessoal)"
    }
];

// Elementos DOM
const scenarioTitleEl = document.getElementById('scenario-title');
const scenarioTextEl = document.getElementById('scenario-text');
const targetBlocksEl = document.getElementById('target-blocks');
const sourceBlocksEl = document.getElementById('source-blocks');
const checkButtonEl = document.getElementById('check-button');
const resetButtonEl = document.getElementById('reset-button');
const nextButtonEl = document.getElementById('next-button');
const feedbackMessageEl = document.getElementById('feedback-message');
const scoreDisplayEl = document.getElementById('score-display');

// Estado do Jogo
let currentRound = 0;
let score = 0;
let mountedBlocks = []; // Blocos na área de destino

// --- Funções de Ajuda ---

// Embaralha uma array (usado para os blocos)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Cria o elemento de bloco
function createBlockElement(word, sourceArea) {
    const block = document.createElement('div');
    block.className = 'word-block';
    block.textContent = word;
    
    // Anexa o listener de clique
    block.addEventListener('click', () => {
        if (checkButtonEl.disabled === true && !nextButtonEl.classList.contains('hidden')) {
            // Não permite mover blocos se a resposta já foi verificada e está incorreta
            return;
        }

        if (sourceArea === 'source') {
            // Move da Origem para o Destino
            sourceBlocksEl.removeChild(block);
            targetBlocksEl.appendChild(block);
            mountedBlocks.push(word);
        } else {
            // Move do Destino para a Origem
            targetBlocksEl.removeChild(block);
            sourceBlocksEl.appendChild(block);
            mountedBlocks = mountedBlocks.filter(w => w !== word);
        }
        
        // Habilita o botão verificar se houver blocos no destino
        checkButtonEl.disabled = mountedBlocks.length === 0;
    });

    return block;
}

// --- Funções Principais do Jogo ---

function loadRound() {
    if (currentRound >= QUIZ_DATA.length) {
        endGame();
        return;
    }

    const data = QUIZ_DATA[currentRound];
    
    // 1. Limpa as áreas
    targetBlocksEl.innerHTML = '';
    sourceBlocksEl.innerHTML = '';
    mountedBlocks = [];

    // 2. Atualiza UI e Estado
    scenarioTitleEl.textContent = `CENÁRIO ${currentRound + 1}/${QUIZ_DATA.length}: ${data.answer_type}`;
    scenarioTextEl.textContent = data.scenario_pt;
    feedbackMessageEl.textContent = '';
    feedbackMessageEl.className = '';
    scoreDisplayEl.textContent = `Pontos: ${score}`;
    
    checkButtonEl.disabled = true;
    nextButtonEl.classList.add('hidden');

    // 3. Cria e embaralha os blocos
    const scrambledBlocks = shuffle([...data.blocks]); 
    scrambledBlocks.forEach(word => {
        const block = createBlockElement(word, 'source');
        sourceBlocksEl.appendChild(block);
    });
}

function checkSentence() {
    const data = QUIZ_DATA[currentRound];
    
    // Junta as palavras montadas com espaço (e ajusta a pontuação)
    let userSentence = '';
    const targetBlocks = targetBlocksEl.querySelectorAll('.word-block');

    targetBlocks.forEach((block, index) => {
        const word = block.textContent.trim();
        // Adiciona a palavra, tratando pontuações para formar a frase
        if (word === '.' || word === '?' || word === '!') {
            userSentence = userSentence.trim() + word;
        } else {
            userSentence += (index > 0 ? ' ' : '') + word;
        }
    });

    // 1. Converte a frase de destino para a frase alvo (removendo pontuações finais para comparação)
    const normalizedUser = userSentence.replace(/[\.\?!]$/, '').trim().toLowerCase();
    const normalizedCorrect = data.correct_sentence.replace(/[\.\?!]$/, '').trim().toLowerCase();
    
    // 2. Compara
    if (normalizedUser === normalizedCorrect) {
        // CORRETO
        score++;
        feedbackMessageEl.textContent = `CORRETO! Regra: ${data.answer_type}. Frase: ${data.correct_sentence}`;
        feedbackMessageEl.className = 'feedback-correct';
        scoreDisplayEl.textContent = `Pontos: ${score}`;
        
        // Marca os blocos como corretos e desabilita verificação
        targetBlocks.forEach(block => block.classList.add('block-correct'));
        checkButtonEl.disabled = true;
        nextButtonEl.classList.remove('hidden');

    } else {
        // INCORRETO
        feedbackMessageEl.textContent = `INCORRETO. Tente novamente ou use o botão 'Limpar'.`;
        feedbackMessageEl.className = 'feedback-incorrect';
        
        // Marca todos os blocos no destino como incorretos para forçar o usuário a repensar a frase
        targetBlocks.forEach(block => block.classList.add('block-incorrect'));
    }
}

function resetSentence() {
    // Recarrega a rodada para resetar todos os blocos e o estado
    loadRound();
}

function nextRound() {
    currentRound++;
    loadRound();
}

function endGame() {
    scenarioTitleEl.textContent = 'JOGO CONCLUÍDO!';
    scenarioTextEl.innerHTML = `Parabéns! Sua pontuação final é: <b>${score} de ${QUIZ_DATA.length}</b>.`;
    targetBlocksEl.innerHTML = '';
    sourceBlocksEl.innerHTML = '';
    checkButtonEl.classList.add('hidden');
    resetButtonEl.classList.add('hidden');
    nextButtonEl.classList.add('hidden');
    feedbackMessageEl.textContent = 'Reinicie a página para jogar novamente!';
}

// --- Inicialização e Eventos ---

document.addEventListener('DOMContentLoaded', loadRound);

checkButtonEl.addEventListener('click', checkSentence);
resetButtonEl.addEventListener('click', resetSentence);
nextButtonEl.addEventListener('click', nextRound);
