










// function init() {
//     const grid = document.querySelector('#grid');

//     const height = 10;
//     const width = 10;
//     const gridSize = width * height
//     const cells = []

//     let PacManCell = 11;
//     let ghostCell = 86;

//     const mazeLayout = [
//         1,1,1,1,1,1,1,1,1,1,
//         1,0,0,0,0,0,0,0,0,1,
//         1,0,1,1,1,0,1,1,0,1,
//         1,0,1,0,0,0,0,1,0,1,
//         1,0,1,0,1,1,0,1,0,1,
//         1,0,0,0,0,0,0,1,0,1,
//         1,0,1,1,1,1,0,1,0,1,
//         1,0,0,0,0,1,0,1,0,1,
//         1,1,1,1,0,1,0,1,0,1,
//         1,1,1,1,1,1,1,1,1,1
//     ];
    

//     function createGrid() {
//         for (let i = 0; i < gridSize; i++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             grid.appendChild(cell);
//             cells.push(cell);
//             if (mazeLayout[i] === 1) {
//                 cell.classList.add('wall');
//             } else {
//                 cell.classList.add('path');
//             }
//         }
//     }
//     createGrid();


//     function isValidMove(position) {
//         return position >= 0 && position < gridSize && !cells[position].classList.contains('wall')
//     }

//     //! Code to move and contol PacMan

//     cells[PacManCell].classList.add("pacman");

//     function removePacMan(position) {
//         cells[position].classList.remove("pacman");
//     }

//     function addPacMan(position) {
//         cells[position].classList.add("pacman");
//     }

//     function movePacMan(event) {
//         switch (event.keyCode) {
//             case 37: // Left arrow
//                 if (PacManCell % width !== 0) {
//                     newPacManCell = PacManCell - 1;
//                 }
//                 break;
//             case 38: // Up arrow
//                 if (PacManCell >= width) {
//                     newPacManCell = PacManCell - width;
//                 }
//                 break;
//             case 39: // Right arrow
//                 if (PacManCell % width < width - 1) {
//                     newPacManCell = PacManCell + 1;
//                 }
//                 break;
//             case 40: // Down arrow
//                 if (PacManCell < gridSize - width) {
//                     newPacManCell = PacManCell + width;
//                 }
//                 break;
//         }

//         if (newPacManCell !== PacManCell && isValidMove(newPacManCell)) {
//             removePacMan(PacManCell);
//             PacManCell = newPacManCell;
//             addPacMan(PacManCell);
//         }
//     }

//     window.addEventListener("keydown", movePacMan)

//     //! Helper functions to move Ghost

//     cells[ghostCell].classList.add("ghost");

//     function removeGhost(position) {
//         cells[position].classList.remove("ghost");
//     }

//     function addGhost(position) {
//         cells[position].classList.add("ghost");
//     }

    
//     //!Functions to move Ghost


//     let previousGhostCell = null;  // Track the previous position of the ghost

//     function moveGhost() {
//         const ghostRow = Math.floor(ghostCell / width);
//         const ghostCol = ghostCell % width;
//         const pacManRow = Math.floor(PacManCell / width);
//         const pacManCol = PacManCell % width;
    
//         if (ghostCell === PacManCell) {
//             console.log("Ghost caught Pac-Man!");
//             return;  // Stop moving the ghost
//         }
    
//         // Initialize possible moves
//         const possibleMoves = [];
    
//         // Add vertical moves if valid
//         if (pacManRow > ghostRow && isValidMove(ghostCell + width)) {
//             possibleMoves.push(width);  // Move down
//         } else if (pacManRow < ghostRow && isValidMove(ghostCell - width)) {
//             possibleMoves.push(-width);  // Move up
//         }
    
//         // Add horizontal moves if valid
//         if (pacManCol > ghostCol && isValidMove(ghostCell + 1)) {
//             possibleMoves.push(1);  // Move right
//         } else if (pacManCol < ghostCol && isValidMove(ghostCell - 1)) {
//             possibleMoves.push(-1);  // Move left
//         }
    
//         // If no preferred moves are possible, add all other valid moves to prevent getting stuck
//         if (possibleMoves.length === 0) {
//             if (isValidMove(ghostCell + width)) possibleMoves.push(width);
//             if (isValidMove(ghostCell - width)) possibleMoves.push(-width);
//             if (isValidMove(ghostCell + 1)) possibleMoves.push(1);
//             if (isValidMove(ghostCell - 1)) possibleMoves.push(-1);
//         }
    
//         // Randomize the valid moves to avoid predictable patterns
//         if (possibleMoves.length > 0) {
//             const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
//             const newPosition = ghostCell + randomMove;
    
//             if (isValidMove(newPosition) && newPosition !== previousGhostCell) {
//                 previousGhostCell = ghostCell;
//                 removeGhost(ghostCell);
//                 ghostCell = newPosition;
//                 addGhost(ghostCell);
//             }
//         }

// // Call moveGhost every half-second
// setInterval(moveGhost, 500);
//     }
// }

// window.addEventListener("DOMContentLoaded", init)



// // function moveGhost() {
// //     const ghostRow = Math.floor(ghostCell / width);
// //     const ghostCol = ghostCell % width;
// //     const pacManRow = Math.floor(PacManCell / width);
// //     const pacManCol = PacManCell % width;

// //     let bestMove = null;
    
    
    
// //     //let minDistance = Infinity;

// //     // const possibleMoves = [
// //     //     { direction: 'Up', move: -width, newRow: ghostRow - 1, newCol: ghostCol },
// //     //     { direction: 'Down', move: width, newRow: ghostRow + 1, newCol: ghostCol },
// //     //     { direction: 'Left', move: -1, newRow: ghostRow, newCol: ghostCol - 1 },
// //     //     { direction: 'Right', move: 1, newRow: ghostRow, newCol: ghostCol + 1 }
// //     // ];


// //     // for (const { move, newRow, newCol } of possibleMoves) {
// //     //     const newPosition = ghostCell + move;
// //     //     if (isValidMove(newPosition)) {
// //     //         const newDistance = Math.abs(pacManRow - newRow) + Math.abs(pacManCol - newCol);
// //     //         if (newDistance < minDistance) {
// //     //             minDistance = newDistance;
// //     //             bestMove = move;
// //     //         }
// //     //     }
// //     // }

// //     if (bestMove !== null) {
// //         const newPosition = ghostCell + bestMove;
// //         if (newPosition !== ghostCell) {
// //             removeGhost(ghostCell);
// //             ghostCell = newPosition;
// //             addGhost(ghostCell);
// //         }
// //     }
// // }



// //!!!!!!!!!!!!


// function init() {
//     const grid = document.querySelector('#grid');
//     const height = 10;
//     const width = 10;
//     const gridSize = width * height
//     const cells = []

//     const mazeLayout = [
//         1,1,1,1,1,1,1,1,1,1,
//         1,0,0,0,0,0,0,0,0,1,
//         1,0,1,1,1,0,1,1,0,1,
//         1,0,1,0,0,0,0,1,0,1,
//         1,0,1,0,1,1,0,1,0,1,
//         1,0,0,0,0,0,0,1,0,1,
//         1,0,1,1,1,1,0,1,0,1,
//         1,0,0,0,0,1,0,1,0,1,
//         1,1,1,1,0,1,0,1,0,1,
//         1,1,1,1,1,1,1,1,1,1
//     ];
    
//     function createGrid() {
//         for (let i = 0; i < gridSize; i++) {
//             const cell = document.createElement('div');
//             cell.classList.add('cell');
//             grid.appendChild(cell);
//             cells.push(cell);
//             if (mazeLayout[i] === 1) {
//                 cell.classList.add('wall');
//             } else {
//                 cell.classList.add('path');
//             }
//         }
//     }
//     createGrid();

//     const pacman = createPacman(11);
//     const ghost = createGhost(86);
//     pacman.addToCell();
//     ghost.addToCell();
//     // function gameLoop() {
//     //     ghost.move();
  
// }

// window.addEventListener("DOMContentLoaded", init);

// function createCharacter(initialCell, className) {
//     return {
//         cell: initialCell,
//         className: className,
//         addToCell: function() {
//             cells[this.cell].classList.add(this.className);
//         },
//         removeFromCell: function() {
//             cells[this.cell].classList.remove(this.className);
//         },
//         moveTo: function(newCell) {
//             this.removeFromCell();
//             this.cell = newCell;
//             this.addToCell();
//         }
//     };
// }

// function createPacman(initialCell) {
//     const pacman = createCharacter(initialCell, 'pacman');
//     pacman.move = function(keyCode) {
//         let newCell = this.cell;
//         switch (keyCode) {
//             case 37: // Left
//                 if (this.cell % width !== 0) newCell = this.cell - 1;
//                 break;
//             case 38: // Up
//                 if (this.cell >= width) newCell = this.cell - width;
//                 break;
//             case 39: // Right
//                 if (this.cell % width < width - 1) newCell = this.cell + 1;
//                 break;
//             case 40: // Down
//                 if (this.cell < gridSize - width) newCell = this.cell + width;
//                 break;
//         }
//         if (newCell !== this.cell && isValidMove(newCell)) {
//             this.moveTo(newCell);
//         }
//     };
//     return pacman;
// }
// function createGhost(initialCell) {
//     const ghost = createCharacter(initialCell, 'ghost');
//     ghost.previousCell = null;
//     ghost.move = function() {
//         const ghostRow = Math.floor(this.cell / width);
//         const ghostCol = this.cell % width;
//         const pacManRow = Math.floor(pacman.cell / width);
//         const pacManCol = pacman.cell % width;
//         if (this.cell === pacman.cell) {
//             console.log("Ghost caught Pac-Man!");
//             return;
//         }
//         const possibleMoves = [];
//         if (pacManRow > ghostRow && isValidMove(this.cell + width)) {
//             possibleMoves.push(width);
//         } else if (pacManRow < ghostRow && isValidMove(this.cell - width)) {
//             possibleMoves.push(-width);
//         }
//         if (pacManCol > ghostCol && isValidMove(this.cell + 1)) {
//             possibleMoves.push(1);
//         } else if (pacManCol < ghostCol && isValidMove(this.cell - 1)) {
//             possibleMoves.push(-1);
//         }
//         if (possibleMoves.length === 0) {
//             [width, -width, 1, -1].forEach(move => {
//                 if (isValidMove(this.cell + move)) possibleMoves.push(move);
//             });
//         }
//         if (possibleMoves.length > 0) {
//             const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
//             const newPosition = this.cell + randomMove;
//             if (isValidMove(newPosition) && newPosition !== this.previousCell) {
//                 this.previousCell = this.cell;
//                 this.moveTo(newPosition);
//             }
//         }
//     };
//     return ghost;
// }
// function init() {
//     // ... (your existing grid creation code)
//     const pacman = createPacman(11);
//     const ghost = createGhost(86);
//     pacman.addToCell();
//     ghost.addToCell();
//     function gameLoop() {
//         ghost.move();
//         // Check for collisions, update score, etc.
//     }
//     setInterval(gameLoop, 500);
//     window.addEventListener('keydown', (event) => pacman.move(event.keyCode));
// }
// window.addEventListener("DOMContentLoaded", init);



