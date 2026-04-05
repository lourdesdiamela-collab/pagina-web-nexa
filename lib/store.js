import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const locks = new Map();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function resolveDefault(defaultValue) {
  if (typeof defaultValue === 'function') {
    return defaultValue();
  }
  return clone(defaultValue);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

async function writeStore(name, value) {
  await ensureDataDir();
  const target = filePath(name);
  const temp = `${target}.${Date.now()}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(temp, target);
  return value;
}

export async function readStore(name, defaultValue) {
  await ensureDataDir();
  const target = filePath(name);

  try {
    const raw = await fs.readFile(target, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
    const value = resolveDefault(defaultValue);
    await writeStore(name, value);
    return value;
  }
}

function withLock(name, task) {
  const previous = locks.get(name) || Promise.resolve();
  const next = previous
    .catch(() => undefined)
    .then(task)
    .finally(() => {
      if (locks.get(name) === next) {
        locks.delete(name);
      }
    });
  locks.set(name, next);
  return next;
}

export async function updateStore(name, defaultValue, updater) {
  return withLock(name, async () => {
    const current = await readStore(name, defaultValue);
    const next = await updater(clone(current));
    return writeStore(name, next);
  });
}

export async function listStore(name) {
  return readStore(name, []);
}

export async function upsertInStore(name, item) {
  if (!item?.id) {
    throw new Error('El item requiere id.');
  }

  return updateStore(name, [], (items) => {
    const index = items.findIndex((entry) => entry.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
      return items;
    }
    return [item, ...items];
  });
}

export async function removeFromStore(name, id) {
  return updateStore(name, [], (items) => items.filter((entry) => entry.id !== id));
}
