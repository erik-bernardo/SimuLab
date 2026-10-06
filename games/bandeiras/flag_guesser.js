// flag_guesser.js - Adivinhe a Bandeira (Digitação)

// --- DOM ELEMENTS (Atualizados) ---
const scoreValue = document.getElementById('score-value');
const timerValue = document.getElementById('timer-value');
const currentFlagImage = document.getElementById('current-flag'); 
const npcStatement = document.getElementById('npc-statement'); 
const answerInput = document.getElementById('answer-input'); 
const submitButton = document.getElementById('submit-button'); 
const feedbackMessage = document.getElementById('feedback-message');
const overlay = document.getElementById('overlay');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// --- CONSTANTS ---
const TIME_LIMIT = 60; // Tempo total de jogo em segundos
const BASE_SCORE = 10; // Pontuação por acerto

// --- GAME STATE ---
let gameState = 'waiting';
let score = 0;
let timeLeft = TIME_LIMIT;
let currentQuestion = null;
let intervalTimer = null;
let isAnimating = false;

// --- FLAG BANK COMPLETO (Com Múltiplos Nomes Aceitos) ---
const FLAG_BANK = [
    { flag_url: "https://flagcdn.com/af.svg", correct_names: ["Afeganistão", "Afeganistao"]},
    { flag_url: "https://flagcdn.com/al.svg", correct_names: ["Albânia", "Albania"]},
    { flag_url: "https://flagcdn.com/dz.svg", correct_names: ["Argélia", "Argelia"]},
    { flag_url: "https://flagcdn.com/ad.svg", correct_names: ["Andorra"]},
    { flag_url: "https://flagcdn.com/ao.svg", correct_names: ["Angola"]},
    { flag_url: "https://flagcdn.com/ag.svg", correct_names: ["Antígua e Barbuda", "Antigua e Barbuda"]},
    { flag_url: "https://flagcdn.com/ar.svg", correct_names: ["Argentina"]},
    { flag_url: "https://flagcdn.com/am.svg", correct_names: ["Armênia", "Armenia"]},
    { flag_url: "https://flagcdn.com/au.svg", correct_names: ["Austrália", "Australia"]},
    { flag_url: "https://flagcdn.com/at.svg", correct_names: ["Áustria", "Austria"]},
    { flag_url: "https://flagcdn.com/az.svg", correct_names: ["Azerbaijão", "Azerbaiao"]},
    { flag_url: "https://flagcdn.com/bs.svg", correct_names: ["Bahamas"]},
    { flag_url: "https://flagcdn.com/bh.svg", correct_names: ["Bahrein"]},
    { flag_url: "https://flagcdn.com/bd.svg", correct_names: ["Bangladesh"]},
    { flag_url: "https://flagcdn.com/bb.svg", correct_names: ["Barbados"]},
    { flag_url: "https://flagcdn.com/by.svg", correct_names: ["Bielorrússia", "Bielorrussia"]},
    { flag_url: "https://flagcdn.com/be.svg", correct_names: ["Bélgica", "Belgica"]},
    { flag_url: "https://flagcdn.com/bz.svg", correct_names: ["Belize"]},
    { flag_url: "https://flagcdn.com/bj.svg", correct_names: ["Benin"]},
    { flag_url: "https://flagcdn.com/bm.svg", correct_names: ["Bermudas"]},
    { flag_url: "https://flagcdn.com/bo.svg", correct_names: ["Bolívia", "Bolivia"]},
    { flag_url: "https://flagcdn.com/ba.svg", correct_names: ["Bósnia e Herzegovina", "Bosnia e Herzegovina"]},
    { flag_url: "https://flagcdn.com/bw.svg", correct_names: ["Botsuana"]},
    { flag_url: "https://flagcdn.com/br.svg", correct_names: ["Brasil"]},
    { flag_url: "https://flagcdn.com/bg.svg", correct_names: ["Bulgária", "Bulgaria"]},
    { flag_url: "https://flagcdn.com/bf.svg", correct_names: ["Burkina Faso"]},
    { flag_url: "https://flagcdn.com/bi.svg", correct_names: ["Burundi"]},
    { flag_url: "https://flagcdn.com/kh.svg", correct_names: ["Camboja"]},
    { flag_url: "https://flagcdn.com/cm.svg", correct_names: ["Camarões", "Camaroes"]},
    { flag_url: "https://flagcdn.com/ca.svg", correct_names: ["Canadá", "Canada"]},
    { flag_url: "https://flagcdn.com/cv.svg", correct_names: ["Cabo Verde"]},
    { flag_url: "https://flagcdn.com/ky.svg", correct_names: ["Ilhas Caimão", "Ilhas Caimao"]},
    { flag_url: "https://flagcdn.com/cf.svg", correct_names: ["República Centro-Africana", "Republica Centro-Africana"]},
    { flag_url: "https://flagcdn.com/td.svg", correct_names: ["Chade"]},
    { flag_url: "https://flagcdn.com/cl.svg", correct_names: ["Chile"]},
    { flag_url: "https://flagcdn.com/cn.svg", correct_names: ["China"]},
    { flag_url: "https://flagcdn.com/co.svg", correct_names: ["Colômbia", "Colombia"]},
    { flag_url: "https://flagcdn.com/km.svg", correct_names: ["Comores"]},
    { flag_url: "https://flagcdn.com/cg.svg", correct_names: ["Congo", "República do Congo", "Republica do Congo"]},
    { flag_url: "https://flagcdn.com/cd.svg", correct_names: ["República Democrática do Congo", "RDC", "Congo-Kinshasa", "Congo Kinshasa", "Congo Democrático", "Congo Democratico"]},
    { flag_url: "https://flagcdn.com/ck.svg", correct_names: ["Ilhas Cook"]},
    { flag_url: "https://flagcdn.com/cr.svg", correct_names: ["Costa Rica"]},
    { flag_url: "https://flagcdn.com/ci.svg", correct_names: ["Costa do Marfim"]},
    { flag_url: "https://flagcdn.com/hr.svg", correct_names: ["Croácia", "Croacia"]},
    { flag_url: "https://flagcdn.com/cu.svg", correct_names: ["Cuba"]},
    { flag_url: "https://flagcdn.com/cy.svg", correct_names: ["Chipre"]},
    { flag_url: "https://flagcdn.com/cz.svg", correct_names: ["Tchéquia", "Tchequia", "República Tcheca", "Republica Tcheca"]},
    { flag_url: "https://flagcdn.com/dk.svg", correct_names: ["Dinamarca"]},
    { flag_url: "https://flagcdn.com/dj.svg", correct_names: ["Djibouti"]},
    { flag_url: "https://flagcdn.com/dm.svg", correct_names: ["Dominica"]},
    { flag_url: "https://flagcdn.com/do.svg", correct_names: ["República Dominicana", "Republica Dominicana"]},
    { flag_url: "https://flagcdn.com/ec.svg", correct_names: ["Equador"]},
    { flag_url: "https://flagcdn.com/eg.svg", correct_names: ["Egito"]},
    { flag_url: "https://flagcdn.com/sv.svg", correct_names: ["El Salvador"]},
    { flag_url: "https://flagcdn.com/gq.svg", correct_names: ["Guiné Equatorial", "Guine Equatorial"]},
    { flag_url: "https://flagcdn.com/er.svg", correct_names: ["Eritreia"]},
    { flag_url: "https://flagcdn.com/ee.svg", correct_names: ["Estônia", "Estonia"]},
    { flag_url: "https://flagcdn.com/et.svg", correct_names: ["Etiópia", "Etiopia"]},
    { flag_url: "https://flagcdn.com/fj.svg", correct_names: ["Fiji"]},
    { flag_url: "https://flagcdn.com/fi.svg", correct_names: ["Finlândia", "Finlandia"]},
    { flag_url: "https://flagcdn.com/fr.svg", correct_names: ["França", "Franca"]},
    { flag_url: "https://flagcdn.com/ga.svg", correct_names: ["Gabão", "Gabao"]},
    { flag_url: "https://flagcdn.com/gm.svg", correct_names: ["Gâmbia", "Gambia"]},
    { flag_url: "https://flagcdn.com/ge.svg", correct_names: ["Geórgia", "Georgia"]},
    { flag_url: "https://flagcdn.com/de.svg", correct_names: ["Alemanha"]},
    { flag_url: "https://flagcdn.com/gh.svg", correct_names: ["Gana"]},
    { flag_url: "https://flagcdn.com/gr.svg", correct_names: ["Grécia", "Grecia"]},
    { flag_url: "https://flagcdn.com/gd.svg", correct_names: ["Granada"]},
    { flag_url: "https://flagcdn.com/gt.svg", correct_names: ["Guatemala"]},
    { flag_url: "https://flagcdn.com/gn.svg", correct_names: ["Guiné", "Guine"]},
    { flag_url: "https://flagcdn.com/gw.svg", correct_names: ["Guiné-Bissau", "Guine-Bissau", "Guine Bissau"]},
    { flag_url: "https://flagcdn.com/gy.svg", correct_names: ["Guiana"]},
    { flag_url: "https://flagcdn.com/ht.svg", correct_names: ["Haiti"]},
    { flag_url: "https://flagcdn.com/hn.svg", correct_names: ["Honduras"]},
    { flag_url: "https://flagcdn.com/hu.svg", correct_names: ["Hungria"]},
    { flag_url: "https://flagcdn.com/is.svg", correct_names: ["Islândia", "Islandia"]},
    { flag_url: "https://flagcdn.com/in.svg", correct_names: ["Índia", "India"]},
    { flag_url: "https://flagcdn.com/id.svg", correct_names: ["Indonésia", "Indonesia"]},
    { flag_url: "https://flagcdn.com/ir.svg", correct_names: ["Irã", "Ira"]},
    { flag_url: "https://flagcdn.com/iq.svg", correct_names: ["Iraque"]},
    { flag_url: "https://flagcdn.com/ie.svg", correct_names: ["Irlanda"]},
    { flag_url: "https://flagcdn.com/il.svg", correct_names: ["Israel"]},
    { flag_url: "https://flagcdn.com/it.svg", correct_names: ["Itália", "Italia"]},
    { flag_url: "https://flagcdn.com/jm.svg", correct_names: ["Jamaica"]},
    { flag_url: "https://flagcdn.com/jp.svg", correct_names: ["Japão", "Japao"]},
    { flag_url: "https://flagcdn.com/jo.svg", correct_names: ["Jordânia", "Jordania"]},
    { flag_url: "https://flagcdn.com/kz.svg", correct_names: ["Cazaquistão", "Cazaquistao"]},
    { flag_url: "https://flagcdn.com/ke.svg", correct_names: ["Quênia", "Quenia"]},
    { flag_url: "https://flagcdn.com/ki.svg", correct_names: ["Kiribati"]},
    { flag_url: "https://flagcdn.com/kp.svg", correct_names: ["Coreia do Norte", "Coreia Norte"]},
    { flag_url: "https://flagcdn.com/kr.svg", correct_names: ["Coreia do Sul", "Coreia Sul"]},
    { flag_url: "https://flagcdn.com/kw.svg", correct_names: ["Kuwait"]},
    { flag_url: "https://flagcdn.com/kg.svg", correct_names: ["Quirguistão", "Quirguistao"]},
    { flag_url: "https://flagcdn.com/lv.svg", correct_names: ["Letônia", "Letonia"]},
    { flag_url: "https://flagcdn.com/lb.svg", correct_names: ["Líbano", "Libano"]},
    { flag_url: "https://flagcdn.com/ls.svg", correct_names: ["Lesoto"]},
    { flag_url: "https://flagcdn.com/lr.svg", correct_names: ["Libéria", "Liberia"]},
    { flag_url: "https://flagcdn.com/ly.svg", correct_names: ["Líbia", "Libia"]},
    { flag_url: "https://flagcdn.com/li.svg", correct_names: ["Liechtenstein"]},
    { flag_url: "https://flagcdn.com/lt.svg", correct_names: ["Lituânia", "Lituania"]},
    { flag_url: "https://flagcdn.com/lu.svg", correct_names: ["Luxemburgo"]},
    { flag_url: "https://flagcdn.com/mg.svg", correct_names: ["Madagascar"]},
    { flag_url: "https://flagcdn.com/mw.svg", correct_names: ["Malaui"]},
    { flag_url: "https://flagcdn.com/my.svg", correct_names: ["Malásia", "Malasia"]},
    { flag_url: "https://flagcdn.com/mv.svg", correct_names: ["Maldivas"]},
    { flag_url: "https://flagcdn.com/ml.svg", correct_names: ["Mali"]},
    { flag_url: "https://flagcdn.com/mt.svg", correct_names: ["Malta"]},
    { flag_url: "https://flagcdn.com/mr.svg", correct_names: ["Mauritânia", "Mauritania"]},
    { flag_url: "https://flagcdn.com/mu.svg", correct_names: ["Maurícia", "Mauricia"]},
    { flag_url: "https://flagcdn.com/mx.svg", correct_names: ["México", "Mexico"]},
    { flag_url: "https://flagcdn.com/md.svg", correct_names: ["Moldávia", "Moldavia"]},
    { flag_url: "https://flagcdn.com/mc.svg", correct_names: ["Mônaco", "Monaco"]},
    { flag_url: "https://flagcdn.com/mn.svg", correct_names: ["Mongólia", "Mongolia"]},
    { flag_url: "https://flagcdn.com/me.svg", correct_names: ["Montenegro"]},
    { flag_url: "https://flagcdn.com/ma.svg", correct_names: ["Marrocos"]},
    { flag_url: "https://flagcdn.com/mz.svg", correct_names: ["Moçambique", "Mocambique"]},
    { flag_url: "https://flagcdn.com/mm.svg", correct_names: ["Mianmar"]},
    { flag_url: "https://flagcdn.com/na.svg", correct_names: ["Namíbia", "Namibia"]},
    { flag_url: "https://flagcdn.com/nr.svg", correct_names: ["Nauru"]},
    { flag_url: "https://flagcdn.com/np.svg", correct_names: ["Nepal"]},
    { flag_url: "https://flagcdn.com/nl.svg", correct_names: ["Países Baixos", "Paises Baixos", "Holanda"]},
    { flag_url: "https://flagcdn.com/nz.svg", correct_names: ["Nova Zelândia", "Nova Zelandia"]},
    { flag_url: "https://flagcdn.com/ni.svg", correct_names: ["Nicarágua", "Nicaragua"]},
    { flag_url: "https://flagcdn.com/ne.svg", correct_names: ["Níger", "Niger"]},
    { flag_url: "https://flagcdn.com/ng.svg", correct_names: ["Nigéria", "Nigeria"]},
    { flag_url: "https://flagcdn.com/no.svg", correct_names: ["Noruega"]},
    { flag_url: "https://flagcdn.com/om.svg", correct_names: ["Omã", "Oma"]},
    { flag_url: "https://flagcdn.com/pk.svg", correct_names: ["Paquistão", "Paquistao"]},
    { flag_url: "https://flagcdn.com/pw.svg", correct_names: ["Palau"]},
    { flag_url: "https://flagcdn.com/pa.svg", correct_names: ["Panamá", "Panama"]},
    { flag_url: "https://flagcdn.com/pg.svg", correct_names: ["Papua-Nova Guiné", "Papua Nova Guine", "Papua Nova Guiné"]},
    { flag_url: "https://flagcdn.com/py.svg", correct_names: ["Paraguai"]},
    { flag_url: "https://flagcdn.com/pe.svg", correct_names: ["Peru"]},
    { flag_url: "https://flagcdn.com/ph.svg", correct_names: ["Filipinas"]},
    { flag_url: "https://flagcdn.com/pl.svg", correct_names: ["Polônia", "Polonia"]},
    { flag_url: "https://flagcdn.com/pt.svg", correct_names: ["Portugal"]},
    { flag_url: "https://flagcdn.com/qa.svg", correct_names: ["Catar"]},
    { flag_url: "https://flagcdn.com/ro.svg", correct_names: ["Romênia", "Romenia"]},
    { flag_url: "https://flagcdn.com/ru.svg", correct_names: ["Rússia", "Russia"]},
    { flag_url: "https://flagcdn.com/rw.svg", correct_names: ["Ruanda"]},
    { flag_url: "https://flagcdn.com/ws.svg", correct_names: ["Samoa"]},
    { flag_url: "https://flagcdn.com/sm.svg", correct_names: ["San Marino"]},
    { flag_url: "https://flagcdn.com/st.svg", correct_names: ["São Tomé e Príncipe", "Sao Tome e Principe", "Sao Tome e Principe"]},
    { flag_url: "https://flagcdn.com/sa.svg", correct_names: ["Arábia Saudita", "Arabia Saudita"]},
    { flag_url: "https://flagcdn.com/sn.svg", correct_names: ["Senegal"]},
    { flag_url: "https://flagcdn.com/rs.svg", correct_names: ["Sérvia", "Servia"]},
    { flag_url: "https://flagcdn.com/sc.svg", correct_names: ["Seicheles"]},
    { flag_url: "https://flagcdn.com/sl.svg", correct_names: ["Serra Leoa"]},
    { flag_url: "https://flagcdn.com/sg.svg", correct_names: ["Singapura"]},
    { flag_url: "https://flagcdn.com/sk.svg", correct_names: ["Eslováquia", "Eslovaquia"]},
    { flag_url: "https://flagcdn.com/si.svg", correct_names: ["Eslovênia", "Eslovenia"]},
    { flag_url: "https://flagcdn.com/sb.svg", correct_names: ["Ilhas Salomão", "Ilhas Salomao"]},
    { flag_url: "https://flagcdn.com/so.svg", correct_names: ["Somália", "Somalia"]},
    { flag_url: "https://flagcdn.com/za.svg", correct_names: ["África do Sul", "Africa do Sul"]},
    { flag_url: "https://flagcdn.com/ss.svg", correct_names: ["Sudão do Sul", "Sudao do Sul"]},
    { flag_url: "https://flagcdn.com/es.svg", correct_names: ["Espanha"]},
    { flag_url: "https://flagcdn.com/lk.svg", correct_names: ["Sri Lanka"]},
    { flag_url: "https://flagcdn.com/sd.svg", correct_names: ["Sudão", "Sudao"]},
    { flag_url: "https://flagcdn.com/sr.svg", correct_names: ["Suriname"]},
    { flag_url: "https://flagcdn.com/se.svg", correct_names: ["Suécia", "Sucia"]},
    { flag_url: "https://flagcdn.com/ch.svg", correct_names: ["Suíça", "Suica"]},
    { flag_url: "https://flagcdn.com/sy.svg", correct_names: ["Síria", "Siria"]},
    { flag_url: "https://flagcdn.com/tw.svg", correct_names: ["Taiwan"]},
    { flag_url: "https://flagcdn.com/tj.svg", correct_names: ["Tajiquistão", "Tajiquistao"]},
    { flag_url: "https://flagcdn.com/tz.svg", correct_names: ["Tanzânia", "Tanzania"]},
    { flag_url: "https://flagcdn.com/th.svg", correct_names: ["Tailândia", "Tailandia"]},
    { flag_url: "https://flagcdn.com/tl.svg", correct_names: ["Timor-Leste", "Timor Leste"]},
    { flag_url: "https://flagcdn.com/tg.svg", correct_names: ["Togo"]},
    { flag_url: "https://flagcdn.com/to.svg", correct_names: ["Tonga"]},
    { flag_url: "https://flagcdn.com/tt.svg", correct_names: ["Trinidad e Tobago", "Trinidad Tobago"]},
    { flag_url: "https://flagcdn.com/tn.svg", correct_names: ["Tunísia", "Tunisia"]},
    { flag_url: "https://flagcdn.com/tr.svg", correct_names: ["Turquia"]},
    { flag_url: "https://flagcdn.com/tm.svg", correct_names: ["Turcomenistão", "Turcomenistao"]},
    { flag_url: "https://flagcdn.com/tv.svg", correct_names: ["Tuvalu"]},
    { flag_url: "https://flagcdn.com/ug.svg", correct_names: ["Uganda"]},
    { flag_url: "https://flagcdn.com/ua.svg", correct_names: ["Ucrânia", "Ucrania"]},
    { flag_url: "https://flagcdn.com/ae.svg", correct_names: ["Emirados Árabes Unidos", "Emirados Arabes Unidos", "EAU"]},
    { flag_url: "https://flagcdn.com/gb.svg", correct_names: ["Reino Unido", "RU", "UK", "Gra-Bretanha", "Gra Bretanha"]},
    { flag_url: "https://flagcdn.com/us.svg", correct_names: ["Estados Unidos", "Estados Unidos da América", "EUA", "USA"]}, 
    { flag_url: "https://flagcdn.com/uy.svg", correct_names: ["Uruguai"]},
    { flag_url: "https://flagcdn.com/uz.svg", correct_names: ["Uzbequistão", "Uzbequistao"]},
    { flag_url: "https://flagcdn.com/vu.svg", correct_names: ["Vanuatu"]},
    { flag_url: "https://flagcdn.com/va.svg", correct_names: ["Vaticano", "Cidade do Vaticano"]},
    { flag_url: "https://flagcdn.com/ve.svg", correct_names: ["Venezuela"]},
    { flag_url: "https://flagcdn.com/vn.svg", correct_names: ["Vietnã", "Vietna"]},
    { flag_url: "https://flagcdn.com/ye.svg", correct_names: ["Iêmen", "Iemen"]},
    { flag_url: "https://flagcdn.com/zm.svg", correct_names: ["Zâmbia", "Zambia"]},
    { flag_url: "https://flagcdn.com/zw.svg", correct_names: ["Zimbábue", "Zimbabue"]},
];

// --- FUNÇÕES AUXILIARES ---

/**
 * Normaliza uma string: remove acentos, espaços extras e converte para minúsculo.
 * @param {string} str - A string a ser normalizada.
 * @returns {string} A string normalizada.
 */
function normalizeString(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize("NFD") // Decompõe os caracteres (ex: á -> a + ´)
        .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
        .trim(); // Remove espaços em branco no início e fim
}


// --- FUNÇÕES DE JOGO ---

/**
 * Inicializa o jogo.
 */
function initializeGame() {
    score = 0;
    timeLeft = TIME_LIMIT;
    gameState = 'playing';
    scoreValue.textContent = score;
    timerValue.textContent = timeLeft;
    feedbackMessage.textContent = '';
    
    gameOverScreen.classList.add('hidden');
    overlay.classList.add('hidden');
    startButton.classList.add('hidden');

    // Habilita o input
    answerInput.disabled = false;
    submitButton.disabled = false;
    answerInput.value = '';
    
    startGameTimer();
    loadNextQuestion();
}

/**
 * Inicia o timer do jogo. (Mantido)
 */
function startGameTimer() {
    if (intervalTimer) clearInterval(intervalTimer);
    
    intervalTimer = setInterval(() => {
        timeLeft--;
        timerValue.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

/**
 * Carrega a próxima bandeira/pergunta.
 */
function loadNextQuestion() {
    // Escolhe uma pergunta aleatória do banco
    const randomIndex = Math.floor(Math.random() * FLAG_BANK.length);
    currentQuestion = FLAG_BANK[randomIndex];

    // Atualiza a interface
    currentFlagImage.src = currentQuestion.flag_url;
    // Usa o primeiro nome do array para o atributo alt
    currentFlagImage.alt = `Bandeira de ${currentQuestion.correct_names[0]}`; 
    npcStatement.textContent = "De qual país é esta bandeira?";
    
    // Limpa o input e restaura o foco
    answerInput.value = '';
    answerInput.focus();
    
    feedbackMessage.textContent = '';
    answerInput.classList.remove('correct', 'incorrect');
    isAnimating = false;
}

/**
 * Verifica a resposta do jogador. (CORRIGIDA)
 * Agora compara a resposta do usuário (normalizada) contra todos os nomes no array correct_names (normalizados).
 */
function checkAnswer() {
    if (gameState !== 'playing' || isAnimating) return;
    isAnimating = true;

    // Normaliza a resposta do usuário uma única vez
    const userAnswer = normalizeString(answerInput.value);
    
    // Mapeia o array de nomes corretos e normaliza cada um deles
    const normalizedCorrectNames = currentQuestion.correct_names.map(name => normalizeString(name));

    // Checa se a resposta normalizada do usuário está em algum dos nomes corretos normalizados
    const correct = normalizedCorrectNames.includes(userAnswer);

    // Usa o primeiro nome do array para o feedback, pois é o nome principal formatado
    const principalCorrectName = currentQuestion.correct_names[0]; 

    answerInput.disabled = true;
    submitButton.disabled = true;

    if (correct) {
        score += BASE_SCORE;
        scoreValue.textContent = score;
        answerInput.classList.add('correct');
        feedbackMessage.textContent = `✅ Certo! ${principalCorrectName}!`;
    } else {
        score = Math.max(0, score - BASE_SCORE / 2); // Penalidade
        scoreValue.textContent = score;
        answerInput.classList.add('incorrect');
        feedbackMessage.textContent = `❌ Errado! A bandeira é de ${principalCorrectName}.`;
    }

    // Espera para carregar a próxima pergunta
    setTimeout(() => {
        if (timeLeft > 0) {
            answerInput.disabled = false;
            submitButton.disabled = false;
            loadNextQuestion();
        }
    }, 1500);
}

/**
 * Encerra o jogo. (Mantido)
 */
function endGame() {
    gameState = 'finished';
    if (intervalTimer) clearInterval(intervalTimer);

    finalScore.textContent = score;
    gameOverScreen.classList.remove('hidden');
    overlay.classList.remove('hidden');
    
    answerInput.disabled = true;
    submitButton.disabled = true;
}

// --- EVENT LISTENERS ---
startButton.addEventListener('click', initializeGame);
restartButton.addEventListener('click', initializeGame);
submitButton.addEventListener('click', checkAnswer);

// Permite submeter a resposta pressionando Enter no campo de texto
answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && gameState === 'playing' && !answerInput.disabled) {
        checkAnswer();
    }
});

// Inicialização da tela
if (gameState === 'waiting') {
    gameOverScreen.classList.add('hidden');
    overlay.classList.remove('hidden');
    startButton.classList.remove('hidden');
}
