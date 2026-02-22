import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { socket } from '@/lib/socket';

export const useSocket = () => {
  const { user } = useAuthStore();
  // Removed unused activeChat from destructuring
  const { setMessages, setTyping, setChats, updateLatestMessage } = useChatStore();

  useEffect(() => {
    if (!user) return;

    // Auth
    socket.emit('setup', user.id);

    // Listeners
    socket.on('connected', () => console.log('Socket connected'));

    socket.on('message-received', (newMessage: any) => {
      // Removed unused chatId variable
      setMessages((prev) => [...prev, newMessage]);
      updateLatestMessage(newMessage);
    });

    socket.on('typing', ({ chatId /*, userId*/ }) => {
      // Removed unused userId
      setTyping(chatId, true);
    });

    socket.on('stop-typing', (chatId: string) => {
      setTyping(chatId, false);
    });

    return () => {
      socket.off('connected');
      socket.off('message-received');
      socket.off('typing');
      socket.off('stop-typing');
    };
  }, [user, setMessages, setTyping, updateLatestMessage]);

  const joinChat = (chatId: string) => {
    socket.emit('join-chat', chatId);
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    socket.emit(isTyping ? 'typing' : 'stop-typing', chatId);
  };

  return { joinChat, sendTyping };
};
