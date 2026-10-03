/*
 * Links de WhatsApp del sitio.
 *
 * Todos los botones de WhatsApp pasan por /wa en lugar de ir directo a
 * wa.me. /wa registra el clic (desde qué botón y de qué campaña venía la
 * persona), le agrega al mensaje un código de referencia corto, por ejemplo
 * "(ref. W7K2QX)", y recién ahí abre WhatsApp. Cuando ese mensaje llega, el
 * código permite saber de qué anuncio vino la consulta.
 *
 * Si el registro falla por cualquier motivo, /wa abre WhatsApp igual: el
 * visitante nunca queda trabado.
 */

export const WHATSAPP_NUMBER = '5491124527402';

/**
 * @param {string} from  identificador del botón, por ejemplo 'boton_flotante'
 * @param {string} [text] mensaje que queda escrito en WhatsApp (sin codificar)
 */
export function waHref(from, text) {
  const params = new URLSearchParams({ from });
  if (text) params.set('text', text);
  return `/wa?${params.toString()}`;
}
