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

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm start
```

## Migración de datos locales a Supabase

Si existen archivos legacy en `data/*.json`, podés migrarlos a tablas `crm.*`:

```bash
npm run sync:data
```

Requiere `SUPABASE_SERVICE_ROLE_KEY` configurada.

## Imágenes placeholder en el home (pendiente)

El rediseño del home (`app/page.js` + `components/StatsDashboard.js`) usa
fotos de stock de Unsplash como **placeholder temporal** en:

- Las 3 cards de la sección de servicios.
- Las 3 cards de testimonios/casos (foto del caso + avatar del cliente).
- La imagen de la sección de cierre ("¿Listos para llevar tu marca al
  siguiente nivel?").

Cada uso está marcado en el código con un comentario `Placeholder de
Unsplash — reemplazar por foto real`. Las cifras del panel de datos y los
testimonios también son de ejemplo (rotulados como tal en pantalla:
"Cifras de ejemplo" y "Cliente — ejemplo") hasta que se confirmen con
material real de NEXA y de cada cliente.
