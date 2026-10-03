/*
 * Atribución de origen (herramienta #8: leads con campaña de origen).
 *
 * Cuando alguien entra al sitio desde un anuncio o un link con parámetros
 * (utm_source, utm_campaign, gclid de Google Ads, fbclid de Meta), el
 * componente TrackingScripts guarda esos datos en dos cookies propias del
 * sitio:
 *
 *   - nexa_attr        → la ÚLTIMA campaña con la que llegó (se pisa en cada
 *                        visita que trae parámetros).
 *   - nexa_attr_first  → la PRIMERA vez que llegó al sitio (no se pisa), con la
 *                        página de entrada y de qué sitio venía.
 *
 * Después, cuando la persona hace clic en WhatsApp (/wa) o completa el
 * formulario (/api/contact), el servidor lee esas cookies y deja anotado de
 * qué campaña vino ese lead. Son cookies de primera parte, sin datos
 * personales: solo nombres de campaña y páginas.
 *
 * Este archivo lo usan tanto el navegador como el servidor: no importa nada
 * que dependa de uno u otro.
 */

export const COOKIE_LAST = 'nexa_attr';
export const COOKIE_FIRST = 'nexa_attr_first';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 días

export const ATTR_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

function corto(valor, max = 200) {
  if (valor === null || valor === undefined) return null;
  // Sin caracteres que puedan armar HTML: estos valores terminan en mails y en
  // el panel, y los parámetros de una URL los puede escribir cualquiera.
  const texto = String(valor).replace(/[<>"'`]/g, '').trim();
  return texto ? texto.slice(0, max) : null;
}

/* Lee el JSON de una cookie de atribución sin tirar error si viene roto. */
export function readAttributionCookie(raw) {
  if (!raw) return null;
  try {
    const data = JSON.parse(decodeURIComponent(raw));
    if (!data || typeof data !== 'object') return null;
    const limpio = {};
    for (const key of [...ATTR_PARAMS, 'landing', 'referrer', 'ts']) {
      const v = corto(data[key], key === 'gclid' || key === 'fbclid' ? 300 : 200);
      if (v) limpio[key] = v;
    }
    return Object.keys(limpio).length ? limpio : null;
  } catch {
    return null;
  }
}

/* Saca los parámetros de campaña de una query string. Devuelve null si no hay ninguno. */
export function attributionFromSearch(search) {
  const params = new URLSearchParams(search || '');
  const data = {};
  for (const key of ATTR_PARAMS) {
    const v = corto(params.get(key), key === 'gclid' || key === 'fbclid' ? 300 : 200);
    if (v) data[key] = v;
  }
  return Object.keys(data).length ? data : null;
}

/*
 * Resumen legible para mostrarle a Lu en el CRM, el admin o un mail, por
 * ejemplo: "facebook / paid_social / lanzamiento-octubre (Meta: sí)".
 */
export function describeAttribution(last, first) {
  const a = last || first;
  if (!a) return null;
  const partes = [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean);
  let texto = partes.length ? partes.join(' / ') : null;
  if (!texto && a.gclid) texto = 'Google Ads';
  if (!texto && a.fbclid) texto = 'Meta (Facebook / Instagram)';
  if (!texto && a.referrer) texto = `referido desde ${a.referrer}`;
  if (!texto) texto = 'directo';
  const extras = [];
  if (a.gclid) extras.push('Google Ads: sí');
  if (a.fbclid) extras.push('Meta: sí');
  if (a.utm_content) extras.push(`anuncio: ${a.utm_content}`);
  if (first && first.landing) extras.push(`entró por ${first.landing}`);
  return extras.length ? `${texto} (${extras.join(', ')})` : texto;
}
