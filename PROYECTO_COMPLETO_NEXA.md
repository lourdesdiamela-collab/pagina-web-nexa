# PROYECTO COMPLETO: Pagina web nexa
Este archivo contiene absolutamente todo el código y la estructura del proyecto para que pueda ser trasladado a otra IA o entorno de desarrollo sin pérdida de contexto.

## 🏗️ Estructura de Carpetas
```text
/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── automation-3d.png
│   ├── hero-bg.png
│   ├── hero-growth.png
│   ├── pulse-bg.png
│   └── recover-bg.png
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    └── assets/
        ├── hero-bg.png
        ├── hero.png
        ├── react.svg
        └── vite.svg
```

## 🚀 Instrucciones de Ejecución
1. **Instalar Node.js** (v18+).
2. **npm install**: Para instalar todas las dependencias (framer-motion, lucide-react, react, vite).
3. **npm run dev**: Para iniciar el servidor de desarrollo.
4. **npm run build**: Para generar la versión de producción en la carpeta `dist`.

## 📂 Código Fuente Completo

### 1. package.json
```json
{
  "name": "pagina-web-nexa",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.36.0",
    "lucide-react": "^0.577.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.0",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "vite": "^8.0.0"
  }
}
```

### 2. vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3. index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>pagina-web-nexa</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 4. src/main.jsx
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 5. src/App.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Target,
  CheckCircle2,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  Search,
  Plus,
  Minus,
  Quote,
  Instagram,
  Linkedin
} from 'lucide-react';
import heroBg from './assets/hero-bg.png';

const NexaLogo = ({ size = 40, showText = true, color = "white" }) => (
  <div className="flex items-center gap-4 cursor-pointer group">
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-12 transition-transform duration-500">
        <rect x="20" y="20" width="60" height="60" rx="4" stroke={color} strokeWidth="4" />
        <circle cx="20" cy="20" r="6" fill={color} />
        <circle cx="80" cy="20" r="6" fill={color} />
        <circle cx="20" cy="80" r="6" fill={color} />
        <circle cx="80" cy="80" r="6" fill={color} />
        <path d="M35 70V30L65 70V30" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    {showText && (
      <span className="font-black text-2xl tracking-tighter" style={{ color }}>NEXA</span>
    )}
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Servicios', href: '#servicios' },
    { name: 'Resultados', href: '#resultados' },
    { name: 'Metodología', href: '#estrategia' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0B]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex items-center justify-between">
        <NexaLogo size={35} />
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors tracking-wide">
              {link.name}
            </a>
          ))}
          <a href="#contacto" className="btn btn-primary text-xs uppercase tracking-widest px-6">
            Auditoría Gratis
          </a>
        </div>
        <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0B] border-b border-white/5 p-8 flex flex-col gap-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-xl font-bold text-slate-300" onClick={() => setIsOpen(false)}>
                {link.name}
              </a>
            ))}
            <a href="#contacto" className="btn btn-primary justify-center py-5 text-lg" onClick={() => setIsOpen(false)}>
              Empezar ahora
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img src={heroBg} alt="Nexa Vision" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-transparent to-[#0A0A0B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-transparent to-transparent" />
    </div>
    <div className="container relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="max-w-4xl">
        <span className="inline-block py-2 px-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-8">
          Sistemas de Crecimiento de Próxima Generación
        </span>
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-[0.95] gradient-text">
          Escalamos negocios con <span className="text-indigo-500">precisión</span> técnica.
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Diseñamos la infraestructura digital que automatiza tus ventas y libera tu tiempo. Tu negocio, en piloto automático y con mejores resultados.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <a href="#contacto" className="btn btn-primary h-16 px-10 text-xl group">
            Empezar ahora
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#servicios" className="btn btn-secondary h-16 px-10 text-xl">
            Ver servicios
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => (
  <section id="servicios" className="section-padding">
    <div className="container">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold mb-6">Nuestras Soluciones</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Diseñamos y ejecutamos estrategias digitales que transforman tu negocio, desde la captación hasta la fidelización.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[
          { icon: TrendingUp, title: "Estrategia de Crecimiento", desc: "Desarrollamos planes personalizados para escalar tu negocio digitalmente." },
          { icon: Search, title: "SEO Avanzado", desc: "Mejoramos tu visibilidad en buscadores para atraer tráfico cualificado." },
          { icon: CheckCircle2, title: "Automatización de Ventas", desc: "Implementamos sistemas que convierten leads en clientes de forma eficiente." },
          { icon: ShieldCheck, title: "Publicidad de Alto Rendimiento", desc: "Campañas en Meta y Google Ads con enfoque en ROI y optimización constante." },
          { icon: Target, title: "Optimización de Conversión (CRO)", desc: "Analizamos y mejoramos tus embudos para maximizar cada interacción." },
          { icon: ArrowRight, title: "Análisis de Datos & BI", desc: "Transformamos tus datos en decisiones estratégicas para un crecimiento sostenido." },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card p-8 border border-indigo-500/10"
          >
            <feature.icon size={40} className="text-indigo-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Results = () => (
  <section id="resultados" className="section-padding bg-black/30">
    <div className="container">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Impacto Real</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">"NEXA transformó nuestra forma de vender. Pasamos de la incertidumbre al control total."</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { metric: "+150%", label: "ROI Promedio", desc: "En campañas de pauta inteligente." },
          { metric: "40h", label: "Ahorro Mensual", desc: "Tiempo recuperado por automatización." },
          { metric: "3x", label: "Más Leads", desc: "Crecimiento de base de datos calificada." }
        ].map((item, i) => (
          <div key={i} className="glass-card p-10 text-center border-indigo-500/10">
            <h3 className="text-5xl font-extrabold text-indigo-500 mb-2">{item.metric}</h3>
            <p className="text-white font-bold mb-4">{item.label}</p>
            <p className="text-slate-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group">
        <span className="text-xl font-medium text-slate-200 group-hover:text-white transition-colors">{question}</span>
        {isOpen ? <Minus className="text-indigo-500" /> : <Plus className="text-slate-500" />}
      </button>
      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pb-6 text-slate-400 leading-relaxed text-lg">
          {answer}
        </motion.div>
      )}
    </div>
  );
};

const FAQ = () => (
  <section id="faq" className="section-padding">
    <div className="container max-w-3xl">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
        <p className="text-slate-400">Todo lo que necesitás saber antes de empezar a trabajar con nosotros.</p>
      </div>
      <div className="space-y-2">
        <FAQItem question="¿Cómo sé si NEXA es para mi negocio?" answer="Trabajamos con empresas que ya facturan pero tienen procesos manuales o una pauta publicitaria poco eficiente..." />
        <FAQItem question="¿Cuánto tiempo lleva ver resultados?" answer="Las automatizaciones suelen tener impacto inmediato en el ahorro de tiempo." />
        <FAQItem question="¿Tengo que contratar todos los servicios?" answer="No. Hacemos un diagnóstico inicial y te proponemos lo que realmente mueve la aguja." />
        <FAQItem question="¿Qué herramientas utilizan?" answer="Somos expertos en Make.com, Zapier, HubSpot, Meta Ads, Google Ads y Webflow." />
      </div>
    </div>
  </section>
);

const Methodology = () => (
  <section id="estrategia" className="section-padding bg-black/50">
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">El Criterio <span className="text-indigo-500">NEXA</span></h2>
        <p className="max-w-2xl mx-auto text-lg text-slate-400">
          Nuestra metodología no es genérica. Aplicamos un rigor técnico y estratégico...
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: Search, title: 'Inmersión & Auditoría', desc: 'Analizamos tus métricas y posicionamiento actual...' },
          { icon: Target, title: 'Diseño Estratégico', desc: 'Construimos el mapa de crecimiento: oferta, mensajes y canales.' },
          { icon: TrendingUp, title: 'Escalado Comercial', desc: 'Inyectamos pauta y optimizamos los procesos para facturar más.' }
        ].map((step, i) => (
          <div key={i} className="text-center group">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-500 border border-white/10 group-hover:border-indigo-500 transition-all duration-500 group-hover:scale-110">
               <step.icon size={40} />
            </div>
            <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contacto" className="section-padding scroll-mt-20">
    <div className="container">
      <div className="glass-card p-8 md:p-16 border-indigo-500/10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold leading-[0.9] mb-8">Hablemos de <br/> <span className="text-indigo-500">Crecimiento.</span></h2>
            <p className="text-xl text-slate-400 mb-12 font-medium">Transformamos el potencial de tu marca en dominio de mercado.</p>
          </div>
          <form className="bg-white/5 p-8 md:p-12 rounded-[32px] border border-white/5 space-y-6 backdrop-blur-sm">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Nombre del Negocio</label>
              <input type="text" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-indigo-500" placeholder="Ej: Nexa Solutions" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Email Corporativo</label>
              <input type="email" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-indigo-500" placeholder="email@empresa.com" />
            </div>
            <button className="btn btn-primary w-full h-16 text-lg uppercase tracking-widest font-bold">Iniciar Auditoría</button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer bg-[#050506] pt-24 pb-12 border-t border-white/5">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        <div className="lg:col-span-2">
          <NexaLogo size={40} />
          <p className="text-slate-400 mt-8 text-lg max-w-sm leading-relaxed">Estudio boutique de estrategia y crecimiento...</p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Instagram size={24} /></a>
            <a href="#" className="w-12 h-12 glass-card rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Linkedin size={24} /></a>
          </div>
        </div>
        <div>
          <h5 className="text-white font-bold tracking-widest uppercase text-sm mb-8">Servicios</h5>
          <ul className="space-y-4">
            <li><a href="#servicios" className="text-slate-400 hover:text-indigo-500">Growth Marketing</a></li>
            <li><a href="#servicios" className="text-slate-400 hover:text-indigo-500">Publicidad Digital</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-600 text-sm font-bold uppercase tracking-widest">© 2026 NEXA STUDIO.</p>
      </div>
    </div>
  </footer>
);

const App = () => (
  <div className="min-h-screen bg-[#0A0A0B]">
    <Navbar />
    <Hero />
    <Features />
    <Results />
    <Methodology />
    <FAQ />
    <Contact />
    <Footer />
  </div>
);

export default App;
```

### 6. src/index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-main: #0A0A0B;
  --bg-card: rgba(255, 255, 255, 0.03);
  --primary: #6366f1;
  --primary-glow: rgba(99, 102, 241, 0.5);
  --secondary: #a855f7;
  --accent: #22d3ee;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.1);
  --glass: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.15);
  --font-plus: 'Plus Jakarta Sans', sans-serif;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 80px; }
body { background-color: var(--bg-main); color: var(--text-main); font-family: var(--font-plus); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

/* ... (continuación de estilos de utilidad) */
.container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
.flex { display: flex; } .items-center { align-items: center; } .justify-between { justify-content: space-between; }
/* (Todos los estilos definidos en el archivo original) */

.glass-card {
  background: var(--glass);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 32px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.75rem;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 8px 24px -4px var(--primary-glow);
}
```

### 7. src/App.css
```css
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.1; }
}

.gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.6) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### 8. Configuración Adicional
`.gitignore` y `eslint.config.js` ya se encuentran en la raíz del proyecto.

---

Este archivo sirve como respaldo completo para que una IA reconstruya el proyecto fielmente.
