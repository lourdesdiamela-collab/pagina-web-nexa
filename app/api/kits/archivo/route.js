import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { leerTokenKit } from '@/lib/kitsAcceso';
import { kitPorSlug } from '@/lib/kits.mjs';
import { limitar, ipCliente, HORA } from '@/lib/rateLimit';

// Entrega los archivos de un kit comprado. Solo con un enlace firmado válido
// (ver lib/kitsAcceso.js). Los archivos están en kits-privados/, fuera de public/.
export const dynamic = 'force-dynamic';

const PRIVADO = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

function fallo(mensaje, status) {
  return NextResponse.json({ error: mensaje }, { status, headers: PRIVADO });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const acceso = leerTokenKit(searchParams.get('t'));
  if (!acceso) return fallo('El enlace no es válido o venció. Escribinos y te mandamos uno nuevo.', 403);

  const kit = kitPorSlug(acceso.kit);
  const archivo = kit?.archivos.find((a) => a.id === searchParams.get('f'));
  if (!kit || !archivo) return fallo('Archivo no encontrado.', 404);

  // Tope por enlace y por IP: alcanza de sobra para una persona y frena que se reparta el material.
  if (!(await limitar('kit-descarga', `${acceso.referencia}:${archivo.id}`, { maximo: 30, ventanaMs: 24 * HORA }))
    || !(await limitar('kit-descarga-ip', ipCliente(request), { maximo: 60, ventanaMs: HORA }))) {
    return fallo('Llegaste al límite de descargas por hoy. Probá de nuevo mañana o escribinos.', 429);
  }

  try {
    const ruta = path.join(process.cwd(), 'kits-privados', kit.carpeta, archivo.archivo);
    const datos = await fs.readFile(ruta);
    const online = searchParams.get('ver') === '1' && archivo.abrirOnline;
    const headers = {
      ...PRIVADO,
      'Content-Type': archivo.tipo,
      'Content-Length': String(datos.length),
      'Content-Disposition': `${online ? 'inline' : 'attachment'}; filename="${archivo.descarga}"`,
    };
    // La guía interactiva corre scripts propios: se encierra sin acceso a la red.
    if (archivo.tipo.startsWith('text/html')) {
      headers['Content-Security-Policy'] = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src data: blob:; font-src data:; base-uri 'none'; form-action 'none'";
    }
    return new NextResponse(datos, { status: 200, headers });
  } catch (e) {
    console.error('GET /api/kits/archivo:', e);
    return fallo('No pudimos leer el archivo. Escribinos y lo resolvemos.', 500);
  }
}
