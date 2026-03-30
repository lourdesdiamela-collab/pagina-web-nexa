import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwmwndjywojzrsjlsvey.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!serviceRoleKey) {
  console.error('Falta SUPABASE_SERVICE_ROLE_KEY. Definila para migrar datos locales a Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

function toIso(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function toMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

async function readJson(name, fallback) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback;
    throw error;
  }
}

function chunk(items, size = 200) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

async function upsertRows(table, rows, onConflict) {
  if (!rows.length) return 0;
  let processed = 0;
  for (const part of chunk(rows, 200)) {
    const { error } = await supabase.schema('crm').from(table).upsert(part, { onConflict });
    if (error) throw error;
    processed += part.length;
  }
  return processed;
}

async function run() {
  const [clientMetaMap, followups, payments, movements, leads, notifications, trelloMap, trelloLog] = await Promise.all([
    readJson('client_meta', {}),
    readJson('client_followups', []),
    readJson('client_payments', []),
    readJson('financial_movements', []),
    readJson('incoming_leads', []),
    readJson('notification_events', []),
    readJson('trello_task_map', {}),
    readJson('trello_sync_log', []),
  ]);

  const clientMetaRows = Object.entries(clientMetaMap || {})
    .filter(([clientId]) => Boolean(clientId))
    .map(([clientId, meta]) => ({
      client_id: clientId,
      start_date: toIso(meta?.startDate),
      end_date: toIso(meta?.endDate),
      duration_days: meta?.durationDays ? Number(meta.durationDays) : null,
      service_mode: meta?.serviceMode === 'temporary' ? 'temporary' : 'fixed',
      category: String(meta?.category || ''),
      responsible: String(meta?.responsible || ''),
      notes: String(meta?.notes || ''),
      updated_at: toIso(meta?.updatedAt) || new Date().toISOString(),
    }));

  const followupRows = (followups || [])
    .filter((item) => item?.id && item?.clientId)
    .map((item) => ({
      id: item.id,
      client_id: item.clientId,
      comment: String(item.comment || ''),
      next_step: String(item.nextStep || ''),
      reminder_at: toIso(item.reminderAt),
      status: item.status || 'abierto',
      owner: String(item.owner || ''),
      attachments: Array.isArray(item.attachments) ? item.attachments : [],
      created_at: toIso(item.createdAt) || new Date().toISOString(),
      updated_at: toIso(item.updatedAt) || toIso(item.createdAt) || new Date().toISOString(),
    }));

  const paymentRows = (payments || [])
    .filter((item) => item?.id)
    .map((item) => ({
      id: item.id,
      client_id: item.clientId || null,
      concept: String(item.concept || ''),
      amount: toMoney(item.amount),
      currency: String(item.currency || 'ARS'),
      status: item.status || 'pending',
      method: String(item.method || 'transferencia'),
      due_date: toIso(item.dueDate),
      paid_at: toIso(item.paidAt),
      reference: String(item.reference || ''),
      notes: String(item.notes || ''),
      attachment_url: String(item.attachmentUrl || ''),
      created_at: toIso(item.createdAt) || new Date().toISOString(),
      updated_at: toIso(item.updatedAt) || toIso(item.createdAt) || new Date().toISOString(),
    }));

  const movementRows = (movements || [])
    .filter((item) => item?.id)
    .map((item) => ({
      id: item.id,
      type: item.type === 'income' ? 'income' : 'expense',
      category: String(item.category || 'general'),
      concept: String(item.concept || ''),
      amount: toMoney(item.amount),
      date: toIso(item.date) || new Date().toISOString(),
      client_id: item.clientId || null,
      status: String(item.status || 'registrado'),
      notes: String(item.notes || ''),
      attachment_url: String(item.attachmentUrl || ''),
      created_at: toIso(item.createdAt) || new Date().toISOString(),
      updated_at: toIso(item.updatedAt) || toIso(item.createdAt) || new Date().toISOString(),
    }));

  const leadRows = (leads || [])
    .filter((item) => item?.id)
    .map((item) => ({
      id: item.id,
      name: String(item.name || ''),
      company: String(item.company || ''),
      email: String(item.email || ''),
      phone: String(item.phone || ''),
      service: String(item.service || ''),
      challenge: String(item.challenge || ''),
      created_at: toIso(item.createdAt) || new Date().toISOString(),
    }));

  const notificationRows = (notifications || [])
    .filter((item) => item?.id)
    .map((item) => ({
      id: item.id,
      type: String(item.type || 'general'),
      title: String(item.title || 'Evento CRM'),
      message: String(item.message || ''),
      severity: String(item.severity || 'info'),
      details: item.details && typeof item.details === 'object' ? item.details : {},
      email: item.email && typeof item.email === 'object' ? item.email : {},
      created_at: toIso(item.createdAt) || new Date().toISOString(),
    }));

  const trelloMapRows = Object.entries(trelloMap || {})
    .filter(([taskId, value]) => Boolean(taskId) && value?.cardId)
    .map(([taskId, value]) => ({
      task_id: taskId,
      card_id: String(value.cardId),
      list_id: value.listId || null,
      board_id: value.boardId || null,
      synced_at: toIso(value.syncedAt) || new Date().toISOString(),
    }));

  const trelloLogRows = (trelloLog || []).map((item) => ({
    task_id: item.taskId || null,
    action: String(item.action || 'upsert'),
    operation: item.operation || null,
    card_id: item.cardId || null,
    ok: Boolean(item.ok),
    reason: item.reason || null,
    created_at: toIso(item.createdAt) || new Date().toISOString(),
  }));

  const summary = {
    client_meta: await upsertRows('client_meta', clientMetaRows, 'client_id'),
    followups: await upsertRows('followups', followupRows, 'id'),
    payments: await upsertRows('payments', paymentRows, 'id'),
    financial_movements: await upsertRows('financial_movements', movementRows, 'id'),
    leads: await upsertRows('leads', leadRows, 'id'),
    notification_events: await upsertRows('notification_events', notificationRows, 'id'),
    trello_task_map: await upsertRows('trello_task_map', trelloMapRows, 'task_id'),
    trello_sync_log: 0,
  };

  if (trelloLogRows.length > 0) {
    for (const part of chunk(trelloLogRows, 200)) {
      const { error } = await supabase.schema('crm').from('trello_sync_log').insert(part);
      if (error) throw error;
      summary.trello_sync_log += part.length;
    }
  }

  console.log('Migracion completada:');
  for (const [key, value] of Object.entries(summary)) {
    console.log(`- ${key}: ${value}`);
  }
}

run().catch((error) => {
  console.error('Error migrando datos locales a Supabase:', error.message || error);
  process.exit(1);
});
