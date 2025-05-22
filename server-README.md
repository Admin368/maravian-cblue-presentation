# Socket.IO Server for Maravian Presentation

This is a standalone Socket.IO server that handles WebSocket connections for the Maravian presentation.

## Installation

1. Make sure you have Node.js installed on your system (version 14 or higher recommended).

2. Install the dependencies for the socket server:

```bash
npm install
```

Or if using the provided socket-server-package.json:

```bash
npm install --package-json=socket-server-package.json
```

## Running the server

Start the server with:

```bash
node socket-server.js
```

The server will run on port 8051 by default. You can change the port by setting the PORT environment variable.

## Events

The server handles the following events:

- `connection`: When a client connects
- `disconnect`: When a client disconnects
- `controlSlide`: When a client wants to change the slide
- `message`: Custom messages that will be broadcast to all clients

## Connecting from the client

The frontend application is configured to connect to `http://localhost:8051`. Make sure the server is running before starting your frontend application.

## Environment Variables

- `PORT`: The port on which the server runs (default: 8051)
