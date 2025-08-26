import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import useConversation from "../statemanage/useConversation.js";
import sound from "../assets/notification.mp3";
const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessage } = useConversation();

  useEffect(() => {
    if (!socket) return;
    const handler = (newMessage) => {
      const notification = new Audio(sound);
      notification.play();
      // Append immutably using current state to avoid stale closures
      setMessage((prev) => ([...(prev ?? []), newMessage]));
    };
    socket.on("newMessage", handler);
    return () => socket.off("newMessage", handler);
  }, [socket, messages, setMessage]);
};
export default useGetSocketMessage;