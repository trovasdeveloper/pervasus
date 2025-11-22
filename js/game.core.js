// ===============================================
// game.core.js: AGNOSTIC ENGINE CORE v2.2 (Fix UI Toggle)
// Architecture: Logic Only (UI Delegated)
// ===============================================

// --- 1. STATE MANAGER ---
const StateManager = {
    state: {
        visitedNodes: [],
        flags: {},
        inventory: [],
        stats: {}
    },

    init() {
        const saved = localStorage.getItem(STORAGE_KEY_AGNOSTIC);
        if (saved) {
            try {
                this.state = JSON.parse(saved);
                console.log('[AGNOSTIC] Estado carregado:', this.state);
            } catch (e) {
                console.warn('[AGNOSTIC] Save corrompido. Reiniciando.');
                this.save();
            }
        } else {
            console.log('[AGNOSTIC] Novo estado iniciado.');
        }
    },

    save() {
        localStorage.setItem(STORAGE_KEY_AGNOSTIC, JSON.stringify(this.state));
    },

    registerNode(nodeId) {
        if (!this.state.visitedNodes.includes(nodeId)) {
            this.state.visitedNodes.push(nodeId);
            this.save();
            return true; 
        }
        return false; 
    },

    hasVisited(nodeId) { return this.state.visitedNodes.includes(nodeId); },
    setFlag(key, val) { this.state.flags[key] = val; this.save(); },
    getFlag(key) { return !!this.state.flags[key]; }
};

// --- 2. LOGIC EVALUATOR ---
function checkRequirements(requirements) {
    if (!requirements) return true; 

    if (requirements.requiredNodes) {
        for (const node of requirements.requiredNodes) {
            if (!StateManager.hasVisited(node)) return false;
        }
    }

    if (requirements.requiredFlags) {
        for (const [key, val] of Object.entries(requirements.requiredFlags)) {
            if (StateManager.getFlag(key) !== val) return false;
        }
    }

    return true;
}

// --- 3. CORE FLOW VARIABLES ---
let currentSceneId = 'node_hub'; 

// --- 4. INPUT ROUTER (AQUI ESTAVA O ERRO VISUAL) ---
function handleInput(source, data) {
    console.log(`[Input] Fonte: ${source} | Payload: ${data}`);

    const mainMenu = document.getElementById('main-menu');
    const gameArea = document.getElementById('game-play-area');

    // 1. FORÇA O MENU A DESAPARECER
    mainMenu.classList.remove('active');
    mainMenu.classList.add('hidden'); // Adiciona hidden para garantir display:none

    // 2. FORÇA O JOGO A APARECER
    gameArea.classList.remove('hidden'); // CRÍTICO: Remove o display:none
    gameArea.classList.add('active');    // Ativa a opacidade

    // ROTA 1: NFC / URL Externa
    if (source === INPUT_SOURCE_NFC) {
        const nodeData = gameData[data];

        if (nodeData) {
            if (checkRequirements(nodeData.requirements)) {
                StateManager.registerNode(data);
                
                if (nodeData.onEnter && nodeData.onEnter.setFlag) {
                    StateManager.setFlag(nodeData.onEnter.setFlag, true);
                }

                loadScene(data);
            } else {
                const fallback = nodeData.fallbackNodeId || 'node_access_denied';
                loadScene(fallback);
            }
        } else {
            loadScene('node_error_404');
        }
    } 
    // ROTA 2: Navegação Interna
    else if (source === INPUT_SOURCE_CLICK || source === INPUT_SOURCE_SYSTEM) {
        loadScene(data);
    }
}

function loadScene(sceneId) {
    currentSceneId = sceneId;
    
    if (typeof renderScene === "function") {
        renderScene(sceneId);
    } else {
        console.error("CRITICAL ERROR: renderScene not found.");
    }
    
    if (typeof applyVisualTheme === "function") {
        applyVisualTheme();
    }
}


// --- 5. GLOBAL HOOKS ---

function startGame() {
    handleInput(INPUT_SOURCE_CLICK, GAME_START_NODE); 
}

function continueNarrative(nextSceneId) {
    handleInput(INPUT_SOURCE_CLICK, nextSceneId);
}

function makeChoice(scoreChange, nextSceneId) {
    handleInput(INPUT_SOURCE_CLICK, nextSceneId);
}

function exitGame() {
    const mainMenu = document.getElementById('main-menu');
    const gameArea = document.getElementById('game-play-area');

    // Inverte a lógica: Mostra Menu, Esconde Jogo
    mainMenu.classList.remove('hidden');
    mainMenu.classList.add('active');
    
    gameArea.classList.remove('active');
    gameArea.classList.add('hidden');
}


// --- 6. BOOTSTRAP ---
function initEngine() 
{
    console.log("AGNOSTIC ENGINE Starting...");
    AudioEngine.initialize(); 
    StateManager.init(); 

    const urlParams = new URLSearchParams(window.location.search);
    const scannedTag = urlParams.get('tag');
    const resetCmd = urlParams.get('reset');

    const mainMenu = document.getElementById('main-menu');
    const gameArea = document.getElementById('game-play-area');

    if (resetCmd) {
        localStorage.removeItem(STORAGE_KEY_AGNOSTIC);
        window.location.href = window.location.pathname.split('?')[0];
        return;
    }

    if (scannedTag) 
    {
        // CENÁRIO A: O jogador entrou via NFC (Link da Parede)
        // Vai direto para o jogo e esconde o menu
        handleInput(INPUT_SOURCE_NFC, scannedTag);
    }
    else
    {
        // CENÁRIO B: O jogador abriu o site normal
        // NOVA LÓGICA: Ignora se já jogou antes. Mostra SEMPRE o Menu Principal.
        
        mainMenu.classList.remove('hidden');
        mainMenu.classList.add('active');
        
        gameArea.classList.remove('active');
        gameArea.classList.add('hidden');
    }
    
    refreshAudioListeners();
}

document.addEventListener('DOMContentLoaded', initEngine);