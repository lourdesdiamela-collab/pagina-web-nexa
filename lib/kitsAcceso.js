import crypto from 'crypto';

/*
 * Enlaces firmados para entregar un kit comprado, sin base de datos.
 *
 * El enlace lleva: referencia del pedido, kit y vencimiento, firmados con
 * HMAC-SHA256. Nadie puede armar uno a mano ni cambiarle el vencimiento sin
 * la clave. Clave: KITS_LINK_SECRET, o NEXTAUTH_SECRET si no está.
 */

const DIAS_VIGENCIA = 60;

function clave() {
  const s = process.env.KITS_LINK_SECRET || process.env.NEXTAUTH_SECRET;
  if (s) return s;
  // Solo en una máquina de desarrollo: en producción es un error de configuración.
  if (process.env.NODE_ENV !== 'production') return 'clave-solo-para-desarrollo';
  throw new Error('Falta KITS_LINK_SECRET o NEXTAUTH_SECRET para firmar los enlaces de los kits.');
}

function firmar(parteDatos) {
  return crypto.createHmac('sha256', clave()).update(parteDatos).digest('base64url').slice(0, 43);
}

export function crearTokenKit({ referencia, kit, dias = DIAS_VIGENCIA }) {
  const datos = Buffer.from(JSON.stringify({ r: referencia, k: kit, e: Date.now() + dias * 86400000 })).toString('base64url');
  return `${datos}.${firmar(datos)}`;
}

export function leerTokenKit(token) {
  try {
    const [datos, firma] = String(token || '').split('.');
    if (!datos || !firma) return null;
    const esperada = firmar(datos);
    const a = Buffer.from(esperada);
    const b = Buffer.from(firma);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const p = JSON.parse(Buffer.from(datos, 'base64url').toString('utf8'));
    if (!p?.r || !p?.k || !Number.isFinite(p.e) || p.e < Date.now()) return null;
    return { referencia: String(p.r), kit: String(p.k), vence: p.e };
  } catch {
    return null;
  }
}

export function generarReferenciaKit() {
  return `KIT-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

export function urlDescargaKit(token) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/^https?:\/\/nexagrowth\.com\.ar/i, 'https://www.nexagrowth.com.ar').replace(/\/+$/, '');
  return `${base}/kits/descargar/${token}`;
}
