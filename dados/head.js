/**
 * header_loader.js
 * * Módulo para injetar o cabeçalho (top-bar), seus estilos e a lógica 
 * de pesquisa/autocomplete em qualquer página HTML.
 */

// 1. DADOS DE SUGESTÕES DE PESQUISA (O índice completo)
const SEARCH_INDEX = [
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


document.addEventListener('DOMContentLoaded', () => {

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

    // 3. INJEÇÃO DO CABEÇALHO NO INÍCIO DO BODY
    // Cria um elemento temporário para converter a string HTML em um nó DOM
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.innerHTML = headerHTML;
    // Adiciona o cabeçalho (o primeiro filho do temporário) no início do body
    document.body.prepend(headerPlaceholder.firstChild);

    // 4. REFERÊNCIAS E FUNÇÕES DE BUSCA
    const searchInput = document.getElementById('globalSearchInput');
    const searchButton = document.getElementById('globalSearchButton');
    const suggestionsList = document.getElementById('searchSuggestions');
    
    // Função para executar a busca (no clique ou Enter)
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        suggestionsList.style.display = 'none'; 

        if (searchTerm.length > 1) {
            // Tenta encontrar a primeira correspondência exata e redireciona
            const match = SEARCH_INDEX.find(item => 
                item.term.toLowerCase().includes(searchTerm) || 
                item.url.toLowerCase().includes(searchTerm)
            );
            
            if (match) {
                window.location.href = match.url;
            } else {
                console.log(`Pesquisa: "${searchTerm}" não encontrou um arquivo correspondente. Redirecionando para a página de Matérias.`);
                window.location.href = 'materias.html'; 
            }
        } else {
            console.log('Por favor, digite pelo menos 2 caracteres para iniciar a busca.');
        }
    }
    
    // Lógica de Autocomplete (Sugestões)
    const handleInput = () => {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsList.innerHTML = ''; 

        if (query.length > 1) {
            const filtered = SEARCH_INDEX.filter(item => 
                item.term.toLowerCase().includes(query) || 
                item.path.toLowerCase().includes(query) ||
                item.url.toLowerCase().includes(query)
            ).slice(0, 5); // Limita a 5 sugestões

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
    };
    
    // 5. ATRIBUIÇÃO DOS EVENTOS
    searchInput.addEventListener('input', handleInput);
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Ocultar sugestões quando o usuário clica fora
    document.addEventListener('click', (e) => {
        const searchWrapper = document.querySelector('.search-wrapper');
        if (searchWrapper && !searchWrapper.contains(e.target)) {
            suggestionsList.style.display = 'none';
        }
    });

    // -----------------------------------
    // 6. INJEÇÃO DOS ESTILOS CSS
    // -----------------------------------
    const allStyles = `
        /* Cores: #D2691E (Principal), #f8f8f8 (Fundo) */
        
        /* ESTILOS GERAIS */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
            color: #333;
        }

        /* BARRA SUPERIOR DE NAVEGAÇÃO (TOP-BAR) */
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
        
        /* ESTILOS DA BARRA DE PESQUISA E SUGESTÕES */
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
            font-weight: normal;
        }

        /* LINKS DE NAVEGAÇÃO */
        .nav-links { display: flex; align-items: center; }
        .nav-link { text-decoration: none; color: #555; font-size: 14px; font-weight: bold; padding: 0 15px; transition: color 0.3s, background-color 0.3s; display: flex; align-items: center; text-transform: uppercase; height: 100%; }
        .nav-link:hover { color: #D2691E; background-color: #f0f0f0; }
        .nav-link.main-action { background-color: #D2691E; color: white; padding: 0 20px; margin-left: 20px; }
        .nav-link.main-action:hover { background-color: #c05c18; color: white; }

        /* ESTILOS DE OUTRAS SEÇÕES (landing page) */
        .hero-section { background-color: #f0f0f0; padding: 80px 40px; text-align: center; }
        .hero-section h2 { font-size: 2.5em; color: #D2691E; margin-bottom: 10px; }
        .hero-section p { font-size: 1.2em; color: #555; max-width: 700px; margin: 0 auto 30px; }
        .hero-button { background-color: #D2691E; color: white; text-decoration: none; font-weight: bold; padding: 12px 30px; border-radius: 5px; font-size: 1.1em; transition: background-color 0.3s; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
        .hero-button:hover { background-color: #c05c18; }
        .feature-section { padding: 60px 40px; display: flex; justify-content: space-around; align-items: center; gap: 40px; max-width: 1200px; margin: 0 auto; }
        .feature-text { flex: 1; text-align: left; }
        .feature-text h3 { color: #D2691E; font-size: 2em; margin-bottom: 15px; }
        .feature-image-container { flex: 1; max-width: 500px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .feature-image-container img { width: 100%; height: auto; display: block; }
        .info-section { background-color: white; padding: 60px 40px; text-align: center; border-top: 1px solid #eee; }
        .info-section h3 { color: #333; font-size: 1.8em; margin-bottom: 30px; }
        .info-grid { display: flex; justify-content: center; gap: 30px; }
        .info-card { flex-basis: 30%; padding: 20px; border-radius: 8px; border: 1px solid #ddd; transition: box-shadow 0.3s; }
        .info-card:hover { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
        .info-card i { font-size: 2em; color: #D2691E; margin-bottom: 10px; }
        .info-card h4 { color: #333; margin-top: 0; }
        footer { background-color: #333; color: white; text-align: center; padding: 20px 0; font-size: 0.9em; }


        /* RESPONSIVIDADE BÁSICA */
        @media (max-width: 768px) {
            .top-bar { padding: 0 20px; flex-wrap: wrap; }
            .search-wrapper { order: 3; width: 100%; margin: 10px 0 0 0; }
            .search-input { border-radius: 5px; border-right: 1px solid #ccc; }
            .search-button { border-radius: 5px; margin-left: 10px; }
            .search-container { display: block; }
            .search-suggestions { border-radius: 5px; width: 100%; margin-top: 50px; }
            .nav-link { padding: 0 10px; }
            .feature-section { flex-direction: column; text-align: center; }
            .feature-text { text-align: center; }
            .info-grid { flex-direction: column; }
            .info-card { flex-basis: 100%; }
        }
    `;

    // Injeta os estilos no cabeçalho do documento
    const styleSheet = document.createElement("style");
    styleSheet.innerText = allStyles;
    document.head.appendChild(styleSheet);
});
