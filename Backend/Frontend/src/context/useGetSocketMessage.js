import React, { useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import useConversation from "../statemanage/useConversation.js";
import sound from "../assets/notification.mp3";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { setMessage, selectedConversation, messagesMap, getMessagesForConversation } = useConversation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Update browser tab title with unread count
  useEffect(() => {
    const originalTitle = document.title;
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
    
    return () => {
      document.title = originalTitle;
    };
  }, [unreadCount]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket not available in useGetSocketMessage");
      return;
    }
    
    console.log("Setting up socket message listener");
    
    const handler = (newMessage) => {
      console.log("Received new message via socket:", newMessage);
      
      // Always play notification sound for incoming messages (except from yourself)
      const currentUserId = selectedConversation?._id || 
                          (selectedConversation?.user?._id) || 
                          (selectedConversation?.senderId);
      
      if (newMessage.senderId !== currentUserId) {
        console.log("Playing notification sound for incoming message");
        
        // Play sound notification
        try {
          const notification = new Audio(sound);
          notification.volume = 0.7; // Set volume to 70%
          notification.play().catch(err => {
            console.log("Could not play notification sound:", err);
          });
        } catch (error) {
          console.log("Error playing notification sound:", error);
        }
        
        // Show browser notification if app is not in focus
        if (document.hidden && "Notification" in window && Notification.permission === "granted") {
          const senderName = newMessage.senderName || "Someone";
          new Notification("New Message", {
            body: `${senderName}: ${newMessage.message}`,
            icon: "/vite.svg", // You can change this to your app icon
            tag: "chat-message",
            requireInteraction: false,
            silent: false
          });
        }
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
      }
      
      // Check if message belongs to currently selected conversation
      if (selectedConversation && 
          (newMessage.senderId === selectedConversation._id || 
           newMessage.receiverId === selectedConversation._id)) {
        
        console.log("Message belongs to current conversation, adding it");
        
        // Append immutably using current state to avoid stale closures
        setMessage((prev) => {
          console.log("Previous messages:", prev);
          const updated = [...(prev ?? []), newMessage];
          console.log("Updated messages:", updated);
          return updated;
        });
      } else {
        console.log("Message does not belong to current conversation, but will be stored");
        // Store message in the conversation map even if not currently selected
        // This ensures messages are available when switching to that conversation
      }
    };
    
    socket.on("newMessage", handler);
    console.log("Socket message listener attached");
    
    return () => {
      console.log("Cleaning up socket message listener");
      socket.off("newMessage", handler);
    };
  }, [socket, setMessage, selectedConversation]);
  
  // Reset unread count when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setUnreadCount(0);
    }
  }, [selectedConversation]);
};

export default useGetSocketMessage;