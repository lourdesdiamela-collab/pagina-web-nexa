'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import {
  COOKIE_LAST, COOKIE_FIRST, COOKIE_MAX_AGE, attributionFromSearch,
} from '@/lib/attribution';
import { track } from '@/lib/track';

/*
 * Medición del sitio (herramienta #8 y tracking de campañas).
 *
 * Hace tres cosas:
 *
 * 1. Guarda de qué campaña llegó cada visitante (ver lib/attribution.js) en
 *    dos cookies propias: la última campaña y la primera visita.
 *
 * 2. Avisa cada clic en un botón de WhatsApp como evento `whatsapp_click`
 *    (ver lib/track.js), con el botón desde el que se hizo.
 *
 * 3. Carga Google Tag Manager y el Píxel de Meta SOLO si sus identificadores
 *    están cargados en Vercel:
 *      NEXT_PUBLIC_GTM_ID          (formato GTM-XXXXXXX)
 *      NEXT_PUBLIC_META_PIXEL_ID   (solo números)
 *    Sin esas variables no se carga ningún script externo.
 */

const GTM_ID = /^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID || '') ? process.env.NEXT_PUBLIC_GTM_ID : null;
const PIXEL_ID = /^\d{6,20}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID || '') ? process.env.NEXT_PUBLIC_META_PIXEL_ID : null;

function setCookie(name, value) {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Sin cookies (modo privado estricto, etc.): se sigue sin atribución.
  }
}

function hasCookie(name) {
  try {
    return document.cookie.split('; ').some((c) => c.startsWith(`${name}=`));
  } catch {
    return false;
  }
}

function externalReferrer() {
  try {
    if (!document.referrer) return null;
    const ref = new URL(document.referrer);
    if (ref.host === window.location.host) return null;
    return ref.host.slice(0, 120);
  } catch {
    return null;
  }
}

export default function TrackingScripts() {
  const pathname = usePathname();

  // 1. Atribución: en cada cambio de página, por si el link traía parámetros.
  useEffect(() => {
    const ts = new Date().toISOString();
    const campaign = attributionFromSearch(window.location.search);
    const landing = window.location.pathname.slice(0, 200);
    const referrer = externalReferrer();

    if (campaign) {
      setCookie(COOKIE_LAST, { ...campaign, landing, ...(referrer ? { referrer } : {}), ts });
    }
    if (!hasCookie(COOKIE_FIRST)) {
      setCookie(COOKIE_FIRST, { ...(campaign || {}), landing, ...(referrer ? { referrer } : {}), ts });
    }
  }, [pathname]);

  // 2. Clics en WhatsApp (todos pasan por /wa, ver lib/whatsapp.js).
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target && event.target.closest ? event.target.closest('a[href^="/wa"]') : null;
      if (!link) return;
      let location = 'sitio';
      try {
        location = new URL(link.href, window.location.origin).searchParams.get('from') || 'sitio';
      } catch {
        // href raro: se manda igual con 'sitio'
      }
      track('whatsapp_click', { location, page_path: window.location.pathname });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return (
    <>
      {GTM_ID && (
        <>
          <Script id="gtm-base" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
