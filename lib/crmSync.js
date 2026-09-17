/**
 * Alta automática por pago (herramienta #1 del brief de Fase 2 de Lu).
 *
 * Cuando el webhook de Mercado Pago aprueba un pago de un plan de servicio,
 * esto le avisa al CRM (Nexa-CRM) para que dé de alta al cliente solo, sin
 * que Lu tenga que generar un código de referencia a mano como hasta ahora.
 *
 * Autenticación: el CRM exige un secreto compartido en el header
 * `x-site-secret` (ver SITE_TO_CRM_SECRET en .env.example). Si la llamada
 * falla por lo que sea — el CRM caído, el secreto mal cargado, un timeout —
 * esta función devuelve el error en vez de tirarlo: quien la llama es
 * responsable de dejar el pago marcado como pendiente de sincronizar
 * (Lead.syncedToCrm = false) para que se pueda reintentar. Ver
 * app/api/mercadopago/webhook/route.js y app/aprende/admin/leads/page.js.
 */

function crmBaseUrl() {
  return process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.nexagrowth.com.ar';
}

/**
 * @param {object} datos
 * @param {string} datos.mpPaymentId
 * @param {string} [datos.reference]
 * @param {string} datos.lineSlug
 * @param {string} [datos.planId]
 * @param {string} [datos.planLabel]
 * @param {number} datos.monto
 * @param {string} datos.nombre
 * @param {string} datos.email
 * @param {string} [datos.telefono]
 * @param {string} [datos.empresa]
 * @returns {Promise<{ok: boolean, status?: number, error?: string, clientId?: string, duplicado?: boolean}>}
 */
export async function altaAutomaticaPorPago(datos) {
  const secret = process.env.SITE_TO_CRM_SECRET;
  if (!secret) {
    console.error('[crmSync] SITE_TO_CRM_SECRET no está configurada: no se puede sincronizar con el CRM.');
    return { ok: false, error: 'SITE_TO_CRM_SECRET no configurada en el sitio.' };
  }

  try {
    const res = await fetch(`${crmBaseUrl()}/api/integrations/pago-servicio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-site-secret': secret,
      },
      body: JSON.stringify({
        mpPaymentId: datos.mpPaymentId,
        reference: datos.reference ?? null,
        lineSlug: datos.lineSlug,
        planId: datos.planId ?? null,
        planLabel: datos.planLabel ?? null,
        monto: datos.monto,
        moneda: datos.moneda ?? 'ARS',
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono ?? null,
        empresa: datos.empresa ?? null,
      }),
      // Vercel corta funciones largas igual; un timeout corto evita que el
      // webhook de Mercado Pago quede colgado esperando al CRM.
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      return { ok: false, status: res.status, error: data.error || `El CRM respondió ${res.status}` };
    }

    return { ok: true, status: res.status, clientId: data.clientId, duplicado: !!data.duplicado };
  } catch (err) {
    console.error('[crmSync] No se pudo conectar con el CRM:', err.message);
    return { ok: false, error: `No se pudo conectar con el CRM: ${err.message}` };
  }
}

/**
 * Sincroniza una solicitud de arrepentimiento con el CRM (herramienta #10).
 * El CRM guarda su propia copia (idempotente por `numero`) para que Lu
 * pueda ver el caso y cambiarle el estado. Mismo criterio de "no caja
 * negra" que altaAutomaticaPorPago: si esto falla, quien llama es
 * responsable de dejar el caso marcado como pendiente de sincronizar.
 *
 * @param {object} datos
 * @param {string} datos.numero
 * @param {string} datos.nombre
 * @param {string} datos.email
 * @param {string} [datos.telefono]
 * @param {string} datos.identificacionCompra
 * @param {string} [datos.motivo]
 * @returns {Promise<{ok: boolean, status?: number, error?: string, casoId?: string}>}
 */
export async function sincronizarArrepentimiento(datos) {
  const secret = process.env.SITE_TO_CRM_SECRET;
  if (!secret) {
    console.error('[crmSync] SITE_TO_CRM_SECRET no está configurada: no se puede sincronizar con el CRM.');
    return { ok: false, error: 'SITE_TO_CRM_SECRET no configurada en el sitio.' };
  }

  try {
    const res = await fetch(`${crmBaseUrl()}/api/integrations/arrepentimiento`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-site-secret': secret,
      },
      body: JSON.stringify({
        numero: datos.numero,
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono ?? null,
        identificacionCompra: datos.identificacionCompra,
        motivo: datos.motivo ?? null,
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      return { ok: false, status: res.status, error: data.error || `El CRM respondió ${res.status}` };
    }

    return { ok: true, status: res.status, casoId: data.casoId };
  } catch (err) {
    console.error('[crmSync] No se pudo conectar con el CRM:', err.message);
    return { ok: false, error: `No se pudo conectar con el CRM: ${err.message}` };
  }
}
