'use client';

import { useEffect, useState } from 'react';
import { TimerReset, AlertTriangle } from 'lucide-react';

const RESERVATION_SECONDS = 10 * 60;

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Countdown de 10 minutos que avisa cuánto tiempo queda para completar la
// transferencia con el 10% OFF antes de que la reserva de precio venza. Es un
// aviso de UX (no bloquea nada del lado del servidor): si vence, se puede
// renovar la reserva con un click.
export default function TransferReservationTimer() {
  const [secondsLeft, setSecondsLeft] = useState(RESERVATION_SECONDS);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setSecondsLeft(RESERVATION_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resetKey]);

  const expired = secondsLeft === 0;

  return (
    <div className={`aprende-transfer-timer${expired ? ' expired' : ''}`}>
      {expired ? <AlertTriangle size={16} /> : <TimerReset size={16} />}
      {expired ? (
        <span>
          Se venció la reserva de tu precio con 10% OFF.{' '}
          <button type="button" className="aprende-copy-btn" onClick={() => setResetKey((k) => k + 1)}>
            Renovar reserva
          </button>
        </span>
      ) : (
        <span>
          Tu precio con 10% OFF queda reservado por <span className="timer-value">{formatClock(secondsLeft)}</span>. Hacé la transferencia antes de que se acabe el tiempo.
        </span>
      )}
    </div>
  );
}
