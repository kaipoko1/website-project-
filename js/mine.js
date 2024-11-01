const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const flagCountDisplay = document.getElementById('mine-count'); 
const winCountDisplay = document.getElementById('win-count');
const lossCountDisplay = document.getElementById('loss-count');

const rows = 10;
const cols = 10;
const totalMines = 10;
let grid = [];
let minePositions = [];
let revealedCount = 0;
let wins = 0;
let losses = 0;
let gameOver = false;
let flagsPlaced = 0; 


function initGame() {
    board.innerHTML = '';
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    minePositions = [];
    revealedCount = 0;
    gameOver = false;
    flagsPlaced = 0; 
    placeMines();
    calculateNumbers();
    createCells();
    flagCountDisplay.textContent = totalMines; 
    winCountDisplay.textContent = `Wins: ${wins}`;
    lossCountDisplay.textContent = `Losses: ${losses}`;
}


function placeMines() {
    while (minePositions.length < totalMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!minePositions.some(pos => pos[0] === row && pos[1] === col)) {
            minePositions.push([row, col]);
            grid[row][col] = 'M'; 
        }
    }
}


function calculateNumbers() {
    minePositions.forEach(([r, c]) => {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols && grid[r + i][c + j] !== 'M') {
                    grid[r + i][c + j]++;
                }
            }
        }
    });
}


function createCells() {
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;
            cellElement.addEventListener('click', handleCellClick);
            cellElement.addEventListener('contextmenu', handleRightClick);
            board.appendChild(cellElement);
        });
    });
}


function handleCellClick(event) {
    if (gameOver) return; 
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    revealCell(row, col);
}


function handleRightClick(event) {
    event.preventDefault(); 
    if (gameOver) return; 
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;
    toggleFlag(row, col);
}


function revealCell(row, col) {
    const cellValue = grid[row][col];
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (cellElement.classList.contains('revealed') || cellElement.classList.contains('flag')) return; 

    cellElement.classList.add('revealed');
    revealedCount++; 

    if (cellValue === 'M') {
        cellElement.textContent = '💣'; 
        cellElement.classList.add('mine');
        losses++; 
        lossCountDisplay.textContent = `Losses: ${losses}`; 
        alert('Game Over! You hit a mine.');
        animateLoss(); 
        gameOver = true; 
    } else if (cellValue > 0) {
        cellElement.classList.add(`number-${cellValue}`);
        cellElement.textContent = cellValue;
    } else {
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = parseInt(row) + i;
                const newCol = parseInt(col) + j;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }

    
    if (checkWinCondition()) {
        wins++; 
        winCountDisplay.textContent = `Wins: ${wins}`; 
        alert('Congratulations! You win!');
        animateWin(); 
        gameOver = true; 
    }
}

function toggleFlag(row, col) {
    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (cellElement.classList.contains('revealed')) return; 

    if (cellElement.classList.contains('flag')) {
        cellElement.classList.remove('flag');
        cellElement.textContent = ''; 
        flagsPlaced--; 
    } else {
        cellElement.classList.add('flag');
        cellElement.textContent = '🚩'; 
        flagsPlaced++; 
    }
    
    
    flagCountDisplay.textContent = `🚩 ${totalMines - flagsPlaced}`;
}


function animateWin() {
    const remainingCells = Array.from(document.querySelectorAll('.cell')).filter(cell => !cell.classList.contains('revealed'));
    let index = 0;

    const interval = setInterval(() => {
        if (index >= remainingCells.length) {
            clearInterval(interval);
            return;
        }
        const cell = remainingCells[index];
        cell.style.backgroundColor = 'green'; 
        cell.classList.add('sparkle'); 
        cell.textContent = ''; 
        index++;
    }, 300); 
}


function animateLoss() {
    let index = 0;

    const interval = setInterval(() => {
        if (index >= minePositions.length) {
            clearInterval(interval);
            return;
        }
        const [r, c] = minePositions[index];
        const cellElement = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cellElement.textContent = '💣'; 
        cellElement.classList.add('mine'); 
        index++;
    }, 300); 
}


function checkWinCondition() {
    return revealedCount === (rows * cols - totalMines); 
}


resetButton.addEventListener('click', initGame);


initGame();
