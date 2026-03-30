import { NextResponse } from 'next/server';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

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

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado. El equipo de NEXA te contactara pronto.',
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje.' }, { status: 500 });
  }
}
