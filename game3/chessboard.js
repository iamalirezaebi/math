export function createChessboard() {
    const boardElement = document.getElementById('chessboard');
    boardElement.innerHTML = '';
    const board = [];

    for (let row = 0; row < 8; row++) {
        const rowArray = [];
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = row;
            square.dataset.col = col;
            boardElement.appendChild(square);
            rowArray.push(square);
        }
        board.push(rowArray);
    }

    return board;
}

export function isValidPlacement(board, row, col) {
    // Check row and column
    for (let i = 0; i < 8; i++) {
        if (board[row][i].querySelector('.queen') || board[i][col].querySelector('.queen')) {
            return false;
        }
    }

    // Check diagonals
    const directions = [
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let r = row + dx;
        let c = col + dy;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c].querySelector('.queen')) {
                return false;
            }
            r += dx;
            c += dy;
        }
    }

    return true;
}

export function checkAllQueensPlaced(board) {
    const queens = board.flat().filter(square => square.querySelector('.queen'));
    return queens.length === 8;
}