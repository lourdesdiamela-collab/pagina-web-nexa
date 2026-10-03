/*
 * Eventos de medición del sitio.
 *
 * track() deja cada evento en el dataLayer (lo lee Google Tag Manager, y desde
 * ahí GA4) y, si el Píxel de Meta está cargado, manda el evento estándar
 * equivalente. Si ninguno de los dos está configurado, no hace nada y no
 * rompe nada.
 *
 * Nombres de eventos (los mismos en todo el sitio):
 *   whatsapp_click  → clic en cualquier botón de WhatsApp   (Meta: Contact)
 *   generate_lead   → formulario enviado con éxito          (Meta: Lead)
 */

const META_EVENTS = {
  whatsapp_click: 'Contact',
  generate_lead: 'Lead',
};

export function track(event, params = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
    const metaEvent = META_EVENTS[event];
    if (metaEvent && typeof window.fbq === 'function') {
      window.fbq('track', metaEvent, params);
    }
  } catch (error) {
    // La medición nunca tiene que romper la página.
    console.warn('track() falló:', error);
  }
}
