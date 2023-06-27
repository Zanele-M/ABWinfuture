import { io, Socket } from "socket.io-client";

const socketUrl = "http://localhost:8080"; // Replace with your WebSocket server URL

let socket: Socket | null = null;

export function connectWebSocket() {
  socket = io(socketUrl);

  socket.on("connect", () => {
    console.log("Connected to the WebSocket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from the WebSocket server");
  });
}

export function subscribeToTestResults(callback: (data: any) => void) {
  if (!socket) {
    throw new Error("WebSocket not connected");
  }

  socket.on("test_results", callback);
}

export function disconnectWebSocket() {
  if (socket) {
    socket.disconnect();
  }
}
