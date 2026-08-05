import {
  Sparkles, Instagram, MessageCircle, Megaphone, TrendingUp,
  Code2, Search, Table2, Wallet, Clock, FileText,
} from 'lucide-react';

// Los íconos son una decisión de diseño, no un dato editable desde el admin.
// Se mapean por slug de categoría; una categoría nueva creada desde el admin
// usa FileText como ícono genérico hasta que se sume acá.
export const CATEGORY_ICONS = {
  ia: Sparkles,
  instagram: Instagram,
  'whatsapp-business': MessageCircle,
  'marketing-digital': Megaphone,
  ventas: TrendingUp,
  'desarrollo-web': Code2,
  seo: Search,
  'excel-power-bi': Table2,
  finanzas: Wallet,
  productividad: Clock,
};

export function getCategoryIcon(slug) {
  return CATEGORY_ICONS[slug] || FileText;
}
