import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getArticleBySlug } from '@/lib/articles';

function renderSection(section) {
  if (section.type === 'h2') {
    return <h2 style={{ margin: '24px 0 10px', fontSize: '1.55rem', color: '#101222' }}>{section.content}</h2>;
  }

  if (section.type === 'list') {
    return (
      <ul style={{ margin: '0 0 14px', paddingLeft: 22, color: '#333a53', lineHeight: 1.7 }}>
        {section.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (section.type === 'quote') {
    return (
      <blockquote style={{ margin: '16px 0', borderLeft: '4px solid #b89bff', padding: '10px 14px', background: '#f5f0fb', borderRadius: 10, color: '#2f3650', fontWeight: 600 }}>
        {section.content}
      </blockquote>
    );
  }

  if (section.type === 'callout') {
    return (
      <div style={{ margin: '16px 0', border: '1px solid rgba(184,155,255,0.35)', background: 'rgba(184,155,255,0.12)', borderRadius: 12, padding: '12px 14px' }}>
        <strong style={{ color: '#4f2cb4' }}>{section.title}</strong>
        <p style={{ margin: '6px 0 0', color: '#313956' }}>{section.content}</p>
      </div>
    );
  }

  return <p style={{ margin: '0 0 14px', color: '#333a53', lineHeight: 1.75 }}>{section.content}</p>;
}

export default function ArticleDetailPage({ params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 110, background: '#f5f0fa', minHeight: '100vh' }}>
        <article className="container" style={{ maxWidth: 860, paddingBottom: 80 }}>
          <Link href="/aprende" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#5530c6', textDecoration: 'none', fontWeight: 700, marginBottom: 12 }}>
            <ArrowLeft size={14} /> Volver a Aprende
          </Link>

          <div style={{ borderRadius: 18, border: '1px solid rgba(16,18,34,0.12)', background: 'white', overflow: 'hidden' }}>
            <img src={article.cover} alt={article.title} style={{ width: '100%', height: 'clamp(190px, 34vw, 320px)', objectFit: 'cover' }} />
            <div style={{ padding: '18px clamp(14px, 4vw, 38px) 26px' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', color: '#5d6480', fontSize: '0.86rem' }}>
                <span>{article.category}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Clock size={14} /> {article.readTime}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Calendar size={14} /> {new Date(article.publishedAt).toLocaleDateString('es-AR')}</span>
              </div>
              <h1 style={{ margin: '10px 0 14px', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.1, color: '#101222' }}>{article.title}</h1>
              <p style={{ margin: 0, color: '#4d5369', fontSize: '1.02rem' }}>{article.summary}</p>

              <section style={{ marginTop: 20 }}>
                {article.sections.map((section, index) => (
                  <div key={`${section.type}-${index}`}>{renderSection(section)}</div>
                ))}
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
