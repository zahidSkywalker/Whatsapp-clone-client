import { create } from 'zustand';
import { Chat, Message } from '@/types';

interface ChatState {
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  
  updateLatestMessage: (message: Message) => void;
  
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
  
  typingUsers: Record<string, boolean>;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChat: null,
  setActiveChat: (chat) => set({ 
    activeChat: chat, 
    messages: chat?.messages || [] 
  }),
  
  chats: [],
  setChats: (chats) => set({ chats }),
  
  addChat: (chat) => set((state) => ({
    chats: [chat, ...state.chats]
  })),
  
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
    
    chat.messages = [message];
    
    updatedChats.splice(chatIndex, 1);
    updatedChats.unshift(chat);
    
    return { chats: updatedChats };
  }),

  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  typingUsers: {},
  setTyping: (chatId, isTyping) => set((state) => ({
    typingUsers: { ...state.typingUsers, [chatId]: isTyping }
  }))
}));
