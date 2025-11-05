// pilha-eletroquimica.js

// --- CONFIGURAÇÕES GLOBAIS E CONSTANTES ---
const canvas = document.getElementById('pilhaCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let animationFrameId;
let isRunning = false;
let currentVoltage = 0.0;
let E_INITIAL = 1.10; // Potencial padrão inicial (modificável pelo slider)

// --- CONSTANTES DA PILHA ---
const ELETRODO_WIDTH = 10;
const ELETRODO_HEIGHT = 150;
const VECEL_Y = 350; // Posição Y da superfície da solução

const SEMICELULA_GAP = 250;
const X_ANODO = WIDTH / 2 - SEMICELULA_GAP / 2 - 170; // Posição do Ânodo (Zinco)
const X_CATODO = WIDTH / 2 + SEMICELULA_GAP / 2 + 170; // Posição do Cátodo (Cobre)

const ELETRON_SPEED = 7;
const ION_SPEED = 1.2;
const ION_COUNT_INITIAL = 35; // Íons iniciais em cada semicélula
const ION_SIZE = 7;
const MAX_MASS = 100;
const MIN_MASS = 20; // Limite inferior para não desaparecer

// --- MODELO DE DADOS ---
let electrons = [];
let ions = [];
let znMass = MAX_MASS; // Zinco (Ânodo)
let cuMass = MAX_MASS; // Cobre (Cátodo)
let logMessages = [];
let ionCounter = 0; // Contador único para íons

// --- CORES E ÍCONES ---
const ANODO_COLOR = '#8e8e8e'; // Zn
const CATODO_COLOR = '#cd7f32'; // Cu
const ELETRON_COLOR = '#ff0000'; 
const SOLUCAO_ANODO_COLOR = '#add8e6'; // ZnSO4
const SOLUCAO_CATODO_COLOR = '#4169e1'; // CuSO4
const PONTE_SALINA_COLOR = '#f0f0f0';

const ION_ZN_COLOR = '#87ceeb'; // Zn2+ (Cátion)
const ION_CU_COLOR = '#ff6347'; // Cu2+ (Cátion)
const ION_SO4_COLOR = '#daa520'; // SO42- (Ânion)
const ION_K_COLOR = '#ffd700'; // K+ (Ponte Salina - Cátion)
const ION_CL_COLOR = '#90ee90'; // Cl- (Ponte Salina - Ânion)

// --- FUNÇÕES DE UTILIDADE E INTERFACE ---

function appendLog(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    logMessages.push(`[${timestamp}] [${type}] ${message}`);
    
    // Limita o log a 10 entradas
    if (logMessages.length > 10) {
        logMessages.shift();
    }

    const logBox = document.getElementById('logBox');
    logBox.innerHTML = logMessages.join('<br>');
    logBox.scrollTop = logBox.scrollHeight; // Scroll para o final
}

function updateStatusDisplay() {
    document.getElementById('currentVoltageDisplay').textContent = `${currentVoltage.toFixed(3)} V`;
    document.getElementById('znMassStatus').textContent = `${(znMass / MAX_MASS * 100).toFixed(1)}%`;
    document.getElementById('cuMassStatus').textContent = `${(cuMass / MAX_MASS * 100).toFixed(1)}%`;
    
    // Atualiza a cor da tensão se a pilha estiver esgotada
    const voltageDisplay = document.getElementById('currentVoltageDisplay');
    if (currentVoltage < 0.1) {
        voltageDisplay.style.color = '#cc0000'; // Vermelho
    } else {
        voltageDisplay.style.color = '#008000'; // Verde
    }
}

// --- FUNÇÕES DE DESENHO ---

function drawBackground() {
    // 1. Preenche o Canvas INTEIRO com a cor de fundo desejada
    const CANVAS_BG_COLOR = '#e0f7fa'; // Cor de fundo levemente azulada
    ctx.fillStyle = CANVAS_BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // 2. Desenha o fio condutor superior
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    const WIRE_Y = VECEL_Y - ELETRODO_HEIGHT - 30;
    ctx.moveTo(X_ANODO + ELETRODO_WIDTH / 2, WIRE_Y);
    ctx.lineTo(X_CATODO + ELETRODO_WIDTH / 2, WIRE_Y);
    ctx.stroke();
    
    // 3. Desenha o Voltímetro
    ctx.fillStyle = '#ccc';
    ctx.fillRect(WIDTH / 2 - 30, WIRE_Y - 20, 60, 40);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(WIDTH / 2 - 30, WIRE_Y - 20, 60, 40);
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentVoltage.toFixed(2) + ' V', WIDTH / 2, WIRE_Y + 5);
}


function drawSemicell(x, label, electrodeColor, solutionColor, mass, isAnode) {
    // Becker (Recipiente)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x - 100, VECEL_Y, 200, HEIGHT - VECEL_Y);
    ctx.stroke();

    // Solução Eletrolítica
    ctx.fillStyle = solutionColor;
    ctx.fillRect(x - 100, VECEL_Y + 2, 200, HEIGHT - VECEL_Y - 4);
    
    // Eletrodo (Barra)
    const currentMassRatio = mass / MAX_MASS;
    const currentHeight = ELETRODO_HEIGHT * currentMassRatio;
    const electrodeTopY = VECEL_Y - currentHeight;
    
    ctx.fillStyle = electrodeColor;
    ctx.fillRect(x, electrodeTopY, ELETRODO_WIDTH, currentHeight);
    
    // Conexão do Eletrodo
    const WIRE_Y = VECEL_Y - ELETRODO_HEIGHT - 30;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + ELETRODO_WIDTH / 2, electrodeTopY);
    ctx.lineTo(x + ELETRODO_WIDTH / 2, WIRE_Y);
    ctx.stroke();
    
    // Rótulos
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + ELETRODO_WIDTH / 2, VECEL_Y + ELETRODO_HEIGHT + 20);
    ctx.fillText(isAnode ? 'Ânodo (-)' : 'Cátodo (+)', x + ELETRODO_WIDTH / 2, VECEL_Y + ELETRODO_HEIGHT + 40);
}

function drawPonteSalina() {
    ctx.fillStyle = PONTE_SALINA_COLOR;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Desenha o U-Tube
    ctx.beginPath();
    ctx.rect(WIDTH / 2 - 10, VECEL_Y, 20, HEIGHT - VECEL_Y);
    ctx.fill();
    ctx.stroke();
    
    // Texto da Ponte
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Ponte Salina', WIDTH / 2, VECEL_Y + 20);
    ctx.fillText('($\text{KCl}$/$\text{KNO}_3$)', WIDTH / 2, VECEL_Y + 40);
}

function drawIons() {
    ions.forEach(ion => {
        // Íons se movem dentro da solução
        if (ion.y > VECEL_Y - ION_SIZE && ion.y < HEIGHT + ION_SIZE) {
            ctx.fillStyle = ion.color;
            ctx.beginPath();
            ctx.arc(ion.x, ion.y, ION_SIZE, 0, Math.PI * 2);
            ctx.fill();
            
            // Desenha a carga
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ion.charge, ion.x, ion.y + 4);
        }
    });
}

function drawElectrons() {
    electrons.forEach(e => {
        ctx.fillStyle = ELETRON_COLOR;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('e⁻', e.x, e.y + 3);
    });
}

// --- FUNÇÕES DE LÓGICA E ATUALIZAÇÃO ---

function createIon(x, y, color, charge, isPonte = false, cell = 0) {
    ionCounter++;
    return {
        id: ionCounter,
        x: x,
        y: y,
        color: color,
        charge: charge,
        vx: (Math.random() - 0.5) * ION_SPEED * 0.5,
        vy: (Math.random() - 0.5) * ION_SPEED * 0.5,
        isPonte: isPonte,
        cell: cell // 1: Ânodo, 2: Cátodo
    };
}

function initIons() {
    ions = [];
    ionCounter = 0;
    
    // Íons iniciais na solução de Zinco (ZnSO4)
    for (let i = 0; i < ION_COUNT_INITIAL; i++) {
        // Zn2+
        ions.push(createIon(X_ANODO - 100 + Math.random() * 200, VECEL_Y + Math.random() * (HEIGHT - VECEL_Y - ION_SIZE * 2), ION_ZN_COLOR, '2+', false, 1));
        // SO42-
        ions.push(createIon(X_ANODO - 100 + Math.random() * 200, VECEL_Y + Math.random() * (HEIGHT - VECEL_Y - ION_SIZE * 2), ION_SO4_COLOR, '2-', false, 1));
    }

    // Íons iniciais na solução de Cobre (CuSO4)
    for (let i = 0; i < ION_COUNT_INITIAL; i++) {
        // Cu2+
        ions.push(createIon(X_CATODO - 100 + Math.random() * 200, VECEL_Y + Math.random() * (HEIGHT - VECEL_Y - ION_SIZE * 2), ION_CU_COLOR, '2+', false, 2));
        // SO42-
        ions.push(createIon(X_CATODO - 100 + Math.random() * 200, VECEL_Y + Math.random() * (HEIGHT - VECEL_Y - ION_SIZE * 2), ION_SO4_COLOR, '2-', false, 2));
    }
    
    // Íons da Ponte Salina (K+ e Cl- em repouso)
    for (let i = 0; i < 10; i++) {
        ions.push(createIon(WIDTH / 2, VECEL_Y + Math.random() * (HEIGHT - VECEL_Y), ION_K_COLOR, '+', true, 0));
        ions.push(createIon(WIDTH / 2, VECEL_Y + Math.random() * (HEIGHT - VECEL_Y), ION_CL_COLOR, '-', true, 0));
    }
    appendLog("Células e Ponte Salina inicializadas.", 'SETUP');
}

function updateIons() {
    ions.forEach(ion => {
        
        // Movimento Browniano (simulado)
        ion.x += ion.vx;
        ion.y += ion.vy;
        
        // Colisão com as paredes do Becker
        const xMin = ion.x < WIDTH / 2 ? X_ANODO - 100 : X_CATODO - 100;
        const xMax = ion.x < WIDTH / 2 ? X_ANODO + 100 : X_CATODO + 100;
        
        if (ion.x < xMin || ion.x > xMax) { ion.vx *= -1; }
        if (ion.y < VECEL_Y + ION_SIZE || ion.y > HEIGHT - ION_SIZE) { ion.vy *= -1; }
        
        // Mudança de direção aleatória
        if (Math.random() < 0.015) {
            ion.vx = (Math.random() - 0.5) * ION_SPEED;
            ion.vy = (Math.random() - 0.5) * ION_SPEED;
        }

        // Lógica de Atração por Carga (Equilíbrio) - Apenas quando está rodando
        if (isRunning && !ion.isPonte) {
            const znCount = ions.filter(i => i.charge === '2+' && i.cell === 1 && !i.isPonte).length;
            const so4AnodoCount = ions.filter(i => i.charge === '2-' && i.cell === 1 && !i.isPonte).length;
            const so4CatodoCount = ions.filter(i => i.charge === '2-' && i.cell === 2 && !i.isPonte).length;
            const cuCount = ions.filter(i => i.charge === '2+' && i.cell === 2 && !i.isPonte).length;

            const targetXAnode = X_ANODO + ELETRODO_WIDTH / 2;
            const targetXCathode = X_CATODO + ELETRODO_WIDTH / 2;

            // 1. Ânodo fica Positivo (Excesso de Zn2+) -> Atrai ânions (SO4 2-, Cl-)
            if (ion.cell === 1 && znCount > so4AnodoCount * 1.2) {
                if (ion.charge === '2-') {
                    ion.vx += (targetXAnode - ion.x) * 0.005; // Atraído para o excesso de carga positiva
                }
            }
            
            // 2. Cátodo fica Negativo (Excesso de SO4 2-) -> Atrai cátions (Cu2+, K+)
            if (ion.cell === 2 && so4CatodoCount > cuCount * 1.2) {
                if (ion.charge === '2+') {
                    ion.vx += (targetXCathode - ion.x) * 0.005; // Atraído para o excesso de carga negativa
                }
            }

            // 3. Íons da Ponte Salina se movem para Neutralizar
            if (ion.isPonte) {
                 if (ion.charge === '-') { // Cl- atrai-se para o Ânodo (Excesso de Zn2+)
                    ion.vx = (X_ANODO + 50 - ion.x) * 0.005;
                 } else if (ion.charge === '+') { // K+ atrai-se para o Cátodo (Excesso de SO4 2-)
                    ion.vx = (X_CATODO - 50 - ion.x) * 0.005;
                 }
            }
        }
    });
}

function updateChemicalReaction() {
    if (!isRunning || currentVoltage < 0.1) return; // Reação para se a voltagem cair

    const REACTION_RATE = currentVoltage * 0.005;

    // 1. Oxidação (Ânodo: Zn(s) -> Zn2+ + 2e-)
    if (Math.random() < REACTION_RATE && znMass > MIN_MASS) {
        znMass -= 0.1; 
        
        // 1.1. Libera Elétrons (Fluxo de Corrente)
        electrons.push(createElectron(X_ANODO, VECEL_Y - ELETRODO_HEIGHT - 30)); 
        
        // 1.2. Libera Íons Zn2+ na Solução
        const newZnIon = createIon(X_ANODO + ELETRODO_WIDTH / 2, VECEL_Y + ION_SIZE, ION_ZN_COLOR, '2+', false, 1);
        ions.push(newZnIon);
        
        appendLog(`Oxidação: $\text{Zn} \rightarrow \text{Zn}^{2+} + 2\text{e}^{-}$. $\text{Zn}^{2+}$ liberado.`, 'OX');
    }
    
    // 2. Redução (Cátodo: Cu2+ + 2e- -> Cu(s))
    if (Math.random() < REACTION_RATE && cuMass < MAX_MASS * 1.5) { // Limite de crescimento
        // 2.1. Consome Elétrons (se houver)
        if (electrons.length > 0) {
            electrons.shift();
            
            // 2.2. Consome Íons Cu2+
            let cuIon = ions.find(i => i.charge === '2+' && i.cell === 2 && Math.abs(i.x - (X_CATODO + ELETRODO_WIDTH / 2)) < 50);

            if (cuIon) {
                cuMass += 0.1; // Aumento da massa
                ions.splice(ions.indexOf(cuIon), 1); // Remove o íon da solução
                appendLog(`Redução: $\text{Cu}^{2+} + 2\text{e}^{-} \rightarrow \text{Cu}$. $\text{Cu}^{2+}$ consumido.`, 'RED');
            }
        }
    }
}
function createElectron(x, y) {
    // Cria um elétron que sai do ânodo (Zn)
    const WIRE_Y = VECEL_Y - ELETRODO_HEIGHT - 30;

    return {
        x: x + ELETRODO_WIDTH / 2,
        y: WIRE_Y, // Inicia no fio superior
        vx: ELETRON_SPEED, // Move para a direita (em direção ao Cátodo)
        vy: 0
    };
}

function updateElectrons() {
    for (let i = electrons.length - 1; i >= 0; i--) {
        const e = electrons[i];
        
        e.x += e.vx;
        
        // Consumido ao atingir o Cátodo
        if (e.x >= X_CATODO + ELETRODO_WIDTH / 2) {
            electrons.splice(i, 1);
        }
    }
}

function calculateVoltage() {
    // Cálculo simplificado da tensão (E = E° - (RT/nF)lnQ)
    // Q = [Zn2+] / [Cu2+]

    const znCount = ions.filter(i => i.charge === '2+' && i.cell === 1).length;
    const cuCount = ions.filter(i => i.charge === '2+' && i.cell === 2).length;
    
    // Evita divisão por zero ou log de zero/negativo
    const ratio = znCount / Math.max(cuCount, 1);
    const logQ = Math.log(ratio);
    
    // Efeito da concentração (assume 0.0592/2 para 298K, n=2)
    const nernstFactor = 0.0296 * logQ; 
    
    let potential = E_INITIAL - nernstFactor;
    
    // Garante que a voltagem seja 0 se os reagentes sumirem
    if (znMass < MIN_MASS || cuCount < 5) {
        potential = 0.0;
    }
    
    currentVoltage = Math.max(0.0, potential); // Não permite voltagem negativa

    if (currentVoltage < 0.1 && isRunning) {
        appendLog(`POTENCIAL ESGOTADO (${currentVoltage.toFixed(2)} V). A reação química parou.`, 'FALHA');
        isRunning = false;
        document.getElementById('startStopButton').textContent = 'Pilha Esgotada!';
        document.getElementById('startStopButton').style.backgroundColor = '#cc0000';
    }
}

// --- LOOP PRINCIPAL ---

function gameLoop() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    drawBackground();
    
    // Semicélula de Oxidação (Ânodo)
    drawSemicell(X_ANODO, 'Eletrodo de $\text{Zn}$ / $\text{ZnSO}_4$', ANODO_COLOR, SOLUCAO_ANODO_COLOR, znMass, true);
    
    // Semicélula de Redução (Cátodo)
    drawSemicell(X_CATODO, 'Eletrodo de $\text{Cu}$ / $\text{CuSO}_4$', CATODO_COLOR, SOLUCAO_CATODO_COLOR, cuMass, false);
    
    drawPonteSalina();
    
    drawIons();
    
    if (isRunning) {
        updateChemicalReaction();
        updateIons();
        updateElectrons();
        calculateVoltage();
    } else {
        // Recalcula a tensão (para o slider funcionar) mesmo quando parado
        calculateVoltage(); 
    }
    
    drawElectrons();
    
    updateStatusDisplay();

    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- FUNÇÕES DE CONTROLE E INICIALIZAÇÃO ---

function toggleSimulation() {
    if (currentVoltage < 0.1 && znMass < MAX_MASS) return; // Não inicia se esgotada
    
    isRunning = !isRunning;
    const button = document.getElementById('startStopButton');
    if (isRunning) {
        button.textContent = 'Pausar Simulação';
        button.style.backgroundColor = '#f0ad4e';
        appendLog('Simulação Iniciada. Reações e fluxo de elétrons ativos.', 'INFO');
    } else {
        button.textContent = 'Continuar Simulação';
        button.style.backgroundColor = '#008cba';
        appendLog('Simulação Pausada.', 'INFO');
    }
}

function resetSimulation() {
    isRunning = false;
    znMass = MAX_MASS;
    cuMass = MAX_MASS;
    electrons = [];
    logMessages = [];
    currentVoltage = E_INITIAL;
    
    document.getElementById('startStopButton').textContent = 'Iniciar Simulação';
    document.getElementById('startStopButton').style.backgroundColor = '#008cba';
    
    document.getElementById('logBox').innerHTML = 'Aguardando início da simulação...';

    initIons(); // Re-inicializa os íons
}

function handleVoltageChange(event) {
    E_INITIAL = parseFloat(event.target.value);
    document.getElementById('voltageValue').textContent = `${E_INITIAL.toFixed(2)} V`;
    // Recalcula o potencial para refletir a mudança imediatamente
    if (!isRunning) calculateVoltage(); 
}

function init() {
    // Configura o slider
    const voltageSlider = document.getElementById('initialVoltage');
    voltageSlider.addEventListener('input', handleVoltageChange);
    E_INITIAL = parseFloat(voltageSlider.value);
    document.getElementById('voltageValue').textContent = `${E_INITIAL.toFixed(2)} V`;

    // Inicializa a simulação
    resetSimulation();
    
    // Conecta os botões
    document.getElementById('startStopButton').addEventListener('click', toggleSimulation);
    document.getElementById('resetButton').addEventListener('click', resetSimulation);
    
    // Inicia o loop de animação
    gameLoop();
}

// Inicia a aplicação
init();
