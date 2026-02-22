import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { useSocket } from '@/hooks/useSocket';

const ChatPage: React.FC = () => {
  // Initialize socket connection when the chat page loads
  useSocket();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-whatsapp-dark-bg">
      {/* 
        Responsive Layout:
        - Mobile: Show Sidebar OR ChatWindow based on selection (logic can be added with state)
        - Desktop: Show both side-by-side
      */}
      <div className="w-full md:w-[420px] lg:w-[30%] h-full flex-shrink-0">
        <Sidebar />
      </div>
      
      <div className="flex-1 h-full hidden md:flex">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
