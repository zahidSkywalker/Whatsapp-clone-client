import { db, Outbox } from './db';
import api from './api';

// Check if online
const isOnline = () => navigator.onLine;

// Add message to outbox queue
export const queueMessage = async (messageData: any) => {
  try {
    await db.outbox.add({
      tempId: `temp-${Date.now()}`,
      chatId: messageData.chatId,
      type: messageData.type,
      content: messageData.content,
      createdAt: new Date(),
    });
    console.log('Message queued for offline sending');
  } catch (error) {
    console.error('Failed to queue message:', error);
  }
};

// Process the outbox queue
export const processOutbox = async () => {
  if (!isOnline()) return;

  const messages = await db.outbox.toArray();
  if (messages.length === 0) return;

  console.log(`Processing ${messages.length} offline messages...`);

  for (const msg of messages) {
    try {
      // Send to server
      await api.post(`/message/${msg.chatId}`, {
        content: msg.content,
        type: msg.type,
      });
      
      // Remove from outbox on success
      if (msg.id) {
        await db.outbox.delete(msg.id);
      }
    } catch (error) {
      console.error('Failed to send queued message:', error);
      // Optionally keep in queue or discard after X attempts
    }
  }
};

// Initialize listeners
export const initOfflineSupport = () => {
  window.addEventListener('online', () => {
    console.log('Back online. Processing outbox...');
    processOutbox();
  });

  window.addEventListener('offline', () => {
    console.log('Gone offline. Messages will be queued.');
  });
};
