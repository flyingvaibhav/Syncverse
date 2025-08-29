import React, { useEffect, useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";
const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation, clearMessages } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedConversation && selectedConversation._id) {
        try {
          const res = await axios.get(
            `/api/message/get/${selectedConversation._id}`,
            { withCredentials: true }
          );
          setMessage(res.data);
          setLoading(false);
        } catch (error) {
          console.log("Error in getting messages", error);
          setLoading(false);
        }
      } else {
        // Clear messages when no conversation is selected
        clearMessages();
      }
    };
    
    // Clear messages first when switching conversations
    if (selectedConversation) {
      clearMessages();
    }
    
    getMessages();
  }, [selectedConversation, setMessage, clearMessages]);
  
  return { loading, messages };
};

export default useGetMessage;