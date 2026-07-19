const { MercadoPagoConfig, Preference } = require('mercadopago');

async function notifyLead(data) { const apiKey = process.env.RESEND_API_KEY; if (!apiKey) return; const to = process.env.NEXA_NOTIFICATION_EMAIL || 'hola@nexaarg.com'; const from = process.env.RESEND_FROM_EMAIL || 'NEXA Web <web@nexaarg.com>'; try { await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject: 'Nuevo lead de pago - ' + data.title, html: '<h2>Nuevo interesado en contratar</h2><p><strong>Servicio:</strong> ' + data.title + '</p><p><strong>Precio:</strong> $' + data.price + ' ARS</p><p><strong>Nombre:</strong> ' + data.name + '</p><p><strong>Email:</strong> ' + data.email + '</p><p><strong>Telefono:</strong> ' + data.phone + '</p><p><strong>Negocio:</strong> ' + data.business + '</p>' }) }); } catch (e) { console.error('notifyLead error', e.message); } } module.exports = async (req, res) => { if (req.method !== 'POST') return res.status(405).end(); const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
  });

  const preference = new Preference(client);
  const { title, price, service, plan, name, email, phone, business } = req.body || {}; if (!title || !price || !name || !email || !phone || !business) { return res.status(400).json({ error: 'Faltan datos obligatorios.' }); } await notifyLead({ title, price, service, plan, name, email, phone, business });

  try {
    const result = await preference.create({
      body: {
        items: [{ title, unit_price: Number(price), quantity: 1, currency_id: 'ARS' }], payer: { name: name, email: email },
        back_urls: {
          success: 'https://nexagrowth.com.ar/servicios.html?pago=exitoso',
          failure: 'https://nexagrowth.com.ar/servicios.html?pago=fallido',
          pending: 'https://nexagrowth.com.ar/servicios.html?pago=pendiente'
        },
        auto_return: 'approved'
      }
    });
    res.json({ init_point: result.init_point });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
