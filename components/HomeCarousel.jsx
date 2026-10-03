'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/*
 * Carrusel ilustrativo de la home: "así se ve el trabajo".
 *
 * Las fotos son de Unsplash (licencia libre para uso comercial, sin
 * atribución obligatoria): personas con el celular, computadoras y equipos
 * trabajando. Son ilustrativas: el texto alternativo describe la escena y en
 * ningún lado se dice que sean el equipo de NEXA ni clientes de NEXA.
 *
 * Sin librerías: el deslizamiento usa scroll-snap nativo (funciona con el dedo
 * en celular), las flechas y los puntos mueven el scroll, y el avance
 * automático se apaga si el visitante interactúa o si su sistema pide
 * reducir el movimiento. Las fotos pasan por next/image, que las sirve
 * livianas y en el tamaño justo para cada pantalla.
 */

const UNSPLASH = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`;

const SLIDES = [
  {
    id: 'estrategia',
    photo: UNSPLASH('photo-1572021335469-31706a17aaef'),
    alt: 'Cuatro personas revisan juntas una computadora en una mesa de trabajo',
    tag: '01 · Estrategia',
    title: 'Un plan antes de publicar o invertir',
    desc: 'Diagnóstico, objetivos y un plan de 90 días con las acciones de cada canal.',
  },
  {
    id: 'contenido',
    photo: UNSPLASH('photo-1562147458-0c12e8d29f50'),
    alt: 'Manos sosteniendo un celular con una grilla de fotos de Instagram, junto a un teclado',
    tag: '02 · Contenido',
    title: 'Contenido con un objetivo en cada pieza',
    desc: 'Reels, posts e historias pensados para tu audiencia, no para llenar el calendario.',
  },
  {
    id: 'meta-ads',
    photo: UNSPLASH('photo-1563986768494-4dee2763ff3f'),
    alt: 'Persona usando una computadora con una red social abierta mientras mira el celular',
    tag: '03 · Meta Ads',
    title: 'Anuncios que llevan a una conversación',
    desc: 'Campañas en Instagram y Facebook que terminan en un mensaje o un formulario.',
  },
  {
    id: 'google-ads',
    photo: UNSPLASH('photo-1570215171424-f74325192b55'),
    alt: 'Hombre trabajando con una computadora portátil y el celular sobre un escritorio',
    tag: '04 · Google Ads',
    title: 'Aparecer cuando tu cliente ya te busca',
    desc: 'Campañas de búsqueda para captar a quien ya tiene la intención de comprar.',
  },
  {
    id: 'seguimiento',
    photo: UNSPLASH('photo-1543269865-0a740d43b90c'),
    alt: 'Dos mujeres trabajando juntas frente a una computadora portátil',
    tag: '05 · Seguimiento',
    title: 'Que ninguna consulta se enfríe',
    desc: 'Cada contacto queda registrado y recibe respuesta, por WhatsApp o por mail.',
  },
];

/* ─── Carrusel ─── */

export default function HomeCarousel() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const total = SLIDES.length;
    const i = ((index % total) + total) % total;
    const slide = track.children[i];
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, []);

  // Punto activo según qué tarjeta está más a la izquierda del área visible.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => {
      const children = Array.from(track.children);
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActive(best);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  // Avance automático cada 6 s, salvo interacción o "reducir movimiento".
  useEffect(() => {
    if (paused) return undefined;
    const reduce = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const id = setInterval(() => goTo(active + 1), 6000);
    return () => clearInterval(id);
  }, [active, paused, goTo]);

  return (
    <section className="hc-section" aria-labelledby="hc-title">
      <div className="container">
        <div className="hc-header">
          <div>
            <span className="section-tag">En la práctica</span>
            <h2 id="hc-title" className="hc-title">Así se ve el trabajo</h2>
          </div>
          <div className="hc-arrows">
            <button type="button" className="hc-arrow" onClick={() => { setPaused(true); goTo(active - 1); }} aria-label="Anterior">
              <ChevronLeft size={20} />
            </button>
            <button type="button" className="hc-arrow" onClick={() => { setPaused(true); goTo(active + 1); }} aria-label="Siguiente">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="hc-track"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Ejemplos del trabajo de NEXA"
          tabIndex={0}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onFocus={() => setPaused(true)}
        >
          {SLIDES.map((s, i) => {
            return (
              <article key={s.id} className="hc-card" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${SLIDES.length}: ${s.title}`}>
                <div className="hc-visual">
                  <Image
                    src={s.photo}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, 400px"
                    style={{ objectFit: 'cover' }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="hc-copy">
                  <span className="hc-tag">{s.tag}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hc-dots" aria-label="Elegir diapositiva">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-current={active === i ? 'true' : undefined}
              aria-label={`Ir a ${s.tag}`}
              className={`hc-dot ${active === i ? 'is-active' : ''}`}
              onClick={() => { setPaused(true); goTo(i); }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hc-section { padding: 40px 0 90px; }
        .hc-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
        .hc-title { font-size: clamp(1.9rem, 3.6vw, 2.8rem); font-weight: 900; letter-spacing: -0.04em; color: var(--text-dark); margin-top: 12px; }
        .hc-arrows { display: flex; gap: 10px; }
        .hc-arrow { width: 46px; height: 46px; border-radius: 50%; border: 1px solid var(--border-light); background: var(--bg-white); color: var(--text-dark); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color .25s, color .25s, transform .25s; }
        .hc-arrow:hover { border-color: var(--lilac-deep); color: var(--lilac-deep); transform: translateY(-1px); }
        .hc-arrow:focus-visible, .hc-dot:focus-visible, .hc-track:focus-visible { outline: 2px solid var(--lilac-deep); outline-offset: 3px; }

        .hc-track { display: grid; grid-auto-flow: column; grid-auto-columns: calc((100% - 48px) / 3); gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; padding: 4px 2px 12px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .hc-track::-webkit-scrollbar { display: none; }
        .hc-card { scroll-snap-align: start; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: 28px; overflow: hidden; box-shadow: 0 4px 20px rgba(131,92,230,0.06); transition: box-shadow .3s, border-color .3s; }
        .hc-card:hover { border-color: var(--lilac); box-shadow: 0 20px 48px rgba(131,92,230,0.14); }
        .hc-visual { height: 260px; position: relative; overflow: hidden; background: var(--bg-soft); }
        .hc-visual img { transition: transform .6s cubic-bezier(.16,1,.3,1); }
        .hc-card:hover .hc-visual img { transform: scale(1.04); }
        .hc-copy { padding: 24px 26px 28px; }
        .hc-tag { display: inline-block; font-size: 0.74rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--lilac-deep); margin-bottom: 10px; }
        .hc-copy h3 { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-dark); margin-bottom: 8px; }
        .hc-copy p { font-size: 0.92rem; line-height: 1.65; color: var(--text-body); }

        .hc-dots { display: flex; justify-content: center; gap: 8px; margin-top: 22px; }
        .hc-dot { width: 8px; height: 8px; padding: 0; border-radius: 999px; border: none; background: rgba(131,92,230,0.25); cursor: pointer; transition: width .3s, background .3s; }
        .hc-dot.is-active { width: 28px; background: var(--lilac-deep); }
        /* área táctil más grande sin agrandar el punto */
        .hc-dot { position: relative; }
        .hc-dot::after { content: ''; position: absolute; inset: -14px -6px; }

        @media (max-width: 1024px) {
          .hc-track { grid-auto-columns: calc((100% - 24px) / 2); }
        }
        @media (max-width: 640px) {
          .hc-section { padding: 24px 0 70px; }
          .hc-arrows { display: none; }
          .hc-track { grid-auto-columns: 86%; gap: 14px; }
          .hc-visual { height: 230px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hc-track { scroll-behavior: auto; }
          .hc-card, .hc-arrow, .hc-dot, .hc-visual img { transition: none; }
        }
      `}} />
    </section>
  );
}
