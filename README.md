# NEXA Web + CRM

Plataforma web pública y CRM operativo de NEXA construida con Next.js 14.

## Requisitos

- Node.js 18+
- Variables de entorno en `.env.local` (base sugerida en `.env.example`)
- Supabase (tablas base + migraciones en `supabase/migrations`)

## Variables clave

- `SUPABASE_SERVICE_ROLE_KEY` para operaciones backend con RLS.
- `RESEND_API_KEY` + `NEXA_NOTIFICATION_EMAIL` para notificaciones por email.
- `TRELLO_*` para sincronización de tareas con Trello.

## Notificaciones del formulario de contacto

El formulario del home (`app/page.js`) envía un POST a `app/api/contact/route.js`.
Antes, esa ruta solo hacía `console.log` del mensaje — **no se enviaba ningún
email**, aunque el usuario veía "Mensaje enviado" igual. Ahora `route.js` usa
[Resend](https://resend.com) para mandar un email real por cada consulta.

Variables de entorno relevantes (configurar en Vercel → Settings →
Environment Variables del proyecto `pagina-web-nexa`):

- `RESEND_API_KEY` **(obligatoria para que se envíe el email)**. Sin esta
  variable, la ruta sigue funcionando — el formulario no se rompe — pero el
  mensaje solo queda en los logs de Vercel, igual que antes. Se obtiene en el
  dashboard de Resend (resend.com/api-keys).
- `NEXA_NOTIFICATION_EMAIL` (opcional). A qué dirección llegan las consultas.
  Si no se define, usa `hola@nexaarg.com` por defecto.
- `RESEND_FROM_EMAIL` (opcional). Remitente del email, ej.
  `"NEXA Web <web@nexaarg.com>"`. Por defecto usa esa misma dirección. **Importa