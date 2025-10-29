// js/main.js - Inicialização e Integração do Blockly com o Jogo

// --- Configuração do Workspace Blockly ---
var blocklyArea = document.getElementById('blocklyArea'); // A área que contém o div
var blocklyDiv = document.getElementById('blocklyDiv');
var workspace = Blockly.inject(blocklyDiv, {
    toolbox: document.getElementById('toolbox'), // Pega a toolbox do HTML
    scrollbars: true,
    trashcan: true,
    zoom: { // Configurações de zoom
        controls: true,
        wheel: false, // Desativa zoom com roda do mouse se preferir
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    }
});

// --- Elementos da UI ---
const runCodeBtn = document.getElementById('runCodeBtn');
const resetGameBtn = document.getElementById('resetGameBtn');

// --- Função para Executar o Código dos Blocos ---
function runBlocklyCode() {
    console.log("Executando código dos blocos...");
    // 1. Parar loop do jogo anterior, se estiver rodando
    stopGameLoop();

    // 2. Resetar as funções de evento para o padrão (importante!)
    //    Isso garante que código antigo de blocos não interfira.
    onGameStarts = function() { console.log("Jogo Padrão Iniciado!"); };
    onClickOrTap = function() { if (bird) bird.flap(); };
    onHitObstacle = function() {
        if (gameState === 'gameover') return;
        console.log("Game Over Padrão! Score:", score);
        gameState = 'gameover';
        stopGameLoop(); drawGameOverScreen();
    };
    onPassPipe = function() { score++; console.log("Score Padrão:", score); };
    onEveryFrame = function() { if(bird) bird.update(); }; // Lógica padrão de gravidade

    // 3. Resetar configurações para o padrão antes de aplicar as dos blocos
    config.gravity = 0.5;
    config.flapStrength = -8;
    config.pipeSpeed = 2;
    config.pipeGap = 100;
    config.pipeFrequency = 90;
    config.initialBirdY = canvas.height / 2;


    // 4. Gerar o código JavaScript a partir dos blocos
    window.LoopTrap = 1000; // Proteção contra loops infinitos do Blockly
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Loop infinito.";\n';
    var userCode = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null; // Desativa a proteção após gerar

    console.log("Código gerado:\n", userCode);

    // 5. Executar o código gerado para DEFINIR as funções de evento e configs
    try {
        // Usar new Function é mais seguro que eval, mas ainda pode ter riscos
        // Em um app real, considere um sandbox ou interpretador mais seguro.
        var codeExecutor = new Function(userCode);
        codeExecutor(); // Executa para definir onGameStarts, onClickOrTap, etc. e configs
        console.log("Código dos blocos executado com sucesso.");
    } catch (e) {
        console.error("Erro ao executar código dos blocos:", e);
        alert('Erro no código dos blocos:\n' + e);
        // Não inicia o jogo se houver erro no código dos blocos
        initGame(); // Vai para a tela inicial padrão
        return;
    }

    // 6. Reiniciar o estado do jogo (mas mantendo as configs/funções definidas pelos blocos)
    initGame(); // Mostra a tela inicial, bird pronto
    // O jogo começará de fato no primeiro clique/toque (chamando startGame -> onGameStarts)
}

// --- Event Listeners ---
runCodeBtn.addEventListener('click', runBlocklyCode);
resetGameBtn.addEventListener('click', forceRestartGame); // Botão de reiniciar chama a função do game.js

// Ajusta o tamanho do Blockly quando a janela muda
function onResize() {
    var element = blocklyDiv;
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
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
};
// window.addEventListener('resize', onResize, false); // Desativado por simplicidade agora
// onResize(); // Chama uma vez para ajustar

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // A inicialização do jogo (initGame) agora é chamada DENTRO de runBlocklyCode
    // para garantir que as configurações dos blocos sejam aplicadas primeiro.
    // Apenas garante que o workspace está pronto.
    console.log("Blockly workspace pronto.");
    // Carrega blocos iniciais (opcional)
    // Exemplo: Colocar o bloco "Quando Jogo Iniciar" por padrão
    // var xml_text = '<xml><block type="when_game_starts" deletable="false" x="70" y="50"></block></xml>';
    // var xml = Blockly.Xml.textToDom(xml_text);
    // Blockly.Xml.domToWorkspace(xml, workspace);
});
