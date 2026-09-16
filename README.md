# NEXA — sitio web (nexagrowth.com.ar)

> ## ⚠️ LEÉ ESTO ANTES QUE NADA
>
> **Lo que está publicado en nexagrowth.com.ar sale de la rama `claude/redesign-premium-motion`.**
> Se despliega sola en Vercel (proyecto **`pagina-web-nexa-preview`**) cada vez que esa
> rama recibe un push. Esa rama es la única fuente de verdad de lo que un visitante
> ve hoy en el sitio.
>
> **La rama `master` NO es el sitio publicado.** Es una versión vieja y con otra
> arquitectura (ver más abajo). No la toques pensando que es producción, no la
> uses como referencia para nada, y no le mergees código de otras ramas. Ya
> perdimos horas de trabajo por esta confusión — este archivo existe para que
> no vuelva a pasar.

## 1. Qué rama es cada cosa

| Rama | Qué es |
|---|---|
| **`claude/redesign-premium-motion`** | **Producción.** Lo que está en nexagrowth.com.ar ahora mismo. Vercel la despliega automáticamente en cada push. |
| `master` | **Muerta.** Una versión anterior del sitio, estática, sin tienda ni checkout ni base de datos (ver punto 2). No se despliega a ningún lado que importe. No usar. |
| `fix/...`, `claude/...` (otras) | Ramas de trabajo. Antes de asumir que algo "ya está" en el sitio, confirmá que se mergeó a `claude/redesign-premium-motion`. |

## 2. Por qué `master` está muerta

`master` es una versión anterior del proyecto: sitio estático de marketing,
sin Prisma, sin base de datos, sin NextAuth, sin Aprende (la tienda de
recursos), sin checkout de servicios. Se puede confirmar mirando su
`package.json`: no tiene `@prisma/client`, `next-auth`, `bcryptjs` ni
`nodemailer` — ninguna de las piezas que hoy sostienen el sitio real. En algún
momento el proyecto se re-arrancó sobre `claude/redesign-premium-motion` con
todo eso agregado, y `master` quedó congelada en el punto de partida.

## 3. Cómo se despliega

**Vercel, proyecto `pagina-web-nexa-preview`**, rama de producción
`claude/redesign-premium-motion`. Build command real (configurado en Vercel,
no en `package.json` — ahí dice solo `next build`):

```
npx prisma db push --accept-data-loss && node prisma/seed.mjs && next build
```

Contra **Postgres (Neon)**, no SQLite. En orden, en cada deploy:

1. `prisma db push --accept-data-loss` sincroniza el schema de Prisma contra la
   base de Neon. **El flag `--accept-data-loss` corre en todos los deploys**,
   no solo cuando hace falta — si un cambio de schema implica borrar o
   truncar una columna, Postgres lo hace sin preguntar. Es una decisión de
   infra existente, no la cambies sin que Lu lo decida a propósito.
2. `prisma/seed.mjs` corre siempre después. Sincroniza (upsert, no borra) las
   categorías y los 100 productos del catálogo de Aprende, y crea el usuario
   admin inicial si no existe (usando `ADMIN_EMAIL` / `ADMIN_PASSWORD`, sin
   contraseña por defecto). No crea reseñas falsas — eso se sacó a propósito.
3. `next build` compila el sitio.

## 4. Trampas ya conocidas — para no repetirlas

- **`prisma/schema.prisma` tiene que decir `provider = "postgresql"`, nunca
  `"sqlite"`.** Ya pasó una vez que alguien lo cambió a `sqlite` para hacerlo
  coincidir con el `.env` local, y eso rompió el deploy entero: el build corre
  `prisma db push` contra la Postgres real, y con el provider en `sqlite` esa
  conexión es inválida. El `.env` local de quien esté desarrollando puede
  seguir apuntando a un archivo SQLite sin problema — lo que nunca debe
  cambiar es el `schema.prisma` commiteado.
- **Prisma no soporta comentarios de bloque `/* ... */` en `schema.prisma`**,
  solo `//` y `///`. Un solo comentario de bloque hace fallar `prisma
  generate` (que corre en el `postinstall` de `npm install`) con el error
  `P1012`, y tira abajo el deploy antes de llegar siquiera a construir el
  sitio.
- El build de Vercel corre en Linux; algunas cosas que "andan en tu máquina"
  (Windows) pueden fallar ahí igual — probá siempre con `npm run build` antes
  de dar algo por confirmado.

## 5. Variables de entorno

Ninguna tiene valor acá. Se cargan en **Vercel → proyecto
`pagina-web-nexa-preview` → Settings → Environment Variables**.

**Confirmado que están cargadas en Vercel** (Lu lo verificó en el panel):

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión (pooled) a la Postgres de Neon. La usa el sitio en runtime y el `prisma db push` del build. |
| `DATABASE_URL_UNPOOLED` | Conexión directa a Neon que provee la integración de Vercel. El código de este repo no la referencia directamente hoy — queda documentada porque está cargada. |
| `DATABASE_POSTGRES_PRISMA_URL` y el resto de la familia de variables que agrega la integración de Neon en Vercel | Variables que Neon/Vercel provisionan automáticamente junto con las de arriba. Tampoco las usa directamente el código de este repo. |
| `MP_ACCESS_TOKEN` | Token de Mercado Pago para crear preferencias de pago. |
| `MP_PUBLIC_KEY` | Clave pública de Mercado Pago. Cargada, pero **ningún código del repo la usa hoy** — el pago con tarjeta está deshabilitado en el checkout actual (solo transferencia bancaria); quedaría lista para cuando se active. |

**El código las necesita para funcionar del todo — no verifiqué si están
cargadas en Vercel, [FALTA: confirmar en el panel]:**

| Variable | Para qué | Si falta |
|---|---|---|
| `NEXTAUTH_SECRET` | Firma las sesiones de NextAuth. | Sin ella, `lib/auth.js` genera una clave sola y la guarda en un archivo fuera del repo (no persiste entre deploys: las sesiones se invalidan en cada uno). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | El seed las usa para crear el usuario admin inicial de Aprende. | Sin ambas, no se crea ningún admin — no hay contraseña por defecto a propósito. |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Envío de emails del formulario de contacto (Gmail vía Nodemailer). | Sin ellas, el formulario sigue guardando el lead en la base igual; simplemente no sale ningún email. |
| `CONTACT_EMAIL` | A qué dirección llegan las notificaciones de contacto y de checkout de servicios. | Si falta, usa `hola@nexaarg.com` por defecto. |
| `NEXT_PUBLIC_CRM_URL` | URL del CRM (Nexa-CRM) al que el sitio intenta sincronizar los leads y al que redirige `/portal`. | Si falta, usa `https://crm.nexagrowth.com.ar` por defecto. |
| `NEXT_PUBLIC_SITE_URL` | Base para links absolutos (redirects de Mercado Pago, emails de pedido). | Si falta, usa `http://localhost:3000` — **rompería esos links en producción si no está cargada**. |
| `MP_WEBHOOK_SECRET` | Valida la firma de las notificaciones de pago de Mercado Pago. | Si falta, el webhook procesa los pagos igual pero sin validar que la notificación sea realmente de Mercado Pago (queda logueado como advertencia). |
| `ALLOW_PAYMENT_SIMULATION` | Interruptor de desarrollo para simular un pago aprobado sin Mercado Pago real. | Tiene que estar en `false` o ausente en producción — está pensada solo para probar en local. |

**Cargadas en `.env.local` pero sin ningún uso en el código actual** (quedaron
de una versión anterior, no hace falta cargarlas en Vercel):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `JWT_SECRET`.

## 6. Pendiente — esto es de Lu, no de código

- **Textos legales.** `/terminos`, `/privacidad` y `/arrepentimiento` están
  publicados con un marcador `[FALTA: texto de Lu]` en vez de contenido real,
  y marcados `noindex` a propósito para que no aparezcan vacíos en buscadores.
  Cuando Lu cargue el texto definitivo de cada uno, sacar la línea `robots` de
  la metadata de esa página para que Google empiece a indexarla.
- **Data Fiscal de ARCA (ex AFIP).** El pie de página tiene el espacio
  reservado y comentado (`components/Footer.js`) con las instrucciones
  exactas de qué pegar ahí una vez que Lu genere el código en el sitio de
  ARCA: el isotipo oficial (`public/data-fiscal.jpg`) y la URL de verificación
  del contribuyente, enlazados entre sí.

---

Para el detalle de cómo se construyó la tienda Aprende (catálogo, checkout,
cuentas, panel admin) ver `APRENDE_README.md` — es útil como historia de
decisiones, pero está parcialmente desactualizado: fue escrito cuando la base
todavía era SQLite y describe el pase a Postgres como un paso pendiente, cosa
que ya sucedió (ver punto 3 de este archivo).
