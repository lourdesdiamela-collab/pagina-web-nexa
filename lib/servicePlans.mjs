/*
 * FUENTE ÚNICA DE PRECIOS DE LOS PLANES DE SERVICIO.
 *
 * Antes los precios vivían sueltos dentro del JSX de app/servicios/ServiciosClient.jsx
 * y el checkout recibía el monto por la URL (`?amount=45000`). El servidor solo
 * validaba que fuera un número mayor a cero, así que cualquiera podía editar el
 * link y contratar el plan de $549.900 por un peso.
 *
 * Ahora:
 *   - Los precios están acá y en ningún otro lado. La página de Servicios los
 *     muestra leyéndolos de acá, así que lo que se ve es siempre lo que se cobra.
 *   - El checkout viaja con un `plan` (identificador), NO con un monto.
 *   - El servidor busca el precio en esta lista con getServicePlan(planId). Si el
 *     identificador no existe, rechaza el pedido.
 *
 * Los montos son los que ya estaban publicados en el sitio al 15/09/2026. No se
 * cambió ningún precio: solo se movieron de lugar.
 *
 * PARA CAMBIAR UN PRECIO: se toca `amount` acá y listo. Se actualiza la página de
 * Servicios y el checkout a la vez, sin riesgo de que queden desincronizados.
 */

/*
 * Formato de precio de las tarjetas de planes: "$149.900", sin espacio después
 * del signo. Es exactamente como se venían mostrando estos precios escritos a
 * mano en la página, así que al moverlos acá no cambia nada de lo que se ve.
 *
 * (No se usa formatPrice() de products.mjs a propósito: ese devuelve "$ 149.900",
 * con espacio, porque es el formato de moneda de Intl. Se usa en Aprende y en
 * los checkouts, y no se toca.)
 */
function formatPlanPrice(amount) {
  return `$${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(amount)}`;
}

export const SERVICE_LINES = [
  {
    id: 'marketing',
    slug: 'marketing_integral',
    label: 'Marketing & Estrategia',
    shortLabel: 'Estrategia',
    color: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.3)',
    billing: 'Plan mensual',
    billingType: 'mensual',
    tagline: 'Diagnóstico, plan y ejecución de tu estrategia de marketing.',
    tiers: [
      {
        id: 'marketing-start',
        name: 'Start',
        amount: 149900,
        suffix: '/mes',
        badge: false,
        features: ['Diagnóstico de marca, competencia y audiencia', 'Plan de marketing a 90 días', 'Propuesta de valor y mensajes clave', 'Calendario de acciones por canal (orgánico + pago)', 'Reunión mensual de revisión', 'Recomendaciones priorizadas', 'Acceso al portal cliente'],
      },
      {
        id: 'marketing-growth',
        name: 'Growth',
        amount: 299900,
        suffix: '/mes',
        badge: true,
        includesPrevious: 'Start',
        features: ['Plan de marketing trimestral con objetivos medibles', 'Estrategia multicanal (orgánico + pago + email)', 'Análisis de competencia y benchmarking', 'Reuniones quincenales de revisión', 'Ajustes de estrategia basados en datos', 'Dashboard de indicadores clave', 'Soporte prioritario'],
      },
      {
        id: 'marketing-scale',
        name: 'Scale',
        amount: 549900,
        suffix: '/mes',
        badge: false,
        includesPrevious: 'Growth',
        features: ['Estrategia de marketing integral a 12 meses', 'Coordinación con equipos de Ads, Social y CRM', 'Planificación comercial mensual', 'Reuniones semanales de seguimiento', 'Dashboard ejecutivo personalizado', 'Optimización continua de la estrategia', 'Acompañamiento prioritario permanente'],
      },
    ],
  },
  {
    id: 'web',
    slug: 'nexa_web',
    label: 'NEXA Web',
    shortLabel: 'Web',
    color: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.3)',
    billing: 'Pago único',
    billingType: 'unico',
    tagline: 'Sitios web profesionales, sin mensualidad.',
    tiers: [
      {
        id: 'web-basico',
        name: 'Básico',
        amount: 99000,
        suffix: 'pago único',
        badge: false,
        features: ['Sitio de hasta 5 secciones', 'Diseño moderno responsive', 'Formulario de contacto', 'Integración con redes sociales', 'SEO básico'],
      },
      {
        id: 'web-profesional',
        name: 'Profesional',
        amount: 159000,
        suffix: 'pago único',
        badge: true,
        features: ['Hasta 10 secciones', 'Diseño premium', 'Formulario + integración WhatsApp', 'SEO avanzado', 'Blog autoadministrable', 'Integración con redes sociales', 'Analíticas y reportes básicos'],
      },
      {
        id: 'web-avanzado',
        name: 'Avanzado',
        amount: 249000,
        suffix: 'pago único',
        badge: false,
        features: ['Secciones ilimitadas', 'Diseño premium 100% personalizado', 'E-commerce', 'SEO avanzado', 'Blog autoadministrable', 'Integraciones avanzadas', 'Soporte prioritario', 'Prevención y seguridad'],
      },
    ],
    footnote: 'Aceptamos todos los medios de pago: Visa, Mastercard, Amex, Mercado Pago y Naranja X. Pagando por transferencia bancaria tenés 10% de descuento.',
  },
  {
    id: 'social',
    slug: 'redes_sociales',
    label: 'NEXA Social',
    shortLabel: 'Social',
    color: '#EAA1FB',
    accent: 'rgba(234,161,251,0.12)',
    border: 'rgba(234,161,251,0.3)',
    billing: 'Plan mensual',
    billingType: 'mensual',
    tagline: 'Gestión profesional de redes sociales.',
    tiers: [
      {
        id: 'social-start',
        name: 'Start',
        amount: 119900,
        suffix: '/mes',
        badge: false,
        features: ['Estrategia inicial de contenidos', 'Calendario mensual', '8 publicaciones/mes', 'Diseño de piezas', 'Redacción de copys', 'Optimización de perfil', 'Historias destacadas', 'Reporte mensual', 'Recomendaciones', 'Acceso al portal cliente'],
      },
      {
        id: 'social-growth',
        name: 'Growth',
        amount: 219900,
        suffix: '/mes',
        badge: true,
        includesPrevious: 'Start',
        features: ['12 publicaciones/mes', 'Stories estratégicas', 'Reels/videos (hasta 4/mes)', 'Diseño premium', 'Estrategia de interacción', 'Análisis de competencia', 'Reporte quincenal', 'Contenido de valor', 'Campañas de interacción', 'Soporte prioritario'],
      },
      {
        id: 'social-scale',
        name: 'Scale',
        amount: 399900,
        suffix: '/mes',
        badge: false,
        includesPrevious: 'Growth',
        features: ['20 publicaciones/mes', 'Reels ilimitados', 'Estrategia de contenidos avanzada', 'Campañas de conversión en redes', 'Segmentación y remarketing', 'Community management dedicado', 'Automatizaciones avanzadas', 'Reporte semanal', 'Estrategias multicanal', 'Soporte VIP'],
      },
    ],
  },
  {
    id: 'ads',
    slug: 'meta_ads',
    label: 'NEXA Ads',
    shortLabel: 'Ads',
    color: '#FE8FD9',
    accent: 'rgba(254,143,217,0.14)',
    border: 'rgba(254,143,217,0.35)',
    billing: 'Plan mensual',
    billingType: 'mensual',
    tagline: 'Publicidad en Meta Ads orientada a resultados.',
    tiers: [
      {
        id: 'ads-start',
        name: 'Start',
        amount: 149900,
        suffix: '/mes',
        badge: false,
        features: ['Auditoría inicial', '1 campaña activa', 'Segmentación básica', 'Diseño de anuncios y copys', 'Optimización semanal', 'Reporte de resultados', 'Seguimiento estratégico', 'Recomendaciones', 'Acceso al portal cliente'],
      },
      {
        id: 'ads-growth',
        name: 'Growth',
        amount: 299900,
        suffix: '/mes',
        badge: true,
        includesPrevious: 'Start',
        features: ['Hasta 3 campañas simultáneas', 'Campañas de WhatsApp/formularios', 'Remarketing', 'Públicos personalizados', 'Optimización diaria', 'Pruebas A/B', 'Análisis de competencia', 'Dashboard de métricas', 'Reportes avanzados', 'Seguimiento prioritario', 'Estrategia trimestral', 'Ajustes permanentes'],
      },
      {
        id: 'ads-scale',
        name: 'Scale',
        amount: 549900,
        suffix: '/mes',
        badge: false,
        includesPrevious: 'Growth',
        features: ['Campañas ilimitadas', 'Embudos de venta completos', 'Captación de leads avanzada', 'Estrategias de conversión', 'Automatizaciones comerciales', 'Optimización 24/7', 'Análisis profundo de datos', 'Dashboard personalizado', 'Estrategias de escalado', 'Acompañamiento prioritario', 'Planificación comercial mensual', 'Implementación de nuevas oportunidades'],
      },
    ],
  },
  {
    id: 'recover',
    slug: 'nexa_recover',
    label: 'NEXA Recover',
    shortLabel: 'Recover',
    color: '#D2F23A',
    accent: 'rgba(210,242,58,0.12)',
    border: 'rgba(210,242,58,0.3)',
    billing: 'Plan mensual',
    billingType: 'mensual',
    tagline: 'Reactivación de clientes inactivos y leads perdidos.',
    tiers: [
      {
        id: 'recover-start',
        name: 'Start',
        amount: 149900,
        suffix: '/mes',
        badge: false,
        features: ['Hasta 500 contactos', 'Limpieza de base de datos', 'Segmentación inicial', 'Automatización básica', 'Recuperación de consultas', 'Seguimiento por WhatsApp', 'Reporte mensual', 'Dashboard básico'],
      },
      {
        id: 'recover-growth',
        name: 'Growth',
        amount: 349900,
        suffix: '/mes',
        badge: true,
        includesPrevious: 'Start',
        features: ['Hasta 2.000 contactos', 'Recuperación de presupuestos', 'Automatizaciones avanzadas', 'Estrategias de recompra', 'Segmentación avanzada', 'Seguimiento multicanal', 'Dashboard avanzado', 'Reportes quincenales', 'Optimización continua', 'Soporte prioritario'],
      },
      {
        id: 'recover-scale',
        name: 'Scale',
        amount: 699900,
        suffix: '/mes',
        badge: false,
        includesPrevious: 'Growth',
        features: ['Más de 5.000 contactos', 'Automatizaciones empresariales', 'Flujos personalizados', 'Recuperación avanzada de clientes', 'Estrategias de retención', 'Programas de fidelización', 'Dashboard ejecutivo', 'Integraciones con CRM', 'Seguimiento comercial avanzado', 'Reportes semanales', 'Soporte VIP'],
      },
    ],
  },
  {
    id: 'crm',
    slug: 'crm_seguimiento',
    label: 'CRM y Seguimiento',
    shortLabel: 'CRM',
    color: '#835CE6',
    accent: 'rgba(131,92,230,0.12)',
    border: 'rgba(131,92,230,0.3)',
    billing: 'Plan mensual',
    billingType: 'mensual',
    tagline: 'Sistemas de seguimiento comercial para que ningún lead se pierda.',
    tiers: [
      {
        id: 'crm-start',
        name: 'Start',
        amount: 149900,
        suffix: '/mes',
        badge: false,
        features: ['Implementación de CRM hasta 500 contactos', 'Migración y organización de tu base de leads', 'Embudo de ventas configurado por etapa', 'Automatización básica de seguimiento por WhatsApp', 'Alertas de leads sin respuesta', 'Capacitación inicial del equipo', 'Reporte mensual de conversión', 'Dashboard básico'],
      },
      {
        id: 'crm-growth',
        name: 'Growth',
        amount: 349900,
        suffix: '/mes',
        badge: true,
        includesPrevious: 'Start',
        features: ['Hasta 2.000 contactos', 'Automatización avanzada por WhatsApp y Email', 'Múltiples embudos por producto/servicio', 'Segmentación y etiquetado avanzado de leads', 'Alertas y recordatorios inteligentes', 'Reportes quincenales de conversión', 'Dashboard avanzado del equipo comercial', 'Soporte prioritario'],
      },
      {
        id: 'crm-scale',
        name: 'Scale',
        amount: 699900,
        suffix: '/mes',
        badge: false,
        includesPrevious: 'Growth',
        features: ['Más de 5.000 contactos', 'Automatizaciones comerciales empresariales', 'Integraciones con otras herramientas (Ads, Web, Social)', 'Flujos personalizados por segmento', 'Capacitación continua del equipo', 'Dashboard ejecutivo en tiempo real', 'Reportes semanales de performance', 'Soporte VIP'],
      },
    ],
  },
];

/* Precio formateado para mostrar en pantalla, ej: "$149.900". */
export function planPriceLabel(tier) {
  return formatPlanPrice(tier.amount);
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

    return {
      planId: tier.id,
      tierName: tier.name,
      amount: tier.amount,
      billing: line.billingType,
      lineId: line.id,
      lineSlug: line.slug,
      lineTitle: `NEXA ${line.shortLabel}`,
      // Etiqueta que se muestra al cliente y viaja en los emails.
      planLabel: `${tier.name} — NEXA ${line.shortLabel}`,
    };
  }
  return null;
}

/* Todos los identificadores válidos, para chequeos y tests. */
export function listServicePlanIds() {
  return SERVICE_LINES.flatMap((line) => line.tiers.map((t) => t.id));
}
