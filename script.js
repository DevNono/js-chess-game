"use strict"

// TODO: Solve problem while in check can't move other pieces
// TODO: Solve problem when a pawn can "jump" above pieces if he moves 2 cases away
// TODO: Add turn system


var container = document.querySelector(".chess-container");
var piecesContainer = document.querySelector(".pieces-container");
var pxPerCase = 50;
var pieceID = 0;
var selected = -1;

var moveMatrixList = {
    "rook": [
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
        ],
    ],
    "king": [
        [
            [0, 1]
        ],
        [
            [1, 1]
        ],
        [
            [0, -1]
        ],
        [
            [1, -1]
        ],
        [
            [1, 0]
        ],
        [
            [-1, 1]
        ],
        [
            [-1, 0]
        ],
        [
            [-1, -1]
        ],
    ],
    "bishop": [
        [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
        ],
        [
            [-1, 1],
            [-2, 2],
            [-3, 3],
            [-4, 4],
            [-5, 5],
            [-6, 6],
            [-7, 7],
        ],
        [
            [1, -1],
            [2, -2],
            [3, -3],
            [4, -4],
            [5, -5],
            [6, -6],
            [7, -7],
        ],
        [
            [-1, -1],
            [-2, -2],
            [-3, -3],
            [-4, -4],
            [-5, -5],
            [-6, -6],
            [-7, -7],
        ],
    ],
    "queen": [
        [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
        ],
        [
            [-1, 1],
            [-2, 2],
            [-3, 3],
            [-4, 4],
            [-5, 5],
            [-6, 6],
            [-7, 7],
        ],
        [
            [1, -1],
            [2, -2],
            [3, -3],
            [4, -4],
            [5, -5],
            [6, -6],
            [7, -7],
        ],
        [
            [-1, -1],
            [-2, -2],
            [-3, -3],
            [-4, -4],
            [-5, -5],
            [-6, -6],
            [-7, -7],
        ],
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
        ],
    ],
    "knight": [
        [
            [1, 2],
        ],
        [
            [-1, 2],
        ],
        [
            [1, -2],
        ],
        [
            [-1, -2],
        ],
        [
            [2, 1],
        ],
        [
            [-2, 1],
        ],
        [
            [2, -1],
        ],
        [
            [-2, -1],
        ],
    ],
    "pawn": [
        // Specific rules in the class
    ]
}
var kings = [3, 27];
var piecesDispositionInit = [
    ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"],
    ["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"]
]

var whiteCheck = []
var blackCheck = []


var plateau = []
var listPiece = []

class GamePiece {
    constructor(position, name, isWhite, img) {
        this.name = name;
        this.position = position;
        this.moveMatrix = moveMatrixList[name];
        this.id = pieceID;
        this.isWhite = isWhite;
        this.hasMove = false;

        let el = document.createElement("img");
        el.classList.add("piece-" + pieceID, isWhite ? "white-piece" : "black-piece");
        el.style.top = (position[0] * 50).toString() + "px";
        el.style.left = (position[1] * 50).toString() + "px";
        el.src = img;
        piecesContainer.appendChild(el);

        pieceID++;
    }

    isMovePossible([x, y]) {
        let p0 = this.position[0] + x;
        let p1 = this.position[1] + y;
        if (p0 > 7 || p0 < 0 || p1 > 7 || p1 < 0) {
            return 0;
        }
        let mtx = plateau[p0][p1];

        if (mtx != -1 && ((this.isWhite && listPiece[mtx].isWhite) || (!this.isWhite && !listPiece[mtx].isWhite))) {
            return 0;
        }

        if (mtx != -1 && ((this.isWhite && !listPiece[mtx].isWhite) || (!this.isWhite && listPiece[mtx].isWhite))) {
            if (listPiece[mtx].name != "king") {
                return 2;
            } else {
                return 0;
            }
        }

        // Add king check for check possibility
        if (this.name == "king") {
            let m = checkCheck(this.isWhite);
            if (m[p0][p1] == 1) {
                return 0;
            }
        }

        return 1
    }

    checkIfQueen() {
        if (this.name == "pawn" && this.isWhite && this.position[0] == 0) {
            this.name = "queen";
            this.moveMatrix = moveMatrixList[this.name];
            let el = document.querySelector(".piece-" + this.id).src = "img/white/queen.png";
        } else if (this.name == "pawn" && !this.isWhite && this.position[0] == 7) {
            this.name = "queen";
            this.moveMatrix = moveMatrixList[this.name];
            let el = document.querySelector(".piece-" + this.id).src = "img/black/queen.png";
        }
    }

    move(x, y) {
        this.hasMove = true;
        let el = document.querySelector(".piece-" + this.id);
        plateau[this.position[0]][this.position[1]] = -1;
        plateau[x][y] = this.id;
        this.position = [x, y];
        el.style.top = (this.position[0] * 50).toString() + "px";
        el.style.left = (this.position[1] * 50).toString() + "px";
        this.checkIfQueen();
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

function checkCheck(isWhite) {
    let matrix = [];
    for (let i = 0; i < 8; i++) {
        let rm = [];
        for (let j = 0; j < 8; j++) {
            rm.push(0);
        }
        matrix.push(rm);
    }
    plateau.forEach(array => {
        array.forEach(u => {
            if (u != -1) {
                let o = listPiece[u];
                if (o.isWhite != isWhite) {
                    if (o.name != "pawn") {
                        o.moveMatrix.forEach(array => {
                            let isObstacle = false;
                            for (let y = 0; y < array.length; y++) {
                                const a = array[y];
                                if (o.isMovePossible(a) == 0 || isObstacle) {
                                    break;
                                }
                                if (o.isMovePossible(a) == 2) {
                                    isObstacle = true;
                                }
                                matrix[o.position[0] + a[0]][o.position[1] + a[1]] = 1;
                            }
                        });
                    } else {
                        if (o.isWhite) {
                            if (o.isMovePossible([-1, -1]) != 0) {
                                matrix[o.position[0] - 1][o.position[1] - 1] = 1;
                            }
                            if (o.isMovePossible([-1, 1]) != 0) {
                                matrix[o.position[0] - 1][o.position[1] + 1] = 1;
                            }
                        } else {
                            if (o.isMovePossible([1, -1]) != 0) {
                                matrix[o.position[0] + 1][o.position[1] - 1] = 1;
                            }
                            if (o.isMovePossible([1, 1]) != 0) {
                                matrix[o.position[0] + 1][o.position[1] + 1] = 1;
                            }
                        }
                    }
                }
            }
        })
    });

    return matrix;
}



for (let row = 0; row < 8; row++) {
    let rowMatrix = [];
    for (let col = 0; col < 8; col++) {
        rowMatrix.push(-1);
        let el = document.createElement("div");
        el.classList.add("row-" + row, "col-" + col);
        el.addEventListener('click', () => {
            if (el.classList.contains('predict')) {
                document.querySelectorAll(".selected").forEach((a) => {
                    a.classList.remove('selected');
                })
                document.querySelectorAll(".predict").forEach((a) => {
                    a.classList.remove('predict');
                })
                let piece = listPiece[selected];
                if (plateau[row][col] != -1) {
                    let targetedPiece = listPiece[plateau[row][col]];
                    if ((piece.isWhite && targetedPiece.isWhite) || (!piece.isWhite && !targetedPiece.isWhite)) {
                        return;
                    } else {
                        document.querySelector('.piece-' + targetedPiece.id).remove();
                    }
                }
                if (el.classList.contains("rock")) {
                    if (piece.isWhite) {
                        if (col <= 4) {
                            listPiece[plateau[row][0]].move(piece.position[0], 2);
                        } else {
                            listPiece[plateau[row][7]].move(piece.position[0], 4);
                        }
                    } else {
                        if (col <= 4) {
                            listPiece[plateau[row][0]].move(piece.position[0], 2);
                        } else {
                            listPiece[plateau[row][7]].move(piece.position[0], 4);
                        }
                    }
                }
                piece.move(row, col);

            } else {
                if (plateau[row][col] != -1) {
                    document.querySelectorAll(".selected").forEach((a) => {
                        a.classList.remove('selected');
                    })
                    document.querySelectorAll(".predict").forEach((a) => {
                        a.classList.remove('predict');
                    })
                    el.classList.add("selected");
                    let pieceSelected = listPiece[plateau[row][col]];
                    selected = pieceSelected.id;
                    // Simplified path 
                    if (pieceSelected.name != "pawn") {
                        pieceSelected.moveMatrix.forEach(array => {
                            let isObstacle = false;
                            for (let o = 0; o < array.length; o++) {
                                const a = array[o];
                                if (pieceSelected.isMovePossible(a) == 0 || isObstacle) {
                                    break;
                                }
                                if (pieceSelected.isMovePossible(a) == 2) {
                                    isObstacle = true;
                                }
                                document.querySelector(".row-" + (pieceSelected.position[0] + a[0]) + ".col-" + (pieceSelected.position[1] + a[1])).classList.add("predict");
                            }
                        });
                        // Add rock possibility:
                        let check = checkCheck(pieceSelected.isWhite);
                        if (pieceSelected.name == "king") {
                            //if (pieceSelected.isWhite) {
                            if (!pieceSelected.hasMove && plateau[pieceSelected.position[0]][pieceSelected.position[1] - 1] == -1 &&
                                plateau[pieceSelected.position[0]][pieceSelected.position[1] - 2] == -1 &&
                                check[pieceSelected.position[0]][pieceSelected.position[1]] == 0 &&
                                check[pieceSelected.position[0]][pieceSelected.position[1] - 1] == 0 &&
                                check[pieceSelected.position[0]][pieceSelected.position[1] - 2] == 0 &&
                                !listPiece[plateau[pieceSelected.position[0]][pieceSelected.position[1] - 3]].hasMove &&
                                listPiece[plateau[pieceSelected.position[0]][pieceSelected.position[1] - 3]].name == "rook") {

                                document.querySelector(".row-" + (pieceSelected.position[0]) + ".col-" + (pieceSelected.position[1] - 2)).classList.add("predict", "rock");

                            } else if (!pieceSelected.hasMove && plateau[pieceSelected.position[0]][pieceSelected.position[1] + 1] == -1 &&
                                plateau[pieceSelected.position[0]][pieceSelected.position[1] + 2] == -1 &&
                                plateau[pieceSelected.position[0]][pieceSelected.position[1] + 3] == -1 &&
                                check[pieceSelected.position[0]][pieceSelected.position[1]] == 0 &&
                                check[pieceSelected.position[0]][pieceSelected.position[1] + 1] == 0 &&
                                check[pieceSelected.position[0]][pieceSelected.position[1] + 2] == 0 &&
                                !listPiece[plateau[pieceSelected.position[0]][pieceSelected.position[1] + 4]].hasMove &&
                                listPiece[plateau[pieceSelected.position[0]][pieceSelected.position[1] + 4]].name == "rook") {
                                document.querySelector(".row-" + (pieceSelected.position[0]) + ".col-" + (pieceSelected.position[1] + 2)).classList.add("predict", "rock");
                            }
                        }
                    } else {
                        if (pieceSelected.isWhite) {
                            if (pieceSelected.isMovePossible([-1, 0]) == 1) {
                                document.querySelector(".row-" + (pieceSelected.position[0] - 1) + ".col-" + (pieceSelected.position[1])).classList.add("predict");
                            }
                            if (!pieceSelected.hasMove && pieceSelected.isMovePossible([-2, 0]) == 1) {
                                document.querySelector(".row-" + (pieceSelected.position[0] - 2) + ".col-" + (pieceSelected.position[1])).classList.add("predict");
                            }
                            if (pieceSelected.isMovePossible([-1, -1]) == 2) {
                                document.querySelector(".row-" + (pieceSelected.position[0] - 1) + ".col-" + (pieceSelected.position[1] - 1)).classList.add("predict");
                            }
                            if (pieceSelected.isMovePossible([-1, 1]) == 2) {
                                document.querySelector(".row-" + (pieceSelected.position[0] - 1) + ".col-" + (pieceSelected.position[1] + 1)).classList.add("predict");
                            }
                        } else {
                            if (pieceSelected.isMovePossible([1, 0]) == 1) {
                                document.querySelector(".row-" + (pieceSelected.position[0] + 1) + ".col-" + (pieceSelected.position[1])).classList.add("predict");
                            }
                            if (!pieceSelected.hasMove && pieceSelected.isMovePossible([2, 0]) == 1) {
                                document.querySelector(".row-" + (pieceSelected.position[0] + 2) + ".col-" + (pieceSelected.position[1])).classList.add("predict");
                            }
                            if (pieceSelected.isMovePossible([1, -1]) == 2) {
                                document.querySelector(".row-" + (pieceSelected.position[0] + 1) + ".col-" + (pieceSelected.position[1] - 1)).classList.add("predict");
                            }
                            if (pieceSelected.isMovePossible([1, 1]) == 2) {
                                document.querySelector(".row-" + (pieceSelected.position[0] + 1) + ".col-" + (pieceSelected.position[1] + 1)).classList.add("predict");
                            }
                        }
                    }
                }
            }
        })
        container.appendChild(el);
    }
    plateau.push(rowMatrix);
}

// Add top pieces
for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
        let piece = piecesDispositionInit[row][col];
        plateau[row][col] = pieceID;
        listPiece.push(new GamePiece([row, col], piece, false, "img/black/" + piece + ".png"));
    }
}

// Add bottom pieces
for (let row = 6; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        let piece;
        if (row == 6) {
            piece = piecesDispositionInit[1][col];
        } else {
            piece = piecesDispositionInit[0][col];
        }

        plateau[row][col] = pieceID;
        listPiece.push(new GamePiece([row, col], piece, true, "img/white/" + piece + ".png"))
    }
}