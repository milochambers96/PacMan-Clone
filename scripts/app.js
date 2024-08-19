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
        // Added to prevent window scrolling down when down/up arrow held down. 
        // Holding down kind of breaks the game. 
        event.preventDefault();

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
        pacmanAteAPellet();
        checkCollision();
    }


    window.addEventListener("keydown", movePacMan);


    // Ghost and methods
    const Ghost = {
        position: 86,
        currentCell: null,
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

    const ambusherGhost = {
        position: 137,
    }

    // Create the grid and maze
    function createGrid() {
        for (let i = 0; i < gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cells.push(cell);
            if (mazeLayout[i] === 1) {
                cell.classList.add('wall');
            } else if (mazeLayout[i] === 2) {
                cell.classList.add('path');
                const powerPellet = document.createElement('div');
                powerPellet.classList.add('power-pellet');
                cell.appendChild(powerPellet)
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
    const arrayOfPellets = Array.from(document.querySelectorAll('.pellet'));
    const arrayOfPowerPellets = Array.from(document.querySelectorAll('.power-pellet'));
    let pellets = arrayOfPellets.length;
    //let powerPellets = arrayofPellets.length;
    let powerPelletActive = false;
    let powerPelletTimeout;

    function pacmanAteAPellet() {
        arrayOfPellets.forEach((pellet) => {
            if (pellet.parentElement && pellet.parentElement.classList.contains('pacman')) {
                pellet.parentElement.removeChild(pellet)
                pellets--;
                score += 10;
                scoreText.textContent = `Score: ${score}`
            }
        })
        arrayOfPowerPellets.forEach((powerPellet) => {
            if (powerPellet.parentElement && powerPellet.parentElement.classList.contains('pacman')) {
                powerPellet.parentElement.removeChild(powerPellet)
                powerUp()
            }
        })
        if (pellets <= 0) {
            gameComplete()
        }
    }

    function powerUp() {
        if (powerPelletActive) {

            return
            //powerPellet.classList.add('power-pellet');
            //cell.appendChild(powerPellet)
        }
        powerPelletActive = true;
    }

    let powerUpInterval = setInterval(powerUp, 1000);

    setTimeout(() => {
        clearInterval(powerUpInterval)
        powerPelletActive = false
    }, 10000)


    



    function gameComplete() {
        alert(`You win, your score is: ${score}`)
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



    function bfs(start, destination) {
        const directions = [
            { move: width, direction: 'down' },
            { move: -width, direction: 'up' },
            { move: 1, direction: 'right' },
            { move: -1, direction: 'left' }
        ];

        const queue = [{ position: (start), path: [] }];
        let visited = new Set()
        // According to MDN Set acts an object that stores unique values of any type. This is good as it stops any duplicate info being stored. Only track new cells. 
        visited.add(start)

        while (queue.length > 0) {
            let { position, path } = queue.shift()

            if (position === destination) {
                return path;
            }

            for (const { move, direction } of directions) {
                const newPosition = position + move;
                // has is a method for Sets - returns boolean whether an element with the specifed value exists. 
                // Checking that the visted set does not contain the new position
                if (isValidMove(newPosition) && !visited.has(newPosition)) {
                    visited.add(newPosition);
                    queue.push({ position: newPosition, path: [...path, direction] })
                }
            }
        }

        return [];
    }

    // Move Ghost 
    function moveGhost() {
        const ghostPosition = Ghost.position;
        const pacmanPosition = PacMan.position;
        const path = bfs(ghostPosition, pacmanPosition)
        //console.log('The path is:' + path)

        if (path.length > 0) {
            const nextMove = path[0];
            //console.log(nextMove)

            let move;
            switch (nextMove) {
                case 'up':
                    move = -width;
                    break;
                case 'down':
                    move = width;
                    break;
                case 'left':
                    move = -1;
                    break;
                case 'right':
                    move = 1;
                    break;
            }
            const newPosition = ghostPosition + move;

            if (isValidMove(newPosition)) {
                Ghost.move(newPosition)
                checkCollision()
            }
        }
    }

    setInterval(moveGhost, 500);

    function checkCollision() {
        if (powerPelletActive === true && Ghost.position === PacMan.position) {
            pacManGotGhost()

        } else if (Ghost.position === PacMan.position) {
            ghostGotPacMan()
        }
    }

    function pacManGotGhost() {
        score += 250;
        resetEatenGhosts()
    }

    function resetEatenGhosts()  { 
        const collisionPoint = PacMan.position
        let maxDistance = -1;
        let bestPosition = -1;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].classList.contains('wall')) {
                distance = Math.abs(i - collisionPoint);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    bestPosition = i
                }
            }
        }
        if (bestPosition !== -1) {
            Ghost.position = bestPosition;
            Ghost.displayGhost()
        }
    }




    function ghostGotPacMan() {
        if (lives === 0) {
            gameOver()
            return
        }
        if (lives === 1) {
            livesText.textContent = 'Final Life';
            lives--
            resetPositions();
            return;
        }
        lives--;
        livesText.textContent = `Lives: ${'❤️'.repeat(lives)}`;
        resetPositions();
    }

    function gameOver() {
        lives = 3;
        livesText.textContent = `Lives: ${'❤️'.repeat(lives)}`;
        score = 0;
        scoreText.textContent = `Score: ${score}`;
        alert("Game over")
        resetPositions();
    }

    function resetPositions() {
        PacMan.position = 21;
        Ghost.position = 86;
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
    1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 2, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
