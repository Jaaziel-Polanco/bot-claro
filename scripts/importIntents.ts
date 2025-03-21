// scripts/importIntents.ts
import { chatIntents } from '../store/chatIntents';
import { addChatIntent } from '../lib/chatIntentsService';

async function importIntents() {
  for (const intent of chatIntents) {
    try {
      // Agrega el intent a Firestore; se usará el id generado por Firebase
      const id = await addChatIntent(intent);
      console.log(`Intent "${intent.title}" importado con ID: ${id}`);
    } catch (error) {
      console.error(`Error importando el intent "${intent.title}":`, error);
    }
  }
}

importIntents().then(() => {
  console.log('Importación finalizada');
  process.exit(0);
});
