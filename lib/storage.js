import fs from 'fs/promises';
import path from 'path';

/*
 * Almacenamiento de archivos (PDFs de productos subidos desde el admin).
 *
 * Implementación actual: sistema de archivos local, fuera de `public/` (así las
 * descargas quedan gateadas por /api/download y no son accesibles por URL directa).
 *
 * ADVERTENCIA PARA PRODUCCIÓN (Vercel): el filesystem de las funciones serverless
 * es efímero — un archivo guardado acá puede desaparecer en el próximo deploy o
 * incluso entre invocaciones en cold start. Para producción real hace falta
 * reemplazar este módulo por Vercel Blob (@vercel/blob) o S3. La interfaz
 * (saveFile/getFile/deleteFile) está pensada para que ese cambio sea acotado a
 * este archivo. Ver APRENDE_README.md.
 */

const UPLOAD_ROOT = path.join(process.cwd(), 'storage', 'uploads');

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function saveFile(buffer, originalName, subdir = 'products') {
  const dir = path.join(UPLOAD_ROOT, subdir);
  await fs.mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${safeName(originalName)}`;
  const fullPath = path.join(dir, filename);
  await fs.writeFile(fullPath, buffer);
  return `${subdir}/${filename}`; // key guardada en Product.fileUrl
}

export async function getFile(key) {
  const fullPath = path.join(UPLOAD_ROOT, key);
  if (!fullPath.startsWith(UPLOAD_ROOT)) throw new Error('Ruta de archivo inválida.');
  return fs.readFile(fullPath);
}

export async function deleteFile(key) {
  const fullPath = path.join(UPLOAD_ROOT, key);
  if (!fullPath.startsWith(UPLOAD_ROOT)) throw new Error('Ruta de archivo inválida.');
  try {
    await fs.unlink(fullPath);
  } catch {
    /* si no existe, no hay nada que borrar */
  }
}
