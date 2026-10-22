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

// En Vercel, x-real-ip la pone la propia plataforma (no la puede inventar el
// visitante); x-forwarded-for queda como respaldo para otros hostings.
export function ipDe(request) {
  const real = (request.headers.get('x-real-ip') || '').trim();
  if (real) return real;
  const xff = request.headers.get('x-forwarded-for') || '';
  return xff.split(',')[0].trim() || 'desconocida';
}

// Email de UN solo destinatario: formato válido y sin separadores de lista
// (con "a@x.com, b@y.com" nodemailer le mandaría el mail a los dos).
export function emailUnico(valor) {
  const email = texto(valor, 200).toLowerCase();
  if (!EMAIL_VALIDO.test(email) || /[,;]/.test(email)) return null;
  return email;
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

// JSON para meter dentro de <script type="application/ld+json">. Se escapa
// "<" para que un texto con "</script>" (por ejemplo, el título de un
// producto) no pueda cerrar la etiqueta e inyectar HTML en la página.
export function jsonLdSeguro(datos) {
  return JSON.stringify(datos).replace(/</g, '\\u003c');
}

/*
 * Hosts del CRM desde los que se aceptan links en los mails que pide el CRM
 * (formulario de inicio, entregas). El CRM puede estar en su dominio propio o
 * en el de Vercel; CRM_LINK_HOSTS (separados por coma) suma otros.
 */
export function hostDelCrmPermitido(host) {
  const permitidos = new Set(['crm.nexagrowth.com.ar', 'nexa-crm-rust.vercel.app']);
  for (const v of [process.env.NEXT_PUBLIC_CRM_URL, ...(process.env.CRM_LINK_HOSTS || '').split(',')]) {
    const s = String(v || '').trim();
    if (!s) continue;
    try {
      permitidos.add(new URL(s.includes('://') ? s : `https://${s}`).host);
    } catch {
      // valor invalido: se ignora
    }
  }
  return permitidos.has(String(host || '').toLowerCase());
}
