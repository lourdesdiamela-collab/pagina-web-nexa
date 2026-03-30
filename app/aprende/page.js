'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ARTICLE_CATEGORIES, listArticles } from '@/lib/articles';

const ARTICLES = listArticles();

export default function LearnPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = useMemo(() => {
    return ARTICLES.filter((article) => {
      if (category !== 'Todos' && article.category !== category) return false;
      if (!query) return true;
      const text = `${article.title} ${article.summary} ${article.category}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [query, category]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 120, background: '#f5f0fa', minHeight: '100vh' }}>
        <section className="container" style={{ paddingBottom: 80 }}>
          <header style={{ textAlign: 'center', marginBottom: 22 }}>
            <span className="section-tag">Aprende con NEXA</span>
            <h1 style={{ margin: '10px 0 0', fontSize: 'clamp(2rem, 4vw, 3.1rem)', color: '#101222' }}>Recursos para crecer mejor</h1>
            <p style={{ color: '#4d5369', maxWidth: 760, margin: '10px auto 0' }}>
              Articulos de lectura con foco en marketing, ventas y operacion comercial.
            </p>
          </header>

          <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
            <label style={{ position: 'relative' }}>
              <Search size={17} style={{ position: 'absolute', left: 12, top: 10, color: '#7e84a0' }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar tema o palabra clave"
                style={{ width: '100%', borderRadius: 12, border: '1px solid rgba(16,18,34,0.15)', background: 'white', color: '#101222', padding: '10px 12px 10px 36px' }}
              />
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ARTICLE_CATEGORIES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  style={{
                    borderRadius: 999,
                    border: category === option ? '1px solid rgba(184,155,255,0.65)' : '1px solid rgba(16,18,34,0.2)',
                    background: category === option ? 'rgba(184,155,255,0.18)' : 'white',
                    color: '#101222',
                    padding: '7px 12px',
                    fontWeight: 600,
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {filtered.map((article) => (
              <article key={article.slug} style={{ borderRadius: 16, border: '1px solid rgba(16,18,34,0.12)', background: 'white', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={article.cover} alt={article.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <div style={{ padding: 14, display: 'grid', gap: 10, flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: '#6a35ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {article.category} · {article.readTime}
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.22rem', lineHeight: 1.3, color: '#101222' }}>{article.title}</h2>
                  <p style={{ margin: 0, color: '#4d5369', fontSize: '0.95rem' }}>{article.summary}</p>
                  <Link href={`/aprende/${article.slug}`} style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, color: '#5530c6', fontWeight: 700, textDecoration: 'none' }}>
                    Leer articulo <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ marginTop: 16, borderRadius: 12, border: '1px solid rgba(16,18,34,0.12)', background: 'white', padding: 14, color: '#4d5369' }}>
              No encontramos resultados para ese filtro.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
