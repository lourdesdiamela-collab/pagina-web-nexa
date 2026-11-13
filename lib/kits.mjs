/*
 * Kits IA que se pueden comprar online (Mercado Pago) y se entregan solos.
 *
 * El precio sale de ACÁ (nunca del navegador). Si se cambia, hay que cambiar
 * también el texto "$49.999" de app/soluciones-ia/page.js.
 *
 * Los archivos viven en kits-privados/<carpeta>/ (fuera de public/, así que no
 * se pueden bajar por URL directa) y se entregan solo con un enlace firmado
 * (ver lib/kitsAcceso.js y app/api/kits/archivo/route.js).
 */

export const KITS = {
  'whatsapp-instagram': {
    slug: 'whatsapp-instagram',
    titulo: 'WhatsApp e Instagram que venden',
    precio: 49999,
    carpeta: 'whatsapp-instagram',
    inicio: 'Mirá el video de bienvenida y abrí la guía interactiva. Empezá por la parte 1 y andá en orden: cada parte tiene textos listos para copiar.',
    archivos: [
      {
        id: 'guia',
        titulo: 'Guía interactiva',
        detalle: 'Con respuestas para copiar, calculadoras y planilla de leads. Se abre en el navegador.',
        archivo: 'guia-interactiva.html',
        tipo: 'text/html; charset=utf-8',
        descarga: 'NEXA-Kit-WhatsApp-Instagram-guia-interactiva.html',
        abrirOnline: true,
      },
      {
        id: 'pdf',
        titulo: 'Guía en PDF',
        detalle: 'Para leer en el celular o imprimir. Con índice y capítulos.',
        archivo: 'guia-pdf.pdf',
        tipo: 'application/pdf',
        descarga: 'NEXA-Kit-WhatsApp-Instagram-guia.pdf',
        abrirOnline: true,
      },
      {
        id: 'video',
        titulo: 'Video de bienvenida',
        detalle: 'Un recorrido corto para empezar por el lugar correcto.',
        archivo: 'video-bienvenida.mp4',
        tipo: 'video/mp4',
        descarga: 'NEXA-Kit-WhatsApp-Instagram-video.mp4',
        abrirOnline: true,
      },
    ],
  },
  'contenido': {
    slug: 'contenido',
    titulo: 'Contenido de un mes con IA',
    precio: 49999,
    carpeta: 'contenido',
    inicio: 'Mirá el video de bienvenida y abrí la guía interactiva. Empezá por la parte 1 y andá en orden: cada parte termina con algo armado. El PDF es el mismo contenido para leer en el celular.',
    archivos: [
      {
        id: 'guia',
        titulo: 'Guía interactiva',
        detalle: 'Con plantillas para copiar y herramientas para completar. Se abre en el navegador.',
        archivo: 'guia-interactiva.html',
        tipo: 'text/html; charset=utf-8',
        descarga: 'NEXA-Kit-Contenido-guia-interactiva.html',
        abrirOnline: true,
      },
      {
        id: 'pdf',
        titulo: 'Guía en PDF',
        detalle: 'Para leer en el celular o imprimir. Con índice y capítulos.',
        archivo: 'guia-pdf.pdf',
        tipo: 'application/pdf',
        descarga: 'NEXA-Kit-Contenido-guia.pdf',
        abrirOnline: true,
      },
      {
        id: 'video',
        titulo: 'Video de bienvenida',
        detalle: 'Un recorrido de un minuto por todo el kit, para empezar por el lugar correcto.',
        archivo: 'video-bienvenida.mp4',
        tipo: 'video/mp4',
        descarga: 'NEXA-Kit-Contenido-video.mp4',
        abrirOnline: true,
      },
    ],
  },
  'anuncios': {
    slug: 'anuncios',
    titulo: 'Anuncios en Meta y Google sin tirar plata',
    precio: 49999,
    carpeta: 'anuncios',
    inicio: 'Mirá el video de bienvenida y abrí la guía interactiva. Empezá por la parte 1 y andá en orden: cada parte termina con algo armado. El PDF es el mismo contenido para leer en el celular.',
    archivos: [
      {
        id: 'guia',
        titulo: 'Guía interactiva',
        detalle: 'Con plantillas para copiar y herramientas para completar. Se abre en el navegador.',
        archivo: 'guia-interactiva.html',
        tipo: 'text/html; charset=utf-8',
        descarga: 'NEXA-Kit-Anuncios-guia-interactiva.html',
        abrirOnline: true,
      },
      {
        id: 'pdf',
        titulo: 'Guía en PDF',
        detalle: 'Para leer en el celular o imprimir. Con índice y capítulos.',
        archivo: 'guia-pdf.pdf',
        tipo: 'application/pdf',
        descarga: 'NEXA-Kit-Anuncios-guia.pdf',
        abrirOnline: true,
      },
      {
        id: 'video',
        titulo: 'Video de bienvenida',
        detalle: 'Un recorrido de un minuto por todo el kit, para empezar por el lugar correcto.',
        archivo: 'video-bienvenida.mp4',
        tipo: 'video/mp4',
        descarga: 'NEXA-Kit-Anuncios-video.mp4',
        abrirOnline: true,
      },
    ],
  },
};

export function kitPorSlug(slug) {
  return Object.prototype.hasOwnProperty.call(KITS, slug) ? KITS[slug] : null;
}

export function kitPorTitulo(titulo) {
  return Object.values(KITS).find((k) => k.titulo === titulo) || null;
}

export function formatoPrecio(n) {
  return `$${Number(n).toLocaleString('es-AR')}`;
}
