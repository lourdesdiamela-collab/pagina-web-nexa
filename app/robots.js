/*
 * robots.txt del sitio (reemplaza a public/robots.txt).
 *
 * Política con los robots de IA:
 *   - Robots que juntan contenido para ENTRENAR modelos: bloqueados en todo
 *     el sitio. Además middleware.js les responde 403 (robots.txt es solo un
 *     pedido; el 403 lo hace cumplir para los que se identifican).
 *   - Robots de BÚSQUEDA con IA (ChatGPT, Claude, Perplexity...): pueden ver
 *     las páginas comerciales, para que NEXA aparezca en esas respuestas,
 *     pero no el catálogo de Aprende (productos y categorías).
 *   - Buscadores comunes (Google, Bing) y previsualizadores de links
 *     (WhatsApp, Facebook, LinkedIn, X): igual que siempre.
 *
 * Si se agrega un robot a AI_TRAINING_BOTS, agregarlo también en
 * middleware.js (AI_TRAINING_UA).
 */

const SITE_URL = 'https://www.nexagrowth.com.ar';

const AI_TRAINING_BOTS = [
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'Bytespider',
  'meta-externalagent', 'FacebookBot', 'cohere-ai', 'cohere-training-data-crawler', 'Diffbot', 'ImagesiftBot',
  'Omgilibot', 'Timpibot', 'AI2Bot', 'PanguBot', 'Webzio-Extended', 'img2dataset', 'Amazonbot',
];

const AI_SEARCH_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User',
  'DuckAssistBot', 'MistralAI-User',
];

const RUTAS_PRIVADAS = [
  '/aprende/admin/',
  '/aprende/cuenta/',
  '/aprende/carrito',
  '/aprende/checkout',
  '/aprende/mis-recursos',
  '/servicios/checkout',
  '/api/',
  '/wa',
];

export default function robots() {
  return {
    rules: [
      { userAgent: AI_TRAINING_BOTS, disallow: '/' },
      { userAgent: AI_SEARCH_BOTS, allow: '/', disallow: ['/aprende/producto/', '/aprende/categoria/', ...RUTAS_PRIVADAS] },
      { userAgent: '*', allow: '/', disallow: RUTAS_PRIVADAS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
