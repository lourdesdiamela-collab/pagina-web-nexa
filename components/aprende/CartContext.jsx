'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { computeCartTotals } from '@/lib/pricing';

const CartContext = createContext(null);
const STORAGE_KEY = 'nexa-aprende-cart-v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [catalog, setCatalog] = useState({ productsBySlug: new Map(), categoryProductCounts: new Map(), totalProductsCount: 0 });
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* localStorage no disponible — el carrito arranca vacío */
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* almacenamiento lleno o bloqueado — se ignora silenciosamente */
    }
  }, [items, isLoaded]);

  // Catálogo real (precios/productos) desde la base de datos, para que el
  // carrito nunca calcule con datos desactualizados si el admin cambió algo.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/aprende/products')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const productsBySlug = new Map(data.products.map((p) => [p.slug, p]));
        const categoryProductCounts = new Map(Object.entries(data.categoryProductCounts || {}));
        setCatalog({ productsBySlug, categoryProductCounts, totalProductsCount: data.products.length });
        setCatalogLoaded(true);
      })
      .catch(() => setCatalogLoaded(true));
    return () => { cancelled = true; };
  }, []);

  const addItem = useCallback((slug, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { slug, qty }];
    });
    setLastAdded(slug);
  }, []);

  const removeItem = useCallback((slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const updateQty = useCallback((slug, qty) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.slug !== slug);
      return prev.map((i) => (i.slug === slug ? { ...i, qty } : i));
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const resolveProduct = useCallback((slug) => catalog.productsBySlug.get(slug) || null, [catalog]);

  const totals = useMemo(() => computeCartTotals(items, catalog), [items, catalog]);
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items, addItem, removeItem, updateQty, clearCart, totals, itemCount, isLoaded, lastAdded,
      resolveProduct, catalogLoaded,
    }),
    [items, addItem, removeItem, updateQty, clearCart, totals, itemCount, isLoaded, lastAdded, resolveProduct, catalogLoaded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
