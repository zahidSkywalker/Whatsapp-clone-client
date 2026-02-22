export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  status?: string;
  lastSeen?: string;
}

export interface Chat {
  id: string;
  name?: string; // Only for groups
  isGroup: boolean;
  avatar?: string;
  members: ChatMember[];
  messages?: Message[];
  updatedAt: string;
  createdAt: string;
}

export interface ChatMember {
  userId: string;
  chatId: string;
  isAdmin: boolean;
  user: User;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'voice' | 'file';
  content?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
  sender: User;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  user: User;
}

export interface SocketEvents {
  join_chat: (chatId: string) => void;
  leave_chat: (chatId: string) => void;
  new_message: (message: Message) => void;
  typing: (data: { chatId: string; isTyping: boolean }) => void;
  message_received: (message: Message) => void;
  messages_read: (data: { chatId: string; messageIds: string[]; readerId: string }) => void;
  user_online: (userId: string) => void;
  user_offline: (userId: string) => void;
}
