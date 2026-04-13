import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ['name', 'email', 'company', 'service'];
    const missing = required.filter((field) => !String(body[field] || '').trim());

    if (missing.length > 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    const lead = await saveLead({
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone,
      service: body.service,
      challenge: body.challenge,
    });

    await notifyEvent({
      type: 'contacto_entrante',
      title: 'Nuevo contacto desde la web',
      message: `${lead.name} de ${lead.company} envio una consulta.`,
      details: {
        nombre: lead.name,
        empresa: lead.company,
        email: lead.email,
        servicio: lead.service,
      },
    });

    // Internal notification email to NEXA
    await transporter.sendMail({
      from: `"NEXA Web" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'hola@nexaarg.com',
      subject: `Nueva consulta de ${body.name} - ${body.company}`,
      html: `
        <h2>Nueva consulta desde la web</h2>
        <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
          <tr><td><strong>Nombre</strong></td><td>${body.name}</td></tr>
          <tr><td><strong>Empresa</strong></td><td>${body.company}</td></tr>
          <tr><td><strong>Email</strong></td><td>${body.email}</td></tr>
          <tr><td><strong>Teléfono</strong></td><td>${body.phone || '—'}</td></tr>
          <tr><td><strong>Servicio</strong></td><td>${body.service}</td></tr>
          <tr><td><strong>Desafío / Mensaje</strong></td><td>${body.challenge || '—'}</td></tr>
        </table>
      `,
    });

    // Confirmation email to the user
    await transporter.sendMail({
      from: `"NEXA" <${process.env.GMAIL_USER}>`,
      to: body.email,
      subject: '¡Recibimos tu consulta! — NEXA',
      html: `
        <p>Hola ${body.name},</p>
        <p>Gracias por contactarte con NEXA. Recibimos tu consulta y nos pondremos en contacto a la brevedad.</p>
        <p>
          <strong>Servicio consultado:</strong> ${body.service}<br/>
          ${body.challenge ? `<strong>Tu mensaje:</strong> ${body.challenge}` : ''}
        </p>
        <p>— El equipo de NEXA</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado. El equipo de NEXA te contactara pronto.',
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje.' }, { status: 500 });
  }
}
