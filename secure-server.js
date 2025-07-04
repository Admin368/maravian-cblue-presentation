const fs = require("fs");
const path = require("path");
const https = require("https");
const { Server } = require("socket.io");

// Configuration for SSL/TLS (you'll need to update these paths)
// In production, use proper certificate paths from Let's Encrypt or similar
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
};

// Create HTTPS server
const httpsServer = https.createServer(httpsOptions);

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
const io = new Server(httpsServer, {
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
  },
  // Enable sticky session support
  transports: ["websocket", "polling"],
});

// Track connected clients
const clients = new Set();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  clients.add(socket.id);

  // Send current connection count to all clients
  io.emit("clientCount", clients.size);

  // Handle slide control events
  socket.on("controlSlide", (slideIndex) => {
    console.log(`Changing slide to: ${slideIndex}`);
    // Broadcast to all other clients
    io.emit("changeSlide", slideIndex);
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

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    clients.delete(socket.id);
    io.emit("clientCount", clients.size);
  });
});

// Start server
const PORT = process.env.PORT || 8051;
httpsServer.listen(PORT, () => {
  console.log(`Secure Socket.IO server running on port ${PORT}`);
  console.log(`- Connection URL for clients: wss://yourdomain.com:${PORT}`);
  console.log("- Press Ctrl+C to stop the server");
});
