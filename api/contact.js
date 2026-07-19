function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { nombre, empresa, email, servicio, mensaje } = req.body || {};

  if (!nombre || !email) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("contact form error: RESEND_API_KEY no configurada");
    return res.status(500).json({ error: "Servicio de email no configurado." });
  }

  const to = process.env.NEXA_NOTIFICATION_EMAIL || "hola@nexaarg.com";
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const html =
    "<h2>Nuevo mensaje de contacto</h2>" +
    "<p><strong>Nombre:</strong> " + esc(nombre) + "</p>" +
    "<p><strong>Empresa:</strong> " + esc(empresa || "-") + "</p>" +
    "<p><strong>Email:</strong> " + esc(email) + "</p>" +
    "<p><strong>Servicio de interes:</strong> " + esc(servicio || "-") + "</p>" +
    "<p><strong>Mensaje:</strong><br>" + esc(mensaje || "").replace(/\n/g, "<br>") + "</p>";

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: "Nuevo contacto desde la web - " + nombre,
        html
      })
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      throw new Error("Resend error " + resendRes.status + ": " + errText);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("contact form error", e.message);
    res.status(500).json({ error: e.message });
  }
};
