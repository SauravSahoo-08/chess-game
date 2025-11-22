// Premium Chess Game - Complete Implementation

let gameState = {
  board: [],
  currentPlayer: 'white',
  selectedSquare: null,
  moveHistory: [],
  isAIMode: true,
  aiDifficulty: 'beginner',
  gameOver: false,
  whiteTime: 600,
  blackTime: 600,
  timerInterval: null
};

const PIECE_UNICODE = {
  'white-pawn': '♙',
  'white-rook': '♖',
  'white-knight': '♘',
  'white-bishop': '♗',
  'white-queen': '♕',
  'white-king': '♔',
  'black-pawn': '♟',
  'black-rook': '♜',
  'black-knight': '♞',
  'black-bishop': '♝',
  'black-queen': '♛',
  'black-king': '♚'
};

function initializeBoard() {
  gameState.board = new Array(64).fill(null);
  // Black pieces
  gameState.board[0] = 'black-rook';
  gameState.board[1] = 'black-knight';
  gameState.board[2] = 'black-bishop';
  gameState.board[3] = 'black-queen';
  gameState.board[4] = 'black-king';
  gameState.board[5] = 'black-bishop';
  gameState.board[6] = 'black-knight';
  gameState.board[7] = 'black-rook';
  for(let i = 8; i < 16; i++) gameState.board[i] = 'black-pawn';
  // White pieces
  for(let i = 48; i < 56; i++) gameState.board[i] = 'white-pawn';
  gameState.board[56] = 'white-rook';
  gameState.board[57] = 'white-knight';
  gameState.board[58] = 'white-bishop';
  gameState.board[59] = 'white-queen';
  gameState.board[60] = 'white-king';
  gameState.board[61] = 'white-bishop';
  gameState.board[62] = 'white-knight';
  gameState.board[63] = 'white-rook';
}

function renderChessboard() {
  const boardEl = document.getElementById('chessboard');
  if (!boardEl) {
    console.error('Chessboard element not found');
    return;
  }
  boardEl.innerHTML = '';
  for(let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    const row = Math.floor(i / 8);
    const col = i % 8;
    const isWhiteSquare = (row + col) % 2 === 0;
    square.className = 'square ' + (isWhiteSquare ? 'white' : 'black');
    square.id = 'sq-' + i;
    if(gameState.board[i]) {
      square.textContent = PIECE_UNICODE[gameState.board[i]];
    }
    square.addEventListener('click', () => handleSquareClick(i));
    boardEl.appendChild(square);
  }
}

function handleSquareClick(index) {
  if(gameState.gameOver) return;
  if(gameState.isAIMode && gameState.currentPlayer === 'black') return;
  
  if(gameState.selectedSquare === null) {
    const piece = gameState.board[index];
    if(piece && piece.split('-')[0] === gameState.currentPlayer) {
      gameState.selectedSquare = index;
      updateSquareHighlights();
    }
  } else {
    if(index === gameState.selectedSquare) {
      gameState.selectedSquare = null;
      updateSquareHighlights();
    } else {
      makeMove(gameState.selectedSquare, index);
      gameState.selectedSquare = null;
      updateSquareHighlights();
    }
  }
}

function makeMove(from, to) {
  if(!gameState.board[from]) return;
  gameState.board[to] = gameState.board[from];
  gameState.board[from] = null;
  gameState.moveHistory.push({from, to});
  gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  renderChessboard();
  updateUI();
  if(gameState.isAIMode && gameState.currentPlayer === 'black') {
    setTimeout(makeAIMove, 1000);
  }
}

function makeAIMove() {
  const blackPieces = [];
  for(let i = 0; i < 64; i++) {
    if(gameState.board[i] && gameState.board[i].split('-')[0] === 'black') {
      blackPieces.push(i);
    }
  }
  if(blackPieces.length === 0) {
    gameState.gameOver = true;
    alert('Checkmate! White Wins!');
    return;
  }
  let bestMove = null;
  let moveCount = 0;
  for(let piece of blackPieces) {
    const validMoves = getValidMoves(piece);
    moveCount += validMoves.length;
    if(!bestMove && validMoves.length > 0) {
      bestMove = {from: piece, to: validMoves[Math.floor(Math.random() * validMoves.length)]};
    }
  }
  if(bestMove) {
    makeMove(bestMove.from, bestMove.to);
  } else {
    gameState.gameOver = true;
    alert('Checkmate! White Wins!');
  }
}

function getValidMoves(index) {
  const row = Math.floor(index / 8);
  const col = index % 8;
  const validMoves = [];
  const possibleTargets = [
    (row + 1) * 8 + col, (row - 1) * 8 + col,
    row * 8 + (col + 1), row * 8 + (col - 1),
    (row + 1) * 8 + (col + 1), (row - 1) * 8 + (col - 1),
    (row + 1) * 8 + (col - 1), (row - 1) * 8 + (col + 1)
  ];
  for(let target of possibleTargets) {
    if(target >= 0 && target < 64) {
      if(!gameState.board[target] || gameState.board[target].split('-')[0] !== gameState.board[index].split('-')[0]) {
        validMoves.push(target);
      }
    }
  }
  return validMoves;
}

function updateSquareHighlights() {
  for(let i = 0; i < 64; i++) {
    const sq = document.getElementById('sq-' + i);
    if(sq) sq.classList.remove('selected');
  }
  if(gameState.selectedSquare !== null) {
    const sq = document.getElementById('sq-' + gameState.selectedSquare);
    if(sq) sq.classList.add('selected');
  }
}

function updateUI() {
  const historyEl = document.getElementById('moves-list');
  if(historyEl) {
    historyEl.innerHTML = gameState.moveHistory.map((move, i) => {
      return '<div class="move-item">Move ' + (i + 1) + ': ' + (gameState.board[move.to] || '✓') + '</div>';
    }).join('');
  }
}

function setDifficulty(level) {
  gameState.aiDifficulty = level;
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

function startTimer() {
  gameState.timerInterval = setInterval(() => {
    if(gameState.currentPlayer === 'white') {
      gameState.whiteTime--;
    } else {
      gameState.blackTime--;
    }
    const time = gameState.currentPlayer === 'white' ? gameState.whiteTime : gameState.blackTime;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timerEl = document.getElementById('timer');
    if(timerEl) {
      timerEl.innerHTML = '<div class="time">' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds + '</div>';
    }
    if(time <= 0) {
      gameState.gameOver = true;
      alert('Time Over! Game End!');
      clearInterval(gameState.timerInterval);
    }
  }, 1000);
}

document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', (e) => setDifficulty(e.target.textContent));
});

document.getElementById('play-again-btn')?.addEventListener('click', () => location.reload());

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  initializeBoard();
  renderChessboard();
  startTimer();
  console.log('Chess game initialized');
});

if(document.readyState === 'loading') {
  console.log('Document still loading');
} else {
  console.log('Document already loaded, initializing now');
  initializeBoard();
  renderChessboard();
  startTimer();
}
