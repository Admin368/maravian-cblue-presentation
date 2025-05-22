const { createServer } = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server with CORS enabled
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, specify your frontend URL(s)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

// Track connected clients
const clients = new Set();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  clients.add(socket.id);
  
  // Send current connection count to all clients
  io.emit('clientCount', clients.size);

  // Handle slide control events
  socket.on('controlSlide', (slideIndex) => {
    console.log(`Changing slide to: ${slideIndex}`);
    // Broadcast to all other clients
    io.emit('changeSlide', slideIndex);
  });

  // Handle custom messages
  socket.on('message', (data) => {
    console.log(`Message from ${socket.id}:`, data);
    // Broadcast to all clients
    io.emit('message', {
      id: socket.id,
      timestamp: new Date().toISOString(),
      ...data
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    clients.delete(socket.id);
    io.emit('clientCount', clients.size);
  });
});

// Start server
const PORT = process.env.PORT || 8051;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`- Connection URL for clients: ws://localhost:${PORT}`);
  console.log('- Press Ctrl+C to stop the server');
});
