import { generateKenKenPuzzle } from './puzzle-generator.js';
import { validateSolution } from './validator.js';

class KenKenGame {
    constructor() {
        this.gridSize = 4;
        this.difficulty = 'medium';
        this.grid = null;
        this.selectedCell = null;
        this.moveHistory = [];
        
        // Ensure DOM is fully loaded before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeGame());
        } else {
            this.initializeGame();
        }
    }

    initializeGame() {
        this.initializeEventListeners();
        this.startNewGame();
    }

    initializeEventListeners() {
        // Game control event listeners
        const newGameBtn = document.getElementById('new-game');
        const gridSizeSelect = document.getElementById('grid-size');
        const difficultySelect = document.getElementById('difficulty');
        const darkModeToggle = document.getElementById('dark-mode-checkbox');

        if (newGameBtn) newGameBtn.addEventListener('click', () => this.startNewGame());
        if (gridSizeSelect) gridSizeSelect.addEventListener('change', (e) => {
            this.gridSize = parseInt(e.target.value);
            this.startNewGame();
        });
        if (difficultySelect) difficultySelect.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.startNewGame();
        });

        this.setupDarkMode();
        this.setupNumberSelectors();
        this.setupGameActions();
    }

    setupDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-checkbox');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
            });
        }
    }

    startNewGame() {
        this.grid = generateKenKenPuzzle(this.gridSize, this.difficulty);
        this.renderGrid();
        this.startTimer();
        this.moveHistory = [];
    }

    renderGrid() {
        const gridContainer = document.getElementById('kenken-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        for (let rowIndex = 0; rowIndex < this.gridSize; rowIndex++) {
            for (let colIndex = 0; colIndex < this.gridSize; colIndex++) {
                const cellElement = document.createElement('div');
                cellElement.classList.add('kenken-cell');
                cellElement.dataset.row = rowIndex;
                cellElement.dataset.col = colIndex;

                const cell = this.grid[rowIndex][colIndex];
                if (cell.constraint) {
                    const constraintElement = document.createElement('span');
                    constraintElement.classList.add('cage-constraint');
                    constraintElement.textContent = `${cell.constraint.target}${cell.constraint.operation}`;
                    cellElement.appendChild(constraintElement);
                }

                cellElement.addEventListener('click', () => this.selectCell(cellElement));
                gridContainer.appendChild(cellElement);
            }
        }
    }

    selectCell(cellElement) {
        // Remove highlight from previously selected cell
        const previousSelected = document.querySelector('.kenken-cell.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Highlight new cell
        cellElement.classList.add('selected');
        this.selectedCell = cellElement;
    }

    setupNumberSelectors() {
        const numberButtons = document.querySelectorAll('.number-btn');
        numberButtons.forEach(button => {
            button.addEventListener('click', () => this.setSelectedCellValue(button.textContent));
        });

        const eraseButton = document.querySelector('.erase-btn');
        if (eraseButton) {
            eraseButton.addEventListener('click', () => this.eraseSelectedCell());
        }
    }

    setupGameActions() {
        const undoBtn = document.getElementById('undo-btn');
        const checkBtn = document.getElementById('check-btn');
        const hintBtn = document.getElementById('hint-btn');

        if (undoBtn) undoBtn.addEventListener('click', () => this.undoLastMove());
        if (checkBtn) checkBtn.addEventListener('click', () => this.checkSolution());
        if (hintBtn) hintBtn.addEventListener('click', () => this.showHint());
    }

    setSelectedCellValue(value) {
        if (this.selectedCell) {
            // Store previous state for undo
            const row = parseInt(this.selectedCell.dataset.row);
            const col = parseInt(this.selectedCell.dataset.col);
            
            this.moveHistory.push({
                cell: this.selectedCell,
                previousValue: this.selectedCell.textContent
            });

            this.selectedCell.textContent = value;
            
            // Update the grid data structure
            if (this.grid && this.grid[row]) {
                this.grid[row][col].value = parseInt(value);
            }
        }
    }

    eraseSelectedCell() {
        if (this.selectedCell) {
            // Store previous state for undo
            this.moveHistory.push({
                cell: this.selectedCell,
                previousValue: this.selectedCell.textContent
            });

            this.selectedCell.textContent = '';
            
            // Clear the value in the grid data structure
            const row = parseInt(this.selectedCell.dataset.row);
            const col = parseInt(this.selectedCell.dataset.col);
            if (this.grid && this.grid[row]) {
                this.grid[row][col].value = null;
            }
        }
    }

    undoLastMove() {
        if (this.moveHistory.length > 0) {
            const lastMove = this.moveHistory.pop();
            lastMove.cell.textContent = lastMove.previousValue;
            
            // Update grid data structure if needed
            const row = parseInt(lastMove.cell.dataset.row);
            const col = parseInt(lastMove.cell.dataset.col);
            if (this.grid && this.grid[row]) {
                this.grid[row][col].value = lastMove.previousValue 
                    ? parseInt(lastMove.previousValue) 
                    : null;
            }
        }
    }

    checkSolution() {
        // Collect current grid state
        const currentGridState = this.getCurrentGridState();
        
        const isValid = validateSolution(currentGridState);
        if (isValid) {
            alert('آفرین! راه حل شما درست است.');
        } else {
            alert('متأسفانه، راه حل شما اشتباه است. دوباره امتحان کنید.');
        }
    }

    getCurrentGridState() {
        // Convert the current UI grid to a data structure for validation
        const gridState = [];
        const gridContainer = document.getElementById('kenken-grid');
        
        if (!gridContainer) return [];

        const cells = gridContainer.querySelectorAll('.kenken-cell');
        for (let i = 0; i < this.gridSize; i++) {
            const row = [];
            for (let j = 0; j < this.gridSize; j++) {
                const cellIndex = i * this.gridSize + j;
                const cellElement = cells[cellIndex];
                const value = cellElement ? parseInt(cellElement.textContent) || null : null;
                
                row.push({
                    value: value,
                    constraint: this.grid[i][j].constraint
                });
            }
            gridState.push(row);
        }
        
        return gridState;
    }

    showHint() {
        alert('راهنما: سعی کنید اعداد مفقوده را با توجه به محدودیت‌های قفس‌ها پر کنید.');
    }

    startTimer() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;

        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        let time = 0;
        this.timerInterval = setInterval(() => {
            time++;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

// Create game instance
new KenKenGame();