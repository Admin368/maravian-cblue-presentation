import { Server } from "socket.io"
import type { NextApiResponseServerIO } from "@/types/socket"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id)

      socket.on("controlSlide", (slideIndex) => {
        console.log("Changing slide to:", slideIndex)
        io.emit("changeSlide", slideIndex)
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id)
      })
    })

    res.socket.server.io = io
  }

  return new Response("Socket server is running", { status: 200 })
}
