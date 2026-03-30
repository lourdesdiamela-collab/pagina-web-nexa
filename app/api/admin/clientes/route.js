import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db';
import { requireSession } from '@/lib/api-auth';
import { getClientMetaMap, saveClientMeta } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';
import { readStore, updateStore } from '@/lib/store';

const ADMIN_ROLES = ['admin', 'team'];

function normalizeMode(mode) {
  return mode === 'temporary' ? 'temporary' : 'fixed';
}

function mapClientWithMeta(client, meta, extra = {}) {
  return {
    ...client,
    startDate: meta?.startDate || null,
    endDate: meta?.endDate || null,
    durationDays: meta?.durationDays || null,
    serviceMode: meta?.serviceMode || 'fixed',
    notes: meta?.notes || '',
    category: meta?.category || '',
    responsible: meta?.responsible || '',
    ...extra,
  };
}

async function aggregateClientStats(clientIds) {
  const [tasksResult, followups, payments] = await Promise.all([
    supabase.from('tasks').select('client_id,status').in('client_id', clientIds),
    readStore('client_followups', []),
    readStore('client_payments', []),
  ]);

  const pendingTasksByClient = {};
  for (const task of tasksResult.data || []) {
    if (task.status === 'completed') continue;
    pendingTasksByClient[task.client_id] = (pendingTasksByClient[task.client_id] || 0) + 1;
  }

  const openFollowupsByClient = {};
  for (const followup of followups) {
    if (!followup.clientId || followup.status === 'cerrado') continue;
    openFollowupsByClient[followup.clientId] = (openFollowupsByClient[followup.clientId] || 0) + 1;
  }

  const pendingPaymentsByClient = {};
  for (const payment of payments) {
    if (!payment.clientId || !['pending', 'overdue'].includes(payment.status)) continue;
    pendingPaymentsByClient[payment.clientId] = (pendingPaymentsByClient[payment.clientId] || 0) + Number(payment.amount || 0);
  }

  return { pendingTasksByClient, openFollowupsByClient, pendingPaymentsByClient };
}

export async function GET() {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id,user_id,company,contact_name,email,plan,service,status,created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const list = clients || [];
    const clientIds = list.map((client) => client.id);
    const metaMap = await getClientMetaMap();
    const stats = clientIds.length ? await aggregateClientStats(clientIds) : {
      pendingTasksByClient: {},
      openFollowupsByClient: {},
      pendingPaymentsByClient: {},
    };

    const enriched = list.map((client) =>
      mapClientWithMeta(client, metaMap[client.id], {
        pendingTasks: stats.pendingTasksByClient[client.id] || 0,
        openFollowups: stats.openFollowupsByClient[client.id] || 0,
        pendingPaymentsAmount: stats.pendingPaymentsByClient[client.id] || 0,
      }),
    );

    return NextResponse.json({ clients: enriched });
  } catch (error) {
    console.error('GET /api/admin/clientes error:', error);
    return NextResponse.json({ error: 'No pudimos cargar clientes.' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const company = String(body.company || '').trim();
    const contactName = String(body.contact_name || body.contactName || company).trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();

    if (!company || !email || !password) {
      return NextResponse.json({ error: 'Empresa, email y password son obligatorios.' }, { status: 400 });
    }

    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
    if (existingUser) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese email.' }, { status: 400 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role: 'client',
        name: contactName || company,
        is_active: true,
      })
      .select('id')
      .single();

    if (userError || !newUser) throw userError || new Error('No se pudo crear usuario.');

    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        user_id: newUser.id,
        company,
        contact_name: contactName || company,
        email,
        plan: body.plan || 'Growth',
        service: body.service || 'Marketing Integral',
        status: body.status || 'active',
      })
      .select('id,user_id,company,contact_name,email,plan,service,status,created_at')
      .single();

    if (clientError || !newClient) throw clientError || new Error('No se pudo crear cliente.');

    await saveClientMeta(newClient.id, {
      startDate: body.startDate,
      endDate: body.endDate,
      durationDays: body.durationDays,
      serviceMode: normalizeMode(body.serviceMode),
      notes: body.notes || '',
      category: body.category || '',
      responsible: body.responsible || '',
    });

    await notifyEvent({
      type: 'nuevo_cliente',
      title: 'Nuevo cliente registrado',
      message: `${company} fue creado en el CRM.`,
      details: { empresa: company, email, plan: body.plan || 'Growth' },
    });

    const metaMap = await getClientMetaMap();
    return NextResponse.json({ success: true, client: mapClientWithMeta(newClient, metaMap[newClient.id]) });
  } catch (error) {
    console.error('POST /api/admin/clientes error:', error);
    return NextResponse.json({ error: 'No se pudo crear el cliente.' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'ID de cliente requerido.' }, { status: 400 });
    }

    const { data: existingClient, error: existingClientError } = await supabase
      .from('clients')
      .select('id,user_id,company,email')
      .eq('id', id)
      .single();

    if (existingClientError || !existingClient) {
      return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 });
    }

    const payload = {
      company: body.company || existingClient.company,
      contact_name: body.contact_name || body.contactName || existingClient.company,
      email: String(body.email || existingClient.email).toLowerCase(),
      plan: body.plan || 'Growth',
      service: body.service || 'Marketing Integral',
      status: body.status || 'active',
    };

    const { error: updateClientError } = await supabase.from('clients').update(payload).eq('id', id);
    if (updateClientError) throw updateClientError;

    if (existingClient.user_id && body.password) {
      const hash = bcrypt.hashSync(String(body.password), 10);
      const { error: passwordError } = await supabase
        .from('users')
        .update({
          password_hash: hash,
          name: payload.contact_name,
          email: payload.email,
        })
        .eq('id', existingClient.user_id);

      if (passwordError) throw passwordError;
    } else if (existingClient.user_id) {
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ name: payload.contact_name, email: payload.email })
        .eq('id', existingClient.user_id);
      if (userUpdateError) throw userUpdateError;
    }

    await saveClientMeta(id, {
      startDate: body.startDate,
      endDate: body.endDate,
      durationDays: body.durationDays,
      serviceMode: normalizeMode(body.serviceMode),
      notes: body.notes || '',
      category: body.category || '',
      responsible: body.responsible || '',
    });

    await notifyEvent({
      type: 'cliente_actualizado',
      title: 'Cliente actualizado',
      message: `Se actualizo la ficha de ${payload.company}.`,
      details: { empresa: payload.company, estado: payload.status },
    });

    const metaMap = await getClientMetaMap();
    return NextResponse.json({
      success: true,
      client: mapClientWithMeta({ id, ...payload, user_id: existingClient.user_id }, metaMap[id]),
    });
  } catch (error) {
    console.error('PUT /api/admin/clientes error:', error);
    return NextResponse.json({ error: 'No se pudo actualizar el cliente.' }, { status: 500 });
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

    const { data: existingClient, error: existingClientError } = await supabase
      .from('clients')
      .select('id,user_id,company')
      .eq('id', id)
      .single();

    if (existingClientError || !existingClient) {
      return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 });
    }

    await supabase.from('tasks').delete().eq('client_id', id);
    await supabase.from('deliveries').delete().eq('client_id', id);

    const { error: deleteClientError } = await supabase.from('clients').delete().eq('id', id);
    if (deleteClientError) throw deleteClientError;

    if (existingClient.user_id) {
      await supabase.from('users').update({ is_active: false }).eq('id', existingClient.user_id);
    }

    await updateStore('client_meta', {}, (map) => {
      delete map[id];
      return map;
    });
    await updateStore('client_followups', [], (items) => items.filter((item) => item.clientId !== id));
    await updateStore('client_payments', [], (items) => items.filter((item) => item.clientId !== id));
    await updateStore('financial_movements', [], (items) => items.filter((item) => item.clientId !== id));

    await notifyEvent({
      type: 'cliente_eliminado',
      title: 'Cliente eliminado',
      message: `Se elimino ${existingClient.company} del CRM.`,
      details: { empresa: existingClient.company },
      severity: 'warning',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/clientes error:', error);
    return NextResponse.json({ error: 'No se pudo eliminar el cliente.' }, { status: 500 });
  }
}
