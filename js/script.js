// Initialize variables
let board = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // Player X starts
let gameActive = false; // To track game state
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal wins
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical wins
    [0, 4, 8], [2, 4, 6]             // Diagonal wins
];

// Elements
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const startGameButton = document.getElementById('start-game');
const backButton = document.getElementById('back');
const opponentSelect = document.getElementById('opponent');
const winnerPopup = document.getElementById('winner-popup');
const winnerMessage = document.getElementById('winner-text');

// Handle cell click
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (board[cellIndex] !== '' || !gameActive) {
        return; // Do nothing if the cell is already filled or game is inactive
    }

    // Update board and UI
    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    // Check for win or draw
    checkResult();

    // If playing against AI and it's AI's turn, let AI make its move
    if (gameActive && opponentSelect.value === 'ai' && currentPlayer === 'O') {
        setTimeout(aiMove, 500); // AI moves after a short delay
    }
}

// AI makes a move with improved logic
function aiMove() {
    // Check for winning move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') {
            makeMove(c);
            return;
        }
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') {
            makeMove(b);
            return;
        }
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') {
            makeMove(a);
            return;
        }
    }

    // Block opponent's winning move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
            makeMove(c);
            return;
        }
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') {
            makeMove(b);
            return;
        }
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') {
            makeMove(a);
            return;
        }
    }

    // Choose a corner if available
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
        if (board[corner] === '') {
            makeMove(corner);
            return;
        }
    }

    // Choose center if available
    if (board[4] === '') {
        makeMove(4);
        return;
    }

    // Choose any available space
    let emptyCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomCell);
    }
}

// Make the move and update UI
function makeMove(index) {
    board[index] = 'O';
    document.querySelector(`.cell[data-index="${index}"]`).textContent = 'O';
    checkResult();
}

// Check game result
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        message.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        showPopup(currentPlayer);
        return;
    }

    // Check for draw
    if (!board.includes('')) {
        message.textContent = `It's a Draw!`;
        gameActive = false;
        showPopup("Draw");
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s Turn`;
}

// Show win/draw popup
function showPopup(winner) {
    if (winner === "Draw") {
        winnerMessage.textContent = "It's a Draw!";
    } else {
        winnerMessage.textContent = `Player ${winner} Wins!`;
    }
    winnerPopup.style.display = "flex"; // Show the popup
}

// Close popup function
function closePopup() {
    winnerPopup.style.display = "none"; // Hide the popup
    resetGame(); // Reset game after winner popup closes
}

// Start the game
function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = `Player X's Turn`;

    // Show the board and buttons
    document.querySelector('.board').style.display = 'grid'; // Show the board as grid
    resetButton.style.display = 'block';
    backButton.style.display = 'block';
    
    cells.forEach(cell => {
        cell.textContent = ''; // Clear cell content
        cell.addEventListener('click', handleCellClick); // Add click event
    });

    winnerPopup.style.display = "none"; // Hide the popup
    opponentSelect.style.display = 'none'; // Hide opponent selection
    startGameButton.style.display = 'none'; // Hide start button
}

// Back to opponent selection
function goBack() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    currentPlayer = 'X';
    message.textContent = `Select Opponent and Start the Game!`;
    
    document.querySelector('.board').style.display = 'none'; // Hide the board
    resetButton.style.display = 'none'; // Hide reset button
    backButton.style.display = 'none'; // Hide back button
    opponentSelect.style.display = 'block'; // Show opponent selection
    startGameButton.style.display = 'block'; // Show start button
}

// Reset the game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = false;
    currentPlayer = 'X';
    message.textContent = `Select Opponent and Start the Game!`;

    cells.forEach(cell => {
        cell.textContent = ''; // Clear cell content
    });

    document.querySelector('.board').style.display = 'none'; // Hide the board
    resetButton.style.display = 'none'; // Hide reset button
    backButton.style.display = 'none'; // Hide back button
    opponentSelect.style.display = 'block'; // Show opponent selection
    startGameButton.style.display = 'block'; // Show start button
}

// Event listeners
startGameButton.addEventListener('click', startGame);
backButton.addEventListener('click', goBack);
winnerPopup.addEventListener('click', closePopup);
