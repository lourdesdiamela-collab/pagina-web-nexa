'use client';

import Image from 'next/image';

/*
 * Tira de fotos de la home: pasa sola, sin títulos ni controles, para
 * acompañar visualmente el contenido de la página.
 *
 * Las fotos son de Unsplash (licencia libre para uso comercial, sin
 * atribución obligatoria): personas con el celular, computadoras y equipos
 * trabajando. Son ilustrativas: el texto alternativo describe la escena y en
 * ningún lado se dice que sean el equipo de NEXA ni clientes de NEXA.
 *
 * Cómo se mueve: cada 3 segundos la tira avanza una foto (0,6 s de
 * movimiento y 2,4 s de pausa). La lista está repetida dos veces seguidas y la
 * animación CSS llega exactamente al final de la primera vuelta, así el ciclo
 * vuelve a empezar sin saltos. No usa JavaScript para moverse. Se frena al
 * pasar el mouse y queda quieta si el sistema del visitante pide reducir el
 * movimiento.
 */

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`;

const PHOTOS = [
  { id: 'photo-1572021335469-31706a17aaef', alt: 'Cuatro personas revisan juntas una computadora en una mesa de trabajo' },
  { id: 'photo-1562147458-0c12e8d29f50', alt: 'Manos sosteniendo un celular con una grilla de fotos de Instagram, junto a un teclado' },
  { id: 'photo-1563986768494-4dee2763ff3f', alt: 'Persona usando una computadora con una red social abierta mientras mira el celular' },
  { id: 'photo-1522202176988-66273c2fd55f', alt: 'Tres personas trabajan con sus computadoras alrededor de una mesa' },
  { id: 'photo-1570215171424-f74325192b55', alt: 'Hombre trabajando con una computadora portátil y el celular sobre un escritorio' },
  { id: 'photo-1543269865-0a740d43b90c', alt: 'Dos mujeres trabajando juntas frente a una computadora portátil' },
];

export default function HomeCarousel() {
  // Dos vueltas seguidas para que el desplazamiento no tenga cortes.
  const loop = [...PHOTOS, ...PHOTOS];

  return (
    <section className="hc-strip" aria-label="Fotos de personas trabajando en marketing digital">
      <div className="hc-track">
        {loop.map((p, i) => (
          <div key={`${p.id}-${i}`} className="hc-photo" aria-hidden={i >= PHOTOS.length ? 'true' : undefined}>
            <Image
              src={UNSPLASH(p.id)}
              alt={i >= PHOTOS.length ? '' : p.alt}
              fill
              sizes="(max-width: 640px) 260px, 440px"
              style={{ objectFit: 'cover' }}
              loading={i < 3 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hc-strip { --step: 460px; padding: 24px 0 80px; overflow: hidden; }
        .hc-track { display: flex; gap: 20px; width: max-content; animation: hc-step 18s ease-in-out infinite; }
        .hc-strip:hover .hc-track { animation-play-state: paused; }
        .hc-photo { position: relative; flex: 0 0 auto; width: 440px; height: 300px; border-radius: 24px; overflow: hidden; background: var(--bg-soft); box-shadow: 0 10px 30px rgba(18,20,29,0.08); }
        /* 6 fotos x 3 s = 18 s por vuelta; --step = ancho de una foto + el espacio entre fotos */
        @keyframes hc-step {
          0%, 13.333% { transform: translateX(0); }
          16.667%, 30% { transform: translateX(calc(var(--step) * -1)); }
          33.333%, 46.667% { transform: translateX(calc(var(--step) * -2)); }
          50%, 63.333% { transform: translateX(calc(var(--step) * -3)); }
          66.667%, 80% { transform: translateX(calc(var(--step) * -4)); }
          83.333%, 96.667% { transform: translateX(calc(var(--step) * -5)); }
          100% { transform: translateX(calc(var(--step) * -6)); }
        }
        @media (max-width: 640px) {
          .hc-strip { --step: 272px; padding: 12px 0 56px; }
          .hc-track { gap: 12px; }
          .hc-photo { width: 260px; height: 190px; border-radius: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-track { animation: none; }
          .hc-strip { overflow-x: auto; }
        }
      `}} />
    </section>
  );
}
