import { PrismaClient } from '@prisma/client';

/*
 * Conexión a la base de datos.
 *
 * ARRANQUE SIN CONFIGURAR NADA: si DATABASE_URL no está definida (por ejemplo,
 * en una copia recién clonada del repositorio, donde no existe el archivo .env
 * porque no se versiona), se usa el archivo SQLite local por defecto en lugar
 * de reventar. Antes, sin esa variable, PrismaClient tiraba una excepción al
 * importarse y se caía TODA la aplicación, incluidas las páginas que no tocan
 * la base.
 *
 * El valor por defecto es el mismo que ya usaba el proyecto en desarrollo
 * (prisma/dev.db), así que no cambia el comportamiento de nadie que sí tenga
 * su .env armado.
 */
const DEFAULT_SQLITE_URL = 'file:./prisma/dev.db';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_SQLITE_URL;
  console.warn(
    `[db] DATABASE_URL no está definida. Usando la base SQLite local por defecto (${DEFAULT_SQLITE_URL}).\n` +
    '      Si es la primera vez, correr: npx prisma migrate deploy && npx prisma generate',
  );
}

// Patrón estándar de Next.js para evitar abrir demasiadas conexiones en dev
// (hot-reload crea un PrismaClient nuevo por cada recarga si no se cachea en `global`).
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
