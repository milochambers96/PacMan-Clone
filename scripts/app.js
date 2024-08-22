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
    1, 0, 1, 0, 1, 0, 1, 0, 4, 3, 3, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 3, 4, 0, 1, 0, 1, 0, 1, 0, 1,
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

let gameStarted = false;

//Code relating to characters - PacMan and Ghosts
const pacman = {
    position: 21,
    currentCell: null,
    poweredUp: false,
    displayPacman() {
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
            this.displayPacman();
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
        } else {
            this.ghostBecamePaniced();
        }
    },
    ghostBecamePaniced() {
            const possibleMoves = ['up', 'down', 'left', 'right'];
            const randomMoveIndex = Math.floor(Math.random() * possibleMoves.length);
            const randomMove = possibleMoves[randomMoveIndex];
            const newPosition = this.position + getDirection(randomMove);
            if (isValidMove(newPosition)) {
                this.move(newPosition);
            }
        }
    }


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
        } else {
            this.ghostBecamePaniced();
        }
    },
    ghostBecamePaniced() {
            const possibleMoves = ['up', 'down', 'left', 'right'];
            const randomMoveIndex = Math.floor(Math.random() * possibleMoves.length);
            const randomMove = possibleMoves[randomMoveIndex];
            const newPosition = this.position + getDirection(randomMove);
            if (isValidMove(newPosition)) {
                this.move(newPosition);
            }
        }
    }

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

    while (queue.length > 0) {
        let { position, path } = queue.shift()
        if (position === destination) {
            return path;
        }
        for (const { move, direction } of directions) {
            const newPosition = position + move;
            // has is a method for Sets - returns boolean value as whether an element with the specifed value exists. 
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
        targetPosition = pacmanPosition;
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

function getDirection(direction) {
    switch (direction) {
        case 'up':
            return -width;
        case 'down':
            return width;
        case 'left':
            return -1;
        case 'right':
            return 1;
    }
} 

function init() {
    const grid = document.querySelector('#grid');
    const scoreText = document.querySelector('#score');
    const livesText = document.querySelector('#lives');
    const startButton = document.querySelector('#start-game')

    let lives = 3;
    let score = 0;
    let ambusherGhostInterval;
    let chaserGhostInterval;
    let randomGhostInterval;
    let pacmanDirection = 'right'
     

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
                cell.appendChild(powerPellet);
            } else if (mazeLayout[i] === 3) {
                cell.classList.add('ghost-house', 'path'); 
                const pellet = document.createElement('div');
                pellet.classList.add('pellet');
                cell.appendChild(pellet);
            } else if (mazeLayout[i] === 4) {
                cell.classList.add('ghost-house-door', 'path'); 
                const pellet = document.createElement('div');
                pellet.classList.add('pellet');
                cell.appendChild(pellet);
            } else {
                cell.classList.add('path');
                const pellet = document.createElement('div');
                pellet.classList.add('pellet');
                cell.appendChild(pellet);
            }
        }
        pacman.displayPacman();
        chaserGhost.displayGhost();
        ambusherGhost.displayGhost();
        randomGhost.displayGhost();
    }
    createGrid();

    startButton.addEventListener('click', startGame);


    function startGame() {
        gameStarted = true;
        startButton.disabled = true;
        ambusherGhostInterval = setInterval(moveAmbusherGhost, 500);
        chaserGhostInterval = setInterval(moveChaserGhost, 500);
        randomGhostInterval = setInterval(moveRandomGhost, 3000);
        window.addEventListener("keyup", movePacman);
    }

    // In Game Code relating to PacMan

    function movePacman(event) {
        let newPosition;
        event.preventDefault();
        // Added to prevent window scrolling if the player holds down the down or up arrows.
        switch (event.keyCode) {
            case 37:
                if (pacman.position % width !== 0) {
                    newPosition = pacman.position - 1;
                    pacmanDirection = 'left';
                }
                break;
            case 38:
                if (pacman.position >= width) {
                    newPosition = pacman.position - width;
                    pacmanDirection = 'up';
                }
                break;
            case 39:
                if (pacman.position % width < width - 1) {
                    newPosition = pacman.position + 1;
                    pacmanDirection = 'right';
                }
                break;
            case 40:
                if (pacman.position < gridSize - width) {
                    newPosition = pacman.position + width;
                    pacmanDirection = 'down';
                }
                break;
        }
        if (newPosition !== undefined) {
            pacman.move(newPosition);
        }
        pacmanAteAPellet();
        checkCollision();
    }

    // Code relating to pellets & power pellets.
    const arrayOfPellets = Array.from(document.querySelectorAll('.pellet'));
    const arrayOfPowerPellets = Array.from(document.querySelectorAll('.power-pellet'));
    let pellets = arrayOfPellets.length;
    let powerPelletActive = false;
    let powerPelletTimeout;

    function pacmanAteAPellet() {
        cells.forEach((cell) => {
            if (cell.classList.contains('pacman') || cell.classList.contains('pacman-powerup')) {
                const pellet = cell.querySelector('.pellet');
                const powerPellet = cell.querySelector('.power-pellet');
                if (pellet) {
                    pellet.remove();
                    pellets--;
                    score += 10;
                    scoreText.textContent = `Score: ${score}`;
                } else if (powerPellet) {
                    powerPellet.remove();
                    score += 50;
                    powerUp(); 
                }
            }
        });
        if (pellets <= 0) {
            gameComplete();
        }
    }
    

    function powerUp() {
        if (powerPelletActive) {
            return
        }
        powerPelletActive = true;
        pacman.poweredUp = true;
        clearInterval(randomGhostInterval)
        updateGhostHouseDoors(true);
        setTimeout(() => {
            powerPelletActive = false;
            pacman.poweredUp = false;
            updateGhostHouseDoors(false)
            randomGhostInterval = setInterval(moveRandomGhost, 3000);
        }, 10000)
    }

    function updateGhostHouseDoors(toWalls = true) {
        const ghostHouseDoors = document.querySelectorAll('.ghost-house-door');
        ghostHouseDoors.forEach((door) => {
            if (toWalls) {
                door.classList.remove('path');
                door.classList.add('wall');
            } else {
                door.classList.remove('wall');
                door.classList.add('path');
            }
        });
    }


    function gameComplete() {
        alert(`Congratulations, you beat the game! Your final score is: ${score}`);
        resetGame();
    }

    // Move chaser Ghost 
    function moveChaserGhost() {
        const ghostPosition = chaserGhost.position;
        const pacmanPosition = pacman.position;
        if (pacman.poweredUp) {
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

    function getPacmanDirection() {
        return pacmanDirection;
    }

    function moveAmbusherGhost() {
        const pacmanPosition = pacman.position;
        const pacmanDirection = getPacmanDirection();
        const ambushPosition = getAmbushPosition(pacmanPosition, pacmanDirection);
        const distanceFromPacman = manhattanDistance(pacmanPosition, ambusherGhost.position)
        let targetPosition;

        if (pacman.poweredUp) {
            ambusherGhost.retracePath();
            return;
        }
        
        if (distanceFromPacman <= 4) {
            targetPosition = pacmanPosition;
        } else {
            targetPosition = ambushPosition;
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

    function moveRandomGhost() {
        randomPosition = Math.floor(Math.random() * cells.length);
        if (isValidMove(randomPosition)) {
            randomGhost.move(randomPosition);
            checkCollision();
        }
    }

    function checkCollision() {
        if (powerPelletActive) {
            if (chaserGhost.position === pacman.position) {
                pacmanAteGhost('chaser');
            } else if (ambusherGhost.position === pacman.position) {
                pacmanAteGhost('ambusher');
            } else if (randomGhost.position === pacman.position) {
                pacmanAteGhost('random');
            }
        } else if (chaserGhost.position === pacman.position || ambusherGhost.position === pacman.position || randomGhost.position === pacman.position) {
            ghostGotPacman();
        }
    }

    function pacmanAteGhost(eatenGhost) {
        score += 250;
        resetEatenGhost(eatenGhost);
    }

    const ghostHouse = {
        chaser: 189,
        ambusher: 190,
        random: 210
    };

    function resetEatenGhost(ghost) {
        switch (ghost) {
            case 'chaser':
                chaserGhost.position = ghostHouse.chaser;
                chaserGhost.pathHistory = [];
                chaserGhost.displayGhost();
                break;
            case 'ambusher':
                ambusherGhost.position = ghostHouse.ambusher;
                ambusherGhost.pathHistory= [];
                ambusherGhost.displayGhost();
                break;
            case 'random':
                randomGhost.position = ghostHouse.random;
                randomGhost.displayGhost();
                break;
        }
    }


    function ghostGotPacman() {
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
        scoreText.textContent = `Score: ${score}`
        alert(`Oh no, the ghosts got you! Game over! Your final score is: ${score}.`)
        resetGame();
    }

    function resetGame() {
        gameStarted = false;
        powerPelletActive = false;
        clearTimeout(powerPelletTimeout);
        clearInterval(ambusherGhostInterval);
        clearInterval(chaserGhostInterval);
        clearInterval(randomGhostInterval);
        startButton.disabled = false;
        window.removeEventListener("keyup", movePacman)
        score = 0;
        scoreText.textContent = `Score: ${score}`;
        lives = 3;
        livesText.textContent = `Lives: ${'❤️'.repeat(lives)}`
        grid.innerHTML = ''
        cells.length = 0;
        createGrid();
        resetPositions();
        resetPellets();
    }

    function resetPositions() {
        pacman.position = 21;
        chaserGhost.position = 68;
        ambusherGhost.position = 287;
        pacman.displayPacman();
        chaserGhost.displayGhost();
        ambusherGhost.displayGhost();
    }

    function resetPellets() {
        pellets = arrayOfPellets.length
    } 
}

window.addEventListener("DOMContentLoaded", init);




