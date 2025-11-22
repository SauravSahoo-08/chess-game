// Professional Chess Game with 1v1 and AI modes
// Chess pieces Unicode symbols
const pieces = {
    white: {
        king: '♔', queen: '♕', rook: '♖', 
        bishop: '♗', knight: '♘', pawn: '♙'
    },
    black: {
        king: '♚', queen: '♛', rook: '♜', 
        bishop: '♝', knight: '♞', pawn: '♟'
    }
};

// Game state
let gameState = {
    board: [],
    currentPlayer: 'white',
    selectedSquare: null,
    moveHistory: [],
    isAIMode: false,
    gameOver: false,
    moveCount: 0
};

// Initialize the board
function initBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Setup black pieces
    board[0] = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
    board[1] = Array(8).fill('♟');
    
    // Setup white pieces
    board[6] = Array(8).fill('♙');
    board[7] = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
    
    return board;
}

// Create the visual chessboard
function createBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            
            const piece = gameState.board[row][col];
            if (piece) {
                square.textContent = piece;
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));
            chessboard.appendChild(square);
        }
    }
}

// Handle square clicks
function handleSquareClick(row, col) {
    if (gameState.gameOver) return;
    
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = gameState.board[row][col];
    
    // If a piece is already selected
    if (gameState.selectedSquare) {
        const [selectedRow, selectedCol] = gameState.selectedSquare;
        
        // Try to move
        if (isValidMove(selectedRow, selectedCol, row, col)) {
            makeMove(selectedRow, selectedCol, row, col);
            clearSelection();
            
            // AI move in AI mode
            if (gameState.isAIMode && gameState.currentPlayer === 'black') {
                setTimeout(makeAIMove, 500);
            }
        } else {
            clearSelection();
            // Select new piece if it belongs to current player
            if (piece && isPieceOfCurrentPlayer(piece)) {
                selectSquare(row, col);
            }
        }
    } else {
        // Select piece if it belongs to current player
        if (piece && isPieceOfCurrentPlayer(piece)) {
            selectSquare(row, col);
        }
    }
}

// Select a square
function selectSquare(row, col) {
    gameState.selectedSquare = [row, col];
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('selected');
    showValidMoves(row, col);
}

// Clear selection
function clearSelection() {
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'valid-move', 'capture-move');
    });
    gameState.selectedSquare = null;
}

// Check if piece belongs to current player
function isPieceOfCurrentPlayer(piece) {
    const whitePieces = Object.values(pieces.white);
    const blackPieces = Object.values(pieces.black);
    
    if (gameState.currentPlayer === 'white') {
        return whitePieces.includes(piece);
    } else {
        return blackPieces.includes(piece);
    }
}

// Basic move validation (simplified)
function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Can't move to same square
    if (fromRow === toRow && fromCol === toCol) return false;
    
    const piece = gameState.board[fromRow][fromCol];
    const targetPiece = gameState.board[toRow][toCol];
    
    // Can't capture own piece
    if (targetPiece && isPieceOfCurrentPlayer(targetPiece)) return false;
    
    // Simplified movement rules (can be expanded)
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    // Basic pawn movement
    if (piece === '♙' || piece === '♟') {
        const direction = piece === '♙' ? -1 : 1;
        const startRow = piece === '♙' ? 6 : 1;
        
        // Forward move
        if (fromCol === toCol && !targetPiece) {
            if (toRow === fromRow + direction) return true;
            if (fromRow === startRow && toRow === fromRow + 2 * direction) return true;
        }
        // Capture
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) {
            return true;
        }
        return false;
    }
    
    // Rook movement
    if (piece === '♖' || piece === '♜') {
        if (fromRow === toRow || fromCol === toCol) {
            return isPathClear(fromRow, fromCol, toRow, toCol);
        }
        return false;
    }
    
    // Bishop movement
    if (piece === '♗' || piece === '♝') {
        if (rowDiff === colDiff) {
            return isPathClear(fromRow, fromCol, toRow, toCol);
        }
        return false;
    }
    
    // Queen movement
    if (piece === '♕' || piece === '♛') {
        if (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) {
            return isPathClear(fromRow, fromCol, toRow, toCol);
        }
        return false;
    }
    
    // Knight movement
    if (piece === '♘' || piece === '♞') {
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    
    // King movement
    if (piece === '♔' || piece === '♚') {
        return rowDiff <= 1 && colDiff <= 1;
    }
    
    return false;
}

// Check if path is clear
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        if (gameState.board[currentRow][currentCol]) return false;
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

// Show valid moves
function showValidMoves(row, col) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(row, col, r, c)) {
                const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                if (gameState.board[r][c]) {
                    square.classList.add('capture-move');
                } else {
                    square.classList.add('valid-move');
                }
            }
        }
    }
}

// Make a move
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = gameState.board[fromRow][fromCol];
    const capturedPiece = gameState.board[toRow][toCol];
    
    gameState.board[toRow][toCol] = piece;
    gameState.board[fromRow][fromCol] = null;
    
    // Record move
    gameState.moveCount++;
    const moveNotation = `${piece} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    gameState.moveHistory.push(moveNotation);
    updateMoveHistory();
    
    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    updateTurnIndicator();
    
    // Update board
    createBoard();
    document.getElementById('move-count').textContent = gameState.moveCount;
    
    // Check for game over (simplified - just check if king is captured)
    checkGameOver();
}

// Simple AI move
function makeAIMove() {
    const validMoves = [];
    
    // Find all valid moves for black
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = gameState.board[fromRow][fromCol];
            if (piece && !isPieceOfCurrentPlayer(piece)) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                            validMoves.push({fromRow, fromCol, toRow, toCol});
                        }
                    }
                }
            }
        }
    }
    
    if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol);
    }
}

// Update turn indicator
function updateTurnIndicator() {
    const whiteIndicator = document.querySelector('.white-player .turn-indicator');
    const blackIndicator = document.querySelector('.black-player .turn-indicator');
    
    if (gameState.currentPlayer === 'white') {
        whiteIndicator.textContent = 'Your Turn';
        blackIndicator.textContent = 'Waiting...';
    } else {
        whiteIndicator.textContent = 'Waiting...';
        blackIndicator.textContent = 'Your Turn';
    }
}

// Update move history
function updateMoveHistory() {
    const movesList = document.getElementById('moves-list');
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    const moveDiv = document.createElement('div');
    moveDiv.textContent = `${gameState.moveHistory.length}. ${lastMove}`;
    movesList.appendChild(moveDiv);
    movesList.scrollTop = movesList.scrollHeight;
}

// Check game over
function checkGameOver() {
    let whiteKing = false, blackKing = false;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = gameState.board[row][col];
            if (piece === '♔') whiteKing = true;
            if (piece === '♚') blackKing = true;
        }
    }
    
    if (!whiteKing || !blackKing) {
        gameState.gameOver = true;
        const winner = whiteKing ? 'White' : 'Black';
        showGameOver(winner);
    }
}

// Show game over modal
function showGameOver(winner) {
    const modal = document.getElementById('game-over-modal');
    const winnerText = document.getElementById('winner-text');
    winnerText.textContent = `${winner} Wins!`;
    modal.classList.add('show');
}

// New game
function newGame() {
    gameState = {
        board: initBoard(),
        currentPlayer: 'white',
        selectedSquare: null,
        moveHistory: [],
        isAIMode: gameState.isAIMode,
        gameOver: false,
        moveCount: 0
    };
    
    document.getElementById('move-count').textContent = '0';
    document.getElementById('moves-list').innerHTML = '';
    document.getElementById('game-over-modal').classList.remove('show');
    
    createBoard();
    updateTurnIndicator();
}

// Event Listeners
document.getElementById('pvp-mode').addEventListener('click', function() {
    gameState.isAIMode = false;
    document.getElementById('pvp-mode').classList.add('active');
    document.getElementById('ai-mode').classList.remove('active');
    newGame();
});

document.getElementById('ai-mode').addEventListener('click', function() {
    gameState.isAIMode = true;
    document.getElementById('ai-mode').classList.add('active');
    document.getElementById('pvp-mode').classList.remove('active');
    newGame();
});

document.getElementById('new-game').addEventListener('click', newGame);

document.getElementById('undo').addEventListener('click', function() {
    // Implement undo functionality
    alert('Undo feature coming soon!');
});

document.getElementById('hint').addEventListener('click', function() {
    // Implement hint functionality
    alert('Hint feature coming soon!');
});

document.getElementById('play-again').addEventListener('click', newGame);

// Initialize game on page load
window.addEventListener('DOMContentLoaded', function() {
    gameState.board = initBoard();
    createBoard();
    updateTurnIndicator();
});
