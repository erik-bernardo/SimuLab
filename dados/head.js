/**
 * head.js
 * Cabeçalho do SimuLab com logo, barra de busca e navegação.
 */

const SEARCH_INDEX = [
    // Simuladores (Matemática)
    { term: "Sim. Cálculo de Matriz", path: "Matemática > Simulador", url: "simulacoes/matriz.html" },
    { term: "Sim. Análise de Funções", path: "Matemática > Análise", url: "simulacoes/funcoes.html" },
    { term: "Sim. Juros Simples", path: "Matemática > Financeira", url: "simulacoes/juros_simples.html" },
    { term: "Sim. Juros Compostos", path: "Matemática > Financeira", url: "simulacoes/juros_compostos.html" },
    { term: "Sim. Sistema Linear", path: "Matemática > Sistemas", url: "simulacoes/sistem-linear.html" },
    // ... (adicione o resto da lista conforme seu arquivo original)
];

// --- HTML do cabeçalho ---
const headerHTML = `
<header class="top-bar">
    <div class="logo-area">
        <a href="index.html" class="logo-link">
            <img src="" alt="SimuLab Logo" class="logo-image" id="logoImage">
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

// --- CSS do cabeçalho ---
const headerStyles = `
.top-bar {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    border-bottom: 1px solid #ddd;
    padding: 0 40px;
    min-height: 70px;
}
.logo-area { display: flex; align-items: center; }
.logo-link { display: flex; align-items: center; padding: 15px 0; text-decoration: none; color: #D2691E; font-weight: bold; }
.logo-image { max-height: 70px; width: auto; object-fit: fill; }
.search-wrapper { position: relative; display: flex; align-items: center; flex-grow: 1; max-width: 400px; margin: 0 20px; }
.search-container { display: flex; width: 100%; }
.search-input { flex-grow: 1; padding: 10px 15px; border: 1px solid #ccc; border-right: none; border-radius: 5px 0 0 5px; font-size: 14px; outline: none; transition: border-color 0.3s, box-shadow 0.3s; }
.search-input:focus { border-color: #D2691E; box-shadow: 0 0 5px rgba(210,105,30,0.5); }
.search-button { padding: 10px 15px; background-color: #D2691E; color: white; border: 1px solid #D2691E; border-radius: 0 5px 5px 0; cursor: pointer; }
.search-button:hover { background-color: #c05c18; border-color: #c05c18; }
.search-suggestions { position: absolute; top: 100%; left: 0; right: 0; background-color: white; border: 1px solid #D2691E; border-top: none; border-radius: 0 0 5px 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-height: 200px; overflow-y: auto; z-index: 1000; list-style: none; padding: 0; margin: 0; display: none; }
.search-suggestions li { padding: 10px 15px; cursor: pointer; text-align: left; border-bottom: 1px solid #eee; }
.search-suggestions li:last-child { border-bottom: none; }
.search-suggestions li:hover { background-color: #ffebcc; font-weight: bold; }
.suggestion-path { font-size: 0.8em; color: #777; display: block; }
.nav-links { display: flex; align-items: center; }
.nav-link { text-decoration: none; color: #555; font-size: 14px; font-weight: bold; padding: 0 15px; display: flex; align-items: center; text-transform: uppercase; height: 100%; }
.nav-link:hover { color: #D2691E; background-color: #f0f0f0; }
.nav-link.main-action { background-color: #D2691E; color: white; padding: 0 20px; margin-left: 20px; }
.nav-link.main-action:hover { background-color: #c05c18; color: white; }
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
    // Injetar CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = headerStyles;
    document.head.appendChild(styleSheet);

    // Injetar HTML
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Corrigir caminho do logo relativo ao head.js
    const scriptUrl = document.currentScript.src;
    const scriptFolder = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
    const logoImage = document.getElementById('logoImage');
    logoImage.src = scriptFolder + '/../dados/simulab_banner.png';

    // --- LÓGICA DE BUSCA ---
    const searchInput = document.getElementById('globalSearchInput');
    const suggestionsList = document.getElementById('searchSuggestions');
    const searchButton = document.querySelector('.top-bar button.search-button');

    if (!searchInput || !searchButton || !suggestionsList) {
        console.error("Elementos de busca não encontrados.");
        return;
    }

    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        suggestionsList.style.display = 'none';
        if (searchTerm.length > 1) {
            const match = SEARCH_INDEX.find(item => item.term.toLowerCase().includes(searchTerm) || item.url.toLowerCase().includes(searchTerm));
            if (match) window.location.href = match.url;
            else window.location.href = 'materias.html';
        } else alert('Digite pelo menos 2 caracteres.');
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        suggestionsList.innerHTML = '';
        if (query.length > 1) {
            const filtered = SEARCH_INDEX.filter(item => item.term.toLowerCase().includes(query) || item.path.toLowerCase().includes(query) || item.url.toLowerCase().includes(query)).slice(0,5);
            if (filtered.length) {
                filtered.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${item.term}</strong><span class="suggestion-path">${item.path} (Arquivo: ${item.url})</span>`;
                    li.addEventListener('click', () => { window.location.href = item.url; searchInput.value = item.term; suggestionsList.style.display = 'none'; });
                    suggestionsList.appendChild(li);
                });
                suggestionsList.style.display = 'block';
            } else suggestionsList.style.display = 'none';
        } else suggestionsList.style.display = 'none';
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', e => { if(e.key==='Enter') performSearch(); });
    document.addEventListener('click', e => { if (!document.querySelector('.search-wrapper').contains(e.target)) suggestionsList.style.display = 'none'; });
});
