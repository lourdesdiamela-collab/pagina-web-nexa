const ARTICLES = [
  {
    slug: 'contenido-sin-ventas',
    title: 'Por que tu contenido no esta generando ventas',
    summary: 'Un plan concreto para pasar de likes sueltos a conversaciones comerciales y cierres reales.',
    category: 'Redes sociales',
    readTime: '7 min',
    publishedAt: '2026-03-08',
    cover: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1400&q=80',
    sections: [
      { type: 'p', content: 'Si tu marca publica seguido pero no recibe consultas de calidad, el problema no es la frecuencia. El problema es la arquitectura del mensaje.' },
      { type: 'h2', content: 'Diagnostico rapido' },
      {
        type: 'list',
        items: [
          'Tus posteos explican que haces, pero no el resultado que promete tu servicio.',
          'No hay llamados a la accion concretos ni una oferta clara para iniciar contacto.',
          'No existe continuidad entre redes, formulario y seguimiento comercial.',
        ],
      },
      { type: 'quote', content: 'Un buen contenido atrae atencion. Un buen sistema convierte atencion en negocio.' },
      { type: 'h2', content: 'Plan de 14 dias para corregirlo' },
      {
        type: 'list',
        items: [
          'Publica 3 piezas de autoridad (caso, metodo, error frecuente).',
          'Publica 2 piezas de prueba social (resultado con contexto).',
          'Publica 2 piezas de conversion (oferta, plazo, CTA directo a reunion).',
          'Mide solo 3 metricas: mensajes calificados, reuniones agendadas y tasa de cierre.',
        ],
      },
      { type: 'callout', title: 'Tip NEXA', content: 'Si un post no responde para quien es, que cambia y cual es el siguiente paso, no esta listo para publicar.' },
    ],
  },
  {
    slug: 'marca-profesional',
    title: 'Que necesita una marca para verse profesional hoy',
    summary: 'Los seis pilares que elevan percepcion, confianza y ticket promedio.',
    category: 'Marca',
    readTime: '8 min',
    publishedAt: '2026-03-12',
    cover: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1400&q=80',
    sections: [
      { type: 'p', content: 'La percepcion digital define el nivel de confianza con el que llega un cliente potencial. Si la experiencia visual es inconsistente, la venta empieza cuesta arriba.' },
      {
        type: 'list',
        items: [
          'Sistema visual coherente en web, redes y documentos.',
          'Mensajes claros por tipo de cliente y etapa de compra.',
          'Casos con datos verificables, no solo frases aspiracionales.',
          'Proceso de contacto simple: menos campos, mejor respuesta.',
          'Pruebas de velocidad y legibilidad en mobile.',
          'Seguimiento comercial en menos de 24 horas.',
        ],
      },
      { type: 'h2', content: 'Checklist operativo mensual' },
      {
        type: 'list',
        items: [
          'Audita links rotos, formularios y CTA activos.',
          'Revisa consistencia de tono en todas las paginas.',
          'Actualiza portafolio con resultados recientes.',
          'Depura contenido viejo que no representa tu nivel actual.',
        ],
      },
    ],
  },
  {
    slug: 'errores-meta-ads',
    title: 'Errores frecuentes en Meta Ads que elevan el CPL',
    summary: 'Como ajustar estructura, audiencias y creatividades para reducir costo por lead.',
    category: 'Campanas',
    readTime: '9 min',
    publishedAt: '2026-03-16',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80',
    sections: [
      { type: 'p', content: 'Cuando el CPL sube, la causa no suele ser una sola. Normalmente es la combinacion de segmentacion amplia, creatividades repetidas y objetivo mal elegido.' },
      { type: 'h2', content: 'Tres errores costosos' },
      {
        type: 'list',
        items: [
          'Poner todo el presupuesto en una sola campana sin hipotesis comparables.',
          'Escalar inversion sin validar calidad de leads ni tasa de cierre.',
          'Cambiar demasiadas variables al mismo tiempo y perder lectura de rendimiento.',
        ],
      },
      { type: 'h2', content: 'Marco de optimizacion semanal' },
      {
        type: 'list',
        items: [
          'Pausa anuncios con frecuencia alta y CTR en caida.',
          'Duplica anuncios ganadores cambiando solo una variable por test.',
          'Alinea objetivo de campana con objetivo comercial real.',
        ],
      },
      { type: 'callout', title: 'Regla practica', content: 'No escales presupuesto si el equipo comercial no puede absorber la demanda sin perder calidad de respuesta.' },
    ],
  },
  {
    slug: 'orden-contactos',
    title: 'Como ordenar tus contactos y no perder oportunidades',
    summary: 'Un flujo comercial simple para captacion, seguimiento y cierre.',
    category: 'Ventas',
    readTime: '6 min',
    publishedAt: '2026-03-19',
    cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&q=80',
    sections: [
      { type: 'p', content: 'El mayor problema comercial en pymes no es la falta de leads. Es la falta de sistema para responder, priorizar y dar seguimiento.' },
      { type: 'h2', content: 'Estructura minima recomendada' },
      {
        type: 'list',
        items: [
          'Estado del lead: nuevo, contactado, propuesta, cierre, perdido.',
          'Proximo paso con fecha y responsable obligatorio.',
          'Registro de contexto: origen, interes, urgencia y objecion principal.',
        ],
      },
      { type: 'quote', content: 'Lo que no tiene proximo paso termina en olvido.' },
      { type: 'p', content: 'Define un bloque fijo diario de seguimiento. La constancia en el seguimiento suele tener mas impacto que sumar nuevos leads sin orden.' },
    ],
  },
  {
    slug: 'antes-invertir-ads',
    title: 'Que revisar antes de invertir en publicidad',
    summary: 'Condiciones minimas para que la inversion en ads no se desperdicie.',
    category: 'Marketing',
    readTime: '5 min',
    publishedAt: '2026-03-22',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&q=80',
    sections: [
      { type: 'p', content: 'La publicidad acelera lo que ya funciona. Si la propuesta de valor o la atencion comercial fallan, los anuncios solo amplifican el problema.' },
      {
        type: 'list',
        items: [
          'Oferta clara en una frase.',
          'Landing con mensaje alineado al anuncio.',
          'Formulario corto y validado.',
          'Tiempo de respuesta comercial definido.',
          'Tablero con metricas base: CPL, tasa de reunion y tasa de cierre.',
        ],
      },
      { type: 'callout', title: 'Minimo viable', content: 'Si no podes responder un lead en menos de 4 horas habiles, optimiza operacion antes de escalar anuncios.' },
    ],
  },
  {
    slug: 'presencia-redes-constancia',
    title: 'Presencia en redes: sistema para sostener constancia',
    summary: 'Un modelo simple para publicar mejor, medir mejor y vender mejor.',
    category: 'Redes sociales',
    readTime: '7 min',
    publishedAt: '2026-03-26',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1400&q=80',
    sections: [
      { type: 'p', content: 'La constancia no depende de creatividad infinita. Depende de procesos. Cuando hay sistema, el contenido deja de ser una carga y pasa a ser un activo comercial.' },
      { type: 'h2', content: 'Sistema 4x4 de produccion' },
      {
        type: 'list',
        items: [
          '4 temas de negocio por mes.',
          '4 formatos reutilizables por tema: reel, carrusel, historia, email.',
          'Calendario de publicaciones y responsable por etapa.',
          'Revision semanal con metricas y acciones de mejora.',
        ],
      },
      { type: 'p', content: 'Con este esquema, el equipo decide con datos que repetir, que ajustar y que eliminar. Menos improvisacion, mas resultados.' },
    ],
  },
];

export const ARTICLE_CATEGORIES = ['Todos', ...new Set(ARTICLES.map((article) => article.category))];

export function listArticles() {
  return [...ARTICLES].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleBySlug(slug) {
  return ARTICLES.find((article) => article.slug === slug) || null;
}
