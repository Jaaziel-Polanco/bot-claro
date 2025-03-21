// lib/nlpManager.ts
import { Container } from '@nlpjs/core';
import { Nlp } from '@nlpjs/nlp';
import { Ner } from '@nlpjs/ner';
import LangEs from '@nlpjs/lang-es';
import { getChatIntents } from '@/lib/chatIntentsService';

// Crear el contenedor e inyectar dependencias
const container = new Container();
container.use(LangEs);
container.register('nlp', Nlp, true);
container.register('ner', Ner, true);

// Obtener la instancia de NLP
const nlp = container.get<Nlp>('nlp');
nlp.addLanguage('es');
nlp.settings.autoSave = false;

let isTrained = false;

// Función para cargar el modelo desde JSON (opcional)

// Función para inicializar y entrenar el NLP usando los intents de Firebase
export async function initializeNLP(force = false) {
  if (isTrained && !force) return;
  try {
    console.log('🔵 Entrenando modelo...');

    // Limpia documentos y respuestas anteriores si es necesario
    // (Podrías reinicializar nlp o eliminar documentos existentes)
    
    const intents = await getChatIntents();
    for (const intent of intents) {
      for (const example of intent.examples) {
        nlp.addDocument('es', example.toLowerCase(), intent.id);
      }
      nlp.addAnswer('es', intent.id, intent.response);
    }

    await nlp.train();
    isTrained = true;
    const trainedModel = nlp.export();
    console.log('🟢 Modelo entrenado:', trainedModel);
  } catch (error) {
    console.error('❌ Error en entrenamiento:', error);
    throw error;
  }
}

// Procesa el mensaje y retorna answer, score e intent
export async function processMessage(message: string): Promise<{ answer: string; score: number; intent: string }> {
  try {
    await initializeNLP();
    const normalizedMessage = message.toLowerCase().trim();
    const response = await nlp.process('es', normalizedMessage);

    // Verificación de saludo (opcional)
    const saludoRegex = /^(?:(?:[hw][o0]+l+[aá]+[s]?)|(?:h[eé]l+o+)|(?:b[uú]e[nm](?:o?s|as)?(?:\s*(?:d[ií]a(?:s)?|tardes?|noches?))?)|(?:q(?:u[eé])?\s*tal)|(?:(?:klk|qloq|qlok|(?:(?:q|k)(?:u[eé])?\s*lo\s*(?:(?:q|k)(?:u[eé])?))))|(?:q(?:u[eé])?\s*hubo)|(?:q(?:u[eé])?\s*hay)|(?:q(?:u[eé])?\s*(?:onda|v[oó]l[aá]))|(?:saludos?)|(?:ey|hey)|(?:ayudame))(?:\s+bot)?$/i;
    if ((!response.answer || response.score < 0.3) && saludoRegex.test(normalizedMessage)) {
      return { answer: "¡Hola! ¿En qué puedo ayudarte hoy?", score: response.score || 0, intent: response.intent || "" };
    }

    console.log('➡️ Mensaje:', message);
    console.log('📌 Intento detectado:', response.intent);
    console.log('📈 Confianza:', response.score);
    console.log('💬 Respuesta:', response.answer);

    return {
      answer: response.answer || "",
      score: response.score || 0,
      intent: response.intent || ""
    };
  } catch (error) {
    console.error('❌ Error en procesamiento:', error);
    return { answer: "", score: 0, intent: "" };
  }
}

// Cargar el modelo al iniciar el servidor (si lo deseas)
// loadModel();
