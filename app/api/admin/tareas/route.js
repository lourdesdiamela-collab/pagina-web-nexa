import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { requireSession } from '@/lib/api-auth';
import { notifyEvent } from '@/lib/notifications';
import { syncTaskWithTrello } from '@/lib/trello';

const ADMIN_ROLES = ['admin', 'team'];
const TASK_STATUSES = ['pending', 'in_progress', 'review', 'completed'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

function normalizeStatus(value) {
  return TASK_STATUSES.includes(value) ? value : 'pending';
}

function normalizePriority(value) {
  return TASK_PRIORITIES.includes(value) ? value : 'medium';
}

function normalizeDueDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function GET(request) {
  const auth = await requireSession(['admin', 'team', 'client']);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search') || '';
    const clientIdParam = searchParams.get('clientId');
    const clientId = auth.session.role === 'client' ? auth.session.clientId : clientIdParam;

    let query = supabase
      .from('tasks')
      .select('id,client_id,title,description,status,priority,due_date,created_at,clients(company)')
      .order('created_at', { ascending: false });

    if (clientId) query = query.eq('client_id', clientId);
    if (status && TASK_STATUSES.includes(status)) query = query.eq('status', status);
    if (priority && TASK_PRIORITIES.includes(priority)) query = query.eq('priority', priority);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    const tasks = (data || []).map((task) => ({
      ...task,
      clientName: task.clients?.company || null,
      clients: undefined,
    }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('GET /api/admin/tareas error:', error);
    return NextResponse.json({ error: 'No pudimos cargar tareas.' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const clientId = String(body.clientId || '').trim();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();

    if (!clientId || !title) {
      return NextResponse.json({ error: 'Cliente y titulo son obligatorios.' }, { status: 400 });
    }

    const status = normalizeStatus(body.status);
    const priority = normalizePriority(body.priority);
    const dueDate = normalizeDueDate(body.dueDate);

    const { data: inserted, error } = await supabase
      .from('tasks')
      .insert({
        client_id: clientId,
        title,
        description,
        status,
        priority,
        due_date: dueDate,
      })
      .select('id,client_id,title,description,status,priority,due_date,created_at,clients(company)')
      .single();

    if (error || !inserted) throw error || new Error('No se pudo insertar tarea.');

    const task = {
      ...inserted,
      clientName: inserted.clients?.company || null,
      clients: undefined,
    };

    const trello = await syncTaskWithTrello(task, 'upsert');

    await notifyEvent({
      type: 'nueva_tarea',
      title: 'Nueva tarea creada',
      message: `${title} para ${task.clientName || 'cliente sin nombre'}.`,
      details: { cliente: task.clientName || task.client_id, estado: status, prioridad: priority },
    });

    return NextResponse.json({ success: true, task, trello });
  } catch (error) {
    console.error('POST /api/admin/tareas error:', error);
    return NextResponse.json({ error: 'No se pudo crear la tarea.' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json({ error: 'ID de tarea requerido.' }, { status: 400 });
    }

    const payload = {};
    if (body.title !== undefined) payload.title = String(body.title || '').trim();
    if (body.description !== undefined) payload.description = String(body.description || '').trim();
    if (body.status !== undefined) payload.status = normalizeStatus(body.status);
    if (body.priority !== undefined) payload.priority = normalizePriority(body.priority);
    if (body.dueDate !== undefined) payload.due_date = normalizeDueDate(body.dueDate);
    if (body.clientId !== undefined) payload.client_id = String(body.clientId || '').trim() || null;

    const { data: updated, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .select('id,client_id,title,description,status,priority,due_date,created_at,clients(company)')
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: 'Tarea no encontrada.' }, { status: 404 });
    }

    const task = {
      ...updated,
      clientName: updated.clients?.company || null,
      clients: undefined,
    };

    const trello = await syncTaskWithTrello(task, 'upsert');

    if (body.status && body.status !== updated.status) {
      await notifyEvent({
        type: 'cambio_estado_tarea',
        title: 'Tarea actualizada',
        message: `${task.title} cambio su estado.`,
        details: { estado: task.status, cliente: task.clientName || task.client_id },
      });
    }

    return NextResponse.json({ success: true, task, trello });
  } catch (error) {
    console.error('PUT /api/admin/tareas error:', error);
    return NextResponse.json({ error: 'No se pudo actualizar la tarea.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID de tarea requerido.' }, { status: 400 });
    }

    const { data: existing } = await supabase.from('tasks').select('id,title,client_id,clients(company)').eq('id', id).single();

    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;

    if (existing) {
      const task = {
        ...existing,
        clientName: existing.clients?.company || null,
      };
      await syncTaskWithTrello(task, 'delete');
      await notifyEvent({
        type: 'tarea_eliminada',
        title: 'Tarea eliminada',
        message: `Se elimino la tarea ${task.title}.`,
        details: { cliente: task.clientName || task.client_id },
        severity: 'warning',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/tareas error:', error);
    return NextResponse.json({ error: 'No se pudo eliminar la tarea.' }, { status: 500 });
  }
}
