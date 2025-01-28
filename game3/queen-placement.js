import { isValidPlacement, checkAllQueensPlaced } from './chessboard.js';

export function handleQueenPlacement(board, soundControls) {
    let draggedQueen = null;

    function createQueen() {
        const queen = document.createElement('div');
        queen.classList.add('queen');
        queen.draggable = true;

        queen.addEventListener('dragstart', (e) => {
            draggedQueen = e.target;
            soundControls.playSound('remove');
            e.dataTransfer.setData('text/plain', '');
        });

        return queen;
    }

    function setupSquareEvents() {
        board.flat().forEach(square => {
            square.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            square.addEventListener('drop', (e) => {
                e.preventDefault();
                if (!draggedQueen) return;
                handleQueenPlacement(square);
                draggedQueen = null;
            });

            square.addEventListener('click', () => {
                handleQueenPlacement(square);
            });
        });

        function handleQueenPlacement(square) {
            const existingQueen = square.querySelector('.queen');
            if (existingQueen) {
                existingQueen.remove();
            }

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);

            if (isValidPlacement(board, row, col)) {
                const queen = createQueen();
                square.appendChild(queen);
                soundControls.playSound('place');
                checkGameStatus();
            } else {
                soundControls.playSound('error');
                highlightInvalidMoves(row, col);
            }
        }
    }

    function highlightInvalidMoves(row, col) {
        const gameStatus = document.getElementById('game-status');
        gameStatus.textContent = 'این حرکت مجاز نیست!';
        gameStatus.style.color = 'red';

        const squares = board.flat();
        squares.forEach(sq => sq.classList.remove('error-highlight'));

        const invalidSquares = board.flat().filter(square => 
            parseInt(square.dataset.row) === row || 
            parseInt(square.dataset.col) === col ||
            Math.abs(parseInt(square.dataset.row) - row) === Math.abs(parseInt(square.dataset.col) - col)
        );

        invalidSquares.forEach(sq => sq.classList.add('error-highlight'));

        setTimeout(() => {
            gameStatus.textContent = '';
            squares.forEach(sq => sq.classList.remove('error-highlight'));
        }, 1000);
    }

    function checkGameStatus() {
        if (checkAllQueensPlaced(board)) {
            const gameStatus = document.getElementById('game-status');
            gameStatus.textContent = 'تبریک! شما مسئله را حل کردید.';
            gameStatus.style.color = 'green';
            // Stop timer and handle success
        }
    }

    function reset() {
        board.flat().forEach(square => {
            const queen = square.querySelector('.queen');
            if (queen) queen.remove();
        });
        const gameStatus = document.getElementById('game-status');
        gameStatus.textContent = '';
    }

    setupSquareEvents();

    function addQueen() {
        const emptySquares = board.flat().filter(square => !square.querySelector('.queen'));
        if (emptySquares.length > 0) {
            const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            randomSquare.appendChild(createQueen());
        }
    }

    return {
        createQueen,
        reset,
        addQueen
    };
}