// Premium Chess Game - Enhanced Implementation with Proper Rules

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
  timerInterval: null,
  whiteCaptured: 0,
  blackCaptured: 0
};

const PIECE_UNICODE = {
  'white-pawn': '♙', 'white-rook': '♖', 'white-knight': '♘',
  'white-bishop': '♗', 'white-queen': '♕', 'white-king': '♔',
  'black-pawn': '♟', 'black-rook': '♜', 'black-knight': '♞',
  'black-bishop': '♝', 'black-queen': '♛', 'black-king': '♚'
};

function initializeBoard() {
  gameState.board = new Array(64).fill(null);
  const pieces = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
  for(let i = 0; i < 8; i++) {
    gameState.board[i] = 'black-' + pieces[i];
    gameState.board[8+i] = 'black-pawn';
    gameState.board[48+i] = 'white-pawn';
  }
  for(let i = 0; i < 8; i++) gameState.board[56+i] = 'white-' + pieces[i];
}

function renderChessboard() {
  const boardEl = document.getElementById('chessboard');
  if (!boardEl) return;
  boardEl.innerHTML = '';
  for(let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    const row = Math.floor(i / 8), col = i % 8;
    square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
    square.id = 'sq-' + i;
    if(gameState.board[i]) square.textContent = PIECE_UNICODE[gameState.board[i]];
    square.addEventListener('click', () => handleSquareClick(i));
    boardEl.appendChild(square);
  }
}

function getValidMoves(index) {
  if(!gameState.board[index]) return [];
  const piece = gameState.board[index];
  const [color, type] = piece.split('-');
  const row = Math.floor(index / 8), col = index % 8;
  const moves = [];
  const addIfValid = (r, c) => {
    if(r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = r * 8 + c;
      const targetPiece = gameState.board[target];
      if(!targetPiece || targetPiece.split('-')[0] !== color) moves.push(target);
    }
  };
  if(type === 'pawn') {
    const dir = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    const forwardOne = (row + dir) * 8 + col;
    if(row + dir >= 0 && row + dir < 8 && !gameState.board[forwardOne]) {
      moves.push(forwardOne);
      if(row === startRow) {
        const forwardTwo = (row + 2*dir) * 8 + col;
        if(!gameState.board[forwardTwo]) moves.push(forwardTwo);
      }
    }
    for(let dc of [-1,1]) addIfValid(row+dir, col+dc);
  } else if(type === 'knight') {
    for(let [dr,dc] of [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]) addIfValid(row+dr, col+dc);
  } else if(type === 'bishop' || type === 'queen' || type === 'rook') {
    const dirs = type === 'rook' ? [[0,1],[0,-1],[1,0],[-1,0]] : type === 'bishop' ? [[1,1],[1,-1],[-1,1],[-1,-1]] : [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
    for(let [dr,dc] of dirs) {
      for(let i = 1; i < 8; i++) {
        const nr = row + i*dr, nc = col + i*dc;
        if(nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
        const target = nr * 8 + nc;
        const targetPiece = gameState.board[target];
        if(targetPiece) {
          if(targetPiece.split('-')[0] !== color) moves.push(target);
          break;
        }
        moves.push(target);
      }
    }
  } else if(type === 'king') {
    for(let dr = -1; dr <= 1; dr++) for(let dc = -1; dc <= 1; dc++) if(dr !== 0 || dc !== 0) addIfValid(row+dr, col+dc);
  }
  return moves;
}

function handleSquareClick(index) {
  if(gameState.gameOver) return;
  if(gameState.isAIMode && gameState.currentPlayer === 'black') return;
  if(gameState.selectedSquare === null) {
    const piece = gameState.board[index];
    if(piece && piece.split('-')[0] === gameState.currentPlayer) {
      gameState.selectedSquare = index;
      updateHighlights();
    }
  } else {
    if(index === gameState.selectedSquare) {
      gameState.selectedSquare = null;
      updateHighlights();
    } else {
      const validMoves = getValidMoves(gameState.selectedSquare);
      if(validMoves.includes(index)) {
        makeMove(gameState.selectedSquare, index);
      }
      gameState.selectedSquare = null;
      updateHighlights();
    }
  }
}

function makeMove(from, to) {
  const captured = gameState.board[to];
  if(captured) {
    const capturedColor = captured.split('-')[0];
    if(capturedColor === 'white') gameState.blackCaptured++;
    else gameState.whiteCaptured++;
  }
  gameState.board[to] = gameState.board[from];
  gameState.board[from] = null;
  gameState.moveHistory.push({from, to, piece: gameState.board[to]});
  gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  renderChessboard();
  updateUI();
  if(gameState.isAIMode && gameState.currentPlayer === 'black') {
    setTimeout(makeAIMove, 1200);
  }
}

function makeAIMove() {
  const blackPieces = [];
  for(let i = 0; i < 64; i++) {
    if(gameState.board[i] && gameState.board[i].split('-')[0] === 'black') {
      const moves = getValidMoves(i);
      if(moves.length > 0) blackPieces.push({piece: i, moves});
    }
  }
  if(blackPieces.length === 0) {
    gameState.gameOver = true;
    alert('Checkmate! White Wins!');
    return;
  }
  let bestMove = null;
  if(gameState.aiDifficulty === 'beginner') {
    const piece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
    bestMove = {from: piece.piece, to: piece.moves[Math.floor(Math.random() * piece.moves.length)]};
  } else if(gameState.aiDifficulty === 'intermediate') {
    let captureMoves = [];
    for(let p of blackPieces) {
      for(let m of p.moves) if(gameState.board[m] && gameState.board[m].split('-')[0] === 'white') captureMoves.push({from: p.piece, to: m});
    }
    if(captureMoves.length > 0) bestMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    else {
      const piece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
      bestMove = {from: piece.piece, to: piece.moves[Math.floor(Math.random() * piece.moves.length)]};
    }
  } else {
    let captureMoves = [], strategicMoves = [];
    for(let p of blackPieces) {
      for(let m of p.moves) {
        if(gameState.board[m] && gameState.board[m].split('-')[0] === 'white') captureMoves.push({from: p.piece, to: m, value: m});
        else strategicMoves.push({from: p.piece, to: m});
      }
    }
    if(captureMoves.length > 0) bestMove = captureMoves.sort((a,b) => b.value - a.value)[0];
    else bestMove = strategicMoves[Math.floor(Math.random() * strategicMoves.length)];
  }
  if(bestMove) makeMove(bestMove.from, bestMove.to);
}

function updateHighlights() {
  for(let i = 0; i < 64; i++) {
    const sq = document.getElementById('sq-' + i);
    if(sq) sq.classList.remove('selected', 'valid-move');
  }
  if(gameState.selectedSquare !== null) {
    const sq = document.getElementById('sq-' + gameState.selectedSquare);
    if(sq) sq.classList.add('selected');
  }
}

function updateUI() {
  const historyEl = document.getElementById('moves-list');
  if(historyEl) {
    historyEl.innerHTML = gameState.moveHistory.slice(-10).map((m, i) => {
      const piece = PIECE_UNICODE[m.piece] || '';
      return '<div class="move-item">Move ' + (gameState.moveHistory.length - 9 + i) + ': ' + piece + '</div>';
    }).join('');
  }
  const whiteScoreEl = document.querySelectorAll('.score-display .value')[0];
  const blackScoreEl = document.querySelectorAll('.score-display .value')[1];
  if(whiteScoreEl) whiteScoreEl.textContent = gameState.whiteCaptured;
  if(blackScoreEl) blackScoreEl.textContent = gameState.blackCaptured;
}

function setDifficulty(level) {
  if(level.includes('Beginner')) gameState.aiDifficulty = 'beginner';
  else if(level.includes('Intermediate')) gameState.aiDifficulty = 'intermediate';
  else gameState.aiDifficulty = 'god';
  document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

function startTimer() {
  gameState.timerInterval = setInterval(() => {
    if(gameState.currentPlayer === 'white') gameState.whiteTime--;
    else gameState.blackTime--;
    const time = gameState.currentPlayer === 'white' ? gameState.whiteTime : gameState.blackTime;
    const m = Math.floor(time / 60), s = time % 60;
    const timerEl = document.getElementById('timer');
    if(timerEl) timerEl.innerHTML = '<div class="time">' + m + ':' + (s < 10 ? '0' : '') + s + '</div>';
    if(time <= 0) {
      gameState.gameOver = true;
      clearInterval(gameState.timerInterval);
      alert('Time Over!');
    }
  }, 1000);
}

document.querySelectorAll('.difficulty-btn').forEach(btn => btn.addEventListener('click', (e) => setDifficulty(e.target.textContent)));
document.getElementById('play-again-btn')?.addEventListener('click', () => location.reload());

window.addEventListener('DOMContentLoaded', () => { initializeBoard(); renderChessboard(); startTimer(); });
if(document.readyState !== 'loading') { initializeBoard(); renderChessboard(); startTimer(); }
