class MagicSquareGame {
    constructor(size) {
        this.size = size;
        this.board = this.createBoard();
        this.targetSum = this.calculateTargetSum();
    }

    createBoard() {
        return Array(this.size).fill().map(() => 
            Array(this.size).fill(null)
        );
    }

    calculateTargetSum() {
        // محاسبه مجموع هدف بر اساس اندازه جدول
        return Math.floor((this.size * (this.size ** 2 + 1)) / 2);
    }

    validateCell(row, col, value) {
        this.board[row][col] = Number(value);
        return this.checkRowColDiagonals();
    }

    checkRowColDiagonals() {
        // بررسی سطرها
        const rowValid = this.board.every(row => 
            row.every(cell => cell !== null) && 
            row.reduce((a, b) => a + b) === this.targetSum
        );

        // بررسی ستون‌ها
        const colValid = Array.from({length: this.size}, (_, colIndex) => 
            this.board.map(row => row[colIndex])
        ).every(col => 
            col.every(cell => cell !== null) && 
            col.reduce((a, b) => a + b) === this.targetSum
        );

        // بررسی قطرها
        const mainDiagonalSum = this.board.reduce((sum, row, i) => sum + row[i], 0);
        const antiDiagonalSum = this.board.reduce((sum, row, i) => sum + row[this.size - 1 - i], 0);
        
        const diagonalValid = 
            this.board.every(row => row.every(cell => cell !== null)) &&
            mainDiagonalSum === this.targetSum &&
            antiDiagonalSum === this.targetSum;

        return rowValid && colValid && diagonalValid;
    }
}

class MagicSquareUI {
    constructor() {
        this.boardSizeSelect = document.getElementById('board-size');
        this.startGameButton = document.getElementById('start-game');
        this.gameBoardElement = document.getElementById('game-board');
        this.statusMessageElement = document.getElementById('status-message');

        this.startGameButton.addEventListener('click', () => this.initGame());
    }

    initGame() {
        const size = Number(this.boardSizeSelect.value);
        this.game = new MagicSquareGame(size);
        this.renderBoard(size);
    }

    renderBoard(size) {
        this.gameBoardElement.innerHTML = '';
        this.gameBoardElement.style.gridTemplateColumns = `repeat(${size}, 60px)`;

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.classList.add('game-cell');

                const input = document.createElement('input');
                input.type = 'number';
                input.addEventListener('input', (e) => this.onCellInput(row, col, e.target.value));

                cell.appendChild(input);
                this.gameBoardElement.appendChild(cell);
            }
        }
    }

    onCellInput(row, col, value) {
        const cell = this.gameBoardElement.children[row * this.game.size + col];
        
        if (value === '' || isNaN(Number(value))) {
            cell.classList.remove('valid', 'invalid');
            return;
        }

        const isValid = this.game.validateCell(row, col, value);

        cell.classList.toggle('valid', isValid);
        cell.classList.toggle('invalid', !isValid);

        this.updateStatusMessage(isValid);
    }

    updateStatusMessage(isValid) {
        this.statusMessageElement.textContent = isValid 
            ? 'آفرین! مربع جادویی در حال شکل گیری است.' 
            : 'مجموع سطرها، ستون‌ها یا قطرها هنوز برابر نیستند.';
        
        this.statusMessageElement.classList.toggle('success', isValid);
        this.statusMessageElement.classList.toggle('error', !isValid);
    }
}

new MagicSquareUI();