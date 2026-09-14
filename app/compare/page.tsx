'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GitCompareArrows, X } from 'lucide-react';
import { demoProducts, formatIQD } from '@/lib/demo-data';
import { getCompareIds, toggleCompare } from '@/lib/browser-commerce';

export default function ComparePage() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(getCompareIds());
    sync();
    window.addEventListener('nova-commerce-change', sync);
    return () => window.removeEventListener('nova-commerce-change', sync);
  }, []);

  const products = ids.map((id) => demoProducts.find((product) => product.id === id)).filter(Boolean);

  return (
    <main className="shell compare-page">
      <div className="cart-heading">
        <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Side-by-side</span><h1>Compare phones</h1><p>Up to four demo devices can be stored locally for comparison.</p></div>
        <Link href="/shop" className="pill">Add another phone</Link>
      </div>

      {!products.length ? (
        <div className="empty-state cart-empty"><GitCompareArrows size={38}/><h2>No phones selected.</h2><p>Use the Compare button in the catalog or on a product page.</p><Link href="/shop" className="pill primary">Browse smartphones</Link></div>
      ) : (
        <div className="compare-scroll">
          <table className="compare-table">
            <thead><tr><th>Specification</th>{products.map((product) => product && <th key={product.id}><button className="compare-remove" onClick={() => setIds(toggleCompare(product.id))}><X size={14}/> Remove</button><div className="compare-phone"><div className="mini-phone"/></div><Link href={`/phones/${product.slug}`}>{product.name}</Link><span>{product.brand}</span></th>)}</tr></thead>
            <tbody>
              <tr><td>Price</td>{products.map((p) => p && <td key={p.id}>{formatIQD(p.price)}</td>)}</tr>
              <tr><td>Rating</td>{products.map((p) => p && <td key={p.id}>{p.rating} / 5</td>)}</tr>
              <tr><td>OS</td>{products.map((p) => p && <td key={p.id}>{p.os}</td>)}</tr>
              <tr><td>RAM</td>{products.map((p) => p && <td key={p.id}>{p.ram}</td>)}</tr>
              <tr><td>Display</td>{products.map((p) => p && <td key={p.id}>{p.display}</td>)}</tr>
              <tr><td>Battery</td>{products.map((p) => p && <td key={p.id}>{p.battery}</td>)}</tr>
              <tr><td>Camera</td>{products.map((p) => p && <td key={p.id}>{p.camera}</td>)}</tr>
              <tr><td>Storage</td>{products.map((p) => p && <td key={p.id}>{p.storage.join(' / ')}</td>)}</tr>
              <tr><td>Stock</td>{products.map((p) => p && <td key={p.id}>{p.stock} demo units</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
