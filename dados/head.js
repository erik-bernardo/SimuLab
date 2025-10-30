/**
 * header_loader.js
 * * Módulo para injetar o cabeçalho (top-bar) e sua lógica de pesquisa em qualquer página.
 * Deve ser incluído via <script src="header_loader.js"></script> no seu HTML.
 */

document.addEventListener('DOMContentLoaded', function() {
    // -----------------------------------
    // 1. DADOS DE SUGESTÕES DE PESQUISA (DUMMY DATA)
    // -----------------------------------
     const searchIndex = [
                // Simuladores (Matemática)
                { term: "Sim. Cálculo de Matriz", path: "Matemática > Simulador", url: "simulacoes/matriz.html" },
                { term: "Sim. Análise de Funções", path: "Matemática > Análise", url: "simulacoes/funcoes.html" },
                { term: "Sim. Juros Simples", path: "Matemática > Financeira", url: "simulacoes/juros_simples.html" },
                { term: "Sim. Juros Compostos", path: "Matemática > Financeira", url: "simulacoes/juros_compostos.html" },
                { term: "Sim. Desconto Simples", path: "Matemática > Financeira", url: "simulacoes/desconto_simples.html" },
                { term: "Sim. Custo e Venda", path: "Matemática > Financeira", url: "simulacoes/custo_venda.html" },
                { term: "Sim. Regra 50-30", path: "Matemática > Financeira", url: "simulacoes/50-30.html" },
                { term: "Sim. CET (Custo Efetivo Total)", path: "Matemática > Financeira", url: "simulacoes/cet.html" },
                { term: "Sim. Rendas e Amortização", path: "Matemática > Financeira", url: "simulacoes/rendas.html" },
                { term: "Sim. Porcentagem", path: "Matemática > Fundamentos", url: "simulacoes/porcentagem.html" },
                { term: "Sim. Probabilidade", path: "Matemática > Estatística", url: "simulacoes/probabilidade.html" },
                { term: "Sim. Análise Combinatória", path: "Matemática > Análise", url: "simulacoes/combinatoria.html" },
                { term: "Sim. Sequências Numéricas", path: "Matemática > Álgebra", url: "simulacoes/sequencias_numericas.html" },
                { term: "Sim. Conjuntos Numéricos", path: "Matemática > Fundamentos", url: "simulacoes/conjuntos_numericos.html" },
                { term: "Sim. Geometria Plana", path: "Matemática > Geometria", url: "simulacoes/geometria_plana.html" },
                { term: "Sim. Geometria Analítica", path: "Matemática > Geometria", url: "simulacoes/geo_analitica.html" },
                { term: "Sim. Arcos e Ângulos", path: "Matemática > Trigonometria", url: "simulacoes/arcos_angulos.html" },

                // Simuladores (Física)
                { term: "Sim. Queda Livre", path: "Física > Cinemática", url: "simulacoes/queda_livre.html" },
                { term: "Sim. MRU (Mov. Retilíneo Uniforme)", path: "Física > Cinemática", url: "simulacoes/mru.html" },
                { term: "Sim. MRUV (Mov. Retilíneo Uniforme Variado)", path: "Física > Cinemática", url: "simulacoes/mruv.html" },
                { term: "Sim. Gravitação Universal", path: "Física > Mecânica", url: "simulacoes/gravitacao_universal.html" },
                { term: "Sim. Conservação de Energia", path: "Física > Mecânica", url: "simulacoes/energia.html" },
                { term: "Sim. Hidrostática", path: "Física > Mecânica", url: "simulacoes/hidrostatica.html" },
                { term: "Sim. Ondas", path: "Física > Ondulatória", url: "simulacoes/ondas.html" },
                { term: "Sim. Calorimetria", path: "Física > Termologia", url: "simulacoes/calorimetria.html" },
                { term: "Sim. Dilatação Térmica", path: "Física > Termologia", url: "simulacoes/dilatacao_termica.html" },
                { term: "Sim. Escalas Termométricas", path: "Física > Termologia", url: "simulacoes/escalas_termometricas.html" },
                
                // Simuladores (Química)
                { term: "Sim. Tabela Periódica", path: "Química > Geral", url: "simulacoes/tabela_periodica.html" },
                { term: "Sim. Ligações Químicas", path: "Química > Geral", url: "simulacoes/ligacoes.html" },
                { term: "Sim. Reações Químicas", path: "Química > Geral", url: "simulacoes/reacoes.html" },
                { term: "Sim. Ácidos e Bases", path: "Química > Inorgânica", url: "simulacoes/acidos_bases.html" },
                { term: "Sim. NOX (Nº Oxidação)", path: "Química > RedOx", url: "simulacoes/nox.html" },
                { term: "Sim. Estequiometria", path: "Química > Cálculos", url: "simulacoes/estequiometria.html" },
                { term: "Sim. Soluções", path: "Química > Físico-Química", url: "simulacoes/solucoes.html" },

                // Games
                { term: "Game Flappy Blocks", path: "Jogos > Física", url: "games/flappy-blocks/index.html" },
                { term: "Game Labirinto", path: "Jogos > Matemática", url: "games/labirinto.html" },
                { term: "Game Akinator", path: "Jogos > Geral", url: "games/make-your-akinator.html" },
                
                // Outros
                { term: "Simulador IDE Virtual", path: "Programação > Testador", url: "codeTester.html" }
            ];

    // -----------------------------------
    // 2. FUNÇÕES DE BUSCA E SUGESTÃO
    // -----------------------------------
    function filterSuggestions(searchTerm) {
        const input = document.getElementById('globalSearchInput');
        const suggestionsList = document.getElementById('searchSuggestions');
        
        if (!input || !suggestionsList) return;

        suggestionsList.innerHTML = '';
        const term = searchTerm.toLowerCase().trim();

        if (term.length < 3) {
            suggestionsList.style.display = 'none';
            return;
        }

        const filtered = SEARCH_ITEMS.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.path.toLowerCase().includes(term)
        );

        if (filtered.length > 0) {
            filtered.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `${item.title}<span class="suggestion-path">${item.path}</span>`;
                li.onclick = () => window.location.href = item.link; // Redireciona ao clicar
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    }
    
    // Função principal de pesquisa (executada ao clicar no botão)
    function executeSearch() {
        const searchTerm = document.getElementById('globalSearchInput').value.trim();
        if (searchTerm) {
            // Lógica de pesquisa: pode redirecionar para uma página de resultados
            window.location.href = `exercicios.html?q=${encodeURIComponent(searchTerm)}`;
        } else {
            alert('Por favor, digite um termo para pesquisar.');
        }
    }

    // -----------------------------------
    // 3. ESTRUTURA HTML DO CABEÇALHO
    // -----------------------------------
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
                    <button class="search-button" id="globalSearchButton">
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

    // 4. INJEÇÃO DO CABEÇALHO NO INÍCIO DO BODY
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.innerHTML = headerHTML;
    document.body.prepend(headerPlaceholder.firstChild);
    
    // 5. ATRIBUIÇÃO DOS EVENTOS APÓS INJEÇÃO
    const searchInput = document.getElementById('globalSearchInput');
    const searchButton = document.getElementById('globalSearchButton');
    const suggestionsList = document.getElementById('searchSuggestions');

    if (searchInput) {
        // Escuta a digitação para filtrar sugestões
        searchInput.addEventListener('input', (e) => filterSuggestions(e.target.value));
        // Oculta sugestões quando o foco é perdido, com pequeno delay para permitir o clique
        searchInput.addEventListener('blur', () => {
             setTimeout(() => suggestionsList.style.display = 'none', 100);
        });
        // Mostra sugestões quando o campo é focado, se já houver texto
        searchInput.addEventListener('focus', (e) => {
             if (e.target.value.trim().length >= 3) filterSuggestions(e.target.value);
        });
        // Permite a pesquisa ao pressionar ENTER
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }
    
    // Escuta o clique no botão de pesquisa
    if (searchButton) {
        searchButton.addEventListener('click', executeSearch);
    }
    
    // -----------------------------------
    // 6. INJEÇÃO DOS ESTILOS CSS DO CABEÇALHO
    // -----------------------------------
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
            color: #D2691E; /* Cor Principal */
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
            font-weight: normal; /* Sobrescreve o bold do hover */
        }

        /* ----------------------------------- */
        /* LINKS DE NAVEGAÇÃO */
        /* ----------------------------------- */
        .nav-links { display: flex; align-items: center; }
        .nav-link { text-decoration: none; color: #555; font-size: 14px; font-weight: bold; padding: 0 15px; transition: color 0.3s, background-color 0.3s; display: flex; align-items: center; text-transform: uppercase; height: 100%; }
        .nav-link:hover { color: #D2691E; background-color: #f0f0f0; }
        .nav-link.main-action { background-color: #D2691E; color: white; padding: 0 20px; margin-left: 20px; }
        .nav-link.main-action:hover { background-color: #c05c18; color: white; }

        /* RESPONSIVIDADE BÁSICA */
        @media (max-width: 768px) {
            .top-bar { padding: 0 20px; flex-wrap: wrap; }
            .search-wrapper { order: 3; width: 100%; margin: 10px 0 0 0; }
            .search-input { border-radius: 5px; border-right: 1px solid #ccc; }
            .search-button { border-radius: 5px; margin-left: 10px; }
            .search-container { display: block; }
            .search-suggestions { border-radius: 5px; width: 100%; margin-top: 50px; }
            .nav-link { padding: 0 10px; }
            /* Se for necessário, pode ocultar alguns links para telas pequenas */
            .nav-links { display: none; } 
        }
    `;

    // Injeta os estilos no cabeçalho do documento
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);
});
