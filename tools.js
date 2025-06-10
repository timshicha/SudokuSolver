
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

// See if two arrays are the same
export const comparePossibleValues = (possibleValuesArrays) => {
    for (let i = 0; i < 9; i++) {
        const possibleValue = possibleValuesArrays[0][i];
        for (let j = 1; j < possibleValuesArrays.length; j++) {
            if(possibleValuesArrays[j][i] !== possibleValue) return false;
        }
    }
    return true;
}

// See how many elements in an array are true
export const countPossibleValues = (possibleValues) => {
    let count = 0;
    for (let i = 0; i < 9; i++) {
        if(possibleValues[i]) count++;
    }
    return count;
}

export const getOtherRowsOrColumnsInBox = (rowOrColumn) => {
    if(rowOrColumn === 0) return [1, 2];
    if(rowOrColumn === 1) return [0, 2];
    if(rowOrColumn === 2) return [0, 1];
    if(rowOrColumn === 3) return [4, 5];
    if(rowOrColumn === 4) return [3, 5];
    if(rowOrColumn === 5) return [3, 4];
    if(rowOrColumn === 6) return [7, 8];
    if(rowOrColumn === 7) return [6, 8];
    if(rowOrColumn === 8) return [6, 7];
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

// Eliminate values IN this box if BOTH other boxes in this row require the value to be in one of other two rows
export const eliminateOptionsByRows = (board, possibleValues, boxRow, boxColumn, row, value) => {
    if(isValueInBox(board, boxRow, boxColumn, value) || isValueInRow(board, row, value)) {
        return;
    }
    // Other boxes
    const otherBoxColumns = getOtherRowsOrColumnsInBox(boxColumn);
    // Make sure both other boxes don't have this value
    if(isValueInBox(board, boxRow, otherBoxColumns[0], value) || isValueInBox(board, boxRow, otherBoxColumns[1], value)) return;
    // See if in both other boxes, this value cannot be in this row
    for (let i = 0; i < 2; i++) {
        const cells = getBoxCells(boxRow, otherBoxColumns[i]);
        for (let j = 0; j < 9; j++) {
            // If this value can be in another box in the same row
            if(!board[cells[j].row][cells[j].column] && cells[j].row === row && possibleValues[cells[j].row][cells[j].column][value - 1]) {
                // console.log(cells[j].row, cells[j].column, possibleValues[cells[j].row][cells[j].column]);
                return;
            }
        }
    }
    // If still here, then the value in this row must be in this box
    const cells = getBoxCells(boxRow, boxColumn);
    for (let i = 0; i < 9; i++) {
        // If already an item
        if(board[cells[i].row][cells[i].column]) continue;
        // If not in this row, remove from possible values
        if(cells[i].row !== row) {
            if(possibleValues[cells[i].row][cells[i].column][value - 1]) {
                possibleValues[cells[i].row][cells[i].column][value - 1] = false;
                console.log("We know ["+(cells[i].row+1)+", "+(cells[i].column+1)+"] != "+value+" because "+value+" must be in this row in one of the other two boxes");
            }
        }
    }
}

// Eliminate values IN this box if BOTH other boxes in this column require the value to be in one of other two columns
export const eliminateOptionsByColumns = (board, possibleValues, boxRow, boxColumn, column, value) => {
    if(isValueInBox(board, boxRow, boxColumn, value) || isValueInColumn(board, column, value)) {
        return;
    }
    // Other boxes
    const otherBoxRows = getOtherRowsOrColumnsInBox(boxRow);
    // Make sure both other boxes don't have this value
    if(isValueInBox(board, otherBoxRows[0], boxColumn, value) || isValueInBox(board, otherBoxRows[1], boxColumn, value)) return;
    // See if in both other boxes, this value cannot be in this row
    for (let i = 0; i < 2; i++) {
        const cells = getBoxCells(otherBoxRows[i], boxColumn);
        for (let j = 0; j < 9; j++) {
            // If this value can be in another box in the same column
            if(!board[cells[j].row][cells[j].column] && cells[j].column === column && possibleValues[cells[j].row][cells[j].column][value - 1]) {
                // console.log(cells[j].row, cells[j].column, possibleValues[cells[j].row][cells[j].column]);
                return;
            }
        }
    }
    // If still here, then the value in this column must be in this box
    const cells = getBoxCells(boxRow, boxColumn);
    for (let i = 0; i < 9; i++) {
        // If already an item
        if(board[cells[i].row][cells[i].column]) continue;
        // If in this column, remove from possible values
        if(cells[i].column !== column) {
            if(possibleValues[cells[i].row][cells[i].column][value - 1]) {
                possibleValues[cells[i].row][cells[i].column][value - 1] = false;
                console.log("We know ["+(cells[i].row+1)+", "+(cells[i].column+1)+"] != "+value+" because "+value+" must be in this column in one of the other two boxes");
            }
        }
    }
}

// See if two squares in a row have the same possible values and there's two possible values. If so, then none of the other squares in the row
// can have these values
export const eliminateOptionsInRowsByTwoPossibleValues = (board, possibleValues) => {
    for (let row = 0; row < 9; row++) {
        for (let column1 = 0; column1 < 8; column1++) {
            for (let column2 = column1 + 1; column2 < 9; column2++) {
                const possibleValues1 = possibleValues[row][column1];
                const possibleValues2 = possibleValues[row][column2];
                // If both have a count of two and the values are the same, remove these possible values from the rest of the row
                if(countPossibleValues(possibleValues1) === 2 && countPossibleValues(possibleValues2) === 2 && comparePossibleValues([possibleValues1, possibleValues2])) {
                    for (let removeColumn = 0; removeColumn < 9; removeColumn++) {
                        // Skip over the two columns
                        if(removeColumn === column1 || removeColumn === column2) continue;
                        // Remove the values
                        for (let value = 0; value < 9; value++) {
                            if(possibleValues1[value] && !board[row][removeColumn] && possibleValues[row][removeColumn][value]) {
                                possibleValues[row][removeColumn][value] = false;
                                console.log("We know ["+(row+1)+", "+(removeColumn+1)+"] != "+value+" because "+value+" must be in column "+(column1+1)+" or "+(column2+1)+" in this row.");
                            }
                        }
                    }
                }
            }
        }
    }
}

// See if three squares in a row have the same possible values and there's three possible values. If so, then none of the other squares in the row
// can have these values
export const eliminateOptionsInRowsByThreePossibleValues = (board, possibleValues) => {
    for (let row = 0; row < 9; row++) {
        for (let column1 = 0; column1 < 7; column1++) {
            for (let column2 = column1 + 1; column2 < 8; column2++) {
                for (let column3 = column2 + 1; column3 < 9; column3++) {
                    const possibleValues1 = possibleValues[row][column1];
                    const possibleValues2 = possibleValues[row][column2];
                    const possibleValues3 = possibleValues[row][column3];
                    // If both have a count of three and the values are the same, remove these possible values from the rest of the row
                    if(countPossibleValues(possibleValues1) === 3 && countPossibleValues(possibleValues2) === 3 &&
                        countPossibleValues(possibleValues3) && comparePossibleValues([possibleValues1, possibleValues2, possibleValues3])) {
                        for (let removeColumn = 0; removeColumn < 9; removeColumn++) {
                            // Skip over the three columns
                            if(removeColumn === column1 || removeColumn === column2 || removeColumn === column3) continue;
                            // Remove the values
                            for (let value = 0; value < 9; value++) {
                                if(possibleValues1[value] && !board[row][removeColumn] && possibleValues[row][removeColumn][value]) {
                                    possibleValues[row][removeColumn][value] = false;
                                    console.log("We know ["+(row+1)+", "+(removeColumn+1)+"] != "+(value+1)+" because "+(value+1)+" must be in column "+(column1+1)+", "+(column2+1)+", or "+(column3+1)+" in this row.");
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}