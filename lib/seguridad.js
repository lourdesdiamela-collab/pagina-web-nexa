/*
 * Ayudas de seguridad para las rutas públicas del sitio (formularios).
 *
 * - escapar(): lo que escribe un visitante se mete en los mails que manda el
 *   sitio desde la cuenta de NEXA. Sin escapar, alguien podría poner HTML
 *   (links, botones falsos) en el campo "nombre" y usar el formulario para
 *   mandar mails engañosos a cualquier dirección en nombre de NEXA.
 * - texto(): recorta y limpia un campo para que no lleguen textos gigantes.
 * - permitidoPorIp(): límite simple de envíos por IP, para que nadie use los
 *   formularios para mandar mails en cantidad. Es por instancia del servidor:
 *   alcanza para frenar abusos obvios.
 */

export function escapar(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function texto(valor, maximo = 200) {
  return String(valor ?? '').trim().slice(0, maximo);
}

export const EMAIL_VALIDO = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/;

export function ipDe(request) {
  const xff = request.headers.get('x-forwarded-for') || '';
  return xff.split(',')[0].trim() || request.headers.get('x-real-ip') || 'desconocida';
}

const registros = new Map();

export function permitidoPorIp(request, clave, { maximo = 5, ventanaMs = 10 * 60 * 1000 } = {}) {
  const id = `${clave}:${ipDe(request)}`;
  const ahora = Date.now();
  const previo = registros.get(id);
  if (registros.size > 5000) {
    for (const [k, v] of registros) if (ahora - v.desde > ventanaMs) registros.delete(k);
  }
  if (!previo || ahora - previo.desde > ventanaMs) {
    registros.set(id, { desde: ahora, cantidad: 1 });
    return true;
  }
  previo.cantidad += 1;
  return previo.cantidad <= maximo;
}
