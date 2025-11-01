/**
 * head.js
 * Contém o HTML, CSS e lógica do cabeçalho superior e barra de pesquisa.
 */

// 1. DADOS DE SUGESTÕES DE PESQUISA (Seu índice de busca)
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
  { term: "Modelagem de Dados", path: "Conteúdo > Programação > Banco de Dados", url: "programacao/modelagem.html" }
];




// 2. ESTRUTURA HTML DO CABEÇALHO 
const headerHTML = `
    <header class="top-bar">
        <div class="logo-area">
            <a href="index.html" class="logo-link">
                <img src="dados/simulab_banner.png" alt="SimuLab Logo" class="logo-image">
            </a>
        </div>
        
        <div class="search-wrapper">
            <div class="search-container">
                <input type="text" class="search-input" id="globalSearchInput" placeholder="Buscar por 'queda livre', 'matriz', 'juros' ou 'game'...">
                <button class="search-button">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <ul class="search-suggestions" id="searchSuggestions"></ul>
        </div>

        <nav class="nav-links">
            <a href="sobre.html" class="nav-link">Sobre o Projeto</a>
            <a href="destaque.html" class="nav-link">Destaque</a>
            <a href="recursos.html" class="nav-link">Recursos</a>
            <a href="materias.html" class="nav-link main-action">ACESSAR CONTEÚDO</a>
        </nav>
    </header>
`;

// 3. ESTILOS CSS SOMENTE DO CABEÇALHO E PESQUISA
const headerStyles = `
    /* ----------------------------------- */
    /* BARRA SUPERIOR DE NAVEGAÇÃO (TOP-BAR) */
    /* ----------------------------------- */
    .top-bar {
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between; 
        align-items: stretch;
        border-bottom: 1px solid #ddd;
        padding: 0 40px; 
        min-height: 70px;
    }
    
    .logo-area {
        display: flex;
        align-items: center;
    }

    .logo-link {
        text-decoration: none;
        color: #D2691E;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        padding: 15px 0;
    }

    .logo-image {
        max-height: 70px; 
        width: auto;
        object-fit: fill;
    }
    
    /* ----------------------------------- */
    /* ESTILOS DA BARRA DE PESQUISA E SUGESTÕES */
    /* ----------------------------------- */
    .search-wrapper {
        position: relative; 
        display: flex;
        align-items: center;
        flex-grow: 1;
        max-width: 400px;
        margin: 0 20px;
    }
    
    .search-container {
        display: flex;
        width: 100%;
    }

    .search-input {
        flex-grow: 1;
        padding: 10px 15px;
        border: 1px solid #ccc;
        border-right: none;
        border-radius: 5px 0 0 5px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s, box-shadow 0.3s;
    }

    .search-input:focus {
        border-color: #D2691E;
        box-shadow: 0 0 5px rgba(210, 105, 30, 0.5);
    }

    .search-button {
        padding: 10px 15px;
        background-color: #D2691E;
        color: white;
        border: 1px solid #D2691E;
        border-radius: 0 5px 5px 0;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .search-button:hover {
        background-color: #c05c18;
        border-color: #c05c18;
    }
    
    /* Lista de Sugestões */
    .search-suggestions {
        position: absolute;
        top: 100%; 
        left: 0;
        right: 0;
        background-color: white;
        border: 1px solid #D2691E;
        border-top: none;
        border-radius: 0 0 5px 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000; 
        list-style: none;
        padding: 0;
        margin: 0;
        display: none; 
    }
    
    .search-suggestions li {
        padding: 10px 15px;
        cursor: pointer;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    
    .search-suggestions li:last-child {
        border-bottom: none;
    }

    .search-suggestions li:hover {
        background-color: #ffebcc; 
        font-weight: bold;
    }
    
    .suggestion-path {
        font-size: 0.8em;
        color: #777;
        display: block;
    }
    
    /* Links de Navegação */
    .nav-links { display: flex; align-items: center; }
    .nav-link { text-decoration: none; color: #555; font-size: 14px; font-weight: bold; padding: 0 15px; transition: color 0.3s, background-color 0.3s; display: flex; align-items: center; text-transform: uppercase; height: 100%; }
    .nav-link:hover { color: #D2691E; background-color: #f0f0f0; }
    .nav-link.main-action { background-color: #D2691E; color: white; padding: 0 20px; margin-left: 20px; }
    .nav-link.main-action:hover { background-color: #c05c18; color: white; }


    /* RESPONSIVIDADE BÁSICA (SOMENTE CABEÇALHO) */
    @media (max-width: 768px) {
        .top-bar { padding: 0 20px; flex-wrap: wrap; }
        .search-wrapper { order: 3; width: 100%; margin: 10px 0 0 0; }
        .search-input { border-radius: 5px; border-right: 1px solid #ccc; }
        .search-button { border-radius: 5px; margin-left: 10px; }
        .search-container { display: block; }
        .search-suggestions { border-radius: 5px; width: 100%; margin-top: 50px; }
        .nav-link { padding: 0 10px; }
    }
`;


document.addEventListener('DOMContentLoaded', () => {

    // --- PARTE 1: INJEÇÃO DE HTML E CSS DO CABEÇALHO ---

    // 1. INJETA OS ESTILOS CSS ESPECÍFICOS DO CABEÇALHO NO <head>
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);
    
    // 2. INJETA O CABEÇALHO HTML NO INÍCIO DO <body>
    // MÉTODO CORRIGIDO: Injeta o HTML diretamente como uma string no topo do body.
    // Isso garante que os elementos existam no DOM antes de tentarmos buscá-los.
    document.body.insertAdjacentHTML('afterbegin', headerHTML);


    // --- PARTE 2: LÓGICA DE BUSCA E AUTOCOMPLETE ---
    
    // 3. REFERÊNCIAS DE ELEMENTOS (agora que foram injetados)
    const searchInput = document.getElementById('globalSearchInput');
    const suggestionsList = document.getElementById('searchSuggestions');
    // Seletor mais específico para o botão de pesquisa
    const searchButton = document.querySelector('.top-bar button.search-button'); 
    
    // BLOCO DE SEGURANÇA FINAL: Se qualquer elemento falhar, apenas reporta e para.
    if (!searchInput || !searchButton || !suggestionsList) {
        console.error("ERRO GRAVE: O cabeçalho foi injetado, mas elementos críticos de busca não foram encontrados.");
        console.error("Verifique a ortografia dos IDs e classes no headerHTML.");
        return; 
    }
    
    // 4. FUNÇÃO PRINCIPAL DE PESQUISA
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        suggestionsList.style.display = 'none'; 

        if (searchTerm.length > 1) {
            const match = SEARCH_INDEX.find(item => 
                item.term.toLowerCase().includes(searchTerm) || 
                item.url.toLowerCase().includes(searchTerm)
            );
            
            if (match) {
                window.location.href = match.url;
            } else {
                alert(`Pesquisa: "${searchTerm}" não encontrou um arquivo correspondente. Redirecionando para a página de Matérias.`);
                window.location.href = 'materias.html'; 
            }
        } else {
            alert('Por favor, digite pelo menos 2 caracteres para iniciar a busca.');
        }
    }

    // 5. LÓGICA DE AUTOCOMPLETE
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsList.innerHTML = ''; 

        if (query.length > 1) { 
            const filtered = SEARCH_INDEX.filter(item => 
                item.term.toLowerCase().includes(query) || 
                item.path.toLowerCase().includes(query) ||
                item.url.toLowerCase().includes(query)
            ).slice(0, 5); 

            if (filtered.length > 0) {
                filtered.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${item.term}</strong>
                        <span class="suggestion-path">${item.path} (Arquivo: ${item.url})</span>
                    `;
                    li.addEventListener('click', () => {
                        window.location.href = item.url;
                        searchInput.value = item.term;
                        suggestionsList.style.display = 'none';
                    });
                    suggestionsList.appendChild(li);
                });
                suggestionsList.style.display = 'block';
            } else {
                suggestionsList.style.display = 'none';
            }
        } else {
            suggestionsList.style.display = 'none';
        }
    });

    // 6. ATRIBUIÇÃO DOS EVENTOS
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 7. Ocultar sugestões quando o usuário clica fora
    document.addEventListener('click', (e) => {
        const searchWrapper = document.querySelector('.search-wrapper');
        if (searchWrapper && !searchWrapper.contains(e.target)) {
            suggestionsList.style.display = 'none';
        }
    });
});
