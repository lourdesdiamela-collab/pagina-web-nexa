# NEXA Aprende — Estado del módulo (Fase 2)

Este documento describe honestamente qué quedó **funcionando de verdad**, qué sigue **pendiente de credenciales externas**, y qué falta para que todo esté 100% en producción. Es la referencia para retomar el trabajo en una próxima sesión.

> La Fase 1 (catálogo, buscador, carrito con promos, diseño) sigue intacta y se explica más abajo. Esta sección nueva es sobre la Fase 2: base de datos real, checkout con Mercado Pago, cuentas de usuario, "Mis Recursos" y panel de administrador.

## Resumen de la sesión (Fase 2)

Lu pidió explícitamente que la tienda funcione al 100%, no simulada. Se construyó todo el sistema real: base de datos, autenticación, checkout con Mercado Pago (con modo de prueba mientras no hay credenciales), entrega de archivos gateada por compra, emails de confirmación y panel de administrador con CRUD real. **Se probó en navegador, de punta a punta, contra la base de datos real**: registro → login → agregar al carrito → checkout → pago (simulado, ver más abajo por qué) → pedido creado en la base de datos → email de confirmación (logueado, ver más abajo) → "Mis Recursos" → descarga gateada por compra → panel admin creando un producto real que apareció al instante en la tienda.

## 1. Base de datos — decisión y estado

**Decisión: Prisma ORM.** Dev local con **SQLite** (archivo `prisma/dev.db`, cero configuración, cero servicios externos). Producción (Vercel) debe usar **Postgres administrado** (Vercel Postgres o Neon), porque el filesystem de las funciones serverless de Vercel es efímero — un archivo SQLite ahí no persiste entre deploys ni siquiera siempre entre invocaciones.

El mismo `prisma/schema.prisma` sirve para ambos casos (los campos "enum" se modelaron como `String`, no como `enum` de Prisma, justamente porque SQLite no soporta enums nativos — así no hay que reescribir el schema al pasar a Postgres).

**Para pasar a producción:**
1. Crear una base Postgres (Vercel Postgres o Neon — ambas tienen plan gratis para empezar).
2. En Vercel → Settings → Environment Variables, setear `DATABASE_URL` con la connection string real (ej. `postgresql://user:pass@host/db?sslmode=require`).
3. Cambiar `provider = "sqlite"` a `provider = "postgresql"` en `prisma/schema.prisma`.
4. Correr `npx prisma migrate deploy` (o dejar que el build de Vercel lo haga si se agrega al build command — ver sección Deploy).
5. Correr el seed una vez contra la base de producción (`npm run db:seed`) para cargar categorías, los 100 productos y el usuario admin.

**Modelos** (`prisma/schema.prisma`): `User`, `Category`, `Product`, `Review`, `Order`, `OrderItem`, `Coupon`. `Product.fileUrl` es el campo clave para los PDFs — ver sección 6.

## 2. Autenticación — NextAuth.js (Credentials)

Se eligió **NextAuth.js v4** con el provider de Credentials (email + contraseña con `bcryptjs`), sesión JWT (sin adapter de base de datos — no hace falta, los datos de usuario ya viven en la tabla `User` vía Prisma). Es la opción más simple y rápida de implementar bien sin depender de un proveedor OAuth externo.

- `lib/auth.js` — configuración de NextAuth (`authOptions`).
- `app/api/auth/[...nextauth]/route.js` — handler.
- `app/api/auth/register/route.js` — registro (hashea password, crea `User` con `role: "USER"`).
- `app/aprende/cuenta/login` y `/registro` — páginas reales, funcionando.
- El rol `ADMIN` habilita `/aprende/admin`. El usuario admin se siembra automáticamente (ver sección 7).

Probado en navegador: registro de cuenta nueva → auto-login → sesión persistida → Navbar muestra "Mis recursos" / "Panel admin" según el rol → logout.

## 3. Checkout con Mercado Pago

**Decisión: Checkout Pro** (preferencia + redirect al Checkout hosteado de Mercado Pago), no Checkout API. Es la integración más simple y robusta de implementar bien sin necesitar certificación PCI propia — Mercado Pago se encarga de la UI de pago y de las validaciones de tarjeta.

Flujo real implementado:
1. `POST /api/checkout/create-preference` (`app/api/checkout/create-preference/route.js`) — resuelve los productos del carrito **contra la base de datos** (nunca confía en precios que mande el cliente), aplica cupón si corresponde, crea un `Order` en estado `PENDING` con sus `OrderItem`, y si Mercado Pago está configurado crea la preferencia y devuelve la URL de pago (`init_point`).
2. El usuario paga en Mercado Pago.
3. `POST /api/mercadopago/webhook` (`app/api/mercadopago/webhook/route.js`) — Mercado Pago notifica acá cuando cambia el estado del pago. Se verifica el pago real contra la API de MP (nunca se confía en el body de la notificación a ciegas) y se aprueba/rechaza el pedido.
4. `/aprende/checkout/success`, `/failure`, `/pending` — páginas reales de vuelta. `success` además hace una verificación extra contra la API de Mercado Pago por si el webhook todavía no llegó (red de seguridad ante la latencia típica de las notificaciones).

**PENDIENTE DE LU — esto es lo único que falta para que el pago sea 100% real:**
- `MP_ACCESS_TOKEN` y `MP_PUBLIC_KEY` en las variables de entorno (`.env.local` en dev, Vercel env vars en producción). Se consiguen en el panel de desarrolladores de Mercado Pago (`https://www.mercadopago.com.ar/developers/panel/app`) con la cuenta de vendedor real de Lu.
- Sin estas variables, `isMpConfigured()` (`lib/mercadopago.js`) devuelve `false` y el checkout usa un **modo de simulación de pago** — un botón "Simular pago aprobado (modo desarrollo)" que corre exactamente la misma lógica de aprobación que usaría el webhook real (mismo código, `lib/orders.js`), para poder probar y demostrar el flujo completo sin credenciales. Ese botón se autodesactiva solo apenas Lu carga `MP_ACCESS_TOKEN` (la ruta `/api/checkout/simulate` rechaza pedidos si Mercado Pago ya está configurado).
- **Se probó en navegador**: compra completa con 2 productos + cupón `BIENVENIDA10` (10% OFF), pago simulado aprobado, pedido creado en la base con estado `APPROVED`, visible en "Mis Recursos" y en el panel admin con las cifras correctas.

## 4. Post-compra: pedido, email, "Mis Recursos"

- `lib/orders.js` — `approveOrder()` es la función única que corre tanto desde el webhook real como desde la simulación de desarrollo: marca el pedido `APPROVED`, incrementa el uso del cupón si corresponde, y dispara el email de confirmación.
- **Email**: se reutiliza exactamente el mismo transporter de Nodemailer que ya usaba `app/api/contact/route.js` (Gmail + `GMAIL_USER`/`GMAIL_APP_PASSWORD`, ahora centralizado en `lib/mailer.js`). Mismo criterio que el resto del sitio: si esas variables no están configuradas, el email se omite con un `console.log` pero el resto del flujo sigue funcionando (no rompe la compra). **Confirmado en la sesión**: como no había `GMAIL_USER` cargado en este entorno, se vio el log `"Nodemailer no configurado: omitiendo email..."` — el mecanismo está listo, sólo falta que Lu cargue esas dos variables (ya las tiene configuradas en Vercel para `/api/contact`, así que puede ser la misma cuenta).
- `/aprende/mis-recursos` (`app/aprende/mis-recursos/page.js`) — lista real de pedidos del usuario logueado, leída directo de Prisma. Cada ítem muestra "Descargar" si el producto tiene `fileUrl` cargado, o "Próximamente" si no.
- `GET /api/download/[productId]` — ruta de descarga **gateada**: verifica sesión + que el usuario tenga un `OrderItem` de ese producto en un pedido `APPROVED` antes de servir el archivo. Probado explícitamente: descarga real de un PDF de prueba (200 + archivo correcto), bloqueo a un usuario que no compró el producto (403), bloqueo a producto sin archivo cargado (404).

## 5. Panel de administrador (`/aprende/admin`)

Protegido por rol (`requireAdminPage()` en `lib/adminAuth.js`, redirige si no es admin — y cada Server Action vuelve a verificar el rol server-side por las dudas, nunca confía en el cliente). Todo el CRUD es real contra Prisma, usando **Server Actions** de Next.js (formularios que postean directo a funciones del servidor, sin necesidad de armar API routes separadas para cada mutación).

- **Resumen** (`/aprende/admin`) — ingresos aprobados, pedidos, usuarios, productos, reseñas, productos más vendidos y últimos pedidos, todo calculado en vivo con `prisma.groupBy`/`count`/etc.
- **Productos** (`/aprende/admin/productos`) — alta/edición/baja real. El formulario de producto (`ProductForm.jsx`) permite **subir un PDF**, que se guarda con `lib/storage.js` y asocia automáticamente al campo `Product.fileUrl` — apenas se sube, el botón "Descargar" en Mis Recursos deja de decir "Próximamente" para los compradores. Probado: creación de un producto nuevo que apareció al instante en `/aprende/categoria/ia` (11 recursos en vez de 10).
- **Categorías** (`/aprende/admin/categorias`) — alta/edición/baja (no deja borrar una categoría con productos adentro).
- **Pedidos** (`/aprende/admin/pedidos`) — listado completo + cambio manual de estado (útil para pagos coordinados por WhatsApp/transferencia, igual que el botón de WhatsApp que sigue disponible en el checkout como alternativa).
- **Usuarios** (`/aprende/admin/usuarios`) — listado + promover/quitar admin.
- **Reseñas** (`/aprende/admin/resenas`) — aprobar/ocultar/eliminar. Las reseñas mock de la Fase 1 ahora son filas reales en la tabla `Review` (300 reseñas de ejemplo, sembradas una sola vez); una reseña oculta no cuenta para el rating del producto (el rating se calcula en vivo con `groupBy` sobre reseñas aprobadas).
- **Cupones** (`/aprende/admin/cupones`) — alta/edición/baja, tipo porcentaje o monto fijo, con límite de usos y vencimiento opcional. Hay un cupón de ejemplo sembrado: `BIENVENIDA10` (10% OFF).

## 6. Almacenamiento de archivos (PDFs) — estado real y qué falta

`lib/storage.js` implementa `saveFile`/`getFile`/`deleteFile` contra el **filesystem local** del proyecto (`storage/uploads/products/`, fuera de `public/` a propósito, para que la única forma de acceder a un archivo sea a través de `/api/download` con el chequeo de compra).

**Esto funciona perfecto en desarrollo y en un servidor tradicional (VPS, Docker, etc.).** El problema es específico de Vercel: las funciones serverless tienen filesystem efímero — un PDF subido hoy puede desaparecer en el próximo deploy o incluso entre invocaciones en frío.

**Para producción real en Vercel hace falta reemplazar `lib/storage.js`** por una integración con **Vercel Blob** (`@vercel/blob`, es la opción más simple, se integra en minutos) o S3. La interfaz (`saveFile`/`getFile`/`deleteFile`) ya está pensada para que ese cambio quede acotado a un solo archivo, sin tocar el resto del código (admin, descarga, etc. no necesitan cambiar).

## 7. Credenciales y variables de entorno

Ver `.env.example` (nuevo) para la lista completa. Resumen:

| Variable | Para qué | Estado |
|---|---|---|
| `DATABASE_URL` | Conexión a la base | Configurada (SQLite local). En prod: Postgres, ver sección 1 |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | Sesiones de usuario | Configuradas (dev) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Usuario admin sembrado | `lu@nexaarg.com` / `CambiarInmediatamente123` — **cambiar la contraseña después del primer login real** |
| `MP_ACCESS_TOKEN` / `MP_PUBLIC_KEY` | Pagos reales con Mercado Pago | **Pendiente — Lu debe cargarlas** con sus credenciales de vendedor |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Email de confirmación de compra | No configuradas en este entorno de prueba — probablemente Lu ya las tiene en Vercel para `/api/contact`, reusar las mismas |
| `NEXT_PUBLIC_SITE_URL` | Back-urls de Mercado Pago y links en emails | En prod: setear al dominio real (`https://nexagrowth.com.ar` o el que corresponda a `/aprende`) |

## 8. Cómo correrlo localmente

```bash
npm install                  # instala dependencias (incluye Prisma, next-auth, mercadopago, bcryptjs)
npm run db:seed              # crea/sincroniza categorías, 100 productos, reseñas de ejemplo, admin y cupón demo
npm run dev                  # http://localhost:3000
```

Login admin: `lu@nexaarg.com` / `CambiarInmediatamente123` (definido en `.env.local`, cambiar antes de producción).

`npm run build` fue verificado sin errores, y además se corrió `npm run start` (build de producción real) y se confirmó con requests reales que `/aprende`, `/aprende/producto/[slug]` responden 200 y `/aprende/admin` redirige correctamente (307) si no hay sesión. Todas las rutas de `/aprende` son dinámicas (`λ`) porque leen la base en cada request — es la decisión correcta para que el admin vea sus cambios reflejados al instante, sin esperar un rebuild.

## 9. Qué queda honestamente pendiente

- **Credenciales reales de Mercado Pago** (bloqueante para pagos reales — ver sección 3).
- **Storage de archivos para producción en Vercel** (Vercel Blob o S3 — ver sección 6). Local funciona, pero no sobrevive a un deploy en Vercel.
- **Migrar la base a Postgres** antes de deployar (ver sección 1) — hoy corre en SQLite local.
- **Newsletter** sigue sin conectar a un proveedor real (Mailchimp/Brevo) — quedó igual que en Fase 1.
- Los **PDFs reales** de los 100 recursos siguen sin existir — el sistema para subirlos y que se habiliten automáticamente ya está 100% listo (admin → producto → subir PDF), sólo falta que Lu los suba.
- El **email de confirmación de compra** está completamente implementado pero no se pudo probar el envío real en este entorno por no tener `GMAIL_USER`/`GMAIL_APP_PASSWORD` configuradas — el código sigue exactamente el mismo patrón ya validado en producción por `/api/contact`.
- **SEO avanzado** (sitemap dedicado, imágenes OG por producto) sigue pendiente, igual que en Fase 1.

## 10. Archivos clave para retomar el trabajo (Fase 2)

- `prisma/schema.prisma` — modelo de datos completo.
- `prisma/seed.mjs` — seed idempotente (categorías, productos, reseñas, admin, cupón demo).
- `lib/db.js` — cliente Prisma singleton.
- `lib/auth.js`, `lib/adminAuth.js` — autenticación y guard de admin.
- `lib/catalogQueries.js` — toda la lectura del catálogo desde la base (reemplaza los helpers estáticos de Fase 1 para las páginas).
- `lib/pricing.js` — motor de promos (ahora recibe el catálogo resuelto de la base en vez de importarlo estático).
- `lib/orders.js`, `lib/mercadopago.js`, `lib/mailer.js` — checkout, pagos, email.
- `lib/storage.js` — abstracción de archivos (ver sección 6 para el reemplazo pendiente en prod).
- `lib/adminActions.js` — todas las Server Actions del panel admin.
- `app/aprende/admin/**` — panel de administrador.
- `app/api/checkout/**`, `app/api/mercadopago/webhook`, `app/api/download/[productId]` — backend del flujo de compra.
- `lib/products.mjs` — ahora es solo el **generador de datos semilla** (usado por `prisma/seed.mjs`) más un puñado de utilidades puras sin base de datos (`formatPrice`, `coverVariant`, `buildPreview`). Ya no es la fuente de verdad del catálogo en runtime — eso ahora es la base de datos.

---

# Fase 1 — Catálogo, carrito y diseño (referencia histórica)

Lo que sigue documenta la Fase 1 tal como se entregó. Sigue siendo válido salvo por los puntos que la Fase 2 reemplazó explícitamente arriba (catálogo ahora vive en la base de datos, no en `lib/products.js`; checkout ahora es real, no un aviso de "todavía no está activo"; no hay "historial de compras" inexistente — ahora es real).

## Qué está implementado y funciona de verdad (Fase 1)

- **Catálogo de 100 productos**, 10 categorías x 10 productos, generado de forma determinística (sin `Math.random`, usando un PRNG sembrado por slug) para evitar mismatches de hidratación SSR/CSR.
- **Rutas reales y funcionales**: `/aprende`, `/aprende/producto/[slug]`, `/aprende/categoria/[cat]`, `/aprende/carrito`, `/aprende/checkout`.
- **Buscador y filtros** client-side (por texto, categoría y orden).
- **Carrito real** (`components/aprende/CartContext.jsx`): Context API + `localStorage`, persiste entre recargas.
- **Motor de promociones automático** (`lib/pricing.js`): 3 recursos → $19.999, 5 recursos → $39.999, categoría completa → 30% OFF, biblioteca completa → $349.999.
- **Diseño integrado** con el sistema visual existente (`app/globals.css`).
- **Responsive** verificado sin overflow horizontal en mobile.

## Archivos clave de Fase 1

- `lib/products.mjs` — generador del catálogo semilla y utilidades puras (ver nota arriba: ya no es la fuente de verdad en runtime).
- `components/aprende/*` — UI compartida (cards, portadas, reseñas, FAQ, newsletter, testimonios, etc.)
- `app/aprende/**` — todas las rutas de la tienda.
- `app/blog/**` — blog reubicado (antes vivía en `app/aprende`).
