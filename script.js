const rows = 6;
const columns = 7;
let currentPlayer = 'red';
let board = [];
let redWins = 0;
let yellowWins = 0;

const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset');
const redScoreElement = document.getElementById('redScore');
const yellowScoreElement = document.getElementById('yellowScore');

// Initialize the board array and create HTML cells
function initBoard() {
  board = Array.from({ length: rows }, () => Array(columns).fill(null));
  boardElement.innerHTML = '';
  for (let i = 0; i < rows * columns; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = Math.floor(i / columns);
    cell.dataset.col = i % columns;
    cell.addEventListener('click', handleCellClick);
    cell.addEventListener('mouseenter', handleCellHover);
    cell.addEventListener('mouseleave', clearPreview);
    boardElement.appendChild(cell);
  }
  messageElement.textContent = `Player ${currentPlayer}'s turn`;
}

// Handle cell click
function handleCellClick(e) {
  const col = parseInt(e.target.dataset.col);
  for (let row = rows - 1; row >= 0; row--) {
    if (!board[row][col]) {
      board[row][col] = currentPlayer;
      updateBoard();
      if (checkWin(row, col)) {
        messageElement.textContent = `Player ${currentPlayer} wins!`;
        updateScore();
        endGame();
        return;
      }
      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      messageElement.textContent = `Player ${currentPlayer}'s turn`;
      return;
    }
  }
}

// Handle cell hover to show a preview piece
function handleCellHover(e) {
  const col = parseInt(e.target.dataset.col);
  for (let row = rows - 1; row >= 0; row--) {
    if (!board[row][col]) {
      const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
      cell.classList.add(`preview-${currentPlayer}`);
      break;
    }
  }
}

// Clear preview piece on mouse leave
function clearPreview() {
  const previewCells = document.querySelectorAll('.preview-red, .preview-yellow');
  previewCells.forEach(cell => cell.classList.remove('preview-red', 'preview-yellow'));
}

// Update board UI
function updateBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
      cell.classList.remove('red', 'yellow', 'preview-red', 'preview-yellow');
      if (board[row][col]) {
        cell.classList.add(board[row][col]);
      }
    }
  }
}

// Check for win
function checkWin(row, col) {
  return checkDirection(row, col, 1, 0) ||
         checkDirection(row, col, 0, 1) ||
         checkDirection(row, col, 1, 1) ||
         checkDirection(row, col, 1, -1);
}

function checkDirection(row, col, rowDir, colDir) {
  let count = 0;
  for (let i = -3; i <= 3; i++) {
    const newRow = row + i * rowDir;
    const newCol = col + i * colDir;
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns &&
        board[newRow][newCol] === currentPlayer) {
      count++;
      if (count === 4) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

// Update score and display
function updateScore() {
  if (currentPlayer === 'red') {
    redWins++;
    redScoreElement.textContent = redWins;
  } else {
    yellowWins++;
    yellowScoreElement.textContent = yellowWins;
  }
}

// End game by disabling further clicks
function endGame() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.removeEventListener('click', handleCellClick);
    cell.removeEventListener('mouseenter', handleCellHover);
    cell.removeEventListener('mouseleave', clearPreview);
  });
}

// Reset the game
resetButton.addEventListener('click', () => {
  currentPlayer = 'red';
  initBoard();
});

initBoard();
