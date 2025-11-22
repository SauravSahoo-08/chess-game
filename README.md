# ♔ Premium Chess Game - Professional Edition

**Experience the Art of Strategy with Modern Elegance**

A fully-featured, professional chess game built with HTML5, CSS3, and vanilla JavaScript. Play against an intelligent AI opponent with multiple difficulty levels, featuring a god-level UI design and real-time gameplay mechanics.

## 🎮 Live Demo

👉 **[Play Now!](https://sauravsahoo-08.github.io/chess-game/)**

---

## ✨ Features

### Core Gameplay
✅ **Full Chess Rules** - Proper movement rules for all pieces (pawns, rooks, knights, bishops, queens, kings)
✅ **Board Rendering** - Beautiful 8x8 chessboard with alternating light/dark squares
✅ **Piece Selection** - Click pieces to select, visual feedback with highlighting
✅ **Valid Move Validation** - Only allows legal moves based on chess rules
✅ **Piece Capture** - Track captured pieces with automatic score updates
✅ **Move History** - Display last 10 moves with piece icons

### AI Opponent
✅ **3 Difficulty Levels:**
- 🟢 **Beginner** - Random valid moves
- 🟡 **Intermediate** - Prioritizes piece captures when available
- 🔴 **God Mode** - Strategic move selection with capture priority

✅ **Smart AI** - Calculates all valid moves for black pieces
✅ **Auto Response** - AI automatically responds after player moves

### User Interface
✅ **Professional Design** - God-level gradient aesthetics
✅ **Timer System** - 10-minute countdown with MM:SS display
✅ **Score Tracking** - Real-time capture count display
✅ **Responsive Layout** - Works on all screen sizes
✅ **Action Buttons** - HINT and RESIGN options
✅ **Control Buttons** - Difficulty selector and game controls

---

## 🚀 How to Play

1. **Select a Piece** - Click on any white piece to select it (highlighted in green)
2. **Make a Move** - Click an empty square or enemy piece to move
3. **Valid Moves Only** - The game only allows legally valid moves
4. **AI Response** - Black automatically responds with its move
5. **Track Progress** - Watch captured pieces and timer countdown
6. **Change Difficulty** - Switch AI difficulty anytime using the buttons

---

## 📋 Chess Rules Implemented

### Pawn Movement
- Moves 1 square forward (2 squares on first move)
- Captures diagonally forward
- Cannot move backward

### Knight Movement
- L-shaped moves (2+1 squares)
- Can jump over pieces

### Bishop Movement
- Diagonal movement any distance
- Cannot jump over pieces

### Rook Movement
- Horizontal and vertical movement any distance
- Cannot jump over pieces

### Queen Movement
- Combines rook and bishop movement
- Any direction any distance
- Cannot jump over pieces

### King Movement
- One square in any direction
- Can capture adjacent enemy pieces

---

## 🎨 Technical Stack

- **HTML5** - Semantic structure
- **CSS3** - Advanced gradients, animations, responsive design
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **GitHub Pages** - Free instant deployment

---

## 📁 Project Structure

```
chess-game/
├── index.html      # HTML structure
├── style.css       # Professional styling
├── script.js       # Game logic & AI
└── README.md       # This file
```

---

## 💻 Installation & Local Testing

### Method 1: Direct Browser
```bash
1. Clone the repository
git clone https://github.com/SauravSahoo-08/chess-game.git

2. Navigate to folder
cd chess-game

3. Open index.html in your browser
open index.html  (Mac)
start index.html (Windows)
```

### Method 2: Live Server (VS Code)
```bash
1. Install Live Server extension
2. Right-click index.html → Open with Live Server
3. Game opens at http://localhost:5500
```

### Method 3: Online
- Visit: https://sauravsahoo-08.github.io/chess-game/
- No installation required!

---

## 🎯 Game Statistics

- **Board Size**: 8x8 (64 squares)
- **Total Pieces**: 32 (16 white, 16 black)
- **Timer**: 10 minutes per player
- **AI Difficulty Levels**: 3
- **Code Lines**: ~250 lines optimized JavaScript
- **File Size**: ~50KB total

---

## 🔧 Customization

### Change Timer Duration
In `script.js`, modify:
```javascript
whiteTime: 600,  // Change to desired seconds
blackTime: 600
```

### Adjust AI Delay
In `script.js`, modify:
```javascript
setTimeout(makeAIMove, 1200);  // Change delay in milliseconds
```

### Modify Colors
In `style.css`, update CSS variables:
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--dark-bg: #0a0e27;
--accent: #00d4ff;
```

---

## 🐛 Known Limitations

- Castling not yet implemented
- En passant capture not implemented
- Pawn promotion moves to last rank but doesn't promote
- No checkmate detection (game continues)
- No draw by repetition

These features can be added in future versions!

---

## 🤝 Contributing

Want to improve the game? Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

Suggestions for enhancements:
- Implement checkmate/stalemate detection
- Add pawn promotion
- Add castle moves
- Improve AI strategy
- Add sound effects
- Create mobile app version

---

## 📜 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Saurav Sahoo**
- GitHub: [@SauravSahoo-08](https://github.com/SauravSahoo-08)
- Portfolio: Building awesome projects with code

---

## 🌟 Show Your Support

If you enjoyed this chess game:
- ⭐ **Star** this repository
- 🔗 **Share** with friends
- 💬 **Provide feedback** via issues
- 🚀 **Fork** and create your own version

---

## 📝 Version History

### v2.0 - Enhanced (Current)
- ✅ Proper chess piece movement rules
- ✅ Capture detection with score tracking
- ✅ Three AI difficulty levels
- ✅ Move history display
- ✅ Improved AI strategy

### v1.0 - Initial Release
- ✅ Basic board rendering
- ✅ Simple piece movement
- ✅ AI opponent
- ✅ Timer system
- ✅ Professional UI

---

**Enjoy the game! ♟♚♕**
