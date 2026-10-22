/*
 * A dónde volver después del login o del registro (?callbackUrl=...).
 *
 * Solo se aceptan rutas del propio sitio que empiezan con UNA sola "/"
 * (ej: "/aprende/mis-recursos"). Cualquier otra cosa se descarta:
 *   - "https://otro-sitio.com"  -> redirección a un sitio de phishing
 *   - "//otro-sitio.com" o "/\otro-sitio.com" -> lo mismo, sin protocolo
 *   - "javascript:..."          -> ejecutaría código en nuestro dominio
 *     (router.push manda las URLs "externas" a location.assign)
 */
const DESTINO_POR_DEFECTO = '/aprende/mis-recursos';

export function safeCallback(valor, porDefecto = DESTINO_POR_DEFECTO) {
  const v = String(valor || '');
  if (!/^\/(?![\/\\])/.test(v)) return porDefecto;
  // Sin caracteres de control (tabs/saltos de línea que el navegador ignora).
  if (/[\u0000-\u001F\u007F]/.test(v)) return porDefecto;
  return v;
}
