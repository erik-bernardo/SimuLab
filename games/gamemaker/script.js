// Referências
const areaBlocos = document.getElementById('areaBlocos');
const editorCodigo = document.getElementById('editorCodigo');
const modoBlocos = document.getElementById('modoBlocos');
const modoCodigo = document.getElementById('modoCodigo');
const executar = document.getElementById('executar');
const janelaJogo = document.getElementById('janelaJogo');

// Inicializa Blockly
const workspace = Blockly.inject(areaBlocos, { toolbox: `
  <xml xmlns="https://developers.google.com/blockly/xml">
    <block type="criar_jogador"></block>
    <block type="mover_direita"></block>
  </xml>
`});

// Define blocos personalizados
Blockly.defineBlocksWithJsonArray([
  {
    "type": "criar_jogador",
    "message0": "criar jogador em x %1 y %2",
    "args0": [
      {"type": "field_number", "name": "X", "value": 100},
      {"type": "field_number", "name": "Y", "value": 100}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 230
  },
  {
    "type": "mover_direita",
    "message0": "mover jogador para direita velocidade %1",
    "args0": [
      {"type": "field_number", "name": "VEL", "value": 5}
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 160
  }
]);

// Gerador da nossa linguagem simples
Blockly.JavaScript['criar_jogador'] = block => {
  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  return `criar jogador x=${x} y=${y}\n`;
};

Blockly.JavaScript['mover_direita'] = block => {
  const vel = block.getFieldValue('VEL');
  return `movimento jogador direita velocidade=${vel}\n`;
};

// Alternar modos
modoBlocos.onclick = () => {
  areaBlocos.style.display = "block";
  editorCodigo.style.display = "none";
};

modoCodigo.onclick = () => {
  areaBlocos.style.display = "none";
  editorCodigo.style.display = "block";
  editorCodigo.value = Blockly.JavaScript.workspaceToCode(workspace);
};

// Interpretador da nossa linguagem
function interpretar(codigo) {
  const linhas = codigo.split('\n');
  let js = `
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);
    let jogador = {x: 50, y: 200, cor: 'blue'};
    function desenhar() {
      ctx.clearRect(0,0,400,400);
      ctx.fillStyle = jogador.cor;
      ctx.fillRect(jogador.x, jogador.y, 40, 40);
    }
    desenhar();
  `;

  linhas.forEach(linha => {
    if (linha.startsWith('criar jogador')) {
      const match = /x=(\d+)\s*y=(\d+)/.exec(linha);
      if (match) js += `jogador.x=${match[1]}; jogador.y=${match[2]}; desenhar();\n`;
    }
    if (linha.startsWith('movimento jogador direita')) {
      const match = /velocidade=(\d+)/.exec(linha);
      if (match) js += `jogador.x += ${match[1]}; desenhar();\n`;
    }
  });

  return js;
}

// Executar jogo
executar.onclick = () => {
  let codigo = '';
  if (editorCodigo.style.display === 'block') {
    codigo = editorCodigo.value;
  } else {
    codigo = Blockly.JavaScript.workspaceToCode(workspace);
  }

  const js = interpretar(codigo);
  janelaJogo.srcdoc = `<script>${js}<\/script>`;
};
