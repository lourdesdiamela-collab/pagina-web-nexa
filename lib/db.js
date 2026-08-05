import { PrismaClient } from '@prisma/client';

// Patrón estándar de Next.js para evitar abrir demasiadas conexiones en dev
// (hot-reload crea un PrismaClient nuevo por cada recarga si no se cachea en `global`).
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
