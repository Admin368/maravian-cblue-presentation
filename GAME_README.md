# 🌍 Guess the Country Game

An exciting educational game for English classes where students identify famous landmarks and learn about countries around the world!

## 🚀 Quick Start

### 1. Start the Servers
```bash
# Start the Next.js development server
npm run dev

# Start the Socket.IO server (in a separate terminal)
node server.js
```

### 2. Access the Game
- Visit `http://localhost:3000` for the main presentation
- Click "🌍 Play Game" button or go directly to `http://localhost:3000/game/home`

## 🎮 Game Modes

### 🎯 Teacher/Presentation Mode
**URL:** `http://localhost:3000/game?teacher=true`

**Features:**
- Full game control panel
- Load questions from landmark database
- Start/stop game functionality
- Display questions with beautiful images
- Approve/reject student answers
- Award 1 point for correct country or 2 points for detailed explanations
- Real-time leaderboard management
- Beautiful full-screen presentation mode

**Controls:**
- **Load Questions** - Randomly selects 15 landmarks from database
- **Start/Stop Game** - Controls game state
- **Next Question** - Displays next landmark image
- **Correct (+1 pt)** - Award 1 point for correct country
- **Excellent (+2 pts)** - Award 2 points for detailed explanation
- **Incorrect** - No points awarded
- **Clear** - Remove current answerer selection

### 👥 Student Mode
**URL:** `http://localhost:3000/game/student`

**Features:**
- Join screen with name input and team selection
- Choose from 5 teams (Team 1-5)
- Big "I Have Answer!" button for participation
- Real-time team member display
- Live leaderboard showing all teams
- Answer status indicators

**How Students Play:**
1. Enter their name
2. Choose a team (Team 1-5)
3. Wait for game to start
4. Press "I Have Answer!" to request answering
5. First student to press gets selected
6. Give answer verbally to teacher

## 🏆 Game Flow

### Setup Phase
1. **Teacher** goes to teacher mode and loads questions
2. **Students** join via student mode and select teams
3. **Teacher** starts the game

### Gameplay Phase
1. **Teacher** clicks "Next Question" to display landmark image
2. **Students** see the image and compete to answer first
3. **First student** to press "I Have Answer!" gets selected
4. **Selected student** gives their answer verbally
5. **Teacher** approves/rejects and awards points:
   - **1 point** for correct country identification
   - **2 points** for detailed explanation about the landmark/country
6. Repeat for all questions

### Results Phase
- Automatic winner announcement when all questions completed
- Final leaderboard with team rankings
- Beautiful celebration screen

## 📊 Scoring System

- **1 Point:** Correct country identification
- **2 Points:** Detailed explanation about the landmark or country
- **0 Points:** Incorrect answer

## 🗺️ Landmark Database

The game uses your existing landmark database with famous locations including:
- Eiffel Tower (France)
- Great Wall of China (China)
- Machu Picchu (Peru)
- Statue of Liberty (United States)
- Taj Mahal (India)
- And many more!

## 🔧 Technical Features

### Real-time Communication
- Socket.IO integration with existing server (`localhost:8051`)
- Instant synchronization across all devices
- Automatic cleanup when students disconnect

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Beautiful animations and transitions
- Optimized for classroom projectors

### Team Management
- 5 teams with automatic member tracking
- Real-time score updates
- Live leaderboard with member counts

## 🎨 Visual Features

- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Elements** - Hover effects and button states
- **Progress Indicators** - Question progress bars
- **Status Indicators** - Clear game state communication

## 🔗 Navigation

- **Game Home** (`/game/home`) - Landing page with mode selection
- **Teacher Mode** (`/game?teacher=true`) - Presentation control
- **Student Mode** (`/game/student`) - Student participation
- **Main Presentation** (`/`) - Original presentation with game link

## 🚨 Troubleshooting

### Common Issues

1. **Students can't connect**
   - Ensure Socket.IO server is running (`node server.js`)
   - Check if port 8051 is available

2. **Images not loading**
   - Verify internet connection for landmark images
   - Images are hosted on external CDN

3. **Game state not syncing**
   - Refresh browser tabs
   - Restart Socket.IO server

### Reset Game
To reset the game completely:
1. Stop the game from teacher mode
2. Restart Socket.IO server
3. Students can rejoin teams

## 🎓 Educational Benefits

- **Geography Learning** - Identify countries and landmarks
- **English Practice** - Verbal explanations and descriptions
- **Team Collaboration** - Working together in teams
- **Quick Thinking** - Fast-paced competition
- **Cultural Awareness** - Learning about world landmarks

## 🛠️ Development

### File Structure
```
app/
├── game/
│   ├── page.tsx          # Teacher/Presentation mode
│   ├── student/page.tsx   # Student participation mode
│   ├── home/page.tsx      # Game landing page
│   └── layout.tsx         # Game layout
├── data/
│   └── landmarks_data.js  # Landmark database
└── server.js              # Socket.IO server with game logic
```

### Key Technologies
- **Next.js 15** - React framework
- **Socket.IO** - Real-time communication
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

---

🎉 **Ready to play!** Your interactive geography game is now ready for the classroom!
