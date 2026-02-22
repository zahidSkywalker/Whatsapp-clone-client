import { create } from 'zustand';
import { Chat, Message } from '@/types';

interface ChatState {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  
  // New action to append a single message
  addMessage: (message: Message) => void;
  // New action to update the chat list (sidebar)
  updateLatestMessage: (message: Message) => void;
  
  typingUsers: Record<string, boolean>;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeChat: null,
  setActiveChat: (chat) => set({ 
    activeChat: chat, 
    messages: chat?.messages || [] 
  }),
  
  chats: [],
  setChats: (chats) => set({ chats }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  updateLatestMessage: (message) => set((state) => {
    const chatIndex = state.chats.findIndex(c => c.id === message.chatId);
    if (chatIndex === -1) return state;

    const updatedChats = [...state.chats];
    const chat = { ...updatedChats[chatIndex] };
    
    // Update the chat's last message info
    // Assuming the Chat type has a 'messages' array for the last message preview
    chat.messages = [message];
    
    // Move this chat to the top of the list
    updatedChats.splice(chatIndex, 1);
    updatedChats.unshift(chat);
    
    return { chats: updatedChats };
  }),

  typingUsers: {},
  setTyping: (chatId, isTyping) => set((state) => ({
    typingUsers: { ...state.typingUsers, [chatId]: isTyping }
  }))
}));
