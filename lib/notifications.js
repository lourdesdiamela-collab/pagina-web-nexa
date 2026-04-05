import { randomUUID } from 'crypto';
import { supabaseAdmin, isMissingTableError } from '@/lib/db';
import { readStore, updateStore } from '@/lib/store';

const STORE_NAME = 'notification_events';
const TABLE_NAME = 'notification_events';

const tableAvailability = new Map();
const notificationThrottle = new Map();

function nowIso() {
  return new Date().toISOString();
}

function throttleWindowMs() {
  const seconds = Number(process.env.NEXA_NOTIFICATION_THROTTLE_SECONDS || 45);
  if (!Number.isFinite(seconds) || seconds < 0) return 45_000;
  return seconds * 1000;
}

function eventKey(event) {
  const type = String(event?.type || 'general').trim().toLowerCase();
  const title = String(event?.title || '').trim().toLowerCase();
  const message = String(event?.message || '').trim().toLowerCase();
  return `${type}|${title}|${message}`;
}

function isThrottled(event) {
  const key = eventKey(event);
  const now = Date.now();
  const previous = notificationThrottle.get(key);
  if (previous && now - previous < throttleWindowMs()) {
    return true;
  }
  notificationThrottle.set(key, now);
  return false;
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function getNotificationConfig() {
  return {
    destination: process.env.NEXA_NOTIFICATION_EMAIL || '',
    from: process.env.NEXA_FROM_EMAIL || 'NEXA CRM <onboarding@resend.dev>',
    resendApiKey: process.env.RESEND_API_KEY || '',
  };
}

export function getNotificationStatus() {
  const config = getNotificationConfig();
  return {
    configured: Boolean(config.destination && config.resendApiKey),
    destination: config.destination || null,
    provider: config.resendApiKey ? 'resend' : 'none',
  };
}

function crmSchema() {
  return supabaseAdmin.schema('crm');
}

function mapRowToEvent(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type || 'general',
    title: row.title || 'Evento CRM',
    message: row.message || '',
    severity: row.severity || 'info',
    details: row.details && typeof row.details === 'object' ? row.details : {},
    email: row.email && typeof row.email === 'object' ? row.email : {},
    createdAt: row.created_at || nowIso(),
  };
}

async function tableExists() {
  if (tableAvailability.has(TABLE_NAME)) {
    return tableAvailability.get(TABLE_NAME);
  }

  try {
    const { error } = await crmSchema().from(TABLE_NAME).select('*', { head: true, count: 'exact' });
    if (isMissingTableError(error)) {
      tableAvailability.set(TABLE_NAME, false);
      return false;
    }
    if (error) throw error;
    tableAvailability.set(TABLE_NAME, true);
    return true;
  } catch {
    tableAvailability.set(TABLE_NAME, false);
    return false;
  }
}

function renderEmailBody(event) {
  const detailRows = Object.entries(event.details || {})
    .map(([key, value]) => {
      if (value === undefined || value === null || value === '') return null;
      return `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</li>`;
    })
    .filter(Boolean)
    .join('');

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px 0;">${escapeHtml(event.title)}</h2>
      <p style="margin:0 0 16px 0;">${escapeHtml(event.message || '')}</p>
      ${detailRows ? `<ul style="padding-left:18px;margin:0 0 16px 0;">${detailRows}</ul>` : ''}
      <p style="font-size:12px;color:#6b7280;margin:0;">Evento: ${escapeHtml(event.type)} | ${escapeHtml(event.createdAt)}</p>
    </div>
  `;
}

async function insertEvent(event) {
  const exists = await tableExists();
  if (!exists) return false;

  const { error } = await crmSchema().from(TABLE_NAME).insert({
    id: event.id,
    type: event.type,
    title: event.title,
    message: event.message,
    severity: event.severity,
    details: event.details || {},
    email: event.email || {},
    created_at: event.createdAt,
  });

  return !error;
}

async function sendWithResend(event) {
  const { destination, from, resendApiKey } = getNotificationConfig();
  if (!destination || !resendApiKey) {
    return { sent: false, reason: 'missing_credentials' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: destination,
      subject: `[NEXA CRM] ${event.title}`,
      html: renderEmailBody(event),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { sent: false, reason: `resend_error:${response.status}`, details: body.slice(0, 300) };
  }

  return { sent: true };
}

export async function listNotificationEvents(limit = 20) {
  if (await tableExists()) {
    const { data, error } = await crmSchema().from(TABLE_NAME).select('*').order('created_at', { ascending: false }).limit(limit);
    if (!error) {
      return (data || []).map(mapRowToEvent).filter(Boolean);
    }
  }

  const events = await readStore(STORE_NAME, []);
  return events.slice(0, limit);
}

export async function notifyEvent(input) {
  const event = {
    id: randomUUID(),
    type: input.type || 'general',
    title: input.title || 'Evento CRM',
    message: input.message || '',
    severity: input.severity || 'info',
    details: input.details || {},
    createdAt: nowIso(),
    email: { sent: false, reason: 'pending' },
  };

  if (isThrottled(event)) {
    event.email = { sent: false, reason: 'throttled' };
  } else {
    event.email = await sendWithResend(event);
  }

  const savedInDb = await insertEvent(event);
  if (!savedInDb) {
    await updateStore(STORE_NAME, [], (events) => [event, ...events].slice(0, 500));
  }

  return event;
}
