// constants.js - AGNOSTIC ENGINE CONFIGURATION

// --- CONFIGURAÇÃO DO ENGINE (AGNOSTIC) ---
const ENGINE_NAME           = 'AGNOSTIC ENGINE v1.0';
const STORAGE_KEY_AGNOSTIC  = 'AGNOSTIC_SAVE_SLOT_01'; 
const AUDIO_PATH_ROOT       = 'assets/audio/';

// --- CONFIGURAÇÃO DO JOGO ATUAL (PERVASUS) ---
const GAME_TITLE            = 'PERVASUS';
const GAME_START_NODE       = 'tag_start_01'; 

// --- INPUT SOURCES (Origem do comando) ---
const INPUT_SOURCE_NFC      = 'input_nfc';
const INPUT_SOURCE_CLICK    = 'input_click';
const INPUT_SOURCE_SYSTEM   = 'input_system'; 

// --- INPUT TYPES (Tipos de Interface - FALTAVA ISTO!) ---
// Estes são essenciais para o game.ui.js saber o que desenhar
const INPUT_TYPE_SCAN_WAIT      = 'type_scan_wait';      // Ecrã de espera
const INPUT_TYPE_CONTINUE       = 'type_continue';       // Botão simples
const INPUT_TYPE_INITIAL_CHOICE = 'type_initial_choice'; // Botão de arranque
const INPUT_TYPE_CARD_CHOICE    = 'type_card_choice';    // Cartas (se usares)
const INPUT_TYPE_TEXT_CHOICE    = 'type_text_choice';    // Input de texto (se usares)

// --- AUDIO PATHS (Sons de UI - FALTAVA ISTO!) ---
// O audio.engine.js precisa disto para iniciar
const PATH_HOVER_SOUND_MENU     = 'assets/audio/boom_hover.wav'; 
const PATH_HOVER_SOUND_CONTINUE = 'assets/audio/transition_wind.wav';

// --- VISUAL THEMES (Abstração) ---
const THEME_DEFAULT         = 'theme_default';
const THEME_GLITCH          = 'theme_glitch';
const THEME_SUCCESS         = 'theme_success';
const THEME_LOCKED          = 'theme_locked';

// (Fallback para compatibilidade se algum ficheiro antigo chamar SYSTEM_NEUTRAL)
const THEME_SYSTEM_NEUTRAL  = THEME_DEFAULT; 

// --- CLASSES CSS (Mapeamento) ---
const CSS_UI_NEUTRAL        = 'ui-agnostic-neutral';
const CSS_UI_GLITCH         = 'ui-agnostic-glitch';
const CSS_UI_GOLD           = 'ui-agnostic-gold';