import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/api-auth';
import { listFollowups, saveFollowup, removeFollowup } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

const ADMIN_ROLES = ['admin', 'team'];

export async function GET(request) {
  const auth = await requireSession(['admin', 'team', 'client']);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const clientIdParam = searchParams.get('clientId');
    const status = searchParams.get('status');
    const clientId = auth.session.role === 'client' ? auth.session.clientId : clientIdParam;

    const followups = await listFollowups({ clientId, status: status || undefined });
    return NextResponse.json({ followups });
  } catch (error) {
    console.error('GET /api/admin/seguimientos error:', error);
    return NextResponse.json({ error: 'No pudimos cargar seguimientos.' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    if (!body.clientId || !body.comment) {
      return NextResponse.json({ error: 'clientId y comentario son obligatorios.' }, { status: 400 });
    }

    const followup = await saveFollowup({
      clientId: String(body.clientId),
      comment: String(body.comment || '').trim(),
      nextStep: String(body.nextStep || '').trim(),
      reminderAt: body.reminderAt,
      status: body.status || 'abierto',
      owner: body.owner || auth.session.name || '',
      attachments: body.attachments || [],
    });

    await notifyEvent({
      type: 'nuevo_seguimiento',
      title: 'Nuevo seguimiento registrado',
      message: 'Se agrego una nota de seguimiento en el CRM.',
      details: { clientId: followup.clientId, estado: followup.status },
    });

    return NextResponse.json({ success: true, followup });
  } catch (error) {
    console.error('POST /api/admin/seguimientos error:', error);
    return NextResponse.json({ error: 'No se pudo guardar el seguimiento.' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    if (!body.id || !body.clientId) {
      return NextResponse.json({ error: 'id y clientId son obligatorios.' }, { status: 400 });
    }

    const followup = await saveFollowup({
      id: body.id,
      clientId: String(body.clientId),
      comment: String(body.comment || '').trim(),
      nextStep: String(body.nextStep || '').trim(),
      reminderAt: body.reminderAt,
      status: body.status || 'abierto',
      owner: body.owner || '',
      attachments: body.attachments || [],
    });

    await notifyEvent({
      type: 'seguimiento_actualizado',
      title: 'Seguimiento actualizado',
      message: 'Se actualizo una nota de seguimiento.',
      details: { clientId: followup.clientId, estado: followup.status },
    });

    return NextResponse.json({ success: true, followup });
  } catch (error) {
    console.error('PUT /api/admin/seguimientos error:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el seguimiento.' }, { status: 500 });
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

    await removeFollowup(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/seguimientos error:', error);
    return NextResponse.json({ error: 'No se pudo eliminar el seguimiento.' }, { status: 500 });
  }
}
