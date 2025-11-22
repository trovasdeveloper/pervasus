// ====================================================================================
// game.ui.js: Motor de Renderização (Versão PERVASUS Stable)
// ====================================================================================

/**
 * Mapeamento dos temas visuais narrativos (usados em game.data.js) 
 * para as classes base do CSS (definidas em constants.js / styles.css).
 */
const VISUAL_THEME_MAP = {
    [THEME_DEFAULT]:    CSS_UI_NEUTRAL,
    [THEME_GLITCH]:     CSS_UI_GLITCH,
    [THEME_SUCCESS]:    CSS_UI_GOLD,
    [THEME_LOCKED]:     CSS_UI_GLITCH,
    // Fallback para o Neutro antigo
    [THEME_SYSTEM_NEUTRAL]: CSS_UI_NEUTRAL 
};


// ========================================================
// FUNÇÃO 1: APPLY VISUAL THEME (CSS & STATUS)
// ========================================================
function applyVisualTheme() {
    const gameContainer = document.getElementById('game-play-area');
    // Nota: No HTML o ID é 'isolation-score', mas usamos como display de status
    const statusDisplay = document.getElementById('isolation-score'); 

    if (!gameContainer) return;

    // 1. Atualiza Status (Ex: "DATA: 2 FRAGMENTS")
    // Verifica se o StateManager já carregou
    if (typeof StateManager !== 'undefined' && statusDisplay) {
        const count = StateManager.state.visitedNodes.length;
        statusDisplay.innerText = `DATA: ${count} FRAGMENTS`;
        
        // Se tivermos na cena de sucesso, muda o texto
        if (currentSceneId === 'tag_secret_01') {
             statusDisplay.innerText = "UPLOAD COMPLETE";
        }
    }

    // 2. Aplica CSS do Tema
    const currentScene = gameData[currentSceneId];
    let newClass = CSS_UI_NEUTRAL; // Default seguro

    if (currentScene && currentScene.visualTheme) {
        newClass = VISUAL_THEME_MAP[currentScene.visualTheme] || CSS_UI_NEUTRAL;
    }

    // Aplica a classe ao contentor principal
    gameContainer.className = `container-fluid game-overlay ${newClass}`;
}


// ========================================================
// FUNÇÃO 2: RENDER SCENE (O CORAÇÃO DA UI)
// ========================================================
function renderScene(sceneId) {
    const scene = gameData[sceneId]; 
    const narrativeOutput = document.getElementById('narrative-output');
    const cardContainer = document.getElementById('card-container');
    const controlContainer = document.getElementById('control-container');
    
    // Elementos do Background
    const bgImg = document.getElementById('scene-background-img');
    const bgVideo = document.getElementById('scene-background-video');

    // --- 0. Validação de Segurança ---
    if (!scene) {
        console.error(`UI Error: Node ${sceneId} not found.`);
        if (narrativeOutput) narrativeOutput.innerHTML = "<h1>DATA FRAGMENT MISSING</h1>";
        return;
    }

    // --- 1. Limpeza da Interface ---
    if (cardContainer) cardContainer.innerHTML = '';
    if (controlContainer) controlContainer.innerHTML = '';

    // --- 2. Background (Híbrido: Imagem Segura) ---
    // Como decidimos "cagar nos vídeos" por agora, forçamos sempre a imagem
    if (bgImg) {
        bgImg.src = scene.background || 'assets/img/bg_static.jpg';
        bgImg.classList.add('active');
    }
    if (bgVideo) {
        bgVideo.classList.remove('active'); // Garante que o vídeo está escondido
    }

    // --- 3. Texto Narrativo ---
    let finalHTML = "";
    if (scene.text) {
        // Converte quebras de linha \n em <br> para HTML
        finalHTML = `<p>${scene.text.replace(/\n/g, '<br>')}</p>`;
    }
    if (narrativeOutput) narrativeOutput.innerHTML = finalHTML;

    // --- 4. Áudio ---
    if (typeof AudioEngine !== 'undefined') {
        AudioEngine.updateSceneAudio(scene.audio);
    }

    // --- 5. Renderização dos Inputs (Botões) ---
    if (controlContainer) {
        switch (scene.inputType) {
            case INPUT_TYPE_SCAN_WAIT:
                controlContainer.innerHTML = `
                    <div class="scan-animation text-center" style="opacity:0.7;">
                        <p>⚡ WAITING FOR NFC SIGNAL ⚡</p>
                    </div>`;
                break;

            case INPUT_TYPE_CONTINUE:
                if (scene.nextSceneId) {
                    controlContainer.innerHTML = `<button class="control-button" onclick="continueNarrative('${scene.nextSceneId}')">PROCEED »</button>`;
                }
                break;
                
            case INPUT_TYPE_INITIAL_CHOICE: 
                 controlContainer.innerHTML = `<button class="control-button" onclick="revealChoices('${sceneId}')">INITIALIZE SEQUENCE</button>`;
                 break;

            case INPUT_TYPE_CARD_CHOICE:
                if (scene.options && scene.options.length > 0) {
                    renderCards(scene.options);
                }
                break;
                
            default:
                // Fallback vazio
                break;
        }
    }

    refreshAudioListeners();
}


// ========================================================
// FUNÇÃO 3: RENDER CARDS (SISTEMA DE ESCOLHAS)
// ========================================================
function renderCards(optionsArray) {
    const cardContainer = document.getElementById('card-container');
    if (!cardContainer) return;
    
    cardContainer.innerHTML = ''; 

    optionsArray.forEach(option => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card choice-card mb-3'; 
        
        cardElement.innerHTML = `
            <div class="card-body d-flex flex-column justify-content-between p-0">
                <p class="card-title">${option.text}</p>
            </div>
            <button class="card-button" type="button">EXECUTE</button> `;
        
        // Usa a função global makeChoice
        cardElement.onclick = () => makeChoice(0, option.nextSceneId);
        cardContainer.appendChild(cardElement);
    });
    
    refreshAudioListeners(); 
}

function revealChoices(sceneId) {
    const scene = gameData[sceneId]; 
    const controlContainer = document.getElementById('control-container');
    
    if (controlContainer) controlContainer.innerHTML = ''; 

    if (scene.options && scene.options.length > 0) {
        renderCards(scene.options);
    }
    refreshAudioListeners(); 
}