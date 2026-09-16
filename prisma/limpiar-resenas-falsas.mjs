/*
 * Limpieza de las reseñas inventadas que el seed viejo cargó en la base.
 *
 * CONTEXTO: hasta septiembre de 2026, prisma/seed.mjs creaba 3 reseñas
 * inventadas por producto (nombres y comentarios sacados de dos listas fijas
 * en lib/products.mjs). Como el rating que muestra la web es el promedio real
 * de esas filas, los ~100 recursos mostraban todos la misma valoración
 * idéntica: "4.7 (3)".
 *
 * Sacar el código del seed evita que se creen NUEVAS reseñas falsas, pero no
 * borra las que ya están cargadas. Este script las borra.
 *
 * CÓMO SE USA (desde la raíz del proyecto):
 *
 *   1) Ver qué se va a borrar, sin tocar nada:
 *        node prisma/limpiar-resenas-falsas.mjs
 *
 *   2) Borrar de verdad (pide confirmación explícita):
 *        node prisma/limpiar-resenas-falsas.mjs --confirmar
 *
 * IMPORTANTE:
 *   - Corre contra la base que indique DATABASE_URL. Verificá contra cuál
 *     estás apuntando antes de usar --confirmar.
 *   - Hacé una copia de seguridad de la base antes de correrlo en producción.
 *   - Solo borra reseñas SIN userId (las falsas nunca tuvieron usuario). Una
 *     reseña escrita por un comprador real siempre queda asociada a su
 *     usuario, así que no se toca.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Los textos exactos que usaba el seed viejo. Solo se borran reseñas cuyo
// comentario esté en esta lista: así, si Lu cargó alguna reseña a mano, no se
// la lleva puesta.
const COMENTARIOS_FALSOS = [
  'Justo lo que necesitaba, clarísimo y fácil de aplicar.',
  'Lo apliqué la misma semana que lo compré y ya noté la diferencia.',
  'Mucho mejor de lo que esperaba por el precio.',
  'Las plantillas solas ya valen la compra.',
  'Directo al punto, sin relleno innecesario.',
  'Lo recomiendo a cualquiera que recién arranca.',
  'Los ejemplos reales ayudan un montón a entender cómo aplicarlo.',
  'Volví a comprar otra guía de la misma categoría, nivel muy bueno.',
  'Se nota que está pensado para pymes reales, no para teoría.',
  'Fácil de seguir incluso sin experiencia previa.',
  'El bonus terminó siendo lo que más usé.',
  'Contenido actualizado, no es lo mismo de siempre.',
];

async function main() {
  const confirmar = process.argv.includes('--confirmar');

  const criterio = {
    userId: null,
    comment: { in: COMENTARIOS_FALSOS },
  };

  const total = await prisma.review.count();
  const aBorrar = await prisma.review.count({ where: criterio });
  const reales = total - aBorrar;

  console.log(`Reseñas en la base: ${total}`);
  console.log(`Reseñas inventadas detectadas (sin usuario + texto del seed viejo): ${aBorrar}`);
  console.log(`Reseñas que NO se tocan: ${reales}`);

  if (aBorrar === 0) {
    console.log('\nNo hay nada para borrar.');
    return;
  }

  if (!confirmar) {
    console.log('\nModo consulta: no se borró nada.');
    console.log('Para borrarlas de verdad, volvé a correr el script con --confirmar');
    console.log('(hacé una copia de seguridad de la base antes).');
    return;
  }

  const { count } = await prisma.review.deleteMany({ where: criterio });
  console.log(`\nListo: ${count} reseñas inventadas borradas.`);
  console.log('Los productos quedan sin valoración hasta que haya reseñas de compradores reales.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
