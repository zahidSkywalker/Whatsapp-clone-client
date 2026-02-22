import { useEffect } from 'react';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types';

export const useSocket = () => {
  const { user } = useAuthStore();
  const { addMessage, setTyping, setOnline, activeChat } = useChatStore();

  useEffect(() => {
    if (user) {
      // Connect with userId for auth
      socket.auth = { userId: user.id };
      socket.connect();

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Listen for incoming messages
      socket.on('message-received', (message: Message) => {
        addMessage(message);
        // Optionally trigger notification sound
      });

      // Listen for typing events
      socket.on('typing', ({ chatId, isTyping, userId }) => {
        setTyping(chatId, isTyping);
      });

      // Listen for read receipts
      socket.on('messages-read', ({ chatId, messageIds, readerId }) => {
        // Update logic can be expanded here
      });

      // Online/Offline presence
      socket.on('user-online', (userId) => {
        setOnline(userId, true);
      });

      socket.on('user-offline', (userId) => {
        setOnline(userId, false);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const joinChat = (chatId: string) => {
    socket.emit('join-chat', chatId);
  };

  const leaveChat = (chatId: string) => {
    socket.emit('leave-chat', chatId);
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    socket.emit('typing', { chatId, isTyping });
  };

  return { joinChat, leaveChat, sendTyping };
};
