import { create } from "zustand";

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [], // This will be the current conversation's messages
  messagesMap: new Map(), // Store messages for each conversation
  
  // setMessage can accept either an array or an updater function(prev) => newArray
  setMessage: (updater) => {
    const { selectedConversation } = get();
    if (!selectedConversation?._id) return;
    
    set((state) => {
      const currentMessages = state.messagesMap.get(selectedConversation._id) || [];
      let newMessages;
      
      if (typeof updater === "function") {
        newMessages = updater(currentMessages);
      } else {
        newMessages = updater;
      }
      
      // Update the map
      const newMessagesMap = new Map(state.messagesMap);
      newMessagesMap.set(selectedConversation._id, newMessages);
      
      return {
        messages: newMessages,
        messagesMap: newMessagesMap
      };
    });
  },
  
  // Get messages for a specific conversation
  getMessagesForConversation: (conversationId) => {
    const { messagesMap } = get();
    return messagesMap.get(conversationId) || [];
  },
  
  // Clear messages when switching conversations
  clearMessages: () => set({ messages: [] }),
}));
export default useConversation;