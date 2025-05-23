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

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    clients.delete(socket.id);
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
