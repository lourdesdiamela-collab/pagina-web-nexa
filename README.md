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
