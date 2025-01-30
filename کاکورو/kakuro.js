import { KakuroGame } from './kakuro-game.js';
import { KakuroGenerator } from './kakuro-generator.js';

class KakuroApp {
    constructor() {
        this.game = null;
        this.generator = new KakuroGenerator();
        this.theme = 'light';
        this.initializeEventListeners();
        this.setupThemeToggle();
        this.startNewGame(); 
    }

    initializeEventListeners() {
        document.getElementById('new-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('hint').addEventListener('click', () => this.requestHint());
        document.getElementById('solve').addEventListener('click', () => this.solveGame());
        document.getElementById('difficulty').addEventListener('change', () => this.startNewGame());
        document.getElementById('board-size').addEventListener('change', () => this.startNewGame());

        document.addEventListener('keydown', (e) => {
            const validNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Delete'];
            if (validNumbers.includes(e.key)) {
                const activeCell = document.querySelector('.kakuro-cell.active');
                if (activeCell) {
                    const row = parseInt(activeCell.dataset.row);
                    const col = parseInt(activeCell.dataset.col);
                    
                    const number = e.key === 'Backspace' || e.key === 'Delete' ? null : parseInt(e.key);
                    this.handleNumberInput(row, col, number);
                }
            }
        });
    }

    setupThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        themeSwitch.addEventListener('click', () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.theme);
        });
    }

    startNewGame() {
        const difficulty = document.getElementById('difficulty').value;
        const size = parseInt(document.getElementById('board-size').value);
        
        const puzzle = this.generator.generatePuzzle(size, difficulty);
        this.game = new KakuroGame(puzzle);
        this.renderBoard();
    }

    renderBoard() {
        const boardContainer = document.getElementById('kakuro-board');
        boardContainer.innerHTML = '';
        boardContainer.style.gridTemplateColumns = `repeat(${this.game.size}, 1fr)`;

        this.game.board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('kakuro-cell');
                
                if (cell.type === 'black') {
                    cellElement.classList.add('black-cell');
                    if (cell.downSum || cell.rightSum) {
                        cellElement.classList.add('black-cell-diagonal');
                        cellElement.textContent = 
                            `${cell.downSum || ''}\n${cell.rightSum || ''}`;
                    }
                } else {
                    cellElement.classList.add('white-cell');
                    cellElement.setAttribute('data-row', rowIndex);
                    cellElement.setAttribute('data-col', colIndex);
                    cellElement.textContent = cell.value || '';
                    
                    cellElement.addEventListener('click', () => {
                        document.querySelectorAll('.kakuro-cell').forEach(c => c.classList.remove('active'));
                        
                        cellElement.classList.add('active');
                        
                        this.showNumberInput(rowIndex, colIndex);
                    });
                }

                boardContainer.appendChild(cellElement);
            });
        });
    }

    showNumberInput(row, col) {
        const modal = document.getElementById('number-input-modal');
        modal.style.display = 'block';

        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(btn => {
            btn.onclick = () => {
                const number = btn.dataset.number;
                this.handleNumberInput(row, col, number === '0' ? null : parseInt(number));
                modal.style.display = 'none';
            };
        });

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    handleNumberInput(row, col, number) {
        const validMove = this.game.setNumber(row, col, number);
        this.renderBoard();

        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = validMove ? '' : 'حرکت نامعتبر!';
        statusMessage.style.color = validMove ? 'green' : 'red';

        if (this.game.isComplete()) {
            statusMessage.textContent = 'تبریک! پازل حل شد.';
            statusMessage.style.color = 'green';
        }
    }

    requestHint() {
        console.log('Hint requested');
    }

    solveGame() {
        console.log('Solving game');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new KakuroApp();
});