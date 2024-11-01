
const board = document.getElementById('board');
const restartBtn = document.getElementById('restart');
const statusDisplay = document.getElementById('status');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');


let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let scoreX = 0;
let scoreO = 0;


const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


function createBoard() {
    board.innerHTML = '';
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('mouseover', showPreview);
        cell.addEventListener('mouseout', removePreview);
        board.appendChild(cell);
    }
}


function showPreview(event) {
    const cell = event.target;
    const cellIndex = cell.dataset.index;

    if (gameState[cellIndex] === "" && gameActive) {
        cell.textContent = currentPlayer;
        cell.classList.add('preview');
    }
}


function removePreview(event) {
    const cell = event.target;
    if (cell.classList.contains('preview')) {
        cell.textContent = '';
        cell.classList.remove('preview');
    }
}


function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.dataset.index;

    if (gameState[clickedIndex] !== "" || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.remove('preview');

    checkResult();
}


function checkResult() {
    let roundWon = false;
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        updateScore();
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}


function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXDisplay.textContent = `Player X: ${scoreX} wins`;
    } else {
        scoreO++;
        scoreODisplay.textContent = `Player O: ${scoreO} wins`;
    }
}


restartBtn.addEventListener('click', createBoard);


createBoard();
