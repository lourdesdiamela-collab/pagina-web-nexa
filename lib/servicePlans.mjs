/*
 * FUENTE ÚNICA DE PRECIOS Y ALCANCES DE LOS SERVICIOS.
 *
 * La página de Servicios, el checkout, el servidor que cobra y el asesor de
 * ventas leen todo de acá. El checkout viaja con un `plan` (identificador),
 * NUNCA con un monto: el servidor busca el precio con getServicePlan(planId)
 * y rechaza el pedido si el identificador no existe.
 *
 * Catálogo de octubre de 2026 (rediseño comercial):
 *   - 3 abonos mensuales: NEXA Contenido, NEXA Anuncios (Meta) y NEXA Integral.
 *   - Todo abono arranca con la Puesta en marcha (SETUP_FEE), que se cobra
 *     una sola vez junto con el primer mes. Las renovaciones no la incluyen.
 *   - 1 proyecto de pago único: Diagnóstico y Orden Digital.
 *   - Sin reuniones periódicas: el seguimiento es por el portal y por mail.
 *   - Recover, CRM para clientes, Google Ads y Web quedan como "próximamente"
 *     (COMING_SOON): se muestran pero no se pueden comprar.
 *
 * Los ids de plan conservan los sufijos -start / -growth / -scale a propósito:
 * el CRM los usa para saber el nivel del plan (mapPlanNivel en
 * Nexa-CRM/src/lib/pago-servicio.ts). El nombre que ve el cliente es otro
 * (Esencial, Crecimiento, Marca, Escala).
 *
 * PARA CAMBIAR UN PRECIO: se toca `amount` acá. Se actualizan la página de
 * Servicios, el checkout y el asesor de ventas a la vez.
 */

/*
 * Formato de precio de las tarjetas de planes: "$149.900", sin espacio después
 * del signo. (formatPrice() de products.mjs devuelve "$ 149.900" con espacio;
 * se usa en Aprende y en los checkouts, y no se toca.)
 */
function formatPlanPrice(amount) {
  return `$${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(amount)}`;
}

/* Puesta en marcha: se cobra una vez, con el primer mes de cualquier abono. */
export const SETUP_FEE = {
  id: 'puesta-en-marcha',
  name: 'Puesta en marcha',
  amount: 149900,
  features: [
    'Formulario guiado para cargar tu marca: colores, tipografía, logo y referencias',
    'Diagnóstico de tu marca, tu competencia y tu público',
    'Plan de 90 días con objetivos',
    'Propuesta de valor y mensajes clave',
    'Guía visual básica: paleta, tipografía y uso del logo',
    'Optimización de biografía e historias destacadas de 1 red',
    'Alta en tu portal de cliente',
  ],
  note: 'Listo en 7 días hábiles desde que completás el formulario. No incluye rediseño de logo ni manual de marca completo. 1 ronda de cambios.',
};

export const SERVICE_LINES = [
  {
    id: 'social',
    slug: 'redes_sociales',
    label: 'NEXA Contenido',
    shortLabel: 'Contenido',
    color: '#EAA1FB',
    accent: 'rgba(234,161,251,0.12)',
    border: 'rgba(234,161,251,0.3)',
    billing: 'Abono mensual',
    billingType: 'mensual',
    tagline: 'Tus redes ordenadas y constantes. Aprobás todo desde tu portal antes de que se publique.',
    notIncludedLine: 'No incluye grabación de video ni respuesta de comentarios y mensajes (se puede sumar como adicional).',
    tiers: [
      {
        id: 'social-start',
        name: 'Esencial',
        amount: 199900,
        suffix: '/mes',
        badge: false,
        features: ['1 red social', '8 piezas al mes (posts o carruseles)', '8 historias diseñadas', 'Calendario mensual aprobado en tu portal', 'Copys y hashtags', 'Informe mensual por escrito'],
      },
      {
        id: 'social-growth',
        name: 'Crecimiento',
        amount: 359900,
        suffix: '/mes',
        badge: true,
        features: ['2 redes sociales', '12 piezas al mes (posts o carruseles)', '12 historias diseñadas', '2 reels editados con tu material', 'Calendario mensual aprobado en tu portal', 'Copys y hashtags', 'Análisis de 3 competidores por trimestre', 'Informe mensual por escrito'],
      },
      {
        id: 'social-scale',
        name: 'Marca',
        amount: 529900,
        suffix: '/mes',
        badge: false,
        features: ['2 redes sociales', '16 piezas al mes (posts o carruseles)', '20 historias diseñadas', '4 reels editados con tu material', 'Calendario mensual aprobado en tu portal', 'Copys y hashtags', 'Análisis de 3 competidores por trimestre', 'Revisión trimestral de la línea editorial', 'Informe mensual por escrito'],
      },
    ],
  },
  {
    id: 'ads',
    slug: 'meta_ads',
    label: 'NEXA Anuncios',
    shortLabel: 'Anuncios',
    color: '#FE8FD9',
    accent: 'rgba(254,143,217,0.14)',
    border: 'rgba(254,143,217,0.35)',
    billing: 'Abono mensual',
    billingType: 'mensual',
    tagline: 'Campañas en Instagram y Facebook para conseguir consultas y ventas, con el presupuesto bajo control.',
    notIncludedLine: 'No incluye producción de video. No garantizamos resultados ni un costo por consulta: dependen de tu mercado y de tu oferta.',
    tiers: [
      {
        id: 'ads-start',
        name: 'Esencial',
        amount: 179900,
        suffix: '/mes',
        badge: false,
        features: ['1 campaña activa', 'Gestionamos hasta $500.000 de inversión por mes', '3 anuncios nuevos por mes', 'Configuración de píxel y eventos', 'Optimización semanal', 'Informe mensual por escrito'],
      },
      {
        id: 'ads-growth',
        name: 'Crecimiento',
        amount: 319900,
        suffix: '/mes',
        badge: true,
        features: ['Hasta 3 campañas activas', 'Gestionamos hasta $1.500.000 de inversión por mes', '6 anuncios nuevos por mes', 'Configuración de píxel y eventos', 'Optimización semanal', 'Remarketing', '1 prueba A/B por mes', 'Campañas a WhatsApp o formulario', 'Informe mensual por escrito'],
      },
      {
        id: 'ads-scale',
        name: 'Escala',
        amount: 499900,
        suffix: '/mes',
        badge: false,
        features: ['Hasta 5 campañas activas', 'Gestionamos hasta $4.000.000 de inversión por mes (arriba de eso, 10% de lo que exceda)', '10 anuncios nuevos por mes', 'Configuración de píxel y eventos', 'Optimización semanal', 'Remarketing', '1 prueba A/B por mes', 'Campañas a WhatsApp o formulario', 'Embudo con tu landing (si ya tenés una)', 'Informe mensual por escrito'],
      },
    ],
  },
  {
    id: 'integral',
    slug: 'nexa_integral',
    label: 'NEXA Integral',
    shortLabel: 'Integral',
    color: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.3)',
    billing: 'Abono mensual',
    billingType: 'mensual',
    tagline: 'Contenido, anuncios y estrategia trabajando juntos, con un mismo mensaje y un solo informe.',
    notIncludedLine: 'La inversión en publicidad y la producción de video van aparte.',
    tiers: [
      {
        id: 'integral-growth',
        name: 'Integral Crecimiento',
        amount: 469900,
        separateAmount: 539800,
        suffix: '/mes',
        badge: true,
        features: ['Todo NEXA Contenido Crecimiento', 'Todo NEXA Anuncios Esencial', 'Calendario y campañas con el mismo mensaje', 'Un solo informe mensual', 'Ajuste trimestral del plan de 90 días'],
      },
      {
        id: 'integral-scale',
        name: 'Integral Marca',
        amount: 749900,
        separateAmount: 849800,
        suffix: '/mes',
        badge: false,
        features: ['Todo NEXA Contenido Marca', 'Todo NEXA Anuncios Crecimiento', 'Calendario y campañas con el mismo mensaje', 'Un solo informe mensual', 'Ajuste trimestral del plan de 90 días', 'Campaña de temporada por trimestre'],
      },
    ],
  },
  {
    id: 'proyectos',
    slug: 'orden_digital',
    label: 'Diagnóstico y Orden Digital',
    shortLabel: 'Diagnóstico',
    color: '#835CE6',
    accent: 'rgba(131,92,230,0.12)',
    border: 'rgba(131,92,230,0.3)',
    billing: 'Pago único',
    billingType: 'unico',
    tagline: 'Para ordenar tu presencia digital sin contratar un abono.',
    notIncludedLine: 'No incluye aplicar los cambios en tu web ni diseñar una landing.',
    tiers: [
      {
        id: 'diagnostico-orden',
        name: 'Diagnóstico y Orden Digital',
        amount: 239900,
        suffix: 'pago único',
        badge: false,
        features: ['Todo lo de la Puesta en marcha', 'Auditoría de tu web, Google Business y hasta 3 redes', 'Lista de mejoras ordenada por prioridad', 'Textos de perfiles y biografías ya corregidos', 'Entrega en 10 días hábiles'],
      },
    ],
    footnote: 'Pagando por transferencia bancaria tenés 10% de descuento.',
  },
];

/* Adicionales: se piden por WhatsApp o desde el portal (no tienen checkout propio). */
export const ADDONS = [
  { name: 'Sesión estratégica por videollamada (45 minutos, con resumen escrito en tu portal)', amount: 49900 },
  { name: 'Reel extra editado con tu material', amount: 29900 },
  { name: 'Pieza o historia extra', amount: 14900 },
  { name: 'Red social adicional', amount: 79900, suffix: '/mes' },
  { name: 'Ronda de cambios extra', amount: 9900 },
];

/* Servicios en desarrollo: se muestran, no se venden. */
export const COMING_SOON = [
  { id: 'recover', name: 'NEXA Recover', desc: 'Reactivación de clientes inactivos y consultas sin respuesta por WhatsApp.' },
  { id: 'crm', name: 'CRM para tu negocio', desc: 'Tus consultas y ventas ordenadas por etapa, con avisos de seguimiento.' },
  { id: 'google', name: 'Google Ads', desc: 'Campañas en el buscador de Google y en YouTube.' },
  { id: 'web', name: 'NEXA Web', desc: 'Sitios y landing pages a medida.' },
];

/* Condiciones que aplican a todos los servicios. */
export const CONDITIONS = [
  'Sin reuniones periódicas: aprobás, seguís y medís todo desde tu portal. Si querés hablar, podés sumar una sesión estratégica.',
  'Respondemos consultas en 1 día hábil y cambios en 2 días hábiles.',
  '1 ronda de cambios por pieza y por calendario.',
  'Permanencia mínima de 3 meses en los abonos; después, mes a mes con aviso de 15 días.',
  'Lo que no se usa en el mes no se acumula.',
  'La inversión en publicidad, las licencias, el hosting y la producción de video se pagan aparte.',
];

/* Precio formateado para mostrar en pantalla, ej: "$149.900". */
export function planPriceLabel(tier) {
  return formatPlanPrice(tier.amount);
}

export function priceLabel(amount) {
  return formatPlanPrice(amount);
}

/*
 * Busca un plan por su identificador (ej: 'ads-scale').
 *
 * Devuelve null si no existe. El checkout RECHAZA el pedido en ese caso: es la
 * única forma de saber el precio, así que un identificador inválido no puede
 * terminar en un cobro.
 */
export function getServicePlan(planId) {
  const id = String(planId || '').trim();
  if (!id) return null;

  for (const line of SERVICE_LINES) {
    const tier = line.tiers.find((t) => t.id === id);
    if (!tier) continue;

    const lineTitle = `NEXA ${line.shortLabel}`;
    // "NEXA Contenido Crecimiento", "NEXA Integral Marca", "NEXA Diagnóstico y Orden Digital".
    const planLabel = line.tiers.length === 1 || line.id === 'integral' ? `NEXA ${tier.name}` : `${lineTitle} ${tier.name}`;
    return {
      planId: tier.id,
      tierName: tier.name,
      amount: tier.amount,
      // Puesta en marcha: solo en los abonos mensuales.
      setupFee: line.billingType === 'mensual' ? SETUP_FEE.amount : 0,
      billing: line.billingType,
      lineId: line.id,
      lineSlug: line.slug,
      lineTitle,
      // Etiqueta que se muestra al cliente y viaja en los emails.
      planLabel,
    };
  }
  return null;
}

/*
 * Lo que se cobra en este pago: el primer mes de un abono suma la Puesta en
 * marcha; las renovaciones (link de cobranza con ?renueva=) y los pagos
 * únicos no.
 */
export function checkoutTotal(plan, { renueva = false } = {}) {
  if (!plan) return 0;
  return plan.amount + (renueva ? 0 : plan.setupFee || 0);
}

/* Todos los identificadores válidos, para chequeos y tests. */
export function listServicePlanIds() {
  return SERVICE_LINES.flatMap((line) => line.tiers.map((t) => t.id));
}
