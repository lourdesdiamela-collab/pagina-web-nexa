import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/*
 * Middleware del sitio. Hace tres cosas, en este orden:
 *
 * 1. Robots de IA que juntan contenido para ENTRENAR modelos: 403. Es la
 *    parte que se puede hacer cumplir de lo que pide app/robots.js (los
 *    robots de búsqueda con IA, Google, Bing y los previsualizadores de links
 *    de WhatsApp/Facebook/LinkedIn/X NO están en esta lista). /robots.txt
 *    siempre responde, para que puedan leer la política.
 *
 * 2. /aprende/admin: solo administradores. Primera barrera; cada página del
 *    admin vuelve a chequear con requireAdminPage() (lib/adminAuth.js),
 *    porque el chequeo del layout se podía saltear con un pedido "RSC"
 *    armado a mano.
 *
 * 3. Content-Security-Policy, por ahora SOLO EN MODO REPORTE
 *    (Content-Security-Policy-Report-Only): el navegador avisa en la consola
 *    lo que bloquearía, pero no bloquea nada. Cuando se confirme durante unos
 *    días que no aparece ningún aviso legítimo (GTM, Píxel de Meta), se cambia
 *    el nombre del header a Content-Security-Policy para que se aplique.
 */

// Mantener en sincronía con AI_TRAINING_BOTS de app/robots.js.
const AI_TRAINING_UA = /(GPTBot|ClaudeBot|anthropic-ai|CCBot|Google-Extended|Applebot-Extended|Bytespider|meta-externalagent|FacebookBot|cohere-ai|cohere-training-data-crawler|Diffbot|ImagesiftBot|Omgilibot|Timpibot|AI2Bot|PanguBot|Webzio-Extended|img2dataset|Amazonbot)/i;

function politicaDeContenido(nonce) {
  return [
    "default-src 'self'",
    // 'strict-dynamic': los scripts con el nonce (los de Next y los de
    // medición) pueden cargar otros scripts (GTM carga GA4, etc.). Los
    // dominios quedan como respaldo para navegadores viejos.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://connect.facebook.net`,
    // Hay estilos en línea (atributos style, <style> de componentes, framer-motion).
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com https://www.facebook.com https://googleads.g.doubleclick.net https://www.google.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
    "frame-src https://www.googletagmanager.com https://td.doubleclick.net",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    'upgrade-insecure-requests',
  ].join('; ');
}

async function esAdmin(request) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // Sin NEXTAUTH_SECRET el middleware no puede leer la sesión. En Vercel
    // eso es un error de configuración (ver lib/auth.js): se cierra el paso.
    // En una máquina local (clave en .nexa/auth-secret) se deja pasar y
    // decide requireAdminPage() en cada página.
    return process.env.VERCEL_ENV ? false : null;
  }
  try {
    const token = await getToken({ req: request, secret });
    return token?.role === 'ADMIN' && Boolean(token?.id);
  } catch (error) {
    console.error('[middleware] No se pudo leer la sesión:', error?.message || error);
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Robots de entrenamiento de IA.
  if (pathname !== '/robots.txt' && AI_TRAINING_UA.test(request.headers.get('user-agent') || '')) {
    return new NextResponse('Forbidden', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' },
    });
  }

  // 2. Panel de administración.
  if (pathname === '/aprende/admin' || pathname.startsWith('/aprende/admin/')) {
    const admin = await esAdmin(request);
    if (admin === false) {
      const login = new URL('/aprende/cuenta/login', request.url);
      login.searchParams.set('callbackUrl', '/aprende/admin');
      return NextResponse.redirect(login);
    }
  }

  // Las rutas de API devuelven JSON o archivos: no necesitan CSP con nonce.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 3. Content-Security-Policy con nonce (modo reporte).
  const nonce = btoa(crypto.randomUUID());
  const politica = politicaDeContenido(nonce);

  // Next lee el nonce del header de CSP del PEDIDO y lo pone en sus scripts;
  // app/layout.js lo lee de x-nonce para los scripts de medición.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy-Report-Only', politica);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy-Report-Only', politica);
  return response;
}

export const config = {
  // Todo menos los archivos estáticos de Next y los archivos con extensión
  // (imágenes, robots.txt, sitemap.xml...): robots.txt queda siempre accesible.
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
};
