"use strict"

var container = document.querySelector(".chess-container");
var piecesContainer = document.querySelector(".pieces-container");
var pxPerCase = 50;
var pieceID = 0;
var selected = -1;

var moveMatrixList = {
    "tower": [
        [   
            [-1, 0],
            [-2, 0],
            [-3, 0],
            [-4, 0],
            [-5, 0],
            [-6, 0],
            [-7, 0]
        ],
        [
            [0, -1],
            [0, -2],
            [0, -3],
            [0, -4],
            [0, -5],
            [0, -6],
            [0, -7]
        ],
        [   
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 0],
            [6, 0],
            [7, 0]
        ],
        [
            [0, 1],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6],
            [0, 7]
        ]
    ]
}

var plateau = []
var listPiece = []

class GamePiece {
    constructor(position, name, isWhite) {
        this.position = position;
        this.moveMatrix = moveMatrixList[name];
        this.id = pieceID;
        this.isWhite = isWhite;

        let el = document.createElement("div");
        el.classList.add("piece-" + pieceID, isWhite ? "white-piece" : "black-piece");
        el.style.top = (position[0] * 50).toString() + "px";
        el.style.left = (position[1] * 50).toString() + "px";
        // el.addEventListener('click', () => {
        //     let co = findInPlateau(this.id);
        //     document.querySelectorAll(".selected").forEach((el) => {
        //         el.classList.remove('selected');
        //     })
        //     document.querySelectorAll(".predict").forEach((el) => {
        //         el.classList.remove('predict');
        //     })
        //     document.querySelector(".row-" + co[0] + ".col-" + co[1]).classList.add("selected");
        //     selected = this.id;

        //     this.moveMatrix.forEach(array => {
        //         let isObstacle = false;
        //         for (let o = 0; o < array.length; o++) {
        //             const a = array[o];
        //             if(this.isMovePossible(a) == 0 || isObstacle){
        //                 break;
        //             }
        //             if(this.isMovePossible(a) == 2){
        //                 isObstacle = true;
        //             }
        //             document.querySelector(".row-" + (this.position[0] + a[0]) + ".col-" + (this.position[1] + a[1])).classList.add("predict");
        //         }
        //     });
        // })
        piecesContainer.appendChild(el);

        pieceID++;
    }

    isMovePossible([x, y]){
        let p0 = this.position[0] + x;
        let p1 = this.position[1] + y;
        if(p0 > 7 || p0 < 0 || p1 > 7 || p1 < 0){
            return 0;
        }
        let mtx = plateau[p0][p1];

        if(mtx != -1 && ((this.isWhite && listPiece[mtx].isWhite) || (!this.isWhite && !listPiece[mtx].isWhite))){
            return 0;
        }

        if(mtx != -1 && ((this.isWhite && !listPiece[mtx].isWhite) || (!this.isWhite && listPiece[mtx].isWhite))){
            return 2;
        }

        return 1
    }

    move(x, y) {
        let el = document.querySelector(".piece-" + this.id);
        plateau[this.position[0]][this.position[1]] = -1;
        plateau[x][y] = this.id;
        this.position = [x, y];
        el.style.top = (this.position[0] * 50).toString() + "px";
        el.style.left = (this.position[1] * 50).toString() + "px";
    }
}

function findInPlateau(search) {
    for (let i = 0; i < plateau.length; i++) {
        const array = plateau[i];
        for (let j = 0; j < array.length; j++) {
            if (array[j] == search) {
                return [i, j];
            }
        }
    }
}


for (let row = 0; row < 8; row++) {
    let rowMatrix = [];
    for (let col = 0; col < 8; col++) {
        rowMatrix.push(-1);
        let el = document.createElement("div");
        el.classList.add("row-" + row, "col-" + col);
        el.addEventListener('click', (elmt) => {
            //let pos = [row, col];
            if(el.classList.contains('predict')){
                document.querySelectorAll(".selected").forEach((a) => {
                    a.classList.remove('selected');
                })
                document.querySelectorAll(".predict").forEach((a) => {
                    a.classList.remove('predict');
                })
                let piece = listPiece[selected];
                if(plateau[row][col] != -1){
                    let targetedPiece = listPiece[plateau[row][col]];
                    if((piece.isWhite && targetedPiece.isWhite) || (!piece.isWhite && !targetedPiece.isWhite)){
                        return;
                    }else{
                        document.querySelector('.piece-' + targetedPiece.id).remove();
                    }
                }
                piece.move(row,col);
                
            }else{
                if(plateau[row][col] != -1){
                    document.querySelectorAll(".selected").forEach((a) => {
                        a.classList.remove('selected');
                    })
                    document.querySelectorAll(".predict").forEach((a) => {
                        a.classList.remove('predict');
                    })
                    el.classList.add("selected");
                    let pieceSelected = listPiece[plateau[row][col]];
                    selected = pieceSelected.id;

                    pieceSelected.moveMatrix.forEach(array => {
                        let isObstacle = false;
                        for (let o = 0; o < array.length; o++) {
                            const a = array[o];
                            if(pieceSelected.isMovePossible(a) == 0 || isObstacle){
                                break;
                            }
                            if(pieceSelected.isMovePossible(a) == 2){
                                isObstacle = true;
                            }
                            document.querySelector(".row-" + (pieceSelected.position[0] + a[0]) + ".col-" + (pieceSelected.position[1] + a[1])).classList.add("predict");
                        }
                    });
                }
            }
            // add movement 
        })
        container.appendChild(el);
    }
    plateau.push(rowMatrix);
}

// Add top pieces
for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
        plateau[row][col] = pieceID;
        listPiece.push(new GamePiece([row, col], "tower", true))
    }
}

// Add bottom pieces
for (let row = 6; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        plateau[row][col] = pieceID;
        listPiece.push(new GamePiece([row, col], "tower", false))
    }
}

listPiece[0].move(4,4);