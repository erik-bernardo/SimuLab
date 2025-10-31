// ... (Tudo igual até a linha 320)

document.addEventListener('DOMContentLoaded', () => {

    // --- PARTE 1: INJEÇÃO DE HTML E CSS DO CABEÇALHO ---

    // 1. INJETA OS ESTILOS CSS ESPECÍFICOS DO CABEÇALHO NO <head>
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);
    
    // 2. INJETA O CABEÇALHO HTML NO INÍCIO DO <body>
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.innerHTML = headerHTML;
    document.body.prepend(headerPlaceholder.firstChild);


    // --- PARTE 2: LÓGICA DE BUSCA E AUTOCOMPLETE ---

    // 3. REFERÊNCIAS DE ELEMENTOS (agora que foram injetados)
    const searchInput = document.getElementById('globalSearchInput');
    const suggestionsList = document.getElementById('searchSuggestions');
    // Seletor mais específico para o botão de pesquisa
    const searchButton = document.querySelector('.top-bar button.search-button'); 
    
    // BLOCO DE SEGURANÇA CONTRA ERROS DE NULL:
    // Se qualquer um dos elementos não for encontrado, para a execução do script aqui.
    if (!searchInput || !searchButton || !suggestionsList) {
        console.error("ERRO: Elementos de busca do cabeçalho não foram encontrados.");
        // LINHA CRÍTICA PARA DEPURAR (deve ser a linha ~330 do seu arquivo)
        console.error("Status de Elementos: Input:", !!searchInput, "| Button:", !!searchButton, "| Suggestions:", !!suggestionsList);
        return; 
    }
    
    // ... (O restante do código de busca e eventos)
