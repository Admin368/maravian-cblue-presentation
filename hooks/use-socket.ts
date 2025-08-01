"use client"

import { useContext } from "react"
import { SocketContext } from "@/components/socket-provider"

export function useSocket() {
  const context = useContext(SocketContext)

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }

  return context
}
