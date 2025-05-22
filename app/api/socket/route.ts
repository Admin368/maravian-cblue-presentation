import { Server } from "socket.io";
import type { NextApiResponseServerIO } from "@/types/socket";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id); // Track presentation state to send to new connections
      let presentationState = {
        currentSlide: 0,
        isActive: false,
        scrollMode: "none",
        targetElement: null as string | null,
      }; // Send current state to newly connected clients
      socket.emit("presentationState", presentationState);
      socket.on("controlSlide", (slideIndex: number) => {
        console.log("Changing slide to:", slideIndex);
        presentationState.currentSlide = slideIndex;
        io.emit("changeSlide", slideIndex);
      });

      // Handle scroll position updates for "everyscroll" mode
      socket.on(
        "scrollPosition",
        (data: { position: number; percentage: number }) => {
          io.emit("scrollToPosition", data);
        }
      );
      socket.on("togglePresentation", (isActive: boolean) => {
        console.log("Presentation active:", isActive);
        presentationState.isActive = isActive;
        io.emit("presentationActiveChange", isActive);
      });

      socket.on("setScrollMode", (mode: string) => {
        console.log("Setting scroll mode to:", mode);
        presentationState.scrollMode = mode;
        io.emit("scrollModeChange", mode);
      });

      socket.on("scrollToElement", (elementId: string) => {
        console.log("Scrolling to element:", elementId);
        presentationState.targetElement = elementId;
        io.emit("scrollToElement", elementId);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  return new Response("Socket server is running", { status: 200 });
}
