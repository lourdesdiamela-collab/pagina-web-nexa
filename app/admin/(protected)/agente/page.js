'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, TrendingUp, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';

export default function CampaignAgent() {
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      content: '¡Hola! Soy tu Agente de Campañas NEXA. Estoy sincronizado con tu cuenta de Meta Ads y Google Ads. Puedo darte el CPA de hoy, tu gasto actual, o recomendarte ajustes para bajar el costo por lead. ¿Qué revisamos?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Simulate AI thinking and calling the "Meta Ads" API logically
    setTimeout(() => {
      let botResponse = 'Revisé los datos generales. Las campañas se están manteniendo estables con un ROAS de 3.2X.';
      
      const lower = userMessage.toLowerCase();
      if (lower.includes('gasto') || lower.includes('inversion') || lower.includes('presupuesto')) {
        botResponse = '📉 Tu inversión actual este mes es de $320,000 ARS. Llevamos consumido el 64% del presupuesto mensual de Meta. El costo por lead (CPL) bajó un 12% desde la última optimización.';
      } else if (lower.includes('mejorar') || lower.includes('recomendacion') || lower.includes('bajar')) {
        botResponse = '✨ Te recomiendo apagar el conjunto de anuncios "Broad - Historias" que está trayendo el CPL a $1,200 ARS (muy alto), y redistribuir ese 20% de presupuesto a la campaña "Retargeting Video 1", que tiene un CPL excelente de $450 ARS.';
      } else if (lower.includes('leads') || lower.includes('clientes') || lower.includes('resultados')) {
        botResponse = '🎯 Ingresaron 142 leads en los últimos 7 días. El anuncio ganador indiscutible es "Video Testimonios 3".';
      }

      setMessages(prev => [...prev, { role: 'agent', content: botResponse }]);
      setIsTyping(false);
    }, 1800);
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#12141D', fontSize: '2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot color="#FF9F43" size={32} /> Agente de Campañas AI
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', marginTop: '4px' }}>
            Conectado a Meta Ads API y Google Optimization.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(40, 199, 111, 0.1)', color: '#28C76F', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, background: '#28C76F', borderRadius: '50%' }} /> Meta Sincronizado
          </div>
          <div style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(0, 207, 232, 0.1)', color: '#00CFE8', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, background: '#00CFE8', borderRadius: '50%' }} /> Google Ads Activo
          </div>
        </div>
      </header>

      {/* Suggested Prompts */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => setInput('¿Cuál es el gasto de campañas actual?')} style={{ background: 'white', border: '1px solid #EEE', borderRadius: '100px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#12141D', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
          <BarChart3 size={14} color="#FF9F43" /> Revisar Gasto
        </button>
        <button onClick={() => setInput('¿Qué recomendación tenés para mejorar mis campañas?')} style={{ background: 'white', border: '1px solid #EEE', borderRadius: '100px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#12141D', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
          <Sparkles size={14} color="#B89BFF" /> Optimizar CPL
        </button>
        <button onClick={() => setInput('¿Cuántos leads entraron esta semana?')} style={{ background: 'white', border: '1px solid #EEE', borderRadius: '100px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600, color: '#12141D', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
          <Target size={14} color="#00CFE8" /> Ver Resultados
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flexGrow: 1, background: 'white', border: '1px solid #EEE', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        
        <div style={{ flexGrow: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ 
                maxWidth: '70%', padding: '16px 20px', borderRadius: '18px',
                borderBottomRightRadius: m.role === 'user' ? 4 : 18,
                borderBottomLeftRadius: m.role === 'agent' ? 4 : 18,
                background: m.role === 'user' ? '#12141D' : '#F9F9F9',
                color: m.role === 'user' ? 'white' : '#12141D',
                border: m.role === 'agent' ? '1px solid #EEE' : 'none',
                lineHeight: 1.5, fontSize: '0.95rem'
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '16px 20px', borderRadius: '18px', borderBottomLeftRadius: 4, background: '#F9F9F9', border: '1px solid #EEE', color: '#999', fontSize: '0.9rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Bot size={16} /> Analizando métricas...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #EEE', background: '#FAFAFA' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Preguntale al agente sobe tus campañas..." 
              style={{ flexGrow: 1, padding: '16px 20px', borderRadius: '16px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '1rem' }}
              disabled={isTyping}
            />
            <button type="submit" disabled={isTyping || !input.trim()} style={{ background: '#FF9F43', color: 'white', border: 'none', borderRadius: '16px', width: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (isTyping || !input.trim()) ? 'not-allowed' : 'pointer', opacity: (isTyping || !input.trim()) ? 0.6 : 1, transition: 'all 0.2s' }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
