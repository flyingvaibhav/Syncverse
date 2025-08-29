import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

function User({ user }) {
  const { selectedConversation, setSelectedConversation, messagesMap, getMessagesForConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);
  
  // Get unread message count for this user
  const conversationMessages = getMessagesForConversation ? getMessagesForConversation(user._id) : [];
  const unreadCount = conversationMessages?.filter(msg => 
    msg.senderId === user._id && !msg.read
  ).length || 0;
  
  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      onClick={() => setSelectedConversation(user)}
    >
      <div className="flex space-x-4 px-8 py-3 hover:bg-slate-700 duration-300 cursor-pointer relative">
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
             <img src="IMG-20231204-WA0032.jpg"/>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-bold">{user.fullname}</h1>
          <span className="text-sm text-gray-400">{user.email}</span>
        </div>
        
        {/* Unread message indicator */}
        {unreadCount > 0 && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  }
  
  export default User;