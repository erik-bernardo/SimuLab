/**
 * juros_compostos.js
 * Implementa o simulador/exercício de Juros Compostos em um pop-up/modal.
 */

// 1. ESTRUTURA HTML DO POP-UP
const SIMULATOR_HTML = `
    <div id="compoundInterestModal" class="simulator-modal">
        <div class="modal-content">
            <span class="close-button" id="closeCompoundInterestModal">&times;</span>
            <h2>Exercício - Juros Compostos</h2>
            
            <div class="input-group">
                <label for="capital">Capital Inicial (C - R$):</label>
                <input type="number" id="capital" value="1000" min="0.01" step="any">
            </div>
            
            <div class="input-group">
                <label for="rate">Taxa de Juros Anual (i - %):</label>
                <input type="number" id="rate" value="10" min="0.01" step="any">
            </div>
            
            <div class="input-group">
                <label for="time">Tempo (t - Anos):</label>
                <input type="number" id="time" value="5" min="1" step="1">
            </div>

            <div class="input-group">
                <label for="frequency">Frequência de Capitalização (n):</label>
                <select id="frequency">
                    <option value="12">Mensal (12 vezes/ano)</option>
                    <option value="4">Trimestral (4 vezes/ano)</option>
                    <option value="2">Semestral (2 vezes/ano)</option>
                    <option value="1">Anual (1 vez/ano)</option>
                </select>
            </div>
            
            <button id="calculateCompoundInterest" class="calc-button">Calcular Montante (M)</button>

            <div class="results">
                <h3>Resultados</h3>
                <p>Montante Final (M): <span id="montanteFinal">R$ 0,00</span></p>
                <p>Juros Totais (J): <span id="jurosTotais">R$ 0,00</span></p>
                <p class="formula-info">Fórmula: M = C * (1 + i/n)<sup>n⋅t</sup></p>
            </div>
        </div>
    </div>
`;

// 2. ESTILOS CSS DO POP-UP
const SIMULATOR_STYLES = `
    /* Estilos do Modal/Pop-up */
    .simulator-modal {
        display: none; /* Começa escondido */
        position: fixed;
        z-index: 1001; 
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.6); /* Fundo semi-transparente */
    }

    .modal-content {
        background-color: #fff;
        margin: 5% auto; /* 5% do topo e centralizado */
        padding: 40px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        position: relative;
    }

    .close-button {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        padding-left: 10px;
    }

    .close-button:hover,
    .close-button:focus {
        color: #D2691E; /* Cor principal */
        text-decoration: none;
        cursor: pointer;
    }

    /* Estilos dos Campos de Input e Botão */
    .modal-content h2 {
        color: #D2691E;
        text-align: center;
        margin-bottom: 25px;
    }
    
    .input-group {
        margin-bottom: 15px;
        text-align: left;
    }

    .input-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .input-group input, .input-group select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box; 
    }

    .calc-button {
        background-color: #D2691E;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
        margin-top: 20px;
        transition: background-color 0.3s;
    }

    .calc-button:hover {
        background-color: #c05c18;
    }

    /* Estilos dos Resultados */
    .results {
        margin-top: 30px;
        padding: 15px;
        border-top: 2px solid #D2691E;
        text-align: left;
    }

    .results h3 {
        color: #555;
        margin-top: 0;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 5px;
    }

    .results p {
        font-size: 1.1em;
        margin: 10px 0;
    }

    #montanteFinal, #jurosTotais {
        font-weight: bold;
        color: #008000; /* Verde para destaque financeiro */
    }
    .formula-info {
        font-size: 0.9em;
        color: #888;
        text-align: center;
        margin-top: 15px;
    }
`;

document.addEventListener('DOMContentLoaded', () => {
    // 3. INJEÇÃO DE HTML E CSS
    
    // Injeta os estilos CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = SIMULATOR_STYLES;
    document.head.appendChild(styleSheet);
    
    // Injeta o HTML do modal no final do body
    document.body.insertAdjacentHTML('beforeend', SIMULATOR_HTML);

    // 4. REFERÊNCIAS DE ELEMENTOS APÓS A INJEÇÃO
    const modal = document.getElementById('compoundInterestModal');
    const closeButton = document.getElementById('closeCompoundInterestModal');
    const calcButton = document.getElementById('calculateCompoundInterest');
    
    const capitalInput = document.getElementById('capital');
    const rateInput = document.getElementById('rate');
    const timeInput = document.getElementById('time');
    const frequencySelect = document.getElementById('frequency');
    
    const montanteFinalSpan = document.getElementById('montanteFinal');
    const jurosTotaisSpan = document.getElementById('jurosTotais');
    
    // 5. LÓGICA DE CÁLCULO
    function calculateCompoundInterest() {
        const C = parseFloat(capitalInput.value); // Capital
        const i_annual = parseFloat(rateInput.value) / 100; // Taxa anual (decimal)
        const t = parseFloat(timeInput.value); // Tempo em anos
        const n = parseInt(frequencySelect.value); // Frequência de capitalização por ano
        
        // Validação básica
        if (isNaN(C) || isNaN(i_annual) || isNaN(t) || C <= 0 || i_annual <= 0 || t <= 0) {
            alert("Por favor, preencha todos os campos com valores positivos.");
            return;
        }

        // Fórmula de Juros Compostos: M = C * (1 + i/n)^(n*t)
        const i_periodic = i_annual / n;
        const t_periods = t * n;

        // Cálculo do Montante (M)
        const M = C * Math.pow((1 + i_periodic), t_periods);
        
        // Cálculo dos Juros (J)
        const J = M - C;

        // Função de formatação para moeda brasileira (R$ 1.000,00)
        const formatCurrency = (value) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        // Exibição dos resultados
        montanteFinalSpan.textContent = formatCurrency(M);
        jurosTotaisSpan.textContent = formatCurrency(J);
    }
    
    // 6. LÓGICA DE INTERAÇÃO DO MODAL
    
    // Faz o modal aparecer assim que o script carrega
    modal.style.display = 'block';

    // Fecha o modal ao clicar no 'x'
    closeButton.onclick = function() {
        modal.style.display = "none";
        // Opcional: Redirecionar para a página anterior (ou index.html)
        // window.history.back();
    }

    // Fecha o modal se o usuário clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            // Opcional: Redirecionar
            // window.history.back(); 
        }
    }
    
    // 7. ATRIBUIÇÃO DE EVENTOS E INICIALIZAÇÃO
    calcButton.addEventListener('click', calculateCompoundInterest);
    
    // Realiza o primeiro cálculo ao carregar (com os valores padrão)
    calculateCompoundInterest();
});
