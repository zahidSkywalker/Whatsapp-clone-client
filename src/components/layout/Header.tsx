import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getOtherMember } from '@/lib/utils';
import { DotsVerticalIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

const Header: React.FC = () => {
  const { activeChat, onlineUsers } = useChatStore();
  const { user } = useAuthStore();

  if (!activeChat) return null;

  const otherUser = getOtherMember(activeChat, user?.id || '');
  const isOnline = onlineUsers.includes(otherUser?.id || '');
  const displayName = activeChat.isGroup ? activeChat.name : otherUser?.username;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-whatsapp-dark-header border-b border-whatsapp-dark-divider h-[60px]">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={activeChat.isGroup ? activeChat.avatar : otherUser?.avatar} />
          <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-whatsapp-dark-text font-medium">{displayName}</span>
          {!activeChat.isGroup && (
            <span className="text-xs text-whatsapp-dark-textSecondary">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          )}
          {/* Fixed line 43: Added optional chaining */}
          {activeChat.isGroup && activeChat.members && (
             <span className="text-xs text-whatsapp-dark-textSecondary">
               {activeChat.members.length} members
             </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-whatsapp-dark-textSecondary">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-whatsapp-dark-textSecondary">
          <DotsVerticalIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
