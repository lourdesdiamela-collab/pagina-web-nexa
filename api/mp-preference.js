const { MercadoPagoConfig, Preference } = require('mercadopago');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
  });

  const preference = new Preference(client);
  const { title, price } = req.body;

  try {
    const result = await preference.create({
      body: {
        items: [{ title, unit_price: Number(price), quantity: 1, currency_id: 'ARS' }],
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
