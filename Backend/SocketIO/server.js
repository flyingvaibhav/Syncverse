import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",   // your current Vite port
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "http://127.0.0.1:3002",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// map: userId -> socketId
const userSocketMap = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  if (userId) userSocketMap.set(userId, socket.id);

  // emit online users to everyone whenever a user connects
  io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

  socket.on("disconnect", () => {
    if (userId) userSocketMap.delete(userId);
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
  });
});

// helper used by controllers
export const getReceiverSocketId = (receiverUserId) => userSocketMap.get(receiverUserId);

export { app, server };