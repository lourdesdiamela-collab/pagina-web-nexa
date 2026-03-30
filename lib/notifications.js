import { randomUUID } from 'crypto';
import { readStore, updateStore } from '@/lib/store';

const STORE_NAME = 'notification_events';

function nowIso() {
  return new Date().toISOString();
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

async function sendWithResend(event) {
  const { destination, from, resendApiKey } = getNotificationConfig();
  if (!destination || !resendApiKey) {
    return { sent: false, reason: 'missing_credentials' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
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

  const email = await sendWithResend(event);
  event.email = email;

  await updateStore(STORE_NAME, [], (events) => [event, ...events].slice(0, 500));
  return event;
}
