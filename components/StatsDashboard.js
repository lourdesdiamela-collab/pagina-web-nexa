'use client';

import { useEffect, useRef } from 'react';

/* Sparkline point sets (x,y pairs) */
const SPARKS = {
  brands: [0, 15, 10, 13, 20, 14, 30, 9, 40, 10, 50, 4, 60, 2],
  sale: [0, 16, 10, 14, 20, 15, 30, 8, 40, 9, 50, 3, 60, 1],
  roi: [0, 14, 10, 13, 20, 12, 30, 10, 40, 9, 50, 6, 60, 3],
  years: [0, 9, 10, 10, 20, 8, 30, 9, 40, 8, 50, 9, 60, 8],
};

function sparkPoints(arr) {
  const pts = [];
  for (let i = 0; i < arr.length; i += 2) pts.push(`${arr[i]},${arr[i + 1]}`);
  return pts.join(' ');
}

const STATS = [
  { key: 'brands', target: 20, prefix: '+', suffix: '', trend: '▲ 25%', label: 'marcas asesoradas' },
  { key: 'sale', target: 340, prefix: '+', suffix: '%', trend: '▲ 38%', label: 'venta en caso destacado' },
  { key: 'roi', target: 3, prefix: '', suffix: 'x', trend: '▲ 9%', label: 'ROI promedio en campañas' },
];

const CHANNELS = [
  { label: 'Meta Ads', pct: 38, color: 'var(--gradient-accent)' },
  { label: 'Google Ads', pct: 27, color: 'var(--lilac-deep)' },
  { label: 'Orgánico', pct: 21, color: 'var(--gradient-lima)' },
  { label: 'Referidos', pct: 14, color: 'rgba(255,255,255,0.3)' },
];

/*
  Panel de resultados — sección "datos" del home.
  Cifras de ejemplo (marcadas explícitamente como tal en pantalla con
  "stats-note"): se conectarán al CRM/campañas reales de NEXA más adelante.
  La animación (contadores, gráfico de línea, barras) se dispara una sola
  vez al entrar en viewport, replicando el comportamiento del mockup
  nexa-rediseno-propuesta.html aprobado.
*/
export default function StatsDashboard() {
  const dashRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const dash = dashRef.current;
    const path = pathRef.current;
    if (!dash || !path) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    const counters = dash.querySelectorAll('[data-target]');

    function animateCounters() {
      counters.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1400;
        const t0 = performance.now();
        function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = Math.round(target * eased);
          el.textContent = `${prefix}${val}${suffix}`;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    let triggered = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            dash.classList.add('in-view');
            path.style.strokeDashoffset = '0';
            animateCounters();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(dash);

    return () => io.disconnect();
  }, []);

  return (
    <section className="home-stats-section">
      <div className="container">
        <div className="section-header">
          <span
            className="section-tag"
            style={{ background: 'rgba(210,242,58,0.1)', color: '#D2F23A', border: '1px solid rgba(210,242,58,0.2)' }}
          >
            Así medimos
          </span>
          <h2 className="section-title text-white">Tu negocio, traducido en números que importan</h2>
          <p className="section-subtitle text-white-50" style={{ margin: '0 auto' }}>
            Cada campaña, lead y venta llega a un mismo panel — para decidir rápido y con contexto real, no por intuición.
          </p>
        </div>

        <div className="home-dash-card" ref={dashRef}>
          <div className="home-dash-top">
            <div className="home-dash-live">
              <span className="home-live-dot" /> Panel de resultados — en vivo
            </div>
            <div className="home-dash-period">Últimos 6 meses</div>
          </div>

          <div className="home-stats-grid">
            {STATS.map((s) => (
              <div className="home-stat-cell" key={s.key}>
                <div className="home-stat-top">
                  <div className="home-stat-num" data-target={s.target} data-prefix={s.prefix} data-suffix={s.suffix}>
                    {s.prefix}0{s.suffix}
                  </div>
                  <span className="home-stat-trend">{s.trend}</span>
                </div>
                <div className="home-stat-lbl">{s.label}</div>
                <svg className="home-stat-spark" viewBox="0 0 60 18">
                  <polyline points={sparkPoints(SPARKS[s.key])} />
                </svg>
              </div>
            ))}
            <div className="home-stat-cell">
              <div
                className="home-stat-num"
                style={{ background: 'none', WebkitTextFillColor: 'initial', color: '#fff', display: 'inline-block' }}
              >
                6
              </div>
              <div className="home-stat-top" style={{ marginTop: 2 }}>
                <span className="home-stat-trend steady">● consistente</span>
              </div>
              <div className="home-stat-lbl">años de trayectoria</div>
              <svg className="home-stat-spark" viewBox="0 0 60 18">
                <polyline points={sparkPoints(SPARKS.years)} />
              </svg>
            </div>
          </div>

          <div className="home-dash-grid">
            <div className="home-dash-chart-card">
              <div className="home-dash-chart-head">
                <h4>Ventas &amp; leads</h4>
                <span className="home-dash-chart-tag">Tendencia mensual</span>
              </div>
              <svg className="home-dash-line-chart" viewBox="0 0 560 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="homeLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#B89BFF" />
                    <stop offset="50%" stopColor="#EAA1FB" />
                    <stop offset="100%" stopColor="#FE8FD9" />
                  </linearGradient>
                  <linearGradient id="homeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B89BFF" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#B89BFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                  <line x1="0" y1="35" x2="560" y2="35" />
                  <line x1="0" y1="85" x2="560" y2="85" />
                  <line x1="0" y1="135" x2="560" y2="135" />
                  <line x1="0" y1="185" x2="560" y2="185" />
                </g>
                <path d="M0,182 L0,152 L112,132 L224,107 L336,77 L448,37 L560,7 L560,182 Z" fill="url(#homeAreaGrad)" stroke="none" />
                <path
                  ref={pathRef}
                  className="home-draw-path"
                  d="M0,152 L112,132 L224,107 L336,77 L448,37 L560,7"
                  fill="none"
                  stroke="url(#homeLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="0" cy="152" r="4" fill="#0D0E15" stroke="#B89BFF" strokeWidth="2" />
                <circle cx="112" cy="132" r="4" fill="#0D0E15" stroke="#B89BFF" strokeWidth="2" />
                <circle cx="224" cy="107" r="4" fill="#0D0E15" stroke="#EAA1FB" strokeWidth="2" />
                <circle cx="336" cy="77" r="4" fill="#0D0E15" stroke="#EAA1FB" strokeWidth="2" />
                <circle cx="448" cy="37" r="4" fill="#0D0E15" stroke="#FE8FD9" strokeWidth="2" />
                <circle cx="560" cy="7" r="5.5" fill="#D2F23A" />
              </svg>
              <div className="home-chart-x-labels">
                <span>Ene</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
              <div className="home-chart-callout">+340%</div>
            </div>
            <div className="home-dash-bars-card">
              <div className="home-dash-chart-head">
                <h4>Origen de ventas</h4>
              </div>
              <ul className="home-dash-bars">
                {CHANNELS.map((c) => (
                  <li key={c.label}>
                    <div className="home-bar-row-top">
                      <span className="home-bar-label">
                        <span className="home-bar-dot" style={{ background: c.color }} />
                        {c.label}
                      </span>
                      <span className="home-bar-pct">{c.pct}%</span>
                    </div>
                    <div className="home-bar-track">
                      <div className="home-bar-fill" style={{ '--w': `${c.pct}%`, background: c.color }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="home-stats-note">Cifras de ejemplo — el panel se conecta a tus datos reales de campañas y CRM.</p>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .home-stats-section {
          padding: clamp(72px, 9vw, 120px) 0;
          background: linear-gradient(150deg, #0D0E15, #1A1C29);
        }
        .home-dash-card {
          position: relative;
          overflow: hidden;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 36px 34px;
          backdrop-filter: blur(6px);
        }
        .home-dash-card::before {
          content: '';
          position: absolute;
          top: -35%; right: -12%;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,155,255,0.14), transparent 70%);
          pointer-events: none;
        }
        .home-dash-top {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: space-between;
          padding-bottom: 28px; margin-bottom: 30px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap; gap: 12px;
        }
        .home-dash-live {
          display: flex; align-items: center; gap: 9px;
          font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.6);
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .home-live-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--lima);
          animation: homePulse 2.2s infinite;
        }
        @keyframes homePulse {
          0% { box-shadow: 0 0 0 0 rgba(210,242,58,0.45); }
          70% { box-shadow: 0 0 0 9px rgba(210,242,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(210,242,58,0); }
        }
        .home-dash-period {
          font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05); padding: 7px 16px; border-radius: 100px;
        }
        .home-stats-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        }
        .home-stat-cell { text-align: center; padding: 0 12px; border-right: 1px solid rgba(255,255,255,0.08); }
        .home-stat-cell:last-child { border-right: none; }
        .home-stat-top { display: flex; align-items: center; justify-content: center; gap: 9px; flex-wrap: wrap; }
        .home-stat-num {
          font-size: clamp(2.1rem, 4vw, 3.1rem); font-weight: 900; letter-spacing: -0.03em;
          background: var(--gradient-accent); -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .home-stat-trend {
          font-size: 0.68rem; font-weight: 800; padding: 4px 9px; border-radius: 100px;
          background: rgba(210,242,58,0.12); color: var(--lima); white-space: nowrap;
        }
        .home-stat-trend.steady { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .home-stat-lbl { margin-top: 10px; color: rgba(255,255,255,0.55); font-size: 0.86rem; font-weight: 600; }
        .home-stat-spark { display: block; margin: 14px auto 0; width: 62px; height: 18px; }
        .home-stat-spark polyline { fill: none; stroke: rgba(210,242,58,0.5); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .home-dash-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; margin-top: 38px;
        }
        .home-dash-chart-card, .home-dash-bars-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 26px 24px; position: relative;
        }
        .home-dash-chart-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; gap: 10px; }
        .home-dash-chart-head h4 { font-size: 0.92rem; font-weight: 700; color: #fff; }
        .home-dash-chart-tag {
          font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05); padding: 5px 12px; border-radius: 100px; white-space: nowrap;
        }
        .home-dash-line-chart { width: 100%; height: 190px; display: block; }
        .home-draw-path { transition: stroke-dashoffset 1.8s cubic-bezier(.16,1,.3,1); }
        .home-chart-x-labels {
          display: flex; justify-content: space-between; margin-top: 8px;
          font-size: 0.7rem; color: rgba(255,255,255,0.32); font-weight: 600;
        }
        .home-chart-callout {
          position: absolute; top: 22px; right: 24px;
          background: var(--gradient-lima); color: #0D0E15;
          font-size: 0.72rem; font-weight: 800; padding: 5px 12px; border-radius: 100px;
          box-shadow: 0 8px 20px rgba(210,242,58,0.25);
        }
        .home-dash-bars { margin-top: 6px; display: flex; flex-direction: column; gap: 20px; }
        .home-bar-row-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .home-bar-label { display: flex; align-items: center; gap: 8px; font-size: 0.84rem; font-weight: 600; color: rgba(255,255,255,0.78); }
        .home-bar-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .home-bar-pct { font-size: 0.82rem; font-weight: 800; color: rgba(255,255,255,0.45); }
        .home-bar-track { height: 8px; border-radius: 100px; background: rgba(255,255,255,0.07); overflow: hidden; }
        .home-bar-fill { height: 100%; border-radius: 100px; width: 0; transition: width 1.3s cubic-bezier(.16,1,.3,1); }
        .home-dash-card.in-view .home-bar-fill { width: var(--w); }
        .home-stats-note { margin-top: 30px; text-align: center; color: rgba(255,255,255,0.32); font-size: 0.78rem; position: relative; z-index: 1; }

        @media (max-width: 1024px) {
          .home-stats-section { padding: 72px 0; }
        }
        @media (max-width: 768px) {
          .home-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 8px; }
          .home-stat-cell { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 24px; }
          .home-dash-grid { grid-template-columns: 1fr; }
          .home-dash-top { flex-direction: column; align-items: flex-start; gap: 12px; }
          .home-dash-card { padding: 28px 20px 26px; }
        }
      `,
        }}
      />
    </section>
  );
}
