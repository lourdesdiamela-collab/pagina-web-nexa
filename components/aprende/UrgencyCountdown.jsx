// Cuenta regresiva desactivada (noviembre 2026): marcaba "los precios promo de hoy terminan en..." hasta la
// medianoche, pero los precios no cambian a esa hora y el contador se reinicia todos los días. Eso es urgencia
// falsa y puede considerarse publicidad engañosa. Se deja el componente vacío para no tocar las páginas que lo importan.
export default function UrgencyCountdown() {
  return null;
}
