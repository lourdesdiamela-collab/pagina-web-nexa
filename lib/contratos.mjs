/*
 * Contratos de servicio de NEXA, uno por línea del catálogo.
 *
 * Cada contrato = condiciones generales (iguales para todos) + condiciones
 * particulares del servicio. Los alcances de cada plan (piezas, campañas,
 * inversión gestionada) NO se escriben a mano: se leen de lib/servicePlans.mjs,
 * así el contrato y la página de Servicios nunca se contradicen.
 *
 * Se muestran en /contratos/[slug], se aceptan en el checkout y se mandan
 * completos en el mail de confirmación del pedido (ver lib/serviceCheckout.js).
 *
 * Si cambiás un texto, subí LEGAL_VERSION en lib/legal.mjs.
 */
import { SERVICE_LINES, SETUP_FEE, ADDONS } from './servicePlans.mjs';
import { LEGAL_VERSION, TITULAR, identificacionTitular } from './legal.mjs';

const pesos = (n) => `$${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)}`;
const linea = (id) => SERVICE_LINES.find((l) => l.id === id);
const addon = (texto) => ADDONS.find((a) => a.name.toLowerCase().includes(texto));

function planesDe(id) {
  const l = linea(id);
  return l.tiers.map((t) => `${t.name} — ${pesos(t.amount)}${l.billingType === 'mensual' ? ' por mes' : ' (pago único)'}: ${t.features.join('; ')}.`);
}

// ---------------------------------------------------------------- generales

function generalesInicio(nombreServicio, mensual) {
  return [
    {
      titulo: '1. Partes y aceptación',
      parrafos: [
        `Este contrato lo celebran ${identificacionTitular()}, y la persona o empresa que contrata ${nombreServicio} a través de ${TITULAR.sitio} (en adelante, "el Cliente").`,
        'El Cliente acepta este contrato al tildar la casilla de aceptación y confirmar el pedido en el sitio. La aceptación queda registrada con fecha, hora, dirección IP y versión del texto, y el Cliente recibe una copia completa por correo electrónico.',
        'Si el Cliente contrata en nombre de una empresa, declara que tiene facultades para obligarla.',
      ],
    },
    {
      titulo: '2. Cómo trabajamos',
      items: [
        'Todo el seguimiento es por escrito: el Portal de Clientes (' + TITULAR.portal + ') y el correo electrónico. No incluye reuniones periódicas; se puede sumar una sesión estratégica por videollamada como adicional.',
        'Nada se publica ni se lanza sin la aprobación del Cliente en el portal.',
        'Respondemos consultas en 1 día hábil y aplicamos los cambios pedidos en 2 días hábiles. Son días hábiles de lunes a viernes, sin contar feriados nacionales.',
        'Usamos herramientas de inteligencia artificial como apoyo para investigar, escribir y diseñar. Todo pasa por revisión antes de llegar al Cliente, y el Cliente decide qué se aprueba.',
      ],
    },
    {
      titulo: '3. Puesta en marcha',
      parrafos: mensual
        ? [
            `El primer mes de todo abono incluye la Puesta en marcha (${pesos(SETUP_FEE.amount)}, se paga una sola vez): ${SETUP_FEE.features.join('; ')}.`,
            'Está lista en 7 días hábiles, contados desde que el Cliente completa el formulario de inicio y entrega los accesos pedidos. Incluye 1 ronda de cambios. No incluye rediseño de logo ni manual de marca completo.',
          ]
        : [
            `El servicio incluye todo lo de la Puesta en marcha: ${SETUP_FEE.features.join('; ')}. No incluye rediseño de logo ni manual de marca completo.`,
          ],
    },
  ];
}

function generalesFin(mensual, desdeNumero) {
  let n = desdeNumero;
  const s = (titulo, contenido) => ({ titulo: `${n++}. ${titulo}`, ...contenido });
  const secciones = [
    s('Lo que tiene que hacer el Cliente', {
      items: [
        'Completar el formulario de inicio con información veraz y subir su logo, fotos y referencias.',
        'Dar los accesos que se piden en el portal (por ejemplo, compartir su página de Facebook, su Instagram y su cuenta publicitaria con el portfolio de NEXA en Meta Business). NEXA nunca pide contraseñas.',
        'Revisar y aprobar o pedir cambios en el portal. Mientras una entrega espera la respuesta del Cliente, los plazos de NEXA quedan en pausa.',
        'Garantizar que tiene derecho a usar los logos, fotos, videos, marcas y textos que entrega, y que sus productos, precios y promociones son legales y verdaderos. El Cliente es responsable por el contenido que aporta y por lo que ofrece a su público.',
      ],
    }),
    s('Cambios', {
      items: [
        'Cada pieza y cada calendario incluyen 1 ronda de cambios. Una ronda es un único pedido con todos los ajustes juntos.',
        `Cada ronda extra cuesta ${pesos(addon('ronda')?.amount || 9900)}.`,
        'Un cambio de idea, de tema o de oferta después de aprobado no es un cambio: es una pieza nueva y se cobra como adicional.',
        'Lo aprobado se considera definitivo.',
      ],
    }),
    s('Precio y pago', {
      items: mensual
        ? [
            'El precio es el publicado en el sitio al momento de contratar, en pesos argentinos. Se paga por adelantado con Mercado Pago o por transferencia bancaria (con transferencia hay 10% de descuento).',
            'El primer pago es el primer mes del abono más la Puesta en marcha. Después se paga cada mes por adelantado. NEXA manda el aviso y el link de pago antes de cada vencimiento.',
            'Si un pago se atrasa más de 5 días, el trabajo queda en pausa hasta que se regularice. Si se atrasa más de 15 días, NEXA puede dar de baja el servicio.',
            'NEXA puede actualizar el precio del abono avisando por escrito con 30 días de anticipación. Si el Cliente no está de acuerdo, puede darse de baja sin costo antes de que rija el precio nuevo.',
            'Lo que no se usa en el mes no se acumula para el siguiente. Si la demora fue por culpa de NEXA, lo que faltó se entrega al mes siguiente sin costo.',
            'La inversión en publicidad, las licencias de terceros, el hosting y la producción de video no están incluidos y los paga el Cliente.',
          ]
        : [
            'El precio es el publicado en el sitio al momento de contratar, en pesos argentinos, y se paga por adelantado con Mercado Pago o por transferencia bancaria (con transferencia hay 10% de descuento).',
            'Las licencias de terceros, el hosting, la publicidad y cualquier implementación técnica no están incluidos.',
          ],
    }),
  ];

  if (mensual) {
    secciones.push(
      s('Duración, renovación y baja', {
        items: [
          'El abono se renueva cada mes con el pago. La permanencia mínima es de 3 meses (el tiempo que necesita un plan de 90 días para dar resultados medibles). Después sigue mes a mes.',
          'Para darse de baja, el Cliente avisa con 15 días de anticipación al próximo vencimiento desde el botón "Baja de servicio" del sitio, por correo o desde el portal. Recibe una constancia con número de trámite dentro de las 24 horas.',
          'La baja corta los cobros siguientes. El mes ya pagado se termina de trabajar y no se reintegra (salvo el derecho de arrepentimiento del punto siguiente).',
          'NEXA también puede dar por terminado el servicio con 15 días de aviso, o de inmediato si el Cliente incumple este contrato (por ejemplo, contenido ilegal o falta de pago).',
        ],
      }),
    );
  }

  secciones.push(
    s('Derecho de arrepentimiento', {
      parrafos: [
        'Si el Cliente contrató como consumidor, puede arrepentirse dentro de los 10 días corridos desde la contratación, sin dar motivos y sin costo, desde el botón "Arrepentimiento" del sitio (artículo 34 de la Ley 24.240 y artículo 1110 del Código Civil y Comercial). Recibe una constancia con número de trámite dentro de las 24 horas y NEXA devuelve lo pagado por el mismo medio de pago.',
        mensual
          ? 'Al arrepentirse se cancela el abono y el Cliente deja de usar lo entregado hasta ese momento.'
          : 'Si dentro de ese plazo NEXA ya entregó el diagnóstico final, el servicio se considera prestado y no corresponde la devolución.',
      ],
    }),
    s('Propiedad de lo entregado', {
      items: [
        'Una vez pagadas, las piezas, textos, calendarios, campañas e informes hechos para el Cliente son del Cliente y puede usarlos libremente.',
        'Las plantillas, métodos, herramientas y sistemas de NEXA siguen siendo de NEXA.',
        'NEXA puede mostrar el trabajo realizado en su portfolio y redes, salvo que el Cliente pida por escrito que no lo haga.',
      ],
    }),
    s('Confidencialidad y datos', {
      parrafos: [
        'NEXA usa la información y los accesos del Cliente solo para prestar el servicio, no los comparte con terceros salvo los proveedores que necesita para trabajar, y los trata según la Política de Privacidad publicada en ' + TITULAR.sitio + '/privacidad. Al terminar el servicio, el Cliente puede quitar los accesos que dio.',
      ],
    }),
    s('Responsabilidad', {
      items: [
        'NEXA se compromete a trabajar con dedicación y profesionalismo (obligación de medios). No garantiza resultados de ventas, seguidores, alcance ni costo por consulta, porque dependen del mercado, de la oferta del Cliente y de las plataformas.',
        'Instagram, Facebook, Meta, Google y las demás plataformas son de terceros. NEXA no responde por sus cambios, caídas, rechazos de anuncios, bloqueos o suspensiones de cuentas que no hayan sido causados por NEXA.',
        'Salvo dolo o culpa grave, la responsabilidad total de NEXA frente al Cliente se limita a lo que el Cliente pagó en los últimos 3 meses de servicio. Esta limitación no se aplica en lo que la Ley 24.240 no la permita.',
      ],
    }),
    s('Cambios a este contrato', {
      parrafos: [
        'Si NEXA cambia este contrato, avisa por correo con 30 días de anticipación. Si el Cliente no está de acuerdo, puede darse de baja sin costo antes de que el cambio rija. Cada contratación queda sujeta a la versión que el Cliente aceptó.',
      ],
    }),
    s('Comunicaciones, reclamos y jurisdicción', {
      parrafos: [
        `Las comunicaciones son válidas por correo electrónico (NEXA: ${TITULAR.email}; el Cliente: el que cargó al contratar) y por el portal.`,
        'Los reclamos se reciben por esos mismos medios y se responden dentro de los 5 días hábiles. Si el Cliente es consumidor, también puede reclamar ante la autoridad de Defensa del Consumidor de su jurisdicción o en la plataforma nacional de Defensa del Consumidor (argentina.gob.ar).',
        `Este contrato se rige por las leyes de la República Argentina. Para cualquier conflicto son competentes los tribunales ordinarios de la ${TITULAR.ciudad}, salvo que el Cliente sea consumidor, en cuyo caso puede elegir los tribunales de su domicilio.`,
      ],
    }),
  );
  return secciones;
}

// ---------------------------------------------------------------- particulares

function particularesContenido(n) {
  const l = linea('social');
  const reel = addon('reel');
  const pieza = addon('pieza');
  const red = addon('red social');
  return [
    {
      titulo: `${n}. Qué incluye NEXA Contenido`,
      parrafos: ['Según el plan contratado:'],
      items: planesDe('social'),
    },
    {
      titulo: `${n + 1}. Cómo se produce cada mes`,
      items: [
        'Antes de cada mes, NEXA presenta en el portal el calendario con las publicaciones, sus textos (copys) y hashtags. El Cliente lo aprueba o pide cambios.',
        'Con el calendario aprobado, NEXA diseña las piezas (posts, carruseles e historias) con los colores, la tipografía y el logo del Cliente, y las presenta para su aprobación.',
        'Las piezas aprobadas se publican en las fechas del calendario. Si el Cliente compartió su página e Instagram con NEXA, las publica NEXA; si no, NEXA se las entrega listas para que las publique el Cliente.',
        'Formatos: posts de 1080 × 1350 px o 1080 × 1080 px y historias de 1080 × 1920 px.',
      ],
    },
    {
      titulo: `${n + 2}. Reels`,
      items: [
        'Los reels de los planes Crecimiento y Marca se editan con el material (videos y fotos) que manda el Cliente. NEXA no graba.',
        'Si el material no llega hasta 7 días antes de la fecha del reel, ese reel se reemplaza por una pieza estática.',
        `Reel extra: ${pesos(reel?.amount || 29900)} cada uno.`,
      ],
    },
    {
      titulo: `${n + 3}. Lo que no incluye`,
      items: [
        l.notIncludedLine,
        'Fotografía o grabación profesional, compra de imágenes o música con licencia paga, ni pauta publicitaria.',
        `Adicionales: pieza o historia extra ${pesos(pieza?.amount || 14900)}; red social adicional ${pesos(red?.amount || 79900)} por mes.`,
      ],
    },
    {
      titulo: `${n + 4}. Informe`,
      parrafos: ['Cada mes NEXA deja en el portal un informe por escrito con lo que se hizo, lo que quedó pendiente y lo que sigue.'],
    },
  ];
}

function particularesAnuncios(n) {
  const l = linea('ads');
  return [
    {
      titulo: `${n}. Qué incluye NEXA Anuncios`,
      parrafos: ['Campañas en Meta (Instagram y Facebook). Según el plan contratado:'],
      items: planesDe('ads'),
    },
    {
      titulo: `${n + 1}. Cómo se trabaja`,
      items: [
        'NEXA presenta en el portal la propuesta de campaña: objetivo, público, presupuesto sugerido, anuncios y textos. El Cliente la aprueba o pide cambios.',
        'Ninguna campaña se lanza ni aumenta su presupuesto sin la aprobación del Cliente.',
        'Con la campaña activa, NEXA la revisa y optimiza una vez por semana (públicos, anuncios y distribución del presupuesto dentro del monto aprobado).',
        'Los anuncios nuevos de cada mes siguen las mismas reglas de aprobación y cambios que el contenido.',
      ],
    },
    {
      titulo: `${n + 2}. La inversión en publicidad`,
      items: [
        'La inversión la paga el Cliente directamente a Meta con su propio medio de pago, cargado en su cuenta publicitaria. NEXA no recibe ni administra ese dinero.',
        'El monto de inversión gestionada de cada plan es el máximo que NEXA administra por mes. Si el Cliente quiere invertir más, se pasa al plan siguiente; en el plan Escala, arriba de $4.000.000 por mes se cobra el 10% de lo que exceda.',
        'El Cliente puede pausar las campañas cuando quiera avisando a NEXA. Pausar no suspende el abono.',
      ],
    },
    {
      titulo: `${n + 3}. Políticas de Meta`,
      items: [
        'Todos los anuncios tienen que cumplir las políticas de publicidad de Meta. Meta puede rechazar anuncios o restringir cuentas por decisión propia; NEXA ayuda a resolverlo, pero no controla esas decisiones.',
        'El Cliente es responsable por lo que ofrece en sus anuncios: precios, promociones, stock, condiciones y cumplimiento de las normas de su rubro.',
      ],
    },
    {
      titulo: `${n + 4}. Lo que no incluye`,
      items: [
        l.notIncludedLine,
        'Google Ads, TikTok u otras plataformas, diseño de páginas web o landings, y atención de los mensajes o consultas que generan los anuncios.',
      ],
    },
    {
      titulo: `${n + 5}. Informe`,
      parrafos: ['Cada mes NEXA deja en el portal un informe por escrito con la inversión, los resultados principales (alcance, clics, consultas o ventas, según el objetivo), lo aprendido y los próximos pasos.'],
    },
  ];
}

function particularesIntegral(n) {
  const contenido = particularesContenido(n + 2).slice(1, 3);
  const anuncios = particularesAnuncios(n + 2).slice(1, 4);
  let k = n + 2;
  const renumerar = (sec) => ({ ...sec, titulo: `${k++}. ${sec.titulo.replace(/^\d+\.\s*/, '')}` });
  return [
    {
      titulo: `${n}. Qué incluye NEXA Integral`,
      parrafos: ['Contenido y anuncios trabajando con el mismo mensaje. Según el plan contratado:'],
      items: planesDe('integral'),
    },
    {
      titulo: `${n + 1}. Cómo se combina`,
      items: [
        'El calendario de contenido y las campañas se planifican juntos, con un solo informe mensual.',
        'Cada trimestre se revisa y ajusta el plan de 90 días.',
        'A cada parte se le aplican las reglas que siguen.',
      ],
    },
    ...contenido.map((s) => renumerar({ ...s, titulo: `Contenido: ${s.titulo.replace(/^\d+\.\s*/, '')}` })),
    ...anuncios.map((s) => renumerar({ ...s, titulo: `Anuncios: ${s.titulo.replace(/^\d+\.\s*/, '')}` })),
    renumerar({ titulo: 'Lo que no incluye', items: [linea('integral').notIncludedLine, 'Fotografía o grabación, Google Ads u otras plataformas, diseño web y atención de mensajes.'] }),
  ];
}

function particularesDiagnostico(n) {
  const l = linea('proyectos');
  return [
    {
      titulo: `${n}. Qué incluye`,
      items: planesDe('proyectos'),
    },
    {
      titulo: `${n + 1}. Plazos y entrega`,
      items: [
        'La entrega final es en 10 días hábiles, contados desde que el Cliente completa el formulario de inicio y da acceso (o los links) a su web, su ficha de Google y sus redes.',
        'Todo se entrega por escrito en el portal. Incluye 1 ronda de cambios sobre los textos entregados.',
        'Es un proyecto de pago único: no se renueva ni genera cobros posteriores.',
      ],
    },
    {
      titulo: `${n + 2}. Lo que no incluye`,
      items: [l.notIncludedLine, 'Gestión mensual de redes o de anuncios (se pueden contratar después como abono).'],
    },
  ];
}

// ---------------------------------------------------------------- catálogo de contratos

const DEFINICIONES = [
  { slug: 'contenido', lineId: 'social', nombre: 'NEXA Contenido', mensual: true, particulares: particularesContenido },
  { slug: 'anuncios', lineId: 'ads', nombre: 'NEXA Anuncios', mensual: true, particulares: particularesAnuncios },
  { slug: 'integral', lineId: 'integral', nombre: 'NEXA Integral', mensual: true, particulares: particularesIntegral },
  { slug: 'diagnostico', lineId: 'proyectos', nombre: 'Diagnóstico y Orden Digital', mensual: false, particulares: particularesDiagnostico },
];

export const CONTRATOS = DEFINICIONES.map((d) => ({ slug: d.slug, lineId: d.lineId, nombre: d.nombre, mensual: d.mensual }));

export function getContrato(slug) {
  const d = DEFINICIONES.find((x) => x.slug === slug);
  if (!d) return null;
  const inicio = generalesInicio(d.nombre, d.mensual);
  const part = d.particulares(inicio.length + 1);
  const fin = generalesFin(d.mensual, inicio.length + part.length + 1);
  return {
    slug: d.slug,
    nombre: d.nombre,
    titulo: `Contrato de servicio — ${d.nombre}`,
    version: LEGAL_VERSION,
    secciones: [...inicio, ...part, ...fin],
  };
}

/* lineSlug del checkout (redes_sociales, meta_ads, ...) -> contrato */
export function contratoDeLinea(lineSlug) {
  const l = SERVICE_LINES.find((x) => x.slug === lineSlug);
  const d = l && DEFINICIONES.find((x) => x.lineId === l.id);
  return d ? getContrato(d.slug) : null;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* El contrato completo en HTML simple, para mandarlo en el mail. */
export function contratoAHtml(c) {
  const partes = [`<h2 style="font-size:18px">${esc(c.titulo)}</h2>`, `<p style="color:#666;font-size:12px">Versión ${esc(c.version)}</p>`];
  for (const s of c.secciones) {
    partes.push(`<h3 style="font-size:15px;margin:18px 0 6px">${esc(s.titulo)}</h3>`);
    for (const p of s.parrafos || []) partes.push(`<p style="margin:0 0 8px">${esc(p)}</p>`);
    if (s.items?.length) partes.push(`<ul style="margin:0 0 8px;padding-left:20px">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`);
  }
  return partes.join('\n');
}
