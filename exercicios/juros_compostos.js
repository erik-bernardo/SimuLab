/**
 * juros_compostos.js
 * * Módulo JavaScript para a Atividade de Cálculo de Juros Compostos.
 * Cria e gerencia um modal (pop-up) com uma calculadora interativa.
 */

// 1. Função principal para abrir a atividade
function openJurosCompostosActivity() {
    // Verifica se o modal já existe
    let modal = document.getElementById('jurosCompostosModal');

    if (!modal) {
        // Se não existir, cria o HTML do modal e injeta no body
        modal = document.createElement('div');
        modal.id = 'jurosCompostosModal';
        modal.classList.add('juros-modal-overlay');
        modal.innerHTML = `
            <div class="juros-modal-content">
                <span class="juros-close-btn" onclick="closeJurosCompostosActivity()">&times;</span>
                <div class="juros-calculator">
                    <h2><i class="fas fa-calculator"></i> Calculadora de Juros Compostos</h2>
                    <p>Use esta ferramenta para simular o crescimento de um investimento.</p>
                    
                    <form id="jurosCompostosForm">
                        <div class="juros-form-group">
                            <label for="principal">Capital Inicial (P):</label>
                            <input type="number" id="principal" value="1000" min="0.01" step="0.01" required>
                        </div>
                        
                        <div class="juros-form-group">
                            <label for="rate">Taxa de Juros (i) Anual (%):</label>
                            <input type="number" id="rate" value="5" min="0.01" step="0.01" required>
                        </div>
                        
                        <div class="juros-form-group">
                            <label for="time">Período (t) em Anos:</label>
                            <input type="number" id="time" value="3" min="1" step="1" required>
                        </div>
                        
                        <button type="submit" class="juros-calculate-btn"><i class="fas fa-play"></i> Calcular Montante</button>
                    </form>
                    
                    <div id="jurosCompostosResult" class="juros-result-area">
                        </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Adiciona o listener para o formulário após a criação
        document.getElementById('jurosCompostosForm').addEventListener('submit', calculateCompoundInterest);
    }
    
    // Mostra o modal
    modal.style.display = 'flex';
}

// 2. Função para fechar a atividade
function closeJurosCompostosActivity() {
    const modal = document.getElementById('jurosCompostosModal');
    if (modal) {
        modal.style.display = 'none';
        // Opcional: Limpar resultados ao fechar
        document.getElementById('jurosCompostosResult').innerHTML = '';
    }
}

// 3. Lógica do Cálculo
function calculateCompoundInterest(event) {
    event.preventDefault();

    const principal = parseFloat(document.getElementById('principal').value);
    // Taxa de juros é dividida por 100 para ser usada na fórmula
    const rate = parseFloat(document.getElementById('rate').value) / 100; 
    const time = parseInt(document.getElementById('time').value);
    const resultArea = document.getElementById('jurosCompostosResult');

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
        resultArea.innerHTML = '<p class="juros-error"><i class="fas fa-exclamation-triangle"></i> Por favor, insira valores válidos e positivos.</p>';
        return;
    }

    // Fórmula do Juros Composto: M = P * (1 + i)^t
    const montante = principal * Math.pow((1 + rate), time);
    const juros = montante - principal;

    // Formatação para moeda (ajuste conforme a sua localização)
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    resultArea.innerHTML = `
        <h3><i class="fas fa-chart-line"></i> Resultado da Simulação</h3>
        <p>Capital Inicial (P): <strong>${formatter.format(principal)}</strong></p>
        <p>Taxa (i): <strong>${(rate * 100).toFixed(2)}% a.a.</strong></p>
        <p>Período (t): <strong>${time} anos</strong></p>
        <hr>
        <div class="juros-summary">
            <p>Montante Final (M): <strong>${formatter.format(montante)}</strong></p>
            <p>Total de Juros Ganhos: <strong>${formatter.format(juros)}</strong></p>
        </div>
    `;
}

// 4. Estilos básicos para o Modal (melhor seria ter no CSS do HTML, mas colocamos aqui por simplicidade)
const styles = `
.juros-modal-overlay {
    display: none;
    position: fixed;
    z-index: 2000; /* Z-index alto para garantir que fique por cima de tudo */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.6);
    justify-content: center;
    align-items: center;
}

.juros-modal-content {
    background-color: #fefefe;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    width: 90%;
    max-width: 500px;
    position: relative;
    animation: fadeIn 0.3s;
}

.juros-close-btn {
    color: #aaa;
    float: right;
    font-size: 38px;
    font-weight: bold;
    position: absolute;
    top: 5px;
    right: 15px;
    cursor: pointer;
}

.juros-close-btn:hover, .juros-close-btn:focus {
    color: #333;
    text-decoration: none;
}

.juros-calculator h2 {
    color: #D2691E;
    border-bottom: 2px solid #D2691E;
    padding-bottom: 10px;
    margin-bottom: 20px;
    text-align: center;
}

.juros-form-group {
    margin-bottom: 15px;
}

.juros-form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.juros-form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.juros-calculate-btn {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1em;
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.juros-calculate-btn:hover {
    background-color: #0056b3;
}

.juros-result-area {
    margin-top: 20px;
    padding: 15px;
    background-color: #f0f8ff;
    border: 1px solid #007bff;
    border-radius: 6px;
}

.juros-result-area h3 {
    color: #007bff;
    margin-top: 0;
    margin-bottom: 10px;
}

.juros-summary {
    font-size: 1.1em;
    font-weight: bold;
    color: #D2691E;
}

.juros-error {
    color: #F44336;
    font-weight: bold;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}
`;

// Injeta os estilos no cabeçalho do documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
