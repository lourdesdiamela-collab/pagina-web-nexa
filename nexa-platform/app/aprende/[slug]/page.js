import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Muted mock content for articles based on the slugs
const getArticleData = (slug) => {
  const data = {
    'contenido-sin-ventas': {
      title: 'Por qué tu contenido no está generando ventas (y cómo solucionarlo)',
      category: 'Redes sociales',
      readTime: '5 min',
      date: '10 Feb 2026',
      content: `
        <h2>El problema de los "Likes" vacíos</h2>
        <p>Muchas marcas miden su éxito en redes sociales basándose en la cantidad de "Me gusta" o visualizaciones que obtienen sus Reels. Sin embargo, a fin de mes, esos likes no pagan las cuentas. Si tu contenido se volvió viral pero tus ventas siguen planas, estás sufriendo de "Métricas de Vanidad".</p>
        
        <h2>El contenido educativo vs contenido de conversión</h2>
        <p>Tu calendario de contenidos debe tener una estrategia clara. Nosotros lo dividimos en tres fases:</p>
        <ul>
          <li><strong>Atracción:</strong> Contenido amplio (Reels tendencias, memes de nicho) para que nuevas personas te descubran.</li>
          <li><strong>Nutrición:</strong> Carruseles profundos, casos de estudio, demostraciones de producto. Aquí es donde generas confianza.</li>
          <li><strong>Conversión:</strong> Historias de venta directa, llamados a la acción claros, urgencia.</li>
        </ul>
        <p>Si solo haces contenido de atracción, tendrás seguidores, pero no clientes.</p>

        <h2>La solución: El embudo de contenido</h2>
        <p>A partir de hoy, asegúrate de que al menos el 20% de tu contenido semanal sea directamente transaccional. Dile a tus seguidores exactamente qué ofreces, cuánto cuesta y cómo pueden comprarlo.</p>
      `
    },
    'marca-profesional': {
      title: 'Qué necesita una marca para verse más profesional en internet',
      category: 'Marca',
      readTime: '8 min',
      date: '15 Feb 2026',
      content: `
        <h2>La primera impresión sí cuenta</h2>
        <p>Cuando un cliente potencial entra a tu perfil de Instagram o a tu página web, toma una decisión subconsciente en menos de 3 segundos sobre si tu empresa es "premium" o "barata".</p>
        
        <h2>Elementos de una marca profesional:</h2>
        <ul>
          <li><strong>Identidad visual consistente:</strong> Usa la misma paleta de colores y la misma tipografía en todos lados.</li>
          <li><strong>Fotos de alta calidad:</strong> Invierte en una sesión de fotos profesional. No más fotos oscuras con el celular.</li>
          <li><strong>Un sitio web veloz:</strong> Si tu web tarda más de 4 segundos en cargar, el 50% de la gente se va.</li>
          <li><strong>Textos claros (Copywriting):</strong> No asumas que la gente entiende lo que vendes. Explícalo como si tuvieran 5 años.</li>
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
    <div style={{ background: '#0D0E15', minHeight: '100vh', color: 'white' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '140px', paddingBottom: '100px', maxWidth: '800px' }}>
        <Link href="/aprende" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textDecoration: 'none', marginBottom: '40px', transition: 'color 0.3s' }}>
          <ArrowLeft size={16} /> Volver a los artículos
        </Link>
        
        <div style={{ marginBottom: '40px' }}>
          <span style={{ color: '#D2F23A', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {article.category}
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.2, marginTop: '16px', marginBottom: '24px', letterSpacing: '-0.02em', color: 'white' }}>
            {article.title}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> Lectura de {article.readTime}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Publicado el {article.date}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }} className="article-content">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* CTA Bótom */}
        <div style={{ marginTop: '80px', padding: '40px', background: 'rgba(184, 155, 255, 0.05)', borderRadius: '24px', border: '1px solid rgba(184, 155, 255, 0.2)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'white' }}>¿Qué sigue?</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px', fontSize: '1.1rem' }}>Si querés implementar estas estrategias de forma profesional en tu empresa, nuestro equipo estratégico está listo para auditar tu caso.</p>
          <Link href="/contacto" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            Auditar mi marca
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
