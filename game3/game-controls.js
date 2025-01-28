export function setupButtons(board, timer, queenPlacement) {
    const resetBtn = document.getElementById('reset-btn');
    const hintBtn = document.getElementById('hint-btn');
    const rulesModal = document.getElementById('rules-modal');
    const closeModalBtn = document.querySelector('.close');

    resetBtn.addEventListener('click', () => {
        queenPlacement.reset();
        timer.reset();
        timer.start();
    });

    hintBtn.addEventListener('click', () => {
        queenPlacement.addQueen();
    });

    // Rules Modal
    document.querySelector('.game-buttons').onclick = function(e) {
        if (e.target.id === 'rules-btn') {
            rulesModal.style.display = 'block';
        }
    };

    closeModalBtn.onclick = function() {
        rulesModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == rulesModal) {
            rulesModal.style.display = 'none';
        }
    };

    // Start timer on initial load
    timer.start();
}