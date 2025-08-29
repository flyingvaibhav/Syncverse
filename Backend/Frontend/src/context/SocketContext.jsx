import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthProvider";

const socketContext = createContext();

// it is a hook.
export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [authUser] = useAuth();
  // Connect to the same origin (Vite dev server). Vite proxies /socket.io to backend 5004.
  const url = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (authUser) {
      const userId = authUser?._id || authUser?.user?._id;
      if (!userId) return;
      
      // Clean up existing socket first
      if (socket) {
        console.log("Cleaning up existing socket before creating new one");
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
      
      console.log("Creating socket connection for user:", userId);
      const newSocket = io(url, {
        query: { userId },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true, // Force new connection
      });
      
      // Socket connection events
      newSocket.on("connect", () => {
        console.log("Socket connected with ID:", newSocket.id);
        setIsConnected(true);
      });
      
      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      });
      
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });
      
      newSocket.on("getOnlineUsers", (users) => {
        console.log("Received online users:", users);
        setOnlineUsers(users);
      });
      
      setSocket(newSocket);
      
      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      if (socket) {
        console.log("User logged out, closing socket");
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [authUser, url]);
  
  // Handle page visibility changes
  useEffect(() => {
    if (!socket) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Page hidden, keeping socket connection");
      } else {
        console.log("Page visible, ensuring socket connection");
        if (!socket.connected) {
          console.log("Socket not connected, reconnecting...");
          socket.connect();
        }
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socket]);
  
  return (
    <socketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </socketContext.Provider>
  );
};