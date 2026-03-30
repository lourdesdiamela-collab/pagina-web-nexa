import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { requireSession } from '@/lib/api-auth';
import { getClientMeta, listFollowups, listPayments } from '@/lib/crm';

const ADMIN_ROLES = ['admin', 'team'];

export async function GET(_request, { params }) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  const clientId = params?.id;
  if (!clientId) {
    return NextResponse.json({ error: 'ID requerido.' }, { status: 400 });
  }

  try {
    const [clientResult, tasksResult, deliveriesResult, followups, payments] = await Promise.all([
      supabase.from('clients').select('id,user_id,company,contact_name,email,plan,service,status,created_at').eq('id', clientId).single(),
      supabase.from('tasks').select('id,client_id,title,description,status,priority,due_date,created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
      supabase.from('deliveries').select('id,client_id,title,description,status,created_at').eq('client_id', clientId).order('created_at', { ascending: false }),
      listFollowups({ clientId }),
      listPayments({ clientId }),
    ]);

    if (clientResult.error || !clientResult.data) {
      return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 });
    }

    const meta = await getClientMeta(clientId);
    const client = {
      ...clientResult.data,
      startDate: meta?.startDate || null,
      endDate: meta?.endDate || null,
      durationDays: meta?.durationDays || null,
      serviceMode: meta?.serviceMode || 'fixed',
      notes: meta?.notes || '',
      category: meta?.category || '',
      responsible: meta?.responsible || '',
    };

    return NextResponse.json({
      client,
      tasks: tasksResult.data || [],
      deliveries: deliveriesResult.data || [],
      followups,
      payments,
    });
  } catch (error) {
    console.error('GET /api/admin/clientes/[id] error:', error);
    return NextResponse.json({ error: 'No se pudo cargar el detalle del cliente.' }, { status: 500 });
  }
}
