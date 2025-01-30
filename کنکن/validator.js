export function validateSolution(grid) {
    if (!grid || grid.length === 0) return false;

    return checkRowUniqueness(grid) && 
           checkColumnUniqueness(grid) && 
           checkCageConstraints(grid);
}

function checkRowUniqueness(grid) {
    for (const row of grid) {
        const values = row.map(cell => cell.value).filter(val => val !== null);
        const uniqueValues = new Set(values);
        if (uniqueValues.size !== values.length) {
            return false;
        }
    }
    return true;
}

function checkColumnUniqueness(grid) {
    const size = grid.length;
    for (let col = 0; col < size; col++) {
        const values = grid.map(row => row[col].value).filter(val => val !== null);
        const uniqueValues = new Set(values);
        if (uniqueValues.size !== values.length) {
            return false;
        }
    }
    return true;
}

function checkCageConstraints(grid) {
    // Group cells by their constraints
    const cageGroups = {};
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            if (cell.constraint) {
                const key = `${cell.constraint.target}-${cell.constraint.operation}`;
                if (!cageGroups[key]) {
                    cageGroups[key] = [];
                }
                cageGroups[key].push(cell);
            }
        }
    }

    // Validate each cage
    for (const group of Object.values(cageGroups)) {
        if (!validateCageConstraint(group)) {
            return false;
        }
    }

    return true;
}

function validateCageConstraint(cells) {
    const values = cells.map(cell => cell.value).filter(val => val !== null);
    
    // If not all cells are filled, consider it valid
    if (values.length !== cells.length) {
        return true;
    }

    const constraint = cells[0].constraint;
    switch (constraint.operation) {
        case '+':
            return values.reduce((a, b) => a + b, 0) === constraint.target;
        case '×':
            return values.reduce((a, b) => a * b, 1) === constraint.target;
        case '-':
            return Math.abs(values[0] - values[1]) === constraint.target;
        case '÷':
            return values[0] / values[1] === constraint.target || values[1] / values[0] === constraint.target;
        default:
            return false;
    }
}