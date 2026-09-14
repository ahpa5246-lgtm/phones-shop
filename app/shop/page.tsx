'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import ProductActions from '@/components/product-actions';
import { demoBrands, demoProducts, formatIQD } from '@/lib/demo-data';

export default function ShopPage() {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('All');
  const [os, setOs] = useState('All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(2000000);

  const products = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = demoProducts.filter((product) => {
      const matchesQuery = !normalized || [product.name, product.brand, product.storage.join(' '), product.os]
        .join(' ').toLowerCase().includes(normalized);
      return matchesQuery && (brand === 'All' || product.brand === brand) && (os === 'All' || product.os === os) && product.price <= maxPrice;
    });
    return [...filtered].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
  }, [query, brand, os, sort, maxPrice]);

  return (
    <main>
      <section className="catalog-hero">
        <div className="shell">
          <span className="eyebrow" style={{color:'var(--green-700)'}}>Smartphone catalog</span>
          <h1>Choose with clarity.</h1>
          <p>Search and filter the demo catalog by brand, operating system and price. Product data can be replaced later without changing this experience.</p>
        </div>
      </section>

      <section className="shell catalog-layout">
        <aside className="filter-panel">
          <div className="filter-title"><SlidersHorizontal size={18}/><strong>Filters</strong></div>
          <label>Search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Phone, brand, storage..."/></label>
          <label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}><option>All</option>{demoBrands.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Operating system<select value={os} onChange={(e) => setOs(e.target.value)}><option>All</option><option>iOS</option><option>Android</option></select></label>
          <label>Maximum price<strong>{formatIQD(maxPrice)}</strong><input type="range" min="900000" max="2000000" step="25000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}/></label>
        </aside>

        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div><Search size={18}/><strong>{products.length} phones</strong></div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option>
            </select>
          </div>
          {products.length ? <div className="products catalog-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <Link href={`/phones/${product.slug}`} className="product-image"><span className="badge">{product.badge ?? 'Smartphone'}</span><div className="mini-phone"/></Link>
                <div className="product-meta">
                  <span className="maker">{product.brand}</span>
                  <Link href={`/phones/${product.slug}`}><h3>{product.name}</h3></Link>
                  <div className="rating"><Star size={14} fill="currentColor"/> {product.rating} <span>• {product.os}</span></div>
                  <p className="price">{formatIQD(product.price)} {product.oldPrice && <span className="old">{formatIQD(product.oldPrice)}</span>}</p>
                  <div className="spec-row"><span className="chip">{product.ram} RAM</span><span className="chip">{product.storage[0]}</span><span className="chip">{product.stock} in stock</span></div>
                  <ProductActions productId={product.id} storage={product.storage[0]} color={product.colors[0]} compact/>
                </div>
              </article>
            ))}
          </div> : <div className="empty-state"><h2>No matching phones.</h2><p>Try widening the price range or clearing a filter.</p></div>}
        </div>
      </section>
    </main>
  );
}
