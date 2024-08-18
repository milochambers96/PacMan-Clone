function init() {
    const grid = document.querySelector('#grid');
    const scoreText = document.querySelector('#score');
    const livesText = document.querySelector('#lives');
    let lives = 3;
    let score = 0;

    const height = 20;
    const width = 20;
    const gridSize = width * height;
    const cells = [];

    // Pac-Man and methods
    const PacMan = {
        position: 21,
        currentCell: null,
        displayPacMan() {
            if (this.currentCell) {
                this.currentCell.classList.remove('pacman');
            }
            this.currentCell = cells[this.position];
            this.currentCell.classList.add('pacman');
        },
        move(newPosition) {
            if (isValidMove(newPosition)) {
                this.position = newPosition;
                this.displayPacMan();
            }
        }
    };


    

    function movePacMan(event) {
        let newPosition;
        switch (event.keyCode) {
            case 37: // Left arrow
                if (PacMan.position % width !== 0) {
                    newPosition = PacMan.position - 1;
                }
                break;
            case 38: // Up arrow
                if (PacMan.position >= width) {
                    newPosition = PacMan.position - width;
                }
                break;
            case 39: // Right arrow
                if (PacMan.position % width < width - 1) {
                    newPosition = PacMan.position + 1;
                }
                break;
            case 40: // Down arrow
                if (PacMan.position < gridSize - width) {
                    newPosition = PacMan.position + width;
                }
                break;
        }
        if (newPosition !== undefined) {
            PacMan.move(newPosition);
        }
        pacmanAteAPellet()
    }

    
    window.addEventListener("keydown", movePacMan);


// Ghost and methods
    const Ghost = {
        position: 86,
        currentCell: null,
        previousMove: null,
        displayGhost() {
            if (this.currentCell) {
                this.currentCell.classList.remove('ghost');
            }
            this.currentCell = cells[this.position];
            this.currentCell.classList.add('ghost');
        },
        move(newPosition) {
            if (isValidMove(newPosition)) {
                this.previousMove = this.position; 
                this.position = newPosition;
                this.displayGhost();
            }
        }
    };


     // Create the grid and maze
     function createGrid() {
        for (let i = 0; i < gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cells.push(cell);
            if (mazeLayout[i] === 1) {
                cell.classList.add('wall');
            } else {
                cell.classList.add('path')
                //cell.classList.add('pellet');
                const pellet = document.createElement('div');
                pellet.classList.add('pellet');
                cell.appendChild(pellet);
            }
        }
        PacMan.displayPacMan();
        Ghost.displayGhost();
    }
    createGrid();

    //code relating to pellets.
    const arrayofPellets = Array.from(document.querySelectorAll('.pellet'))
    let pellets = arrayofPellets.length

    function pacmanAteAPellet() {
        arrayofPellets.forEach((pellet) =>  {
            if (pellet.parentElement && pellet.parentElement.classList.contains('pacman')) {
                pellet.parentElement.removeChild(pellet)
                pellets--;
                score+=10;
                scoreText.textContent = `Score: ${score}`
            }
        })
        if (pellets === 0) {
            gameComplete()
        }

    }

    function gameComplete() {
        alert("You win")
    }

    function isValidMove(position) {
        // Check if position is within the grid boundaries
        if (position < 0 || position >= gridSize) {
            return false;
        }

        // Check if the cell is a wall
        if (cells[position].classList.contains('wall')) {
            return false;
        }
        return true;
    }



    // Move Ghost 
    function moveGhost() {
        const ghostPosition = Ghost.position;
        const pacmanPosition = PacMan.position;

        if (ghostPosition === pacmanPosition) {
            ghostGotPacMan()
            return
        }
    
        const directions = [
            { move: width, direction: 'down' },   
            { move: -width, direction: 'up' },   
            { move: 1, direction: 'right' },      
            { move: -1, direction: 'left' }       
        ];
    
        let bestMove = null;
        let minDistance = Infinity;
    
        // Loop evalutiang each possible move
        for (const { move, direction } of directions) {
            const newPosition = ghostPosition + move;
    
            if (isValidMove(newPosition)) {
                // Calculate how each move would impact the ghosts distance to Pac-Man using Manhattan distance
                const newRow = Math.floor(newPosition / width);
                const newCol = newPosition % width;
                const pacmanRow = Math.floor(pacmanPosition / width);
                const pacmanCol = pacmanPosition % width;
                const distance = Math.abs(pacmanRow - newRow) + Math.abs(pacmanCol - newCol);
    
                
                //console.log(`Move: ${direction}, Ghost's New Position: ${newPosition}, Distance from PacMan: ${distance}`);
                // if distance is not working
                if (distance < minDistance) {
                    minDistance = distance;
                    bestMove = move;
                }
            }
        }
    
        // If a best move is found, update the ghost's position
        if (bestMove !== null) {
            Ghost.move(ghostPosition + bestMove);
        } else {
            console.log('No valid moves available for the ghost.');
        }
    }
    
    setInterval(moveGhost, 500);

    function ghostGotPacMan() {
        if (lives <= 0) {
            gameOver()
            return
        }
        lives--;
        livesText.textContent = `Lives: ${lives}`;
        resetPositions();      
    }

    function gameOver() {
        lives = 3;
        livesText.textContent = `Lives: ${lives}`;
        score = 0;
        scoreText.textContent = `Score: ${score}`;
        alert("Game over")
        resetPositions();
    }

    function resetPositions() { 
        PacMan.position = 21; // Reset Pac-Man position
        Ghost.position = 86; // Reset Ghost position
        PacMan.displayPacMan(); 
        Ghost.displayGhost(); 
    }

   
}
window.addEventListener("DOMContentLoaded", init);

const mazeLayout = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
