import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import { useReadMessages } from '@/hooks/useReadMessages';
import Header from '../layout/Header';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
// Removed unused import: import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/lib/api';

const ChatWindow: React.FC = () => {
  const { activeChat, messages, setMessages, typingUsers } = useChatStore();
  const { user } = useAuthStore();
  const { joinChat } = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useReadMessages();

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChat) {
        try {
          const res = await api.get(`/message/${activeChat.id}`);
          setMessages(res.data);
          joinChat(activeChat.id);
        } catch (error) {
          console.error('Failed to fetch messages', error);
        }
      }
    };
    fetchMessages();
  }, [activeChat?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-dark-bg">
        <div className="text-center">
          <div className="w-64 h-64 mx-auto mb-8 rounded-full bg-whatsapp-dark-surface flex items-center justify-center">
             <svg className="w-32 h-32 text-whatsapp-dark-textSecondary opacity-30" viewBox="0 0 303 172" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M229.565 160.229C262.212 149.245 286.931 118.241 283.39 73.4194C278.009 5.31929 210.365 -18.8417 142.568 13.2141C74.7712 45.2699 22.8424 90.7694 32.8348 146.156C42.8272 201.543 114.387 205.642 163.502 193.157C176.401 189.822 190.466 183.79 203.047 175.039L202.539 171.137C174.266 181.771 140.008 189.406 117.293 175.968C81.1288 154.82 78.5455 102.697 107.755 67.3772C136.964 32.0579 195.206 25.2276 229.565 56.6167C253.877 78.6748 248.685 121.639 229.565 160.229Z" fill="currentColor"/>
             </svg>
          </div>
          <h2 className="text-3xl text-whatsapp-dark-text font-light mb-3">WhatsApp Web</h2>
          <p className="text-whatsapp-dark-textSecondary text-sm max-w-md">
            Send and receive messages without keeping your phone online.<br/>
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
      </div>
    );
  }

  const isTyping = typingUsers[activeChat.id];

  return (
    <div className="flex-1 flex flex-col h-screen bg-whatsapp-dark-bg">
      <Header />
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-bg">
        <div className="flex flex-col py-4 min-h-full justify-end">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={msg.senderId === user?.id} 
            />
          ))}
          {isTyping && (
            <div className="px-4 mt-1">
              <TypingIndicator />
            </div>
          )}
        </div>
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
