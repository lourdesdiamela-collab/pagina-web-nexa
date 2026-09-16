/*
 * Aceptación de los Términos y Condiciones en el checkout.
 *
 * Qué se registra y por qué: ante un reclamo (de un cliente o de Defensa del
 * Consumidor) hay que poder demostrar que la persona aceptó los T&C, cuándo y
 * qué texto estaba vigente en ese momento. Con eso:
 *
 *   - quién  -> el userId del pedido (Aprende) o el email del formulario
 *               (servicios, que no tiene usuario registrado)
 *   - cuándo -> termsAcceptedAt, en UTC
 *   - desde dónde -> termsAcceptedIp
 *   - qué    -> termsVersion, la versión del texto de T&C
 */

/*
 * Versión vigente de los Términos y Condiciones.
 *
 * IMPORTANTE PARA LU: cada vez que cambies el texto de /terminos, subí esta
 * versión (por ejemplo a '2026-10-01'). Si no, los pedidos nuevos van a quedar
 * registrados como si hubieran aceptado el texto viejo.
 *
 * Arranca como 'sin-publicar' a propósito: el texto legal todavía no está
 * cargado en /terminos.
 */
export const TERMS_VERSION = 'sin-publicar';

/*
 * Saca la IP real del visitante. En Vercel (y detrás de cualquier proxy) la IP
 * del socket es la del proxy, así que se usa el header x-forwarded-for, cuyo
 * primer valor es el cliente original.
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || null;
}

/*
 * Valida que el body del checkout traiga la aceptación de los T&C y devuelve
 * los datos listos para guardar. Si no viene aceptado, devuelve un error: el
 * checkbox es obligatorio también del lado del servidor, no solo en la UI
 * (deshabilitar un botón en el navegador no frena a nadie).
 */
export function buildTermsAcceptance(body, request) {
  if (body?.acceptedTerms !== true) {
    return {
      error: 'Para continuar tenés que aceptar los Términos y Condiciones.',
      data: null,
    };
  }

  return {
    error: null,
    data: {
      termsAcceptedAt: new Date(),
      termsAcceptedIp: getClientIp(request),
      termsVersion: TERMS_VERSION,
    },
  };
}
