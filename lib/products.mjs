import {
  Sparkles, Instagram, MessageCircle, Megaphone, TrendingUp,
  Code2, Search, Table2, Wallet, Clock,
} from 'lucide-react';

/* ══════════════════════════════════════
   NEXA Aprende — Catálogo de productos
   Datos estructurados y generados de forma determinística
   (sin Math.random directo, para evitar mismatches de hidratación SSR/CSR).
   ══════════════════════════════════════ */

export const BASE_PRICE = 9999;
export const CURRENCY = 'ARS';

const ANCHOR_DATE = new Date('2026-08-01T00:00:00Z').getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

/* ── PRNG determinístico (mulberry32) sembrado por string ── */
function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h = (h ^ (h >>> 16)) >>> 0;
    return h;
  };
}

function mulberry32(seedFn) {
  let a = seedFn();
  return function rng() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(seed) {
  return mulberry32(hashSeed(String(seed)));
}

/* Variante de portada (0-3) determinística por slug — usada por productos que
   vienen de la base de datos (Fase 2), donde ya no existe un índice global fijo. */
export function coverVariant(slug) {
  const rng = makeRng(`cover-${slug}`);
  return Math.floor(rng() * 4);
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, arr) {
  return arr[randInt(rng, 0, arr.length - 1)];
}

function sample(rng, arr, count) {
  const pool = [...arr];
  const out = [];
  while (out.length < count && pool.length > 0) {
    const idx = randInt(rng, 0, pool.length - 1);
    out.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return out;
}

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

/* ── Categorías ── */
export const CATEGORIES = [
  { slug: 'ia', label: 'IA', fullLabel: 'Inteligencia Artificial', icon: Sparkles, color: '#835CE6' },
  { slug: 'instagram', label: 'Instagram', fullLabel: 'Instagram', icon: Instagram, color: '#FE8FD9' },
  { slug: 'whatsapp-business', label: 'WhatsApp Business', fullLabel: 'WhatsApp Business', icon: MessageCircle, color: '#7FBF3F' },
  { slug: 'marketing-digital', label: 'Marketing Digital', fullLabel: 'Marketing Digital', icon: Megaphone, color: '#EAA1FB' },
  { slug: 'ventas', label: 'Ventas', fullLabel: 'Ventas', icon: TrendingUp, color: '#B89BFF' },
  { slug: 'desarrollo-web', label: 'Desarrollo Web', fullLabel: 'Desarrollo Web', icon: Code2, color: '#835CE6' },
  { slug: 'seo', label: 'SEO', fullLabel: 'SEO', icon: Search, color: '#EAA1FB' },
  { slug: 'excel-power-bi', label: 'Excel y Power BI', fullLabel: 'Excel y Power BI', icon: Table2, color: '#A9D93A' },
  { slug: 'finanzas', label: 'Finanzas', fullLabel: 'Finanzas', icon: Wallet, color: '#B89BFF' },
  { slug: 'productividad', label: 'Productividad', fullLabel: 'Productividad', icon: Clock, color: '#FE8FD9' },
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}

/* ── Catálogo curado: 10 productos x 10 categorías ── */
const CATALOG = {
  ia: [
    ['ChatGPT para Emprendedores', 'Guía práctica para automatizar tareas, crear contenido y ahorrar horas cada semana con IA conversacional.'],
    ['100 Prompts que Venden', 'Biblioteca de prompts probados para copywriting, ventas y atención al cliente con IA.'],
    ['IA para Redes Sociales', 'Cómo generar ideas, guiones y calendarios de contenido en minutos usando inteligencia artificial.'],
    ['Automatiza tu Negocio con IA', 'Framework paso a paso para conectar IA a tus procesos de atención, ventas y soporte.'],
    ['Midjourney desde Cero', 'Domina la generación de imágenes con IA para piezas de marca, publicidad y redes.'],
    ['IA para Atención al Cliente', 'Cómo montar un asistente virtual que responda consultas y derive oportunidades reales.'],
    ['Copywriting con IA', 'Escribí textos que convierten en minutos combinando estructura de ventas con inteligencia artificial.'],
    ['IA para Análisis de Datos', 'Convertí planillas y reportes en decisiones usando asistentes de IA, sin saber programar.'],
    ['Crea tu Propio Chatbot', 'Guía técnica accesible para armar un chatbot funcional para tu web o WhatsApp.'],
    ['El Futuro del Trabajo con IA', 'Tendencias, herramientas y habilidades clave para no quedar afuera de la revolución de la IA.'],
  ],
  instagram: [
    ['Instagram para Negocios desde Cero', 'Configurá un perfil que vende: bio, destacados, feed y primeros pasos bien hechos.'],
    ['Reels que Explotan: Guía de Guiones', 'Estructuras de guion probadas para conseguir alcance y retención real.'],
    ['Estrategia de Contenido 90 Días', 'Calendario y pilares de contenido para crecer una cuenta de forma sostenida.'],
    ['Instagram Ads desde Cero', 'Cómo lanzar tu primera campaña paga y no quemar presupuesto en el intento.'],
    ['Stories que Convierten', 'Recursos interactivos y CTAs para transformar audiencia en clientes todos los días.'],
    ['Growth Orgánico en Instagram', 'Tácticas actuales de crecimiento sin depender de la suerte del algoritmo.'],
    ['Fotografía de Producto con el Celular', 'Técnicas simples de luz, composición y edición para vender mejor con fotos propias.'],
    ['Instagram Shopping Paso a Paso', 'Configurá catálogo y etiquetas de producto para vender directo desde el feed.'],
    ['Copywriting para Bio y Captions', 'Fórmulas de escritura persuasiva para perfiles y publicaciones que generan consultas.'],
    ['Analítica de Instagram sin Complicarte', 'Qué métricas mirar realmente y cómo convertirlas en decisiones de contenido.'],
  ],
  'whatsapp-business': [
    ['WhatsApp Business desde Cero', 'Configuración completa: catálogo, etiquetas, respuestas rápidas y perfil profesional.'],
    ['Mensajes que Cierran Ventas', 'Plantillas de conversación para cada etapa del embudo comercial por WhatsApp.'],
    ['Automatización con WhatsApp API', 'Cómo conectar respuestas automáticas y flujos sin perder el trato humano.'],
    ['Catálogo de Productos en WhatsApp', 'Armá un catálogo que se vea profesional y facilite la decisión de compra.'],
    ['Atención al Cliente por WhatsApp', 'Protocolos y tiempos de respuesta para no perder ni un solo lead caliente.'],
    ['Difusión y Broadcast sin Spam', 'Cómo comunicar novedades y ofertas sin quemar tu lista de contactos.'],
    ['WhatsApp + CRM: Flujo de Seguimiento', 'Organizá cada conversación con un sistema simple de estados y próximos pasos.'],
    ['Chatbots para WhatsApp Business', 'Guía práctica para montar respuestas automáticas 24/7 sin perder calidez.'],
    ['Guiones de Venta por Chat', 'Scripts probados para romper el hielo, presentar oferta y cerrar por escrito.'],
    ['Reactivación de Clientes por WhatsApp', 'Estrategia para recuperar contactos fríos y convertirlos en ventas nuevas.'],
  ],
  'marketing-digital': [
    ['Plan de Marketing Digital en un Día', 'Framework exprés para ordenar objetivos, canales y presupuesto de marketing.'],
    ['Funnels de Venta que Funcionan', 'Diseñá embudos simples y efectivos, del primer contacto hasta el cierre.'],
    ['Email Marketing que Vende', 'Secuencias de email probadas para nutrir leads y generar ventas recurrentes.'],
    ['Branding Digital para Pymes', 'Construí una marca coherente y memorable sin necesitar un equipo grande.'],
    ['Marketing de Contenidos desde Cero', 'Cómo crear contenido de valor que atraiga clientes de forma constante.'],
    ['Google Ads para Principiantes', 'Primeros pasos para lanzar campañas de búsqueda rentables.'],
    ['Estrategia Omnicanal', 'Conectá redes, web y WhatsApp en una sola experiencia de marca coherente.'],
    ['Copywriting Publicitario', 'Técnicas de escritura persuasiva aplicadas a anuncios y landing pages.'],
    ['Marketing de Influencers para Marcas Chicas', 'Cómo colaborar con microinfluencers sin gastar de más.'],
    ['Métricas de Marketing que Importan', 'Los indicadores clave para saber si tu estrategia realmente funciona.'],
  ],
  ventas: [
    ['El Manual del Cierre de Ventas', 'Técnicas probadas para manejar objeciones y cerrar con confianza.'],
    ['Prospección Efectiva B2B', 'Cómo encontrar y contactar clientes ideales sin perder tiempo.'],
    ['Scripts de Venta Consultiva', 'Guiones flexibles para vender ayudando, no presionando.'],
    ['Negociación para No Vendedores', 'Herramientas prácticas para negociar mejores condiciones en cualquier trato.'],
    ['Seguimiento Comercial sin Perder Leads', 'Sistema simple de seguimiento para que ninguna oportunidad se enfríe.'],
    ['Ventas por Redes Sociales', 'Cómo convertir conversaciones en redes en clientes reales.'],
    ['Manejo de Objeciones de Precio', 'Respuestas efectivas cuando el cliente dice que es caro.'],
    ['Ventas Recurrentes y Upselling', 'Estrategias para vender más a los clientes que ya confían en vos.'],
    ['El Arte de la Primera Llamada', 'Cómo estructurar una llamada de ventas que genere interés real.'],
    ['KPIs de Ventas para Equipos Chicos', 'Qué medir y cómo armar reportes simples que mejoren resultados.'],
  ],
  'desarrollo-web': [
    ['Landing Pages que Convierten', 'Estructura, copy y diseño de páginas que realmente generan ventas.'],
    ['WordPress para No Programadores', 'Creá y mantené tu web profesional sin escribir código.'],
    ['Velocidad Web: Guía de Optimización', 'Técnicas simples para que tu sitio cargue rápido y no pierdas clientes.'],
    ['UX/UI para Sitios que Venden', 'Principios de diseño centrados en conversión, no solo estética.'],
    ['No-Code: Creá Apps sin Programar', 'Herramientas y flujos para construir productos digitales sin código.'],
    ['SEO Técnico para tu Sitio Web', 'Ajustes técnicos esenciales para que Google entienda y posicione tu web.'],
    ['Checkout y Carritos que No Espantan Clientes', 'Cómo diseñar un proceso de compra simple que reduzca el abandono.'],
    ['Mantenimiento Web sin Dolores de Cabeza', 'Checklist mensual para mantener tu sitio seguro, rápido y actualizado.'],
    ['De la Idea al Sitio Web en 7 Días', 'Plan de trabajo realista para lanzar tu web sin trabarte en detalles.'],
    ['Integraciones Web Esenciales', 'Conectá tu sitio con CRM, WhatsApp, pagos y analítica sin ser programador.'],
  ],
  seo: [
    ['SEO desde Cero para Pymes', 'Los fundamentos para empezar a aparecer en Google sin gastar en ads.'],
    ['Investigación de Palabras Clave', 'Cómo encontrar los términos que tus clientes realmente buscan.'],
    ['SEO Local: Aparecé en tu Ciudad', 'Optimizá Google Maps y tu ficha de negocio para captar clientes cercanos.'],
    ['Contenido que Posiciona', 'Cómo escribir artículos pensados para rankear y para convertir.'],
    ['Link Building sin Trampas', 'Estrategias éticas para conseguir enlaces que mejoren tu autoridad.'],
    ['SEO para E-commerce', 'Optimizá fichas de producto y categorías para vender más desde el buscador.'],
    ['Auditoría SEO Paso a Paso', 'Checklist completo para detectar y corregir errores que te frenan en Google.'],
    ['Core Web Vitals sin Complicarte', 'Entendé y mejorá las métricas técnicas que Google usa para rankear tu web.'],
    ['SEO para Blogs de Marca', 'Cómo estructurar contenido editorial que atraiga tráfico calificado.'],
    ['Medí tu SEO como un Profesional', 'Reportes simples para entender si tu estrategia de SEO está funcionando.'],
  ],
  'excel-power-bi': [
    ['Excel desde Cero para el Trabajo', 'Fórmulas y funciones esenciales para ordenar cualquier planilla.'],
    ['Tablas Dinámicas sin Miedo', 'Dominá la herramienta más poderosa de Excel para analizar datos rápido.'],
    ['Dashboards en Excel que Impresionan', 'Cómo armar tableros visuales claros para presentar resultados.'],
    ['Power BI para Principiantes', 'Primeros pasos para conectar datos y crear reportes interactivos.'],
    ['Automatizá Reportes con Excel', 'Reducí horas de trabajo manual con plantillas y fórmulas inteligentes.'],
    ['Excel para Control de Ventas', 'Plantilla y método para seguir ventas, metas y comisiones sin errores.'],
    ['Modelos Financieros en Excel', 'Armá proyecciones y escenarios financieros de forma ordenada.'],
    ['Power Query: Limpieza de Datos', 'Automatizá la limpieza y transformación de datos antes de analizarlos.'],
    ['Excel para Recursos Humanos', 'Plantillas para gestionar asistencia, sueldos y desempeño de equipo.'],
    ['De Excel a Power BI: El Salto', 'Cuándo y cómo migrar tus reportes a un dashboard profesional.'],
  ],
  finanzas: [
    ['Finanzas para Emprendedores', 'Ordená ingresos, gastos y ganancias reales de tu negocio desde cero.'],
    ['Flujo de Caja sin Sorpresas', 'Cómo proyectar entradas y salidas para no quedarte sin liquidez.'],
    ['Precios que Dejan Ganancia', 'Método para calcular precios que cubran costos y dejen rentabilidad real.'],
    ['Separá las Finanzas Personales del Negocio', 'Sistema simple para dejar de mezclar plata personal y de la empresa.'],
    ['Cómo Leer un Balance sin Ser Contador', 'Entendé los números clave de tu negocio en minutos.'],
    ['Ahorro e Inversión para Pymes', 'Primeros pasos para generar un colchón financiero sólido en tu empresa.'],
    ['Reducción de Costos sin Bajar Calidad', 'Estrategias prácticas para gastar mejor, no solo gastar menos.'],
    ['Finanzas para Freelancers', 'Cómo facturar, ahorrar para impuestos y planificar ingresos variables.'],
    ['Presupuesto Anual Paso a Paso', 'Armá el presupuesto de tu negocio con una planilla guiada.'],
    ['Indicadores Financieros Clave', 'Los números que todo dueño de negocio debería revisar cada mes.'],
  ],
  productividad: [
    ['Gestión del Tiempo para Emprendedores', 'Método práctico para priorizar tareas y dejar de apagar incendios.'],
    ['Notion para Organizar tu Negocio', 'Armá un sistema central para proyectos, clientes y contenido.'],
    ['Rutinas de Alto Rendimiento', 'Hábitos diarios simples para sostener energía y foco todo el año.'],
    ['Delegar sin Perder el Control', 'Cómo armar procesos claros para que tu equipo resuelva sin vos.'],
    ['Reuniones Efectivas en Menos Tiempo', 'Estructura para que cada reunión termine con decisiones, no solo charla.'],
    ['Automatizá Tareas Repetitivas', 'Herramientas simples para dejar de hacer a mano lo que se puede automatizar.'],
    ['Enfoque Profundo en un Mundo de Distracciones', 'Técnicas para proteger bloques de trabajo concentrado todos los días.'],
    ['Organización de Proyectos para Equipos Chicos', 'Sistema simple para planificar, asignar y seguir tareas sin caos.'],
    ['Productividad para Trabajo Remoto', 'Cómo sostener foco, límites y resultados trabajando desde casa.'],
    ['Checklist Semanal del Emprendedor', 'Ritual simple de cierre de semana para ordenar prioridades y avanzar.'],
  ],
};

const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

const LEVEL_BLURB = {
  Principiante: 'Pensado para arrancar desde cero, con pasos concretos y sin dar nada por sabido.',
  Intermedio: 'Ideal si ya tenés una base y querés ordenar el proceso y subir un nivel.',
  Avanzado: 'Para llevar lo que ya sabés a un sistema más profesional y escalable.',
};

const NAMES_POOL = [
  'Martina G.', 'Facundo R.', 'Sofía L.', 'Nicolás P.', 'Camila V.', 'Tomás B.',
  'Valentina S.', 'Lucas M.', 'Agustina D.', 'Franco C.', 'Julieta H.', 'Matías A.',
  'Micaela T.', 'Joaquín F.', 'Rocío N.', 'Ignacio Q.', 'Florencia K.', 'Bruno E.',
];

const COMMENTS_POOL = [
  'Justo lo que necesitaba, clarísimo y fácil de aplicar.',
  'Lo apliqué la misma semana que lo compré y ya noté la diferencia.',
  'Mucho mejor de lo que esperaba por el precio.',
  'Las plantillas solas ya valen la compra.',
  'Directo al punto, sin relleno innecesario.',
  'Lo recomiendo a cualquiera que recién arranca.',
  'Los ejemplos reales ayudan un montón a entender cómo aplicarlo.',
  'Volví a comprar otra guía de la misma categoría, nivel muy bueno.',
  'Se nota que está pensado para pymes reales, no para teoría.',
  'Fácil de seguir incluso sin experiencia previa.',
  'El bonus terminó siendo lo que más usé.',
  'Contenido actualizado, no es lo mismo de siempre.',
];

function buildDescription(subtitle, level, categoryLabel) {
  return `${subtitle} ${LEVEL_BLURB[level]} Un recurso de la biblioteca de ${categoryLabel} de NEXA Aprende, pensado para aplicarse en el negocio real, no solo para leer.`;
}

export function buildPreview(title, subtitle) {
  return `Extracto — "${title}": ${subtitle} En las primeras páginas vas a encontrar el diagnóstico rápido y el primer paso que podés aplicar hoy mismo.`;
}

function buildProduct(category, title, subtitle, indexInCategory, globalIndex) {
  const slug = slugify(title);
  const rng = makeRng(slug);
  const level = LEVELS[indexInCategory % LEVELS.length];
  const pages = randInt(rng, 80, 150);
  const minutes = Math.round(pages * 1.5);
  const readTime = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}min` : `${minutes} min`;

  const daysAgo = randInt(rng, 0, 150);
  const createdAt = new Date(ANCHOR_DATE - daysAgo * DAY_MS).toISOString();
  const isNew = daysAgo <= 18;

  const rating = Math.round((4.2 + rng() * 0.8) * 10) / 10;
  const reviewsCount = randInt(rng, 9, 142);

  const reviewsSample = sample(rng, NAMES_POOL, 3).map((name, i) => {
    const commentPool = sample(rng, COMMENTS_POOL, 3);
    const reviewDaysAgo = randInt(rng, 1, 140);
    return {
      id: `${slug}-review-${i}`,
      name,
      rating: Math.max(3, Math.min(5, Math.round(rating) + (i === 2 ? -1 : 0))),
      comment: commentPool[i],
      date: new Date(ANCHOR_DATE - reviewDaysAgo * DAY_MS).toISOString(),
    };
  });

  const hasDeal = globalIndex % 7 === 0;
  const compareAtPrice = hasDeal ? Math.round(BASE_PRICE * 1.4 / 10) * 10 : null;

  const category_ = category;

  return {
    slug,
    title,
    subtitle,
    description: buildDescription(subtitle, level, category_.fullLabel),
    preview: buildPreview(title, subtitle),
    category: category_.slug,
    categoryLabel: category_.label,
    categoryColor: category_.color,
    level,
    pages,
    readTime,
    price: BASE_PRICE,
    compareAtPrice,
    deal: hasDeal,
    rating,
    reviewsCount,
    reviews: reviewsSample,
    createdAt,
    isNew,
    includes: [
      `PDF premium de ${pages} páginas`,
      'Checklists accionables',
      'Plantillas editables',
      'Prompts de IA incluidos',
      'Casos reales aplicados',
      'Ejercicios prácticos',
      'Frameworks visuales',
      'Bonus exclusivo',
    ],
    coverSeed: globalIndex,
  };
}

function buildCatalog() {
  const products = [];
  let globalIndex = 0;
  CATEGORIES.forEach((category) => {
    const items = CATALOG[category.slug] || [];
    items.forEach(([title, subtitle], indexInCategory) => {
      products.push(buildProduct(category, title, subtitle, indexInCategory, globalIndex));
      globalIndex += 1;
    });
  });
  return products;
}

const PRODUCTS = buildCatalog();

/* ── Bestsellers / destacados: determinístico por rating * reviewsCount ── */
const BESTSELLER_SLUGS = new Set(
  [...PRODUCTS]
    .sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount)
    .slice(0, 12)
    .map((p) => p.slug)
);

const FEATURED_SLUGS = new Set(
  CATEGORIES.map((cat) => PRODUCTS.filter((p) => p.category === cat.slug).sort((a, b) => b.rating - a.rating)[0]?.slug).filter(Boolean)
);

PRODUCTS.forEach((p) => {
  p.bestSeller = BESTSELLER_SLUGS.has(p.slug);
  p.featured = FEATURED_SLUGS.has(p.slug);
});

/* ── API pública del catálogo ── */
export function listProducts() {
  return [...PRODUCTS];
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function getProductsByCategory(categorySlug) {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(limit = 8) {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getBestSellers(limit = 8) {
  return [...PRODUCTS].filter((p) => p.bestSeller).sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount).slice(0, limit);
}

export function getNewArrivals(limit = 8) {
  return [...PRODUCTS].filter((p) => p.isNew).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
}

export function getDeals(limit = 12) {
  return PRODUCTS.filter((p) => p.deal).slice(0, limit);
}

export function getRelatedProducts(product, limit = 4) {
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const fill = PRODUCTS.filter((p) => p.slug !== product.slug && p.category !== product.category).slice(0, limit - sameCategory.length);
  return [...sameCategory, ...fill];
}

export function searchProducts(query, categorySlug = 'Todos') {
  const q = query.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    if (categorySlug !== 'Todos' && p.category !== categorySlug) return false;
    if (!q) return true;
    const haystack = `${p.title} ${p.subtitle} ${p.categoryLabel} ${p.level}`.toLowerCase();
    return haystack.includes(q);
  });
}

export const TOTAL_PRODUCTS = PRODUCTS.length;
