import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const required = ['name', 'email', 'company'];
    const missing = required.filter((field) => !String(body[field] || '').trim());

    if (missing.length > 0) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    // Log the contact for now — email integration can be added via env vars
    console.log('📩 New contact submission:', {
      name: body.name,
      email: body.email,
      company: body.company,
      phone: body.phone || '—',
      service: body.service || '—',
      challenge: body.challenge || '—',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado. El equipo de NEXA te contactará pronto.',
    });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'No pudimos enviar tu mensaje.' }, { status: 500 });
  }
}
