import { prisma } from '@/lib/db';

/*
 * Solicitudes de arrepentimiento (herramienta #10 del brief de Fase 2).
 *
 * generarYCrearCaso() genera el número de trámite (ARR-{año}-{correlativo})
 * y crea el registro en la misma operación: el correlativo se calcula
 * contando los casos del año y reintentando si otra solicitud se coló en el
 * medio (choque de números por dos envíos casi simultáneos), igual que
 * generarCodigo() en el CRM para los códigos de referencia.
 */

const MAX_INTENTOS = 5;

export async function generarYCrearCaso(datos) {
  const year = new Date().getFullYear();

  for (let intento = 0; intento < MAX_INTENTOS; intento++) {
    const count = await prisma.arrepentimientoRequest.count({
      where: { numero: { startsWith: `ARR-${year}-` } },
    });
    const numero = `ARR-${year}-${String(count + 1 + intento).padStart(4, '0')}`;

    try {
      const caso = await prisma.arrepentimientoRequest.create({
        data: { numero, ...datos },
      });
      return caso;
    } catch (err) {
      // P2002 = violación de restricción única (choque de numero): reintentar
      // con el siguiente correlativo.
      if (err?.code === 'P2002' && intento < MAX_INTENTOS - 1) continue;
      throw err;
    }
  }

  throw new Error('No se pudo generar un número de trámite único.');
}
