import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { ipDe } from '@/lib/seguridad';

/*
 * Límite de pedidos DURABLE (compartido entre todas las instancias del
 * servidor), sin servicios nuevos: usa la misma base Postgres del sitio.
 *
 * Por qué: el límite en memoria de lib/seguridad.js (permitidoPorIp) vive en
 * cada instancia de Vercel por separado, así que con varias instancias en
 * paralelo o después de un reinicio se reinicia solo. Este límite cuenta los
 * pedidos en la tabla "RateLimitHit", que ven todas las instancias.
 *
 * La tabla NO está en prisma/schema.prisma a propósito: se crea sola la
 * primera vez (CREATE TABLE IF NOT EXISTS), una vez por instancia. OJO: si
 * algún día se corre `prisma db push` o `prisma migrate dev`, Prisma la va a
 * ver como "drift"; no hay que dejar que la borre (o agregarla al schema).
 *
 * Privacidad: no se guarda la IP ni el email en claro, solo un hash SHA-256.
 *
 * Si la base falla, el límite deja pasar (fail open) y lo deja en el log: es
 * preferible no trabar a un cliente real por un problema de la base.
 */

let tablaLista = null;

function asegurarTabla() {
  if (!tablaLista) {
    tablaLista = (async () => {
      await prisma.$executeRawUnsafe(
        'CREATE TABLE IF NOT EXISTS "RateLimitHit" (' +
          '"id" BIGSERIAL PRIMARY KEY, ' +
          '"bucket" TEXT NOT NULL, ' +
          '"key" TEXT NOT NULL, ' +
          '"createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()' +
        ')',
      );
      await prisma.$executeRawUnsafe(
        'CREATE INDEX IF NOT EXISTS "RateLimitHit_bucket_key_createdAt_idx" ON "RateLimitHit" ("bucket", "key", "createdAt")',
      );
    })().catch((error) => {
      // Que el próximo pedido lo vuelva a intentar.
      tablaLista = null;
      throw error;
    });
  }
  return tablaLista;
}

function hashear(valor) {
  return crypto.createHash('sha256').update(String(valor ?? '')).digest('hex');
}

// Los registros de "deduplicación" (bucket que empieza con "dedupe:") se
// guardan mucho más tiempo que los de límite de pedidos.
const RETENCION_LIMITES = "interval '2 days'";
const RETENCION_DEDUPE = "interval '120 days'";

function limpiarDeVezEnCuando() {
  if (Math.random() > 0.01) return;
  prisma
    .$executeRawUnsafe(
      `DELETE FROM "RateLimitHit" WHERE ("bucket" NOT LIKE 'dedupe:%' AND "createdAt" < now() - ${RETENCION_LIMITES}) ` +
        `OR ("bucket" LIKE 'dedupe:%' AND "createdAt" < now() - ${RETENCION_DEDUPE})`,
    )
    .catch((error) => console.error('[rateLimit] No se pudieron limpiar registros viejos:', error?.message || error));
}

/*
 * Registra un pedido y dice si está dentro del límite.
 *   bucket: nombre del límite ('contacto', 'login-ip', ...)
 *   clave:  quién (IP, email, id de usuario...). Se guarda hasheada.
 *   maximo: cuántos pedidos se permiten en la ventana.
 *   ventanaMs: ventana deslizante en milisegundos.
 * Devuelve true si se permite, false si se pasó del límite.
 *
 * Se inserta primero y se cuenta después (incluyendo el pedido actual): así
 * dos pedidos simultáneos no pueden colarse los dos por el último lugar.
 */
export async function limitar(bucket, clave, { maximo, ventanaMs }) {
  try {
    await asegurarTabla();
    const key = hashear(clave);
    const desde = new Date(Date.now() - ventanaMs);
    await prisma.$executeRaw`INSERT INTO "RateLimitHit" ("bucket", "key") VALUES (${bucket}, ${key})`;
    const filas = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS n FROM "RateLimitHit"
      WHERE "bucket" = ${bucket} AND "key" = ${key} AND "createdAt" > ${desde}`;
    limpiarDeVezEnCuando();
    const n = Number(filas?.[0]?.n ?? 0);
    return n <= maximo;
  } catch (error) {
    console.error(`[rateLimit] Error en el límite "${bucket}" — se deja pasar (fail open):`, error?.message || error);
    return true;
  }
}

/*
 * Deduplicación: devuelve true solo la PRIMERA vez que se ve (bucket, clave)
 * dentro de la ventana. Sirve para no procesar dos veces el mismo aviso de
 * pago. Si la base falla, devuelve true (se procesa).
 */
export async function primeraVez(bucket, clave, ventanaMs) {
  return limitar(`dedupe:${bucket}`, clave, { maximo: 1, ventanaMs });
}

/* IP del visitante (ver ipDe en lib/seguridad.js). */
export function ipCliente(request) {
  return ipDe(request);
}

export const MINUTO = 60 * 1000;
export const HORA = 60 * MINUTO;
export const DIA = 24 * HORA;
