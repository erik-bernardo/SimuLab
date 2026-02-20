/**
 * head.js - Versão 4.0 (Busca Expandida & Navegação Nítida)
 * Foco exclusivo em usabilidade e busca, sem elementos de login.
 */

// 1. ÍNDICE DE PESQUISA (Mantenha sua lista original aqui)
const SEARCH_INDEX = [
    { term: "Sim. Cálculo de Matriz", path: "Simulador > Matemática", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/matriz.html" },
    { term: "Sim. Tabela Periódica", path: "Simulador > Química", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/tabela_periodica.html" },
    { term: "Sim. Queda Livre", path: "Simulador > Física", url: "https://erik-bernardo.github.io/SimuLab/simulacoes/queda_livre.html" },
    // ... adicione os demais itens aqui
];

// 2. HTML DO CABEÇALHO (Limpo e Direto)
const headerHTML = `
    <header class="top-bar">
        <div class="header-content">
            <div class="logo-area">
                <a href="https://erik-bernardo.github.io/SimuLab/index.html">
                    <img src="https://erik-bernardo.github.io/SimuLab/dados/simulab_banner.png" alt="SimuLab" class="logo-img">
                </a>
            </div>
            
            <div class="search-wrapper">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="globalSearchInput" placeholder="O que você quer pesquisar no SimuLab?">
                    <kbd class="search-shortcut">ENTER</kbd>
                </div>
                <ul class="search-results" id="searchSuggestions"></ul>
            </div>

            <nav class="nav-menu">
                <a href="https://erik-bernardo.github.io/SimuLab/sobre.html" class="nav-link-bold">SOBRE</a>
                <a href="https://erik-bernardo.github.io/SimuLab/recursos.html" class="nav-link-bold">RECURSOS</a>
            </nav>
        </div>
    </header>
    <div class="header-spacer"></div>
`;

// 3. CSS (Foco em Visibilidade e Contraste)
const headerStyles = `
    :root {
        --primary-color: #d96c2c;
        --text-dark: #1a1a1a;
        --text-gray: #555;
        --shadow-strong: 0 4px 15px rgba(0,0,0,0.1);
        --transition: all 0.2s ease-in-out;
    }

    .top-bar {
        background: #ffffff;
        box-shadow: var(--shadow-strong);
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 10000;
        height: 90px; /* Aumentado para dar mais presença */
        display: flex;
        align-items: center;
    }

    .header-content {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
    }

    .logo-img { height: 50px; }

    /* CAMPO DE BUSCA EXPANDIDO */
    .search-wrapper { 
        flex: 1; 
        max-width: 700px; /* Aumentado significativamente */
        position: relative; 
    }
    
    .search-box {
        background: #f4f4f4;
        border-radius: 15px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        border: 2px solid #eee;
        transition: var(--transition);
    }

    .search-box:focus-within {
        background: white;
        border-color: var(--primary-color);
        box-shadow: 0 0 12px rgba(217,108,44,0.15);
    }

    .search-icon { color: var(--primary-color); font-size: 18px; margin-right: 15px; }
    
    .search-box input {
        border: none;
        background: transparent;
        padding: 15px 0;
        width: 100%;
        outline: none;
        font-size: 16px;
        color: var(--text-dark);
        font-weight: 500;
    }

    .search-shortcut {
        background: #e0e0e0;
        padding: 2px 8px;
        border-radius: 5px;
        font-size: 10px;
        color: #888;
        font-weight: bold;
        margin-left: 10px;
    }

    .search-results {
        position: absolute;
        top: calc(100% + 8px);
        left: 0; right: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        list-style: none;
        padding: 10px;
        display: none;
        border: 1px solid #eee;
    }

    .search-results li {
        padding: 12px 18px;
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        flex-direction: column;
    }

    .search-results li:hover { background: #fff5f0; }
    .search-results li strong { color: var(--text-dark); font-size: 15px; }
    .search-results li span { font-size: 11px; color: var(--primary-color); text-transform: uppercase; font-weight: 700; }

    /* BOTÕES SOBRE E RECURSOS MAIS NÍTIDOS */
    .nav-menu { display: flex; align-items: center; gap: 35px; }
    
    .nav-link-bold {
        text-decoration: none;
        color: var(--text-dark);
        font-size: 15px;
        font-weight: 800; /* Extra bold para nitidez */
        letter-spacing: 1px;
        transition: var(--transition);
        position: relative;
    }

    .nav-link-bold:hover { color: var(--primary-color); }
    
    /* Linha decorativa no hover */
    .nav-link-bold::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -5px;
        left: 0;
        background-color: var(--primary-color);
        transition: var(--transition);
    }

    .nav-link-bold:hover::after { width: 100%; }

    .header-spacer { height: 90px; }

    @media (max-width: 850px) {
        .search-wrapper { max-width: 100%; }
        .nav-menu { display: none; }
    }
`;

document.addEventListener('DOMContentLoaded', () => {
    const styleTag = document.createElement("style");
    styleTag.innerText = headerStyles;
    document.head.appendChild(styleTag);
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    const input = document.getElementById('globalSearchInput');
    const list = document.getElementById('searchSuggestions');

    function handleSearch() {
        const query = input.value.toLowerCase().trim();
        if (query.length < 2) return;
        const match = SEARCH_INDEX.find(i => i.term.toLowerCase().includes(query));
        if (match) window.location.href = match.url;
    }

    input.addEventListener('input', () => {
        const val = input.value.toLowerCase().trim();
        list.innerHTML = '';
        if (val.length > 1) {
            const matches = SEARCH_INDEX.filter(i => i.term.toLowerCase().includes(val)).slice(0, 6);
            if (matches.length > 0) {
                matches.forEach(m => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${m.path}</span><strong>${m.term}</strong>`;
                    li.onclick = () => window.location.href = m.url;
                    list.appendChild(li);
                });
                list.style.display = 'block';
            } else { list.style.display = 'none'; }
        } else { list.style.display = 'none'; }
    });

    input.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleSearch(); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.search-wrapper')) list.style.display = 'none'; });
});
