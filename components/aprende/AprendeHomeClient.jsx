'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, ShieldCheck, Download, RefreshCw, Layers3,
  Percent, Library, PackageCheck, Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductExplorer from '@/components/aprende/ProductExplorer';
import ProductCard from '@/components/aprende/ProductCard';
import { CategoryLinksGrid } from '@/components/aprende/CategoryPills';
import FAQAccordion from '@/components/aprende/FAQAccordion';
import Newsletter from '@/components/aprende/Newsletter';
import Testimonials from '@/components/aprende/Testimonials';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const TESTIMONIALS = [
  { name: 'Rocío Fernández', role: 'Emprendedora, indumentaria', rating: 5, text: 'Compré el pack de Instagram y en dos semanas ya se notó el cambio en el feed y en las consultas por DM.' },
  { name: 'Diego Aranda', role: 'Dueño de resto-bar', rating: 5, text: 'La guía de WhatsApp Business me ordenó algo que veníamos haciendo mal hace años. Simple y aplicable.' },
  { name: 'Yamila Sosa', role: 'Freelance de diseño', rating: 4, text: 'Los prompts de IA me ahorran horas por semana. El PDF quedó como referencia fija en mi escritorio.' },
  { name: 'Emiliano Ríos', role: 'Contador independiente', rating: 5, text: 'Empecé con la guía de finanzas para emprendedores y terminé llevándome el pack completo de la categoría.' },
  { name: 'Brenda Coria', role: 'Marca de indumentaria', rating: 5, text: 'Muy por encima de lo que esperaba por el precio. Las plantillas de Excel ya las uso todas las semanas.' },
];

const FAQS = [
  { q: '¿Cómo recibo el recurso que compro?', a: 'Es contenido 100% digital: el PDF y todos los materiales quedan disponibles para descargar apenas se acredita el pago, sin esperas ni envíos.' },
  { q: '¿Los precios incluyen actualizaciones?', a: 'Sí. Todas las guías incluyen actualizaciones gratuitas de por vida: si el contenido se mejora, la nueva versión llega sin costo adicional.' },
  { q: '¿Cómo funcionan las promociones automáticas?', a: 'El carrito calcula solo la mejor combinación: 3 recursos a $19.999, 5 recursos a $39.999, 30% OFF si completás una categoría entera (10/10) y un precio especial si llevás la biblioteca completa.' },
  { q: '¿Puedo pedir reembolso después de descargar?', a: 'Al ser contenido digital descargable, no se aceptan reembolsos una vez descargado el archivo, salvo error nuestro en el envío del producto.' },
  { q: '¿Qué diferencia hay con el Blog de NEXA?', a: 'El Blog (/blog) tiene artículos de lectura gratuita. Aprende es la biblioteca de recursos premium descargables, con PDFs, plantillas y prompts listos para aplicar.' },
  { q: '¿En qué formato vienen los recursos?', a: 'PDF premium optimizado para leer en cualquier dispositivo, acompañado de checklists y plantillas editables según cada guía.' },
  { q: '¿Necesito experiencia previa?', a: 'Cada recurso indica su nivel (Principiante, Intermedio o Avanzado) en la ficha de producto, para que elijas según tu punto de partida.' },
];

const PROMO_TILES = [
  { icon: Layers3, title: 'Combo x3', text: 'Llevate 3 recursos por $19.999, se aplica solo en el carrito.' },
  { icon: PackageCheck, title: 'Combo x5', text: 'Llevate 5 recursos por $39.999, mejor precio por volumen.' },
  { icon: Percent, title: 'Categoría completa', text: '30% OFF automático al completar los 10 recursos de una categoría.' },
  { icon: Library, title: 'Biblioteca completa', text: 'Precio especial fijo si llevás los 100 recursos de NEXA Aprende.' },
  { icon: Download, title: 'Descarga digital', text: 'Sin envíos ni esperas: el material queda listo para descargar.' },
  { icon: RefreshCw, title: 'Updates de por vida', text: 'Si mejoramos una guía, la nueva versión te llega sin costo.' },
];

export default function AprendeHomeClient({ categories, categoryCounts, featured, bestSellers, newArrivals, deals, allProducts, totalProducts }) {
  const [heroQuery, setHeroQuery] = useState('');
  const [pendingQuery, setPendingQuery] = useState('');

  function handleHeroSearch(e) {
    e.preventDefault();
    setHeroQuery(pendingQuery);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--bg-main)' }}>
        {/* ── HERO ── */}
        <section className="aprende-hero">
          <div className="container">
            <motion.div initial="hidden" animate="show" variants={stagger} style={{ textAlign: 'center' }}>
              <motion.span variants={fadeUp} className="section-tag">
                <Sparkles size={13} style={{ marginRight: 6, verticalAlign: -2 }} /> NEXA Aprende
              </motion.span>
              <motion.h1 variants={fadeUp} className="aprende-hero-title">
                Todo lo que necesitás saber, <span className="text-gradient">en un PDF</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="aprende-hero-subtitle">
                Biblioteca premium de {totalProducts} guías descargables sobre IA, redes, ventas, finanzas y más.
                Comprás, descargás y aplicás hoy mismo.
              </motion.p>

              <motion.form variants={fadeUp} onSubmit={handleHeroSearch} className="aprende-hero-search">
                <Search size={18} />
                <input
                  value={pendingQuery}
                  onChange={(e) => setPendingQuery(e.target.value)}
                  placeholder="Buscar: IA, Instagram, Excel, ventas..."
                />
                <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
              </motion.form>

              <motion.div variants={fadeUp} className="hero-trust-row" style={{ marginTop: 22 }}>
                <span className="hero-trust-chip"><PackageCheck size={15} /> {totalProducts} recursos</span>
                <span className="hero-trust-chip"><Layers3 size={15} /> 10 categorías</span>
                <span className="hero-trust-chip"><Download size={15} /> Descarga inmediata</span>
                <span className="hero-trust-chip"><ShieldCheck size={15} /> Contenido en español</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── CATEGORÍAS ── */}
        <section className="section-sm">
          <div className="container">
            <motion.div className="section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="section-tag">Explorá por tema</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Categorías</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle">10 categorías, 10 recursos cada una. Elegí la tuya y arrancá.</motion.p>
            </motion.div>
            <CategoryLinksGrid categories={categories} counts={categoryCounts} />
          </div>
        </section>

        {/* ── DESTACADOS ── */}
        <ProductRow tag="Selección NEXA" title="Destacados" subtitle="Los recursos que más recomendamos para arrancar." products={featured} />

        {/* ── MÁS VENDIDOS ── */}
        <ProductRow tag="Lo más elegido" title="Más vendidos" subtitle="Los recursos con mejor calificación y más ventas de la biblioteca." products={bestSellers} tint />

        {/* ── NUEVOS ── */}
        <ProductRow tag="Recién llegados" title="Nuevos" subtitle="Las últimas guías incorporadas a NEXA Aprende." products={newArrivals} />

        {/* ── OFERTAS ── */}
        <ProductRow tag="Por tiempo limitado" title="Ofertas" subtitle="Recursos con descuento directo sobre el precio de lista." products={deals} tint />

        {/* ── BANNER 3x2 PROMOS ── */}
        <section className="section-sm">
          <div className="container">
            <motion.div className="section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="section-tag">Ahorrá más</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Promociones automáticas</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle">Se calculan solas en tu carrito, sin cupones ni pasos extra.</motion.p>
            </motion.div>
            <motion.div className="aprende-promo-grid" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              {PROMO_TILES.map((tile) => (
                <motion.div key={tile.title} variants={fadeUp} className="aprende-promo-tile">
                  <span className="aprende-promo-icon"><tile.icon size={20} /></span>
                  <h4>{tile.title}</h4>
                  <p>{tile.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CATÁLOGO COMPLETO / BUSCADOR ── */}
        <section className="section" style={{ background: 'var(--bg-white)' }}>
          <div className="container">
            <motion.div className="section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="section-tag">Catálogo completo</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Buscá tu próximo recurso</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle">Filtrá por categoría, buscá por palabra clave y ordená como prefieras.</motion.p>
            </motion.div>
            <ProductExplorer id="catalogo" products={allProducts} categories={categories} query={heroQuery} onQueryChange={setHeroQuery} />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="transformation">
          <div className="container">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
              <motion.span variants={fadeUp} className="section-tag">Empezá hoy</motion.span>
              <motion.h2 variants={fadeUp} className="section-title" style={{ color: 'white' }}>
                Tu próximo mejor recurso está a un click
              </motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)', margin: '0 auto 28px' }}>
                Sumate a la biblioteca premium de NEXA y empezá a aplicar lo que aprendés desde hoy.
              </motion.p>
              <motion.div variants={fadeUp}>
                <a href="#catalogo" className="btn btn-lima">Ver catálogo completo <ArrowRight size={16} /></a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── TESTIMONIOS ── */}
        <section className="section">
          <div className="container">
            <motion.div className="section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="section-tag">Lo que dicen</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Resultados reales de la comunidad</motion.h2>
            </motion.div>
            <Testimonials items={TESTIMONIALS} />
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section-sm" style={{ background: 'var(--bg-white)' }}>
          <div className="container">
            <motion.div className="section-header" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="section-tag">Dudas frecuentes</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Preguntas frecuentes</motion.h2>
            </motion.div>
            <FAQAccordion faqs={FAQS} />
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <section className="section-sm">
          <div className="container">
            <Newsletter />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function ProductRow({ tag, title, subtitle, products, tint }) {
  if (!products.length) return null;
  return (
    <section className="section-sm" style={tint ? { background: 'var(--bg-soft)' } : undefined}>
      <div className="container">
        <motion.div
          className="section-header"
          style={{ textAlign: 'left', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <div>
            <motion.span variants={fadeUp} className="section-tag">{tag}</motion.span>
            <motion.h2 variants={fadeUp} className="section-title" style={{ marginBottom: 0 }}>{title}</motion.h2>
            {subtitle && <motion.p variants={fadeUp} className="section-subtitle" style={{ margin: '10px 0 0' }}>{subtitle}</motion.p>}
          </div>
        </motion.div>
        <motion.div className="aprende-grid" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {products.map((product) => (
            <motion.div key={product.slug} variants={fadeUp}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
