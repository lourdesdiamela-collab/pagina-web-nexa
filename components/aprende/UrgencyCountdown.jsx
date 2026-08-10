'use client';

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function formatRemaining(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Aviso de "oferta por tiempo limitado" con cuenta regresiva real hasta la
// medianoche (hora local del visitante) — genera urgencia genuina sin ser un
// timer falso que se reinicia solo para parecer más apurado.
export default function UrgencyCountdown({ compact = false, label = 'Precios promo de hoy terminan en' }) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    setRemaining(msUntilMidnight());
    const interval = setInterval(() => setRemaining(msUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (remaining === null) return null;

  return (
    <span className={`aprende-urgency-bar${compact ? ' compact' : ''}`}>
      <Flame size={14} />
      {label} <strong>{formatRemaining(remaining)}</strong>
    </span>
  );
}
