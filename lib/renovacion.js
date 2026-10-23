import crypto from 'crypto';

/*
 * Links de renovación FIRMADOS (herramienta #9, mails de cobranza del CRM).
 *
 * Antes alcanzaba con agregar `?renueva=<cualquier texto de 20 a 40 letras y
 * números>` al link del checkout para que el primer pago se cobrara como
 * renovación, o sea SIN la Puesta en marcha ($149.900). Ahora el link tiene
 * que venir firmado por el CRM con el secreto compartido que ya existe
 * (SITE_TO_CRM_SECRET, el mismo de lib/crmAuth.js y lib/crmSync.js).
 *
 * ── FORMATO EXACTO (para implementar del lado del CRM) ─────────────────────
 *
 *   Parámetros del link (además de `plan` y, si se quiere, `email`):
 *     renueva     id del plan en el CRM (cuid, 20 a 40 letras/números)
 *     renuevaExp  vencimiento del link, en SEGUNDOS unix (entero)
 *     renuevaSig  HMAC-SHA256 en hexadecimal (minúsculas, 64 caracteres)
 *
 *   Mensaje firmado (texto UTF-8, separado por "|"):
 *     renovacion|<renueva>|<plan>|<renuevaExp>
 *
 *   donde <plan> es el id de plan del sitio que va en `?plan=` (ej.
 *   "contenido-growth"). Clave del HMAC: SITE_TO_CRM_SECRET.
 *
 *   Ejemplo (Node):
 *     const exp = Math.floor(Date.now() / 1000) + 15 * 24 * 3600;
 *     const sig = crypto.createHmac('sha256', SITE_TO_CRM_SECRET)
 *       .update(`renovacion|${renueva}|${plan}|${exp}`).digest('hex');
 *     `https://www.nexagrowth.com.ar/servicios/checkout?plan=${plan}&renueva=${renueva}&renuevaExp=${exp}&renuevaSig=${sig}`
 *
 * Si la firma no verifica, está vencida o falta, el pedido se trata como
 * contratación normal: se cobra (y se muestra) el primer pago completo, con
 * la Puesta en marcha.
 */

export const PARAM_RENUEVA = 'renueva';
export const PARAM_RENUEVA_EXP = 'renuevaExp';
export const PARAM_RENUEVA_SIG = 'renuevaSig';

export function mensajeRenovacion(renueva, planId, exp) {
  return `renovacion|${renueva}|${planId}|${exp}`;
}

/* Firma un link de renovación (lo usa el CRM; acá queda para tests y referencia). */
export function firmarRenovacion({ renueva, planId, exp }, secreto = process.env.SITE_TO_CRM_SECRET) {
  if (!secreto) throw new Error('Falta SITE_TO_CRM_SECRET para firmar el link de renovación.');
  return crypto.createHmac('sha256', secreto).update(mensajeRenovacion(renueva, planId, exp)).digest('hex');
}

/*
 * Devuelve { renueva, renuevaExp, renuevaSig } si el link es válido para ESE
 * plan, o null. `datos` puede ser el body del checkout o un objeto armado con
 * los parámetros de la URL.
 */
export function verificarRenovacion(datos, planId) {
  const secreto = process.env.SITE_TO_CRM_SECRET;
  if (!secreto || !planId) return null;

  const renueva = String(datos?.[PARAM_RENUEVA] || '').trim();
  const expTexto = String(datos?.[PARAM_RENUEVA_EXP] ?? '').trim();
  const sig = String(datos?.[PARAM_RENUEVA_SIG] || '').trim().toLowerCase();

  if (!/^[a-z0-9]{20,40}$/i.test(renueva)) return null;
  if (!/^\d{9,11}$/.test(expTexto)) return null;
  if (!/^[0-9a-f]{64}$/.test(sig)) return null;

  const exp = Number(expTexto);
  if (exp <= Math.floor(Date.now() / 1000)) return null;

  const esperado = Buffer.from(firmarRenovacion({ renueva, planId, exp: expTexto }, secreto), 'utf8');
  const recibido = Buffer.from(sig, 'utf8');
  if (esperado.length !== recibido.length || !crypto.timingSafeEqual(esperado, recibido)) return null;

  return { renueva, renuevaExp: expTexto, renuevaSig: sig };
}
