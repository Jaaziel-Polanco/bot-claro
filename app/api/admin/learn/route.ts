// app/api/admin/learn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { learnFromInteraction } from '@/lib/nlpManager';

export async function POST(req: NextRequest) {
  try {
    const { message, intentId } = await req.json();
    await learnFromInteraction(message, intentId);
    return NextResponse.json({ message: 'Aprendizaje completado' });
  } catch (error) {
    console.error('Error en aprendizaje:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
