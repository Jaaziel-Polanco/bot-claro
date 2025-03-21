// app/api/admin/training/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateChatIntent, deleteChatIntent } from '@/lib/chatIntentsService';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { intent } = await req.json();
    // Validamos que el intent tenga los campos necesarios
    if (!intent || !intent.title || !intent.response || !Array.isArray(intent.examples)) {
      return NextResponse.json({ error: 'Datos de intent inválidos' }, { status: 400 });
    }
    await updateChatIntent(id, intent);
    return NextResponse.json({ message: 'Intent actualizado correctamente' });
  } catch (error) {
    console.error('Error actualizando intent:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await deleteChatIntent(id);
    return NextResponse.json({ message: 'Intent eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando intent:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
