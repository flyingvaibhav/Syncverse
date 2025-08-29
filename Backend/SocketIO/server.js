import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "https://syncverse-wdz7.onrender.com", // Your Render domain
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
// map: socketId -> userId (for cleanup)
const socketUserMap = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  console.log(`Socket connected: ${socket.id} for user: ${userId}`);
  
  if (userId) {
    // Check if user already has a socket connection
    const existingSocketId = userSocketMap.get(userId);
    if (existingSocketId) {
      console.log(`User ${userId} already has socket ${existingSocketId}, disconnecting old connection`);
      
      // Disconnect the old socket
      const oldSocket = io.sockets.sockets.get(existingSocketId);
      if (oldSocket) {
        oldSocket.disconnect(true);
      }
      
      // Clean up old mappings
      socketUserMap.delete(existingSocketId);
    }
    
    // Set new mappings
    userSocketMap.set(userId, socket.id);
    socketUserMap.set(socket.id, userId);
    
    console.log(`User ${userId} mapped to socket ${socket.id}`);
    console.log(`Current user socket map:`, Array.from(userSocketMap.entries()));
  }

  // emit online users to everyone whenever a user connects
  const onlineUsers = Array.from(userSocketMap.keys());
  console.log(`Emitting online users: ${onlineUsers}`);
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    
    const userId = socketUserMap.get(socket.id);
    if (userId) {
      // Only remove from userSocketMap if this is still the current socket for the user
      if (userSocketMap.get(userId) === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} removed from socket map`);
      }
      socketUserMap.delete(socket.id);
      console.log(`Current user socket map:`, Array.from(userSocketMap.entries()));
    }
    
    const remainingUsers = Array.from(userSocketMap.keys());
    console.log(`Emitting updated online users: ${remainingUsers}`);
    io.emit("getOnlineUsers", remainingUsers);
  });
});

// helper used by controllers
export const getReceiverSocketId = (receiverUserId) => {
  const socketId = userSocketMap.get(receiverUserId);
  console.log(`Getting socket ID for user ${receiverUserId}: ${socketId}`);
  return socketId;
};

export { app, server };