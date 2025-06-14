import { Board } from "./board.js";

let board = new Board();

// board.board = [
//     [0,0,5,9,0,0,4,0,0],
//     [6,0,0,0,5,3,8,0,0],
//     [0,0,0,2,0,0,0,0,3],
//     [0,0,0,0,9,0,0,0,0],
//     [2,0,0,0,0,0,0,4,0],
//     [0,0,4,0,8,5,0,0,1],
//     [0,0,2,0,4,1,0,0,8],
//     [0,7,0,0,0,0,6,0,0],
//     [0,0,0,3,0,0,0,0,0]
// ];

let boardStr = [
    "006000000",
    "000870609",
    "001050000",
    "000704000",
    "079002500",
    "000000030",
    "010000060",
    "080010003",
    "004003090"
];

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        board.insertValue(i, j, Number(boardStr[i][j]));
    }
}

for(let i = 0; i < 50; i++) {
    board.iterate(i);
}

let str = "";
for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        str += board.board[i][j];
    }
    str += "\n";
}
console.log(str);
