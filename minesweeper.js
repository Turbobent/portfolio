
// Define levels 
const levels = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 20 },
    hard: { rows: 16, cols: 16, mines: 40 }
};

// Game Configuration
let board = [];
let revealedCells = 0;

// Minesweeper game initialization
function initGame(level = 'easy') {
    const currentLevel = levels[level];
    const { rows, cols, mines } = currentLevel;
    
    board = [];
    revealedCells = 0;
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = '';

    // Set up grid size
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    // Create the game board and cells
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({ mine: false, revealed: false, neighborMines: 0 });
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => revealCell(r, c, rows, cols, mines));
            gameBoard.appendChild(cell);
        }
        board.push(row);
        
    }

    placeMines(rows, cols, mines);
    calculateNeighborMines(rows, cols);
}

// Update placeMines to use the provided level dimensions and mine count
function placeMines(rows, cols, minesCount) {
    let placedMines = 0;
    while (placedMines < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            placedMines++;
        }
    }
}

// Update calculateNeighborMines to use the provided level dimensions
function calculateNeighborMines(rows, cols) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) continue;
            let mines = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const nr = r + i;
                    const nc = c + j;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                        mines++;
                    }
                }
            }
            board[r][c].neighborMines = mines;
        }
    }
}

// Update the revealCell function to accept rows, cols, and mines parameters for the win condition check
function revealCell(row, col, rows, cols, mines) {
  const cell = board[row][col];
  if (cell.revealed || cell.mine) return; // Avoid processing if already revealed or a mine

  cell.revealed = true;
  revealedCells++;

  const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  cellElement.classList.add("revealed");

  if (cell.mine) {
      cellElement.classList.add("mine");
      endGame(false); // Game Over
      return;
  }

  if (cell.neighborMines > 0) {
      cellElement.textContent = cell.neighborMines;
  } else {
      // Reveal surrounding cells recursively
      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              const nr = row + i;
              const nc = col + j;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                  revealCell(nr, nc, rows, cols, mines);
              }
          }
      }
  }

  // Check for win condition
  if (revealedCells === rows * cols - mines) {
      endGame(true); // Win
  }
}

// End game function
function endGame(won) {
  const message = won ? "You Win!" : "Game Over!";
  alert(message);
  closeMineSweeperWindow(); // Close the window after the game
}

// Update time in 12-hour format
function updateTime() {
  const timeElement = document.querySelector(".time");
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock

  timeElement.textContent = `${hours}:${minutes} ${ampm}`;
}

// Set interval to update time every second
setInterval(updateTime, 1000);
updateTime();
