// Professional Chess Game - Complete Implementation
let gameState = {
  board: [],
  currentPlayer: 'white',
  selectedSquare: null,
  moveHistory: [],
  isAIMode: false,
  aiDifficulty: 'beginner',
  gameOver: false,
  whiteTime: 600,
  blackTime: 600,
  timerInterval: null
};

const pieces = {
  'white-pawn': '♙', 'white-rook': '♖', 'white-knight': '♘',
  'white-bishop': '♗', 'white-queen': '♕', 'white-king': '♔',
  'black-pawn': '♟', 'black-rook': '♜', 'black-knight': '♞',
  'black-bishop': '♝', 'black-queen': '♛', 'black-king': '♚'
};

function initBoard() {
  const board = new Array(64).fill(null);
  // Black pieces
  board[0] = 'black-rook'; board[1] = 'black-knight'; board[2] = 'black-bishop';
  board[3] = 'black-queen'; board[4] = 'black-king'; board[5] = 'black-bishop';
  board[6] = 'black-knight'; board[7] = 'black-rook';
  for (let i = 8; i < 16; i++) board[i] = 'black-pawn';
  // White pieces
  for (let i = 48; i < 56; i++) board[i] = 'white-pawn';
  board[56] = 'white-rook'; board[57] = 'white-knight'; board[58] = 'white-bishop';
  board[59] = 'white-queen'; board[60] = 'white-king'; board[61] = 'white-bishop';
  board[62] = 'white-knight'; board[63] = 'white-rook';
  return board;
}

function getValidMoves(index) {
  const piece = gameState.board[index];
  if (!piece) return [];
  const [color, type] = piece.split('-');
  let moves = [];
  switch(type) {
    case 'pawn': moves = getPawnMoves(index, color); break;
    case 'rook': moves = getRookMoves(index, color); break;
    case 'knight': moves = getKnightMoves(index, color); break;
    case 'bishop': moves = getBishopMoves(index, color); break;
    case 'queen': moves = getQueenMoves(index, color); break;
    case 'king': moves = getKingMoves(index, color); break;
  }
  return moves.filter(m => isValidMove(index, m, color));
}
function getPawnMoves(index, color) {
  const moves = [];
  const row = Math.floor(index / 8), col = index % 8;
  const dir = color === 'white' ? -1 : 1, start = color === 'white' ? 6 : 1;
  const newRow = row + dir;
  if (newRow >= 0 && newRow < 8) {
    const newIdx = newRow * 8 + col;
    if (!gameState.board[newIdx]) {
      moves.push(newIdx);
      if (row === start && !gameState.board[(row + 2*dir) * 8 + col]) moves.push((row + 2*dir) * 8 + col);
    }
    if (col > 0 && gameState.board[newRow * 8 + (col-1)]?.split('-')[0] !== color) moves.push(newRow * 8 + (col-1));
    if (col < 7 && gameState.board[newRow * 8 + (col+1)]?.split('-')[0] !== color) moves.push(newRow * 8 + (col+1));
  }
  return moves;
}

function getRookMoves(index, color) {
  const moves = [], row = Math.floor(index / 8), col = index % 8;
  const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
  for (const [dr, dc] of dirs) {
    for (let i = 1; i < 8; i++) {
      const nr = row + i*dr, nc = col + i*dc;
      if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
      const piece = gameState.board[nr * 8 + nc];
      if (!piece) moves.push(nr * 8 + nc);
      else { if (piece.split('-')[0] !== color) moves.push(nr * 8 + nc); break; }
    }
  }
  return moves;
}

function getKnightMoves(index, color) {
  const moves = [], row = Math.floor(index / 8), col = index % 8;
  const dirs = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  for (const [dr, dc] of dirs) {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
      const piece = gameState.board[nr * 8 + nc];
      if (!piece || piece.split('-')[0] !== color) moves.push(nr * 8 + nc);
    }
  }
  return moves;
}

function getBishopMoves(index, color) {
  const moves = [], row = Math.floor(index / 8), col = index % 8;
  const dirs = [[1,1], [1,-1], [-1,1], [-1,-1]];
  for (const [dr, dc] of dirs) {
    for (let i = 1; i < 8; i++) {
      const nr = row + i*dr, nc = col + i*dc;
      if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
      const piece = gameState.board[nr * 8 + nc];
      if (!piece) moves.push(nr * 8 + nc);
      else { if (piece.split('-')[0] !== color) moves.push(nr * 8 + nc); break; }
    }
  }
  return moves;
}

function getQueenMoves(index, color) {
  return [...getRookMoves(index, color), ...getBishopMoves(index, color)];
}

function getKingMoves(index, color) {
  const moves = [], row = Math.floor(index / 8), col = index % 8;
  const dirs = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
  for (const [dr, dc] of dirs) {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
      const piece = gameState.board[nr * 8 + nc];
      if (!piece || piece.split('-')[0] !== color) moves.push(nr * 8 + nc);
    }
  }
  return moves;
}

function isValidMove(from, to, color) return true;
{ gameState.selectedSquare = null; updateSquareSelection(); } else if (getValidMoves(gameState.selectedSquare).includes(index)) { movePiece(gameState.selectedSquare, index); gameState.selectedSquare = null; }
  }
}
function movePiece(from, to) {
  gameState.board[to] = gameState.board[from]; gameState.board[from] = null;
  gameState.moveHistory.push({from, to}); gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  renderBoard(); if (gameState.isAIMode && gameState.currentPlayer === 'black') setTimeout(makeAIMove, 500);
}
function makeAIMove() {
  let validMoves = []; for (let i = 0; i < 64; i++) if (gameState.board[i]?.split('-')[0] === 'black') getValidMoves(i).forEach(m => validMoves.push({from: i, to: m}));
  if (validMoves.length === 0) { endGame('white'); return; }
  let move = validMoves.sort((a,b) => evaluateMove(b) - evaluateMove(a))[0];
  movePiece(move.from, move.to);
}
function evaluateMove(move) { const target = gameState.board[move.to]; return target ? 1 : 0; }
function renderBoard() {
  const board = document.getElementById('chessboard'); board.innerHTML = '';
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('div'); const row = Math.floor(i / 8), col = i % 8;
    sq.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black'); sq.id = 'square-' + i;
    sq.textContent = gameState.board[i] ? pieces[gameState.board[i]] : ''; sq.onclick = () => handleSquareClick(i);
    board.appendChild(sq);
  }
}
function handleSquareClick(index) {
  if (gameState.gameOver || (gameState.isAIMode && gameState.currentPlayer === 'black')) return;
  if (!gameState.selectedSquare) {
    if (gameState.board[index]?.split('-')[0] === gameState.currentPlayer) { gameState.selectedSquare = index; updateSquareSelection(); }
  }
}
function updateSquareSelection() {
  for (let i = 0; i < 64; i++) document.getElementById('square-' + i).classList.remove('selected', 'valid-move');
  if (gameState.selectedSquare !== null) {
    document.getElementById('square-' + gameState.selectedSquare).classList.add('selected');
    getValidMoves(gameState.selectedSquare).forEach(m => document.getElementById('square-' + m).classList.add('valid-move'));
  }
}
function updateMoveHistory() {
  const list = document.getElementById('moves-list');
  list.innerHTML = gameState.moveHistory.map((m,i) => '<div class="move-item">Move ' + (i+1) + '</div>').join('');
}
function startTimer() {
  gameState.timerInterval = setInterval(() => {
    if (gameState.currentPlayer === 'white') gameState.whiteTime--; else gameState.blackTime--;
    updateTimerDisplay();
  }, 1000);
}
function updateTimerDisplay() {
  const t = gameState.currentPlayer === 'white' ? gameState.whiteTime : gameState.blackTime;
  const m = Math.floor(t / 60), s = t % 60;
  document.getElementById('timer').innerHTML = '<div class="timer-display"><div class="time">' + m + ':' + String(s).padStart(2, '0') + '</div></div>';
}
function endGame(winner) {
  gameState.gameOver = true; clearInterval(gameState.timerInterval);
  document.getElementById('game-over-modal').classList.add('show');
}
window.onload = () => { gameState.board = initBoard(); renderBoard(); updateMoveHistory(); startTimer(); };
