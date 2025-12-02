// ===============================================
// audio.engine.js: Motor de Gestão de Áudio (Singleton)
// AGORA GERE MÚSICA, AMBIENTE E VOZ
// ===============================================

const AudioEngine = (function() 
{
    let isMuted = true; 
    
    // --- Sons de UI (mantidos) ---
    let menuHoverSound = null;      
    let narrativeHoverSound = null; 

    // --- Canais de Áudio ---
    let currentMusic = null;
    let currentAmbience = null;
    let currentVoiceline = null;

    // --- Caminhos (mantidos nas constantes) ---
    // PATH_HOVER_SOUND_MENU e PATH_HOVER_SOUND_CONTINUE são definidos em constants.js

    // --- INTERNAL (PRIVATE) FUNCTIONS ---

    // Função genérica de reprodução (para UI)
    function playSound(audioObject) 
    {
        if (!isMuted && audioObject) 
        {
            audioObject.currentTime = 0; 
            audioObject.play().catch(e => {
                console.warn("AudioEngine: Playback blocked (UI Sound).", e);
            });
        }
    }
    
    // Handler para sons de hover
    function handleHover(event) 
    {
        const target = event.currentTarget;
        if (target.classList.contains('menu-button')) 
        {
            playSound(menuHoverSound);
        } 
        else if (target.classList.contains('control-button') || target.classList.contains('choice-card')) {
            playSound(narrativeHoverSound);
        }
    }

    // --- Funções para gerir faixas de cena ---

    // Parar e limpar um audio object
    function stopAndClearAudio(audioObject) 
    {
        if (audioObject) 
        {
            audioObject.pause();
            audioObject.currentTime = 0; // Reinicia para a próxima vez
            // Opcional: Descarregar o recurso se a memória for um problema
            // audioObject.src = ''; 
            // audioObject.load();
        }
        return null; 
    }

    // Função para tocar uma nova faixa (música ou ambiente), com loop
    function playTrack(trackPath, currentAudioObject, loop = true) {
        // Para a faixa anterior, se existir
        currentAudioObject = stopAndClearAudio(currentAudioObject); 

        if (trackPath && !isMuted) {
            try 
            {
                // Cria um novo objeto de áudio
                const newTrack = new Audio(`assets/audio/${trackPath}`);
                newTrack.loop = loop;
                newTrack.play().catch(e => {
                    console.warn(`AudioEngine: Playback blocked (${trackPath}).`, e);
                });
                return newTrack; // Retorna o novo objeto de áudio
            } catch (e) {
                console.error(`AudioEngine: Failed to load track ${trackPath}.`, e);
                return null;
            }
        }
        return null;
    }
    
    // Função para tocar uma linha de voz (sem loop)
    function playVoicelineTrack(trackPath) {
        // Para a linha de voz anterior
        currentVoiceline = stopAndClearAudio(currentVoiceline); 

        if (trackPath && !isMuted) {
            try 
            {
                const newVoiceline = new Audio(`assets/audio/${trackPath}`);
                newVoiceline.loop = false; // Vozes não devem repetir
                newVoiceline.play().catch(e => {
                    console.warn(`AudioEngine: Playback blocked (Voiceline ${trackPath}).`, e);
                });
                return newVoiceline;
            } catch (e) {
                console.error(`AudioEngine: Failed to load voiceline ${trackPath}.`, e);
                return null;
            }
        }
        return null;
    }


    // --- Funções Públicas (Modificadas/Novas) ---

    function initialize() 
    {
        try 
        {
            // Carrega os sons de UI
            menuHoverSound = new Audio(PATH_HOVER_SOUND_MENU);
            menuHoverSound.preload = 'auto'; 
            narrativeHoverSound = new Audio(PATH_HOVER_SOUND_CONTINUE);
            narrativeHoverSound.preload = 'auto';
            
            // Não pré-carrega música/ambiente aqui, faremos on-demand
        } 
        catch (e) 
        {
            console.error("AudioEngine: Failed to load UI sounds during init.", e);
        }
    }

    // Alterna o estado de mute (agora também para/reinicia faixas)
    function toggleMute() 
    {
        isMuted = !isMuted;
        updateUI();
        
        if (!isMuted) 
        {
            if (currentMusic) currentMusic.play().catch(e => console.warn("AudioEngine: Music restart blocked.", e));
            if (currentAmbience) currentAmbience.play().catch(e => console.warn("AudioEngine: Ambience restart blocked.", e));
            // Voicelines não reiniciam automaticamente ao executar o unmute
        }
        else 
        {
            // Se mutar, stop
            if (currentMusic) currentMusic.pause();
            if (currentAmbience) currentAmbience.pause();
            if (currentVoiceline) currentVoiceline.pause();
        }
        
        updateButtonListeners(); // update hover listeners
        return !isMuted;
    }

    // Atualiza o ícone de áudio
    function updateUI() 
    {
        const icon = document.getElementById('audio-status-icon');
        if (icon) { icon.innerText = isMuted ? '🔇' : '🔊'; }
    }

    // Atualiza listeners de hover
    function updateButtonListeners() 
    {
        const buttons = document.querySelectorAll('.menu-button, .control-button, .choice-card');
        buttons.forEach(button => {
            if (!button.disabled) { 
                button.removeEventListener('mouseenter', handleHover);
                if (!isMuted) { button.addEventListener('mouseenter', handleHover); }
            }
        });
    }
    
    // --- NOVA Função Pública para Atualizar o Áudio da Cena ---
    /**
     * updateSceneAudio(audioConfig)
     * Para a música/ambiente/voz antiga e inicia as novas definidas no audioConfig da cena.
     * @param {object} audioConfig - O objeto 'audio' da cena atual (ex: { music: '...', ambience: '...', voiceline: '...' }).
     */
    function updateSceneAudio(audioConfig) 
    {
        if (!audioConfig) {
            // Se a cena não tiver bloco de áudio, para tudo? Ou mantém a música anterior? (Decisão de Design)
            // Por agora, vamos parar tudo para garantir limpeza.
            currentMusic = stopAndClearAudio(currentMusic);
            currentAmbience = stopAndClearAudio(currentAmbience);
            currentVoiceline = stopAndClearAudio(currentVoiceline);
            return;
        }

        // Toca as novas faixas (a função playTrack lida com parar as antigas)
        currentMusic = playTrack(audioConfig.music, currentMusic, true);
        currentAmbience = playTrack(audioConfig.ambience, currentAmbience, true);
        currentVoiceline = playVoicelineTrack(audioConfig.voiceline); // Sem loop
    }

    // --- MODULE PUBLIC EXPORT ---
    return {
        initialize: initialize,
        toggleMute: toggleMute,
        updateButtonListeners: updateButtonListeners, 
        updateSceneAudio: updateSceneAudio, // NOVA função exposta
        isMuted: () => isMuted
    };
})(); 


// --- Funções Globais (mantidas) ---

function toggleAudio() 
{ 
    AudioEngine.toggleMute(); 
}

function refreshAudioListeners() 
{ 
    AudioEngine.updateButtonListeners(); 
}