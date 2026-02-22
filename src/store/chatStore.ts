import { create } from 'zustand';
import { Conversation, Message, User } from '../types'; // Make sure your types are imported

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  selectedConversation: Conversation | null;
  isMessagesLoading: boolean;
  isConversationsLoading: boolean;
  
  setSelectedConversation: (conversation: Conversation | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

const useChatStore = create<ChatState>((set) => ({
  // --- CRITICAL FIX: Initialize as empty array [] ---
  conversations: [], 
  messages: [],
  selectedConversation: null,
  isMessagesLoading: false,
  isConversationsLoading: false,

  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  
  setConversations: (conversations) => set({ conversations }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
}));

export default useChatStore;
