/* Paleta de Cores e Fontes - Inspirado na imagem */
:root {
    --color-dark-bg: #221f30; /* Fundo noturno escuro */
    --color-mid-bg: #3c3850; /* Tons médios para colinas */
    --color-light-bg: #5a557a; /* Tons mais claros */
    --color-card-bg: #e0e0d0; /* Fundo da carta (pergaminho/claro) */
    --color-card-text: #302a40; /* Texto da carta (preto-azulado) */
    --color-accent-red: #d14a4a; /* Vermelho para destaque/cabelo do ícone */
    --color-accent-gold: #e5b045; /* Dourado para detalhes e ícones */
    --color-feedback-correct: #4CAF50;
    --color-feedback-incorrect: #f44336;

    --font-primary: 'Roboto', sans-serif;
    --font-cinzel: 'Cinzel', serif;
}

body {
    margin: 0;
    overflow: hidden; 
    font-family: var(--font-primary);
    color: var(--color-card-text);
}

/* --- ESTILOS DE FUNDO (CENÁRIO NOTURNO) --- */
.game-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, var(--color-dark-bg) 0%, var(--color-mid-bg) 100%);
    overflow: hidden;
    z-index: -1; 
}

.moon {
    position: absolute;
    top: 5%;
    right: 5%;
    width: 80px;
    height: 80px;
    background-color: #f0f0c0;
    border-radius: 50%;
    box-shadow: 0 0 20px #f0f0c080;
}

.hills {
    position: absolute;
    bottom: 0;
    width: 150vw;
    height: 200px;
    background-color: var(--color-mid-bg);
    border-radius: 50% 50% 0 0;
}
.left-hill {
    left: -50%;
    transform: translateX(20%);
    background-color: var(--color-dark-bg);
}
.right-hill {
    right: -50%;
    transform: translateX(-20%);
    background-color: var(--color-light-bg);
}

.stars {
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
    box-shadow: 
        10px 10px 0 0 #fff, 50px 80px 0 0 #fff, 120px 30px 0 0 #fff, 200px 90px 0 0 #fff, 250px 10px 0 0 #fff, 
        300px 60px 0 0 #fff, 380px 20px 0 0 #fff, 450px 70px 0 0 #fff, 500px 40px 0 0 #fff, 600px 80px 0 0 #fff, 
        700px 10px 0 0 #fff, 800px 50px 0 0 #fff; 
    animation: twinkle 10s infinite alternate;
}

@keyframes twinkle {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
}

/* --- CONTEÚDO PRINCIPAL (GAME CONTAINER) --- */
.game-container {
    position: relative;
    max-width: 400px; 
    height: 100vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between; 
    padding: 20px 0;
    box-sizing: border-box;
}

/* Barras Superior e Inferior */
.top-bar, .bottom-bar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 10px 0;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
}

.icon-slot {
    font-size: 1.5em;
    color: var(--color-accent-gold);
}

/* Info do Filósofo */
.philosopher-info {
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    margin-top: 15px;
    width: 90%;
    text-align: center;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.philosopher-info strong {
    color: var(--color-accent-gold);
    font-family: var(--font-cinzel);
}
.philosopher-definition {
    font-size: 0.85em;
    font-style: italic;
    opacity: 0.8;
}

/* --- CARTA DE DECISÃO (SWIPE CARD) --- */
.card-stack {
    position: relative;
    width: 90%;
    max-width: 350px;
    height: 450px; 
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
}

.decision-card {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--color-card-bg);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    touch-action: none; 
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-background-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: var(--color-accent-red);
    border-radius: 15px 15px 0 0;
    z-index: 1;
    /* Ícone de "personagem" simples */
    &::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 100px;
        background-color: #f7e7d2; 
        border-radius: 10px;
    }
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 50px;
        background-color: var(--color-accent-red); 
        border-radius: 100px 100px 0 0;
    }
}

.card-content {
    position: relative;
    z-index: 2;
    padding: 20px;
    text-align: center;
    flex-grow: 1; 
    padding-top: 120px; 
    margin-top: 10px;
    overflow-y: auto; /* Permite rolagem do texto do dilema */
}

/* MELHORIA DE LEITURA DO TEXTO DO DILEMA */
.decision-card h3 {
    font-family: var(--font-cinzel);
    color: var(--color-card-text);
    font-size: 1.4em; 
    margin-bottom: 15px;
}

.decision-card p {
    font-size: 1.1em; /* Fonte maior */
    line-height: 1.6; /* Espaçamento entre linhas aprimorado */
    margin-bottom: 0; 
    text-align: justify; /* Justifica o texto */
    color: var(--color-card-text);
}

/* Estilos para o Swipe */
.decision-card.swiping {
    transition: none; 
}

/* MELHORIA DE LEITURA DAS LABELS DE SWIPE (Ações) */
.swipe-label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    
    padding: 15px; 
    width: 170px; /* Largura ajustada */
    font-weight: bold;
    font-size: 1em; /* Fonte legível */
    line-height: 1.3; 
    text-align: left; /* Alinha o texto à esquerda */
    border-radius: 5px;
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s ease-out;
    pointer-events: none; /* Garante que não interfira no clique/arrasto */
}

.swipe-label strong {
    /* Destaca ESQUERDA e DIREITA */
    display: block;
    margin-bottom: 5px;
    color: black;
}

#label-left {
    left: 10px;
    background-color: var(--color-feedback-incorrect);
    color: white;
}
#label-right {
    right: 10px;
    background-color: var(--color-feedback-correct);
    color: white;
}

.swipe-label.visible {
    opacity: 1;
}


/* --- PAINEL DE FEEDBACK E BOTÃO --- */
.feedback-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    max-width: 350px;
    padding: 25px;
    background-color: rgba(0, 0, 0, 0.95);
    color: white;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    z-index: 200;
}

#feedback-message {
    margin-bottom: 20px;
    line-height: 1.6;
}

#feedback-panel button {
    background-color: var(--color-accent-gold);
    color: var(--color-card-text);
    border: none;
    padding: 10px 25px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
    text-transform: uppercase;
}
#feedback-panel button:hover {
    background-color: #ffd766;
}

/* Utilitários */
.hidden {
    display: none !important;
}

.feedback-correct {
    color: var(--color-feedback-correct);
}
.feedback-incorrect {
    color: var(--color-feedback-incorrect);
}
.feedback-default strong {
    color: var(--color-accent-gold);
}
