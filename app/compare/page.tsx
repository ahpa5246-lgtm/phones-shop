'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { GitCompareArrows, X } from 'lucide-react';
import { formatIQD } from '@/lib/demo-data';
import { getCompareIds, toggleCompare } from '@/lib/browser-commerce';
import type { CatalogProduct } from '@/lib/catalog-data';

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => setIds(getCompareIds());
    sync();
    window.addEventListener('nova-commerce-change', sync);
    return () => window.removeEventListener('nova-commerce-change', sync);
  }, []);

  useEffect(() => {
    if (!ids.length) { setProducts([]); return; }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/catalog?slugs=${encodeURIComponent(ids.join(','))}`, { signal: controller.signal })
      .then(response => response.json())
      .then(data => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [ids]);

  const ordered = useMemo(() => ids.map(id => products.find(product => product.slug === id || product.id === id)).filter((product): product is CatalogProduct => Boolean(product)), [ids, products]);

  return (
    <main className="shell compare-page">
      <div className="cart-heading">
        <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Side-by-side</span><h1>Compare phones</h1><p>Compare up to four devices using the current catalog data.</p></div>
        <Link href="/shop" className="pill">Add another phone</Link>
      </div>

      {loading && <div className="empty-state"><p>Loading comparison…</p></div>}
      {!loading && !ordered.length ? (
        <div className="empty-state cart-empty"><GitCompareArrows size={38}/><h2>No phones selected.</h2><p>Use the Compare button in the catalog or on a product page.</p><Link href="/shop" className="pill primary">Browse smartphones</Link></div>
      ) : !loading && (
        <div className="compare-scroll">
          <table className="compare-table">
            <thead><tr><th>Specification</th>{ordered.map((product) => <th key={product.slug}><button className="compare-remove" onClick={() => setIds(toggleCompare(product.slug))}><X size={14}/> Remove</button><div className="compare-phone"><div className="mini-phone"/></div><Link href={`/phones/${product.slug}`}>{product.name}</Link><span>{product.brand}</span></th>)}</tr></thead>
            <tbody>
              <tr><td>Price</td>{ordered.map((p) => <td key={p.slug}>{formatIQD(p.price)}</td>)}</tr>
              <tr><td>Rating</td>{ordered.map((p) => <td key={p.slug}>{p.rating ? `${p.rating} / 5` : 'No approved reviews'}</td>)}</tr>
              <tr><td>OS</td>{ordered.map((p) => <td key={p.slug}>{p.os}</td>)}</tr>
              <tr><td>RAM</td>{ordered.map((p) => <td key={p.slug}>{p.ram}</td>)}</tr>
              <tr><td>Display</td>{ordered.map((p) => <td key={p.slug}>{p.display}</td>)}</tr>
              <tr><td>Battery</td>{ordered.map((p) => <td key={p.slug}>{p.battery}</td>)}</tr>
              <tr><td>Camera</td>{ordered.map((p) => <td key={p.slug}>{p.camera}</td>)}</tr>
              <tr><td>Storage</td>{ordered.map((p) => <td key={p.slug}>{p.storage.join(' / ')}</td>)}</tr>
              <tr><td>Stock</td>{ordered.map((p) => <td key={p.slug}>{p.stock} units</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
