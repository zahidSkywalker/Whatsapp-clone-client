import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { socket } from '@/lib/socket';
import { Message } from '@/types'; // Import Message type

export const useSocket = () => {
  const { user } = useAuthStore();
  // Use the new actions
  const { addMessage, setTyping, updateLatestMessage } = useChatStore();

  useEffect(() => {
    if (!user) return;

    // Auth
    socket.emit('setup', user.id);

    // Listeners
    socket.on('connected', () => console.log('Socket connected'));

    socket.on('message-received', (newMessage: Message) => {
      // Use getState to access current activeChat safely
      const { activeChat, setMessages, messages } = useChatStore.getState();
      
      // If we are in the chat where the message belongs, add it to the view
      if (activeChat && activeChat.id === newMessage.chatId) {
        setMessages([...messages, newMessage]);
      }
      
      // Always update the sidebar latest message
      updateLatestMessage(newMessage);
    });

    socket.on('typing', ({ chatId }: { chatId: string }) => {
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
  }, [user, addMessage, setTyping, updateLatestMessage]);

  const joinChat = (chatId: string) => {
    socket.emit('join-chat', chatId);
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    socket.emit(isTyping ? 'typing' : 'stop-typing', chatId);
  };

  return { joinChat, sendTyping };
};
