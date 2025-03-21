// lib/chatIntentsService.ts
import { db } from './firebaseAdmin';
import { ChatIntent } from '@/store/chatIntents';

const intentsCollection = db.collection('chatIntents');

export async function getChatIntents(): Promise<ChatIntent[]> {
  const snapshot = await intentsCollection.get();
  const intents: ChatIntent[] = [];
  snapshot.forEach(doc => {
    intents.push({ id: doc.id, ...doc.data() } as ChatIntent);
  });
  return intents;
}

export async function addChatIntent(intent: ChatIntent): Promise<string> {
  const docRef = await intentsCollection.add(intent);
  return docRef.id;
}

export async function updateChatIntent(id: string, data: Partial<ChatIntent>): Promise<void> {
  await intentsCollection.doc(id).update(data);
}

export async function deleteChatIntent(id: string): Promise<void> {
  await intentsCollection.doc(id).delete();
}
