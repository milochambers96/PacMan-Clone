// Code relating to grid/maze 
const height = 20;
const width = 20;
const gridSize = width * height;
const cells = []

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

//Code relating to characters - PacMan and Ghosts
const PacMan = {
    position: 21,
    currentCell: null,
    poweredUp: false,
    displayPacMan() {
        if (this.currentCell) {
            this.currentCell.classList.remove('pacman', 'pacman-powerup');
        }
        this.currentCell = cells[this.position];
        if (this.poweredUp === true) {
            this.currentCell.classList.add('pacman-powerup')
        } else {
            this.currentCell.classList.add('pacman');
        }
    },
    move(newPosition) {
        if (isValidMove(newPosition)) {
            this.position = newPosition;
            this.displayPacMan();
        }
    }
};

const chaserGhost = {
    position: 68,
    currentCell: null,
    pathHistory: [],
    displayGhost() {
        if (this.currentCell) {
            this.currentCell.classList.remove('chaser-ghost');
        }
        this.currentCell = cells[this.position];
        this.currentCell.classList.add('chaser-ghost');
    },
    move(newPosition) {
        if (isValidMove(newPosition)) {
            this.pathHistory.push(this.position)
            this.position = newPosition;
            this.displayGhost();
        }
    },
    retracePath() {
        if (this.pathHistory.length > 0) {
            this.position = this.pathHistory.pop();
            this.displayGhost()
        }
    }
};

const ambusherGhost = {
    position: 287,
    currentCell: null,
    pathHistory: [],
    displayGhost() {
        if (this.currentCell) {
            this.currentCell.classList.remove('ambusher-ghost');
        }
        this.currentCell = cells[this.position];
        this.currentCell.classList.add('ambusher-ghost');
    },
    move(newPosition) {
        if (isValidMove(newPosition)) {
            this.pathHistory.push(this.position)
            this.position = newPosition;
            this.displayGhost();
        }
    },
    retracePath() {
        if (this.pathHistory.length > 0) {
            this.position = this.pathHistory.pop();
            this.displayGhost()
        }
    }
};

const randomGhost = {
    position: 301,
    currentCell: null,
    displayGhost() {
        if (this.currentCell) {
            this.currentCell.classList.remove('random-ghost');
        }
        this.currentCell = cells[this.position];
        this.currentCell.classList.add('random-ghost');
    },
    move(newPosition) {
        if (isValidMove(newPosition)) {
            this.position = newPosition;
            this.displayGhost();
        }
    }
};

// Helper Functions that Game Events use

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

//! BFS - Breadth First Search is the pathfinding algorithm to help the ghosts ensure they are finding the fastest path to a destination rather than tracking the distance.
function bfs(start, destination) {
    const directions = [
        { move: width, direction: 'down' },
        { move: -width, direction: 'up' },
        { move: 1, direction: 'right' },
        { move: -1, direction: 'left' }
    ];

    const queue = [{ position: (start), path: [] }];
    let visited = new Set()
    // Set acts an object that stores unique values of any type. This is good as it stops any duplicate info being stored. Only track new cells. 
    visited.add(start)
    //!if (PacMan.poweredUp === true) 
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

//! Helper functions to calculate ambush site depending on PacMan direction. 

function getAmbushPosition(pacmanPosition, pacmanDirection) {
    let targetPosition;
    const targetOffset = 4;
    switch (pacmanDirection) {
        case 'up':
            targetPosition = pacmanPosition - targetOffset * width;
            break;
        case 'down':
            targetPosition = pacmanPosition + targetOffset * width;
            break;
        case 'left':
            targetPosition = pacmanPosition - targetOffset;
            break;
        case 'right':
            targetPosition = pacmanPosition + targetOffset;
            break;
        default:
            targetPosition = pacmanPosition;
    }
    if (!isValidMove(targetPosition)) {
        targetPosition = pacManPosition;
    }
    return targetPosition;
}

function manhattanDistance(pos1, pos2) {
    const pos1Row = Math.floor(pos1 / width);
    const pos1Col = pos1 % width;
    const pos2Row = Math.floor(pos2 / width);
    const pos2Col = pos2 % width;
    return Math.abs(pos1Row - pos2Row) + Math.abs(pos1Col - pos2Col)
}


function init() {
    const grid = document.querySelector('#grid');
    const scoreText = document.querySelector('#score');
    const livesText = document.querySelector('#lives');

    let lives = 3;
    let score = 0;

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
                const pellet = document.createElement('div');
                pellet.classList.add('pellet');
                cell.appendChild(pellet);
            }
        }
        PacMan.displayPacMan();
        chaserGhost.displayGhost();
        ambusherGhost.displayGhost();
        randomGhost.displayGhost();
    }
    createGrid();

    // In Game Code relating to PacMan

    let pacManDirection = 'right'

    function movePacMan(event) {
        let newPosition;
        event.preventDefault();
        // Added to prevent window scrolling if the player holds down the down or up arrows.
        switch (event.keyCode) {
            case 37:
                if (PacMan.position % width !== 0) {
                    newPosition = PacMan.position - 1;
                    pacManDirection = 'left';
                }
                break;
            case 38:
                if (PacMan.position >= width) {
                    newPosition = PacMan.position - width;
                    pacManDirection = 'up';
                }
                break;
            case 39:
                if (PacMan.position % width < width - 1) {
                    newPosition = PacMan.position + 1;
                    pacManDirection = 'right';
                }
                break;
            case 40:
                if (PacMan.position < gridSize - width) {
                    newPosition = PacMan.position + width;
                    pacManDirection = 'down';
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


    // Code relating to pellets & power pellets.
    const arrayOfPellets = Array.from(document.querySelectorAll('.pellet'));
    const arrayOfPowerPellets = Array.from(document.querySelectorAll('.power-pellet'));
    let pellets = arrayOfPellets.length;
    let powerPelletActive = false;
    let powerPelletTimeout;

    function pacmanAteAPellet() {
        arrayOfPellets.forEach((pellet) => {
            if (pellet.parentElement && (pellet.parentElement.classList.contains('pacman') || pellet.parentElement.classList.contains('pacman-powerup'))) {
                pellet.parentElement.removeChild(pellet)
                pellets--;
                score += 10;
                scoreText.textContent = `Score: ${score}`
            }
        })
        arrayOfPowerPellets.forEach((powerPellet) => {
            if (powerPellet.parentElement && powerPellet.parentElement.classList.contains('pacman')) {
                powerPellet.parentElement.removeChild(powerPellet);
                score += 50;
                powerUp();
            }
        })
        if (pellets <= 0) {
            gameComplete()
        }
    }

    function powerUp() {
        if (powerPelletActive) {
            return
        }
        powerPelletActive = true;
        PacMan.poweredUp = true;
        setTimeout(() => {
            powerPelletActive = false;
            PacMan.poweredUp = false;
        }, 10000)
    }

    function gameComplete() {
        alert(`Congratulations, you beat the game! Your final score is: ${score}`);
        let fullReset = true;
        resetGame(fullReset);
    }

    // Move chaser Ghost 
    function moveChaserGhost() {
        const ghostPosition = chaserGhost.position;
        const pacmanPosition = PacMan.position;
        if (PacMan.poweredUp) {
            chaserGhost.retracePath();
        } else {
            const chasePath = bfs(ghostPosition, pacmanPosition)
            //console.log('The path is:' + path)

            if (chasePath.length > 0) {
                const nextMove = chasePath[0];
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
                    chaserGhost.move(newPosition)
                    checkCollision()
                }
            }
        }
    }

    function getpacManDirection() {
        return pacManDirection;
    }

    function moveAmbusherGhost() {
        const pacmanPosition = PacMan.position;
        const pacmanDirection = getpacManDirection();
        const ambushPosition = getAmbushPosition(pacmanPosition, pacmanDirection);
        const distanceFromPacMan = manhattanDistance(pacmanPosition, ambusherGhost.position)
        let targetPosition;

        if (PacMan.poweredUp) {
            ambusherGhost.retracePath();
            return;
        }
        
        if (distanceFromPacMan <= 4) {
            targetPosition = pacmanPosition;
        } else {
            targetPosition = ambushPosition
        }

        const route = bfs(ambusherGhost.position, targetPosition);

        if (route.length > 0) {
            const nextMove = route[0];
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
            const newPosition = ambusherGhost.position + move;
            if (isValidMove(newPosition)) {
                ambusherGhost.move(newPosition);
                checkCollision();
            }
        }
    }

    // function reverseDirection(direction) {
    //     switch (direction) {
    //         case 'up': return 'down';
    //         case 'down': return 'up';
    //         case 'left': return 'right';
    //         case 'right': return 'left';
    //     }
    // }

    function moveRandomGhost() {
        randomPosition = Math.floor(Math.random() * cells.length);
        if (isValidMove(randomPosition)) {
            randomGhost.move(randomPosition);
            checkCollision()
        }
    }

    const chaserGhostInterval = setInterval(moveChaserGhost, 500);
    const ambusherGhostInterval = setInterval(moveAmbusherGhost, 500);
    const randomGhostInterval = setInterval(moveRandomGhost, 2000);

    function checkCollision() {
        if (powerPelletActive) {
            if (chaserGhost.position === PacMan.position) {
                pacManAteGhost('chaser');
            } else if (ambusherGhost.position === PacMan.position) {
                pacManAteGhost('ambusher');
            } else if (randomGhost.position === PacMan.position) {
                pacManAteGhost('random');
            }
        } else if (chaserGhost.position === PacMan.position || ambusherGhost.position === PacMan.position || randomGhost.position === PacMan.position) {
            ghostGotPacMan();
        }
    }

    function pacManAteGhost(eatenGhost) {
        score += 250;
        resetEatenGhost(eatenGhost)
    }

    const innerSquare = {
        chaser: 189,
        ambusher: 199,
        random: 210
    };

    function resetEatenGhost(ghost) {
        switch (ghost) {
            case 'chaser':
                chaserGhost.position = innerSquare.chaser;
                chaserGhost.displayGhost();
                break;
            case 'ambusher':
                ambusherGhost.position = innerSquare.ambusher;
                ambusherGhost.displayGhost();
                break;
            case 'random':
                randomGhost.position = innerSquare.random;
                randomGhost.displayGhost();
                break;
        }
    }


    function ghostGotPacMan() {
        score -= 500;
        scoreText.textContent = `Score: ${score}`
        if (lives === 0) {
            gameOver();
            return
        }
        if (lives === 1) {
            livesText.textContent = 'Final Life';
            lives--;
            resetPositions();
            return;
        }
        lives--;
        livesText.textContent = `Lives: ${'❤️'.repeat(lives)}`;
        resetPositions();
    }

    function gameOver() {
        alert(`Oh no, the ghosts got you! Game over! Your final score is: ${score}.`)
        let fullReset = true;
        resetGame(fullReset);
    }

    function resetGame() {
        powerPelletActive = false;
        clearTimeout(powerPelletTimeout);
        clearInterval(ambusherGhostInterval);
        clearInterval(chaserGhostInterval);
        clearInterval(randomGhostInterval);
        window.removeEventListener("keydown", movePacMan)
        score = 0;
        scoreText.textContent = `Score: ${score}`;
        lives = 3;
        livesText.textContent = `Lives: ${'❤️'.repeat(lives)}`
        grid.innerHTML = ''
        cells.length = 0;
        createGrid();
        resetPositions();
    }

    function resetPositions() {
        PacMan.position = 21;
        chaserGhost.position = 68;
        ambusherGhost.position = 287
        PacMan.displayPacMan();
        chaserGhost.displayGhost();
        ambusherGhost.displayGhost();
    }
}

window.addEventListener("DOMContentLoaded", init);




