// ===============================================
// Architecture: Logic Only (UI Delegated)
// ===============================================

// --- 1. STATE MANAGER ---
const StateManager = {
  state: {
    visitedNodes: [],
    flags: {},
    inventory: [],
    stats: {},
  },

  init() {
    const saved = localStorage.getItem(STORAGE_KEY_AGNOSTIC);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        console.log("[AGNOSTIC] Loaded State:", this.state);
      } catch (e) {
        console.warn("[AGNOSTIC] Save failed. Rebooting...");
        this.save();
      }
    } else {
      console.log("[AGNOSTIC] New state initiliazer.");
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

  hasVisited(nodeId) {
    return this.state.visitedNodes.includes(nodeId);
  },
  setFlag(key, val) {
    this.state.flags[key] = val;
    this.save();
  },
  getFlag(key) {
    return !!this.state.flags[key];
  },
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
let currentSceneId = "node_hub";

// --- 4. INPUT ROUTER
function handleInput(source, data) {
  console.log(`[Input] Fonte: ${source} | Payload: ${data}`);

  const mainMenu = document.getElementById("main-menu");
  const gameArea = document.getElementById("game-play-area");

  // 1. FORÇA O MENU A DESAPARECER
  mainMenu.classList.remove("active");
  mainMenu.classList.add("hidden");

  // 2. FORÇA O JOGO A APARECER
  gameArea.classList.remove("hidden"); // CRÍTICO: Remove o display:none
  gameArea.classList.add("active");

  // ROTA 1: NFC / URL Externa
  if (source === INPUT_SOURCE_NFC) {
    let nodeId = data;
    let nodeData = gameData[nodeId];

    // RECURSIVE CHECK: Keep jumping to fallbacks until requirements are met or we hit a dead end
    while (nodeData && !checkRequirements(nodeData.requirements)) {
      console.log(
        `[Logic] Requirements not met for ${nodeId}. Jumping to fallback...`
      );
      nodeId = nodeData.fallbackNodeId;
      nodeData = gameData[nodeId];
    }

    if (nodeData) {
      StateManager.registerNode(nodeId);

      // Handle Flag setting
      if (nodeData.onEnter) {
        if (nodeData.onEnter.setFlag) {
          StateManager.setFlag(nodeData.onEnter.setFlag, true);
        }
        if (nodeData.onEnter.setFlags) {
          for (const [key, val] of Object.entries(nodeData.onEnter.setFlags)) {
            StateManager.setFlag(key, !!val);
          }
          // Force a save to localStorage immediately
          StateManager.save();
        }
      }

      loadScene(nodeId);
    } else {
      // If we ran out of fallbacks and still didn't meet requirements
      loadScene("node_error_404");
    }
  }
  // ROTA 2: Navegação Interna
  else if (source === INPUT_SOURCE_CLICK || source === INPUT_SOURCE_SYSTEM) {
    loadScene(data);
  }
}

function loadScene(sceneId) {
  const nodeData = gameData[sceneId];
  if (!nodeData) return;

  currentSceneId = sceneId;

  // --- TRIGGER FLAGS ON ENTER ---
  if (nodeData.onEnter) {
    // Handle single flag
    if (nodeData.onEnter.setFlag) {
      StateManager.setFlag(nodeData.onEnter.setFlag, true);
    }
    // Handle multiple flags (joker_quest_started, etc)
    if (nodeData.onEnter.setFlags) {
      for (const [key, val] of Object.entries(nodeData.onEnter.setFlags)) {
        StateManager.setFlag(key, !!val);
      }
    }
    // Explicitly save after setting
    StateManager.save();
  }

  // Update URL so F5 works
  window.history.replaceState(null, null, `?tag=${sceneId}`);

  if (typeof renderScene === "function") {
    renderScene(sceneId);
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
  const mainMenu = document.getElementById("main-menu");
  const gameArea = document.getElementById("game-play-area");

  // Inverte a lógica: Mostra Menu, Esconde Jogo
  mainMenu.classList.remove("hidden");
  mainMenu.classList.add("active");

  gameArea.classList.remove("active");
  gameArea.classList.add("hidden");
}

// --- 6. BOOTSTRAP ---
function initEngine() {
  console.log("AGNOSTIC ENGINE Starting...");
  AudioEngine.initialize();
  StateManager.init();

  const urlParams = new URLSearchParams(window.location.search);
  const scannedTag = urlParams.get("tag");
  const resetCmd = urlParams.get("reset");

  const mainMenu = document.getElementById("main-menu");
  const gameArea = document.getElementById("game-play-area");

  if (resetCmd) {
    localStorage.removeItem(STORAGE_KEY_AGNOSTIC);
    window.location.href = window.location.pathname.split("?")[0];
    return;
  }

  if (scannedTag) {
    let nodeId = scannedTag;
    let nodeData = gameData[nodeId];

    // RECURSIVE CHECK: Keep jumping to fallbacks until requirements are met or we hit a dead end
    // It forces the browser to check requirements even if you type the URL manually.
    while (
      nodeData &&
      nodeData.requirements &&
      !checkRequirements(nodeData.requirements)
    ) {
      console.log("Requirement failed for " + nodeId + ". Redirecting...");
      nodeId = nodeData.fallbackNodeId || GAME_START_NODE;
      nodeData = gameData[nodeId];
    }

    // Now load the final "allowed" node
    handleInput(INPUT_SOURCE_SYSTEM, nodeId);
  }

  refreshAudioListeners();
}

document.addEventListener("DOMContentLoaded", initEngine);
