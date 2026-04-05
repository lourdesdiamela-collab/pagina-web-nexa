'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function DashboardShell({ children, sidebar, isDark = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`ds-root ${isDark ? 'ds-dark' : 'ds-light'}`}>
      {/* Mobile hamburger toggle */}
      <button
        className="ds-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop overlay */}
      <div
        className={`ds-backdrop${open ? ' visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`ds-sidebar${open ? ' open' : ''}`}>
        <button
          className="ds-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="ds-main">
        {children}
      </main>
    </div>
  );
}
