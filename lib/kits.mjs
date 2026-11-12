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
};

export function kitPorSlug(slug) {
  return Object.prototype.hasOwnProperty.call(KITS, slug) ? KITS[slug] : null;
}

export function formatoPrecio(n) {
  return `$${Number(n).toLocaleString('es-AR')}`;
}
