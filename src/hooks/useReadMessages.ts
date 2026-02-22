import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { socket } from '@/lib/socket';

export const useReadMessages = () => {
  const { activeChat, messages } = useChatStore();
  const { user } = useAuthStore();
  const processedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeChat || !user) return;

    // Filter messages that are not sent by me and not already marked as read/delivered
    const unreadMessages = messages.filter(
      (msg) => msg.senderId !== user.id && msg.status !== 'read' && !processedIds.current.has(msg.id)
    );

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map((m) => m.id);
      
      // Mark locally to prevent re-sending
      messageIds.forEach(id => processedIds.current.add(id));

      // Send API request
      api.put(`/message/${activeChat.id}/read`).catch(err => {
        console.error('Failed to mark read', err);
      });

      // Emit socket event for real-time update to sender
      socket.emit('mark-read', { 
        chatId: activeChat.id, 
        messageIds 
      });
    }
  }, [messages, activeChat, user]);
};
