const QUIZ_DATA = [
    // 1. WILL (Profecia Súbita/Aviso)
    {
        icon: "🦅", // Corvo ou Águia (Presságio)
        scenario_pt: "A **sombra do Corvo negro** aparece na bola. É um aviso **repentino**.",
        scenario_interpretation: "O Corvo é a **Morte Súbita** no presságio. A profecia deve ser imediata (WILL).",
        correct_sentence: "Someone will try to hurt you soon.",
        translation_pt: "Alguém vai tentar te machucar em breve.",
        blocks: ["Someone", "will", "try", "to", "hurt", "you", "soon", ".", "is", "going", "to", "heal"],
        answer_type: "WILL (Profecia Súbita/Aviso Imediato)"
    },
    // 2. GOING TO (Plano/Intenção Pessoal Claras)
    {
        icon: "💍", // Anel (Intenção de casamento)
        scenario_pt: "O **Tarot** revela **Amantes** e **Intenção** (evidência). O destino amoroso foi traçado.",
        scenario_interpretation: "O Anel e as cartas são **evidências de um Plano (Intenção)**. Use GOING TO.",
        correct_sentence: "Your boyfriend is going to ask your hand tonight.",
        translation_pt: "Seu namorado vai pedir sua mão em casamento esta noite.",
        blocks: ["Your", "boyfriend", "is", "going", "to", "ask", "your", "hand", "tonight", ".", "will", "forget"],
        answer_type: "GOING TO (Evidência de Intenção/Plano)"
    },
    // 3. WILL (Opinião/Convicção Geral)
    {
        icon: "✋", // Mão (Leitura de Palma)
        scenario_pt: "Você lê a **linha do destino** na mão e sente uma **forte convicção** (opinião mística).",
        scenario_interpretation: "Sua **convicção** é a chave. Opiniões e crenças usam WILL.",
        correct_sentence: "I believe you will achieve great success.",
        translation_pt: "Eu acredito que você alcançará grande sucesso.",
        blocks: ["I", "believe", "you", "will", "achieve", "great", "success", ".", "are", "going", "to", "failed"],
        answer_type: "WILL (Opinião/Convicção Geral)"
    },
    // 4. GOING TO (Previsão com Evidência Física)
    {
        icon: "💥", // Cristal Trincado / Explosão
        scenario_pt: "A **Torre em chamas** e o seu **cristal trinca** (evidência física). Desastre iminente.",
        scenario_interpretation: "A trinca é uma **evidência física** do presente que leva a uma previsão. Use GOING TO.",
        correct_sentence: "This venture is going to fall apart.",
        translation_pt: "Este empreendimento vai desmoronar.",
        blocks: ["This", "venture", "is", "going", "to", "fall", "apart", ".", "will", "succeed"],
        answer_type: "GOING TO (Previsão com Evidência Iminente)"
    },
    // 5. WILL (Promessa/Pacto Místico Instantâneo)
    {
        icon: "🙏", // Mãos juntas (Juramento)
        scenario_pt: "O cliente implora por ajuda. Você faz um **juramento solene neste instante**.",
        scenario_interpretation: "Um juramento solene é uma **Promessa** feita no momento. Use WILL.",
        correct_sentence: "I will protect you from this evil.",
        translation_pt: "Eu vou te proteger deste mal.",
        blocks: ["I", "will", "protect", "you", "from", "this", "evil", ".", "am", "going", "to", "ignored"],
        answer_type: "WILL (Promessa/Pacto Místico)"
    },
    // --- CENÁRIOS OPOSTOS (com Distratores) ---
    // 6. GOING TO (Evento Agendado/Destino Fixo)
    {
        icon: "🪐", // Planeta (Alinhamento Astral)
        scenario_pt: "O **Mapa Astral** revela que a **Lua e Saturno** entrarão em alinhamento preciso na próxima semana (evento **fixo**).",
        scenario_interpretation: "Alinhamentos astrais são **eventos fixos/agendados** no destino. Use GOING TO.",
        correct_sentence: "The planet is going to align next week.",
        translation_pt: "O planeta vai se alinhar na próxima semana.",
        blocks: ["The", "planet", "is", "going", "to", "align", "next", "week", ".", "will", "stop"],
        answer_type: "GOING TO (Evento Agendado/Destino Fixo)"
    },
    // 7. WILL (Oferta de Magia Instantânea)
    {
        icon: "⚗️", // Retorta (Poção)
        scenario_pt: "O cliente perdeu a poção. Você **rapidamente** conjura um feitiço para repor a sorte **neste momento**.",
        scenario_interpretation: "Conjurar a poção rapidamente é uma **Oferta/Decisão Instantânea**. Use WILL.",
        correct_sentence: "I will brew a new potion for you.",
        translation_pt: "Eu vou preparar uma poção nova para você.",
        blocks: ["I", "will", "brew", "a", "new", "potion", "for", "you", ".", "am", "going", "to", "ruined"],
        answer_type: "WILL (Oferta de Magia Instantânea)"
    },
    // 8. GOING TO (Plano Prévio de Viagem)
    {
        icon: "🚢", // Navio (Viagem)
        scenario_pt: "A **água do caldeirão** mostra a imagem de passagens de navio já compradas. O **plano** está definido.",
        scenario_interpretation: "Passagens compradas no caldeirão são **evidências de um plano prévio**. Use GOING TO.",
        correct_sentence: "She is going to travel across the sea.",
        translation_pt: "Ela vai viajar através do mar.",
        blocks: ["She", "is", "going", "to", "travel", "across", "the", "sea", ".", "will", "stay"],
        answer_type: "GOING TO (Plano Prévio/Intenção)"
    },
    // 9. WILL (Aviso Imediato/Recusa)
    {
        icon: "🚨", // Aviso / Alerta
        scenario_pt: "O **Espírito Guia** surge de repente e te dá um **aviso imediato** contra a escolha do cliente.",
        scenario_interpretation: "O surgimento repentino do guia é uma **decisão/aviso instantâneo**. Use WILL.",
        correct_sentence: "You will not find happiness there.",
        translation_pt: "Você não encontrará felicidade lá.",
        blocks: ["You", "will", "not", "find", "happiness", "there", ".", "are", "going", "to", "get"],
        answer_type: "WILL (Aviso Súbito/Recusa)"
    },
    // 10. GOING TO (Previsão com Evidência de Abundância)
    {
        icon: "💰", // Moedas de Ouro
        scenario_pt: "O **Sol** brilha forte e **moedas de ouro** caem do pote. **Evidência** de riqueza certa.",
        scenario_interpretation: "Moedas caindo são **evidências claras** de que a riqueza está por vir. Use GOING TO.",
        correct_sentence: "The family is going to inherit a fortune.",
        translation_pt: "A família vai herdar uma fortuna.",
        blocks: ["The", "family", "is", "going", "to", "inherit", "a", "fortune", ".", "will", "lost"],
        answer_type: "GOING TO (Previsão com Evidência de Riqueza)"
    }
];

// --- Mapa de Tradução Místico (Usado para Dicas e Emojis) ---
const TRANSLATION_MAP = {
    // WILL/GOING TO - Regras
    "will": { emoji: "⚡️", pt: "Futuro Súbito/Opinião" },
    "is going to": { emoji: "⏳", pt: "Futuro Planejado/Certo" },
    "am going to": { emoji: "⏳", pt: "Futuro Planejado/Certo" },
    "are going to": { emoji: "⏳", pt: "Futuro Planejado/Certo" },
    
    // Verbos de Ação
    "try": { emoji: "⚔️", pt: "tentar" },
    "hurt": { emoji: "💔", pt: "machucar" },
    "ask": { emoji: "💍", pt: "pedir" },
    "achieve": { emoji: "🌟", pt: "alcançar" },
    "fall": { emoji: "📉", pt: "cair / desmoronar" },
    "protect": { emoji: "🛡️", pt: "proteger" },
    "align": { emoji: "✨", pt: "alinhar" },
    "brew": { emoji: "🍵", pt: "preparar / cozinhar" },
    "travel": { emoji: "🗺️", pt: "viajar" },
    "find": { emoji: "🔍", pt: "encontrar" },
    "inherit": { emoji: "👑", pt: "herdar" },

    // Palavras-Chave de Sentido
    "someone": { emoji: "👤", pt: "alguém" },
    "soon": { emoji: "🔜", pt: "em breve" },
    "tonight": { emoji: "🌙", pt: "esta noite" },
    "believe": { emoji: "🧠", pt: "eu acredito" },
    "success": { emoji: "🏆", pt: "sucesso" },
    "venture": { emoji: "🏗️", pt: "empreendimento" },
    "evil": { emoji: "😈", pt: "mal" },
    "fortune": { emoji: "💰", pt: "fortuna" },
    "happiness": { emoji: "😊", pt: "felicidade" },
    "across": { emoji: "➡️", pt: "através de" },
    "sea": { emoji: "🌊", pt: "mar" },
    "next week": { emoji: "🗓️", pt: "próxima semana" }
};


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
const dictionaryContentEl = document.getElementById('dictionary-content');
const interpretationContentEl = document.getElementById('interpretation-content'); 

// Estado do Jogo
let currentRound = 0;
let score = 0;
let mountedBlocks = []; 
let hintUsedInRound = false; // NOVO: Flag para rastrear se o jogador errou/usou a dica na rodada

// --- Funções de Ajuda ---

// Embaralha uma array (usado para os blocos)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Cria o elemento de bloco e anexa o listener de clique
function createBlockElement(word) {
    const block = document.createElement('div');
    block.className = 'word-block';
    block.textContent = word;
    
    block.addEventListener('click', () => {
        if (checkButtonEl.disabled === true && !nextButtonEl.classList.contains('hidden')) {
            return;
        }

        const isTarget = block.parentNode === targetBlocksEl;

        if (!isTarget) {
            // Move da Fonte para o Destino
            sourceBlocksEl.removeChild(block);
            targetBlocksEl.appendChild(block);
            mountedBlocks.push(word);
        } else {
            // Move do Destino para a Fonte (função de desfazer)
            resetSentence();
            return; 
        }
        
        checkButtonEl.disabled = targetBlocksEl.childElementCount === 0;
    });

    return block;
}

// Função para obter emojis de palavras-chave para o cenário
function getScenarioEmojis(data) {
    const correctWords = data.correct_sentence.toLowerCase().split(/\s|\./).filter(w => w.length > 0);
    let scenarioEmojis = '';
    
    // Tenta obter emojis de até 3 palavras-chave (além do ícone principal)
    let emojisCount = 0;
    
    for (let word of correctWords) {
        word = word.replace(/[^a-z0-9]/g, '');

        // Ignora palavras comuns ou auxiliares
        if (["i", "you", "a", "an", "the", "to", "will", "is", "going", "am", "are", "not"].includes(word)) {
            continue;
        }

        if (TRANSLATION_MAP[word] && emojisCount < 3) {
            scenarioEmojis += `<span style="font-size: 1.5em; margin: 0 5px;">${TRANSLATION_MAP[word].emoji}</span>`;
            emojisCount++;
        }
    }

    return scenarioEmojis;
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
    hintUsedInRound = false; // <<< NOVO: Reinicia a flag para cada nova rodada

    // 2. Atualiza UI e Estado
    scenarioTitleEl.textContent = `Profecia ${currentRound + 1}/${QUIZ_DATA.length}: ${data.answer_type}`;
    
    // Atualiza o cenário com Ícone Principal e os Emojis da Frase
    const secondaryEmojis = getScenarioEmojis(data);
    scenarioTextEl.innerHTML = `
        <span id="scenario-icon">${data.icon}</span>
        <div style="margin-top: 10px; opacity: 0.8;">${secondaryEmojis}</div>
        <p style="margin-top: 15px;">${data.scenario_pt}</p>
    `;
    
    // Preenche a interpretação mística
    interpretationContentEl.textContent = data.scenario_interpretation;

    feedbackMessageEl.textContent = '';
    feedbackMessageEl.className = '';
    scoreDisplayEl.textContent = `Pontos: ${score}`;
    dictionaryContentEl.innerHTML = "As dicas de vocabulário aparecerão aqui."; 
    
    checkButtonEl.disabled = true;
    nextButtonEl.classList.add('hidden');

    // 3. Cria e embaralha os blocos
    const scrambledBlocks = shuffle([...data.blocks]); 
    scrambledBlocks.forEach(word => {
        const block = createBlockElement(word);
        sourceBlocksEl.appendChild(block);
    });
}

function generateIncorrectHint(data) {
    let hint = "";
    
    // 1. Tenta pegar a regra principal (Will/Going To)
    const ruleKey = data.correct_sentence.toLowerCase().includes("will") ? "will" : 
                    data.correct_sentence.toLowerCase().includes("is going to") ? "is going to" :
                    data.correct_sentence.toLowerCase().includes("am going to") ? "am going to" :
                    data.correct_sentence.toLowerCase().includes("are going to") ? "are going to" : null;

    if (ruleKey && TRANSLATION_MAP[ruleKey]) {
        const ruleMap = TRANSLATION_MAP[ruleKey];
        // APENAS EMOJI E PORTUGUÊS
        hint += `<div class="mystic-hint" style="border-color: #8A2BE2;"><span>${ruleMap.emoji}</span>${ruleMap.pt.toUpperCase()}</div>`;
    }

    // 2. Tenta dar dicas de palavras-chave
    const correctWords = data.correct_sentence.toLowerCase().split(/\s|\./).filter(w => w.length > 0);
    
    let hintsGiven = 0;
    const maxHints = 4;

    for (let word of correctWords) {
        word = word.replace(/[^a-z0-9]/g, '');

        if (TRANSLATION_MAP[word] && hintsGiven < maxHints && word !== ruleKey.replace(/ /g, '')) {
            const wordMap = TRANSLATION_MAP[word];
            // APENAS EMOJI E PORTUGUÊS
            hint += `<div class="mystic-hint"><span>${wordMap.emoji}</span>${wordMap.pt.toUpperCase()}</div>`;
            hintsGiven++;
        }
    }
    
    if (hintsGiven === 0) {
        hint = "Nenhuma dica de vocabulário específica. Concentre-se na regra gramatical (WILL vs. GOING TO).";
    }

    return hint;
}


function checkSentence() {
    const data = QUIZ_DATA[currentRound];
    
    let userSentence = '';
    const targetBlocks = targetBlocksEl.querySelectorAll('.word-block');

    targetBlocks.forEach((block, index) => {
        const word = block.textContent.trim();
        if (word === '.' || word === '?' || word === '!') {
            userSentence = userSentence.trim() + word;
        } else {
            userSentence += (index > 0 ? ' ' : '') + word;
        }
    });

    const normalizedUser = userSentence.replace(/[\.\?!]$/, '').trim().toLowerCase();
    const normalizedCorrect = data.correct_sentence.replace(/[\.\?!]$/, '').trim().toLowerCase();
    
    if (normalizedUser === normalizedCorrect) {
        // CORRETO
        if (hintUsedInRound === false) {
            // Acertou de primeira!
            score += 2;
            feedbackMessageEl.textContent = `VERDADEIRO VÍTICÍNIO! (2 PONTOS - Acerto de Primeira) Regra: ${data.answer_type}. Frase: ${data.correct_sentence}`;
        } else {
            // Acertou depois de ter aberto as dicas
            score += 1;
            feedbackMessageEl.textContent = `VERDADEIRO VÍTICÍNIO! (1 PONTO - Acerto com Ajuda) Regra: ${data.answer_type}. Frase: ${data.correct_sentence}`;
        }
        
        feedbackMessageEl.className = 'feedback-correct';
        scoreDisplayEl.textContent = `Pontos: ${score}`;
        
        // Exibe a tradução completa no dicionário de vocabulário
        dictionaryContentEl.innerHTML = `**Tradução Completa da Profecia:** ${data.translation_pt}`;

        targetBlocks.forEach(block => {
            block.classList.add('block-correct');
            block.classList.remove('block-incorrect');
        });
        checkButtonEl.disabled = true;
        nextButtonEl.classList.remove('hidden');

    } else {
        // INCORRETO
        feedbackMessageEl.textContent = `VÍTICÍNIO INCORRETO. Limpe ou clique nos blocos para tentar novamente. O Grimório se abriu...`;
        feedbackMessageEl.className = 'feedback-incorrect';
        
        // <<< NOVO: Ativa a flag de dica usada para que o próximo acerto valha 1 ponto
        hintUsedInRound = true; 
        
        // Exibe o dicionário místico com dicas visuais de vocabulário
        dictionaryContentEl.innerHTML = generateIncorrectHint(data);

        targetBlocks.forEach(block => block.classList.add('block-incorrect'));
    }
}

function resetSentence() {
    loadRound();
}

function nextRound() {
    currentRound++;
    loadRound();
}

function endGame() {
    scenarioTitleEl.textContent = 'O DESTINO ESTÁ SELADO!';
    scenarioTextEl.innerHTML = `O Oráculo está em paz. Sua pontuação final é: <b>${score} de ${QUIZ_DATA.length}</b>.`;
    targetBlocksEl.innerHTML = '';
    sourceBlocksEl.innerHTML = '';
    checkButtonEl.classList.add('hidden');
    resetButtonEl.classList.add('hidden');
    nextButtonEl.classList.add('hidden');
    feedbackMessageEl.textContent = 'Reinicie a página para consultar o futuro novamente!';
    dictionaryContentEl.innerHTML = 'Fim do Jogo.';
    interpretationContentEl.textContent = 'Fim do Jogo.';
}

// --- Inicialização e Eventos ---

document.addEventListener('DOMContentLoaded', loadRound);

checkButtonEl.addEventListener('click', checkSentence);
resetButtonEl.addEventListener('click', resetSentence);
nextButtonEl.addEventListener('click', nextRound);
