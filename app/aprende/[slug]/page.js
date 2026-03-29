import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Muted mock content for articles based on the slugs
// Rich content for articles based on the slugs
const getArticleData = (slug) => {
  const data = {
    'contenido-sin-ventas': { 
      title: 'Por qué tu contenido no está generando ventas (y cómo solucionarlo)',
      category: 'Redes sociales',
      readTime: '5 min',
      date: '10 Mar 2026',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
      content: `
        <div class="article-hero-img" style="margin-bottom: 40px; border-radius: 32px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1)">
          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80" alt="Contenido Estratégico" style="width: 100%; display: block;" />
        </div>
        <h2>El problema de los "Likes" vacíos</h2>
        <p>Muchas marcas miden su éxito en redes sociales basándose en la cantidad de "Me gusta" o visualizaciones que obtienen sus Reels. Sin embargo, a fin de mes, esos likes no pagan las cuentas. Si tu contenido se volvió viral pero tus ventas siguen planas, estás sufriendo de "Métricas de Vanidad".</p>
        
        <blockquote style="border-left: 4px solid #D2F23A; padding-left: 24px; margin: 40px 0; font-style: italic; color: white; font-size: 1.4rem;">
          "El contenido que entretiene atrae gente, pero el contenido que educa y resuelve atrae clientes."
        </blockquote>

        <h2>El contenido educativo vs contenido de conversión</h2>
        <p>Tu calendario de contenidos debe tener una estrategia clara. Nosotros lo dividimos en tres fases fundamentales que deben convivir en tu feed:</p>
        <ul>
          <li><strong>Atracción:</strong> Contenido amplio (Reels tendencias, memes de nicho) para que nuevas personas te descubran. El objetivo es el alcance.</li>
          <li><strong>Nutrición:</strong> Carruseles profundos, casos de estudio, demostraciones de producto. Aquí es donde generas confianza y autoridad. Es el "por qué yo".</li>
          <li><strong>Conversión:</strong> Historias de venta directa, llamados a la acción claros, ofertas por tiempo limitado. Aquí pides la venta.</li>
        </ul>
        <p>Si solo haces contenido de atracción, tendrás seguidores, pero no clientes. Te verán como un creador de contenido, no como una solución profesional.</p>

        <h2>La solución: El embudo de contenido</h2>
        <p>A partir de hoy, asegúrate de que al menos el 20% de tu contenido semanal sea directamente transaccional. Dile a tus seguidores exactamente qué ofreces, cuánto cuesta y cómo pueden comprarlo. No asumas que ya lo saben.</p>
      `
    },
    'marca-profesional': {
      title: 'Qué necesita una marca para verse más profesional en internet',
      category: 'Marca',
      readTime: '8 min',
      date: '15 Mar 2026',
      image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&q=80',
      content: `
        <div class="article-hero-img" style="margin-bottom: 40px; border-radius: 32px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1)">
          <img src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=1200&q=80" alt="Marca Profesional" style="width: 100%; display: block;" />
        </div>
        <h2>La primera impresión sí cuenta</h2>
        <p>Cuando un cliente potencial entra a tu perfil de Instagram o a tu página web, toma una decisión subconsciente en menos de 3 segundos sobre si tu empresa es "premium" o "barata". Esa percepción dicta cuánto están dispuestos a pagar por tus servicios.</p>
        
        <div style="background: rgba(184, 155, 255, 0.1); padding: 30px; borderRadius: 24px; margin: 40px 0; border: 1px solid rgba(184, 155, 255, 0.2)">
          <h4 style="color: #B89BFF; margin-top: 0">Checklist de Profesionalismo Digital:</h4>
          <ul style="margin-bottom: 0">
            <li>Identidad visual coherente (colores, fuentes).</li>
            <li>Fotografía de producto o servicio en alta definición.</li>
            <li>Ortografía impecable en cada posteo.</li>
            <li>Velocidad de carga de la web menor a 2 segundos.</li>
          </ul>
        </div>

        <h2>Elementos de una marca profesional:</h2>
        <ul>
          <li><strong>Identidad visual consistente:</strong> Usa la misma paleta de colores y la misma tipografía en todos lados. La repetición crea reconocimiento.</li>
          <li><strong>Fotos de alta calidad:</strong> Invierte en una sesión de fotos profesional. Las fotos oscuras o pixeladas gritan "amateurismo".</li>
          <li><strong>Un sitio web veloz:</strong> Tu web es tu oficina central. Si está caída o anda lento, tu negocio parece abandonado.</li>
          <li><strong>Textos claros (Copywriting):</strong> No asumas que la gente entiende lo que vendes. Explícalo como si tuvieran 5 años, enfocándote en el beneficio, no solo en la característica.</li>
        </ul>
      `
    }
  };

  return data[slug] || {
    title: 'Cómo potenciar tu estrategia de crecimiento',
    category: 'Marketing',
    readTime: '7 min',
    date: '20 Feb 2026',
    content: `
      <p>Este artículo exclusivo está siendo redactado por el equipo de estrategias de NEXA. Vuelve pronto para descubrir nuevas tácticas de crecimiento y automatización para tu marca.</p>
    `
  };
};

export default function ArticlePage({ params }) {
  const article = getArticleData(params.slug);

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-dark)' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '140px', paddingBottom: '100px', maxWidth: '800px' }}>
        <Link href="/aprende" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none', marginBottom: '40px', transition: 'color 0.3s' }}>
          <ArrowLeft size={16} /> Volver a los artículos
        </Link>
        
        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#D2F23A', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {article.category}
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.2, marginTop: '16px', marginBottom: '24px', letterSpacing: '-0.02em', color: 'var(--text-dark)' }}>
            {article.title}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> Lectura de {article.readTime}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Publicado el {article.date}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '40px', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-body)' }} className="article-content">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* CTA Bótom */}
        <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(184, 155, 255, 0.05)', borderRadius: '24px', border: '1px solid rgba(184, 155, 255, 0.2)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-dark)' }}>¿Qué sigue?</h3>
          <p style={{ color: 'var(--text-body)', marginBottom: '30px', fontSize: '1.1rem' }}>Si querés implementar estas estrategias de forma profesional en tu empresa, nuestro equipo estratégico está listo para auditar tu caso.</p>
          <Link href="/contacto" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            Auditar mi marca
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
