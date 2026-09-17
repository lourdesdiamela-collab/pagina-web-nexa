import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generarYCrearCaso } from '@/lib/arrepentimiento';
import { sincronizarArrepentimiento } from '@/lib/crmSync';
import { sendMail } from '@/lib/mailer';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'hola@nexaarg.com';

function validar(body) {
  const errores = [];
  const nombre = String(body?.nombre || '').trim();
  const email = String(body?.email || '').trim();
  const identificacionCompra = String(body?.identificacionCompra || '').trim();

  if (!nombre) errores.push('nombre');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push('email válido');
  if (!identificacionCompra) errores.push('identificación de la compra');

  return errores;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 });
  }

  const errores = validar(body);
  if (errores.length > 0) {
    return NextResponse.json({ error: `Faltan datos: ${errores.join(', ')}.` }, { status: 400 });
  }

  const datos = {
    nombre: String(body.nombre).trim(),
    email: String(body.email).trim(),
    telefono: String(body.telefono || '').trim() || null,
    identificacionCompra: String(body.identificacionCompra).trim(),
    motivo: String(body.motivo || '').trim() || null,
  };

  let caso;
  try {
    caso = await generarYCrearCaso(datos);
  } catch (error) {
    console.error('POST /api/arrepentimiento — error al guardar el caso:', error);
    return NextResponse.json({ error: 'No pudimos registrar tu solicitud. Probá de nuevo en unos minutos.' }, { status: 500 });
  }

  const fechaTexto = new Date(caso.createdAt).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

  // Constancia automática al solicitante — no bloquea la respuesta si falla
  // (sendMail nunca tira, ver lib/mailer.js).
  await sendMail({
    to: datos.email,
    fromName: 'NEXA',
    subject: `Recibimos tu solicitud de arrepentimiento — #${caso.numero}`,
    html: `
      <p>Hola ${datos.nombre},</p>
      <p>Recibimos tu solicitud de arrepentimiento el ${fechaTexto} (hora Argentina). Tu número de trámite es <strong>${caso.numero}</strong> — guardalo para hacer cualquier consulta sobre el estado de tu pedido.</p>
      <p><strong>Compra o contratación identificada:</strong> ${datos.identificacionCompra}</p>
      ${datos.motivo ? `<p><strong>Motivo indicado:</strong> ${datos.motivo}</p>` : ''}
      <p>Vamos a procesar tu pedido y contactarte si necesitamos algún dato adicional.</p>
      <p>— El equipo de NEXA</p>
    `,
  });

  // Aviso interno a Lu, mismo canal que el resto de las notificaciones del
  // sitio (email a CONTACT_EMAIL).
  await sendMail({
    to: CONTACT_EMAIL,
    fromName: 'NEXA Web',
    subject: `Nueva solicitud de arrepentimiento — #${caso.numero}`,
    html: `
      <h2>Nueva solicitud de arrepentimiento</h2>
      <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td><strong>N° de trámite</strong></td><td>${caso.numero}</td></tr>
        <tr><td><strong>Fecha</strong></td><td>${fechaTexto}</td></tr>
        <tr><td><strong>Nombre</strong></td><td>${datos.nombre}</td></tr>
        <tr><td><strong>Email</strong></td><td>${datos.email}</td></tr>
        <tr><td><strong>Teléfono</strong></td><td>${datos.telefono || '—'}</td></tr>
        <tr><td><strong>Compra identificada</strong></td><td>${datos.identificacionCompra}</td></tr>
        <tr><td><strong>Motivo</strong></td><td>${datos.motivo || '—'}</td></tr>
      </table>
      <p>El caso ya quedó registrado. Gestionalo desde el CRM (Solicitudes de arrepentimiento).</p>
    `,
  });

  const sync = await sincronizarArrepentimiento({ numero: caso.numero, ...datos });

  await prisma.arrepentimientoRequest.update({
    where: { id: caso.id },
    data: {
      syncedToCrm: sync.ok,
      syncError: sync.ok ? null : sync.error || 'Error desconocido al sincronizar con el CRM.',
    },
  });

  return NextResponse.json({ success: true, numero: caso.numero, crmSynced: sync.ok });
}
