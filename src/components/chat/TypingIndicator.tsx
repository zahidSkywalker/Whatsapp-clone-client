import React from 'react';
import { cn } from '@/lib/utils';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-whatsapp-dark-bubbleIn rounded-lg max-w-[80px] shadow-message">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-whatsapp-dark-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-whatsapp-dark-textSecondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-whatsapp-dark-textSecondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
