import crypto from 'crypto';

/**
 * Autenticación de las llamadas que le llegan al sitio DESDE el CRM
 * (Nexa-CRM) — hoy solo el despacho del email del formulario de inicio
 * (herramienta #2: el CRM no tiene credenciales de Gmail propias, así que
 * le pide al sitio que mande el mail, reusando el mismo secreto compartido
 * que ya existe para las llamadas sitio → CRM (ver lib/crmSync.js y
 * Nexa-CRM/src/lib/site-auth.ts). No es un secreto nuevo: es el mismo
 * SITE_TO_CRM_SECRET, verificado acá en la dirección inversa.
 *
 * Si la variable no está configurada, se rechaza toda llamada: es preferible
 * que la integración quede cerrada a que quede abierta sin querer.
 */
export function verifyCrmSecret(request) {
  const expected = process.env.SITE_TO_CRM_SECRET;

  if (!expected) {
    console.error('[crmAuth] SITE_TO_CRM_SECRET no está configurada: se rechaza la llamada.');
    return { ok: false, status: 503, error: 'El sitio no tiene configurada la integración con el CRM.' };
  }

  const recibido = request.headers.get('x-site-secret') ?? '';

  const bufEsperado = Buffer.from(expected);
  const bufRecibido = Buffer.from(recibido);

  const coincide =
    bufEsperado.length === bufRecibido.length && crypto.timingSafeEqual(bufEsperado, bufRecibido);

  if (!recibido || !coincide) {
    return { ok: false, status: 401, error: 'No autorizado' };
  }

  return { ok: true };
}
