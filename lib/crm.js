import { prisma } from '@/lib/db';

/*
 * Guardado de leads del sitio.
 *
 * ANTES esto era un stub que no guardaba nada:
 *
 *     export async function saveLead(data) {
 *       return { ...data, createdAt: new Date().toISOString() };
 *     }
 *
 * Devolvía el objeto y se terminaba ahí. Todos los leads que entraron por el
 * sitio existían únicamente en los emails que le llegaban a Lu: si un mail
 * rebotaba o caía en spam, ese lead se perdía sin dejar rastro.
 *
 * AHORA cada lead se guarda en la tabla `Lead` de la base del sitio.
 *
 * SOBRE EL CRM: el CRM de NEXA (repo Nexa-CRM) es un sistema aparte, con su
 * propia base de datos. El sitio y el CRM no comparten base, así que acá se
 * guarda en la base del sitio y queda pendiente sincronizarlo. La ruta
 * /api/contact ya intenta empujar el lead al CRM por su API pública; el campo
 * `syncedToCrm` deja registrado si esa sincronización funcionó. Los leads con
 * syncedToCrm = false son los que hay que pasar al CRM cuando la integración
 * esté hecha.
 *
 * No se inventa ninguna integración externa ni se usa ninguna credencial.
 */

function limpiar(valor, maxLargo = 500) {
  if (valor === null || valor === undefined) return null;
  const texto = String(valor).trim();
  if (!texto) return null;
  return texto.slice(0, maxLargo);
}

export async function saveLead(data = {}) {
  const lead = {
    name: limpiar(data.name, 200) || 'Sin nombre',
    email: limpiar(data.email, 200) || '',
    phone: limpiar(data.phone, 60),
    company: limpiar(data.company, 200),
    service: limpiar(data.service, 120),
    message: limpiar(data.challenge ?? data.message, 4000),
    source: limpiar(data.source, 60) || 'formulario_contacto',
    reference: limpiar(data.reference, 60),
    planId: limpiar(data.planId, 60),
    amount: Number.isFinite(Number(data.amount)) ? Math.round(Number(data.amount)) : null,
    termsAcceptedAt: data.termsAcceptedAt ? new Date(data.termsAcceptedAt) : null,
    termsAcceptedIp: limpiar(data.termsAcceptedIp, 100),
    termsVersion: limpiar(data.termsVersion, 60),
    syncedToCrm: data.syncedToCrm === true,
  };

  try {
    const guardado = await prisma.lead.create({ data: lead });
    return guardado;
  } catch (error) {
    /*
     * Si la base no está disponible (por ejemplo, migraciones sin correr), NO
     * se tira abajo el formulario: el visitante ya escribió sus datos y no
     * tiene por qué ver un error. Se loguea fuerte para que quede rastro y se
     * devuelve el lead en memoria, así el resto del flujo (emails, avisos)
     * sigue funcionando.
     */
    console.error(
      '[crm] NO SE PUDO GUARDAR EL LEAD EN LA BASE. Queda solo en el email. Datos:',
      { name: lead.name, email: lead.email, phone: lead.phone, source: lead.source },
      error,
    );
    return { ...lead, id: null, createdAt: new Date(), persistido: false };
  }
}

/* Marca un lead como ya sincronizado con el CRM central. */
export async function markLeadSynced(leadId) {
  if (!leadId) return null;
  try {
    return await prisma.lead.update({ where: { id: leadId }, data: { syncedToCrm: true } });
  } catch (error) {
    console.error('[crm] No se pudo marcar el lead como sincronizado:', error);
    return null;
  }
}

/* Leads pendientes de pasar al CRM. */
export async function listLeadsPendientesDeCrm(limite = 200) {
  try {
    return await prisma.lead.findMany({
      where: { syncedToCrm: false },
      orderBy: { createdAt: 'desc' },
      take: limite,
    });
  } catch (error) {
    console.error('[crm] No se pudieron listar los leads pendientes:', error);
    return [];
  }
}
