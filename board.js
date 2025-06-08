
// Given a board of possible values, return a board with cells with only one value
// filled in and the rest left blank. If board is provided, update on the board
const possibleBoardToBoard = (possibleBoard, providedBoard=null) => {
    const board = createBoard();
    if(providedBoard) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                board[i][j] = providedBoard[i][j];
            }
        }
    }
    // Any cells that have only one possible value, fill that cell
    // with that possible value
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(board[i][j]) continue;
            let value = 0;
            for (let k = 0; k < 9; k++) {
                if(possibleBoard[i][j][k]) {
                    if(value) {
                        value = 0;
                        break;
                    }
                    value = k + 1;
                }
            }
            if(value) {
                board[i][j] = value;
                console.log("One possible value: ["+i+", "+j+"] = "+value);
            }
        }
    }
    return board;
}

// Any solutions not in reduceBy are removed from solution
const reduceSolution = (solution, reduceBy) => {
    for (let i = 0; i < 9; i++) {
        if(!reduceBy[i]) {
            solution[i] = false;
        }
    }
}

const getValuesInSameBox = (board, iValue, jValue) => {
    const iStart = Math.floor(iValue / 3) * 3;
    const iEnd = iStart + 3;
    const jStart = Math.floor(jValue / 3) * 3;
    const jEnd = jStart + 3;
    const values = new Array(9).fill(false);
    for (let i = iStart; i < iEnd; i++) {
        for (let j = jStart; j < jEnd; j++) {
            if(board[i][j]) {
                values[board[i][j] - 1] = true;
            }
        }
    }
    return values;
}

const getValuesInSameRow = (board, iValue, jValue) => {
    const values = new Array(9).fill(false);
    for (let j = 0; j < 9; j++) {
        if(board[iValue][j]) {
            values[board[iValue][j] - 1] = true;
        }
    }
    return values;
}

const getValuesInSameColumn = (board, iValue, jValue) => {
    const values = new Array(9).fill(false);
    for (let i = 0; i < 9; i++) {
        if(board[i][jValue]) {
            values[board[i][jValue] - 1] = true;
        }
    }
    return values;
}

// Given a board, calculate the possible solutions for i, j
const getPossibleValues = (board, i, j) => {
    const valuesInBox = getValuesInSameBox(board, i, j);
    const valuesInRow = getValuesInSameRow(board, i, j);
    const valuesInColumn = getValuesInSameColumn(board, i, j);

    const solutions = new Array(9).fill(true);
    // If the value is in same box, row, or column, remove from solutions
    for (let val = 0; val < 9; val++) {
        if(valuesInBox[val] || valuesInRow[val] || valuesInColumn[val]) {
            solutions[val] = false;
        }
    }
    return solutions;
}

const getOneHotValue = (array) => {
    let index = null;
    for (let i = 0; i < 9; i++) {
        if(array[i]) {
            if(index) return 0;
            index = i;
        }
    }
    return index;
}

const placeValueInRow = (board, row, value) => {
    // See where this value can go in the row
    let solution = null;
    for (let column = 0; column < 9; column++) {
        if(board[row][column]) continue;
        if(getPossibleValues(board, row, column)[value - 1]) {
            if(solution !== null) return;
            solution = column;
        }
    }
    if(solution !== null) {
        console.log("place value in row: ["+row+", "+solution+"] = "+value);
        board[row][solution] = value;
    }
}

const placeValueInColumn = (board, column, value) => {
    // See where this value can go in the column
    let solution = null;
    for (let row = 0; row < 9; row++) {
        if(board[row][column]) continue;
        if(getPossibleValues(board, row, column)[value - 1]) {
            if(solution !== null) return;
            solution = row;
        }
    }
    if(solution !== null) {
        board[solution][column] = value;
        console.log("place value in column: ["+solution+", "+column+"] = "+value);
    }
}

const placeValueInBox = (board, iBox, jBox, value) => {
    const iStart = iBox * 3;
    const iEnd = iStart + 3;
    const jStart = jBox * 3;
    const jEnd = jStart + 3;
    let solution = null;
    for (let i = iStart; i < iEnd; i++) {
        for (let j = jStart; j < jEnd; j++) {
            if(board[i][j]) continue;
            if(getPossibleValues(board, i, j)[value - 1]) {
                // If second possible place, can't deduce
                if(solution !== null) return;
                // Record first possible place
                solution = [i, j];
            }
        }
    }
    if(solution !== null) {
        board[solution[0]][solution[1]] = value;
        console.log("place value in box: ["+solution[0]+", "+solution[1]+"] = "+value);
    }
}

const createBoard = () => {
    const board = new Array(9);
    for (let i = 0; i < 9; i++) {
        board[i] = new Array(9).fill(0);
    }
    return board;
}

class Board {
    constructor () {
        this.board = createBoard();
        this.possibleValues = createBoard();

        this.theoreticalBoard = new Array(9);
        // Create the rows
        for (let i = 0; i < 9; i++) {
            // Create the columns
            this.theoreticalBoard[i] = new Array(9);

            // For each cell
            for (let j = 0; j < 9; j++) {
                this.possibleValues[i][j] = new Array(9).fill(true);
                this.theoreticalBoard[i][j] = new Array(9);
                // For each possibility of a cell
                for (let k = 0; k < 9; k++) {
                    this.theoreticalBoard[i][j][k] = createBoard();
                    for (let iBoard = 0; iBoard < 9; iBoard++) {
                        for (let jBoard = 0; jBoard < 9; jBoard++) {
                            this.theoreticalBoard[i][j][k][iBoard][jBoard] = new Array(9).fill(true);
                        }
                    }
                }
            }
        }
    }

    iterate = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.board[i][j]) continue;
                this.possibleValues[i][j] = getPossibleValues(this.board, i, j);
            }
        }
        // For each row and value
        for (let row = 0; row < 9; row++) {
            for (let value = 1; value <= 9; value++) {
                placeValueInRow(this.board, row, value);
            }
        }
        // For each column and value
        for (let column = 0; column < 9; column++) {
            for (let value = 1; value <= 9; value++) {
                placeValueInColumn(this.board, column, value);
            }
        }
        // For each box and value
        for (let rowBox = 0; rowBox < 3; rowBox++) {
            for (let columnBox = 0; columnBox < 3; columnBox++) {
                for (let value = 1; value <= 9; value++) {
                    placeValueInBox(this.board, rowBox, columnBox, value);
                }
            }
        }
        placeValueInBox(this.board, 1, 1, 2);

        this.board = possibleBoardToBoard(this.possibleValues, this.board);
    }
}

export { Board };