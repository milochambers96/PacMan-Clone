function init() {
    const grid = document.querySelector('#grid');

    const height = 10;
    const width = 10;
    const gridSize = width * height
    const cells = []

    let PacManCell = 11;
    let ghostCell = 86;

    const mazeLayout = [
        1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,0,1,1,0,1,
        1,0,1,0,0,0,0,1,0,1,
        1,0,1,0,1,1,0,1,0,1,
        1,0,0,0,0,0,0,1,0,1,
        1,0,1,1,1,1,0,1,0,1,
        1,0,0,0,0,1,0,1,0,1,
        1,1,1,1,0,1,0,1,0,1,
        1,1,1,1,1,1,1,1,1,1
    ];
    

    function createGrid() {
        for (let i = 0; i < gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cells.push(cell);
            if (mazeLayout[i] === 1) {
                cell.classList.add('wall');
            } else {
                cell.classList.add('path');
            }
        }
    }
    createGrid();

    //! Code to move and contol PacMan

    cells[PacManCell].classList.add("pacman");

    function removePacMan(position) {
        cells[position].classList.remove("pacman");
    }

    function addPacMan(position) {
        cells[position].classList.add("pacman");
    }

    function movePacMan(event) {
        switch (event.keyCode) {
            case 37: // Left arrow
                if (PacManCell % width !== 0) {
                    newPacManCell = PacManCell - 1;
                }
                break;
            case 38: // Up arrow
                if (PacManCell >= width) {
                    newPacManCell = PacManCell - width;
                }
                break;
            case 39: // Right arrow
                if (PacManCell % width < width - 1) {
                    newPacManCell = PacManCell + 1;
                }
                break;
            case 40: // Down arrow
                if (PacManCell < gridSize - width) {
                    newPacManCell = PacManCell + width;
                }
                break;
        }
        if (newPacManCell !== PacManCell) {
            removePacMan(PacManCell);
            PacManCell = newPacManCell;
            addPacMan(PacManCell);
        }
    }

    window.addEventListener("keydown", movePacMan)

    //! Helper functions to move Ghost

    cells[ghostCell].classList.add("ghost");

    function removeGhost(position) {
        cells[position].classList.remove("ghost");
    }

    function addGhost(position) {
        cells[position].classList.add("ghost");
    }

    function isValidMove(position) {
        return position >= 0 && position < gridSize && !cells[position].classList.contains('wall')
    }

    //!Functions to move Ghost

    function moveGhost() {
        const ghostRow = Math.floor(ghostCell / width);
        const ghostCol = ghostCell % width;
        const pacManRow = Math.floor(PacManCell / width);
        const pacManCol = PacManCell % width;

        let bestMove = null;
        let minDistance = Infinity;

        const possibleMoves = [
            { direction: 'Up', move: -width, newRow: ghostRow - 1, newCol: ghostCol },
            { direction: 'Down', move: width, newRow: ghostRow + 1, newCol: ghostCol },
            { direction: 'Left', move: -1, newRow: ghostRow, newCol: ghostCol - 1 },
            { direction: 'Right', move: 1, newRow: ghostRow, newCol: ghostCol + 1 }
        ];

        for (const { move, newRow, newCol } of possibleMoves) {
            const newPosition = ghostCell + move;
            if (isValidMove(newPosition)) {
                const newDistance = Math.abs(pacManRow - newRow) + Math.abs(pacManCol - newCol);
                if (newDistance < minDistance) {
                    minDistance = newDistance;
                    bestMove = move;
                }
            }
        }

        if (bestMove !== null) {
            const newPosition = ghostCell + bestMove;
            if (newPosition !== ghostCell) {
                removeGhost(ghostCell);
                ghostCell = newPosition;
                addGhost(ghostCell);
            }
        }
    }

    setInterval(moveGhost, 1000)

}

window.addEventListener("DOMContentLoaded", init)