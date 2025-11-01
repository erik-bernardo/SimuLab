/* ==========================================================
   🎮 CRIE SEU JOGO - SCRIPT PRINCIPAL
   Autor: SimuLab Team
   Última atualização: 2025
   ========================================================== */

(() => {
  // =============================
  // 🔧 ELEMENTOS PRINCIPAIS
  // =============================
  const editor = document.getElementById("editorCodigo");
  const executarBtn = document.getElementById("executarCodigo");
  const limparBtn = document.getElementById("limparTela");
  const iframeExecucao = document.getElementById("canvasExecucao");

  const modoCodigoBtn = document.getElementById("modoCodigo");
  const modoBlocosBtn = document.getElementById("modoBlocos");

  const painelCodigo = document.getElementById("painelCodigo");
  const painelBlocos = document.getElementById("painelBlocos");

  let workspace = null;

  // =============================
  // 🧩 INICIALIZAÇÃO DO BLOCKLY
  // =============================
  window.addEventListener("load", () => {
    if (typeof Blockly !== "undefined") {
      workspace = Blockly.inject("blocosContainer", {
        toolbox: document.getElementById("toolbox"),
        scrollbars: true,
        trashcan: true,
        zoom: { controls: true, wheel: true },
        grid: { spacing: 25, length: 3, colour: "#ccc", snap: true },
      });
    }
  });

  // =============================
  // ⚙️ FUNÇÃO: EXECUTAR O CÓDIGO
  // =============================
  executarBtn.addEventListener("click", () => {
    const codigoUsuario = editor.value.trim();

    if (!codigoUsuario) {
      alert("Digite ou gere um código antes de executar!");
      return;
    }

    executarCodigoJogo(codigoUsuario);
  });

  // =============================
  // 🧹 LIMPAR ÁREA DE EXECUÇÃO
  // =============================
  limparBtn.addEventListener("click", () => {
    iframeExecucao.srcdoc = "";
  });

  // =============================
  // 💾 EXECUÇÃO SEGURA NO IFRAME
  // =============================
  function executarCodigoJogo(codigo) {
    const sandbox = `
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin:0; background:#111; overflow:hidden; }
          canvas { display:block; margin:0 auto; background:#222; }
          #msg {
            position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
            color: #fff; background: rgba(0,0,0,0.5);
            padding: 10px 20px; border-radius: 8px; font-family: sans-serif;
          }
        </style>
      </head>
      <body>
        <canvas id="gameCanvas" width="600" height="400"></canvas>
        <div id="msg"></div>

        <script>
          // =====================================================
          // ⚙️ ENGINE SIMPLES DE JOGO
          // =====================================================
          const canvas = document.getElementById('gameCanvas');
          const ctx = canvas.getContext('2d');

          let entidades = [];
          let titulo = "Jogo";
          let mensagens = [];
          let loopCallback = null;

          class Entidade {
            constructor(nome, tipo, {x, y, cor}) {
              this.nome = nome;
              this.tipo = tipo;
              this.x = x || 100;
              this.y = y || 100;
              this.cor = cor || "white";
              this.largura = 30;
              this.altura = 30;
            }

            desenhar() {
              ctx.fillStyle = this.cor;
              ctx.fillRect(this.x, this.y, this.largura, this.altura);
            }

            moverDireita() { this.x += 2; }
            moverEsquerda() { this.x -= 2; }
            moverCima() { this.y -= 2; }
            moverBaixo() { this.y += 2; }

            colideCom(nomeOutro) {
              const outro = entidades.find(e => e.nome === nomeOutro);
              if (!outro) return false;
              return (
                this.x < outro.x + outro.largura &&
                this.x + this.largura > outro.x &&
                this.y < outro.y + outro.altura &&
                this.y + this.altura > outro.y
              );
            }
          }

          const jogo = {
            titulo(t) {
              titulo = t;
              document.title = "🎮 " + t;
            },
            jogador(nome, props) {
              const j = new Entidade(nome, "jogador", props);
              entidades.push(j);
              window.jogador = j;
            },
            inimigo(nome, props) {
              const e = new Entidade(nome, "inimigo", props);
              entidades.push(e);
            },
            loop(callback) {
              loopCallback = callback;
            },
            mensagem(txt) {
              mensagens.push(txt);
              const msgDiv = document.getElementById('msg');
              msgDiv.innerText = txt;
              setTimeout(() => { msgDiv.innerText = ""; }, 3000);
            },
            limpar() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          };

          // =============================
          // 🧠 EXECUÇÃO DO CÓDIGO DO USUÁRIO
          // =============================
          try {
            ${codigo}
          } catch (e) {
            jogo.mensagem("❌ Erro: " + e.message);
          }

          // =============================
          // 🔁 LOOP PRINCIPAL
          // =============================
          function atualizar() {
            jogo.limpar();
            for (const e of entidades) e.desenhar();
            if (typeof loopCallback === 'function') loopCallback();
            requestAnimationFrame(atualizar);
          }

          atualizar();

          // =============================
          // 🎮 CONTROLES BÁSICOS (TECLADO)
          // =============================
          document.addEventListener('keydown', e => {
            if (!window.jogador) return;
            switch(e.key) {
              case 'ArrowRight': jogador.moverDireita(); break;
              case 'ArrowLeft': jogador.moverEsquerda(); break;
              case 'ArrowUp': jogador.moverCima(); break;
              case 'ArrowDown': jogador.moverBaixo(); break;
            }
          });

        <\/script>
      </body>
      </html>
    `;

    iframeExecucao.srcdoc = sandbox;
  }

  // =============================
  // 🧩 BOTÃO: CONVERTER BLOCOS → CÓDIGO
  // =============================
  const gerarCodigoBtn = document.getElementById("gerarCodigo");
  if (gerarCodigoBtn) {
    gerarCodigoBtn.addEventListener("click", () => {
      if (!workspace) {
        alert("O Blockly ainda não foi inicializado!");
        return;
      }
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      editor.value = code;
      alert("✅ Código gerado com sucesso!");
    });
  }

  // =============================
  // 🎨 ANIMAÇÕES DE INTERFACE
  // =============================
  const transicao = (elemento, mostrar) => {
    elemento.style.opacity = mostrar ? "1" : "0";
    elemento.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      elemento.style.display = mostrar ? "block" : "none";
    }, mostrar ? 0 : 400);
  };

  modoCodigoBtn.addEventListener("click", () => {
    painelBlocos.classList.remove("ativo");
    painelCodigo.classList.add("ativo");
    modoCodigoBtn.classList.add("ativo");
    modoBlocosBtn.classList.remove("ativo");
    transicao(painelCodigo, true);
    transicao(painelBlocos, false);
  });

  modoBlocosBtn.addEventListener("click", () => {
    painelCodigo.classList.remove("ativo");
    painelBlocos.classList.add("ativo");
    modoBlocosBtn.classList.add("ativo");
    modoCodigoBtn.classList.remove("ativo");
    transicao(painelBlocos, true);
    transicao(painelCodigo, false);
  });

  // =============================
  // 💡 MENSAGENS INTERATIVAS
  // =============================
  console.log(
    "%c🎮 Bem-vindo ao SimuLab - Crie Seu Jogo!",
    "color:#ff9800;font-weight:bold;font-size:16px;"
  );
  console.log("💡 Dica: use jogo.titulo(), jogo.jogador(), jogo.loop() e jogo.mensagem() para criar sua aventura!");
})();
