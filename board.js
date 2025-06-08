import { createBoard, eliminateOptionsByColumn, eliminateOptionsByRow, placeValueInBox, placeValueInColumn, placeValueInRow, reducePossibleValuesOfACell } from "./tools.js";


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
                console.log("One possible value: ["+(i+1)+", "+(j+1)+"] = "+value);
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
                            eliminateOptionsByColumn(this.board, this.possibleValues, boxRow, boxColumn, i, value);
                        }
                        // If row is in this box
                        if(Math.floor(i / 3) === boxRow) {
                            eliminateOptionsByRow(this.board, this.possibleValues, boxRow, boxColumn, i, value);
                        }
                    }
                }
            }
        }
        

        this.board = possibleBoardToBoard(this.possibleValues, this.board);
    }
}

export { Board };