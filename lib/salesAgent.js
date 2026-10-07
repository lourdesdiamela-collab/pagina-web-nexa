/*
 * Agente de ventas del sitio (automatización de la venta).
 *
 * Es el chat que aparece en el sitio para quien llega desde una campaña:
 * responde dudas sobre los servicios, recomienda un plan según lo que la
 * persona cuenta y le pasa el link de pago del plan elegido. Si la persona deja
 * su nombre y su email, se guarda como lead (base del sitio + CRM), con la
 * campaña de la que vino.
 *
 * Usa la API de Claude (Anthropic). Sin ANTHROPIC_API_KEY en Vercel el chat no
 * se muestra y el sitio sigue igual que antes: nada se rompe.
 *
 * Reglas del agente (en el prompt): no inventa clientes, resultados, plazos ni
 * descuentos; los precios salen SOLO de lib/servicePlans.mjs; si no sabe algo,
 * deriva a WhatsApp.
 */

import { SERVICE_LINES, planPriceLabel } from './servicePlans.mjs';

export const SALES_AGENT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';
export const MAX_TURNOS = 30;
export const MAX_CARACTERES_MENSAJE = 1500;

export function salesAgentEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://nexagrowth.com.ar').replace(/\/+$/, '');
}

/* Catálogo en texto plano, armado desde la fuente única de precios. */
function catalogo() {
  return SERVICE_LINES.map((line) => {
    const planes = line.tiers
      .map((t) => {
        const features = (t.features || []).slice(0, 8).join('; ');
        return `  - ${t.name} (id: ${t.id}) — ${planPriceLabel(t)}${t.suffix || ''}. Incluye: ${features}`;
      })
      .join('\n');
    return `* ${line.label} (${line.billing}). ${line.tagline || ''}\n${planes}`;
  }).join('\n\n');
}

export function systemPrompt() {
  return `Sos el asesor comercial online de NEXA Growth, una agencia de marketing digital de Buenos Aires, Argentina. Hablás en español rioplatense (vos), cálido, claro y breve: 2 a 5 oraciones por respuesta, sin listas largas.

TU OBJETIVO: entender qué necesita la persona, recomendarle el plan que mejor le sirve y llevarla a contratar online. La contratación se hace en el link de pago del plan.

CATÁLOGO (única fuente de precios y alcances; no ofrezcas nada fuera de esto):
${catalogo()}

CÓMO TRABAJÁS:
1. Preguntá primero por el negocio: rubro, qué quiere lograr (más ventas, más consultas, redes, anuncios, web) y si ya invierte en publicidad. Una o dos preguntas por vez.
2. Recomendá UN plan concreto (o dos como mucho) y explicá en una oración por qué le sirve.
3. Cuando la persona quiera avanzar, pasale el link exacto de pago: ${siteUrl()}/servicios/checkout?plan=ID_DEL_PLAN (reemplazá ID_DEL_PLAN por el id del catálogo). Puede pagar con Mercado Pago o por transferencia con 10% de descuento.
4. Si la persona te da su nombre y su email (o pide que la contacten), usá la herramienta registrar_lead. Pedí el email solo si la persona no está lista para pagar todavía, para que el equipo le escriba.
5. Si pregunta algo que no está en el catálogo (precios especiales, plazos garantizados, casos puntuales), decí que lo ve el equipo y ofrecé WhatsApp: ${siteUrl()}/wa?from=agente_ventas

PROHIBIDO:
- Inventar clientes, casos de éxito, testimonios, métricas o resultados garantizados. NEXA es una agencia nueva: si preguntan por casos, decí que pueden ver el enfoque y el plan de trabajo, y que los resultados dependen de cada negocio.
- Inventar precios, descuentos, promociones o plazos que no estén arriba.
- Pedir datos de tarjetas, contraseñas o documentos.
- Hablar de temas que no tengan que ver con NEXA y sus servicios: reconducí la charla con amabilidad.

La inversión publicitaria en Meta o Google NO está incluida en los honorarios: la paga el cliente directo a cada plataforma. Aclaralo si hablan de anuncios.`;
}

export const SALES_AGENT_TOOLS = [
  {
    name: 'registrar_lead',
    description:
      'Guarda los datos de contacto de la persona para que el equipo de NEXA la contacte. Usala solo cuando la persona haya dado al menos su nombre y su email.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', description: 'Nombre de la persona' },
        email: { type: 'string', description: 'Email de la persona' },
        telefono: { type: 'string', description: 'Teléfono o WhatsApp, si lo dio' },
        empresa: { type: 'string', description: 'Nombre del negocio, si lo dio' },
        servicio: { type: 'string', description: 'Servicio o plan que le interesa (id del catálogo si lo hay)' },
        resumen: { type: 'string', description: 'Resumen en 1 a 3 oraciones de lo que necesita' },
      },
      required: ['nombre', 'email', 'resumen'],
    },
  },
];

/* Normaliza el historial que manda el navegador: solo texto, roles válidos, tope de largo. */
export function limpiarHistorial(mensajes) {
  if (!Array.isArray(mensajes)) return [];
  const limpio = [];
  for (const m of mensajes.slice(-MAX_TURNOS)) {
    const role = m?.role === 'assistant' ? 'assistant' : m?.role === 'user' ? 'user' : null;
    const content = typeof m?.content === 'string' ? m.content.trim().slice(0, MAX_CARACTERES_MENSAJE) : '';
    if (!role || !content) continue;
    // La API exige alternar roles: si se repite, se une al anterior.
    const ultimo = limpio[limpio.length - 1];
    if (ultimo && ultimo.role === role) ultimo.content += `\n${content}`;
    else limpio.push({ role, content });
  }
  // La conversación tiene que empezar con el usuario.
  while (limpio.length && limpio[0].role !== 'user') limpio.shift();
  return limpio;
}

/* Llamada a la API de mensajes de Anthropic (sin SDK, con fetch). */
export async function llamarClaude({ messages }) {
  const base = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
  const res = await fetch(`${base}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: SALES_AGENT_MODEL,
      max_tokens: 700,
      system: systemPrompt(),
      tools: SALES_AGENT_TOOLS,
      messages,
    }),
    signal: AbortSignal.timeout(25000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detalle = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(`Anthropic: ${detalle}`);
  }
  return data;
}
