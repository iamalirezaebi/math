import { createChessboard } from './chessboard.js';
import { initializeSounds } from './sounds.js';
import { setupTimer } from './timer.js';
import { handleQueenPlacement } from './queen-placement.js';
import { setupButtons } from './game-controls.js';

function initializeGame() {
    const board = createChessboard();
    const soundControls = initializeSounds();
    const timer = setupTimer();
    const queenPlacement = handleQueenPlacement(board, soundControls);
    setupButtons(board, timer, queenPlacement);
}

document.addEventListener('DOMContentLoaded', initializeGame);