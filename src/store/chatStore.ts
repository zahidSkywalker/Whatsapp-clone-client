import { create } from 'zustand';
import { Chat, Message } from '@/types';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  typingUsers: { [chatId: string]: boolean };
  onlineUsers: Set<string>;
  
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  setActiveChat: (chat: Chat | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
  setOnline: (userId: string, status: boolean) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChat: null,
  messages: [],
  typingUsers: {},
  onlineUsers: new Set(),

  setChats: (chats) => set({ chats }),
  
  addChat: (chat) => set((state) => ({
    chats: [chat, ...state.chats]
  })),

  setActiveChat: (chat) => set({ activeChat: chat, messages: [] }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => {
    // Update chat list with latest message
    const updatedChats = state.chats.map(c => 
      c.id === message.chatId 
        ? { ...c, messages: [message], updatedAt: message.createdAt }
        : c
    );
    
    // Add to current chat messages if active
    if (state.activeChat?.id === message.chatId) {
      return {
        messages: [...state.messages, message],
        chats: updatedChats
      };
    }
    
    return { chats: updatedChats };
  }),

  setTyping: (chatId, isTyping) => set((state) => ({
    typingUsers: { ...state.typingUsers, [chatId]: isTyping }
  })),

  setOnline: (userId, status) => set((state) => {
    const newSet = new Set(state.onlineUsers);
    if (status) newSet.add(userId);
    else newSet.delete(userId);
    return { onlineUsers: newSet };
  }),

  updateMessageStatus: (messageId, status) => set((state) => ({
    messages: state.messages.map(m => 
      m.id === messageId ? { ...m, status } : m
    )
  }))
}));
