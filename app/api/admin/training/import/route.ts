// app/api/admin/training/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addChatIntent } from '@/lib/chatIntentsService';

export async function POST(req: NextRequest) {
  try {
    const { intents } = await req.json();
    if (!Array.isArray(intents)) {
      return NextResponse.json(
        { error: 'El cuerpo debe ser un arreglo de intents' },
        { status: 400 }
      );
    }
    let count = 0;
    for (const intent of intents) {
      if (intent && intent.title && intent.response && Array.isArray(intent.examples)) {
        await addChatIntent(intent);
        count++;
      }
    }
    return NextResponse.json({ message: `Se importaron ${count} intents correctamente.` });
  } catch (error) {
    console.error("Error importando intents:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
