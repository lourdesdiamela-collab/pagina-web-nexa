import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { requireSession } from '@/lib/api-auth';
import { listPayments, listMovements, computeFinancialSummary, buildMonthlyHistory, saveMovement } from '@/lib/crm';

const ADMIN_ROLES = ['admin', 'team'];

async function resolveClientNames(clientTotals) {
  const ids = Object.keys(clientTotals).filter((key) => key !== 'sin_cliente');
  if (ids.length === 0) {
    return Object.entries(clientTotals).map(([clientId, total]) => ({ clientId, clientName: 'Sin cliente', total }));
  }

  const { data: clients } = await supabase.from('clients').select('id,company').in('id', ids);
  const map = Object.fromEntries((clients || []).map((client) => [client.id, client.company]));

  return Object.entries(clientTotals)
    .map(([clientId, total]) => ({
      clientId,
      clientName: clientId === 'sin_cliente' ? 'Sin cliente' : map[clientId] || 'Cliente',
      total,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function GET(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const clientId = searchParams.get('clientId');

    const [payments, movements] = await Promise.all([
      listPayments({ from, to, clientId }),
      listMovements({ from, to, clientId }),
    ]);

    const summary = computeFinancialSummary(payments, movements);
    const history = buildMonthlyHistory(payments, movements);
    const incomeByClient = await resolveClientNames(summary.incomeByClient);
    const expensesByCategory = Object.entries(summary.expensesByCategory)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({
      ...summary,
      history,
      incomeByClient,
      expensesByCategory,
      paymentCount: payments.length,
      movementCount: movements.length,
    });
  } catch (error) {
    console.error('GET /api/admin/finanzas error:', error);
    return NextResponse.json({ error: 'No pudimos calcular el reporte financiero.' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const action = body.action || 'create_movement';

    if (action !== 'create_movement') {
      return NextResponse.json({ error: 'Accion no soportada.' }, { status: 400 });
    }

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

    return NextResponse.json({ success: true, movement });
  } catch (error) {
    console.error('POST /api/admin/finanzas error:', error);
    return NextResponse.json({ error: 'No se pudo registrar el movimiento.' }, { status: 500 });
  }
}
