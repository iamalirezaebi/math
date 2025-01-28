export function initializeSounds() {
    const sounds = {
        place: document.getElementById('place-sound'),
        remove: document.getElementById('remove-sound'),
        success: document.getElementById('success-sound'),
        error: document.getElementById('error-sound')
    };

    const soundToggle = document.getElementById('sound-toggle');

    function playSound(soundName) {
        if (soundToggle.checked && sounds[soundName]) {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }

    return {
        playSound
    };
}