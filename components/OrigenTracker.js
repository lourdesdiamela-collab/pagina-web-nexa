'use client';

import { useEffect } from 'react';
import { capturarOrigen } from '@/lib/origen';

/**
 * Captura de dónde viene la visita, una sola vez por sesión.
 *
 * Va montado en el layout raíz para que funcione en TODO el sitio: si alguien
 * entra por un anuncio directo a /servicios o a una nota del blog, el origen
 * se registra igual que si hubiera entrado por la home.
 *
 * No renderiza nada y no bloquea el pintado de la página. Al ser un componente
 * de cliente, tampoco impide que las páginas se prerendericen: se hidrata
 * después, en el navegador.
 *
 * Ver lib/origen.js para el detalle de qué se guarda y qué no.
 */
export default function OrigenTracker() {
  useEffect(() => {
    capturarOrigen();
  }, []);

  return null;
}
