/**
 * De dónde viene cada visita (herramienta #8 del plan de automatización).
 *
 * El problema que resuelve: hoy entra una consulta por el formulario o por
 * WhatsApp y no hay forma de saber de qué anuncio, campaña o red salió. Sin
 * eso no se puede decir qué publicidad trae clientes y qué publicidad se está
 * llevando el presupuesto al vacío.
 *
 * Cómo funciona, sin instalar nada y sin cookies de terceros:
 *
 *   1. Cuando alguien entra al sitio, `capturarOrigen()` lee los parámetros
 *      UTM de la URL (los que agregan Meta Ads, Google Ads y cualquier gestor
 *      de campañas) y, si no hay, el sitio de donde vino (document.referrer).
 *   2. Eso queda guardado en sessionStorage, así sobrevive mientras la persona
 *      navega por el sitio: entra por un anuncio a la home, recorre servicios
 *      y recién ahí consulta — el origen sigue siendo el anuncio.
 *   3. Al enviar el formulario o al abrir WhatsApp, el origen viaja junto con
 *      la consulta y queda escrito en el lead del CRM.
 *
 * Es deliberadamente simple: no identifica personas, no persigue a nadie entre
 * sitios y se borra al cerrar la pestaña. Solo responde "esta consulta entró
 * por tal campaña".
 */

const CLAVE = 'nexa_origen';

const PARAMETROS_UTM = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];

/** Identificadores de clic que agregan las plataformas de anuncios. */
const PARAMETROS_CLIC = {
  fbclid: 'Meta Ads',
  gclid: 'Google Ads',
  ttclid: 'TikTok Ads',
};

function esNavegador() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

/**
 * Lee el origen de la URL actual y lo guarda, si no había uno guardado ya.
 * Llamar una vez al cargar el sitio. No pisa un origen anterior: la primera
 * entrada de la sesión es la que vale.
 */
export function capturarOrigen() {
  if (!esNavegador()) return null;

  try {
    const guardado = window.sessionStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado);

    const params = new URLSearchParams(window.location.search);
    const origen = {};

    for (const p of PARAMETROS_UTM) {
      const v = params.get(p);
      if (v) origen[p] = v.slice(0, 120);
    }

    for (const [param, plataforma] of Object.entries(PARAMETROS_CLIC)) {
      if (params.get(param)) {
        origen.plataforma = plataforma;
        break;
      }
    }

    // Sin UTMs: al menos sabemos de qué sitio llegó (Instagram, Google, etc.).
    if (Object.keys(origen).length === 0 && document.referrer) {
      try {
        const host = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (host && host !== window.location.hostname.replace(/^www\./, '')) {
          origen.referrer = host;
        }
      } catch {
        /* referrer mal formado: se ignora */
      }
    }

    origen.landing = window.location.pathname;

    window.sessionStorage.setItem(CLAVE, JSON.stringify(origen));
    return origen;
  } catch {
    // sessionStorage puede estar bloqueado (modo privado, políticas del
    // navegador). No es motivo para romper nada: se sigue sin origen.
    return null;
  }
}

/** Devuelve el origen guardado en esta sesión, o null. */
export function obtenerOrigen() {
  if (!esNavegador()) return null;
  try {
    const guardado = window.sessionStorage.getItem(CLAVE);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

/**
 * Convierte el origen en una línea legible para pegar en el lead del CRM o en
 * un mensaje de WhatsApp. Funciona también en el servidor.
 *
 * Ejemplos de salida:
 *   "Meta Ads · campaña: remarketing-octubre · entró por /servicios"
 *   "Instagram · entró por /"
 *   "Directo"
 */
export function describirOrigen(origen) {
  if (!origen || typeof origen !== 'object') return 'Directo';

  const partes = [];

  const fuente = origen.plataforma || origen.utm_source || origen.referrer;
  if (fuente) partes.push(String(fuente));

  if (origen.utm_campaign) partes.push(`campaña: ${origen.utm_campaign}`);
  if (origen.utm_content) partes.push(`anuncio: ${origen.utm_content}`);
  if (origen.utm_medium && !fuente) partes.push(String(origen.utm_medium));
  if (origen.landing) partes.push(`entró por ${origen.landing}`);

  return partes.length > 0 ? partes.join(' · ') : 'Directo';
}
