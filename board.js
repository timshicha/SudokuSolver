import { cellToBox, countPossibleValues, createBoard, eliminateOptionsByColumn, eliminateOptionsByColumns, eliminateOptionsByRow, eliminateOptionsByRows, eliminateOptionsInBoxesByThreePossibleValues, eliminateOptionsInBoxesByTwoPossibleValues, eliminateOptionsInColumnsByThreePossibleValues, eliminateOptionsInColumnsByTwoPossibleValues, eliminateOptionsInRowsByThreePossibleValues, eliminateOptionsInRowsByTwoPossibleValues, getCount, insertValue, isPossible, isValueInBox, isValueInColumn, isValueInRow, placeValueInBox, placeValueInColumn, placeValueInRow, reducePossibleValuesOfACell } from "./tools.js";


// Given a board of possible values, return a board with cells with only one value
// filled in and the rest left blank. If board is provided, update on the board
const possibleBoardToBoard = (board, possibleValues) => {
    // Any cells that have only one possible value, fill that cell
    // with that possible value
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(countPossibleValues(possibleValues[i][j]) === 1) {
                // Get the possible value
                for (let value = 1; value <= 9; value++) {
                    if(isPossible(board, possibleValues, i, j, value)) {
                        console.log(`${getCount()}... Insert ${value} to [${i+1}, ${j+1}] since no other value can go here.`);
                        insertValue(board, possibleValues, i, j, value);
                    }
                }
            }
        }
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
            }
        }
    }

    insertValue = (row, column, value) => {
        insertValue(this.board, this.possibleValues, row, column, value);
    }

    iterate = (iteration = 1000) => {

        // Update possible values
        for (let row = 0; row < 9; row++) {
            for (let column = 0; column < 9; column++) {
                for (let value = 1; value <= 9; value++) {
                    let cellBox = cellToBox(row, column);
                    if(isValueInBox(this.board, cellBox.row, cellBox.column, value)) {
                        this.possibleValues[row][column][value - 1] = false;
                    }
                    if(isValueInRow(this.board, row, value)) {
                        this.possibleValues[row][column][value - 1] = false;
                    }
                    if(isValueInColumn(this.board, column, value)) {
                        this.possibleValues[row][column][value - 1] = false;
                    }
                }
            }
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.board[i][j]) continue;
                reducePossibleValuesOfACell(this.board, this.possibleValues, i, j);
            }
        }
        // For each row and value, see if that value can only be placed in one cell in that row
        for (let row = 0; row < 9; row++) {
            for (let value = 1; value <= 9; value++) {
                placeValueInRow(this.board, this.possibleValues, row, value);
            }
        }
        // For each column and value, see if that value can only be placed in one cell in that column
        for (let column = 0; column < 9; column++) {
            for (let value = 1; value <= 9; value++) {
                placeValueInColumn(this.board, this.possibleValues, column, value);
            }
        }
        // For each box and value, see if that value can only be placed in one cell in that box
        for (let rowBox = 0; rowBox < 3; rowBox++) {
            for (let columnBox = 0; columnBox < 3; columnBox++) {
                for (let value = 1; value <= 9; value++) {
                    placeValueInBox(this.board, this.possibleValues, rowBox, columnBox, value);
                }
            }
        }

        // For each box/value/(column and row)combo
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxColumn = 0; boxColumn < 3; boxColumn++) {
                for (let value = 1; value <= 9; value++) {
                    // For each row or column
                    for (let i = 0; i < 9; i++) {
                        if(Math.floor(i / 3) === boxColumn) {
                            
                            if(iteration > 10) {
                                eliminateOptionsByColumn(this.board, this.possibleValues, boxRow, boxColumn, i, value);
                            }
                            if(iteration > 15) {
                                eliminateOptionsByColumns(this.board, this.possibleValues, boxRow, boxColumn, i, value);
                            }
                        }
                        // If row is in this box
                        if(Math.floor(i / 3) === boxRow) {
                            
                            if(iteration > 10) {
                                eliminateOptionsByRow(this.board, this.possibleValues, boxRow, boxColumn, i, value);
                            }
                            if(iteration > 15) {
                                eliminateOptionsByRows(this.board, this.possibleValues, boxRow, boxColumn, i, value);
                            }
                        }
                    }
                }
            }
        }
        
        if(iteration > 20) {
            eliminateOptionsInRowsByTwoPossibleValues(this.board, this.possibleValues);
            eliminateOptionsInRowsByThreePossibleValues(this.board, this.possibleValues);
            eliminateOptionsInColumnsByTwoPossibleValues(this.board, this.possibleValues);
            eliminateOptionsInColumnsByThreePossibleValues(this.board, this.possibleValues);
            eliminateOptionsInBoxesByTwoPossibleValues(this.board, this.possibleValues);
            eliminateOptionsInBoxesByThreePossibleValues(this.board, this.possibleValues);
        }

        this.board = possibleBoardToBoard(this.board, this.possibleValues);
    }
}

export { Board };