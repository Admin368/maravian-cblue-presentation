const { createServer } = require("http");
const { Server } = require("socket.io");

// Create HTTP server
const httpServer = createServer();

// Define allowed origins for better security
const allowedOrigins = [
  "http://localhost:3000",
  "https://maravian.com",
  "https://www.maravian.com",
  "https://main.maravian.com",
  "https://cblue.maravian.com",
  "https://beta-cblue.maravian.com",
  "https://e49d-137-184-179-217.ngrok-free.app",
];

// Create Socket.IO server with CORS properly configured
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        console.log(`Origin ${origin} not allowed by CORS`);
        return callback(null, false);
      }

      return callback(null, true);
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
    // credentials: false,
  },
  // Enable sticky session support
  transports: ["websocket", "polling"],
});

// Track connected clients
const clients = new Set();

// Track global presentation state
const presentationState = {
  currentSlide: 0,
  isActive: false, // Whether the presentation is active for all users
  scrollMode: "none", // Default scroll mode: none, everyscroll, div-select
  targetElement: null, // Current element to scroll to
  focusedImages: {}, // Track focused images by country ID
  qaEnabled: false, // Whether Q&A is enabled
  qaMessages: [], // Array to store Q&A messages
};

// Guess the Country game state
const gameState = {
  isActive: false,
  currentQuestion: 0,
  currentLandmark: null,
  questions: [],
  teams: {
    "Team 1": { score: 0, members: [] },
    "Team 2": { score: 0, members: [] },
    "Team 3": { score: 0, members: [] },
    "Team 4": { score: 0, members: [] },
    "Team 5": { score: 0, members: [] },
  },
  students: new Map(), // studentId -> { name, team, socketId, isAnswering }
  currentAnswerer: null,
  questionStartTime: null,
  showAnswer: false,
};

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  clients.add(socket.id);

  // Send current connection count to all clients
  io.emit("clientCount", clients.size); // Send current presentation state to the new client
  socket.emit("presentationState", {
    ...presentationState,
    qaMessages: presentationState.qaMessages, // Include QA messages
  });

  // Send current image focus state for each country
  if (Object.keys(presentationState.focusedImages).length > 0) {
    Object.entries(presentationState.focusedImages).forEach(
      ([countryId, imageIndex]) => {
        socket.emit("imageFocusChange", { countryId, imageIndex });
      }
    );
  }

  // Handle slide control events
  socket.on("controlSlide", (slideIndex) => {
    console.log(`Changing slide to: ${slideIndex}`);
    // Update global state
    presentationState.currentSlide = slideIndex;
    // Broadcast to all other clients
    io.emit("changeSlide", slideIndex);
  });
  // Handle presentation mode toggle
  socket.on("togglePresentation", (isActive) => {
    console.log(`Presentation active state changed to: ${isActive}`);
    presentationState.isActive = isActive;
    io.emit("presentationActiveChange", isActive);
  });

  // Handle scroll mode changes
  socket.on("setScrollMode", (mode) => {
    console.log(`Scroll mode changed to: ${mode}`);
    presentationState.scrollMode = mode;
    io.emit("scrollModeChange", mode);
  });
  // Handle scroll to element events
  socket.on("scrollToElement", (elementId) => {
    console.log(`Scrolling to element: ${elementId}`);
    presentationState.targetElement = elementId;
    io.emit("scrollToElement", elementId);
  });
  // Handle scroll position updates from admin
  socket.on("scrollPosition", (data) => {
    console.log(`Scroll position update: ${data.percentage.toFixed(2)}%`);
    io.emit("scrollToPosition", data);
  });

  // Handle image focus change events
  socket.on("imageFocusChange", (data) => {
    console.log(
      `Image focus change: Country ${data.countryId}, Image index ${data.imageIndex}`
    );
    // Update the presentation state
    presentationState.focusedImages[data.countryId] = data.imageIndex;
    // Broadcast to all clients
    io.emit("imageFocusChange", data);
  });
  // Handle custom messages
  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}:`, data);
    // Broadcast to all clients
    io.emit("message", {
      id: socket.id,
      timestamp: new Date().toISOString(),
      ...data,
    });
  });

  // Handle Q&A messages
  socket.on("qa-message", (data) => {
    console.log(`Q&A message from ${socket.id}:`, data);

    // Create Q&A message with ID and timestamp
    const qaMessage = {
      id: Math.random().toString(36).substring(2, 15),
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      question: data.question,
      userName: data.userName || "Anonymous",
    };

    // Add to the messages array
    presentationState.qaMessages.push(qaMessage);

    // Broadcast to all clients
    io.emit("qa-message-received", qaMessage);
  });

  // Handle Q&A toggle
  socket.on("toggle-qa", (enabled) => {
    console.log(`Q&A feature toggled to: ${enabled}`);
    presentationState.qaEnabled = enabled;
    io.emit("qa-status-change", enabled);
  });

  // Guess the Country Game Events
  
  // Student joins the game
  socket.on("game-join", (data) => {
    console.log(`Student joining game:`, data);
    const studentId = data.studentId || socket.id;
    gameState.students.set(studentId, {
      name: data.name,
      team: data.team,
      socketId: socket.id,
      isAnswering: false
    });
    
    // Add to team members
    if (gameState.teams[data.team]) {
      gameState.teams[data.team].members.push({
        id: studentId,
        name: data.name
      });
    }
    
    // Send game state to new student
    socket.emit("game-state", gameState);
    
    // Broadcast updated teams to all clients
    io.emit("teams-updated", gameState.teams);
  });
  
  // Student wants to answer
  socket.on("game-answer-request", (data) => {
    console.log(`Answer request from ${socket.id}`);
    const student = Array.from(gameState.students.values()).find(s => s.socketId === socket.id);
    if (student && !gameState.currentAnswerer) {
      gameState.currentAnswerer = {
        studentId: data.studentId || socket.id,
        name: student.name,
        team: student.team,
        socketId: socket.id
      };
      
      // Notify all clients about the answerer
      io.emit("student-answering", gameState.currentAnswerer);
    }
  });
  
  // Teacher starts/stops game
  socket.on("game-toggle", (isActive) => {
    console.log(`Game toggled to: ${isActive}`);
    gameState.isActive = isActive;
    if (!isActive) {
      // Reset game state
      gameState.currentAnswerer = null;
      gameState.showAnswer = false;
      gameState.currentQuestion = 0;
    }
    io.emit("game-status-change", isActive);
  });
  
  // Teacher loads questions
  socket.on("game-load-questions", (questions) => {
    console.log(`Loading ${questions.length} questions`);
    console.log('First few questions:', questions.slice(0, 3).map(q => ({ name: q.name, country: q.country })));
    gameState.questions = questions;
    gameState.currentQuestion = 0;
    io.emit("questions-loaded", questions.length);
  });
  
  // Teacher shows next question
  socket.on("game-next-question", () => {
    if (gameState.currentQuestion < gameState.questions.length) {
      gameState.currentLandmark = gameState.questions[gameState.currentQuestion];
      gameState.currentAnswerer = null;
      gameState.showAnswer = false;
      gameState.questionStartTime = Date.now();
      
      io.emit("question-display", {
        landmark: gameState.currentLandmark,
        questionNumber: gameState.currentQuestion + 1,
        totalQuestions: gameState.questions.length
      });
    }
  });
  
  // Teacher approves/rejects answer
  socket.on("game-answer-result", (data) => {
    console.log(`Answer result:`, data);
    if (gameState.currentAnswerer) {
      const team = gameState.currentAnswerer.team;
      if (data.isCorrect) {
        gameState.teams[team].score += data.points || 1;
      }
      
      // Show answer and update scores
      gameState.showAnswer = true;
      io.emit("answer-result", {
        isCorrect: data.isCorrect,
        points: data.points || 1,
        correctAnswer: gameState.currentLandmark?.country,
        answerer: gameState.currentAnswerer,
        teams: gameState.teams
      });
      
      // Move to next question
      gameState.currentQuestion++;
      gameState.currentAnswerer = null;
      
      // Check if game is finished
      if (gameState.currentQuestion >= gameState.questions.length) {
        const sortedTeams = Object.entries(gameState.teams)
          .sort(([,a], [,b]) => b.score - a.score)
          .map(([name, data]) => ({ name, ...data }));
        
        io.emit("game-finished", {
          results: sortedTeams,
          winner: sortedTeams[0]
        });
      }
    }
  });
  
  // Teacher clears answerer
  socket.on("game-clear-answerer", () => {
    gameState.currentAnswerer = null;
    io.emit("answerer-cleared");
  });
  
  // Send game state to joining clients
  socket.emit("game-state", gameState);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    clients.delete(socket.id);
    
    // Clean up game state
    const disconnectedStudent = Array.from(gameState.students.entries())
      .find(([, student]) => student.socketId === socket.id);
    
    if (disconnectedStudent) {
      const [studentId, student] = disconnectedStudent;
      console.log(`Student ${student.name} (${student.team}) disconnected`);
      
      // Remove from students map
      gameState.students.delete(studentId);
      
      // Remove from team members
      if (gameState.teams[student.team]) {
        gameState.teams[student.team].members = 
          gameState.teams[student.team].members.filter(member => member.id !== studentId);
      }
      
      // Clear answerer if it was this student
      if (gameState.currentAnswerer?.studentId === studentId) {
        gameState.currentAnswerer = null;
        io.emit("answerer-cleared");
      }
      
      // Broadcast updated teams
      io.emit("teams-updated", gameState.teams);
    }
    
    io.emit("clientCount", clients.size);
  });
});

// Start server
const PORT = process.env.PORT || 8051;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`- Connection URL for clients: ws://localhost:${PORT}`);
  console.log("- Press Ctrl+C to stop the server");
});
