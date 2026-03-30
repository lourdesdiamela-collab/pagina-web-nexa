import { randomUUID } from 'crypto';
import { readStore, updateStore } from '@/lib/store';

const STORES = {
  clientMeta: 'client_meta',
  followups: 'client_followups',
  payments: 'client_payments',
  movements: 'financial_movements',
  leads: 'incoming_leads',
};

function nowIso() {
  return new Date().toISOString();
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export async function getClientMetaMap() {
  return readStore(STORES.clientMeta, {});
}

export async function getClientMeta(clientId) {
  const map = await getClientMetaMap();
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

  return updateStore(STORES.clientMeta, {}, (map) => {
    const previous = map[clientId] || {};
    map[clientId] = { ...previous, ...normalized };
    return map;
  });
}

export async function deleteClientMeta(clientId) {
  return updateStore(STORES.clientMeta, {}, (map) => {
    delete map[clientId];
    return map;
  });
}

export async function listFollowups(filters = {}) {
  const items = await readStore(STORES.followups, []);
  return items
    .filter((item) => {
      if (filters.clientId && item.clientId !== filters.clientId) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
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
  };

  if (!payload.id) {
    item.createdAt = item.updatedAt;
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
  await updateStore(STORES.followups, [], (items) => items.filter((entry) => entry.id !== id));
}

function parseMoney(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
}

export async function listPayments(filters = {}) {
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
  };

  if (!payload.id) item.createdAt = item.updatedAt;

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
  await updateStore(STORES.payments, [], (items) => items.filter((entry) => entry.id !== id));
}

export async function listMovements(filters = {}) {
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
  };

  if (!payload.id) item.createdAt = item.updatedAt;

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
  await updateStore(STORES.movements, [], (items) => items.filter((entry) => entry.id !== id));
}

export async function saveLead(payload) {
  const lead = {
    id: randomUUID(),
    name: payload.name || '',
    company: payload.company || '',
    email: payload.email || '',
    phone: payload.phone || '',
    service: payload.service || '',
    challenge: payload.challenge || '',
    createdAt: nowIso(),
  };

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
