const { createServer } = require("http");
const { Server } = require("socket.io");

// Create HTTP server
const httpServer = createServer();

// Define allowed origins for better security
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.102:3000",
  "http://192.168.1.168:3000",
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
  currentQuestion: -1, // Start at -1 so first question becomes 0
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
  oneStudentPerQuestion: false, // New feature: only one student can answer per question
  studentsWhoAnswered: new Set(), // Track students who have answered
};

// Malawi presentation state
const malawiPresentationState = {
  currentSlide: 0,
  isActive: false,
  scrollMode: "none",
  targetElement: null,
  focusedImages: {},
  qaEnabled: false,
  qaMessages: [],
  gameModeActive: false, // Track if questions/game mode is active
  gameState: {
    isActive: false,
    teams: {
      "Team 1": { score: 0, members: [] },
      "Team 2": { score: 0, members: [] },
      "Team 3": { score: 0, members: [] },
      "Team 4": { score: 0, members: [] },
      "Team 5": { score: 0, members: [] },
    },
    students: new Map(),
    currentQuestion: null,
    currentAnswerer: null,
    showAnswer: false,
    oneStudentPerQuestion: false, // New feature: only one student can answer per question
    studentsWhoAnswered: new Set(), // Track students who have answered this question
  },
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
      isAnswering: false,
    });

    // Add to team members
    if (gameState.teams[data.team]) {
      gameState.teams[data.team].members.push({
        id: studentId,
        name: data.name,
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
    const studentId = data.studentId || socket.id;
    const student = Array.from(gameState.students.values()).find(
      (s) => s.socketId === socket.id
    );

    // Check if student can answer
    const canAnswer =
      student &&
      !gameState.currentAnswerer &&
      (!gameState.oneStudentPerQuestion ||
        !gameState.studentsWhoAnswered.has(studentId));

    if (canAnswer) {
      gameState.currentAnswerer = {
        studentId: studentId,
        name: student.name,
        team: student.team,
        socketId: socket.id,
      };

      // If one-student-per-question mode, mark this student as having answered
      if (gameState.oneStudentPerQuestion) {
        gameState.studentsWhoAnswered.add(studentId);
        console.log(
          `Student ${student.name} marked as answered (one-per-question mode)`
        );
      }

      // Notify all clients about the answerer
      io.emit("student-answering", gameState.currentAnswerer);
    } else if (
      gameState.oneStudentPerQuestion &&
      gameState.studentsWhoAnswered.has(studentId)
    ) {
      // Notify the student they've already answered
      socket.emit("already-answered", {
        message: "You have already answered a question in this game session.",
      });
      console.log(
        `Student ${student?.name} tried to answer but already answered in one-per-question mode`
      );
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
    console.log(
      "First few questions:",
      questions.slice(0, 3).map((q) => ({ name: q.name, country: q.country }))
    );
    gameState.questions = questions;
    gameState.currentQuestion = -1; // Reset to -1 so next question becomes 0
    gameState.studentsWhoAnswered.clear(); // Clear answered students
    io.emit("questions-loaded", questions.length);
    // Send questions list to teacher
    io.emit(
      "questions-list",
      questions.map((q, index) => ({
        index,
        name: q.name,
        country: q.country,
      }))
    );
  });

  // Teacher shows next question
  socket.on("game-next-question", () => {
    gameState.currentQuestion++;
    if (gameState.currentQuestion < gameState.questions.length) {
      gameState.currentLandmark =
        gameState.questions[gameState.currentQuestion];
      gameState.currentAnswerer = null;
      gameState.showAnswer = false;
      gameState.questionStartTime = Date.now();

      console.log(
        `Displaying question ${gameState.currentQuestion + 1}: ${
          gameState.currentLandmark.name
        }`
      );

      io.emit("question-display", {
        landmark: gameState.currentLandmark,
        questionNumber: gameState.currentQuestion + 1,
        totalQuestions: gameState.questions.length,
      });

      // Send updated game state
      io.emit("game-state", gameState);
    } else {
      console.log("No more questions available");
    }
  });

  // Teacher shows previous question
  socket.on("game-previous-question", () => {
    if (gameState.currentQuestion > 0) {
      gameState.currentQuestion--;
      gameState.currentLandmark =
        gameState.questions[gameState.currentQuestion];
      gameState.currentAnswerer = null;
      gameState.showAnswer = false;
      gameState.questionStartTime = Date.now();

      console.log(
        `Going back to question ${gameState.currentQuestion + 1}: ${
          gameState.currentLandmark.name
        }`
      );

      io.emit("question-display", {
        landmark: gameState.currentLandmark,
        questionNumber: gameState.currentQuestion + 1,
        totalQuestions: gameState.questions.length,
      });

      // Send updated game state
      io.emit("game-state", gameState);
    } else {
      console.log("Already at first question");
    }
  });

  // Teacher jumps to specific question
  socket.on("jump-to-question", (questionIndex) => {
    console.log(`Jump to question request: ${questionIndex}`);
    if (questionIndex >= 0 && questionIndex < gameState.questions.length) {
      gameState.currentQuestion = questionIndex;
      gameState.currentLandmark =
        gameState.questions[gameState.currentQuestion];
      gameState.currentAnswerer = null;
      gameState.showAnswer = false;
      gameState.questionStartTime = Date.now();

      console.log(
        `Jumping to question ${questionIndex + 1}: ${
          gameState.currentLandmark.name
        }`
      );

      io.emit("question-display", {
        landmark: gameState.currentLandmark,
        questionNumber: gameState.currentQuestion + 1,
        totalQuestions: gameState.questions.length,
      });

      // Also send updated game state
      io.emit("game-state", gameState);
    } else {
      console.log(`Invalid question index: ${questionIndex}`);
    }
  });

  // Teacher requests questions list
  socket.on("get-questions-list", () => {
    console.log("Questions list requested");
    if (gameState.questions.length > 0) {
      socket.emit("questions-list", gameState.questions);
    }
  });

  // Teacher toggles one-student-per-question mode
  socket.on("toggle-one-student-mode", () => {
    gameState.oneStudentPerQuestion = !gameState.oneStudentPerQuestion;
    console.log(
      `One student per question mode toggled to: ${gameState.oneStudentPerQuestion}`
    );

    if (gameState.oneStudentPerQuestion) {
      gameState.studentsWhoAnswered.clear(); // Reset when enabling
      console.log("Cleared students who answered list");
    }

    io.emit("one-student-mode-toggled", gameState.oneStudentPerQuestion);
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
        teams: gameState.teams,
      });

      // Move to next question
      gameState.currentQuestion++;
      gameState.currentAnswerer = null;

      // Check if game is finished
      if (gameState.currentQuestion >= gameState.questions.length) {
        const sortedTeams = Object.entries(gameState.teams)
          .sort(([, a], [, b]) => b.score - a.score)
          .map(([name, data]) => ({ name, ...data }));

        io.emit("game-finished", {
          results: sortedTeams,
          winner: sortedTeams[0],
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

  // Malawi Presentation Events

  // Handle Malawi slide control events
  socket.on("malawi-controlSlide", (slideIndex) => {
    console.log(`Malawi: Changing slide to: ${slideIndex}`);
    malawiPresentationState.currentSlide = slideIndex;
    io.emit("malawi-changeSlide", slideIndex);
  });

  // Handle Malawi presentation mode toggle
  socket.on("malawi-togglePresentation", (isActive) => {
    console.log(`Malawi: Presentation active state changed to: ${isActive}`);
    malawiPresentationState.isActive = isActive;
    io.emit("malawi-presentationActiveChange", isActive);
  });

  // Handle Malawi scroll mode changes
  socket.on("malawi-setScrollMode", (mode) => {
    console.log(`Malawi: Scroll mode changed to: ${mode}`);
    malawiPresentationState.scrollMode = mode;
    io.emit("malawi-scrollModeChange", mode);
  });

  // Handle Malawi scroll to element events
  socket.on("malawi-scrollToElement", (elementId) => {
    console.log(`Malawi: Scrolling to element: ${elementId}`);
    malawiPresentationState.targetElement = elementId;
    io.emit("malawi-scrollToElement", elementId);
  });

  // Handle Malawi scroll position updates from admin
  socket.on("malawi-scrollPosition", (data) => {
    console.log(
      `Malawi: Scroll position update: ${data.percentage.toFixed(2)}%`
    );
    io.emit("malawi-scrollToPosition", data);
  });

  // Handle Malawi image focus change events
  socket.on("malawi-imageFocusChange", (data) => {
    console.log(
      `Malawi: Image focus change: Slide ${data.slideId}, Image index ${data.imageIndex}`
    );
    malawiPresentationState.focusedImages[data.slideId] = data.imageIndex;
    io.emit("malawi-imageFocusChange", data);
  });

  // Handle Malawi Q&A messages
  socket.on("malawi-qa-message", (data) => {
    console.log(`Malawi Q&A message from ${socket.id}:`, data);

    const qaMessage = {
      id: Math.random().toString(36).substring(2, 15),
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      question: data.question,
      userName: data.userName || "Anonymous",
    };

    malawiPresentationState.qaMessages.push(qaMessage);
    io.emit("malawi-qa-message-received", qaMessage);
  });

  // Handle Malawi Q&A toggle
  socket.on("malawi-toggle-qa", (enabled) => {
    console.log(`Malawi: Q&A feature toggled to: ${enabled}`);
    malawiPresentationState.qaEnabled = enabled;
    io.emit("malawi-qa-status-change", enabled);
  });

  // Malawi Game Events

  // Student joins the Malawi game
  socket.on("malawi-game-join", (data) => {
    console.log(`Malawi: Student joining game:`, data);
    const studentId = data.studentId || socket.id;
    malawiPresentationState.gameState.students.set(studentId, {
      name: data.name,
      team: data.team,
      socketId: socket.id,
      isAnswering: false,
    });

    // Add to team members
    if (malawiPresentationState.gameState.teams[data.team]) {
      malawiPresentationState.gameState.teams[data.team].members.push({
        id: studentId,
        name: data.name,
      });
    }

    // Send game state to new student
    socket.emit("malawi-game-state", malawiPresentationState.gameState);

    // Broadcast updated teams to all clients
    io.emit("malawi-teams-updated", malawiPresentationState.gameState.teams);
  });

  // Student wants to answer Malawi question
  socket.on("malawi-game-answer-request", (data) => {
    console.log(`Malawi: Answer request from ${socket.id}`);
    const studentId = data.studentId || socket.id;
    const student = Array.from(
      malawiPresentationState.gameState.students.values()
    ).find((s) => s.socketId === socket.id);

    if (student && !malawiPresentationState.gameState.currentAnswerer) {
      // Check if one student per question mode is enabled and student has already answered
      if (
        malawiPresentationState.gameState.oneStudentPerQuestion &&
        malawiPresentationState.gameState.studentsWhoAnswered.has(studentId)
      ) {
        // Send message to student that they can't answer again
        socket.emit("malawi-answer-rejected", {
          reason: "already_answered",
          message:
            "You have already answered this question. Please wait for other students to participate.",
        });
        return;
      }

      malawiPresentationState.gameState.currentAnswerer = {
        studentId: studentId,
        name: student.name,
        team: student.team,
        socketId: socket.id,
      };

      // Notify all clients about the answerer
      io.emit(
        "malawi-student-answering",
        malawiPresentationState.gameState.currentAnswerer
      );
    }
  });

  // Teacher starts/stops Malawi game
  socket.on("malawi-toggle-game", (isActive) => {
    console.log(`Malawi: Game toggled to: ${isActive}`);
    malawiPresentationState.gameState.isActive = isActive;
    if (!isActive) {
      // Reset game state
      malawiPresentationState.gameState.currentAnswerer = null;
      malawiPresentationState.gameState.showAnswer = false;
      malawiPresentationState.gameState.currentQuestion = null;
    }
    io.emit("malawi-game-status-change", isActive);
  });

  // Teacher toggles game mode (activates questions interface)
  socket.on("malawi-toggle-game-mode", (gameModeActive) => {
    console.log(`Malawi: Game mode toggled to: ${gameModeActive}`);
    malawiPresentationState.gameModeActive = gameModeActive;
    io.emit("malawi-game-mode-change", gameModeActive);
  });

  // Teacher asks a question
  socket.on("malawi-ask-question", (questionData) => {
    console.log(`Malawi: Asking question:`, questionData);
    malawiPresentationState.gameState.currentQuestion = questionData;
    malawiPresentationState.gameState.currentAnswerer = null;
    malawiPresentationState.gameState.showAnswer = false;
    // Clear the set of students who answered when a new question is asked
    malawiPresentationState.gameState.studentsWhoAnswered.clear();

    io.emit("malawi-question-asked", questionData);
  });

  // Teacher approves/rejects answer
  socket.on("malawi-answer-result", (data) => {
    console.log(`Malawi: Answer result:`, data);
    if (malawiPresentationState.gameState.currentAnswerer) {
      const studentId =
        malawiPresentationState.gameState.currentAnswerer.studentId;
      const team = malawiPresentationState.gameState.currentAnswerer.team;

      // Add student to answered set if one student per question mode is enabled
      if (malawiPresentationState.gameState.oneStudentPerQuestion) {
        malawiPresentationState.gameState.studentsWhoAnswered.add(studentId);
      }

      if (data.isCorrect && malawiPresentationState.gameState.teams[team]) {
        malawiPresentationState.gameState.teams[team].score += data.points || 1;
      }

      // Show answer and update scores
      malawiPresentationState.gameState.showAnswer = true;
      io.emit("malawi-answer-result", {
        isCorrect: data.isCorrect,
        points: data.points || 1,
        correctAnswer:
          malawiPresentationState.gameState.currentQuestion?.correctAnswer,
        answerer: malawiPresentationState.gameState.currentAnswerer,
        teams: malawiPresentationState.gameState.teams,
      });

      // Clear current question and answerer
      malawiPresentationState.gameState.currentAnswerer = null;
    }
  });

  // Teacher clears answerer
  socket.on("malawi-clear-answerer", () => {
    malawiPresentationState.gameState.currentAnswerer = null;
    io.emit("malawi-answerer-cleared");
  });

  // Teacher toggles one student per question mode
  socket.on("malawi-toggle-one-student-mode", (enabled) => {
    console.log(`Malawi: One student per question mode toggled to: ${enabled}`);
    malawiPresentationState.gameState.oneStudentPerQuestion = enabled;
    // Clear answered students when disabling the mode
    if (!enabled) {
      malawiPresentationState.gameState.studentsWhoAnswered.clear();
    }
    io.emit("malawi-one-student-mode-toggled", enabled);
  });

  // Send Malawi presentation state to joining clients
  socket.emit("malawi-presentationState", {
    ...malawiPresentationState,
    qaMessages: malawiPresentationState.qaMessages,
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    clients.delete(socket.id);

    // Clean up game state
    const disconnectedStudent = Array.from(gameState.students.entries()).find(
      ([, student]) => student.socketId === socket.id
    );

    if (disconnectedStudent) {
      const [studentId, student] = disconnectedStudent;
      console.log(`Student ${student.name} (${student.team}) disconnected`);

      // Remove from students map
      gameState.students.delete(studentId);

      // Remove from team members
      if (gameState.teams[student.team]) {
        gameState.teams[student.team].members = gameState.teams[
          student.team
        ].members.filter((member) => member.id !== studentId);
      }

      // Clear answerer if it was this student
      if (gameState.currentAnswerer?.studentId === studentId) {
        gameState.currentAnswerer = null;
        io.emit("answerer-cleared");
      }

      // Broadcast updated teams
      io.emit("teams-updated", gameState.teams);
    }

    // Clean up Malawi game state
    const disconnectedMalawiStudent = Array.from(
      malawiPresentationState.gameState.students.entries()
    ).find(([, student]) => student.socketId === socket.id);

    if (disconnectedMalawiStudent) {
      const [studentId, student] = disconnectedMalawiStudent;
      console.log(
        `Malawi: Student ${student.name} (${student.team}) disconnected`
      );

      // Remove from students map
      malawiPresentationState.gameState.students.delete(studentId);

      // Remove from team members
      if (malawiPresentationState.gameState.teams[student.team]) {
        malawiPresentationState.gameState.teams[student.team].members =
          malawiPresentationState.gameState.teams[student.team].members.filter(
            (member) => member.id !== studentId
          );
      }

      // Clear answerer if it was this student
      if (
        malawiPresentationState.gameState.currentAnswerer?.studentId ===
        studentId
      ) {
        malawiPresentationState.gameState.currentAnswerer = null;
        io.emit("malawi-answerer-cleared");
      }

      // Broadcast updated teams
      io.emit("malawi-teams-updated", malawiPresentationState.gameState.teams);
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
