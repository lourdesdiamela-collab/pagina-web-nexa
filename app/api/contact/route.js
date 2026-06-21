import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Destino de las notificaciones del formulario de contacto.
// Se puede sobreescribir con la variable de entorno NEXA_NOTIFICATION_EMAIL
// en Vercel; si no está seteada, cae en hola@nexaarg.com.
const NOTIFICATION_EMAIL = process.env.NEXA_NOTIFICATION_EMAIL || 'hola@nexaarg.com';

// Remitente de los emails enviados por Resend. Para que la entrega sea
// confiable (no termine en spam / rechazada) el dominio usado acá debe estar
// verificado en el panel de Resend. Configurable vía RESEND_FROM_EMAIL.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'NEXA Web <web@nexaarg.com>';

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ['name', 'email', 'company'];
    const missing = required.filter((field) => !String(body[field] || '').trim());

    if (missing.length > 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    const submission = {
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone || '—',
      service: body.service || '—',
      challenge: body.challenge || '—',
      timestamp: new Date().toISOString(),
    };

    // Siempre queda registrado en los logs de Vercel, incluso si el envío
    // por email falla o todavía no está configurado.
    console.log('🟢 New contact submission:', submission);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFICATION_EMAIL,
          replyTo: submission.email,
          subject: `Nueva consulta web — ${submission.company}`,
          text: [
            `Nombre: ${submission.name}`,
            `Email: ${submission.email}`,
            `Empresa: ${submission.company}`,
            `Teléfono: ${submission.phone}`,
            `Servicio: ${submission.service}`,
            `Desafío: ${submission.challenge}`,
            `Fecha: ${submission.timestamp}`,
          ].join('\n'),
          html: `
            <h2 style="margin:0 0 16px;font-family:sans-serif;">Nueva consulta — ${submission.company}</h2>
            <table style="font-family:sans-serif;font-size:14px;color:#12141D;">
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Nombre</td><td>${submission.name}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Email</td><td>${submission.email}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Empresa</td><td>${submission.company}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Teléfono</td><td>${submission.phone}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Servicio</td><td>${submission.service}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Desafío</td><td>${submission.challenge}</td></tr>
              <tr><td style="padding:4px 12px 4px 0;color:#828699;">Fecha</td><td>${submission.timestamp}</td></tr>
            </table>
          `,
        });
      } catch (emailError) {
        // No bloqueamos la respuesta al usuario si falla el envío del email;
        // la consulta ya quedó registrada en los logs de Vercel arriba.
        console.error('Resend error en /api/contact:', emailError);
      }
    } else {
      console.warn(
        'RESEND_API_KEY no está configurada — el mensaje NO se envió por email, solo quedó en los logs de Vercel.'
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado. El equipo de NEXA te contactará pronto.',
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje.' }, { status: 500 });
  }
}
