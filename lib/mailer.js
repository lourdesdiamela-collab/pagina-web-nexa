import nodemailer from 'nodemailer';

// Mismo transporter/credenciales que ya usa app/api/contact/route.js
// (GMAIL_USER + GMAIL_APP_PASSWORD). Si no están configuradas, no se manda
// el email pero el resto del flujo (pedido, descarga habilitada) sigue
// funcionando igual — mismo criterio que /api/contact.
export function isMailerConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

let transporter = null;
function getTransporter() {
  if (!isMailerConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, fromName = 'NEXA Aprende' }) {
  const t = getTransporter();
  if (!t) {
    console.log(`Nodemailer no configurado: omitiendo email "${subject}" a ${to}.`);
    return { sent: false };
  }
  try {
    await t.sendMail({ from: `"${fromName}" <${process.env.GMAIL_USER}>`, to, subject, html });
    return { sent: true };
  } catch (error) {
    console.error('Error al enviar email:', error.message);
    return { sent: false, error: error.message };
  }
}
