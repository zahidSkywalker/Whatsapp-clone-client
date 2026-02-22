import Dexie, { type EntityTable } from 'dexie';

// Define types for our database entities
interface DBMessage {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'voice' | 'file';
  content?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  status: 'sent' | 'delivered' | 'read' | 'pending' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface DBChat {
  id: string;
  name?: string;
  isGroup: boolean;
  avatar?: string;
  updatedAt: Date;
}

interface Outbox {
  id?: number; // Auto-incremented ID for outbox queue
  tempId: string;
  chatId: string;
  type: 'text' | 'image' | 'voice' | 'file';
  content?: string;
  file?: Blob; // Store file blob for offline upload
  createdAt: Date;
}

const db = new Dexie('WhatsAppDB') as Dexie & {
  messages: EntityTable<DBMessage, 'id'>;
  chats: EntityTable<DBChat, 'id'>;
  outbox: EntityTable<Outbox, 'id'>;
};

// Schema definition
db.version(1).stores({
  messages: 'id, chatId, createdAt, status',
  chats: 'id, updatedAt',
  outbox: '++id, chatId, createdAt'
});

export { db };
export type { DBMessage, DBChat, Outbox };
