import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { COOKIE_LAST, COOKIE_FIRST, readAttributionCookie } from '@/lib/attribution';

/*
 * /wa — puerta de entrada a WhatsApp (herramienta #8).
 *
 * Todos los botones de WhatsApp del sitio apuntan acá (ver lib/whatsapp.js).
 * Esta ruta:
 *   1. Registra el clic en la tabla WhatsAppClick: desde qué botón, en qué
 *      página y de qué campaña venía la persona (cookies de lib/attribution.js).
 *   2. Le agrega al mensaje un código corto, por ejemplo "(ref. W7K2QX)".
 *   3. Redirige a wa.me con el mensaje ya escrito.
 *
 * Cuando el mensaje llega a WhatsApp, el código "ref." se busca en
 * /aprende/admin/whatsapp y ahí se ve de qué anuncio vino esa consulta.
 *
 * Si la base no responde, se abre WhatsApp igual, sin código: nunca se traba
 * al visitante por un problema de registro.
 */

export const dynamic = 'force-dynamic';

const DEFAULT_TEXT = 'Hola NEXA! Quiero hacer una consulta.';
// Robots y previsualizadores de links: no se registran como clics.
const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|lighthouse|headless/i;
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I para que se lea sin errores

function nuevoCodigo() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let codigo = 'W';
  for (const b of bytes) codigo += REF_ALPHABET[b % REF_ALPHABET.length];
  return codigo;
}

function corto(valor, max) {
  if (!valor) return null;
  const texto = String(valor).trim();
  return texto ? texto.slice(0, max) : null;
}

function rutaDe(urlTexto) {
  try {
    const url = new URL(urlTexto);
    return `${url.pathname}${url.search}`.slice(0, 300);
  } catch {
    return null;
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const from = corto(url.searchParams.get('from'), 40) || 'sitio';
  const text = corto(url.searchParams.get('text'), 500) || DEFAULT_TEXT;
  const userAgent = request.headers.get('user-agent') || '';

  let mensaje = text;

  if (!BOT_UA.test(userAgent)) {
    const last = readAttributionCookie(request.cookies.get(COOKIE_LAST)?.value);
    const first = readAttributionCookie(request.cookies.get(COOKIE_FIRST)?.value);
    const ref = nuevoCodigo();
    try {
      await prisma.whatsAppClick.create({
        data: {
          ref,
          location: from,
          page: rutaDe(request.headers.get('referer') || ''),
          utmSource: last?.utm_source || null,
          utmMedium: last?.utm_medium || null,
          utmCampaign: last?.utm_campaign || null,
          utmContent: last?.utm_content || null,
          utmTerm: last?.utm_term || null,
          gclid: last?.gclid || null,
          fbclid: last?.fbclid || null,
          landingPage: first?.landing || last?.landing || null,
          referrer: first?.referrer || last?.referrer || null,
          firstTouch: first ? JSON.stringify(first).slice(0, 1000) : null,
        },
      });
      mensaje = `${text} (ref. ${ref})`;
    } catch (error) {
      console.error('[wa] No se pudo registrar el clic de WhatsApp:', error?.message || error);
    }
  }

  return NextResponse.redirect(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`,
    { status: 302, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  );
}
