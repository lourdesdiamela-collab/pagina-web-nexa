'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Search, Send } from 'lucide-react';

/*
 * Carrusel ilustrativo de la home: "así se ve el trabajo".
 *
 * Las imágenes NO son fotos de stock ni del equipo: son ilustraciones hechas
 * con HTML/CSS que muestran el tipo de trabajo que hace NEXA (plan, contenido,
 * anuncios, búsqueda, seguimiento). Así no se presenta a desconocidos como
 * "el equipo de NEXA" y no se inventan métricas: ninguna pieza muestra
 * resultados, solo el formato del trabajo.
 *
 * Sin librerías: el deslizamiento usa scroll-snap nativo (funciona con el dedo
 * en celular), las flechas y los puntos mueven el scroll, y el avance
 * automático se apaga si el visitante interactúa o si su sistema pide
 * reducir el movimiento.
 */

const SLIDES = [
  {
    id: 'estrategia',
    tag: '01 · Estrategia',
    title: 'Un plan antes de publicar o invertir',
    desc: 'Diagnóstico, objetivos y un plan de 90 días con las acciones de cada canal.',
  },
  {
    id: 'contenido',
    tag: '02 · Contenido',
    title: 'Contenido con un objetivo en cada pieza',
    desc: 'Reels, posts e historias pensados para tu audiencia, no para llenar el calendario.',
  },
  {
    id: 'meta-ads',
    tag: '03 · Meta Ads',
    title: 'Anuncios que llevan a una conversación',
    desc: 'Campañas en Instagram y Facebook que terminan en un mensaje o un formulario.',
  },
  {
    id: 'google-ads',
    tag: '04 · Google Ads',
    title: 'Aparecer cuando tu cliente ya te busca',
    desc: 'Campañas de búsqueda para captar a quien ya tiene la intención de comprar.',
  },
  {
    id: 'seguimiento',
    tag: '05 · Seguimiento',
    title: 'Que ninguna consulta se enfríe',
    desc: 'Cada contacto queda registrado y recibe respuesta, por WhatsApp o por mail.',
  },
];

/* ─── Ilustraciones ─── */

function ArtEstrategia() {
  const cols = [
    { m: 'Mes 1', items: ['Diagnóstico', 'Propuesta de valor'] },
    { m: 'Mes 2', items: ['Contenido', 'Campañas'] },
    { m: 'Mes 3', items: ['Medición', 'Ajustes'] },
  ];
  return (
    <div className="hc-laptop" aria-hidden="true">
      <div className="hc-laptop-screen">
        <div className="hc-bar"><span /><span /><span /></div>
        <div className="hc-plan">
          {cols.map((c) => (
            <div key={c.m} className="hc-plan-col">
              <div className="hc-plan-head">{c.m}</div>
              {c.items.map((it) => (
                <div key={it} className="hc-plan-chip">{it}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="hc-laptop-base" />
    </div>
  );
}

function ArtContenido() {
  return (
    <div className="hc-phone" aria-hidden="true">
      <div className="hc-phone-notch" />
      <div className="hc-profile">
        <div className="hc-avatar" />
        <div className="hc-lines"><span /><span /></div>
      </div>
      <div className="hc-grid">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`hc-tile hc-tile-${i}`}>
            {i === 1 && <Play size={16} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtMetaAds() {
  return (
    <div className="hc-ad" aria-hidden="true">
      <div className="hc-ad-head">
        <div className="hc-avatar hc-avatar-sm" />
        <div>
          <div className="hc-ad-name">Tu marca</div>
          <div className="hc-ad-sub">Publicidad</div>
        </div>
      </div>
      <div className="hc-ad-media" />
      <div className="hc-ad-cta">
        <span>Enviar mensaje</span>
        <Send size={14} />
      </div>
    </div>
  );
}

function ArtGoogleAds() {
  return (
    <div className="hc-serp" aria-hidden="true">
      <div className="hc-serp-search">
        <Search size={14} />
        <span>agencia de marketing en buenos aires</span>
      </div>
      <div className="hc-serp-result hc-serp-ad">
        <div className="hc-serp-label">Patrocinado · tuempresa.com.ar</div>
        <div className="hc-serp-title">Tu negocio, primero en Google</div>
        <div className="hc-lines"><span /><span /></div>
      </div>
      <div className="hc-serp-result">
        <div className="hc-lines hc-lines-muted"><span /><span /><span /></div>
      </div>
    </div>
  );
}

function ArtSeguimiento() {
  return (
    <div className="hc-chat" aria-hidden="true">
      <div className="hc-chat-head">
        <div className="hc-avatar hc-avatar-sm" />
        <div className="hc-ad-name">Consulta nueva</div>
        <span className="hc-chat-tag">Lead</span>
      </div>
      <div className="hc-bubble hc-bubble-in">Hola, quiero info de sus servicios</div>
      <div className="hc-bubble hc-bubble-out">¡Hola! Te cuento cómo trabajamos y te paso una propuesta</div>
      <div className="hc-bubble hc-bubble-in">Genial, gracias</div>
    </div>
  );
}

const ART = {
  estrategia: ArtEstrategia,
  contenido: ArtContenido,
  'meta-ads': ArtMetaAds,
  'google-ads': ArtGoogleAds,
  seguimiento: ArtSeguimiento,
};

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
            const Art = ART[s.id];
            return (
              <article key={s.id} className="hc-card" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${SLIDES.length}: ${s.title}`}>
                <div className={`hc-visual hc-visual-${s.id}`}>
                  <Art />
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
        .hc-visual { height: 260px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .hc-visual-estrategia { background: linear-gradient(160deg, #F3EEF8, #E9E1FB); }
        .hc-visual-contenido { background: linear-gradient(160deg, #FBEFFC, #F3EEF8); }
        .hc-visual-meta-ads { background: linear-gradient(160deg, #EFE9FD, #FBEFFC); }
        .hc-visual-google-ads { background: linear-gradient(160deg, #F4F6FB, #EEE8FB); }
        .hc-visual-seguimiento { background: linear-gradient(160deg, #EEF7F1, #F3EEF8); }
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

        /* piezas comunes */
        .hc-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #B89BFF, #EAA1FB); flex-shrink: 0; }
        .hc-avatar-sm { width: 30px; height: 30px; }
        .hc-lines { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .hc-lines span { display: block; height: 7px; border-radius: 4px; background: rgba(18,20,29,0.14); }
        .hc-lines span:nth-child(2) { width: 70%; }
        .hc-lines span:nth-child(3) { width: 45%; }
        .hc-lines-muted span { background: rgba(18,20,29,0.08); }

        /* laptop */
        .hc-laptop { width: 82%; max-width: 330px; }
        .hc-laptop-screen { background: #fff; border: 6px solid #1A1C29; border-radius: 12px 12px 4px 4px; padding: 10px; box-shadow: 0 18px 40px rgba(18,20,29,0.18); }
        .hc-laptop-base { height: 10px; margin: 0 -8%; background: linear-gradient(#2A2D3D, #12141D); border-radius: 0 0 12px 12px; }
        .hc-bar { display: flex; gap: 5px; margin-bottom: 10px; }
        .hc-bar span { width: 7px; height: 7px; border-radius: 50%; background: #E3DCF5; }
        .hc-plan { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .hc-plan-head { font-size: 0.66rem; font-weight: 800; color: var(--lilac-deep); margin-bottom: 6px; }
        .hc-plan-chip { font-size: 0.62rem; font-weight: 600; color: var(--text-dark); background: var(--bg-soft); border: 1px solid var(--border-light); border-radius: 6px; padding: 6px; margin-bottom: 6px; }
        .hc-plan-col:nth-child(2) .hc-plan-chip { background: #FBEFFC; }
        .hc-plan-col:nth-child(3) .hc-plan-chip { background: #EEF0FD; }

        /* teléfono */
        .hc-phone { width: 150px; height: 230px; margin-top: 40px; background: #fff; border: 6px solid #1A1C29; border-radius: 26px; padding: 18px 10px 0; position: relative; box-shadow: 0 18px 40px rgba(18,20,29,0.18); }
        .hc-phone-notch { position: absolute; top: 6px; left: 50%; transform: translateX(-50%); width: 46px; height: 6px; border-radius: 4px; background: #1A1C29; }
        .hc-profile { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
        .hc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
        .hc-tile { aspect-ratio: 1; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: #fff; }
        .hc-tile-0 { background: linear-gradient(135deg, #B89BFF, #835CE6); }
        .hc-tile-1 { background: linear-gradient(135deg, #1A1C29, #3B3F55); }
        .hc-tile-2 { background: linear-gradient(135deg, #EAA1FB, #FE8FD9); }
        .hc-tile-3 { background: linear-gradient(135deg, #F3EEF8, #D9CCF7); }
        .hc-tile-4 { background: linear-gradient(135deg, #835CE6, #C026D3); }
        .hc-tile-5 { background: linear-gradient(135deg, #E9E1FB, #B89BFF); }

        /* anuncio */
        .hc-ad { width: 200px; background: #fff; border-radius: 16px; padding: 12px; box-shadow: 0 18px 40px rgba(18,20,29,0.14); }
        .hc-ad-head { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
        .hc-ad-name { font-size: 0.72rem; font-weight: 800; color: var(--text-dark); }
        .hc-ad-sub { font-size: 0.62rem; color: var(--text-muted); }
        .hc-ad-media { height: 120px; border-radius: 10px; background: linear-gradient(135deg, #835CE6 0%, #B89BFF 55%, #EAA1FB 100%); }
        .hc-ad-cta { margin-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; font-weight: 700; color: var(--lilac-deep); background: var(--bg-soft); border-radius: 8px; padding: 8px 10px; }

        /* resultados de búsqueda */
        .hc-serp { width: 84%; max-width: 320px; background: #fff; border-radius: 16px; padding: 14px; box-shadow: 0 18px 40px rgba(18,20,29,0.12); }
        .hc-serp-search { display: flex; gap: 8px; align-items: center; font-size: 0.68rem; color: var(--text-body); border: 1px solid #E5E5EC; border-radius: 999px; padding: 8px 12px; margin-bottom: 12px; white-space: nowrap; overflow: hidden; }
        .hc-serp-result { padding: 10px 4px; border-top: 1px solid #F0F0F4; }
        .hc-serp-ad { border-top: none; }
        .hc-serp-label { font-size: 0.6rem; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
        .hc-serp-title { font-size: 0.82rem; font-weight: 700; color: #4C3BC2; margin-bottom: 8px; }

        /* chat */
        .hc-chat { width: 82%; max-width: 300px; background: #fff; border-radius: 16px; padding: 12px; box-shadow: 0 18px 40px rgba(18,20,29,0.12); display: flex; flex-direction: column; gap: 8px; }
        .hc-chat-head { display: flex; align-items: center; gap: 8px; padding-bottom: 8px; border-bottom: 1px solid #F0F0F4; }
        .hc-chat-tag { margin-left: auto; font-size: 0.6rem; font-weight: 800; color: #166534; background: #DCFCE7; border-radius: 999px; padding: 3px 8px; }
        .hc-bubble { font-size: 0.7rem; line-height: 1.45; padding: 8px 10px; border-radius: 12px; max-width: 85%; }
        .hc-bubble-in { background: #F3F4F6; color: var(--text-dark); align-self: flex-start; border-bottom-left-radius: 4px; }
        .hc-bubble-out { background: #DCF8C6; color: #12301A; align-self: flex-end; border-bottom-right-radius: 4px; }

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
          .hc-card, .hc-arrow, .hc-dot { transition: none; }
        }
      `}} />
    </section>
  );
}
