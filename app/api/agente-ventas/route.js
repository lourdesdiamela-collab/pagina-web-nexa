import { NextResponse } from 'next/server';
import { saveLead, markLeadSynced } from '@/lib/crm';
import { enviarLeadAlCrm } from '@/lib/crmSync';
import { notifyEvent } from '@/lib/notifications';
import { COOKIE_LAST, COOKIE_FIRST, readAttributionCookie, describeAttribution } from '@/lib/attribution';
import { salesAgentEnabled, limpiarHistorial, llamarClaude } from '@/lib/salesAgent';

/*
 * /api/agente-ventas — el chat comercial del sitio (ver lib/salesAgent.js).
 *
 * GET  → { enabled } para que el navegador sepa si mostrar el chat.
 * POST → { messages: [{role, content}] } y devuelve { reply }.
 *
 * Si el modelo usa la herramienta registrar_lead, el lead se guarda en la base
 * del sitio (source "agente_ventas", con la campaña de origen) y se manda al
 * CRM. Después el modelo recibe el resultado y contesta normalmente.
 */

export const dynamic = 'force-dynamic';

// Límite simple por IP para que nadie use el chat como API gratis de Claude.
// Es por instancia del servidor: alcanza para frenar abusos obvios.
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 40;
const usoPorIp = new Map();

function permitido(ip) {
  const ahora = Date.now();
  const previo = usoPorIp.get(ip);
  if (!previo || ahora - previo.desde > VENTANA_MS) {
    usoPorIp.set(ip, { desde: ahora, cantidad: 1 });
    return true;
  }
  previo.cantidad += 1;
  return previo.cantidad <= MAX_POR_VENTANA;
}

const RESPUESTA_FALLA =
  'Perdón, ahora no puedo responder. Escribinos por WhatsApp y te contestamos enseguida: /wa?from=agente_ventas_error';

function textoDe(respuesta) {
  return (respuesta?.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
}

async function registrarLead(input, request) {
  const nombre = String(input?.nombre || '').trim().slice(0, 200);
  const email = String(input?.email || '').trim().slice(0, 200);
  if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Falta un nombre o un email válido.' };
  }

  const last = readAttributionCookie(request.cookies.get(COOKIE_LAST)?.value);
  const first = readAttributionCookie(request.cookies.get(COOKIE_FIRST)?.value);
  const origen = describeAttribution(last, first);
  const resumen = String(input?.resumen || '').trim().slice(0, 1500);
  const mensaje = `[Agente de ventas] ${resumen}${origen ? `\n[Origen] ${origen}` : ''}`;

  let lead = null;
  try {
    lead = await saveLead({
      name: nombre,
      email,
      phone: input?.telefono,
      company: input?.empresa,
      service: input?.servicio,
      challenge: mensaje,
      source: 'agente_ventas',
    });
  } catch (error) {
    console.error('[agente-ventas] No se pudo guardar el lead:', error);
  }

  const crm = await enviarLeadAlCrm({
    nombre,
    email,
    telefono: input?.telefono,
    empresa: input?.empresa,
    mensaje: `${input?.servicio ? `[Servicio: ${input.servicio}] — ` : ''}${mensaje}`,
  });
  if (crm.ok) await markLeadSynced(lead?.id);
  else console.error('[agente-ventas] No se pudo mandar el lead al CRM:', crm.error);

  try {
    await notifyEvent({
      type: 'lead_agente_ventas',
      title: 'Nuevo lead desde el agente de ventas',
      message: `${nombre} (${email}) dejó sus datos en el chat del sitio. ${resumen}`,
      details: { origen, servicio: input?.servicio || null },
    });
  } catch (error) {
    console.error('[agente-ventas] Error en notifyEvent:', error);
  }

  return { ok: true };
}

export async function GET() {
  return NextResponse.json({ enabled: salesAgentEnabled() });
}

export async function POST(request) {
  if (!salesAgentEnabled()) {
    return NextResponse.json({ error: 'El chat no está disponible.' }, { status: 503 });
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'desconocida';
  if (!permitido(ip)) {
    return NextResponse.json({ reply: 'Recibimos muchos mensajes seguidos. Probá de nuevo en unos minutos o escribinos por WhatsApp: /wa?from=agente_ventas_limite' });
  }

  const body = await request.json().catch(() => ({}));
  const messages = limpiarHistorial(body?.messages);
  if (!messages.length) {
    return NextResponse.json({ error: 'Mensaje vacío.' }, { status: 400 });
  }

  try {
    let conversacion = [...messages];
    let respuesta = await llamarClaude({ messages: conversacion });

    // Hasta 2 rondas de herramientas (registrar_lead) por mensaje.
    for (let ronda = 0; ronda < 2 && respuesta?.stop_reason === 'tool_use'; ronda++) {
      const usos = (respuesta.content || []).filter((b) => b.type === 'tool_use');
      const resultados = [];
      for (const uso of usos) {
        const resultado = uso.name === 'registrar_lead'
          ? await registrarLead(uso.input, request)
          : { ok: false, error: 'Herramienta desconocida.' };
        resultados.push({ type: 'tool_result', tool_use_id: uso.id, content: JSON.stringify(resultado) });
      }
      conversacion = [
        ...conversacion,
        { role: 'assistant', content: respuesta.content },
        { role: 'user', content: resultados },
      ];
      respuesta = await llamarClaude({ messages: conversacion });
    }

    return NextResponse.json({ reply: textoDe(respuesta) || RESPUESTA_FALLA });
  } catch (error) {
    console.error('[agente-ventas] Error:', error?.message || error);
    return NextResponse.json({ reply: RESPUESTA_FALLA });
  }
}
