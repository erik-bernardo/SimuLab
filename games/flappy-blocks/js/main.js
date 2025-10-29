// js/main.js - Inicialização e Integração do Blockly com o Jogo

// --- Configuração do Workspace Blockly ---
var blocklyArea = document.getElementById('blocklyContainer'); // Ajustado para container
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    toolbox: document.getElementById('toolbox'),
    scrollbars: true,
    trashcan: true,
    zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 }, // Habilitado wheel zoom
    media: 'blockly/media/' // Necessário para sons, etc. (se a pasta media existir)
});

// --- Elementos da UI ---
const runCodeBtn = document.getElementById('runCodeBtn');
const resetGameBtn = document.getElementById('resetGameBtn');
const gameCanvas = document.getElementById('flappyCanvas'); // Referência ao canvas

// --- Função para Executar o Código dos Blocos ---
function runBlocklyCode() {
    console.log("Executando código dos blocos...");
    stopGameLoop(); // Para loop anterior

    // Resetar funções de evento e configs para o padrão ANTES de executar novo código
    onGameStarts = function() { console.log("Jogo Padrão Iniciado!"); };
    onClickOrTap = function() { if (bird) bird.flap(); };
    onHitObstacle = function() {
        if (gameState === 'gameover') return;
        console.log("Game Over Padrão! Score:", score);
        stopGameLoop(); drawGameOverScreen(); // Para e desenha
        gameState = 'gameover'; // Define estado DEPOIS de parar
    };
    onPassPipe = function() { score++; console.log("Score Padrão:", score); };
    onEveryFrame = function() { if(bird) bird.update(); };

    // Resetar configs do jogo
    config.gravity = 0.5; config.flapStrength = -8; config.pipeSpeed = 2;
    config.pipeGap = 100; config.pipeFrequency = 90; config.initialBirdY = canvas.height / 2;

    // Gerar e executar o novo código
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Loop infinito.";\n';
    var userCode = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    console.log("Código gerado:\n", userCode);

    try {
        var codeExecutor = new Function(userCode);
        codeExecutor(); // Define as novas onGameStarts, onClickOrTap, etc. e configs
        console.log("Código dos blocos definido com sucesso.");
    } catch (e) {
        console.error("Erro ao executar código dos blocos:", e);
        alert('Erro no código dos blocos:\n' + e);
        initGame(); // Vai para a tela inicial padrão em caso de erro
        return;
    }

    // Reinicia o estado do jogo COM as novas configs/funções
    initGame();
}

// --- Event Listeners ---
runCodeBtn.addEventListener('click', runBlocklyCode);
resetGameBtn.addEventListener('click', forceRestartGame); // Botão chama direto a função do game.js

// Adiciona listeners de input do jogo (Click/Touch no Canvas, Espaço)
gameCanvas.addEventListener('click', handleInput);
document.addEventListener('keydown', function(event) { if (event.code === 'Space') { event.preventDefault(); handleInput(); } });
gameCanvas.addEventListener('touchstart', function(event) { event.preventDefault(); handleInput(); });


// Ajusta o tamanho do Blockly dinamicamente
function onResize() {
    // Position blocklyDiv over blocklyContainer.
    blocklyDiv.style.position = 'absolute'; // Necessário para Blockly redimensionar corretamente
    var container = document.getElementById('blocklyContainer');
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = container;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = container.offsetWidth + 'px';
    blocklyDiv.style.height = container.offsetHeight + 'px';
    Blockly.svgResize(workspace); // Informa ao Blockly para redimensionar o SVG
};
window.addEventListener('resize', onResize, false);


// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    onResize(); // Ajusta o tamanho inicial do Blockly
    Blockly.svgResize(workspace); // Garante o ajuste final
    initGame(); // Mostra a tela inicial do jogo (padrão)
    console.log("Blockly e Jogo prontos. Clique em 'Executar Blocos' para aplicar a lógica customizada.");
     // Pode carregar um workspace padrão se quiser
     // var defaultXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="when_click_or_tap" deletable="false" x="70" y="50"><next><block type="bird_flap"><value name="STRENGTH"><shadow type="math_number"><field name="NUM">8</field></shadow></value></block></next></block><block type="every_frame" deletable="false" x="70" y="150"><next><block type="default_update"></block></next></block></xml>';
     // Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(defaultXml), workspace);
});
