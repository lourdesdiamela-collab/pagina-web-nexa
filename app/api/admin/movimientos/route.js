import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/api-auth';
import { listMovements, saveMovement, removeMovement } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

const ADMIN_ROLES = ['admin', 'team'];

export async function GET(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const clientId = searchParams.get('clientId');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const movements = await listMovements({ type, clientId, search, from, to });
    return NextResponse.json({ movements });
  } catch (error) {
    console.error('GET /api/admin/movimientos error:', error);
    return NextResponse.json({ error: 'No pudimos cargar movimientos.' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    if (!body.concept || !body.amount) {
      return NextResponse.json({ error: 'Concepto y monto son obligatorios.' }, { status: 400 });
    }

    const movement = await saveMovement({
      type: body.type || 'expense',
      category: body.category || 'general',
      concept: body.concept,
      amount: body.amount,
      date: body.date,
      clientId: body.clientId || null,
      status: body.status || 'registrado',
      notes: body.notes || '',
      attachmentUrl: body.attachmentUrl || '',
    });

    await notifyEvent({
      type: movement.type === 'income' ? 'nuevo_ingreso' : 'nuevo_egreso',
      title: movement.type === 'income' ? 'Nuevo ingreso registrado' : 'Nuevo egreso registrado',
      message: movement.concept,
      details: { categoria: movement.category, monto: movement.amount },
    });

    return NextResponse.json({ success: true, movement });
  } catch (error) {
    console.error('POST /api/admin/movimientos error:', error);
    return NextResponse.json({ error: 'No se pudo guardar el movimiento.' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    }

    const movement = await saveMovement({
      id: body.id,
      type: body.type || 'expense',
      category: body.category || 'general',
      concept: body.concept,
      amount: body.amount,
      date: body.date,
      clientId: body.clientId || null,
      status: body.status || 'registrado',
      notes: body.notes || '',
      attachmentUrl: body.attachmentUrl || '',
    });

    return NextResponse.json({ success: true, movement });
  } catch (error) {
    console.error('PUT /api/admin/movimientos error:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el movimiento.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
    }

    await removeMovement(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/movimientos error:', error);
    return NextResponse.json({ error: 'No se pudo eliminar el movimiento.' }, { status: 500 });
  }
}
