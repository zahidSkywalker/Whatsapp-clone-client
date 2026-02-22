export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  status?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'file';
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  sender?: User;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
  avatar?: string;
  members?: { userId: string; user: User }[];
  messages?: Message[]; // Used for the last message preview in Sidebar
  createdAt?: string;
}

export interface Outbox {
  id?: number;
  tempId: string;
  chatId: string;
  type: string;
  content: string;
  createdAt: Date;
}
