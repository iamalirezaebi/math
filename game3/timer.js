export function setupTimer() {
    const timerDisplay = document.getElementById('timer-display');
    const bestTimeDisplay = document.getElementById('best-time');
    let startTime, timerInterval;

    function formatNumber(num) {
        return num.toLocaleString('fa-IR', {minimumIntegerDigits: 2});
    }

    function updateDisplay(time) {
        const hours = formatNumber(Math.floor(time / 3600000));
        const minutes = formatNumber(Math.floor((time % 3600000) / 60000));
        const seconds = formatNumber(Math.floor((time % 60000) / 1000));
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function start() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const currentTime = Date.now() - startTime;
            updateDisplay(currentTime);
        }, 1000);
    }

    function stop() {
        clearInterval(timerInterval);
        const elapsedTime = Date.now() - startTime;
        
        const bestTime = localStorage.getItem('best-time');
        if (!bestTime || elapsedTime < parseInt(bestTime)) {
            localStorage.setItem('best-time', elapsedTime.toString());
            updateBestTimeDisplay(elapsedTime);
        }
    }

    function updateBestTimeDisplay(time) {
        const hours = formatNumber(Math.floor(time / 3600000));
        const minutes = formatNumber(Math.floor((time % 3600000) / 60000));
        const seconds = formatNumber(Math.floor((time % 60000) / 1000));
        bestTimeDisplay.textContent = `بهترین زمان: ${hours}:${minutes}:${seconds}`;
    }

    function reset() {
        clearInterval(timerInterval);
        updateDisplay(0);
    }

    // Load best time on initialization
    const bestTime = localStorage.getItem('best-time');
    if (bestTime) {
        updateBestTimeDisplay(parseInt(bestTime));
    }

    return {
        start,
        stop,
        reset
    };
}