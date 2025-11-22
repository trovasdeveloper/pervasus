// ===============================================
// game.data.js — CONTENT CARTRIDGE: "PERVASUS: PoC"
// English Version for Demo
// ===============================================

const gameData = {

    // --- 1. SYSTEM NODES (Required by Engine) ---

    // Main Hub
    'node_hub': {
        background: 'assets/img/bg_hub.jpg',
        text: "PERVASUS SYSTEM v0.1\n\n[STATUS: ONLINE]\n[CONNECTION: Idle / Listening...]\n\nScan physical memory tags to retrieve data.",
        inputType: INPUT_TYPE_SCAN_WAIT, 
        visualTheme: THEME_DEFAULT,
        audio: { ambience: 'A_Hub_Hum.mp3' } 
    },

    // 404 Error
    'node_error_404': {
        background: 'assets/img/bg_static.jpg',
        text: "READ ERROR.\nMemory fragment corrupted or missing.",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_GLITCH,
        audio: { voiceline: 'V_Glitch.mp3' }
    },
    
    // Access Denied
    'node_access_denied': {
        background: 'assets/img/bg_lock.jpg',
        text: "ACCESS DENIED.\nMissing previous cryptographic keys.\n(Hint: Find the Bait/Start tag first)",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_LOCKED,
        audio: { voiceline: 'V_Access_Denied.mp3' }
    },


    // --- 2. THE GAME (The 3 Demo Tags) ---

    // TAG 1: THE BAIT (Start Point)
    // URL: .../index.html?tag=tag_start_01
    'tag_start_01': { 
        background: 'assets/img/bg_wall_intro.jpg',
        text: "SYSTEM BOOT SEQUENCE.\n\nThe wall trembles. 'How long has it been since I heard a voice...'\nYou have awakened the GameLab archives.",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub', 
        visualTheme: THEME_DEFAULT,
        onEnter: { setFlag: 'intro_complete' }, 
        audio: { 
            voiceline: 'V_Wall_Intro.mp3',
            ambience: 'A_System_Boot.mp3'
        }
    },

    // TAG 2: MYSTIC ZONE (The Eye)
    // URL: .../index.html?tag=tag_eye_zone
    // Requirement: Must have flag 'intro_complete'
    'tag_eye_zone': {
        requirements: { requiredFlags: { 'intro_complete': true } }, 
        
        background: 'assets/img/bg_eye.jpg',
        text: "FRAGMENT 042: THE EYE.\n\n'I watched his code being deleted. 300 hours of work gone... Despair has a color.'",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_GLITCH, 
        audio: { 
            voiceline: 'V_Memory_Eye.mp3',
            ambience: 'A_Static_Low.mp3'
        }
    },

    // TAG 3: SECRET (Victory)
    // URL: .../index.html?tag=tag_secret_01
    // Requirement: Must have visited 'tag_eye_zone'
    'tag_secret_01': {
        requirements: { requiredNodes: ['tag_eye_zone'] },
        
        background: 'assets/img/bg_gold.jpg',
        text: "FULL ACCESS GRANTED.\n\nYou found the hidden server inside the wall.\n'We are the memories that the university forgot.'",
        inputType: INPUT_TYPE_INITIAL_CHOICE, 
        nextSceneId: 'node_hub',
        visualTheme: THEME_SUCCESS, 
        audio: { 
            voiceline: 'V_Victory.mp3',
            music: 'M_Mystery_Solved.mp3'
        }
    }
};