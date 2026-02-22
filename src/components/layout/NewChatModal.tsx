import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/lib/api';
import { useChatStore } from '@/store/chatStore';
import { User } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewChatModal: React.FC<Props> = ({ open, onClose }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { addChat, setActiveChat } = useChatStore();

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/user/search?query=${query}`);
      setUsers(res.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      const res = await api.post('/chat', { userId });
      addChat(res.data);
      setActiveChat(res.data);
      onClose(); // Close modal
      setSearch('');
      setUsers([]);
    } catch (error) {
      console.error('Failed to start chat', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-whatsapp-dark-bg border-whatsapp-dark-surface">
        <DialogHeader>
          <DialogTitle className="text-whatsapp-dark-text">Start New Chat</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Search by email or username..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-whatsapp-dark-input"
          />
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="text-center text-whatsapp-dark-textSecondary p-4">Searching...</div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleStartChat(user.id)}
                className="flex items-center gap-3 p-3 hover:bg-whatsapp-dark-surface cursor-pointer rounded-lg"
              >
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-whatsapp-dark-text font-medium">{user.username}</p>
                  <p className="text-xs text-whatsapp-dark-textSecondary">{user.email}</p>
                </div>
              </div>
            ))
          )}
          {!loading && search && users.length === 0 && (
            <div className="text-center text-whatsapp-dark-textSecondary p-4">No users found.</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatModal;
