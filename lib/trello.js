import { readStore, updateStore } from '@/lib/store';

const MAP_STORE = 'trello_task_map';
const LOG_STORE = 'trello_sync_log';

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

async function appendSyncLog(entry) {
  await updateStore(LOG_STORE, [], (items) => [entry, ...items].slice(0, 400));
}

export async function listTrelloSyncLog(limit = 30) {
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
    createdAt: new Date().toISOString(),
  };

  if (!configured) {
    const result = { configured: false, synced: false, reason: 'missing_credentials' };
    await appendSyncLog({ ...logBase, ok: false, reason: result.reason });
    return result;
  }

  try {
    return await updateStore(MAP_STORE, {}, async (mapping) => {
      const existing = mapping[task.id] || null;

      if (action === 'delete') {
        if (existing?.cardId) {
          await trelloRequest(`/cards/${existing.cardId}`, { method: 'DELETE' });
        }
        delete mapping[task.id];
        await appendSyncLog({ ...logBase, ok: true, cardId: existing?.cardId || null });
        return mapping;
      }

      const idList = resolveListByStatus(task.status, cfg);
      const due = normalizeDueDate(task.due_date);
      const description = [
        task.description || '',
        '',
        `Estado CRM: ${task.status || 'pending'}`,
        `Prioridad CRM: ${task.priority || 'medium'}`,
        task.clientName ? `Cliente: ${task.clientName}` : '',
      ].filter(Boolean).join('\n');

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
        mapping[task.id] = {
          ...existing,
          listId: idList,
          syncedAt: new Date().toISOString(),
        };
        await appendSyncLog({ ...logBase, ok: true, cardId: existing.cardId, operation: 'update' });
        return mapping;
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

      mapping[task.id] = {
        cardId: created.id,
        listId: idList,
        boardId: created.idBoard || cfg.boardId || null,
        syncedAt: new Date().toISOString(),
      };

      await appendSyncLog({ ...logBase, ok: true, cardId: created.id, operation: 'create' });
      return mapping;
    }).then(() => ({ configured: true, synced: true }));
  } catch (error) {
    await appendSyncLog({ ...logBase, ok: false, reason: error.message });
    return { configured: true, synced: false, reason: error.message };
  }
}
