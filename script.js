// Game State
let gameState = { board: [], currentPlayer: 'white', selectedSquare: null, moveHistory: [], isAIMode: true, aiDifficulty: 'beginner', gameOver: false, whiteTime: 600, blackTime: 600, timerInterval: null };

const pieces = { 'white-pawn': '\u2659', 'white-rook': '\u2656', 'white-knight': '\u2658', 'white-bishop': '\u2657', 'white-queen': '\u2655', 'white-king': '\u2654', 'black-pawn': '\u265f', 'black-rook': '\u265c', 'black-knight': '\u265e', 'black-bishop': '\u265d', 'black-queen': '\u265b', 'black-king': '\u265a' };

function initBoard() { const board = Array(64).fill(null); board[0]='black-rook'; board[1]='black-knight'; board[2]='black-bishop'; board[3]='black-queen'; board[4]='black-king'; board[5]='black-bishop'; board[6]='black-knight'; board[7]='black-rook'; for(let i=8;i<16;i++) board[i]='black-pawn'; for(let i=48;i<56;i++) board[i]='white-pawn'; board[56]='white-rook'; board[57]='white-knight'; board[58]='white-bishop'; board[59]='white-queen'; board[60]='white-king'; board[61]='white-bishop'; board[62]='white-knight'; board[63]='white-rook'; return board; }

function renderBoard() { const board = document.getElementById('chessboard'); if (!board) return; board.innerHTML=''; for(let i=0; i<64; i++) { const sq = document.createElement('div'); const row = Math.floor(i/8), col = i%8; sq.className = 'square ' + ((row+col)%2===0 ? 'white' : 'black'); sq.id = 'sq-'+i; sq.textContent = gameState.board[i] ? pieces[gameState.board[i]] : ''; sq.onclick = ()=>handleSquareClick(i); board.appendChild(sq); } }

function handleSquareClick(idx) { if(gameState.gameOver) return; if(gameState.isAIMode && gameState.currentPlayer==='black') return; if(!gameState.selectedSquare) { if(gameState.board[idx]?.split('-')[0]===gameState.currentPlayer) { gameState.selectedSquare=idx; highlightMoves(); } } else { if(idx===gameState.selectedSquare) { gameState.selectedSquare=null; highlightMoves(); } else { makeMoveIfValid(gameState.selectedSquare, idx); gameState.selectedSquare=null; highlightMoves(); } } }

function makeMoveIfValid(from, to) { if(!gameState.board[from]) return; gameState.board[to]=gameState.board[from]; gameState.board[from]=null; gameState.moveHistory.push({from,to}); gameState.currentPlayer = gameState.currentPlayer==='white' ? 'black' : 'white'; renderBoard(); updateUI(); if(gameState.isAIMode && gameState.currentPlayer==='black') { setTimeout(makeAIMove, 800); } }

function makeAIMove() { const moves=[]; for(let i=0;i<64;i++) { if(gameState.board[i]?.split('-')[0]==='black') { const to = getRandomValidMove(i); if(to!==null) moves.push({from:i, to}); } } if(moves.length===0) { gameState.gameOver=true; alert('Checkmate! White Wins!'); return; } const move = moves[Math.floor(Math.random()*moves.length)]; makeMoveIfValid(move.from, move.to); }

function getRandomValidMove(idx) { const r=Math.floor(idx/8), c=idx%8; const targets=[(r+1)*8+c, (r-1)*8+c, r*8+(c+1), r*8+(c-1), (r+1)*8+(c+1), (r-1)*8+(c-1), (r+1)*8+(c-1), (r-1)*8+(c+1)]; for(let t of targets) { if(t>=0 && t<64 && !gameState.board[t]) return t; if(t>=0 && t<64 && gameState.board[t]?.split('-')[0]==='white') return t; } return null; }

function highlightMoves() { for(let i=0;i<64;i++) document.getElementById('sq-'+i)?.classList.remove('selected'); if(gameState.selectedSquare!==null) document.getElementById('sq-'+gameState.selectedSquare)?.classList.add('selected'); }

function updateUI() { const historyDiv = document.getElementById('moves-list'); historyDiv.innerHTML = gameState.moveHistory.map((m,i)=>('<div class="move-item">Move '+(i+1)+': '+(gameState.board[m.to]||'✓')+'</div>')).join(''); }

function setDifficulty(diff) { gameState.aiDifficulty=diff; document.querySelectorAll('.difficulty-btn').forEach(b=>b.classList.remove('active')); event.target.classList.add('active'); }

function startTimer() { gameState.timerInterval = setInterval(()=>{ if(gameState.currentPlayer==='white') gameState.whiteTime--; else gameState.blackTime--; const t = gameState.currentPlayer==='white' ? gameState.whiteTime : gameState.blackTime; const m=Math.floor(t/60), s=t%60; const timerEl = document.getElementById('timer'); if(timerEl) timerEl.innerHTML = '<div class="time">'+ m + ':' + String(s).padStart(2,'0') + '</div>'; if(t<=0) { gameState.gameOver=true; alert('Time over!'); } }, 1000); }

document.querySelectorAll('.difficulty-btn').forEach(btn => btn.addEventListener('click', (e)=>setDifficulty(e.target.textContent))); document.getElementById('play-again-btn')?.addEventListener('click', ()=>location.reload());

window.addEventListener('load', ()=>{ gameState.board = initBoard(); renderBoard(); startTimer(); });
