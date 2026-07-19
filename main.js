(function () {
  "use strict";

  /* ─── Helpers ─── */
  const $ = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  const data = window.__BRAND__ || {};

  /* ─── 1. Nav ─── */
  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const update = () => {
      if (scrollY > 80) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });

    const ham = $(".nav-hamburger");
    const mobileMenu = $(".nav-mobile");
    if (ham && mobileMenu) {
      ham.addEventListener("click", () => {
        const isOpen = ham.classList.toggle("is-open");
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      $$(".nav-mobile .nav-link").forEach(link => {
        link.addEventListener("click", () => {
          ham.classList.remove("is-open");
          mobileMenu.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        });
      });
    }

    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 80,
        behavior: reduced ? "auto" : "smooth",
      });
    });
  }

  /* ─── 2. Mouse-reactive gradient ─── */
  function initHeroGradient() {
    const grad = $(".hero-gradient");
    if (!grad || !fineHover) return;
    let mx = 25, my = 40, tx = 25, ty = 40;
    document.addEventListener("mousemove", e => {
      tx = (e.clientX / innerWidth) * 100;
      ty = (e.clientY / innerHeight) * 100;
    }, { passive: true });
    function frame() {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      document.documentElement.style.setProperty("--mx", mx.toFixed(2) + "%");
      document.documentElement.style.setProperty("--my", my.toFixed(2) + "%");
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ─── 3. Custom cursor ─── */
  function initCursor() {
    const root = $("[data-cursor-root]");
    if (!root || !fineHover) return;
    document.documentElement.classList.add("has-cursor");
    const ring = $(".cursor-ring", root);
    const dot  = $(".cursor-dot",  root);
    let tx = 0, ty = 0, rx = 0, ry = 0, firstMove = false;

    window.addEventListener("mousemove", e => {
      tx = e.clientX; ty = e.clientY;
      if (dot) dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
      if (!firstMove) {
        firstMove = true;
        rx = tx; ry = ty;
        if (ring) ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
        root.classList.add("is-ready");
        root.style.opacity = '1';
      }
    }, { passive: true });

    function tick() {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      if (ring) ring.style.transform = "translate3d(" + rx.toFixed(2) + "px," + ry.toFixed(2) + "px,0)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const HOVERABLES = "[data-cursor],.card,.servicio-card,.btn,a[href],button";
    document.addEventListener("mouseover", e => {
      if (e.target.closest(HOVERABLES)) root.classList.add("is-interactive");
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest(HOVERABLES) && !e.relatedTarget?.closest?.(HOVERABLES))
        root.classList.remove("is-interactive");
    });
  }

  /* ─── 4. Scroll reveals ─── */
  function initReveals() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -3% 0px" });
    els.forEach(el => io.observe(el));
    setTimeout(() => {
      $$("[data-reveal]:not(.is-revealed)").forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight)
          el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ─── 5. Split text with GSAP ─── */
  function splitWords(el) {
    el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
    const wrapWords = text => text.split(/(\s+)/).map(w =>
      /^\s+$/.test(w) ? w : '<span class="split-word" aria-hidden="true">' + escHTML(w) + "</span>"
    ).join("");
    const html = Array.from(el.childNodes).map(node => {
      if (node.nodeType === 3) return wrapWords(node.textContent);
      if (node.nodeName === "BR") return "<br>";
      if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();
        return "<" + tag + ">" + wrapWords(node.textContent) + "</" + tag + ">";
      }
      return "";
    }).join("");
    el.innerHTML = html;
    return el.querySelectorAll(".split-word");
  }

  function initSplitText() {
    if (!window.gsap || !window.ScrollTrigger) return;
    $$("[data-split]").forEach(el => {
      const parts = splitWords(el);
      gsap.set(parts, { y: 28, opacity: 0 });
      gsap.to(parts, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
  }

  /* ─── 6. Count-up numbers ─── */
  function initCountUp() {
    $$("[data-count-to]").forEach(el => {
      const target   = parseFloat(el.dataset.countTo);
      const decimals = (el.dataset.countTo.split(".")[1] || "").length;
      const suffix   = el.dataset.countSuffix || "";
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          if (window.gsap) {
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target, duration: 1.6, ease: "power2.out",
              onUpdate: () => { el.textContent = obj.v.toFixed(decimals) + suffix; },
            });
          } else {
            el.textContent = target.toFixed(decimals) + suffix;
          }
        });
      }, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });
      io.observe(el);
    });
  }

  /* ─── 7. Card tilt + halo ─── */
  function initTilt() {
    if (!fineHover) return;
    $$(".servicio-card,.testimonio-card,.caso-metric-box").forEach(card => {
      const MAX = 6;
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.classList.add("has-tilt");
      card.addEventListener("mousemove", e => {
        const r  = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        card.style.setProperty("--cx", ((e.clientX - r.left) / r.width  * 100).toFixed(1) + "%");
        card.style.setProperty("--cy", ((e.clientY - r.top)  / r.height * 100).toFixed(1) + "%");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
      function loop() {
        cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ─── 8. Marquee ticker ─── */
  function initMarquee() {
    if (!window.gsap) return;
    $$("[data-marquee]").forEach(track => {
      const clone = track.cloneNode(true);
      clone.removeAttribute("data-marquee");
      track.parentNode.appendChild(clone);
      const distance = track.scrollWidth;
      gsap.to([track, clone], {
        x: -distance, duration: distance / 55, ease: "none", repeat: -1,
        modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % distance) },
      });
    });
  }

  /* ─── 9. Hero parallax ─── */
  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const content = $(".hero-content");
    if (content) {
      gsap.to(content, {
        yPercent: -30, opacity: 0, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true },
      });
    }
  }

  /* ─── 10. Contact form ─── */
  function initContactForm() {
    const form = $("[data-contact-form]");
    if (!form) return;
    const successEl = $(".form-success");
    const submitBtn = form.querySelector("[type=submit]");

    const errorEl = form.querySelector(".form-send-error");

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (form.classList.contains("is-sending")) return;
      if (!form.reportValidity()) return;
      form.classList.add("is-sending");
      if (submitBtn) submitBtn.disabled = true;
      if (errorEl) errorEl.classList.remove("is-visible");

      try {
        const res = await fetch("/api/contact", {
          method:  "POST",
          body:    JSON.stringify(Object.fromEntries(new FormData(form))),
          headers: { "Accept": "application/json", "Content-Type": "application/json" }
        });
        if (!res.ok) throw new Error("status " + res.status);
        form.classList.add("is-sent");
        if (successEl) {
          successEl.classList.add("is-visible");
          const nameField = form.querySelector("[name=nombre]");
          const msgEl     = successEl.querySelector("[data-success-name]");
          if (nameField && msgEl) msgEl.textContent = nameField.value.trim().split(/\s+/)[0];
        }
      } catch (_) {
        form.classList.remove("is-sending");
        if (submitBtn) submitBtn.disabled = false;
        if (errorEl) errorEl.classList.add("is-visible");
      }
    });
  }

  /* ─── 11. Scroll progress bar ─── */
  function initScrollProgress() {
    const bar = $("[data-scroll-progress]");
    if (!bar) return;
    let raf = null;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
      raf = null;
    }
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* ─── 12. GSAP entrance animations ─── */
  function initEntrances() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const servicioCards = $$(".servicio-card");
    if (servicioCards.length) {
      gsap.from(servicioCards, {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: ".servicios-grid", start: "top 80%", once: true },
      });
    }
    const statItems = $$(".stat-item");
    if (statItems.length) {
      gsap.from(statItems, {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: ".stats-grid", start: "top 80%", once: true },
      });
    }
    const testCards = $$(".testimonio-card");
    if (testCards.length) {
      gsap.from(testCards, {
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: ".testimonios-grid", start: "top 80%", once: true },
      });
    }
  }

  /* ─── 13. Scramble on service titles ─── */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZáéíóú·#&%↗→◈◎◉▸";
  function initScramble() {
    if (!fineHover) return;
    $$("[data-scramble]").forEach(el => {
      const original = el.textContent;
      let animating = false;
      el.addEventListener("mouseenter", () => {
        if (animating) return;
        animating = true;
        const chars  = [...original];
        const delays = chars.map((_, i) => 60 + i * 25 + Math.random() * 70);
        const start  = performance.now();
        function tick(now) {
          const elapsed = now - start;
          el.textContent = chars.map((c, i) => {
            if (c === " " || c === "." || c === ",") return c;
            if (elapsed < delays[i]) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            return c;
          }).join("");
          if (chars.some((c, i) => c !== " " && c !== "." && c !== "," && elapsed < delays[i])) {
            requestAnimationFrame(tick);
          } else { el.textContent = original; animating = false; }
        }
        requestAnimationFrame(tick);
      });
    });
  }

  /* ─── 14. Hero title entrance ─── */
  function initHeroEntrance() {
    if (!window.gsap) return;
    const title   = $(".hero-title");
    const sub     = $(".hero-sub");
    const kicker  = $(".hero-kicker");
    const actions = $(".hero-actions");
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (kicker)  tl.from(kicker,  { y: 20, opacity: 0, duration: .7 }, 0.2);
    if (title)   tl.from(title,   { y: 60, opacity: 0, duration: .9 }, 0.4);
    if (sub)     tl.from(sub,     { y: 30, opacity: 0, duration: .7 }, 0.7);
    if (actions) tl.from(actions, { y: 20, opacity: 0, duration: .6 }, 0.9);
  }

  /* ─── 15. Hero canvas — Neural constellation ─── */
  function initHeroCanvas() {
    if (reduced) return;
    const hero = $(".hero");
    if (!hero) return;

    /* ── Canvas setup ── */
    const cvs = document.createElement("canvas");
    cvs.setAttribute("aria-hidden", "true");
    Object.assign(cvs.style, {
      position: "absolute", inset: "0",
      width: "100%", height: "100%",
      zIndex: "1", pointerEvents: "none",
      opacity: "0",
      transition: "opacity 1.4s ease",
    });
    const noise = hero.querySelector(".hero-noise");
    hero.insertBefore(cvs, noise || hero.querySelector(".hero-content"));

    const cx = cvs.getContext("2d");
    let W = 0, H = 0, raf;
    const mouse = { x: -9999, y: -9999 };

    /* ── Brand colors (rgb tuples, violet weighted 3×) ── */
    const COLS = [
      [124, 58, 237], [124, 58, 237], [124, 58, 237],  // violet ×3
      [59, 130, 246], [59, 130, 246],                   // blue   ×2
      [6, 182, 212],                                    // cyan   ×1
    ];
    const rc   = ()         => COLS[Math.floor(Math.random() * COLS.length)];
    const rgba = ([r,g,b], a) => `rgba(${r},${g},${b},${a.toFixed(3)})`;

    /* ── Resize ── */
    function resize() {
      const rect = hero.getBoundingClientRect();
      W = cvs.width  = Math.floor(rect.width);
      H = cvs.height = Math.floor(rect.height);
    }

    /* ── Particle factory ── */
    const N = Math.min(88, Math.max(42, Math.floor(window.innerWidth / 16)));
    let pts = [];

    function mkPt() {
      const hub = Math.random() < 0.13;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        z: 0.25 + Math.random() * 0.75,
        vx: (Math.random() - 0.5) * (hub ? 0.08 : 0.22),
        vy: (Math.random() - 0.5) * (hub ? 0.08 : 0.22),
        r:  hub ? 2.2 + Math.random() * 1.4 : 0.9 + Math.random() * 1.3,
        hub,
        col:   rc(),
        ph:    Math.random() * Math.PI * 2,
        phSpd: 0.007 + Math.random() * 0.013,
        ptimer: hub ? Math.floor(Math.random() * 300) : 0,
        pint:   hub ? 200 + Math.floor(Math.random() * 180) : 0,
        prad: 0, ping: false,
      };
    }
    const initPts = () => { pts = Array.from({ length: N }, mkPt); };

    /* ── Mouse tracking ── */
    hero.addEventListener("mousemove", e => {
      const r = cvs.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    /* ── Draw loop ── */
    const CONNECT = 138;
    const MR      = 115;
    const MF      = 0.012;

    function draw() {
      cx.clearRect(0, 0, W, H);

      /* Update */
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.ph += p.phSpd;

        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const md = Math.hypot(dx, dy);
        if (md < MR && md > 1) {
          const f = (1 - md / MR) * MF;
          p.vx += dx / md * f;
          p.vy += dy / md * f;
        }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x = (p.x + p.vx + W) % W;
        p.y = (p.y + p.vy + H) % H;

        if (p.hub) {
          if (--p.ptimer <= 0) { p.ping = true; p.prad = 0; p.ptimer = p.pint; }
          if (p.ping) {
            p.prad += 1.6;
            const pa = Math.max(0, 1 - p.prad / 85) * 0.3 * p.z;
            if (pa > 0.002) {
              cx.beginPath();
              cx.strokeStyle = rgba(p.col, pa);
              cx.lineWidth   = 0.8;
              cx.arc(p.x, p.y, p.prad, 0, Math.PI * 2);
              cx.stroke();
            } else { p.ping = false; }
          }
        }
      }

      /* Connections */
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b  = pts[j];
          const d  = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= CONNECT) continue;
          const str = 1 - d / CONNECT;
          const al  = str * str * 0.52 * ((a.z + b.z) * 0.5);
          if (al < 0.004) continue;
          const g = cx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, rgba(a.col, al));
          g.addColorStop(1, rgba(b.col, al));
          cx.beginPath();
          cx.strokeStyle = g;
          cx.lineWidth   = 0.3 + str * 0.85;
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
        }
      }

      /* Particles */
      for (let i = 0; i < pts.length; i++) {
        const p     = pts[i];
        const pulse = 1 + Math.sin(p.ph) * 0.2;
        const r     = p.r * (0.38 + p.z * 0.82) * pulse;
        const al    = 0.42 + p.z * 0.58;
        const glowR = r * (p.hub ? 6.5 : 4.5);

        const grd = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grd.addColorStop(0,   rgba(p.col, al * 0.7));
        grd.addColorStop(0.4, rgba(p.col, al * 0.18));
        grd.addColorStop(1,   rgba(p.col, 0));
        cx.beginPath(); cx.fillStyle = grd;
        cx.arc(p.x, p.y, glowR, 0, Math.PI * 2); cx.fill();

        cx.beginPath();
        cx.fillStyle = rgba(p.col, al);
        cx.arc(p.x, p.y, r, 0, Math.PI * 2); cx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    /* ── Boot canvas ── */
    resize(); initPts();
    raf = requestAnimationFrame(draw);
    setTimeout(() => { cvs.style.opacity = "1"; }, 80);

    if (window.ResizeObserver) {
      new ResizeObserver(() => { resize(); initPts(); }).observe(hero);
    } else {
      window.addEventListener("resize", () => { resize(); initPts(); }, { passive: true });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
      else if (!raf) { raf = requestAnimationFrame(draw); }
    });
  }

  /* ─── 13. Asistente NEXA (chat local) ─── */
  function initNexaAssistant() {
    var KB = [
      { k: ["hola","buenas","hey","holis"], a: "Hola! Soy el asistente de NEXA. Puedo contarte sobre nuestros servicios, precios, como funciona el proceso o ayudarte a dejar tus datos para que te contactemos." },
      { k: ["servicio","servicios","que hacen","qué hacen","ofrecen","que ofrecen"], a: "Trabajamos 5 areas: Marketing integral, Campanas de Meta/Google, CRM y orden digital, NEXA Recover (recuperacion de clientes) y Automatizacion e IA. Podes ver el detalle en la seccion Servicios." },
      { k: ["precio","precios","cuesta","cuanto sale","costo","plan","planes","tarifa","cotiza"], a: "Los planes varian segun el servicio y el tamano de tu negocio, no aplicamos un precio unico. Dejanos tus datos en el formulario de Contacto y te armamos una propuesta sin costo." },
      { k: ["como funciona","cómo funciona","proceso","empezar","contratar","como arranco"], a: "Es simple: 1) agendamos una llamada inicial sin costo, 2) te armamos una propuesta, 3) si avanzamos, arrancamos en menos de una semana." },
      { k: ["permanencia","cancelar","baja","contrato","penalidad"], a: "No hay permanencia minima. Trabajamos mes a mes y podes dar de baja cuando quieras, sin penalidades." },
      { k: ["tiempo","respuesta","demoran","tardan","cuanto tardan"], a: "Respondemos en menos de 24 horas." },
      { k: ["ubicacion","ubicación","donde estan","dónde están","buenos aires","pais","país"], a: "Estamos en Buenos Aires, Argentina, y trabajamos con negocios de todo el pais." },
      { k: ["contacto","email","mail","whatsapp","telefono","teléfono","hablar con alguien"], a: "Podes escribirnos a hola@nexaarg.com, por WhatsApp, o dejar tus datos en el formulario de la seccion Contacto. Te respondemos en menos de 24hs." },
      { k: ["caso","casos","resultados","clientes","exito","éxito"], a: "Tenemos casos reales de negocios que crecieron con nosotros, los podes ver en la seccion Casos del menu." },
      { k: ["aprende","recursos","articulo","artículo","blog","contenido","guia","guía"], a: "En la seccion Aprende compartimos guias practicas sobre ventas, CRM, ads y mas, gratis." },
      { k: ["crm"], a: "Ayudamos a implementar un CRM simple que tu equipo realmente use, sin drama, en menos de una semana." },
      { k: ["automatizacion","automatización","ia","inteligencia artificial"], a: "Automatizamos procesos repetitivos y sumamos IA donde tiene sentido: seguimiento de leads, respuestas rapidas, reportes automaticos." },
      { k: ["recover","recuperar clientes","clientes perdidos","clientes inactivos"], a: "NEXA Recover reactiva clientes inactivos de tu base con campanas especificas de reconquista." },
      { k: ["ads","meta","google","publicidad","campaña","campaña","campañas"], a: "Gestionamos campanas de Meta y Google Ads enfocadas en negocios locales, con presupuestos de prueba chicos antes de escalar." },
      { k: ["gracias","genial","perfecto","dale","joya"], a: "De nada! Si necesitas algo mas, estoy por aca. Tambien podes dejar tus datos en el formulario de Contacto." }
    ];
    var FALLBACK = "No tengo una respuesta exacta para eso, pero contame mas en el formulario de Contacto o escribinos por WhatsApp y te ayudamos directamente.";

    function hasWord(q, kw) {
      var esc = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var re = new RegExp("(^|[^a-zA-Z0-9ñáéíóú])" + esc + "([^a-zA-Z0-9ñáéíóú]|$)");
      return re.test(q);
    }
    function findAnswer(text) {
      var q = " " + text.toLowerCase() + " ";
      for (var i = 0; i < KB.length; i++) {
        var item = KB[i];
        for (var j = 0; j < item.k.length; j++) {
          if (hasWord(q, item.k[j])) return item.a;
        }
      }
      return FALLBACK;
    }

    var wrap = document.createElement("div");
    wrap.className = "nexa-assistant";
    wrap.innerHTML =
      '<button type="button" class="nexa-assistant-toggle" aria-label="Abrir asistente NEXA">' +
        '<svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
        '<svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<div class="nexa-assistant-panel" aria-hidden="true">' +
        '<div class="nexa-assistant-header">' +
          '<div class="nexa-assistant-avatar">N</div>' +
          '<div><p class="nexa-assistant-name">Asistente NEXA</p><p class="nexa-assistant-status">Responde al instante</p></div>' +
        '</div>' +
        '<div class="nexa-assistant-messages" id="nexa-assistant-messages"></div>' +
        '<div class="nexa-assistant-quick" id="nexa-assistant-quick">' +
          '<button type="button" data-q="Que servicios ofrecen?">Servicios</button>' +
          '<button type="button" data-q="Cuales son los precios?">Precios</button>' +
          '<button type="button" data-q="Como funciona el proceso?">Como empezar</button>' +
          '<button type="button" data-q="Como los contacto?">Contacto</button>' +
        '</div>' +
        '<form class="nexa-assistant-input" id="nexa-assistant-form">' +
          '<input type="text" placeholder="Escribi tu pregunta..." aria-label="Escribi tu pregunta" autocomplete="off" />' +
          '<button type="submit" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(wrap);

    var toggle = wrap.querySelector(".nexa-assistant-toggle");
    var panel = wrap.querySelector(".nexa-assistant-panel");
    var messages = wrap.querySelector("#nexa-assistant-messages");
    var quick = wrap.querySelector("#nexa-assistant-quick");
    var form = wrap.querySelector("#nexa-assistant-form");
    var input = form.querySelector("input");
    var opened = false;
    var greeted = false;

    function addMessage(text, from) {
      var bubble = document.createElement("div");
      bubble.className = "nexa-msg nexa-msg-" + from;
      bubble.textContent = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
    }

    function respond(text) {
      addMessage(text, "user");
      quick.style.display = "none";
      setTimeout(function () { addMessage(findAnswer(text), "bot"); }, 400);
    }

    toggle.addEventListener("click", function () {
      opened = !opened;
      wrap.classList.toggle("is-open", opened);
      panel.setAttribute("aria-hidden", opened ? "false" : "true");
      if (opened && !greeted) {
        greeted = true;
        addMessage("Hola! Soy el asistente de NEXA. Pregunta sobre nuestros servicios, precios o como empezar.", "bot");
      }
      if (opened) input.focus();
    });

    quick.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-q]");
      if (!btn) return;
      respond(btn.getAttribute("data-q"));
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      input.value = "";
      respond(val);
    });
  }

  /* ─── Boot ─── */
  function boot() {
    safe(initNav,            "initNav");
    safe(initCursor,         "initCursor");
    safe(initReveals,        "initReveals");
    safe(initCountUp,        "initCountUp");
    safe(initContactForm,    "initContactForm");
    safe(initNexaAssistant,  "initNexaAssistant");
    safe(initScrollProgress, "initScrollProgress");
    safe(initHeroGradient,   "initHeroGradient");
    safe(initTilt,           "initTilt");
    safe(initScramble,       "initScramble");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      safe(initHeroEntrance, "initHeroEntrance");
      safe(initEntrances,    "initEntrances");
      safe(initSplitText,    "initSplitText");
      safe(initHeroParallax, "initHeroParallax");
      safe(initMarquee,      "initMarquee");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
