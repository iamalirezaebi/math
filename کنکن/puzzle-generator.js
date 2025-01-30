export function generateKenKenPuzzle(size, difficulty) {
    // Create an empty grid
    const grid = Array.from({ length: size }, () => 
        Array.from({ length: size }, () => ({
            value: null,
            constraint: null
        }))
    );

    // Simple constraint generation for demonstration
    const constraints = [
        { target: 6, operation: '+' },
        { target: 4, operation: '×' },
        { target: 3, operation: '-' },
        { target: 2, operation: '÷' }
    ];

    // Randomly assign constraints to groups of cells
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!grid[i][j].constraint) {
                const constraint = constraints[Math.floor(Math.random() * constraints.length)];
                
                // Randomly decide cage size (1-3 cells)
                const cageSize = Math.floor(Math.random() * 3) + 1;
                
                for (let k = 0; k < cageSize; k++) {
                    if (i + k < size) {
                        grid[i + k][j].constraint = constraint;
                    }
                }
            }
        }
    }

    return grid;
}