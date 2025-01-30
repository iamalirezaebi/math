import { minimax } from './ai.js';

class TicTacToe {
    constructor() {
        this.board = null;
        this.boardSize = 3;
        this.currentPlayer = 'x';
        this.gameMode = 'pvp';
        this.aiDifficulty = 'easy';
        this.gameStatus = null;

        this.initializeElements();
        this.setupEventListeners();
        this.initGame();
    }

    initializeElements() {
        this.boardElement = document.getElementById('game-board');
        this.statusElement = document.getElementById('game-status');
        this.resetButton = document.getElementById('reset-btn');
        this.gameModeSelect = document.getElementById('game-mode');
        this.boardSizeSelect = document.getElementById('board-size');
        this.aiDifficultySelect = document.getElementById('ai-difficulty');
        this.themeToggle = document.getElementById('theme-switch');
    }

    setupEventListeners() {
        this.gameModeSelect.addEventListener('change', () => this.updateGameMode());
        this.boardSizeSelect.addEventListener('change', () => this.initGame());
        this.resetButton.addEventListener('click', () => this.initGame());
        this.themeToggle.addEventListener('change', () => this.toggleTheme());
    }

    initGame() {
        this.boardSize = parseInt(this.boardSizeSelect.value);
        this.currentPlayer = 'x';
        this.gameStatus = null;
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.updateGameMode();
        this.renderBoard();
    }

    updateGameMode() {
        this.gameMode = this.gameModeSelect.value;
        this.aiDifficultySelect.parentElement.style.display = 
            this.gameMode === 'ai' ? 'block' : 'none';
        
        if (this.gameMode === 'ai') {
            this.aiDifficulty = this.aiDifficultySelect.value;
        }
    }

    renderBoard() {
        this.boardElement.innerHTML = '';
        this.boardElement.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('game-board-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col]) {
                    cell.textContent = this.board[row][col];
                    cell.classList.add(this.board[row][col]);
                }
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                this.boardElement.appendChild(cell);
            }
        }

        this.updateStatus();
    }

    handleCellClick(row, col) {
        if (this.board[row][col] || this.gameStatus) return;

        this.board[row][col] = this.currentPlayer;
        this.renderBoard();
        this.checkGameStatus();

        if (!this.gameStatus && this.gameMode === 'ai') {
            this.playAIMove();
        } else {
            this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
        }
    }

    playAIMove() {
        const aiMove = this.getAIMove();
        if (aiMove) {
            this.board[aiMove.row][aiMove.col] = 'o';
            this.renderBoard();
            this.checkGameStatus();
            this.currentPlayer = 'x';
        }
    }

    getAIMove() {
        switch (this.aiDifficulty) {
            case 'easy':
                return this.getRandomMove();
            case 'medium':
                return this.getSmartMove();
            case 'hard':
                return minimax(this.board, 'o');
        }
    }

    getRandomMove() {
        const emptyCells = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (!this.board[row][col]) {
                    emptyCells.push({row, col});
                }
            }
        }
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    getSmartMove() {
        // Implement strategic move selection
        return this.getRandomMove();
    }

    checkGameStatus() {
        const winner = this.checkWinner();
        if (winner) {
            this.gameStatus = `برنده: ${winner.toUpperCase()}`;
            this.highlightWinningCells(winner);
        } else if (this.isBoardFull()) {
            this.gameStatus = 'مساوی';
        }

        this.updateStatus();
    }

    checkWinner() {
        const winLength = this.boardSize >= 5 ? 5 : this.boardSize >= 4 ? 4 : 3;

        // Check rows
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col <= this.boardSize - winLength; col++) {
                const line = this.board[row].slice(col, col + winLength);
                if (this.checkLine(line)) return line[0];
            }
        }

        // Check columns
        for (let col = 0; col < this.boardSize; col++) {
            for (let row = 0; row <= this.boardSize - winLength; row++) {
                const line = Array.from({length: winLength}, (_, i) => this.board[row + i][col]);
                if (this.checkLine(line)) return line[0];
            }
        }

        // Check diagonals
        for (let row = 0; row <= this.boardSize - winLength; row++) {
            for (let col = 0; col <= this.boardSize - winLength; col++) {
                // Main diagonal
                const mainDiagonal = Array.from({length: winLength}, (_, i) => this.board[row + i][col + i]);
                if (this.checkLine(mainDiagonal)) return mainDiagonal[0];

                // Anti-diagonal
                const antiDiagonal = Array.from({length: winLength}, (_, i) => this.board[row + i][col + winLength - 1 - i]);
                if (this.checkLine(antiDiagonal)) return antiDiagonal[0];
            }
        }

        return null;
    }

    checkLine(line) {
        return line.every(cell => cell && cell === line[0]);
    }

    highlightWinningCells(winner) {
        const cells = document.querySelectorAll('.game-board-cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            if (this.board[row][col] === winner) {
                cell.classList.add('winner');
            }
        });
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell));
    }

    updateStatus() {
        this.statusElement.textContent = this.gameStatus || `نوبت بازیکن ${this.currentPlayer.toUpperCase()}`;
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }
}

new TicTacToe();