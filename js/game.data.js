// ===============================================
// game.data.js — PUZZLE 01: THE LOST DOG
// ===============================================

const gameData = {
  // GENERAL CONFIGURATION
  node_hub: {
    background: "assets/img/bg_static.jpg",
    text: "PERVASUS SYSTEM ONLINE.\n\nScanning for NFC signals...\n(Scan the physical post-its to interact)",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_DEFAULT,
    audio: { ambience: "A_Hub_Hum.mp3" },
  },

  node_error_404: {
    text: "READ ERROR.\nPost-it unreadable or torn.",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "node_hub",
    visualTheme: THEME_GLITCH,
  },

  // ===============================================
  // PUZZLE 01: THE LOST DOG
  // ===============================================
  //
  // Narrative Goal:
  // Help the owner find his lost dog by following false leads
  // and tracking the real dog until capture.
  //
  // Core Flags:
  // - has_quest            → player accepted the quest
  // - dog_quest_started    → unlocks dog-related tags
  // - dog_ran_away         → allows capture at the tree
  // - has_dog              → quest resolution item
  //
  // Start / End NPC:
  // - tag_owner
  //
  // False Leads:
  // - tag_cool_dog
  // - tag_girl
  // - tag_eye
  //
  // Real Path:
  // - tag_dog_run → tag_tree
  // ===============================================

  // START & END: THE OWNER
  // PHYSICAL TAG: .../index.html?tag=tag_owner
  // STATE A: Quest completed (player has the dog)
  tag_owner: {
    requirements: { requiredFlags: { has_dog: true } },
    fallbackNodeId: "node_owner_quest",

    background: "assets/img/bg_postit_happy.jpg",
    text:
      "THANK YOU!\n\n" +
      "You: 'Here he is.'\n" +
      "Owner: 'Boby! I was so worried. Please, take this as a reward.'\n\n" +
      "[MISSION COMPLETE]",
    nextSceneId: "node_hub",
    visualTheme: THEME_SUCCESS,
    audio: { voiceline: "V_Victory.mp3" },
  },

  // STATE B: Quest not yet accepted
  node_owner_quest: {
    requirements: { requiredFlags: { has_quest: false } },

    background: "assets/img/bg_postit_sad.jpg",
    text:
      "HELP WANTED!\n\n" +
      "Owner: 'I lost my dog... He is a bit clumsy.'\n" +
      "You: 'What does he look like?'\n" +
      "Owner: 'He hates sunglasses. If you see him, please bring him back!'",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "node_owner_quest_accepted",
    visualTheme: THEME_DEFAULT,
    audio: { voiceline: "V_Owner_Help.mp3" },
  },

  // QUEST ACCEPTED: activates quest flags
  node_owner_quest_accepted: {
    background: "assets/img/bg_postit_sad.jpg",
    text: "Thank you!",
    visualTheme: THEME_DEFAULT,

    // CRITICAL: multiple flags must use setFlags
    onEnter: {
      setFlags: {
        dog_quest_started: true,
        has_quest: true,
      },
    },
    audio: { voiceline: "V_Owner_Help.mp3" },
  },

  // -----------------------------------------------
  // FALSE LEADS (only active after quest start)
  // -----------------------------------------------

  // PHYSICAL TAG: .../index.html?tag=tag_cool_dog
  tag_cool_dog: {
    requirements: { requiredFlags: { dog_quest_started: true } },
    background: "assets/img/bg_postit_cool.jpg",
    text:
      "COOL DOG\n\n" +
      "You found a very stylish dog wearing sunglasses.\n\n" +
      "(Wait... The owner said his dog HATES glasses. This is not Boby.)",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
    audio: { voiceline: "V_Dog_Bark_Cool.mp3" },
  },

  // PHYSICAL TAG: .../index.html?tag=tag_girl
  tag_girl: {
    requirements: { requiredFlags: { dog_quest_started: true } },
    background: "assets/img/bg_postit_girl.jpg",
    text:
      "THIS IS NOT A DOG.\n\n" +
      "It is a girl with a backpack.\n" +
      "She looks at you strangely and continues walking to school.",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
  },

  // PHYSICAL TAG: .../index.html?tag=tag_eye
  tag_eye: {
    requirements: { requiredFlags: { dog_quest_started: true } },
    background: "assets/img/bg_postit_eye.jpg",
    text:
      "A GIANT EYE.\n\n" +
      "A drawing of an eye stares at you intensely.\n" +
      "Definitely not a dog.",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "node_hub",
    visualTheme: THEME_GLITCH,
  },

  // -----------------------------------------------
  // REAL DOG PATH
  // -----------------------------------------------

  // PHYSICAL TAG: .../index.html?tag=tag_dog_run
  tag_dog_run: {
    requirements: { requiredFlags: { dog_quest_started: true } },
    background: "assets/img/bg_postit_dog.jpg",
    text:
      "YOU FOUND THE DOG!\n\n" +
      "It's him! No glasses and looking clumsy.\n" +
      "But as soon as he sees you, he gets scared and runs towards the PARK!\n\n" +
      "(It looks like he is hiding behind that TREE...)",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
    onEnter: { setFlag: "dog_ran_away" },
    audio: { voiceline: "V_Dog_Run.mp3" },
  },

  // PHYSICAL TAG: .../index.html?tag=tag_tree
  tag_tree: {
    requirements: {
      requiredFlags: {
        dog_ran_away: true,
        dog_quest_started: true,
      },
    },
    fallbackNodeId: "node_tree_empty",

    background: "assets/img/bg_postit_tree_dog.jpg",
    text:
      "GOTCHA!\n\n" +
      "The dog is shivering behind the tree.\n" +
      "You pick him up. He licks your face.\n\n" +
      "[ITEM ADDED: LOST DOG]",
    nextSceneId: "node_hub",
    visualTheme: THEME_SUCCESS,
    onEnter: { setFlag: "has_dog" },
    audio: { voiceline: "V_Dog_Whine.mp3" },
  },

  // EMPTY TREE (player arrives too early)
  node_tree_empty: {
    requirements: { requiredFlags: { dog_quest_started: true } },
    background: "assets/img/bg_postit_tree.jpg",
    text:
      "A TREE.\n\n" +
      "It is just a tree drawn on a post-it.\n" +
      "There is nothing here... for now.",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
  },

  // ===============================================
  // PUZZLE 02: MISSING CHILD
  // ===============================================

  // START & END: THE FATHER (requires the "girl found" flag to resolve)
  // PHYSICAL TAG: .../index.html?tag=tag_father
  tag_father: {
    requirements: { requiredFlags: { found_girl: true } },
    fallbackNodeId: "node_father_start",

    background: "assets/img/bg_postit_father.jpg", // mustache & hat
    text:
      "THANK YOU!\n\n" +
      "Father: 'Lara! I was so scared!'\n" +
      "Lara: 'I'm sorry dad, I failed the math test...'\n" +
      "Father: 'I don't care about grades, I just want you safe.'\n\n" +
      "(Seems... too simple. Something feels off.)",
    nextSceneId: "node_hub",
    visualTheme: THEME_SUCCESS,
    onEnter: { setFlags: { missing_child_solved: true } },
    audio: { voiceline: "V_Father_Thanks.mp3" },
  },

  node_father_start: {
    background: "assets/img/bg_postit_father.jpg",
    text:
      "My daughter? Have you seen her?\n" +
      "She didn't come back from school!\n" +
      "Help me find her!",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
    onEnter: { setFlags: { missing_child_started: true } },
    audio: { voiceline: "V_Father_Plea.mp3" },
  },

  // FALSE LEAD: BANDIT
  // PHYSICAL TAG: .../index.html?tag=tag_bandit
  tag_bandit: {
    background: "assets/img/bg_postit_bandit.jpg",
    text:
      "What? Kidnap a kid? Are you crazy?\n" +
      "I saw a girl running past here crying.",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
  },

  // LOCATION: THE SCHOOL (entrance / hallway)
  // PHYSICAL TAG: .../index.html?tag=tag_school
  tag_school: {
    background: "assets/img/bg_postit_school.jpg",
    text:
      "SCHOOL HALLWAY\n\n" +
      "You enter the building. It is completely silent.\n" +
      "You remember the note: 'Where Mr. Costa keeps the brooms.'\n" +
      "You look around and see a small door at the end of the corridor marked 'MAINTENANCE'.",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,

    // CRITICAL: entering the school enables school-only post-its
    onEnter: { setFlags: { inside_school: true } },
  },

  // NPC: STAFF MEMBER (only if you are inside the school)
  // PHYSICAL TAG: .../index.html?tag=tag_staff
  tag_staff: {
    requirements: { requiredFlags: { inside_school: true } },
    fallbackNodeId: "node_staff_outside",

    background: "assets/img/bg_postit_staff.jpg",
    text:
      "THE STAFF MEMBER\n\n" +
      "You stop a man passing by.\n" +
      "'Mr. Costa's brooms? He keeps them in the closet under the stairs.\n" +
      "It's that old rusty door at the end of the hall.'",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
  },

  node_staff_outside: {
    background: "assets/img/bg_postit_staff.jpg",
    text:
      "You look around, but there is no staff member here.\n" +
      "This only makes sense once you're inside the school.",
    nextSceneId: "node_hub",
    visualTheme: THEME_LOCKED,
  },

  // HIDING SPOT: THE CLOSET (school-only + this is where the girl is found)
  // PHYSICAL TAG: .../index.html?tag=tag_closet
  tag_closet: {
    requirements: { requiredFlags: { inside_school: true, found_girl: false } },
    fallbackNodeId: "node_closet_fallback",

    background: "assets/img/bg_postit_closet.jpg",
    text:
      "THE CLOSET\n\n" +
      "A rusty door. You pull it open.\n" +
      "Inside, a small shadow flinches.\n\n" +
      "'Lara?'",
    nextSceneId: "node_hub",
    visualTheme: THEME_SUCCESS,
    onEnter: { setFlags: { found_girl: true } },
    audio: { voiceline: "V_Girl_Found.mp3" },
  },

  // If player scans closet but isn't inside school OR already found the girl
  node_closet_fallback: {
    // if you're not inside the school, say so; otherwise it's just empty
    requirements: { requiredFlags: { inside_school: true } },
    fallbackNodeId: "node_closet_outside",

    background: "assets/img/bg_postit_closet.jpg",
    text:
      "THE CLOSET\n\n" + "It's empty.\n" + "Just brooms, dust, and silence.",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
  },

  node_closet_outside: {
    background: "assets/img/bg_postit_closet.jpg",
    text:
      "A locked service door.\n" + "You shouldn't be here. Not from outside.",
    nextSceneId: "node_hub",
    visualTheme: THEME_LOCKED,
  },

  // WRONG LOCATION: THE GYM
  // PHYSICAL TAG: .../index.html?tag=tag_gym
  tag_gym: {
    background: "assets/img/bg_postit_gym.jpg",
    text:
      "THE GYM\n\n" +
      "You run into the gymnasium. It is huge and empty.\n" +
      "You check behind the bleachers. Nothing.\n" +
      "She is not here.\n\n" +
      "She must have chosen a smaller, tighter hiding spot.",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
  },

  // PHYSICAL TAG: .../index.html?tag=tag_exit_school
  tag_exit_school: {
    requirements: { requiredFlags: { inside_school: true } },
    background: "assets/img/bg_postit_school.jpg",
    text: "You step back outside.\nThe air feels louder.",
    nextSceneId: "node_hub",
    visualTheme: THEME_DEFAULT,
    onEnter: { setFlags: { inside_school: false } },
  },

  // --- PUZZLE 3: THE INTERROGATION ---
  // --- THE JOKER (HUB) ---
  tag_stoner_joker: {
    // 1. HIGHEST PRIORITY: If his own quest is done, he stays chilling no matter what.
    requirements: { requiredFlags: { stoner_joker_quest_complete: true } },
    fallbackNodeId: "node_joker_quest_interception", // Check if boyfriend quest is active and divert to it if so
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER: Thanks again for finding out it was Gabs, man. I'm just chilling.",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_SUCCESS,
  },

  // --- CHECK IF QUEST IS ACTIVE ---
  node_stoner_joker_in_progress_check: {
    requirements: { requiredFlags: { stoner_joker_quest_active: true } },
    fallbackNodeId: "node_stoner_joker_initial_offer",
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER: Found the honest dude yet? Remember, tell me his name when you're sure.",
    inputType: INPUT_TYPE_INITIAL_CHOICE,
    options: [
      {
        text: "IDENTIFY THE HONEST DUDE",
        nextSceneId: "node_stoner_joker_guess_name",
      },
    ],
  },

  // --- THE INITIAL OFFER ---
  node_stoner_joker_initial_offer: {
    requirements: { requiredFlags: { has_quest: false } },
    fallbackNodeId: "node_joker_busy_player", // Node for when player already has a quest
    background: "assets/img/stoner_joker_postit.png",
    text: "Hey man, can you help me out?\n\nOne of four dudes yoinked my whole blunt. I'm too fucked up to remember much, but apparently three of them can’t tell the truth.\n\nFind out which one’s honest and I’ll go ask him myself.",
    inputType: INPUT_TYPE_INITIAL_CHOICE,
    options: [
      {
        text: "YEAH, I'LL HELP",
        nextSceneId: "node_stoner_joker_quest_accepted",
      },
    ],
  },

  node_joker_busy_player: {
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER: Whoa man, you look like you've already got a lot on your plate. Come back when you've finished your other stuff.",
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_stoner_joker_quest_accepted: {
    onEnter: {
      setFlags: {
        stoner_joker_quest_active: true,
        has_quest: true,
      },
    },
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER: Sweet. Go talk to Ricky, Gui, Tutu, and Gabs. Find the honest one and come back to me.",
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  // --- THE SUSPECTS ---
  tag_ricky: {
    requirements: {
      requiredFlags: { stoner_joker_quest_active: true },
    },
    fallbackNodeId: "node_nothing_here",
    text: "RICKY:\n'Hey man, I don’t know what you’re on about, but you shouldn’t trust Gabs.'",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_DEFAULT,
  },

  tag_gui: {
    requirements: {
      requiredFlags: { stoner_joker_quest_active: true },
    },
    fallbackNodeId: "node_nothing_here",
    text: "GUI:\n'Tutu and Gabs are always lying and messing with people, it gets kinda tiring after a while.'",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_DEFAULT,
  },

  tag_tutu: {
    requirements: {
      requiredFlags: { stoner_joker_quest_active: true },
    },
    fallbackNodeId: "node_nothing_here",
    text: "TUTU:\n'Gui is the most trustworthy guy I know. You should listen to him.'",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_DEFAULT,
  },

  tag_gabs: {
    requirements: {
      requiredFlags: { stoner_joker_quest_active: true },
    },
    fallbackNodeId: "node_nothing_here",
    text: "GABS:\n'I’m the only one out of these idiots that’s not a dirty lying cheat.'",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_DEFAULT,
  },

  node_nothing_here: {
    text: "Just a dude bro chilling.",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_DEFAULT,
  },

  // --- THE NAME GUESSING SCENE ---
  node_stoner_joker_guess_name: {
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER:\n'So which one MUST be the honest dude?'\n\n(Careful man, if you're wrong I'm gonna need a 30 min nap.)",
    inputType: "type_text_input",
    correctName: "Gabs",
    nextSceneId: "stoner_joker_quest_complete",
  },

  // --- THE WRONG GUESS SCENE ---
  node_stoner_joker_wrong: {
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER: Nah man, that ain't it. Now my head hurts. I'm gonna go pass out for a bit.\n\n(He falls face-first into the grass. System indicates he will be unavailable for 30 minutes.)",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "node_hub",
    visualTheme: THEME_LOCKED,
  },

  // --- THE QUEST COMPLETE SCENE ---
  stoner_joker_quest_complete: {
    background: "assets/img/stoner_joker_postit.png",
    text:
      "JOKER:\n'Gabs? Yeah, that sounds like the guy! He's always pullin' stunts like that.'\n\n" +
      "He high-fives you (clumsily) and hands you a small token.\n\n" +
      "[QUEST COMPLETE: THE STOLEN BLUNT]",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "node_hub",
    visualTheme: THEME_SUCCESS,
    onEnter: {
      setFlags: {
        stoner_joker_quest_complete: true,
        stoner_joker_quest_active: false,
        has_quest: false,
      },
    },
  },

  // --- PUZZLE 04: THE BOYFRIEND QUEST ---

  tag_lonely_girl: {
    // Check if fully finished first
    requirements: { requiredFlags: { bf_quest_complete: true } },
    fallbackNodeId: "node_girl_check_depressed",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: You know what?\n\nI think I just realized I just kinda hate all men.... Thanks! I'll be fine by myself.\n\n[QUEST COMPLETE]",
    inputType: INPUT_TYPE_SCAN_WAIT,
    visualTheme: THEME_SUCCESS,
  },

  node_girl_check_depressed: {
    // If we just found the depressed guy, FINISH the quest
    requirements: { requiredFlags: { bf_quest_found_depressed: true } },
    fallbackNodeId: "node_girl_check_raiden",
    background: "assets/img/lonely_girl_postit.png",
    // Complete quest logic here
    onEnter: {
      setFlags: {
        bf_quest_complete: true,
        bf_quest_active: false,
        has_quest: false,
      },
    },
    text: "GIRL: Finally! Someone who gets it... wait...",
    inputType: INPUT_TYPE_CONTINUE,
    nextSceneId: "tag_lonely_girl",
  },

  node_girl_check_raiden: {
    requirements: { requiredFlags: { bf_quest_found_raiden: true } },
    fallbackNodeId: "node_girl_check_mexican",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: It doesn't look like he even knows what day it is.\n\nI want someone I can relate to, find me a guy as depressed as I am.",
    onEnter: { setFlags: { bf_quest_validated_raiden: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_girl_check_mexican: {
    requirements: { requiredFlags: { bf_quest_found_mexican: true } },
    fallbackNodeId: "node_girl_check_joker",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: Hmm, this feels kinda weird actually\n\nFind me a silver fox instead.",
    onEnter: { setFlags: { bf_quest_validated_mexican: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_girl_check_joker: {
    requirements: { requiredFlags: { bf_quest_found_joker: true } },
    fallbackNodeId: "node_girl_check_batman",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: Getting high isn't a personality trait.\n\nFind me a good ol' Mexican dude.",
    onEnter: { setFlags: { bf_quest_validated_joker: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_girl_check_batman: {
    requirements: { requiredFlags: { bf_quest_found_batman: true } },
    fallbackNodeId: "node_girl_initial",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: Ugh, superheroes are so self-absorbed.\n\nFind me someone who can roast me.",
    onEnter: { setFlags: { bf_quest_validated_batman: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  // Only show the "Accept" button if:
  // 1. The BF quest hasn't started yet.
  // 2. The player is not currently on any other quest.
  node_girl_initial: {
    requirements: {
      requiredFlags: {
        bf_quest_active: false,
        has_quest: false,
      },
    },
    fallbackNodeId: "node_girl_already_on_quest_check",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: I’m so lonely, help me find someone to keep me company.\n\nI like heroic men, find me a superhero.",
    inputType: INPUT_TYPE_INITIAL_CHOICE,
    options: [
      { text: "I'LL HELP YOU FIND LOVE", nextSceneId: "node_girl_accepted" },
    ],
  },

  node_girl_already_on_quest_check: {
    // If we are already on the BF quest, show a 'Waiting for Batman' message.
    requirements: { requiredFlags: { bf_quest_active: true } },
    fallbackNodeId: "node_girl_busy_with_other",
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: Still looking for that superhero? I hope he's not just a guy in a suit.",
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_girl_busy_with_other: {
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: You look like you're already busy helping someone else.\n\nCome back when you've finished your current business!",
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_girl_accepted: {
    // Start the boyfriend quest here if player pressed the button
    onEnter: {
      setFlags: {
        bf_quest_active: true,
        has_quest: true,
      },
    },
    background: "assets/img/lonely_girl_postit.png",
    text: "GIRL: Really? Thank you! I hear there's a superhero hanging around nearby.",
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  // --- THE BOYFRIEND CANDIDATES --- Can make a generic node for these while not on the quest if needed
  tag_batman: {
    requirements: { requiredFlags: { bf_quest_active: true } },
    background: "assets/img/batman_postit.png",
    text: "You found the superest of heroes.",
    onEnter: { setFlags: { bf_quest_found_batman: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  node_joker_quest_interception: {
    requirements: {
      requiredFlags: {
        bf_quest_validated_batman: true,
        bf_quest_found_joker: false,
      },
    },
    fallbackNodeId: "node_stoner_joker_in_progress_check",
    background: "assets/img/stoner_joker_postit.png",
    text: "JOKER: Hey bro, you want a puff?\n\nHe seems roasted out of his mind...",
    onEnter: { setFlags: { bf_quest_found_joker: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  tag_mexican_guy: {
    requirements: { requiredFlags: { bf_quest_validated_joker: true } },
    background: "assets/img/mexican_guy_postit.png",
    text: "You find a stereotypical mexican.",
    onEnter: { setFlags: { bf_quest_found_mexican: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  tag_raiden: {
    requirements: { requiredFlags: { bf_quest_validated_mexican: true } },
    background: "assets/img/raiden_postit.png",
    text: "You find an old Raiden with dementia.",
    onEnter: { setFlags: { bf_quest_found_raiden: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },

  tag_depressed_guy: {
    requirements: { requiredFlags: { bf_quest_validated_raiden: true } },
    background: "assets/img/depressed_guy_postit.png",
    text: "You find a guy laughing through the pain.",
    onEnter: { setFlags: { bf_quest_found_depressed: true } },
    inputType: INPUT_TYPE_SCAN_WAIT,
  },
};
