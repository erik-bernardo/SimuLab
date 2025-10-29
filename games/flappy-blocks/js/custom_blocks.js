// js/custom_blocks.js - Definição dos blocos Blockly para Flappy Bird

// --- Definições JSON dos Blocos ---
Blockly.defineBlocksWithJsonArray([
  // Eventos
  { "type": "when_game_starts", "message0": "Quando Jogo Iniciar", "nextStatement": null, "colour": "#FFD500", "tooltip": "Executa ações quando o jogo começa (após o primeiro clique)." },
  { "type": "when_click_or_tap", "message0": "Quando Clicar/Tocar na Tela", "nextStatement": null, "colour": "#FFD500", "tooltip": "Executa ações quando o jogador interage para pular." },
  { "type": "when_hit_obstacle", "message0": "Quando Pássaro Bater", "nextStatement": null, "colour": "#FFD500", "tooltip": "Executa ações quando ocorre uma colisão que termina o jogo." },
  { "type": "when_pass_pipe", "message0": "Quando Pássaro Passar Cano", "nextStatement": null, "colour": "#FFD500", "tooltip": "Executa ações quando um ponto é marcado." },
  { "type": "every_frame", "message0": "A Cada Quadro (Loop)", "nextStatement": null, "colour": "#FFD500", "tooltip": "Executa ações continuamente enquanto o jogo está rodando." },

  // Ações do Pássaro
  { "type": "bird_flap", "message0": "Pássaro: Pular com força %1", "args0": [ { "type": "input_value", "name": "STRENGTH", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF", "tooltip": "Faz o pássaro pular para cima (força é negativa, ex: -8)." },
  { "type": "bird_set_y", "message0": "Pássaro: Definir Posição Y para %1", "args0": [ { "type": "input_value", "name": "YPOS", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#4C97FF", "tooltip": "Define a posição vertical do pássaro (0 é o topo)." },

  // Controle do Jogo
  { "type": "set_gravity", "message0": "Jogo: Definir Gravidade para %1", "args0": [ { "type": "input_value", "name": "GRAVITY", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "Define a força da gravidade (ex: 0.5)." },
  { "type": "set_pipe_speed", "message0": "Jogo: Definir Velocidade Canos para %1", "args0": [ { "type": "input_value", "name": "SPEED", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "Define a velocidade horizontal dos canos (ex: 2)." },
  { "type": "set_pipe_gap", "message0": "Jogo: Definir Espaço Canos para %1", "args0": [ { "type": "input_value", "name": "GAP", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "Define o espaço vertical entre os canos (ex: 100)." },
  { "type": "set_pipe_frequency", "message0": "Jogo: Definir Frequência Canos para %1", "args0": [ { "type": "input_value", "name": "FREQUENCY", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "A cada quantos frames um novo cano surge (ex: 90)." },
  { "type": "add_score", "message0": "Jogo: Adicionar %1 ponto(s)", "args0": [ { "type": "input_value", "name": "POINTS", "check": "Number" } ], "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "Adiciona valor à pontuação atual." },
  { "type": "game_over", "message0": "Jogo: Terminar Jogo", "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "Força o fim do jogo (game over)." },
  { "type": "restart_game", "message0": "Jogo: Reiniciar Jogo", "previousStatement": null, "nextStatement": null, "colour": "#5BB75B", "tooltip": "Reinicia o jogo para a tela inicial." },

  // Valores
  { "type": "get_bird_y", "message0": "Pássaro: Posição Y", "output": "Number", "colour": "#A55BFF", "tooltip": "Obtém a posição vertical atual do pássaro." },
  { "type": "get_bird_velocity", "message0": "Pássaro: Velocidade Y", "output": "Number", "colour": "#A55BFF", "tooltip": "Obtém a velocidade vertical atual do pássaro." },
  { "type": "get_score", "message0": "Jogo: Pontuação Atual", "output": "Number", "colour": "#A55BFF", "tooltip": "Obtém a pontuação atual do jogo." }
]);

// --- Geradores de Código JavaScript ---
Blockly.JavaScript['when_game_starts'] = function(block) { var code = Blockly.JavaScript.statementToCode(block, 'DO'); return 'onGameStarts = function() {\ntry {\n' + code + '} catch(e) { console.error("Erro em Quando Jogo Iniciar:", e); }\n};\n'; };
Blockly.JavaScript['when_click_or_tap'] = function(block) { var code = Blockly.JavaScript.statementToCode(block, 'DO'); return 'onClickOrTap = function() {\ntry {\n' + code + '} catch(e) { console.error("Erro em Quando Clicar:", e); }\n};\n'; };
Blockly.JavaScript['when_hit_obstacle'] = function(block) { var code = Blockly.JavaScript.statementToCode(block, 'DO'); return 'onHitObstacle = function() {\ntry {\n' + code + '} catch(e) { console.error("Erro em Quando Bater:", e); }\n// Garante game over visual mesmo se bloco falhar ou não chamar game_over()\n if(gameState !== "gameover") { gameState="gameover"; stopGameLoop(); drawGameOverScreen();}\n};\n'; };
Blockly.JavaScript['when_pass_pipe'] = function(block) { var code = Blockly.JavaScript.statementToCode(block, 'DO'); return 'onPassPipe = function() {\ntry {\n' + code + '} catch(e) { console.error("Erro em Quando Passar Cano:", e); }\n};\n'; };
Blockly.JavaScript['every_frame'] = function(block) { var code = Blockly.JavaScript.statementToCode(block, 'DO'); return 'onEveryFrame = function() {\ntry {\n' + code + '} catch(e) { console.error("Erro em A Cada Quadro:", e); }\n};\n'; };

Blockly.JavaScript['bird_flap'] = function(block) { var strength = Blockly.JavaScript.valueToCode(block, 'STRENGTH', Blockly.JavaScript.ORDER_ATOMIC) || '8'; return 'if (bird && gameState === "playing") bird.flap(' + (-parseFloat(strength)) + ');\n'; };
Blockly.JavaScript['bird_set_y'] = function(block) { var ypos = Blockly.JavaScript.valueToCode(block, 'YPOS', Blockly.JavaScript.ORDER_ATOMIC) || 'canvas.height / 2'; return 'if (bird) bird.setY(' + ypos + ');\n'; };

Blockly.JavaScript['set_gravity'] = function(block) { var gravity = Blockly.JavaScript.valueToCode(block, 'GRAVITY', Blockly.JavaScript.ORDER_ATOMIC) || '0.5'; return 'config.gravity = Math.max(0, parseFloat(' + gravity + ')) || 0.5;\n'; }; // Garante não negativo
Blockly.JavaScript['set_pipe_speed'] = function(block) { var speed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC) || '2'; return 'config.pipeSpeed = Math.max(0.1, parseFloat(' + speed + ')) || 2;\n'; }; // Mínimo 0.1
Blockly.JavaScript['set_pipe_gap'] = function(block) { var gap = Blockly.JavaScript.valueToCode(block, 'GAP', Blockly.JavaScript.ORDER_ATOMIC) || '100'; return 'config.pipeGap = Math.max(50, parseInt(' + gap + ')) || 100;\n'; }; // Mínimo 50
Blockly.JavaScript['set_pipe_frequency'] = function(block) { var freq = Blockly.JavaScript.valueToCode(block, 'FREQUENCY', Blockly.JavaScript.ORDER_ATOMIC) || '90'; return 'config.pipeFrequency = Math.max(30, parseInt(' + freq + ')) || 90;\n'; }; // Mínimo 30 frames
Blockly.JavaScript['add_score'] = function(block) { var points = Blockly.JavaScript.valueToCode(block, 'POINTS', Blockly.JavaScript.ORDER_ATOMIC) || '1'; return 'score += parseInt(' + points + ') || 0;\n'; };
Blockly.JavaScript['game_over'] = function(block) { return 'forceGameOver();\n'; };
Blockly.JavaScript['restart_game'] = function(block) { return 'forceRestartGame();\n'; };

Blockly.JavaScript['get_bird_y'] = function(block) { return ['(bird ? bird.y : 0)', Blockly.JavaScript.ORDER_ATOMIC]; };
Blockly.JavaScript['get_bird_velocity'] = function(block) { return ['(bird ? bird.velocity : 0)', Blockly.JavaScript.ORDER_ATOMIC]; };
Blockly.JavaScript['get_score'] = function(block) { return ['score', Blockly.JavaScript.ORDER_ATOMIC]; };

// Adiciona try-catch básico nos geradores de evento para segurança
// (O código dentro dos geradores já está com try-catch)
