'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, ShoppingBag, Users, MessageSquare, Ticket, ArrowLeft,
} from 'lucide-react';

const LINKS = [
  { href: '/aprende/admin', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/aprende/admin/productos', label: 'Productos', icon: Package },
  { href: '/aprende/admin/categorias', label: 'Categorías', icon: FolderTree },
  { href: '/aprende/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/aprende/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/aprende/admin/resenas', label: 'Reseñas', icon: MessageSquare },
  { href: '/aprende/admin/cupones', label: 'Cupones', icon: Ticket },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="aprende-admin-sidebar">
      <span className="brand">NEXA Admin</span>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={active ? 'active' : ''}>
            <link.icon size={16} /> {link.label}
          </Link>
        );
      })}
      <Link href="/aprende" style={{ marginTop: 16 }}>
        <ArrowLeft size={16} /> Volver a la tienda
      </Link>
    </aside>
  );
}
