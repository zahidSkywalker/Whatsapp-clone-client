import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { getOtherMember } from '@/lib/utils';

const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { activeChat, onlineUsers } = useChatStore();

  if (!activeChat) return null;

  const otherUser = getOtherMember(activeChat, user?.id || '');
  const displayName = activeChat.isGroup ? activeChat.name : otherUser?.username;
  const displayAvatar = activeChat.isGroup ? activeChat.avatar : otherUser?.avatar;

  const isOnline = activeChat.isGroup ? false : onlineUsers.has(otherUser?.id || '');

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-whatsapp-dark-header border-l border-whatsapp-dark-divider h-[60px]">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={displayAvatar} />
          <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-whatsapp-dark-text font-medium">{displayName}</span>
          {!activeChat.isGroup && (
            <span className="text-xs text-whatsapp-dark-textSecondary">
              {isOnline ? 'online' : 'last seen today at 2:30 PM'}
            </span>
          )}
          {activeChat.isGroup && (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-whatsapp-dark-textSecondary">
              <DotsVerticalIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Contact Info</DropdownMenuItem>
            <DropdownMenuItem>Select Messages</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuItem>Clear messages</DropdownMenuItem>
            <DropdownMenuItem>Delete chat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
