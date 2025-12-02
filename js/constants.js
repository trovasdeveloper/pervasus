// AGNOSTIC ENGINE CONFIGURATION

// --- CONFIGURAÇÃO DO ENGINE (AGNOSTIC) ---
const ENGINE_NAME           = 'AGNOSTIC ENGINE v1.0';
const STORAGE_KEY_AGNOSTIC  = 'PERVASUS_DOG_SAVE_01'; 
const AUDIO_PATH_ROOT       = 'assets/audio/';

// --- CONFIGURAÇÃO DO JOGO ATUAL (PERVASUS) ---
const GAME_TITLE            = 'PERVASUS';

// Mudámos de 'tag_start_01' para 'node_hub'
const GAME_START_NODE       = 'node_hub'; 

// --- INPUT SOURCES (Origem do comando) ---
const INPUT_SOURCE_NFC      = 'input_nfc';
const INPUT_SOURCE_CLICK    = 'input_click';
const INPUT_SOURCE_SYSTEM   = 'input_system';
const INPUT_WRITE_TEXT      = 'input_text';

// --- INPUT TYPES (Tipos de Interface) ---
const INPUT_TYPE_SCAN_WAIT      = 'type_scan_wait';      
const INPUT_TYPE_CONTINUE       = 'type_continue';       
const INPUT_TYPE_INITIAL_CHOICE = 'type_initial_choice'; 
const INPUT_TYPE_CARD_CHOICE    = 'type_card_choice';    
const INPUT_TYPE_TEXT_CHOICE    = 'type_text_choice';    

// --- AUDIO PATHS (Sons de UI ) ---
const PATH_HOVER_SOUND_MENU     = 'assets/audio/boom_hover.wav'; 
const PATH_HOVER_SOUND_CONTINUE = 'assets/audio/transition_wind.wav';

// --- VISUAL THEMES (Abstração) ---
const THEME_DEFAULT         = 'theme_default';
const THEME_GLITCH          = 'theme_glitch';
const THEME_SUCCESS         = 'theme_success';
const THEME_LOCKED          = 'theme_locked';
const THEME_SYSTEM_NEUTRAL  = THEME_DEFAULT; 

// --- CLASSES CSS (Map) ---
const CSS_UI_NEUTRAL        = 'ui-agnostic-neutral';
const CSS_UI_GLITCH         = 'ui-agnostic-glitch';
const CSS_UI_GOLD           = 'ui-agnostic-gold';