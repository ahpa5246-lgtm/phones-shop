'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CatalogProduct } from '@/lib/catalog-data';
import { formatIQD } from '@/lib/demo-data';

const KEY = 'nova-mobile-recent';

export default function RecentlyViewedList() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    let ids: string[] = [];
    try {
      const raw = window.localStorage.getItem(KEY);
      ids = raw ? JSON.parse(raw) as string[] : [];
    } catch {
      ids = [];
    }
    if (!ids.length) return;
    fetch(`/api/catalog?slugs=${encodeURIComponent(ids.join(','))}`)
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        const list = Array.isArray(data?.products) ? data.products as CatalogProduct[] : [];
        setProducts(ids.map(id => list.find(product => product.slug === id || product.id === id)).filter((product): product is CatalogProduct => Boolean(product)));
      })
      .catch(() => undefined);
  }, []);

  if (!products.length) return <p className="section-sub">Products you open will appear here for quick access.</p>;

  return <div className="saved-grid">{products.slice(0, 4).map(product => <Link className="saved-item" href={`/phones/${product.slug}`} key={product.slug}><span className="maker">{product.brand}</span><strong>{product.name}</strong><span>{formatIQD(product.price)}</span></Link>)}</div>;
}
