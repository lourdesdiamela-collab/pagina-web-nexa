import React from 'react';
import { useParams } from 'react-router-dom';

const Article = () => {
  const { slug } = useParams();
  
  return (
    <div className="page-wrapper" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <span className="section-tag" style={{ marginBottom: '20px', display: 'inline-block' }}>Artículo</span>
        <h1>{slug?.replace(/-/g, ' ')}</h1>
        <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
          Este contenido está siento diagramado. En NEXA creemos fervientemente en entregar valor real, no humo.
        </p>
      </div>
    </div>
  );
};

export default Article;
