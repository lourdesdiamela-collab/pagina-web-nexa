import { NextResponse } from 'next/server';
import { saveLead, markLeadSynced } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';
import { sendMail } from '@/lib/mailer';
import { enviarLeadAlCrm } from '@/lib/crmSync';
import { describirOrigen } from '@/lib/origen';

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ['name', 'email', 'phone', 'service'];
    const missing = required.filter((field) => !String(body[field] || '').trim());

    if (missing.length > 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    // De qué campaña/anuncio viene la consulta (herramienta #8 del plan de
    // automatización). Lo manda el formulario del navegador, que lo capturó de
    // los parámetros UTM de la URL. Si no hay nada, queda "Directo".
    const origen = describirOrigen(body.origen);

    // 1. Guardar el lead en la base del sitio (tabla Lead, ver lib/crm.js).
    //    saveLead nunca lanza: si la base falla, loguea y devuelve el lead en
    //    memoria para que el formulario no se le rompa al visitante.
    const lead = await saveLead({
      name: body.name,
      email: body.email,
      company: body.company || 'No especificado',
      phone: body.phone,
      service: body.service,
      challenge: body.challenge,
      source: 'formulario_contacto',
    });

    /*
     * 2. Enviar el lead al CRM.
     *
     * ANTES acá había un `fetch` escrito a mano que NO mandaba el header
     * `x-site-secret`. Venía de cuando /api/leads del CRM no verificaba nada.
     * Cuando el CRM se cerró con verifySiteSecret, esta llamada empezó a
     * recibir 401 (o 503 si el secreto no está cargado) y TODOS los leads del
     * formulario quedaban sin sincronizar, en silencio.
     *
     * Ahora usa enviarLeadAlCrm de lib/crmSync.js, que es el mismo camino
     * autenticado que ya usaban los pagos y el arrepentimiento.
     */
    const crmRes = await enviarLeadAlCrm({
      nombre: body.name,
      email: body.email,
      telefono: body.phone,
      empresa: body.company,
      mensaje: `[Servicio: ${body.service}] — ${body.challenge ?? 'Sin detalle'}\n[Origen: ${origen}]`,
    });

    const crmSuccess = crmRes.ok;

    if (crmSuccess) {
      // Queda registrado en la base del sitio que este lead ya viajó al CRM.
      // Los que quedan en false son los que hay que pasar a mano.
      await markLeadSynced(lead?.id);
      console.log('Lead registrado exitosamente en el CRM centralizado.');
    } else {
      console.error('El CRM no aceptó el lead:', crmRes.error);
    }

    // 3. Notificación interna por eventos
    try {
      await notifyEvent({
        type: 'contacto_entrante',
        title: 'Nuevo contacto desde la web',
        message: `${lead.name} de ${lead.company} envió una consulta (CRM: ${crmSuccess ? 'Sincronizado' : 'Pendiente'}).`,
        details: {
          nombre: lead.name,
          empresa: lead.company,
          email: lead.email,
          servicio: lead.service,
          crmStatus: crmSuccess ? 'ok' : 'failed',
        },
      });
    } catch (notifyErr) {
      console.error('Error en notifyEvent:', notifyErr);
    }

    // 4. Envío de correos (sendMail nunca tira: si GMAIL_USER/GMAIL_APP_PASSWORD
    //    no están configuradas, loguea y sigue — ver lib/mailer.js).

    // Notificación interna a NEXA
    await sendMail({
      to: process.env.CONTACT_EMAIL || 'hola@nexaarg.com',
      fromName: 'NEXA Web',
      subject: `Nueva consulta de ${body.name}${body.company ? ' - ' + body.company : ''}`,
      html: `
        <h2>Nueva consulta desde la web</h2>
        <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td><strong>Nombre</strong></td><td>${body.name}</td></tr>
          <tr><td><strong>Empresa</strong></td><td>${body.company || 'No especificado'}</td></tr>
          <tr><td><strong>Email</strong></td><td>${body.email}</td></tr>
          <tr><td><strong>Teléfono</strong></td><td>${body.phone || '—'}</td></tr>
          <tr><td><strong>Servicio</strong></td><td>${body.service}</td></tr>
          <tr><td><strong>Detalles del diagnóstico</strong></td><td>${body.challenge || '—'}</td></tr>
          <tr><td><strong>Estado de Sincronización CRM</strong></td><td>${crmSuccess ? 'Exitosa (leads)' : 'Fallida / Pendiente de carga manual'}</td></tr>
        </table>
      `,
    });

    // Email de confirmación al lead
    await sendMail({
      to: body.email,
      fromName: 'NEXA',
      subject: '¡Recibimos tu solicitud de diagnóstico! — NEXA',
      html: `
        <p>Hola ${body.name},</p>
        <p>Gracias por ponerte en contacto con NEXA. Recibimos tus datos para la solicitud de diagnóstico técnico.</p>
        <p>
          <strong>Servicio seleccionado:</strong> ${body.service}${body.company ? `<br/><strong>Negocio:</strong> ${body.company}` : ''}
        </p>
        <p>Un consultor de nuestro equipo analizará la información y se contactará con vos para coordinar el paso siguiente.</p>
        <p>— El equipo de NEXA</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado. El equipo de NEXA te contactará pronto.',
      crmSynced: crmSuccess,
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje.' }, { status: 500 });
  }
}
