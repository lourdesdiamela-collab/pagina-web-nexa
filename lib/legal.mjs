/*
 * Datos legales de NEXA y versión vigente de los textos legales.
 *
 * Los usan /terminos, /privacidad, /contratos/* y el checkout (que registra
 * qué versión aceptó cada cliente). Todo lo que identifica al titular está
 * acá para cambiarlo en un solo lugar.
 *
 * PARA LU: cada vez que cambies algo de los Términos, la Política de
 * Privacidad o cualquier contrato, subí LEGAL_VERSION (la fecha del cambio).
 * Así cada contratación queda registrada con el texto que estaba vigente.
 */

export const LEGAL_VERSION = '2026-10-21';

export const TITULAR = {
  marca: 'NEXA Growth',
  nombre: 'Lourdes Diamela Alarcón',
  // Completar: el CUIT y el domicilio se muestran en todos los textos legales
  // apenas se cargan acá. Mientras estén vacíos, la línea no aparece.
  cuit: '',
  domicilio: '',
  ciudad: 'Ciudad Autónoma de Buenos Aires',
  email: 'nexagrowtharg@gmail.com',
  // Teléfono y WhatsApp de atención (el mismo número de lib/whatsapp.js).
  telefono: '+54 9 11 2452-7402',
  sitio: 'https://www.nexagrowth.com.ar',
  portal: 'https://crm.nexagrowth.com.ar',
};

/* "NEXA Growth, de Lourdes Diamela Alarcón (CUIT ...), con domicilio en ..." */
export function identificacionTitular() {
  const partes = [`${TITULAR.marca}, marca de ${TITULAR.nombre}`];
  if (TITULAR.cuit) partes.push(`CUIT ${TITULAR.cuit}`);
  partes.push(TITULAR.domicilio ? `con domicilio en ${TITULAR.domicilio}` : `con domicilio en la ${TITULAR.ciudad}`);
  return `${partes.join(', ')} (en adelante, "NEXA")`;
}

export function fechaVersion() {
  const [a, m, d] = LEGAL_VERSION.split('-').map(Number);
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(a, m - 1, d));
}
