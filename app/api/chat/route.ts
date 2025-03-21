// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processMessage } from '@/lib/nlpManager';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.length > 500) {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 });
    }

    const result = await processMessage(message);
    // result contiene { answer, score, intent }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error en procesamiento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
