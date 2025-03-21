// app/api/admin/training/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getChatIntents, addChatIntent } from '@/lib/chatIntentsService';

export async function GET() {
    try {
      const intents = await getChatIntents();
      return NextResponse.json({ intents });
    } catch (error) {
      console.error('Error obteniendo intents:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  }
  

export async function POST(req: NextRequest) {
  try {
    const { intent } = await req.json();
    // Validar que el intent tenga los campos necesarios
    if (!intent || !intent.title || !intent.response || !Array.isArray(intent.examples)) {
      return NextResponse.json({ error: 'Datos de intent inválidos' }, { status: 400 });
    }
    const id = await addChatIntent(intent);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error agregando intent:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
