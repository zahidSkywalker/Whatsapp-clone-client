import React, { useState, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { queueMessage } from '@/lib/offline'; // Import offline utility

// Self-contained Icons
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404z" /></svg>;
const PaperClipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" /></svg>;
const SmileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { activeChat } = useChatStore();
  const { sendTyping } = useSocket();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping && activeChat) {
      setIsTyping(true);
      sendTyping(activeChat.id, true);
    }

    setTimeout(() => {
      if (isTyping && activeChat) {
        setIsTyping(false);
        sendTyping(activeChat.id, false);
      }
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const msgData = {
      content: message,
      type: 'text',
      chatId: activeChat.id,
    };

    try {
      if (navigator.onLine) {
        await api.post(`/message/${activeChat.id}`, msgData);
      } else {
        // Save to offline queue if not connected
        await queueMessage(msgData);
      }
      setMessage('');
      sendTyping(activeChat.id, false);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type.startsWith('image') ? 'image' : 'file');

    try {
      await api.post(`/message/${activeChat.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-whatsapp-dark-header border-t border-whatsapp-dark-divider">
      <div className="flex items-center gap-2 text-whatsapp-dark-textSecondary">
        <button className="hover:text-whatsapp-dark-text transition-colors">
          <SmileIcon />
        </button>
        <button 
          onClick={handleFileSelect}
          className="hover:text-whatsapp-dark-text transition-colors"
        >
          <PaperClipIcon />
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      <form onSubmit={handleSend} className="flex-1">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleInputChange}
          className="w-full bg-whatsapp-dark-input text-whatsapp-dark-text placeholder-whatsapp-dark-textSecondary py-2 px-4 rounded-lg focus:outline-none"
        />
      </form>

      <Button 
        variant="ghost" 
        size="icon" 
        className="text-whatsapp-teal rounded-full hover:bg-whatsapp-dark-input"
        onClick={message ? handleSend : undefined}
      >
        {message ? <SendIcon /> : <MicrophoneIcon />}
      </Button>
    </div>
  );
};

export default ChatInput;
