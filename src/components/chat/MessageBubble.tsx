import React from 'react';
import { Message } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import VoiceNotePlayer from './VoiceNotePlayer';

interface Props {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, isOwn }) => {
  return (
    <div
      className={cn(
        'flex w-full mt-1 px-4',
        isOwn ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'relative max-w-[65%] rounded-lg px-3 py-1.5 shadow-message',
          isOwn
            ? 'bg-whatsapp-dark-bubbleOut text-white rounded-tr-none'
            : 'bg-whatsapp-dark-bubbleIn text-whatsapp-dark-text rounded-tl-none'
        )}
      >
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed break-words">{message.content}</p>
        )}
        
        {message.type === 'image' && (
          <div className="mb-1 rounded-md overflow-hidden max-w-[240px]">
            <img src={message.mediaUrl} alt="image" className="w-full h-auto object-cover" />
          </div>
        )}

        {message.type === 'voice' && message.mediaUrl && (
          <VoiceNotePlayer audioUrl={message.mediaUrl} isOwn={isOwn} />
        )}

        {message.type === 'file' && (
          <div className="flex items-center gap-2 bg-black/10 rounded p-2 mb-1">
            <div className="bg-whatsapp-dark-textSecondary/20 p-2 rounded">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm truncate">{message.fileName}</p>
              <p className="text-xs text-whatsapp-dark-textSecondary">{(message.fileSize! / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div
          className={cn(
            'flex items-center justify-end gap-1 mt-0.5 float-right ml-2',
            isOwn ? 'text-white/60' : 'text-whatsapp-dark-textSecondary'
          )}
        >
          <span className="text-[10px]">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span className="text-xs">
              {message.status === 'read' ? (
                <svg viewBox="0 0 16 15" width="16" height="15" className="text-blue-400 fill-current">
                  <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
              ) : message.status === 'delivered' ? (
                <svg viewBox="0 0 16 15" width="16" height="15" className="text-white/60 fill-current">
                   <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 16 15" width="16" height="15" className="text-white/60 fill-current">
                  <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
