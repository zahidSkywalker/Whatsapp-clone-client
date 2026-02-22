// Core User Interface
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  status?: string;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Message Interface
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'file';
  createdAt: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  sender?: User; // Populated on the server side
}

// Chat Interface
export interface Chat {
  id: string;
  isGroup: boolean;
  name?: string; // For group chats
  avatar?: string; // For group chats
  description?: string;
  members?: ChatMember[]; // Populated population
  messages?: Message[]; // Used for last message preview in Sidebar
  createdAt?: string;
  updatedAt?: string;
  unreadCount?: number;
}

// Chat Member Interface
export interface ChatMember {
  userId: string;
  chatId: string;
  isAdmin: boolean;
  joinedAt: string;
  user: User;
}

// Outbox Interface (for Offline Support)
export interface Outbox {
  id?: number;
  tempId: string;
  chatId: string;
  type: string;
  content: string;
  createdAt: Date;
}

// Push Subscription Interface (for PWA Notifications)
export interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}
