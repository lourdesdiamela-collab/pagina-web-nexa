/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  // No anunciar con qué está hecho el sitio (header X-Powered-By).
  poweredByHeader: false,
  // Nunca publicar los mapas del código fuente en producción.
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // El filtro XSS viejo de los navegadores está obsoleto y puede
          // introducir fallas: la recomendación actual es apagarlo (0). La
          // protección real es la Content-Security-Policy (ver middleware.js).
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Aísla la ventana del sitio de las ventanas que abre o que lo abren.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), hid=(), midi=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=()' }
        ]
      },
      {
        // Otros sitios no pueden cargar nuestros recursos desde el navegador
        // (los subdominios de nexagrowth.com.ar sí). Las descargas de
        // /api/download quedan afuera porque esa ruta manda su propio valor,
        // más estricto (same-origin): dos headers CORP juntos se anulan.
        source: '/((?!api/download/).*)',
        headers: [
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
        ]
      }
    ];
  }
};

export default nextConfig;
