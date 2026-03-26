'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Video, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Academy() {
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', 'Marketing', 'Redes sociales', 'Campañas', 'Marca', 'Ventas', 'Organización digital'];

  const articles = [
    { title: 'Por qué tu contenido no está generando ventas', category: 'Redes sociales', type: 'Artículo', icon: BookOpen, readTime: '5 min', slug: 'contenido-sin-ventas' },
    { title: 'Qué necesita una marca para verse más profesional', category: 'Marca', type: 'Guía', icon: FileText, readTime: '8 min', slug: 'marca-profesional' },
    { title: 'Errores comunes en campañas de Meta Ads', category: 'Campañas', type: 'Video', icon: Video, readTime: '12 min', slug: 'errores-meta-ads' },
    { title: 'Cómo ordenar tus contactos y no perder oportunidades', category: 'Ventas', type: 'Tutorial', icon: BookOpen, readTime: '6 min', slug: 'orden-contactos' },
    { title: 'Qué revisar antes de invertir en publicidad', category: 'Marketing', type: 'Checklist', icon: FileText, readTime: '4 min', slug: 'antes-invertir-ads' },
    { title: 'Redes sociales: presencia, estrategia y constancia', category: 'Redes sociales', type: 'Artículo', icon: BookOpen, readTime: '7 min', slug: 'presencia-redes-constancia' }
  ];

  const filteredArticles = filter === 'Todos' ? articles : articles.filter(a => a.category === filter);

  return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ paddingTop: '120px' }}>
        <section className="academy-hero" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-tag" style={{ background: 'rgba(184, 155, 255, 0.1)', color: 'var(--primary)' }}>Aprende con NEXA</span>
            <h1 className="section-title">Elevá tu estándar <span className="text-gradient">digital.</span></h1>
            <p className="section-subtitle">Ideas, guías y contenidos reales para entender mejor el marketing y hacer crecer tu negocio.</p>
            
            <div className="academy-search" style={{ position: 'relative', marginTop: '40px' }}>
              <Search size={20} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Buscar estrategias, guías, herramientas..." 
                style={{ width: '100%', padding: '20px 20px 20px 50px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', fontSize: '1rem', outline: 'none' }} />
            </div>
          </div>
        </section>

        <section className="academy-categories" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '60px' }}>
          <div className="container">
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  style={{
                    padding: '10px 24px', borderRadius: '100px', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                    border: filter === cat ? '1px solid var(--lima)' : '1px solid rgba(255,255,255,0.1)',
                    background: filter === cat ? 'var(--lima)' : 'transparent',
                    color: filter === cat ? '#0D0E15' : 'white', transition: 'all 0.3s'
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="academy-content" style={{ paddingBottom: '100px' }}>
          <div className="container">
            <div className="academy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {filteredArticles.map((article, i) => (
                <motion.div key={i} className="academy-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', background: 'linear-gradient(135deg, rgba(184, 155, 255, 0.1), rgba(13,14,21,1))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <article.icon size={48} color="rgba(255,255,255,0.2)" />
                    <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', color: 'white', fontWeight: 600 }}>
                      {article.type} · {article.readTime}
                    </div>
                  </div>
                  <div style={{ padding: '30px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'block' }}>
                      {article.category}
                    </span>
                    <h3 style={{ color: 'white', fontSize: '1.4rem', lineHeight: 1.3, marginBottom: '20px', flexGrow: 1 }}>{article.title}</h3>
                    <Link href={`/aprende/${article.slug}`} style={{ color: 'var(--lima)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                      Leer contenido <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
