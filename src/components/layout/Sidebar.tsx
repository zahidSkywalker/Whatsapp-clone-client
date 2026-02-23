import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsVerticalIcon, MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { getOtherMember, cn } from '@/lib/utils';
import api from '@/lib/api';
import NewChatModal from './NewChatModal';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { chats, activeChat, setActiveChat, setChats } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/chat');
        setChats(res.data);
      } catch (error) {
        console.error('Failed to fetch chats', error);
      }
    };
    fetchChats();
  }, []);

  const filteredChats = (chats || []).filter((chat) => {
    if (chat.isGroup) {
      return chat.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    const otherUser = getOtherMember(chat, user?.id || '');
    return otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="w-full h-full flex flex-col bg-whatsapp-dark-sidebar border-r border-whatsapp-dark-divider">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-whatsapp-dark-header">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Archived</DropdownMenuItem>
                <DropdownMenuItem>Starred Messages</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-whatsapp-dark-textSecondary"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-whatsapp-dark-textSecondary">
              <DotsVerticalIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 bg-whatsapp-dark-sidebar">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-whatsapp-dark-textSecondary" />
            <Input
              placeholder="Search or start new chat"
              className="pl-10 h-9 bg-whatsapp-dark-input rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => {
            const otherUser = getOtherMember(chat, user?.id || '');
            const displayName = chat.isGroup ? chat.name : otherUser?.username;
            const displayAvatar = chat.isGroup ? chat.avatar : otherUser?.avatar;
            const lastMessage = chat.messages?.[0];

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-whatsapp-dark-surface transition-colors",
                  activeChat?.id === chat.id ? "bg-whatsapp-dark-surface" : ""
                )}
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={displayAvatar} />
                  <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 border-b border-whatsapp-dark-divider py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-whatsapp-dark-text font-medium">{displayName}</span>
                    <span className="text-xs text-whatsapp-dark-textSecondary">
                      {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-whatsapp-dark-textSecondary truncate max-w-[200px]">
                      {lastMessage ? (
                        lastMessage.type === 'text' ? lastMessage.content : `📎 ${lastMessage.type}`
                      ) : (
                        'Start chatting'
                      )}
                    </p>
                    {lastMessage?.senderId === user?.id && (
                       <span className="text-xs text-whatsapp-teal">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      <NewChatModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Sidebar;
