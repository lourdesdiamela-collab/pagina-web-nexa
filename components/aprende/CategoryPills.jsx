'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getCategoryIcon } from '@/lib/categoryIcons';

export function CategoryPillsFilter({ active, onSelect, categories = [] }) {
  return (
    <div className="aprende-pills">
      <button
        type="button"
        onClick={() => onSelect('Todos')}
        className={`aprende-pill ${active === 'Todos' ? 'active' : ''}`}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => onSelect(cat.slug)}
          className={`aprende-pill ${active === cat.slug ? 'active' : ''}`}
          style={active === cat.slug ? { borderColor: cat.color, background: `${cat.color}22`, color: '#101222' } : undefined}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export function CategoryLinksGrid({ categories = [], counts = {} }) {
  return (
    <div className="aprende-cat-grid">
      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.slug);
        return (
          <Link key={cat.slug} href={`/aprende/categoria/${cat.slug}`} className="aprende-cat-card" style={{ '--cat-color': cat.color }}>
            <span className="aprende-cat-arrow"><ArrowUpRight size={14} /></span>
            <span className="aprende-cat-icon"><Icon size={24} strokeWidth={1.7} /></span>
            <span className="aprende-cat-label">{cat.label}</span>
            <span className="aprende-cat-count">{counts[cat.slug] ?? 0} recursos</span>
          </Link>
        );
      })}
    </div>
  );
}
