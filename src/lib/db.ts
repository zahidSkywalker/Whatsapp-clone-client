import Dexie, { Table } from 'dexie';

export interface Message {
  id: string;
  chatId: string;
  content: string;
  senderId: string;
  createdAt: Date;
  status: 'sending' | 'sent' | 'failed';
}

export interface Outbox {
  id?: number;
  tempId: string;
  chatId: string;
  type: string;
  content: string;
  createdAt: Date;
}

export class MyDatabase extends Dexie {
  messages!: Table<Message, string>;
  outbox!: Table<Outbox, number>;

  constructor() {
    super('whatsapp_clone_db');
    this.version(1).stores({
      messages: 'id, chatId, createdAt',
      outbox: '++id, chatId'
    });
  }
}

export const db = new MyDatabase();
