import { randomUUID } from 'crypto';
import { supabaseAdmin, isMissingTableError } from '@/lib/db';
import { readStore, updateStore } from '@/lib/store';

const STORES = {
  clientMeta: 'client_meta',
  followups: 'client_followups',
  payments: 'client_payments',
  movements: 'financial_movements',
  leads: 'incoming_leads',
};

const TABLES = {
  clientMeta: 'client_meta',
  followups: 'followups',
  payments: 'payments',
  movements: 'financial_movements',
  leads: 'leads',
};

const tableAvailability = new Map();

function nowIso() {
  return new Date().toISOString();
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function parseMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

function crmSchema() {
  return supabaseAdmin.schema('crm');
}

async function tableExists(key) {
  if (tableAvailability.has(key)) {
    return tableAvailability.get(key);
  }

  try {
    const { error } = await crmSchema().from(TABLES[key]).select('*', { count: 'exact', head: true });
    if (isMissingTableError(error)) {
      tableAvailability.set(key, false);
      return false;
    }
    if (error) throw error;
    tableAvailability.set(key, true);
    return true;
  } catch {
    tableAvailability.set(key, false);
    return false;
  }
}

function rowToClientMeta(row) {
  if (!row) return null;
  return {
    startDate: row.start_date,
    endDate: row.end_date,
    durationDays: row.duration_days,
    serviceMode: row.service_mode || 'fixed',
    isFixed: (row.service_mode || 'fixed') === 'fixed',
    notes: row.notes || '',
    category: row.category || '',
    responsible: row.responsible || '',
    updatedAt: row.updated_at || null,
  };
}

function rowToFollowup(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    comment: row.comment || '',
    nextStep: row.next_step || '',
    reminderAt: row.reminder_at,
    status: row.status || 'abierto',
    owner: row.owner || '',
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToPayment(row) {
  return {
    id: row.id,
    clientId: row.client_id,
    concept: row.concept || '',
    amount: parseMoney(row.amount),
    currency: row.currency || 'ARS',
    status: row.status || 'pending',
    method: row.method || 'transferencia',
    dueDate: row.due_date,
    paidAt: row.paid_at,
    reference: row.reference || '',
    notes: row.notes || '',
    attachmentUrl: row.attachment_url || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToMovement(row) {
  return {
    id: row.id,
    type: row.type === 'income' ? 'income' : 'expense',
    category: row.category || 'general',
    concept: row.concept || '',
    amount: parseMoney(row.amount),
    date: row.date,
    clientId: row.client_id,
    status: row.status || 'registrado',
    notes: row.notes || '',
    attachmentUrl: row.attachment_url || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function fallbackListFollowups(filters = {}) {
  const items = await readStore(STORES.followups, []);
  return items
    .filter((item) => {
      if (filters.clientId && item.clientId !== filters.clientId) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
}

async function fallbackListPayments(filters = {}) {
  const items = await readStore(STORES.payments, []);
  return items
    .filter((item) => {
      if (filters.clientId && item.clientId !== filters.clientId) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.search) {
        const haystack = `${item.concept} ${item.reference} ${item.notes}`.toLowerCase();
        if (!haystack.includes(String(filters.search).toLowerCase())) return false;
      }
      if (filters.from && item.dueDate && new Date(item.dueDate) < new Date(filters.from)) return false;
      if (filters.to && item.dueDate && new Date(item.dueDate) > new Date(filters.to)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function fallbackListMovements(filters = {}) {
  const items = await readStore(STORES.movements, []);
  return items
    .filter((item) => {
      if (filters.type && item.type !== filters.type) return false;
      if (filters.clientId && item.clientId !== filters.clientId) return false;
      if (filters.search) {
        const haystack = `${item.category} ${item.concept} ${item.notes}`.toLowerCase();
        if (!haystack.includes(String(filters.search).toLowerCase())) return false;
      }
      if (filters.from && item.date && new Date(item.date) < new Date(filters.from)) return false;
      if (filters.to && item.date && new Date(item.date) > new Date(filters.to)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
}

export async function getClientMetaMap() {
  if (await tableExists('clientMeta')) {
    const { data, error } = await crmSchema().from(TABLES.clientMeta).select('*');
    if (!error) {
      return Object.fromEntries((data || []).map((row) => [row.client_id, rowToClientMeta(row)]));
    }
  }
  return readStore(STORES.clientMeta, {});
}

export async function getClientMeta(clientId) {
  if (!clientId) return null;

  if (await tableExists('clientMeta')) {
    const { data, error } = await crmSchema().from(TABLES.clientMeta).select('*').eq('client_id', clientId).maybeSingle();
    if (!error) return rowToClientMeta(data);
  }

  const map = await readStore(STORES.clientMeta, {});
  return map[clientId] || null;
}

export async function saveClientMeta(clientId, patch) {
  if (!clientId) throw new Error('clientId requerido');

  const normalized = {
    startDate: normalizeDate(patch.startDate),
    endDate: normalizeDate(patch.endDate),
    durationDays: patch.durationDays ? Number(patch.durationDays) : null,
    serviceMode: patch.serviceMode || 'fixed',
    isFixed: patch.serviceMode === 'fixed',
    notes: patch.notes || '',
    category: patch.category || '',
    responsible: patch.responsible || '',
    updatedAt: nowIso(),
  };

  if (await tableExists('clientMeta')) {
    const payload = {
      client_id: clientId,
      start_date: normalized.startDate,
      end_date: normalized.endDate,
      duration_days: normalized.durationDays,
      service_mode: normalized.serviceMode,
      notes: normalized.notes,
      category: normalized.category,
      responsible: normalized.responsible,
    };

    const { error } = await crmSchema().from(TABLES.clientMeta).upsert(payload, { onConflict: 'client_id' });
    if (!error) return normalized;
  }

  await updateStore(STORES.clientMeta, {}, (map) => {
    const previous = map[clientId] || {};
    map[clientId] = { ...previous, ...normalized };
    return map;
  });

  return normalized;
}

export async function deleteClientMeta(clientId) {
  if (await tableExists('clientMeta')) {
    await crmSchema().from(TABLES.clientMeta).delete().eq('client_id', clientId);
    return;
  }

  await updateStore(STORES.clientMeta, {}, (map) => {
    delete map[clientId];
    return map;
  });
}

export async function listFollowups(filters = {}) {
  if (await tableExists('followups')) {
    let query = crmSchema().from(TABLES.followups).select('*').order('updated_at', { ascending: false });
    if (filters.clientId) query = query.eq('client_id', filters.clientId);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (!error) {
      return (data || []).map(rowToFollowup);
    }
  }

  return fallbackListFollowups(filters);
}

export async function saveFollowup(payload) {
  const item = {
    id: payload.id || randomUUID(),
    clientId: payload.clientId,
    comment: payload.comment || '',
    nextStep: payload.nextStep || '',
    reminderAt: normalizeDate(payload.reminderAt),
    status: payload.status || 'abierto',
    owner: payload.owner || '',
    attachments: Array.isArray(payload.attachments) ? payload.attachments.filter(Boolean) : [],
    updatedAt: nowIso(),
    createdAt: payload.createdAt || nowIso(),
  };

  if (await tableExists('followups')) {
    const dbPayload = {
      id: item.id,
      client_id: item.clientId,
      comment: item.comment,
      next_step: item.nextStep,
      reminder_at: item.reminderAt,
      status: item.status,
      owner: item.owner,
      attachments: item.attachments,
    };

    const { error } = await crmSchema().from(TABLES.followups).upsert(dbPayload, { onConflict: 'id' });
    if (!error) return item;
  }

  await updateStore(STORES.followups, [], (items) => {
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
      return items;
    }
    return [item, ...items];
  });

  return item;
}

export async function removeFollowup(id) {
  if (await tableExists('followups')) {
    const { error } = await crmSchema().from(TABLES.followups).delete().eq('id', id);
    if (!error) return;
  }

  await updateStore(STORES.followups, [], (items) => items.filter((entry) => entry.id !== id));
}

export async function listPayments(filters = {}) {
  if (await tableExists('payments')) {
    let query = crmSchema().from(TABLES.payments).select('*').order('created_at', { ascending: false });
    if (filters.clientId) query = query.eq('client_id', filters.clientId);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (!error) {
      return (data || [])
        .map(rowToPayment)
        .filter((item) => {
          if (filters.search) {
            const haystack = `${item.concept} ${item.reference} ${item.notes}`.toLowerCase();
            if (!haystack.includes(String(filters.search).toLowerCase())) return false;
          }
          if (filters.from && item.dueDate && new Date(item.dueDate) < new Date(filters.from)) return false;
          if (filters.to && item.dueDate && new Date(item.dueDate) > new Date(filters.to)) return false;
          return true;
        });
    }
  }

  return fallbackListPayments(filters);
}

export async function savePayment(payload) {
  const item = {
    id: payload.id || randomUUID(),
    clientId: payload.clientId || null,
    concept: payload.concept || '',
    amount: parseMoney(payload.amount),
    currency: payload.currency || 'ARS',
    status: payload.status || 'pending',
    method: payload.method || 'transferencia',
    dueDate: normalizeDate(payload.dueDate),
    paidAt: normalizeDate(payload.paidAt),
    reference: payload.reference || '',
    notes: payload.notes || '',
    attachmentUrl: payload.attachmentUrl || '',
    updatedAt: nowIso(),
    createdAt: payload.createdAt || nowIso(),
  };

  if (await tableExists('payments')) {
    const dbPayload = {
      id: item.id,
      client_id: item.clientId,
      concept: item.concept,
      amount: item.amount,
      currency: item.currency,
      status: item.status,
      method: item.method,
      due_date: item.dueDate,
      paid_at: item.paidAt,
      reference: item.reference,
      notes: item.notes,
      attachment_url: item.attachmentUrl,
    };

    const { error } = await crmSchema().from(TABLES.payments).upsert(dbPayload, { onConflict: 'id' });
    if (!error) return item;
  }

  await updateStore(STORES.payments, [], (items) => {
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
      return items;
    }
    return [item, ...items];
  });

  return item;
}

export async function removePayment(id) {
  if (await tableExists('payments')) {
    const { error } = await crmSchema().from(TABLES.payments).delete().eq('id', id);
    if (!error) return;
  }

  await updateStore(STORES.payments, [], (items) => items.filter((entry) => entry.id !== id));
}

export async function listMovements(filters = {}) {
  if (await tableExists('movements')) {
    let query = crmSchema().from(TABLES.movements).select('*').order('date', { ascending: false });
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.clientId) query = query.eq('client_id', filters.clientId);

    const { data, error } = await query;
    if (!error) {
      return (data || [])
        .map(rowToMovement)
        .filter((item) => {
          if (filters.search) {
            const haystack = `${item.category} ${item.concept} ${item.notes}`.toLowerCase();
            if (!haystack.includes(String(filters.search).toLowerCase())) return false;
          }
          if (filters.from && item.date && new Date(item.date) < new Date(filters.from)) return false;
          if (filters.to && item.date && new Date(item.date) > new Date(filters.to)) return false;
          return true;
        });
    }
  }

  return fallbackListMovements(filters);
}

export async function saveMovement(payload) {
  const item = {
    id: payload.id || randomUUID(),
    type: payload.type === 'income' ? 'income' : 'expense',
    category: payload.category || 'general',
    concept: payload.concept || '',
    amount: parseMoney(payload.amount),
    date: normalizeDate(payload.date) || nowIso(),
    clientId: payload.clientId || null,
    status: payload.status || 'registrado',
    notes: payload.notes || '',
    attachmentUrl: payload.attachmentUrl || '',
    updatedAt: nowIso(),
    createdAt: payload.createdAt || nowIso(),
  };

  if (await tableExists('movements')) {
    const dbPayload = {
      id: item.id,
      type: item.type,
      category: item.category,
      concept: item.concept,
      amount: item.amount,
      date: item.date,
      client_id: item.clientId,
      status: item.status,
      notes: item.notes,
      attachment_url: item.attachmentUrl,
    };

    const { error } = await crmSchema().from(TABLES.movements).upsert(dbPayload, { onConflict: 'id' });
    if (!error) return item;
  }

  await updateStore(STORES.movements, [], (items) => {
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
      return items;
    }
    return [item, ...items];
  });

  return item;
}

export async function removeMovement(id) {
  if (await tableExists('movements')) {
    const { error } = await crmSchema().from(TABLES.movements).delete().eq('id', id);
    if (!error) return;
  }

  await updateStore(STORES.movements, [], (items) => items.filter((entry) => entry.id !== id));
}

export async function saveLead(payload) {
  const lead = {
    id: payload.id || randomUUID(),
    name: payload.name || '',
    company: payload.company || '',
    email: payload.email || '',
    phone: payload.phone || '',
    service: payload.service || '',
    challenge: payload.challenge || '',
    createdAt: payload.createdAt || nowIso(),
  };

  if (await tableExists('leads')) {
    const dbPayload = {
      id: lead.id,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      challenge: lead.challenge,
      created_at: lead.createdAt,
    };

    const { error } = await crmSchema().from(TABLES.leads).insert(dbPayload);
    if (!error) return lead;
  }

  await updateStore(STORES.leads, [], (items) => [lead, ...items].slice(0, 1000));
  return lead;
}

export function computeFinancialSummary(payments, movements) {
  const incomeFromPayments = payments
    .filter((payment) => ['paid', 'partial'].includes(payment.status))
    .reduce((total, payment) => total + parseMoney(payment.amount), 0);

  const pendingPayments = payments
    .filter((payment) => ['pending', 'overdue'].includes(payment.status))
    .reduce((total, payment) => total + parseMoney(payment.amount), 0);

  const expenseTotal = movements
    .filter((movement) => movement.type === 'expense')
    .reduce((total, movement) => total + parseMoney(movement.amount), 0);

  const extraIncome = movements
    .filter((movement) => movement.type === 'income')
    .reduce((total, movement) => total + parseMoney(movement.amount), 0);

  const totalIncome = incomeFromPayments + extraIncome;
  const balance = totalIncome - expenseTotal;

  const byClient = {};
  for (const payment of payments) {
    if (!['paid', 'partial'].includes(payment.status)) continue;
    const key = payment.clientId || 'sin_cliente';
    byClient[key] = (byClient[key] || 0) + parseMoney(payment.amount);
  }

  const expensesByCategory = {};
  for (const movement of movements) {
    if (movement.type !== 'expense') continue;
    const key = movement.category || 'general';
    expensesByCategory[key] = (expensesByCategory[key] || 0) + parseMoney(movement.amount);
  }

  return {
    totalIncome,
    totalExpenses: expenseTotal,
    balance,
    pendingPayments,
    paidPayments: incomeFromPayments,
    incomeByClient: byClient,
    expensesByCategory,
  };
}

export function buildMonthlyHistory(payments, movements) {
  const buckets = {};
  const pushValue = (dateValue, key, amount) => {
    if (!dateValue) return;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return;
    const bucket = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!buckets[bucket]) buckets[bucket] = { month: bucket, income: 0, expenses: 0 };
    buckets[bucket][key] += parseMoney(amount);
  };

  for (const payment of payments) {
    if (!['paid', 'partial'].includes(payment.status)) continue;
    pushValue(payment.paidAt || payment.updatedAt || payment.createdAt, 'income', payment.amount);
  }

  for (const movement of movements) {
    if (movement.type === 'income') {
      pushValue(movement.date, 'income', movement.amount);
      continue;
    }
    pushValue(movement.date, 'expenses', movement.amount);
  }

  return Object.values(buckets).sort((a, b) => a.month.localeCompare(b.month));
}
