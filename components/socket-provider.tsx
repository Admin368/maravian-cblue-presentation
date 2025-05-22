"use client";

import type React from "react";

import { createContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    // Connect to the WebSocket server
    console.log("Connecting to WebSocket server...");

    // Determine the connection URL based on the environment
    const isProduction = window.location.protocol === "https:";
    // const socketInstance = io(socketUrl, {
    //   transports: ["websocket"],
    //   withCredentials: true,
    // });

    const socketInstance = isProduction
      ? io("https://main.maravian.com", {
          path: "/8051/socket.io",
        })
      : io("http://localhost:8051");

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socketInstance.on("clientCount", (count) => {
      console.log(`Connected clients: ${count}`);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
