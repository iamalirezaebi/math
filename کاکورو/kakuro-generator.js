export class KakuroGenerator {
    generatePuzzle(size, difficulty) {
        const complexities = {
            'easy': { 
                minSum: 3, 
                maxSum: 10, 
                maxCellValue: 5, 
                blackCellRatio: 0.2 
            },
            'medium': { 
                minSum: 10, 
                maxSum: 20, 
                maxCellValue: 7, 
                blackCellRatio: 0.3 
            },
            'hard': { 
                minSum: 20, 
                maxSum: 35, 
                maxCellValue: 9, 
                blackCellRatio: 0.4 
            }
        };

        const config = complexities[difficulty];
        const board = this.createEmptyBoard(size);
        
        this.addBlackCells(board, config);
        this.assignSums(board, config);
        this.fillValidPuzzle(board, config);

        return board;
    }

    createEmptyBoard(size) {
        return Array.from({ length: size }, () => 
            Array.from({ length: size }, () => ({ type: 'white', value: null }))
        );
    }

    addBlackCells(board, config) {
        const size = board.length;
        const totalBlackCells = Math.floor(size * size * config.blackCellRatio);

        // Ensure borders and some internal cells are black
        for (let i = 0; i < size; i++) {
            board[0][i] = { type: 'black', downSum: null, rightSum: null };
            board[i][0] = { type: 'black', downSum: null, rightSum: null };
        }

        // Randomly add more black cells
        let blackCellsAdded = size * 2;
        while (blackCellsAdded < totalBlackCells) {
            const row = Math.floor(Math.random() * size);
            const col = Math.floor(Math.random() * size);

            if (board[row][col].type === 'white') {
                board[row][col] = {
                    type: 'black', 
                    downSum: null, 
                    rightSum: null
                };
                blackCellsAdded++;
            }
        }

        return board;
    }

    assignSums(board, config) {
        const size = board.length;
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col].type === 'black') {
                    // Check for potential row sum
                    if (this.canHaveRowSum(board, row, col)) {
                        board[row][col].rightSum = 
                            Math.floor(Math.random() * (config.maxSum - config.minSum + 1)) + config.minSum;
                    }

                    // Check for potential column sum
                    if (this.canHaveColumnSum(board, row, col)) {
                        board[row][col].downSum = 
                            Math.floor(Math.random() * (config.maxSum - config.minSum + 1)) + config.minSum;
                    }
                }
            }
        }
    }

    canHaveRowSum(board, row, col) {
        // Check if there's a white cell to the right
        return col + 1 < board.length && board[row][col + 1].type === 'white';
    }

    canHaveColumnSum(board, row, col) {
        // Check if there's a white cell below
        return row + 1 < board.length && board[row + 1][col].type === 'white';
    }

    fillValidPuzzle(board, config) {
        // This is a simplified placeholder
        // A real implementation would use a constraint satisfaction algorithm
        const size = board.length;
        const maxAttempts = 100;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let valid = true;
            
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (board[row][col].type === 'white') {
                        board[row][col].value = 
                            Math.floor(Math.random() * config.maxCellValue) + 1;
                    }
                }
            }

            if (valid) break;
        }

        return board;
    }
}