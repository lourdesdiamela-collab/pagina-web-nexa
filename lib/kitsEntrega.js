import { prisma } from '@/lib/db';
import { sendMail } from '@/lib/mailer';
import { notifyEvent } from '@/lib/notifications';
import { escapar } from '@/lib/seguridad';
import { primeraVez, DIA } from '@/lib/rateLimit';
import { kitPorSlug, formatoPrecio } from '@/lib/kits.mjs';
import { crearTokenKit, urlDescargaKit, crearTokenClave, urlCrearClave } from '@/lib/kitsAcceso';
import { asegurarCuentaComprador } from '@/lib/kitsCuenta';

const AVISOS_A = process.env.CONTACT_EMAIL || 'nexagrowtharg@gmail.com';

/*
 * Entrega un kit cuando Mercado Pago confirma el pago: manda el mail al
 * comprador con su enlace privado y avisa a NEXA. Se puede llamar más de una
 * vez para el mismo pago (Mercado Pago repite avisos): solo actúa la primera.
 */
export async function entregarKitComprado(payment) {
  const kit = kitPorSlug(payment.metadata?.kit);
  const referencia = payment.external_reference || payment.metadata?.reference;
  const email = String(payment.metadata?.email || '').trim();
  if (!kit || !referencia || !email) {
    console.error('[kits] Pago de kit aprobado pero faltan datos para entregarlo:', { pago: payment.id, referencia });
    return { ok: false };
  }
  if (Number(payment.transaction_amount) !== kit.precio || payment.currency_id !== 'ARS') {
    console.error(`[kits] El pago ${payment.id} (${payment.transaction_amount} ${payment.currency_id}) no coincide con el precio del kit (${kit.precio} ARS). No se entrega: revisar a mano.`);
    return { ok: false };
  }
  if (!(await primeraVez('mp-kit', String(payment.id), 120 * DIA))) return { ok: true, repetido: true };

  const nombre = escapar(payment.metadata?.name || 'Hola');
  const url = urlDescargaKit(crearTokenKit({ referencia, kit: kit.slug }));

  // Cuenta de NEXA Aprende con el mail de compra y el kit en "Mis recursos".
  // Si algo falla acá, el comprador igual recibe su kit por el enlace de abajo.
  let cuenta = null;
  try {
    cuenta = await asegurarCuentaComprador({ email, nombre: payment.metadata?.name, kit, paymentId: payment.id, monto: kit.precio });
  } catch (e) {
    console.error('[kits] No se pudo crear la cuenta del comprador:', e?.message || e);
  }
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/^https?:\/\/nexagrowth\.com\.ar/i, 'https://www.nexagrowth.com.ar').replace(/\/+$/, '');
  let bloqueCuenta = '';
  if (cuenta?.necesitaClave) {
    const urlClave = urlCrearClave(crearTokenClave({ email: cuenta.user.email, passwordHash: cuenta.user.passwordHash }));
    bloqueCuenta = `
        <div style="margin:24px 0;padding:16px 18px;background:#F3EEF8;border-radius:14px">
          <p style="margin:0 0 8px"><strong>Tu cuenta de NEXA ya está creada</strong> con este mail (${escapar(email)}). Con ella entrás cuando quieras y encontrás tus kits en "Mis recursos".</p>
          <p style="margin:0"><a href="${urlClave}" style="color:#5B2FC7;font-weight:700">Crear mi contraseña</a> <span style="font-size:13px;color:#505466">(el enlace sirve 7 días)</span></p>
        </div>`;
  } else if (cuenta) {
    bloqueCuenta = `
        <div style="margin:24px 0;padding:16px 18px;background:#F3EEF8;border-radius:14px">
          <p style="margin:0">Tu compra ya aparece en tu cuenta de NEXA: entrá con este mail y buscala en <a href="${base}/aprende/mis-recursos" style="color:#5B2FC7;font-weight:700">Mis recursos</a>.</p>
        </div>`;
  }

  const envio = await sendMail({
    to: email,
    fromName: 'NEXA',
    subject: `Tu kit está listo: ${kit.titulo}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#12141D;line-height:1.6">
        <h2 style="margin:0 0 8px">¡Gracias por tu compra, ${nombre}!</h2>
        <p>Tu pago de <strong>${formatoPrecio(payment.transaction_amount)}</strong> fue aprobado. Tu kit <strong>${escapar(kit.titulo)}</strong> ya está listo.</p>
        <p style="margin:24px 0"><a href="${url}" style="background:#D2F23A;color:#12141D;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block">Abrir y descargar mi kit</a></p>
        <p>Ahí vas a encontrar: ${kit.archivos.map((a) => escapar(a.titulo)).join(', ')}.</p>
        ${bloqueCuenta}
        <p><strong>Por dónde empezar:</strong> mirá el video de bienvenida y abrí la guía interactiva. Seguí las partes en orden.</p>
        <p style="font-size:14px;color:#505466">Guardá este mail: el enlace funciona unos 60 días. Si el botón no anda, copiá y pegá esta dirección en tu navegador:<br>${url}</p>
        <p style="font-size:14px;color:#505466">¿Dudas o algo no se abre? Respondé este mail o escribinos por WhatsApp.<br>Pedido ${escapar(referencia)}.</p>
        <p>— El equipo de NEXA</p>
      </div>`,
  });
  if (!envio?.sent) {
    console.error(`[kits] NO SE PUDO ENVIAR el mail del kit al comprador (pedido ${referencia}, ${email}). Lo ve en la página de gracias, pero hay que mandárselo.`, envio?.error || '');
  }

  await sendMail({
    to: AVISOS_A,
    fromName: 'NEXA Web',
    subject: `Venta de kit — ${kit.titulo} (${referencia})`,
    html: `<p>Se aprobó el pago de <strong>${formatoPrecio(payment.transaction_amount)}</strong> de <strong>${nombre}</strong> (${escapar(email)}) por el kit <strong>${escapar(kit.titulo)}</strong>.</p>
      <p>Pedido ${escapar(referencia)} · pago de Mercado Pago ${escapar(payment.id)}. ${envio?.sent ? 'Ya le mandamos el mail con la descarga.' + (cuenta ? (cuenta.creada ? ' Se le creó una cuenta de NEXA Aprende.' : ' Ya tenía cuenta: se le sumó la compra.') : ' No se pudo crear su cuenta de Aprende (revisar logs).') : '<strong>El mail al comprador NO salió: mandáselo a mano.</strong>'}</p>`,
  });

  try {
    await notifyEvent({
      type: 'kit_venta',
      title: 'Venta de kit',
      message: `${payment.metadata?.name || email} compró "${kit.titulo}" (${formatoPrecio(payment.transaction_amount)}).`,
      details: { referencia, kit: kit.slug, mp: String(payment.id), mailEntregado: Boolean(envio?.sent) },
    });
  } catch (e) {
    console.error('[kits] notifyEvent:', e);
  }

  try {
    await prisma.lead.updateMany({
      where: { reference: referencia, source: 'checkout_kit_mercadopago' },
      data: { mpPaymentId: String(payment.id) },
    });
  } catch (e) {
    console.error('[kits] No se pudo actualizar el lead:', e?.message || e);
  }
  return { ok: true, mailEnviado: Boolean(envio?.sent) };
}
