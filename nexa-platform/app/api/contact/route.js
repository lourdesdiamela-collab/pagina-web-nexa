import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Server-side validation
    if (!data.name || !data.email || !data.company || !data.service) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    // SIMULATED EMAIL DELIVERY TO hola@nexaarg.com
    // To go live with real emails, install 'resend' (npm i resend) and use:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'NEXA Platform <onboarding@nexaarg.com>',
    //   to: 'hola@nexaarg.com',
    //   subject: `Nuevo Lead: ${data.company} - ${data.service}`,
    //   html: `<p>Nombre: ${data.name}</p><p>Email: ${data.email}</p><p>Tel: ${data.phone}</p><p>Interés: ${data.service}</p><p>Desafío: ${data.challenge}</p>`
    // });
    
    console.log(`[EMAIL SIMULADO -> hola@nexaarg.com] Nuevo Lead recibido de ${data.name} (${data.company}) sobre ${data.service}`);

    // Simulate network delay for UI realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ success: true, message: 'Mensaje enviado. En breve te contactaremos.' });

  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json({ error: 'Error interno al enviar el mensaje.' }, { status: 500 });
  }
}
