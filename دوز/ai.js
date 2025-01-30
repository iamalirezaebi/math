export function minimax(board, player, depth = 0, maximizingPlayer = true) {
    const scores = {
        x: -10 + depth,
        o: 10 - depth,
        draw: 0
    };

    const result = checkWinner(board);
    if (result !== null) {
        return scores[result];
    }

    if (maximizingPlayer) {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                if (!board[row][col]) {
                    board[row][col] = player;
                    const score = minimax(board, player === 'o' ? 'x' : 'o', depth + 1, false);
                    board[row][col] = null;

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {row, col};
                    }
                }
            }
        }

        return depth === 0 ? bestMove : bestScore;
    } else {
        let bestScore = Infinity;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                if (!board[row][col]) {
                    board[row][col] = player;
                    const score = minimax(board, player === 'o' ? 'x' : 'o', depth + 1, true);
                    board[row][col] = null;

                    bestScore = Math.min(score, bestScore);
                }
            }
        }

        return bestScore;
    }
}

function checkWinner(board) {
    const boardSize = board.length;
    const winLength = boardSize >= 5 ? 5 : boardSize >= 4 ? 4 : 3;

    // Check rows
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col <= boardSize - winLength; col++) {
            const line = board[row].slice(col, col + winLength);
            if (line.every(cell => cell && cell === line[0])) return line[0];
        }
    }

    // Check columns
    for (let col = 0; col < boardSize; col++) {
        for (let row = 0; row <= boardSize - winLength; row++) {
            const line = Array.from({length: winLength}, (_, i) => board[row + i][col]);
            if (line.every(cell => cell && cell === line[0])) return line[0];
        }
    }

    // Check diagonals
    for (let row = 0; row <= boardSize - winLength; row++) {
        for (let col = 0; col <= boardSize - winLength; col++) {
            // Main diagonal
            const mainDiagonal = Array.from({length: winLength}, (_, i) => board[row + i][col + i]);
            if (mainDiagonal.every(cell => cell && cell === mainDiagonal[0])) return mainDiagonal[0];

            // Anti-diagonal
            const antiDiagonal = Array.from({length: winLength}, (_, i) => board[row + i][col + winLength - 1 - i]);
            if (antiDiagonal.every(cell => cell && cell === antiDiagonal[0])) return antiDiagonal[0];
        }
    }

    // Check draw
    if (board.every(row => row.every(cell => cell))) return 'draw';

    return null;
}