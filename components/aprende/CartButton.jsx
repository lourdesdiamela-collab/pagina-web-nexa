'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartButton() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  if (pathname === '/aprende/carrito') return null;

  return (
    <Link href="/aprende/carrito" className="aprende-cart-fab" aria-label="Ver carrito">
      <ShoppingBag size={20} />
      {itemCount > 0 && <span className="aprende-cart-fab-badge">{itemCount}</span>}
    </Link>
  );
}
