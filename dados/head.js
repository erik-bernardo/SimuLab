/**
 * head.js - Versão 2.0 (Integrada com Firebase Session)
 * Responsável pelo cabeçalho, busca e controle de acesso visual.
 */

// 1. ÍNDICE DE PESQUISA COMPLETO
const SEARCH_INDEX = [

 // ---------- SIMULADORES: MATEMÁTICA ----------
{ term: "Sim. Cálculo de Matriz", path: "Simulador > Matemática > Simulador", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/matriz.html" },
{ term: "Sim. Análise de Funções", path: "Simulador > Matemática > Análise", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/funcoes.html" },
{ term: "Sim. Juros", path: "Simulador > Matemática > Financeira", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/juros.html" },
{ term: "Sim. Custo e Venda", path: "Simulador > Matemática > Financeira", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/custo_venda.html" },
{ term: "Sim. Porcentagem", path: "Simulador > Matemática > Fundamentos", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/porcentagem.html" },
{ term: "Sim. Probabilidade", path: "Simulador > Matemática > Estatística", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/probabilidade.html" },
{ term: "Sim. Análise Combinatória", path: "Simulador > Matemática > Análise", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/combinatoria.html" },
{ term: "Sim. Sequências Numéricas", path: "Simulador > Matemática > Álgebra", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/sequencias_numericas.html" },
{ term: "Sim. Conjuntos Numéricos", path: "Simulador > Matemática > Fundamentos", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/conjuntos_numericos.html" },
{ term: "Sim. Geometria Plana", path: "Simulador > Matemática > Geometria", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/geometria_plana.html" },
{ term: "Sim. Arcos e Ângulos", path: "Simulador > Matemática > Trigonometria", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/arcos_angulos.html" },
{ term: "Sim. Sistema Linear", path: "Simulador > Matemática > Sistemas", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/sistem-linear.html" },

// ---------- SIMULADORES: FÍSICA ----------
{ term: "Sim. Queda Livre", path: "Simulador > Física > Cinemática", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/queda_livre.html" },
{ term: "Sim. MRU/MRUV", path: "Simulador > Física > Cinemática", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/mru.html" },
{ term: "Sim. Gravitação Universal", path: "Simulador > Física > Mecânica", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/gravitacao_universal.html" },
{ term: "Sim. Conservação de Energia", path: "Simulador > Física > Mecânica", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/energia.html" },
{ term: "Sim. Hidrostática", path: "Simulador > Física > Mecânica", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/hidrostatica.html" },
{ term: "Sim. Ondas", path: "Simulador > Física > Ondulatória", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/ondas.html" },
{ term: "Sim. Calorimetria", path: "Simulador > Física > Termologia", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/calorimetria.html" },
{ term: "Sim. Dilatação Térmica", path: "Simulador > Física > Termologia", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/dilatacao_termica.html" },
{ term: "Sim. Escalas Termométricas", path: "Simulador > Física > Termologia", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/escalas_termometricas.html" },

// ---------- SIMULADORES: QUÍMICA ----------
{ term: "Sim. Tabela Periódica", path: "Simulador > Química > Geral", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/tabela_periodica.html" },
{ term: "Sim. Ligações Químicas", path: "Simulador > Química > Geral", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/ligacoes.html" },
{ term: "Sim. Reações Químicas", path: "Simulador > Química > Geral", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/reacoes.html" },
{ term: "Sim. Ácidos e Bases", path: "Simulador > Química > Inorgânica", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/acidos_bases.html" },
{ term: "Sim. NOX (Nº Oxidação)", path: "Simulador > Química > RedOx", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/nox.html" },
{ term: "Sim. Estequiometria", path: "Simulador > Química > Cálculos", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/estequiometria.html" },
{ term: "Sim. Soluções", path: "Simulador > Química > Físico-Química", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/solucoes.html" },

  // ---------- SIMULADOR: PROGRAMAÇÃO ----------
  { term: "Simulador IDE Virtual", path: "Simulador > Programação > Testador", url: "codeTester.html" },

  // ---------- JOGOS ----------
  { term: "Game Flappy Blocks", path: "Jogos > Física", url: "games/flappy-blocks/index.html" },
  { term: "Game Labirinto", path: "Jogos > Matemática", url: "games/labirinto.html" },
  { term: "Game Akinator", path: "Jogos > Geral", url: "games/make-your-akinator.html" },

 
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
