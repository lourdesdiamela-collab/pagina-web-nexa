import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { requireSession } from '@/lib/api-auth';
import { listPayments, savePayment, removePayment } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

const ADMIN_ROLES = ['admin', 'team'];
const VALID_STATUS = ['pending', 'paid', 'overdue', 'partial'];

function normalizeStatus(status, dueDate) {
  if (VALID_STATUS.includes(status)) return status;
  if (dueDate && new Date(dueDate).getTime() < Date.now()) return 'overdue';
  return 'pending';
}

async function attachClientName(payments) {
  const ids = [...new Set(payments.map((payment) => payment.clientId).filter(Boolean))];
  if (ids.length === 0) return payments;

  const { data } = await supabase.from('clients').select('id,company').in('id', ids);
  const map = Object.fromEntries((data || []).map((item) => [item.id, item.company]));

  return payments.map((payment) => ({
    ...payment,
    clientName: payment.clientId ? map[payment.clientId] || 'Cliente' : 'Sin cliente',
  }));
}

export async function GET(request) {
  const auth = await requireSession(['admin', 'team', 'client']);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const clientId = auth.session.role === 'client' ? auth.session.clientId : searchParams.get('clientId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const payments = await listPayments({ clientId, status, search, from, to });
    const normalized = payments.map((payment) => ({
      ...payment,
      status: normalizeStatus(payment.status, payment.dueDate),
    }));

    const enriched = await attachClientName(normalized);
    return NextResponse.json({ payments: enriched });
  } catch (error) {
    console.error('GET /api/admin/pagos error:', error);
    return NextResponse.json({ error: 'No pudimos cargar pagos.' }, { status: 500 });
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

    const payment = await savePayment({
      clientId: body.clientId || null,
      concept: body.concept,
      amount: body.amount,
      currency: body.currency || 'ARS',
      status: normalizeStatus(body.status, body.dueDate),
      method: body.method || 'transferencia',
      dueDate: body.dueDate,
      paidAt: body.paidAt,
      reference: body.reference,
      notes: body.notes,
      attachmentUrl: body.attachmentUrl,
    });

    await notifyEvent({
      type: 'nuevo_pago',
      title: 'Nuevo pago registrado',
      message: `Se registro ${payment.concept}.`,
      details: { monto: payment.amount, estado: payment.status },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('POST /api/admin/pagos error:', error);
    return NextResponse.json({ error: 'No se pudo registrar el pago.' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID de pago requerido.' }, { status: 400 });
    }

    const payment = await savePayment({
      id: body.id,
      clientId: body.clientId || null,
      concept: body.concept,
      amount: body.amount,
      currency: body.currency || 'ARS',
      status: normalizeStatus(body.status, body.dueDate),
      method: body.method || 'transferencia',
      dueDate: body.dueDate,
      paidAt: body.paidAt,
      reference: body.reference,
      notes: body.notes,
      attachmentUrl: body.attachmentUrl,
    });

    await notifyEvent({
      type: 'pago_actualizado',
      title: 'Pago actualizado',
      message: `Se actualizo ${payment.concept}.`,
      details: { estado: payment.status, monto: payment.amount },
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('PUT /api/admin/pagos error:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el pago.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID de pago requerido.' }, { status: 400 });
    }

    await removePayment(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/pagos error:', error);
    return NextResponse.json({ error: 'No se pudo eliminar el pago.' }, { status: 500 });
  }
}
