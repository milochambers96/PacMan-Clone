function init() {
    const grid = document.querySelector('#grid');
    const height = 10;
    const width = 10;
    const gridSize = width * height
    const cells = []

    const mazeLayout = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 0, 1, 1, 0, 1,
        1, 0, 1, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 1, 0, 1, 1, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 1, 0, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 1, 0, 1,
        1, 1, 1, 1, 0, 1, 0, 1, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
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



  // PacMan Object   
    const PacMan = {
        position: 11,
        element: null,
        render() {
            this.remove()
            this.element = cells[this.position];
            this.element.classList.add("pacman");
        },
        move(direction) {
            let newPosition;
            switch (direction) {
                case 'left':
                    if (this.position % width !== 0) {
                        newPosition = this.position - 1;
                    }
                    break;
                case 'up':
                    if (this.position >= width) {
                        newPosition = this.position - width;
                    }
                    break;
                case 'right':
                    if (this.position % width < width - 1) {
                        newPosition = this.position + 1;
                    }
                    break;
                case 'down':
                    if (this.position < gridSize - width) {
                        newPosition = this.position + width;
                    }
                    break;
            }

            if (newPosition !== undefined && isValidMove(newPosition)) {
                this.position = newPosition;
                this.render();
            }
        },
        remove() {
            if (this.element) {
                this.element.classList.remove("pacman");
            }
        }
    };



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
    
        for (const {move, newRow, newCol} of possibleMoves) {
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


    function isValidMove(position) {
        return position >= 0 && position < gridSize && !cells[position].classList.contains('wall');
    }

    // Initialize and render Pac-Man 
    PacMan.render();

    function movePacMan(event) {
        switch (event.keyCode) {
            case 37: // Left arrow
                PacMan.move('left');
                break;
            case 38: // Up arrow
                PacMan.move('up');
                break;
            case 39: // Right arrow
                PacMan.move('right');
                break;
            case 40: // Down arrow
                PacMan.move('down');
                break;
        }
    }

    window.addEventListener("keydown", movePacMan);

    
}

window.addEventListener("DOMContentLoaded", init);


