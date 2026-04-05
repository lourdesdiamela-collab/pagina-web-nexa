import { supabaseAdmin, isMissingTableError } from '@/lib/db';
import { readStore, updateStore } from '@/lib/store';

const MAP_STORE = 'trello_task_map';
const LOG_STORE = 'trello_sync_log';

const TABLES = {
  map: 'trello_task_map',
  log: 'trello_sync_log',
};

const tableAvailability = new Map();

function crmSchema() {
  return supabaseAdmin.schema('crm');
}

async function tableExists(key) {
  if (tableAvailability.has(key)) {
    return tableAvailability.get(key);
  }

  try {
    const { error } = await crmSchema().from(TABLES[key]).select('*', { head: true, count: 'exact' });
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

function mapDbSyncLog(row) {
  return {
    id: row.id,
    taskId: row.task_id,
    action: row.action,
    operation: row.operation,
    cardId: row.card_id,
    ok: Boolean(row.ok),
    reason: row.reason || null,
    createdAt: row.created_at,
  };
}

function mapDbTaskMap(row) {
  if (!row) return null;
  return {
    taskId: row.task_id,
    cardId: row.card_id,
    listId: row.list_id,
    boardId: row.board_id,
    syncedAt: row.synced_at,
  };
}

function nowIso() {
  return new Date().toISOString();
}

export function getTrelloConfig() {
  return {
    apiKey: process.env.TRELLO_API_KEY || '',
    token: process.env.TRELLO_TOKEN || '',
    boardId: process.env.TRELLO_BOARD_ID || '',
    defaultListId: process.env.TRELLO_DEFAULT_LIST_ID || '',
    pendingListId: process.env.TRELLO_PENDING_LIST_ID || '',
    inProgressListId: process.env.TRELLO_IN_PROGRESS_LIST_ID || '',
    reviewListId: process.env.TRELLO_REVIEW_LIST_ID || '',
    doneListId: process.env.TRELLO_DONE_LIST_ID || '',
  };
}

export function isTrelloConfigured() {
  const cfg = getTrelloConfig();
  return Boolean(cfg.apiKey && cfg.token && cfg.defaultListId);
}

function resolveListByStatus(status, cfg) {
  if (status === 'in_progress' && cfg.inProgressListId) return cfg.inProgressListId;
  if (status === 'review' && cfg.reviewListId) return cfg.reviewListId;
  if (status === 'completed' && cfg.doneListId) return cfg.doneListId;
  if (status === 'pending' && cfg.pendingListId) return cfg.pendingListId;
  return cfg.defaultListId;
}

function normalizeDueDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

async function trelloRequest(path, { method = 'GET', body } = {}) {
  const cfg = getTrelloConfig();
  const separator = path.includes('?') ? '&' : '?';
  const url = `https://api.trello.com/1${path}${separator}key=${cfg.apiKey}&token=${cfg.token}`;

  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`trello_${response.status}:${text.slice(0, 300)}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function getTaskMap(taskId) {
  if (await tableExists('map')) {
    const { data, error } = await crmSchema().from(TABLES.map).select('*').eq('task_id', taskId).maybeSingle();
    if (!error) return mapDbTaskMap(data);
  }

  const map = await readStore(MAP_STORE, {});
  const entry = map[taskId];
  if (!entry) return null;
  return {
    taskId,
    cardId: entry.cardId || null,
    listId: entry.listId || null,
    boardId: entry.boardId || null,
    syncedAt: entry.syncedAt || null,
  };
}

async function saveTaskMap(entry) {
  if (await tableExists('map')) {
    const { error } = await crmSchema().from(TABLES.map).upsert(
      {
        task_id: entry.taskId,
        card_id: entry.cardId,
        list_id: entry.listId || null,
        board_id: entry.boardId || null,
        synced_at: entry.syncedAt || nowIso(),
      },
      { onConflict: 'task_id' },
    );
    if (!error) return;
  }

  await updateStore(MAP_STORE, {}, (items) => ({
    ...items,
    [entry.taskId]: {
      cardId: entry.cardId,
      listId: entry.listId || null,
      boardId: entry.boardId || null,
      syncedAt: entry.syncedAt || nowIso(),
    },
  }));
}

async function deleteTaskMap(taskId) {
  if (await tableExists('map')) {
    const { error } = await crmSchema().from(TABLES.map).delete().eq('task_id', taskId);
    if (!error) return;
  }

  await updateStore(MAP_STORE, {}, (items) => {
    const next = { ...items };
    delete next[taskId];
    return next;
  });
}

async function appendSyncLog(entry) {
  const payload = {
    taskId: entry.taskId || null,
    action: entry.action || 'upsert',
    operation: entry.operation || null,
    cardId: entry.cardId || null,
    ok: Boolean(entry.ok),
    reason: entry.reason || null,
    createdAt: entry.createdAt || nowIso(),
  };

  if (await tableExists('log')) {
    const { error } = await crmSchema().from(TABLES.log).insert({
      task_id: payload.taskId,
      action: payload.action,
      operation: payload.operation,
      card_id: payload.cardId,
      ok: payload.ok,
      reason: payload.reason,
      created_at: payload.createdAt,
    });
    if (!error) return;
  }

  await updateStore(LOG_STORE, [], (items) => [payload, ...items].slice(0, 400));
}

export async function listTrelloSyncLog(limit = 30) {
  if (await tableExists('log')) {
    const { data, error } = await crmSchema().from(TABLES.log).select('*').order('created_at', { ascending: false }).limit(limit);
    if (!error) {
      return (data || []).map(mapDbSyncLog);
    }
  }

  const items = await readStore(LOG_STORE, []);
  return items.slice(0, limit);
}

export async function getTrelloStatus() {
  const configured = isTrelloConfigured();
  if (!configured) {
    return { configured: false, reachable: false, board: null };
  }

  try {
    const cfg = getTrelloConfig();
    const board = cfg.boardId ? await trelloRequest(`/boards/${cfg.boardId}?fields=id,name,url`) : null;
    return { configured: true, reachable: true, board };
  } catch (error) {
    return { configured: true, reachable: false, board: null, error: error.message };
  }
}

export async function syncTaskWithTrello(task, action = 'upsert') {
  const cfg = getTrelloConfig();
  const configured = isTrelloConfigured();

  const logBase = {
    taskId: task?.id || null,
    action,
    createdAt: nowIso(),
  };

  if (!configured) {
    const result = { configured: false, synced: false, reason: 'missing_credentials' };
    await appendSyncLog({ ...logBase, ok: false, reason: result.reason });
    return result;
  }

  if (!task?.id) {
    const result = { configured: true, synced: false, reason: 'missing_task_id' };
    await appendSyncLog({ ...logBase, ok: false, reason: result.reason });
    return result;
  }

  try {
    const existing = await getTaskMap(task.id);

    if (action === 'delete') {
      if (existing?.cardId) {
        await trelloRequest(`/cards/${existing.cardId}`, { method: 'DELETE' });
      }
      await deleteTaskMap(task.id);
      await appendSyncLog({ ...logBase, ok: true, operation: 'delete', cardId: existing?.cardId || null });
      return { configured: true, synced: true };
    }

    const idList = resolveListByStatus(task.status, cfg);
    const due = normalizeDueDate(task.due_date || task.dueDate);
    const description = [
      task.description || '',
      '',
      `Estado CRM: ${task.status || 'pending'}`,
      `Prioridad CRM: ${task.priority || 'medium'}`,
      task.clientName ? `Cliente: ${task.clientName}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    if (existing?.cardId) {
      await trelloRequest(`/cards/${existing.cardId}`, {
        method: 'PUT',
        body: {
          name: task.title,
          desc: description,
          idList,
          due,
        },
      });

      await saveTaskMap({
        taskId: task.id,
        cardId: existing.cardId,
        listId: idList,
        boardId: existing.boardId || cfg.boardId || null,
        syncedAt: nowIso(),
      });

      await appendSyncLog({ ...logBase, ok: true, operation: 'update', cardId: existing.cardId });
      return { configured: true, synced: true, cardId: existing.cardId };
    }

    const created = await trelloRequest('/cards', {
      method: 'POST',
      body: {
        idList,
        name: task.title,
        desc: description,
        due,
      },
    });

    await saveTaskMap({
      taskId: task.id,
      cardId: created.id,
      listId: idList,
      boardId: created.idBoard || cfg.boardId || null,
      syncedAt: nowIso(),
    });

    await appendSyncLog({ ...logBase, ok: true, operation: 'create', cardId: created.id });
    return { configured: true, synced: true, cardId: created.id };
  } catch (error) {
    await appendSyncLog({ ...logBase, ok: false, reason: error.message });
    return { configured: true, synced: false, reason: error.message };
  }
}
