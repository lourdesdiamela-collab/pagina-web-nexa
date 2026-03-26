import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Let Next.js handle statics and API
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('nexa_session')?.value;

  // Public access for /portal
  if (pathname === '/portal' || pathname === '/clientes' || pathname === '/admin/login') {
    if (token) {
       // We'll trust the cookie presence for now to avoid build-time edge crashes
       // The pages themselves will verify the token's validity
       return NextResponse.next();
    }
    // Si la ruta era de las viejas, redirigir al portal unificado
    if (pathname === '/clientes' || pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    return NextResponse.next();
  }

  // Define protected paths
  const isClientDashboard = pathname.startsWith('/clientes');
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if (isClientDashboard || isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    // Validation will happen in the layout/page components
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
