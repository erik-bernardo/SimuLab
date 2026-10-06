// geometria.js - Versão Final: Cores Diferentes, Detecção Aprimorada e Medidas na Tela

// --- VARIÁVEIS DE ESTADO E DOM ---
const canvas = document.getElementById('geometryCanvas');
const ctx = canvas.getContext('2d');
const mainContent = document.querySelector('.main-content');
const modeIndicator = document.getElementById('mode-indicator');
const toolButtons = document.querySelectorAll('.tool-modes .tool-button');

// Paleta de Cores para figuras (Adicionado)
const COLOR_PALETTE = [
    '#2ecc71', // Esmeralda
    '#3498db', // Azul
    '#9b59b6', // Amestista
    '#f1c40f', // Amarelo
    '#e67e22', // Laranja
    '#1abc9c', // Turquesa
    '#e74c3c'  // Vermelho
];
let colorIndex = 0;

// Estado de Visualização (GeoGebra-like)
let scale = 30; // 30 pixels por unidade
let offsetX = 0;
let offsetY = 0;
const gridStep = 1;
const MIN_SCALE = 10;
const MAX_SCALE = 100;

// Grid Snapping
let GRID_SNAP_STEP = 1; 

// Estado de Desenho
let objects = [];
let drawingMode = 'none';
let tempObject = null;
let needsRedraw = true;
let isPanning = false;

let currentObjectToLabel = null; 

// --- FUNÇÕES UTILITÁRIAS (Matemática e Conversão) ---

function round(value) {
    return Math.round(value * 100) / 100;
}

function screenToWorld(px, py) {
    const rect = canvas.getBoundingClientRect();
    const x = (px - offsetX) / scale;
    const y = (offsetY - py) / scale;
    return { x, y };
}

function worldToScreen(x, y) {
    const px = offsetX + x * scale;
    const py = offsetY - y * scale;
    return { px, py };
}

function calculateSegmentLength(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Verifica se um polígono de 3 lados (triângulo) é retângulo.
 */
function isRightTriangle(vertices) {
    if (vertices.length !== 3) {
        return { isRight: false };
    }

    // Calcula os comprimentos dos lados (sem arredondamento para precisão interna)
    const lengths = [];
    lengths.push(calculateSegmentLength(vertices[0], vertices[1]));
    lengths.push(calculateSegmentLength(vertices[1], vertices[2]));
    lengths.push(calculateSegmentLength(vertices[2], vertices[0]));
    
    // Ordena os quadrados dos comprimentos
    const squares = lengths.map(l => l * l).sort((a, b) => a - b);

    const a_sq = squares[0];
    const b_sq = squares[1];
    const c_sq = squares[2];
    
    // Tolerância para ponto flutuante
    const tolerance = 0.01; 
    const isPythagorean = Math.abs((a_sq + b_sq) - c_sq) < tolerance;

    if (isPythagorean) {
        // Encontra os comprimentos originais arredondados para exibição
        const sortedLengths = lengths.sort((a, b) => a - b);
        const a = round(sortedLengths[0]); 
        const b = round(sortedLengths[1]); 
        const c = round(sortedLengths[2]); 

        return {
            isRight: true,
            catetos: [a, b],
            hipotenusa: c,
        };
    }

    return { isRight: false };
}

/**
 * Calcula a área de um polígono a partir de suas coordenadas (Fórmula do Cadarço).
 */
function calculatePolygonArea(vertices) {
    if (vertices.length < 3) return 0;
    
    let sum1 = 0;
    let sum2 = 0;
    
    for (let i = 0; i < vertices.length; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % vertices.length];
        
        sum1 += p1.x * p2.y;
        sum2 += p1.y * p2.x;
    }
    
    return Math.abs(sum1 - sum2) / 2;
}

/**
 * Calcula o perímetro de um polígono/ polilinha, usando rótulos customizados se existirem.
 */
function calculatePolygonPerimeter(vertices, customLabels) {
    if (vertices.length < 2) return 0;
    
    let perimeter = 0;
    const isClosed = objects.some(obj => obj.vertices === vertices && obj.type === 'polygon' && obj.vertices.length >= 3);
    const numSides = isClosed ? vertices.length : vertices.length - 1;

    for (let i = 0; i < numSides; i++) {
        // Usa o label customizado se ele existir, não for undefined e for um número válido
        if (customLabels && 
            customLabels[i] !== undefined && 
            !isNaN(customLabels[i])) { 
            
            perimeter += parseFloat(customLabels[i]);
            continue;
        }

        const p1 = vertices[i];
        let p2;

        if (i === vertices.length - 1) {
            if (isClosed) {
                 p2 = vertices[0];
            } else {
                 break;
            }
        } else {
            p2 = vertices[i + 1];
        }
        
        perimeter += calculateSegmentLength(p1, p2);
    }
    return perimeter;
}

// --- FUNÇÕES DE LAYOUT E MODAL ---
// ... (resizeCanvas, showModal, closeModal, window.onclick - permanecem inalteradas)
function resizeCanvas() {
    const centerX = screenToWorld(canvas.width / 2, canvas.height / 2).x;
    const centerY = screenToWorld(canvas.width / 2, canvas.height / 2).y;

    canvas.width = mainContent.clientWidth;
    canvas.height = mainContent.clientHeight;

    offsetX = canvas.width / 2 - centerX * scale;
    offsetY = canvas.height / 2 + centerY * scale;

    needsRedraw = true;
}

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    needsRedraw = true; 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        needsRedraw = true;
    }
}


// --- FUNÇÕES DE DESENHO (Canvas) ---

function draw() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--cor-geogebra-bg').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGridLines();
    drawAxes();
    drawObjects();
}
// ... (drawGridLines, drawAxes, drawPoint - permanecem inalteradas)
function drawGridLines() {
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--cor-geogebra-grid').trim();
    ctx.lineWidth = 1;

    const stepPx = scale * gridStep;
    
    let startX = Math.floor((-offsetX) / stepPx) * stepPx;
    for (let px = startX + offsetX; px < canvas.width; px += stepPx) {
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, canvas.height);
        ctx.stroke();
    }

    let startY = Math.floor((-offsetY) / stepPx) * stepPx;
    for (let py = startY + offsetY; py < canvas.height; py += stepPx) {
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(canvas.width, py);
        ctx.stroke();
    }
}

function drawAxes() {
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--cor-geogebra-eixos').trim();
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
    ctx.stroke();
}

function drawPoint(x, y, radius, color) {
    const { px, py } = worldToScreen(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, 2 * Math.PI);
    ctx.fill();
}


function drawObjects() {
    objects.forEach(obj => {
        if (obj.type === 'polygon' || obj.type === 'polyline') {
            const isSelected = obj.selected;
            
            // Usa a cor específica do objeto (Adicionado)
            const objectColor = obj.color || 'var(--cor-secundaria)'; 
            
            // Cor do traço: Ativa se selecionado, senão a cor do objeto
            const stroke = isSelected ? 'var(--cor-ponto-ativo)' : objectColor; 
            
            // Cor do preenchimento: Mais claro se for polígono
            const fill = obj.type === 'polygon' 
                ? (isSelected ? 'rgba(255, 87, 34, 0.4)' : `${objectColor}66`) // 66 = 40% de opacidade
                : 'transparent';
            
            // Desenha a forma e os pontos
            drawPolygonShape(obj.vertices, stroke, fill, 3, obj.type === 'polyline');
            obj.vertices.forEach(v => drawPoint(v.x, v.y, 4, stroke));

            // Desenha as medidas se o objeto estiver selecionado
            if (isSelected) {
                drawSideMeasurements(obj);
            }
        }
    });

    if (tempObject && tempObject.vertices) {
        // O objeto temporário mantém o visual ativo (laranja)
        drawPolygonShape(tempObject.vertices, 'var(--cor-ponto-ativo)', 'rgba(255, 87, 34, 0.15)', 2, tempObject.type !== 'polygon');
        tempObject.vertices.forEach(v => drawPoint(v.x, v.y, 6, 'var(--cor-ponto-ativo)'));
    }
     if (tempObject && tempObject.type === 'polygon' && tempObject.step === 1 && tempObject.center) {
        drawPoint(tempObject.center.x, tempObject.center.y, 8, 'var(--cor-ponto-ativo)');
    }
}

function drawPolygonShape(vertices, strokeColor, fillColor, lineWidth, isPolyline = false) {
    if (vertices.length < 2) return;

    ctx.beginPath();
    const start = worldToScreen(vertices[0].x, vertices[0].y);
    ctx.moveTo(start.px, start.py);

    for (let i = 1; i < vertices.length; i++) {
        const point = worldToScreen(vertices[i].x, vertices[i].y);
        ctx.lineTo(point.px, point.py);
    }

    if (!isPolyline && vertices.length >= 3) {
        ctx.closePath();
    }
    
    if (fillColor && fillColor !== 'transparent' && vertices.length >= 3) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(isPolyline ? [5, 5] : []);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Desenha os comprimentos dos lados sobre a figura selecionada.
 * Corrigido para priorizar o rótulo customizado.
 */
function drawSideMeasurements(obj) {
    const vertices = obj.vertices;
    const isClosed = obj.type === 'polygon';
    const numSides = isClosed ? vertices.length : vertices.length - 1;
    const labels = obj.sideLabels || [];

    ctx.fillStyle = 'black'; // Cor do texto
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i < numSides; i++) {
        const p1 = vertices[i];
        const p2 = isClosed && i === vertices.length - 1 ? vertices[0] : vertices[i + 1];
        
        // 1. Determina o valor a ser exibido (Prioriza rótulo customizado)
        let displayLength;
        const customValue = labels[i];
        
        if (customValue !== undefined && !isNaN(customValue)) {
            displayLength = round(customValue); // Exibe o valor customizado
        } else {
            displayLength = round(calculateSegmentLength(p1, p2)); // Exibe o valor calculado
        }

        const text = `${displayLength} u`;

        // 2. Calcula o ponto médio (Mundo)
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        
        // 3. Converte para Coordenadas de Tela
        const { px, py } = worldToScreen(midX, midY);
        
        // 4. Calcula o ângulo do segmento
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        let angle = Math.atan2(dy, dx); 
        
        // Ajusta o ângulo para o texto sempre ficar legível
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            angle += Math.PI;
        }

        // Offset de 10px para mover o texto para fora da linha
        const offset = 10;
        const textPx = px - offset * Math.sin(angle);
        const textPy = py + offset * Math.cos(angle);

        ctx.save();
        ctx.translate(textPx, textPy);
        ctx.rotate(angle);
        ctx.strokeStyle = 'white'; 
        ctx.lineWidth = 3;
        ctx.strokeText(text, 0, 0);
        ctx.fillStyle = 'var(--cor-destaque)'; // Cor de destaque para a medida
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }
}

function gameLoop() {
    if (needsRedraw) {
        draw();
        needsRedraw = false;
    }
    requestAnimationFrame(gameLoop);
}

// --- FUNÇÕES DE INTERAÇÃO E MODO ---

function updateGridSnap() {
    const snapValue = parseFloat(document.getElementById('grid-snap-select').value);
    
    GRID_SNAP_STEP = snapValue === 0 ? 0.01 : snapValue; 
    
    const displayValue = snapValue === 0 ? 'Livre' : `${snapValue} u`;

    let currentModeText = modeIndicator.textContent.split('(')[0].trim();
    if (currentModeText.startsWith('Normal')) {
        currentModeText = 'Normal: Arraste para Mover';
    }

    modeIndicator.textContent = `${currentModeText} (Grade: ${displayValue})`;
    needsRedraw = true;
}
// ... (updateDrawnShapeResults, clearCanvas, updateModeButtons - permanecem inalteradas)

function updateDrawnShapeResults() {
    document.getElementById('res-area-drawn').textContent = '0';
    document.getElementById('res-perimeter-drawn').textContent = '0';

    const selectedObject = objects.find(obj => obj.selected);

    if (selectedObject) {
        const perimeter = calculatePolygonPerimeter(selectedObject.vertices, selectedObject.sideLabels);
        document.getElementById('res-perimeter-drawn').textContent = `${round(perimeter)} u`;
        
        if (selectedObject.type === 'polygon' && selectedObject.vertices.length >= 3) {
            const area = calculatePolygonArea(selectedObject.vertices);
            document.getElementById('res-area-drawn').textContent = `${round(area)} u²`;
        }
    }
}

function clearCanvas() {
    objects = [];
    tempObject = null;
    colorIndex = 0; // Reseta o índice de cor (Adicionado)
    activateDrawingMode('none'); 
    document.getElementById('res-area-drawn').textContent = '0';
    document.getElementById('res-perimeter-drawn').textContent = '0';
    needsRedraw = true;
}

function updateModeButtons() {
    toolButtons.forEach(btn => btn.classList.remove('active-mode'));
    const modeButton = document.getElementById(`mode-select-${drawingMode}`);
    if (modeButton) modeButton.classList.add('active-mode');
}

function activateDrawingMode(mode) {
    objects.forEach(obj => obj.selected = false);

    drawingMode = mode;
    tempObject = null;
    
    document.getElementById('finishPolylineButton').style.display = 'none';
    
    updateModeButtons();
    updateGridSnap();

    if (mode === 'polygon') {
        tempObject = { type: 'polygon', sides: parseInt(document.getElementById('polygon-sides').value), step: 1 };
        modeIndicator.textContent = `Polígono (${tempObject.sides}): Clique no Centro`;
    } else if (mode === 'polyline') {
        tempObject = { type: 'polyline', vertices: [] };
        modeIndicator.textContent = `Desenho Livre: Adicione Pontos`;
    } else {
        modeIndicator.textContent = `Normal: Arraste para Mover`;
        updateDrawnShapeResults(); 
    }
    needsRedraw = true;
}

function finalizePolyline() {
    const color = COLOR_PALETTE[colorIndex++ % COLOR_PALETTE.length]; // Pega a cor e avança (Adicionado)
    
    if (tempObject && tempObject.vertices.length >= 3) {
        objects.forEach(obj => obj.selected = false);
        const newObject = { type: 'polygon', vertices: tempObject.vertices, selected: true, sideLabels: [], color: color }; 
        objects.push(newObject);
        
        activateDrawingMode('none');
        updateDrawnShapeResults(); 
    } else if (tempObject && tempObject.vertices.length >= 2) {
        objects.forEach(obj => obj.selected = false);
        const newObject = { type: 'polyline', vertices: tempObject.vertices, selected: true, sideLabels: [], color: color }; 
        objects.push(newObject);
        
        activateDrawingMode('none');
        updateDrawnShapeResults(); 
    } else {
        alert("Precisa de pelo menos 2 pontos para um segmento, ou 3 para um polígono fechado.");
    }
    needsRedraw = true;
}

function findClickedObject(x, y) {
    const tolerance = 0.4;
    
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        if (obj.type === 'polygon' || obj.type === 'polyline') {
            
            for (const v of obj.vertices) {
                if (Math.pow(x - v.x, 2) + Math.pow(y - v.y, 2) < tolerance * tolerance) {
                    return obj; 
                }
            }
            
            if (obj.type === 'polygon' && obj.vertices.length >= 3) {
                const minX = Math.min(...obj.vertices.map(v => v.x));
                const maxX = Math.max(...obj.vertices.map(v => v.x));
                const minY = Math.min(...obj.vertices.map(v => v.y));
                const maxY = Math.max(...obj.vertices.map(v => v.y));

                if (x > minX && x < maxX && y > minY && y < maxY) {
                    return obj; 
                }
            }
        }
    }
    return null;
}

// --- ROTULAGEM DE LADOS (LABELING) ---
// ... (setupLabelModal e saveSideLabels permanecem inalteradas, a lógica de saveLabels já trata a modificação)

function setupLabelModal(obj) {
    currentObjectToLabel = obj;
    const container = document.getElementById('label-inputs');
    container.innerHTML = '';
    
    const vertices = obj.vertices;
    const isClosed = obj.type === 'polygon';
    const numSides = isClosed ? vertices.length : vertices.length - 1;

    if (!obj.sideLabels) obj.sideLabels = [];

    for (let i = 0; i < numSides; i++) {
        const p1 = vertices[i];
        const p2 = isClosed && i === vertices.length - 1 ? vertices[0] : vertices[i + 1];
        const defaultLength = round(calculateSegmentLength(p1, p2));

        const currentValue = obj.sideLabels[i] !== undefined && !isNaN(obj.sideLabels[i])
            ? obj.sideLabels[i] 
            : ''; 

        const html = `
            <div style="margin-bottom: 10px;">
                <label>Lado ${i + 1} (Comprimento real: ${defaultLength} u)</label>
                <input type="number" step="0.01" data-index="${i}" value="${currentValue}" placeholder="${defaultLength}" class="dataInput side-input">
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }
}

function saveSideLabels() {
    if (!currentObjectToLabel) return;

    const inputs = document.querySelectorAll('#label-inputs .side-input');
    const newLabels = [];

    inputs.forEach(input => {
        const index = parseInt(input.getAttribute('data-index'));
        const value = parseFloat(input.value);
        newLabels[index] = input.value.trim() === '' ? undefined : value; 
    });

    currentObjectToLabel.sideLabels = newLabels;
    updateDrawnShapeResults(); 
    closeModal('label-modal');
}


// --- PASSOS DE CÁLCULO ---
// ... (showCalculationSteps - permanece inalterada, pois a lógica de detecção e cálculo já está robusta)
function showCalculationSteps() {
    const selectedObject = objects.find(obj => obj.selected);
    const detailsContainer = document.getElementById('calculation-details');
    detailsContainer.innerHTML = '';

    if (!selectedObject) {
        detailsContainer.innerHTML = '<p>Selecione um polígono ou polilinha para ver os passos do cálculo. Clique em um objeto no modo "Mover/Pan".</p>';
        showModal('calculation-modal');
        return;
    }

    const vertices = selectedObject.vertices;
    const isClosed = selectedObject.type === 'polygon';
    let html = `<h4>Objeto Selecionado: ${isClosed ? 'Polígono Fechado' : 'Polilinha'} (${vertices.length} Lados)</h4>`;

    // --- DETECÇÃO DE TRIÂNGULO RETÂNGULO ---
    if (isClosed && vertices.length === 3) {
        const rightTriangleInfo = isRightTriangle(vertices);
        
        html += '<hr><h5>Detecção de Triângulo Retângulo</h5>';
        
        if (rightTriangleInfo.isRight) {
            const [cateto1, cateto2] = rightTriangleInfo.catetos;
            const hipotenusa = rightTriangleInfo.hipotenusa;
            
            html += `<p style="font-size: 1.1em; color: green; font-weight: bold;">✅ Triângulo Retângulo Detectado!</p>`;
            html += `<p>Cateto 1 (b): ${cateto1} u</p>`;
            html += `<p>Cateto 2 (c): ${cateto2} u</p>`;
            html += `<p style="color: var(--cor-destaque);">Hipotenusa (a): ${hipotenusa} u</p>`;
            html += `<p>Verificação (Teorema de Pitágoras): $b^2 + c^2 \\approx a^2$</p>`;
            html += `<p>Calculado: $${cateto1}^2 + ${cateto2}^2 = ${round(cateto1*cateto1 + cateto2*cateto2)}$</p>`;
            html += `<p>Hipotenusa²: $${hipotenusa}^2 = ${round(hipotenusa*hipotenusa)}$</p>`;
        } else {
            html += `<p style="color: orange;">❌ Não é um Triângulo Retângulo (ou Pitágoras não se aplica).</p>`;
        }
    }
    
    // --- PERÍMETRO ---
    
    const numSides = isClosed ? vertices.length : vertices.length - 1;
    let perimeterSumParts = []; 
    const perimeterValue = calculatePolygonPerimeter(vertices, selectedObject.sideLabels); 
    
    html += '<hr><h5>1. Cálculo do Perímetro (P)</h5>';
    
    for (let i = 0; i < numSides; i++) {
        const p1 = vertices[i];
        const p2 = isClosed && i === vertices.length - 1 ? vertices[0] : vertices[i + 1];
        const realLength = round(calculateSegmentLength(p1, p2));
        
        let usedLength;
        const isCustom = selectedObject.sideLabels && 
                         selectedObject.sideLabels[i] !== undefined && 
                         !isNaN(selectedObject.sideLabels[i]);

        if (isCustom) {
             usedLength = parseFloat(selectedObject.sideLabels[i]);
        } else {
             usedLength = realLength;
        }

        const labelInfo = isCustom 
                          ? ` (Customizado)` 
                          : ` (Coordenadas: ${round(p1.x)}, ${round(p1.y)} a ${round(p2.x)}, ${round(p2.y)})`;
                          
        perimeterSumParts.push(round(usedLength));
        
        html += `<p style="margin-left: 10px;">Lado ${i + 1}: ${round(usedLength)} u ${labelInfo}</p>`;
    }
    
    html += `<p>Fórmula: P = L₁ + L₂ + L₃ + ...</p>`;
    html += `<p>Valores usados na soma: P = ${perimeterSumParts.join(' + ')}</p>`;
    html += `<p style="font-size: 1.1em;">Resultado: **P = ${round(perimeterValue)} u**</p>`;
    
    // --- ÁREA ---
    if (isClosed && vertices.length >= 3) {
        html += '<hr><h5>2. Cálculo da Área (A)</h5>';
        const area = calculatePolygonArea(vertices);

        html += `<p>Método: Fórmula do Cadarço (Shoelace Algorithm)</p>`;
        html += `$$A = \\frac{1}{2} |\\sum_{i=1}^{n} (x_i y_{i+1} - x_{i+1} y_i)|$$`;
        html += `<p>Vertices (${vertices.length}): ${vertices.map(v => `(${round(v.x)}, ${round(v.y)})`).join(', ')}</p>`;
        html += `<p style="font-size: 1.1em;">Resultado: **A = ${round(area)} u²**</p>`;
    } else {
         html += '<hr><p>A Área não é calculada para polilinhas abertas ou figuras com menos de 3 lados.</p>';
    }

    detailsContainer.innerHTML = html;
    showModal('calculation-modal');
}


// --- LISTENERS E CONTROLES ---
// ... (Todos os Listeners permanecem inalterados)

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickPx = e.clientX - rect.left;
    const clickPy = e.clientY - rect.top;
    const worldCoords = screenToWorld(clickPx, clickPy);
    const x = worldCoords.x;
    const y = worldCoords.y;
    
    if (drawingMode === 'none') { 
        const clickedObject = findClickedObject(x, y);

        if (clickedObject) {
            objects.forEach(obj => obj.selected = false);
            clickedObject.selected = true;
            updateDrawnShapeResults(); 
        } else {
            isPanning = true;
            canvas.style.cursor = 'grabbing';
            
            objects.forEach(obj => obj.selected = false);
            updateDrawnShapeResults(); 
        }
        needsRedraw = true;
        return;
    }
    
    const snap = GRID_SNAP_STEP;
    const snappedX = round(Math.round(x / snap) * snap);
    const snappedY = round(Math.round(y / snap) * snap);
    
    if (drawingMode === 'polygon') {
        handlePolygonClick(snappedX, snappedY);
    } else if (drawingMode === 'polyline') {
        handlePolylineClick(snappedX, snappedY);
    }
    
    needsRedraw = true;
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); 
    const rect = canvas.getBoundingClientRect();
    const worldCoords = screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
    const clickedObject = findClickedObject(worldCoords.x, worldCoords.y);
    
    if (clickedObject) {
        objects.forEach(obj => obj.selected = false);
        clickedObject.selected = true;
        needsRedraw = true;
        updateDrawnShapeResults();
        setupLabelModal(clickedObject);
        showModal('label-modal');
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        offsetX += e.movementX;
        offsetY += e.movementY;
        needsRedraw = true;
    }
});

canvas.addEventListener('mouseup', () => {
    isPanning = false;
    canvas.style.cursor = drawingMode === 'none' ? 'grab' : 'crosshair';
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); 
    const zoomFactor = 1.1;
    const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;

    if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const mouseWorldX = screenToWorld(clientX, clientY).x;
    const mouseWorldY = screenToWorld(clientX, clientY).y;

    scale = newScale;

    offsetX = clientX - mouseWorldX * scale;
    offsetY = clientY + mouseWorldY * scale;

    needsRedraw = true;
}); 

window.addEventListener('keydown', (e) => {
    const step = 20;
    if (e.key === 'ArrowUp') offsetY += step;
    else if (e.key === 'ArrowDown') offsetY -= step;
    else if (e.key === 'ArrowLeft') offsetX += step;
    else if (e.key === 'ArrowRight') offsetX -= step;
    needsRedraw = true;
});

window.addEventListener('resize', resizeCanvas);


function handlePolygonClick(x, y) {
    if (!tempObject) return;

    if (tempObject.step === 1) {
        tempObject.center = { x, y };
        tempObject.step = 2;
        modeIndicator.textContent = `Polígono: Defina o Raio`;
    } else if (tempObject.step === 2) {
        const cx = tempObject.center.x;
        const cy = tempObject.center.y;
        const radius = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        const sides = tempObject.sides;
        
        const vertices = [];
        const initialAngle = -Math.PI / 2; 
        for (let i = 0; i < sides; i++) {
            const angle = initialAngle + i * (2 * Math.PI / sides);
            const vx = cx + radius * Math.cos(angle);
            const vy = cy + radius * Math.sin(angle);
            vertices.push({ x: round(vx), y: round(vy) });
        }

        objects.forEach(obj => obj.selected = false);
        const color = COLOR_PALETTE[colorIndex++ % COLOR_PALETTE.length]; // Pega a cor e avança (Adicionado)
        const newObject = { type: 'polygon', vertices: vertices, selected: true, sideLabels: [], color: color }; 
        objects.push(newObject);
        
        activateDrawingMode('none');
        updateDrawnShapeResults();
    }
}


function handlePolylineClick(x, y) {
    if (!tempObject || tempObject.type !== 'polyline') return;
    
    if (!tempObject.vertices) tempObject.vertices = [];
    tempObject.vertices.push({ x, y });
    
    if (tempObject.vertices.length >= 2) {
        document.getElementById('finishPolylineButton').style.display = 'inline-block';
    }
    modeIndicator.textContent = `Desenho Livre: ${tempObject.vertices.length} pontos`;
}


// --- FUNÇÃO DE CÁLCULO RÁPIDO (MINI-CALCULADORA) ---

function calculateCircle() {
    const r = parseFloat(document.getElementById('circulo-raio').value) || 0;
    const resArea = document.getElementById('res-area');
    const resPerimetro = document.getElementById('res-perimetro');

    if (r <= 0) {
        resArea.textContent = '0';
        resPerimetro.textContent = '0';
    } else {
        const area = Math.PI * r * r;
        const perimetro = 2 * Math.PI * r;
        resArea.textContent = round(area);
        resPerimetro.textContent = round(perimetro);
    }
}


// --- INICIALIZAÇÃO ---

function init() {
    document.getElementById('circulo-raio').addEventListener('input', calculateCircle);
    document.getElementById('polygon-sides').addEventListener('change', () => {
        if (drawingMode === 'polygon') activateDrawingMode('polygon');
    });
    document.getElementById('grid-snap-select').addEventListener('change', updateGridSnap);
    document.getElementById('finishPolylineButton').addEventListener('click', finalizePolyline);

    resizeCanvas();
    calculateCircle();
    updateGridSnap();
    activateDrawingMode('none');
    requestAnimationFrame(gameLoop);
}

init();
