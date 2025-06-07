
// Given a board, calculate the possible solutions for i, j
const reducePossibleSolutions = (board, i, j, solutions) => {
    
    let iBox = Math.floor(i / 3);
    let jBox = Math.floor(j / 3);
    
    // Look for values in the same column
    for (let iTest = 0; iTest <  9; iTest++) {
        if(i === iTest) continue; // Skip is own square
        // If there's a value, remove from possible solutions
        if(board[iTest][j]) {
            solutions[board[iTest][j] - 1] = false;
        }
    }
    // Look for values in the same column
    for (let jTest = 0; jTest < 9; jTest++) {
        if(j === jTest) continue; // Skip own square
        if(board[i][jTest]) {
            solutions[board[i][jTest] - 1] = false;
        }
    }
    // Look for values in the same box
    for (let iTest = iBox * 3; iTest < iBox * 3 + 3; iTest++) {
        for (let jTest = jBox * 3; jTest < jBox * 3 + 3; jTest++) {
            if(i === iTest && j === jTest) continue; // Skip own square
            if(board[iTest][jTest]) {
                solutions[board[iTest][jTest] - 1] = false;
            }
        }
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
                // Reduce possible solutions from each square
                reducePossibleSolutions(this.board, i, j, this.possibleValues[i][j]);
            }
        }

        // For squares that are not filled, see if there's only one possible solution
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(this.board[i][j]) continue;
                let value = 0;
                for (let k = 0; k < 9; k++) {
                    if(this.possibleValues[i][j][k]) {
                        // If second value found, we can't deduce
                        if(value) {
                            value = 0;
                            break;
                        }
                        value = k + 1;
                    }
                }
                this.board[i][j] = value;
            }
        }
    }
}

export { Board };