
const boxCells = [
    [[], [], []], // Row 0
    [[], [], []], // Row 1
    [[], [], []]  // Row 2
];
for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxColumn = 0; boxColumn < 3; boxColumn++) {
        for (let column = boxColumn * 3; column < boxColumn * 3 + 3; column++) {
            for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
                boxCells[boxRow][boxColumn].push({row: row, column: column});
            }
        }
    }
}

export const cellToBox = (row, column) => {
    return {row: Math.floor(row / 3), column: Math.floor(column / 3)};
}

export const getBoxCells = (boxRow, boxColumn) => {
    return boxCells[boxRow][boxColumn];
}

export const getBoxCellsByCell = (row, column) => {
    return boxCells[Math.floor(row / 3)][Math.floor(column / 3)];
}

export const isValueInBox = (board, boxRow, boxColumn, value) => {
    // Get all cells of the box
    const cells = getBoxCells(boxRow, boxColumn);
    for (let i = 0; i < 9; i++) {
        if(board[cells[i].row][cells[i].column] === value) return true;
    }
    return false;
}

export const arrayAND = (array1, array2) => {
    const newArray = new Array(array1.length).fill(false);
    for (let i = 0; i < newArray.length; i++) {
        if(array1[i] && array2[i]) {
            newArray[i] = true;
        }
    }
    return newArray;
}

export const arrayOR = (array1, array2) => {
    const newArray = new Array(array1.length).fill(false);
    for (let i = 0; i < newArray.length; i++) {
        if(array1[i] || array2[i]) {
            newArray[i] = true;
        }
    }
    return newArray;
}

export const isValueInRow = (board, row, value) => {
    for (let column = 0; column < 9; column++) {
        if(board[row][column] === value) return true;
    }
    return false;
}

export const isValueInColumn = (board, column, value) => {
    for (let row = 0; row < 9; row++) {
        if(board[row][column] === value) return true;
    }
    return false;
}

export const createBoard = () => {
    const board = new Array(9);
    for (let i = 0; i < 9; i++) {
        board[i] = new Array(9).fill(0);
    }
    return board;
}

export const getValuesInBox = (board, boxRow, boxColumn) => {
    const cells = getBoxCells(boxRow, boxColumn);
    const values = new Array(9).fill(false);
    for (let i = 0; i < 9; i++) {
        if(board[cells[i].row][cells[i].column]) {
            values[board[cells[i].row][cells[i].column] - 1] = true;
        }
    }
    return values;
}

export const getValuesInRow = (board, row) => {
    const values = new Array(9).fill(false);
    for (let column = 0; column < 9; column++) {
        if(board[row][column]) {
            values[board[row][column] - 1] = true;
        }
    }
    return values;
}

export const getValuesInColumn = (board, column) => {
    const values = new Array(9).fill(false);
    for (let row = 0; row < 9; row++) {
        if(board[row][column]) {
            values[board[row][column] - 1] = true;
        }
    }
    return values;
}

export const reducePossibleValuesOfACell = (board, possibleValues, row, column) => {
    const boxCoords = cellToBox(row, column);
    const valuesInBox = getValuesInBox(board, boxCoords.row, boxCoords.column);
    const valuesInRow = getValuesInRow(board, row);
    const valuesInColumn = getValuesInColumn(board, column);

    // If the value is in same box, row, or column, remove from solutions
    for (let val = 0; val < 9; val++) {
        if(valuesInBox[val] || valuesInRow[val] || valuesInColumn[val]) {
            possibleValues[row][column][val] = false;
        }
    }
}


export const placeValueInRow = (board, possibleValues, row, value) => {
    // See where this value can go in the row
    let solution = null;
    for (let column = 0; column < 9; column++) {
        // Make sure this value is not already in the row
        if(board[row][column] === value) return;
        if(board[row][column]) continue;
        if(possibleValues[row][column][value - 1]) {
            if(solution !== null) return;
            solution = column;
        }
    }
    if(solution !== null) {
        console.log("place value in row: ["+(row+1)+", "+(solution+1)+"] = "+value);
        board[row][solution] = value;
    }
}

export const placeValueInColumn = (board, possibleValues, column, value) => {
    // See where this value can go in the column
    let solution = null;
    for (let row = 0; row < 9; row++) {
        // Make sure this value is not already in the column
        if(board[row][column] === value) return;
        if(board[row][column]) continue;
        if(possibleValues[row][column][value - 1]) {
            if(solution !== null) return;
            solution = row;
        }
    }
    if(solution !== null) {
        board[solution][column] = value;
        console.log("place value in column: ["+(solution+1)+", "+(column+1)+"] = "+value);
    }
}

export const placeValueInBox = (board, possibleValues, boxRow, boxColumn, value) => {
    const boxCoords = getBoxCells(boxRow, boxColumn);
    let solution = null;
    for (let i = 0; i < 9; i++) {
        // Make sure this value is not already in the box
        if(board[boxCoords[i].row][boxCoords[i].column] === value) return;
        if(board[boxCoords[i].row][boxCoords[i].column]) continue;
        if(possibleValues[boxCoords[i].row][boxCoords[i].column][value - 1]) {
            // If second possible place, can't deduce
            if(solution !== null) return;
            // Record first possible place
            solution = [boxCoords[i].row, boxCoords[i].column];
        }
    }
    if(solution !== null) {
        board[solution[0]][solution[1]] = value;
        console.log("place value in box: ["+(solution[0]+1)+", "+(solution[1]+1)+"] = "+value);
    }
}


// Eliminate options based on the knowledge of which column the
// same value will be in another block.
//
// Ex: if we know the 6 can only be in column 8 in the right-middle
// box, then we know the 6 cannot be in column 8 in the other two
// boxes.
export const eliminateOptionsByColumn = (board, possibleValues, boxRow, boxColumn, column, value) => {
    // See if this value is already placed in this box or column
    if(isValueInBox(board, boxRow, boxColumn, value) || isValueInColumn(board, column, value)) {
        return;
    }
    // See if the only place the value can be placed in this box is in that row
    const cells = getBoxCells(boxRow, boxColumn);
    for (let i = 0; i < 9; i++) {
        // Skip if in same column
        if(cells[i].column === column) continue;
        // If filled in already, skip
        if(board[cells[i].row][cells[i].column]) continue;
        // If can be placed elsewhere, stop
        if(possibleValues[cells[i].row][cells[i].column][value - 1]) return;
    }
    // If can't be placed in another column in this box, this value can't be in this column
    // in another box
    for (let row = 0; row < 9; row++) {
        if(board[row][column]) continue; // If already a value here, skip
        if(Math.floor(row / 3) === boxRow) continue; // Don't remove from this box
        if(possibleValues[row][column][value - 1]) {
            possibleValues[row][column][value - 1] = false;
            console.log("We know ["+(row+1)+", "+(column+1)+"] != "+value+" because "+value+" in column "+(column + 1)+" must be in box ["+(boxRow + 1)+", "+(boxColumn+1)+"]");
        }
    }
}

// See above (column) for description
export const eliminateOptionsByRow = (board, possibleValues, boxRow, boxColumn, row, value) => {
    // See if this value is already placed in this box or row
    if(isValueInBox(board, boxRow, boxColumn, value) || isValueInRow(board, row, value)) {
        return;
    }
    // See if the only place the value can be placed in this box is in that column
    const cells = getBoxCells(boxRow, boxColumn);
    for (let i = 0; i < 9; i++) {
        // Skip if in same row
        if(cells[i].row === row) continue;
        // If filled in already, skip
        if(board[cells[i].row][cells[i].column]) continue;
        // If can be placed elsewhere, stop
        if(possibleValues[cells[i].row][cells[i].column][value - 1]) return;
    }
    // If can't be placed in another row in this box, this value can't be in this row
    // in another box
    for (let column = 0; column < 9; column++) {
        if(board[row][column]) continue; // If already a value here, skip
        if(Math.floor(column / 3) === boxColumn) continue; // Don't remove from this box
        if(possibleValues[row][column][value - 1]) {
            possibleValues[row][column][value - 1] = false;
            console.log("We know ["+(row+1)+", "+(column+1)+"] != "+value+" because "+value+" in row "+(row + 1)+" must be in box ["+(boxRow + 1)+", "+(boxColumn+1)+"]");
        }
    }
}