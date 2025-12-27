/**
 * head.js - Versão 2.0 (Integrada com Firebase Session)
 * Responsável pelo cabeçalho, busca e controle de acesso visual.
 */

// 1. ÍNDICE DE PESQUISA COMPLETO
const SEARCH_INDEX = [

  // ---------- SIMULADORES: MATEMÁTICA ----------
  { term: "Sim. Cálculo de Matriz", path: "Simulador > Matemática > Simulador", url: "simulacoes/matriz.html" },
  { term: "Sim. Análise de Funções", path: "Simulador > Matemática > Análise", url: "simulacoes/funcoes.html" },
  { term: "Sim. Juros Simples", path: "Simulador > Matemática > Financeira", url: "simulacoes/juros_simples.html" },
  { term: "Sim. Juros Compostos", path: "Simulador > Matemática > Financeira", url: "simulacoes/juros_compostos.html" },
  { term: "Sim. Desconto Simples", path: "Simulador > Matemática > Financeira", url: "simulacoes/desconto_simples.html" },
  { term: "Sim. Custo e Venda", path: "Simulador > Matemática > Financeira", url: "simulacoes/custo_venda.html" },
  { term: "Sim. Regra 50-30", path: "Simulador > Matemática > Financeira", url: "simulacoes/50-30.html" },
  { term: "Sim. CET (Custo Efetivo Total)", path: "Simulador > Matemática > Financeira", url: "simulacoes/cet.html" },
  { term: "Sim. Rendas e Amortização", path: "Simulador > Matemática > Financeira", url: "simulacoes/rendas.html" },
  { term: "Sim. Porcentagem", path: "Simulador > Matemática > Fundamentos", url: "simulacoes/porcentagem.html" },
  { term: "Sim. Probabilidade", path: "Simulador > Matemática > Estatística", url: "simulacoes/probabilidade.html" },
  { term: "Sim. Análise Combinatória", path: "Simulador > Matemática > Análise", url: "simulacoes/combinatoria.html" },
  { term: "Sim. Sequências Numéricas", path: "Simulador > Matemática > Álgebra", url: "simulacoes/sequencias_numericas.html" },
  { term: "Sim. Conjuntos Numéricos", path: "Simulador > Matemática > Fundamentos", url: "simulacoes/conjuntos_numericos.html" },
  { term: "Sim. Geometria Plana", path: "Simulador > Matemática > Geometria", url: "simulacoes/geometria_plana.html" },
  { term: "Sim. Geometria Analítica", path: "Simulador > Matemática > Geometria", url: "simulacoes/geo_analitica.html" },
  { term: "Sim. Arcos e Ângulos", path: "Simulador > Matemática > Trigonometria", url: "simulacoes/arcos_angulos.html" },
  { term: "Sim. Sistema Linear", path: "Simulador > Matemática > Sistemas", url: "simulacoes/sistem-linear.html" },

  // ---------- SIMULADORES: FÍSICA ----------
  { term: "Sim. Queda Livre", path: "Simulador > Física > Cinemática", url: "simulacoes/queda_livre.html" },
  { term: "Sim. MRU (Mov. Retilíneo Uniforme)", path: "Simulador > Física > Cinemática", url: "simulacoes/mru.html" },
  { term: "Sim. MRUV (Mov. Retilíneo Uniforme Variado)", path: "Simulador > Física > Cinemática", url: "simulacoes/mruv.html" },
  { term: "Sim. Gravitação Universal", path: "Simulador > Física > Mecânica", url: "simulacoes/gravitacao_universal.html" },
  { term: "Sim. Conservação de Energia", path: "Simulador > Física > Mecânica", url: "simulacoes/energia.html" },
  { term: "Sim. Hidrostática", path: "Simulador > Física > Mecânica", url: "simulacoes/hidrostatica.html" },
  { term: "Sim. Ondas", path: "Simulador > Física > Ondulatória", url: "simulacoes/ondas.html" },
  { term: "Sim. Calorimetria", path: "Simulador > Física > Termologia", url: "simulacoes/calorimetria.html" },
  { term: "Sim. Dilatação Térmica", path: "Simulador > Física > Termologia", url: "simulacoes/dilatacao_termica.html" },
  { term: "Sim. Escalas Termométricas", path: "Simulador > Física > Termologia", url: "simulacoes/escalas_termometricas.html" },

  // ---------- SIMULADORES: QUÍMICA ----------
  { term: "Sim. Tabela Periódica", path: "Simulador > Química > Geral", url: "simulacoes/tabela_periodica.html" },
  { term: "Sim. Ligações Químicas", path: "Simulador > Química > Geral", url: "simulacoes/ligacoes.html" },
  { term: "Sim. Reações Químicas", path: "Simulador > Química > Geral", url: "simulacoes/reacoes.html" },
  { term: "Sim. Ácidos e Bases", path: "Simulador > Química > Inorgânica", url: "simulacoes/acidos_bases.html" },
  { term: "Sim. NOX (Nº Oxidação)", path: "Simulador > Química > RedOx", url: "simulacoes/nox.html" },
  { term: "Sim. Estequiometria", path: "Simulador > Química > Cálculos", url: "simulacoes/estequiometria.html" },
  { term: "Sim. Soluções", path: "Simulador > Química > Físico-Química", url: "simulacoes/solucoes.html" },

  // ---------- SIMULADOR: PROGRAMAÇÃO ----------
  { term: "Simulador IDE Virtual", path: "Simulador > Programação > Testador", url: "codeTester.html" },

  // ---------- JOGOS ----------
  { term: "Game Flappy Blocks", path: "Jogos > Física", url: "games/flappy-blocks/index.html" },
  { term: "Game Labirinto", path: "Jogos > Matemática", url: "games/labirinto.html" },
  { term: "Game Akinator", path: "Jogos > Geral", url: "games/make-your-akinator.html" },

  // ---------- CONTEÚDO DIDÁTICO: MATEMÁTICA ----------
  { term: "Cálculo e Limites", path: "Conteúdo > Matemática", url: "conteudos/calculo.html" },
  { term: "Sistemas Lineares", path: "Conteúdo > Matemática", url: "conteudos/sistemas.html" },
  { term: "Polinômios", path: "Conteúdo > Matemática", url: "conteudos/polinomios.html" },
  { term: "Estatística Avançada", path: "Conteúdo > Matemática", url: "conteudos/estatistica.html" },
  { term: "Juros Simples", path: "Conteúdo > Matemática > Financeira", url: "conteudos/juros-simples.html" },
  { term: "Juros Compostos", path: "Conteúdo > Matemática > Financeira", url: "conteudos/juros-compostos.html" },
  { term: "Arcos e Ângulos", path: "Conteúdo > Matemática > Geometria", url: "conteudos/arcos.html" },
  { term: "Geometria Analítica", path: "Conteúdo > Matemática > Geometria", url: "conteudos/analitica.html" },

  // ---------- CONTEÚDO DIDÁTICO: BIOLOGIA ----------
  { term: "Sistema Digestório", path: "Conteúdo > Biologia > Corpo", url: "biologia/digestorio.html" },
  { term: "Sistema Circulatório", path: "Conteúdo > Biologia > Corpo", url: "biologia/circulatorio.html" },
  { term: "Sistema Respiratório", path: "Conteúdo > Biologia > Corpo", url: "biologia/respiratorio.html" },
  { term: "Sistema Nervoso", path: "Conteúdo > Biologia > Corpo", url: "biologia/nervoso.html" },
  { term: "Sistema Imunológico", path: "Conteúdo > Biologia > Corpo", url: "biologia/imunologico.html" },
  { term: "Sistema Muscular", path: "Conteúdo > Biologia > Corpo", url: "biologia/muscular.html" },
  { term: "Sistema Esquelético", path: "Conteúdo > Biologia > Corpo", url: "biologia/esqueletico.html" },
  { term: "Sistema Urinário", path: "Conteúdo > Biologia > Corpo", url: "biologia/urinario.html" },
  { term: "Sistema Reprodutor", path: "Conteúdo > Biologia > Corpo", url: "biologia/reprodutor.html" },
  { term: "Classificação Animal", path: "Conteúdo > Biologia > Animal", url: "biologia/classificacao.html" },
  { term: "Comportamento Animal", path: "Conteúdo > Biologia > Animal", url: "biologia/comportamento.html" },
  { term: "Fisiologia Animal", path: "Conteúdo > Biologia > Animal", url: "biologia/fisiologia.html" },
  { term: "DNA e RNA", path: "Conteúdo > Biologia > Genética", url: "biologia/dna.html" },
  { term: "Herança Genética", path: "Conteúdo > Biologia > Genética", url: "biologia/heranca.html" },
  { term: "Mutação", path: "Conteúdo > Biologia > Genética", url: "biologia/mutacao.html" },
  { term: "Estrutura Celular", path: "Conteúdo > Biologia > Células", url: "biologia/estrutura-celular.html" },
  { term: "Divisão Celular", path: "Conteúdo > Biologia > Células", url: "biologia/divisao.html" },
  { term: "Metabolismo Celular", path: "Conteúdo > Biologia > Células", url: "biologia/metabolismo.html" },

  // ---------- CONTEÚDO DIDÁTICO: FÍSICA ----------
  { term: "MRU", path: "Conteúdo > Física > Mecânica", url: "fisica/mru.html" },
  { term: "MRUV", path: "Conteúdo > Física > Mecânica", url: "fisica/mruv.html" },
  { term: "Energia", path: "Conteúdo > Física > Mecânica", url: "fisica/energia.html" },
  { term: "Queda Livre", path: "Conteúdo > Física > Mecânica", url: "fisica/queda.html" },
  { term: "Dilatação Térmica", path: "Conteúdo > Física > Termodinâmica", url: "fisica/dilatacao.html" },
  { term: "Calorimetria", path: "Conteúdo > Física > Termodinâmica", url: "fisica/calorimetria.html" },
  { term: "Escalas Termométricas", path: "Conteúdo > Física > Termodinâmica", url: "fisica/escalas.html" },
  { term: "Ondas e Óptica", path: "Conteúdo > Física > Ondas", url: "fisica/ondas.html" },
  { term: "Hidrostática", path: "Conteúdo > Física > Ondas", url: "fisica/hidrostatica.html" },
  { term: "Gravitação Universal", path: "Conteúdo > Física > Ondas", url: "fisica/gravidade.html" },
  { term: "Eletricidade", path: "Conteúdo > Física > Eletromagnetismo", url: "fisica/eletricidade.html" },
  { term: "Eletrostática", path: "Conteúdo > Física > Eletromagnetismo", url: "fisica/eletrostatica.html" },
  { term: "Eletromagnetismo", path: "Conteúdo > Física > Eletromagnetismo", url: "fisica/eletromagnetismo.html" },
  { term: "Circuitos Elétricos", path: "Conteúdo > Física > Eletromagnetismo", url: "fisica/circuitos.html" },
  { term: "Óptica Geométrica", path: "Conteúdo > Física > Eletromagnetismo", url: "fisica/optica.html" },

  // ---------- CONTEÚDO DIDÁTICO: QUÍMICA ----------
  { term: "Tabela Periódica", path: "Conteúdo > Química > Geral", url: "quimica/tabela-periodica.html" },
  { term: "Ligações Químicas", path: "Conteúdo > Química > Geral", url: "quimica/ligacoes.html" },
  { term: "Ácidos e Bases", path: "Conteúdo > Química > Geral", url: "quimica/acidos-bases.html" },
  { term: "Balanceamento", path: "Conteúdo > Química > Geral", url: "quimica/balanceamento.html" },
  { term: "Funções Inorgânicas", path: "Conteúdo > Química > Geral", url: "quimica/funcoes-inorganicas.html" },
  { term: "NOX", path: "Conteúdo > Química > Inorgânica", url: "quimica/nox.html" },
  { term: "Estequiometria", path: "Conteúdo > Química > Inorgânica", url: "quimica/estequiometria.html" },
  { term: "Soluções", path: "Conteúdo > Química > Inorgânica", url: "quimica/solucoes.html" },
  { term: "Reações Químicas", path: "Conteúdo > Química > Inorgânica", url: "quimica/reacoes.html" },
  { term: "Cinética Química", path: "Conteúdo > Química > Inorgânica", url: "quimica/cinetica.html" },
  { term: "Orgânica", path: "Conteúdo > Química > Orgânica", url: "quimica/organica.html" },
  { term: "Eletroquímica", path: "Conteúdo > Química > Orgânica", url: "quimica/eletroquimica.html" },
  { term: "Termoquímica", path: "Conteúdo > Química > Orgânica", url: "quimica/termoquimica.html" },
  { term: "Radioatividade", path: "Conteúdo > Química > Orgânica", url: "quimica/radioatividade.html" },
  { term: "Polímeros", path: "Conteúdo > Química > Orgânica", url: "quimica/polimeros.html" },

  // ---------- CONTEÚDO DIDÁTICO: PROGRAMAÇÃO ----------
  { term: "Algoritmos", path: "Conteúdo > Programação > Básica", url: "programacao/algoritmos.html" },
  { term: "Variáveis e Tipos", path: "Conteúdo > Programação > Básica", url: "programacao/variaveis.html" },
  { term: "Estruturas de Controle", path: "Conteúdo > Programação > Básica", url: "programacao/controle.html" },
  { term: "Funções", path: "Conteúdo > Programação > Avançada", url: "programacao/funcoes.html" },
  { term: "POO", path: "Conteúdo > Programação > Avançada", url: "programacao/poo.html" },
  { term: "Recursão", path: "Conteúdo > Programação > Avançada", url: "programacao/recursao.html" },
  { term: "HTML & CSS", path: "Conteúdo > Programação > Web", url: "programacao/html-css.html" },
  { term: "JavaScript", path: "Conteúdo > Programação > Web", url: "programacao/javascript.html" },
  { term: "Frameworks", path: "Conteúdo > Programação > Web", url: "programacao/frameworks.html" },
  { term: "SQL", path: "Conteúdo > Programação > Banco de Dados", url: "programacao/sql.html" },
  { term: "NoSQL", path: "Conteúdo > Programação > Banco de Dados", url: "programacao/nosql.html" },
  { term: "Modelagem de Dados", path: "Conteúdo > Programação > Banco de Dados", url: "programacao/modelagem.html" },

  // ---------- PÁGINAS PRINCIPAIS DAS MATÉRIAS ----------
  { term: "Sistemas", path: "Matéria > Matemática", url: "materias/sistemas.html" },
  { term: "Biologia", path: "Matéria > Biologia", url: "materias/biologia.html" },
  { term: "Física", path: "Matéria > Física", url: "materias/fisica.html" },
  { term: "Matemática", path: "Matéria > Matemática", url: "materias/matematica.html" },
  { term: "Programação", path: "Matéria > Programação", url: "materias/programacao.html" },
  { term: "Química", path: "Matéria > Química", url: "materias/quimica.html" }

];

// 2. HTML DO CABEÇALHO
const headerHTML = `
    <header class="top-bar">
        <div class="logo-area">
            <a href="https://erik-bernardo.github.io/SimuLab/index.html" class="logo-link">
                <img src="https://erik-bernardo.github.io/SimuLab/dados/simulab_banner.png" alt="SimuLab Logo" class="logo-image">
            </a>
        </div>
        
        <div class="search-wrapper">
            <div class="search-container">
                <input type="text" class="search-input" id="globalSearchInput" placeholder="Buscar no SimuLab...">
                <button class="search-button"><i class="fas fa-search"></i></button>
            </div>
            <ul class="search-suggestions" id="searchSuggestions"></ul>
        </div>

        <nav class="nav-links">
            <a href="https://erik-bernardo.github.io/SimuLab/sobre.html" class="nav-link">Sobre</a>
            <a href="https://erik-bernardo.github.io/SimuLab/recursos.html" class="nav-link">Recursos</a>
            <a href="https://erik-bernardo.github.io/SimuLab/materias.html" class="nav-link main-action">CONTEÚDO</a>
            
            <div id="header-user-area" class="user-area-header">
                <a href="https://erik-bernardo.github.io/SimuLab/dados/login.html" class="login-btn-header">
                    <i class="fas fa-user-circle"></i> Entrar
                </a>
            </div>
        </nav>
    </header>
    <div style="height: 75px;"></div> `;

// 3. CSS DO CABEÇALHO
const headerStyles = `
    .top-bar {
        background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex; justify-content: space-between; align-items: center;
        padding: 0 40px; min-height: 75px; position: fixed; top: 0; left: 0; right: 0; z-index: 10000;
    }
    .logo-image { max-height: 50px; }
    
    .search-wrapper { flex-grow: 1; max-width: 400px; margin: 0 30px; position: relative; }
    .search-container { display: flex; border: 1px solid #ddd; border-radius: 25px; overflow: hidden; transition: 0.3s; }
    .search-container:focus-within { border-color: #d96c2c; box-shadow: 0 0 8px rgba(217,108,44,0.2); }
    .search-input { border: none; padding: 10px 20px; outline: none; width: 100%; font-family: inherit; }
    .search-button { border: none; background: #d96c2c; color: white; padding: 0 20px; cursor: pointer; }

    .search-suggestions { 
        position: absolute; top: 100%; left: 0; right: 0; background: white; 
        border-radius: 0 0 15px 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); 
        list-style: none; padding: 0; margin: 0; display: none; overflow: hidden;
    }
    .search-suggestions li { padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #f0f0f0; }
    .search-suggestions li:hover { background: #fff5f0; }
    .suggestion-path { font-size: 11px; color: #999; display: block; }

    .nav-links { display: flex; align-items: center; gap: 20px; }
    .nav-link { text-decoration: none; color: #444; font-size: 14px; font-weight: 600; transition: 0.3s; }
    .nav-link:hover { color: #d96c2c; }
    .nav-link.main-action { background: #d96c2c; color: white; padding: 10px 20px; border-radius: 8px; }

    .user-area-header { border-left: 1px solid #eee; padding-left: 20px; }
    .login-btn-header { 
        text-decoration: none; color: #d96c2c; border: 2px solid #d96c2c;
        padding: 6px 18px; border-radius: 20px; font-weight: bold; display: flex; align-items: center; gap: 8px;
    }
    
    .user-profile-header { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .user-info-mini { text-align: right; }
    .u-name { display: block; font-size: 13px; font-weight: bold; color: #333; }
    .u-role { display: block; font-size: 10px; color: #d96c2c; text-transform: uppercase; }
    .user-avatar-mini { 
        width: 38px; height: 38px; border-radius: 50%; background: #d96c2c; 
        color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;
    }
    .user-avatar-mini img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

    @media (max-width: 768px) {
        .top-bar { padding: 0 15px; }
        .search-wrapper, .nav-link:not(.main-action) { display: none; }
    }
`;

document.addEventListener('DOMContentLoaded', () => {
    // 1. INJETAR CSS E HTML
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // 2. REFERÊNCIAS
    const searchInput = document.getElementById('globalSearchInput');
    const suggestionsList = document.getElementById('searchSuggestions');
    const searchButton = document.querySelector('.search-button');
    const userArea = document.getElementById('header-user-area');

    // 3. LÓGICA DE USUÁRIO (SESSÃO)
    window.addEventListener("sessionUpdate", (e) => {
        const session = e.detail;

        if (session.isLoggedIn) {
            // Define destino: Estudante ou Professor
            const dashboardUrl = session.role === 'aluno' 
                ? "https://erik-bernardo.github.io/SimuLab/dados/estudante.html" 
                : "https://erik-bernardo.github.io/SimuLab/dados/painel-professor.html";

            const avatarHTML = session.fotoUrl 
                ? `<img src="${session.fotoUrl}">` 
                : `<span>${session.nome.charAt(0).toUpperCase()}</span>`;

            userArea.innerHTML = `
                <a href="${dashboardUrl}" class="user-profile-header">
                    <div class="user-info-mini">
                        <span class="u-name">${session.nome.split(' ')[0]}</span>
                        <span class="u-role">${session.turma || session.role}</span>
                    </div>
                    <div class="user-avatar-mini">${avatarHTML}</div>
                </a>
            `;
        } else {
            userArea.innerHTML = `
                <a href="https://erik-bernardo.github.io/SimuLab/dados/login.html" class="login-btn-header">
                    <i class="fas fa-user-circle"></i> Entrar
                </a>
            `;
        }
    });

    // 4. LÓGICA DE BUSCA
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query.length < 2) return;
        const match = SEARCH_INDEX.find(i => i.term.toLowerCase().includes(query));
        if (match) window.location.href = match.url;
        else window.location.href = "https://erik-bernardo.github.io/SimuLab/materias.html";
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        suggestionsList.innerHTML = '';
        if (query.length > 1) {
            const results = SEARCH_INDEX.filter(i => i.term.toLowerCase().includes(query)).slice(0, 5);
            if (results.length > 0) {
                results.forEach(res => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${res.term}</strong><span class="suggestion-path">${res.path}</span>`;
                    li.onclick = () => window.location.href = res.url;
                    suggestionsList.appendChild(li);
                });
                suggestionsList.style.display = 'block';
            } else { suggestionsList.style.display = 'none'; }
        } else { suggestionsList.style.display = 'none'; }
    });

    searchButton.onclick = handleSearch;
    searchInput.onkeypress = (e) => { if(e.key === 'Enter') handleSearch(); };
    document.onclick = (e) => { if (!e.target.closest('.search-wrapper')) suggestionsList.style.display = 'none'; };
});
