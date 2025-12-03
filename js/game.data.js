// ===============================================
// game.data.js — PUZZLE 01: THE LOST DOG
// ===============================================

const gameData = 
{
    // GENERAL CONFIGURATION
    'node_hub': {
        background: 'assets/img/bg_static.jpg',
        text: "PERVASUS SYSTEM ONLINE.\n\nScanning for NFC signals...\n(Scan the physical post-its to interact)",
        inputType: INPUT_TYPE_SCAN_WAIT, 
        visualTheme: THEME_DEFAULT,
        audio: { ambience: 'A_Hub_Hum.mp3' } 
    },
    
    'node_error_404': 
    {
        text: "READ ERROR.\nPost-it unreadable or torn.",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_GLITCH
    },


    // --- 2. THE CHARACTER (THE OWNER) ---
    // PHYSICAL TAG: .../index.html?tag=tag_owner
    // STATE A: (Only activates if has_dog)
    'tag_owner': 
    {
        requirements: { requiredFlags: { 'has_dog': true } },
        fallbackNodeId: 'node_owner_quest', // If not, goes to STATE B

        background: 'assets/img/bg_postit_happy.jpg', 
        text: "THANK YOU!\n\nYou: 'Here he is.'\nOwner: 'Boby! I was so worried. Please, take this as a reward.'\n\n[MISSION COMPLETE]",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_SUCCESS,
        audio: { voiceline: 'V_Victory.mp3' }
    },

    // STATE B: (Fallback)
    'node_owner_quest': 
    {
        background: 'assets/img/bg_postit_sad.jpg', 
        text: "HELP WANTED!\n\nOwner: 'I lost my dog... He is a bit clumsy.'\nYou: 'What does he look like?'\nOwner: 'He hates sunglasses. If you see him, please bring him back!'",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_DEFAULT,
        onEnter: { setFlag: 'quest_started' }, // Activates the quest
        audio: { voiceline: 'V_Owner_Help.mp3' }
    },


    //  3. FALSE CLUE
    // TAG: COOL DOG (...?tag=tag_cool_dog)
    'tag_cool_dog': 
    {
        background: 'assets/img/bg_postit_cool.jpg', 
        text: "COOL DOG\n\nYou found a very stylish dog wearing sunglasses.\n\n(Wait... The owner said his dog HATES glasses. This is not Boby.)",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_DEFAULT,
        audio: { voiceline: 'V_Dog_Bark_Cool.mp3' }
    },

    // TAG: GIRL (...?tag=tag_girl)
    'tag_girl': 
    {
        background: 'assets/img/bg_postit_girl.jpg',
        text: "THIS IS NOT A DOG.\n\nIt is a girl with a backpack.\nShe looks at you strangely and continues walking to school.",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_DEFAULT
    },

    // TAG: EYE (...?tag=tag_eye)
    'tag_eye': 
    {
        background: 'assets/img/bg_postit_eye.jpg',
        text: "A GIANT EYE.\n\nA drawing of an eye stares at you intensely.\nDefinitely not a dog.",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_GLITCH 
    },


    // --- 4. THE DOG HUNT (REAL) ---
    // TAG: THE DOG RUNS (...?tag=tag_dog_run)
    'tag_dog_run': 
    {
        background: 'assets/img/bg_postit_dog.jpg',
        text: "YOU FOUND THE DOG!\n\nIt's him! No glasses and looking clumsy.\nBut as soon as he sees you, he gets scared and runs towards the PARK!\n\n(It looks like he is hiding behind that TREE...)",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_DEFAULT,
        onEnter: { setFlag: 'dog_ran_away' }, // Flag to allow catching him at the tree
        audio: { voiceline: 'V_Dog_Run.mp3' }
    },

    // TAG: THE TREE / CAPTURE (...?tag=tag_tree)
    'tag_tree': 
    {
        requirements: { requiredFlags: { 'dog_ran_away': true } }, // Only works if he ran away
        fallbackNodeId: 'node_tree_empty',

        background: 'assets/img/bg_postit_tree_dog.jpg',
        text: "GOTCHA!\n\nThe dog is shivering behind the tree.\nYou pick him up. He licks your face.\n\n[ITEM ADDED: LOST DOG]",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_SUCCESS,
        onEnter: { setFlag: 'has_dog' }, // CRITICAL: This flag completes the Owner's quest
        audio: { voiceline: 'V_Dog_Whine.mp3' }
    },

    // STATE: EMPTY TREE (Se o player for à arvore antes)
    'node_tree_empty': 
    {
        background: 'assets/img/bg_postit_tree.jpg',
        text: "A TREE.\n\nIt is just a tree drawn on a post-it.\nThere is nothing here... for now.",
        inputType: INPUT_TYPE_CONTINUE,
        nextSceneId: 'node_hub',
        visualTheme: THEME_DEFAULT
    }
};