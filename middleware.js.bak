import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'nexa-platform-secret-key-2026-change-in-production');

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Let Next.js handle statics and API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('nexa_session')?.value;

  // Si el usuario entra al portal general de acceso
  if (pathname === '/portal' || pathname === '/clientes' || pathname === '/admin/login') {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL(payload.role === 'client' ? '/clientes/dashboard' : '/admin/dashboard', request.url));
      } catch {
        return NextResponse.next();
      }
    }
    // Si la ruta era de las viejas, redirigir al portal unificado
    if (pathname === '/clientes' || pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    return NextResponse.next();
  }

  // Define protected paths
  const isClientDashboard = pathname.startsWith('/clientes/dashboard');
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isClientDashboard || isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      if (isAdminPath && !['admin', 'team'].includes(payload.role)) {
        return NextResponse.redirect(new URL('/clientes/dashboard', request.url));
      }

      if (isClientDashboard && payload.role === 'client') {
        return NextResponse.next();
      }

      if (isClientDashboard && ['admin', 'team'].includes(payload.role)) {
        return NextResponse.next();
      }

      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/portal', request.url));
      response.cookies.delete('nexa_session');
      return response;
    }
  }

  // All other routes are public
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
