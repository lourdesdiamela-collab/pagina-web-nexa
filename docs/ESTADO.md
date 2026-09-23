# Estado del proyecto NEXA

Última actualización: 22 de septiembre de 2026

Este documento existe para que cualquiera (Lu incluida) pueda abrir el proyecto desde cero, en cualquier computadora, y entender en qué estado está sin que nadie se lo explique.

## 1. Qué es cada cosa

Hay dos sistemas separados, cada uno con su repositorio y su proyecto de Vercel.

- **El sitio público.** Repositorio `pagina-web-nexa`. Rama de producción: `claude/redesign-premium-motion` (**no** `master`, que está muerta — ver sección 6). Proyecto de Vercel: `pagina-web-nexa-preview`. Sirve **nexagrowth.com.ar**. Incluye la home, servicios con checkout, el blog, y la tienda Aprende con sus 100 productos descargables.
- **El CRM, llamado NEXA OS.** Repositorio `Nexa-CRM`. Rama de producción: `main`. Proyecto de Vercel: `nexa-crm` [FALTA: confirmar que ese es el nombre exacto del proyecto en el dashboard de Vercel]. Sirve **crm.nexagrowth.com.ar**. Es donde viven los clientes, los pagos, las tareas y el portal de clientes.

Las dos bases de datos son Postgres en Neon, cada una la suya (son dos sistemas independientes, con sus propios modelos), conectadas desde Vercel. Se hablan entre sí por HTTP, autenticados con un secreto compartido (`SITE_TO_CRM_SECRET`, ver sección 3).

## 2. Las 10 herramientas del plan de automatización

El plan es que la operación administrativa funcione sola, sin que Lu tenga que cargar nada a mano. Estado real al día de hoy:

1. **Alta automática por pago — HECHA.** Cuando Mercado Pago avisa que se acreditó un pago de un plan de servicio, el cliente se crea solo en el CRM: servicio, plan, monto, fecha, y estado "onboarding pendiente". No duplica si el aviso llega repetido. Si el CRM no responde, el pago queda marcado como pendiente de sincronizar y se puede reintentar a mano — nunca se pierde. Se ve en el CRM, en **Pagos automáticos**.
2. **Formulario de inicio — HECHA.** Apenas el cliente entra a onboarding, se le manda por mail un link privado y único (token largo, no expone el id del cliente, vence a los 30 días) para que cargue sus datos de facturación, su contacto de referencia, qué accesos tiene (Meta, Google Ads, Analytics, redes, web) y un brief de su negocio. Se puede completar en varias veces: el progreso se autoguarda. Al enviarse, completa la ficha del cliente y pasa el estado de ONBOARDING a ACTIVO. Se ve en el CRM, en **Formularios de inicio**.
3. **Panel de accesos con recordatorio automático — [ver estado real más abajo, se está construyendo]**. Un checklist por cliente de qué accesos dio y cuáles faltan, con recordatorio automático a los 3 y 7 días.
4. **Generador de contrato en PDF — PENDIENTE.** No existe ninguna generación de documento. Solo hay dos campos de texto simple (fecha de inicio/fin de contrato) cargados a mano.
5. **Registro de entregables y revisiones por plan — A MEDIAS.** Se pueden cargar y ver entregables por cliente con su estado, pero no hay un tope de rondas de revisión por plan ni ninguna alerta cuando un cliente se pasa del límite.
6. **Panel de capacidad por servicio — PENDIENTE.** El dashboard cuenta clientes activos en total, sin discriminar por servicio ni avisar de ningún límite.
7. **Reportes por cliente con enlace fijo de Looker Studio — PENDIENTE.** No hay ninguna referencia a Looker Studio ni campo para guardar un link de reporte en la ficha del cliente.
8. **Captura de leads de WhatsApp con campaña de origen — PENDIENTE.** No hay ningún webhook de clicks a WhatsApp. Solo existe un campo suelto de teléfono/WhatsApp en el contacto.
9. **Control de cobranza automático — A MEDIAS, mejoró bastante.** Cuando un plan mensual está por vencer (3 días o menos) o ya venció, un cron diario le avisa al cliente por mail (si el email está configurado) y le deja una notificación a Lu en el CRM (esto último funciona siempre, sin depender de ningún mail). Lo que sigue siendo manual: cuando el cliente paga el mes siguiente, alguien del equipo tiene que apretar "Marcar renovado" en la ficha del cliente — el sistema no detecta solo que un pago nuevo entró para ese plan.
10. **Solicitudes de arrepentimiento — HECHA.** La página `/arrepentimiento` tiene el formulario real. Genera un número de trámite legible (`ARR-2026-0001`), manda la constancia al solicitante, avisa a Lu, y crea el caso en el CRM con estado gestionable (abierto / en proceso / resuelto). Se ve en el CRM, en **Arrepentimiento**.

## 3. Qué está pendiente de Lu

Nada de esto lo puede hacer Claude: son claves y textos que tiene que cargar o escribir ella.

- **`SITE_TO_CRM_SECRET`** en los **dos** proyectos de Vercel (el del sitio y el del CRM), con el mismo valor exacto en ambos. Sin esto, el sitio y el CRM no se reconocen entre sí: las altas automáticas y los avisos quedan pendientes de sincronizar (no se pierden, quedan con botón para reintentar).
- **`GMAIL_USER`** y **`GMAIL_APP_PASSWORD`** en el proyecto del sitio. Ver la sección 4 — esto es más grave de lo que parece, porque de esto depende que salga cualquier mail del sitio.
- **Rotar la contraseña del administrador del CRM.** La anterior estuvo publicada en la pantalla de login en algún momento y sigue en el historial de git: hay que darla por comprometida y cambiarla.
- **Escribir los textos legales** de `/terminos`, `/privacidad` y `/arrepentimiento`. Las tres páginas existen y están maquetadas, pero el cuerpo legal está vacío esperando el texto de Lu (marcador `[FALTA: texto de Lu]` visible en cada una).

## 4. El estado del email (importante)

**Hoy el sitio no manda ningún mail en producción.** Faltan `GMAIL_USER` y `GMAIL_APP_PASSWORD` en Vercel, y el código, al no encontrarlas, saltea el envío sin tirar error y sin dejar ningún registro visible en ningún lado — falla en silencio.

Circuitos que quedan mudos por eso:

1. Respuesta automática a quien escribe por el formulario de contacto, y el aviso a Lu de esa consulta.
2. Confirmación de pedido de servicio al cliente, y aviso a Lu.
3. Confirmación de pago aprobado al cliente, y aviso a Lu.
4. Constancia de solicitud de arrepentimiento al solicitante, y aviso a Lu.
5. Mail con el link del formulario de inicio (herramienta #2).
6. Avisos de cobranza — recordatorio de pago próximo a vencer y aviso de vencido (herramienta #9).

Todo lo demás de esos circuitos funciona igual: los datos se guardan, los pedidos se procesan, los casos se crean, las notificaciones internas al CRM se disparan. Es puntualmente el mail el que nunca sale. Con cargar esas dos variables, los seis circuitos se encienden de una.

## 5. Problemas conocidos sin resolver

- En la ficha de producto de Aprende, en celular, el botón flotante de WhatsApp tapa unos 8 píxeles de una esquina del botón "Agregar al carrito". Los dos son botones fijos y la altura del contenido cambia según el producto, así que no hay un valor único que lo resuelva de forma prolija. Queda para cuando se haga el rediseño de esa pantalla. El botón se sigue pudiendo tocar, no está roto — es un problema visual, no funcional.
- El endpoint `/api/leads` del CRM no verifica ningún secreto ni token — a diferencia de los endpoints más nuevos (`/api/integrations/pago-servicio`, `/api/integrations/arrepentimiento`, `/api/integrations/formulario-inicio`), que sí exigen `x-site-secret`. Hoy, cualquiera que sepa la URL le puede crear clientes falsos al CRM por ahí. Es un hueco de seguridad heredado de antes de que existiera el secreto compartido, pendiente de cerrar.

## 6. Decisiones tomadas que no hay que deshacer

- **La rama `master` del repositorio del sitio está muerta.** Es una arquitectura vieja y distinta: un sitio estático sin tienda, sin checkout y sin base de datos. No es lo que está publicado y no hay que tomarla como referencia para nada.
- **En `prisma/schema.prisma` el `provider` va en `postgresql`, nunca en `sqlite`.** La base real de producción es Postgres en Neon. Puede haber un `.env` local apuntando a un archivo SQLite para desarrollo, pero el `schema.prisma` commiteado siempre tiene que decir `postgresql` — ponerlo en `sqlite` rompe el deploy entero.
- **Prisma no soporta comentarios de bloque (`/* ... */`) en `schema.prisma`.** Solo admite `//` y `///`. Un solo comentario de bloque hace fallar `prisma generate` (que corre en el `postinstall`) y tira abajo el deploy antes de llegar a construir el sitio.
- **El build de producción del sitio corre `prisma db push --accept-data-loss` en cada deploy**, no solo cuando hace falta. Esto ya estaba así de antes de este trabajo. Es riesgoso (si un cambio de schema implica borrar o truncar una columna, lo hace sin preguntar) y conviene revisarlo con calma en algún momento, pero no se tocó para no cambiar infraestructura sin que Lu lo decida a propósito.
- **No se toca nada de ARCA ni Data Fiscal.** Decisión expresa de Lu: no tiene cuenta armada ni asociada todavía.
- **El contenido inventado se sacó a propósito y no hay que reponerlo.** NEXA todavía no tiene clientes reales, así que los testimonios, los casos de éxito, los logos de marcas ajenas presentadas como clientes, los contadores de resultados y las reseñas de producto que había eran todos ficticios. Se sacaron a propósito. Cuando haya clientes reales, se repone con datos reales y verificables — no antes.

---

Para el detalle de cómo se construyó la tienda Aprende (catálogo, checkout, cuentas, panel admin), ver `APRENDE_README.md`. Para las trampas de despliegue y las variables de entorno confirmadas/no confirmadas en Vercel, ver `README.md` en la raíz de este repo — este documento (`ESTADO.md`) es el resumen ejecutivo pensado para Lu; esos otros dos son más técnicos.
