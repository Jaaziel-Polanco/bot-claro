// app/api/admin/retrain/route.ts
import { NextResponse } from 'next/server';
import { initializeNLP } from '@/lib/nlpManager';

export async function POST() {
    try {
      await initializeNLP(true);
      return NextResponse.json({ message: 'Modelo reentrenado correctamente' });
    } catch (error) {
      console.error('Error reentrenando el modelo:', error);
      return NextResponse.json({ error: 'Error reentrenando el modelo' }, { status: 500 });
    }
  }
  
