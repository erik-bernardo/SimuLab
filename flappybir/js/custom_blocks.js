// js/custom_blocks.js - Definição dos blocos Blockly para Flappy Bird

// --- Definições JSON dos Blocos ---

Blockly.defineBlocksWithJsonArray([
  // Eventos
  {
    "type": "when_game_starts",
    "message0": "Quando Jogo Iniciar",
    "nextStatement": null, // Bloco que encaixa comandos dentro
    "colour": "#FFD500", // Amarelo (cor de evento)
    "tooltip": "Executa ações quando o jogo começa (após o primeiro clique).",
    "helpUrl": ""
  },
  {
    "type": "when_click_or_tap",
    "message0": "Quando Clicar/Tocar na Tela",
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Executa ações quando o jogador interage para pular.",
    "helpUrl": ""
  },
   {
    "type": "when_hit_obstacle",
    "message0": "Quando Pássaro Bater (cano ou chão)",
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Executa ações quando ocorre uma colisão que termina o jogo.",
    "helpUrl": ""
  },
   {
    "type": "when_pass_pipe",
    "message0": "Quando Pássaro Passar Cano",
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Executa ações quando um ponto é marcado.",
    "helpUrl": ""
  },
   {
    "type": "every_frame",
    "message0": "A Cada Quadro (Loop)",
    "nextStatement": null,
    "colour": "#FFD500",
    "tooltip": "Executa ações continuamente enquanto o jogo está rodando.",
    "helpUrl": ""
  },

  // Ações do Pássaro
  {
    "type": "bird_flap",
    "message0": "Pássaro: Pular com força %1",
    "args0": [
      {
        "type": "input_value", // Aceita um bloco de número
        "name": "STRENGTH",
        "check": "Number" // Só aceita números
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#4C97FF", // Azul
    "tooltip": "Faz o pássaro pular para cima (força é negativa, ex: -8).",
    "helpUrl": ""
  },
    {
    "type": "bird_set_y",
    "message0": "Pássaro: Definir Posição Y para %1",
    "args0": [ { "type": "input_value", "name": "YPOS", "check": "Number" } ],
    "previousStatement": null, "nextStatement": null, "colour": "#4C97FF",
    "tooltip": "Define a posição vertical do pássaro (0 é o topo).",
    "helpUrl": ""
  },

  // Controle do Jogo
  {
    "type": "set_gravity",
    "message0": "Jogo: Definir Gravidade para %1",
    "args0": [ { "type": "input_value", "name": "GRAVITY", "check": "Number" } ],
    "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", // Verde
    "tooltip": "Define a força da gravidade (ex: 0.5).",
    "helpUrl": ""
  },
  {
    "type": "set_pipe_speed",
    "message0": "Jogo: Definir Velocidade Canos para %1",
    "args0": [ { "type": "input_value", "name": "SPEED", "check": "Number" } ],
    "previousStatement": null, "nextStatement": null, "colour": "#5BB75B",
    "tooltip": "Define a velocidade horizontal dos canos (ex: 2).",
    "helpUrl": ""
  },
   {
    "type": "set_pipe_gap",
    "message0": "Jogo: Definir Espaço Canos para %1",
    "args0": [ { "type": "input_value", "name": "GAP", "check": "Number" } ],
    "previousStatement": null, "nextStatement": null, "colour": "#5BB75B",
    "tooltip": "Define o espaço vertical entre os canos (ex: 100).",
    "helpUrl": ""
  },
  {
    "type": "add_score",
    "message0": "Jogo: Adicionar %1 ponto(s)",
    "args0": [ { "type": "input_value", "name": "POINTS", "check": "Number" } ],
    "previousStatement": null, "nextStatement": null, "colour": "#5BB75B",
    "tooltip": "Adiciona valor à pontuação atual.",
    "helpUrl": ""
  },
  {
    "type": "game_over",
    "message0": "Jogo: Terminar Jogo",
    "previousStatement": null, "nextStatement": null, "colour": "#5BB75B",
    "tooltip": "Força o fim do jogo (game over).",
    "helpUrl": ""
  },
   {
    "type": "restart_game",
    "message0": "Jogo: Reiniciar Jogo",
    "previousStatement": null, "nextStatement": null, "colour": "#5BB75B",
    "tooltip": "Reinicia o jogo para a tela inicial.",
    "helpUrl": ""
  },

  // Valores
  {
    "type": "get_bird_y",
    "message0": "Pássaro: Posição Y",
    "output": "Number", // Retorna um número
    "colour": "#A55BFF", // Roxo
    "tooltip": "Obtém a posição vertical atual do pássaro.",
    "helpUrl": ""
  },
    {
    "type": "get_bird_velocity",
    "message0": "Pássaro: Velocidade Y",
    "output": "Number",
    "colour": "#A55BFF",
    "tooltip": "Obtém a velocidade vertical atual do pássaro.",
    "helpUrl": ""
  },
   {
    "type": "get_score",
    "message0": "Jogo: Pontuação Atual",
    "output": "Number",
    "colour": "#A55BFF",
    "tooltip": "Obtém a pontuação atual do jogo.",
    "helpUrl": ""
  }

]);

// --- Geradores de Código JavaScript ---

Blockly.JavaScript['when_game_starts'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'DO'); // Pega o código dentro do bloco
  // Define a função onGameStarts (sobrescreve a padrão em game.js)
  var code = 'onGameStarts = function() {\n' + statements_code + '};\n';
  return code;
};

Blockly.JavaScript['when_click_or_tap'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'DO');
  // Define onClickOrTap
  var code = 'onClickOrTap = function() {\n' + statements_code + '};\n';
  return code;
};

Blockly.JavaScript['when_hit_obstacle'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'DO');
  // Define onHitObstacle
  var code = 'onHitObstacle = function() {\n' + statements_code + '};\n';
  return code;
};

Blockly.JavaScript['when_pass_pipe'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'DO');
  // Define onPassPipe
  var code = 'onPassPipe = function() {\n' + statements_code + '};\n';
  return code;
};

Blockly.JavaScript['every_frame'] = function(block) {
  var statements_code = Blockly.JavaScript.statementToCode(block, 'DO');
  // Define onEveryFrame
  // IMPORTANTE: O usuário DEVE incluir `bird.update();` se quiser a gravidade padrão,
  // ou implementar sua própria lógica de movimento aqui.
  var code = 'onEveryFrame = function() {\n' + statements_code + '};\n';
  return code;
};


Blockly.JavaScript['bird_flap'] = function(block) {
  // Pega o valor do bloco conectado (ou 0 se nada conectado)
  var value_strength = Blockly.JavaScript.valueToCode(block, 'STRENGTH', Blockly.JavaScript.ORDER_ATOMIC) || '8';
  // Chama a função flap do pássaro, invertendo o sinal da força
  var code = 'if (bird) bird.flap(' + (-parseFloat(value_strength)) + ');\n';
  return code;
};

Blockly.JavaScript['bird_set_y'] = function(block) {
  var value_ypos = Blockly.JavaScript.valueToCode(block, 'YPOS', Blockly.JavaScript.ORDER_ATOMIC) || '240';
  var code = 'if (bird) bird.setY(' + value_ypos + ');\n';
  return code;
};


Blockly.JavaScript['set_gravity'] = function(block) {
  var value_gravity = Blockly.JavaScript.valueToCode(block, 'GRAVITY', Blockly.JavaScript.ORDER_ATOMIC) || '0.5';
  var code = 'config.gravity = parseFloat(' + value_gravity + ') || 0.5;\n'; // Atualiza a config
  return code;
};

Blockly.JavaScript['set_pipe_speed'] = function(block) {
  var value_speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC) || '2';
  var code = 'config.pipeSpeed = parseFloat(' + value_speed + ') || 2;\n';
  return code;
};

Blockly.JavaScript['set_pipe_gap'] = function(block) {
  var value_gap = Blockly.JavaScript.valueToCode(block, 'GAP', Blockly.JavaScript.ORDER_ATOMIC) || '100';
  var code = 'config.pipeGap = parseInt(' + value_gap + ') || 100;\n';
  return code;
};

Blockly.JavaScript['add_score'] = function(block) {
  var value_points = Blockly.JavaScript.valueToCode(block, 'POINTS', Blockly.JavaScript.ORDER_ATOMIC) || '1';
  var code = 'score += parseInt(' + value_points + ') || 0;\n';
  return code;
};

Blockly.JavaScript['game_over'] = function(block) {
  var code = 'forceGameOver();\n'; // Chama a função auxiliar em game.js
  return code;
};

Blockly.JavaScript['restart_game'] = function(block) {
  var code = 'forceRestartGame();\n'; // Chama a função auxiliar em game.js
  return code;
};


Blockly.JavaScript['get_bird_y'] = function(block) {
  var code = '(bird ? bird.y : 0)'; // Retorna Y ou 0 se bird não existe
  return [code, Blockly.JavaScript.ORDER_ATOMIC]; // Retorna valor
};

Blockly.JavaScript['get_bird_velocity'] = function(block) {
  var code = '(bird ? bird.velocity : 0)';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['get_score'] = function(block) {
  var code = 'score';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


// --- Adicionar geradores para blocos padrão (Lógica, Matemática, Variáveis) ---
// Normalmente, a biblioteca Blockly já inclui geradores para os blocos padrão
// (controls_if, logic_compare, math_number, math_arithmetic, etc.)
// quando você carrega javascript_compressed.js.
