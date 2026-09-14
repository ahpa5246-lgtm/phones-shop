import Link from 'next/link';
import { ArrowUpRight, Search, ShieldCheck, Truck } from 'lucide-react';
import ProductActions from '@/components/product-actions';
import { demoProducts, formatIQD } from '@/lib/demo-data';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-card">
          <div className="lime-orb"/>
          <div className="hero-copy">
            <span className="eyebrow">Premium mobile technology</span>
            <h1>Find the phone that fits your life.</h1>
            <p>Explore flagship smartphones, trusted warranty, flexible storage options and curated accessories in one premium shopping experience.</p>
            <div className="hero-ctas">
              <Link className="pill lime" href="/shop">Shop Phones <ArrowUpRight size={17}/></Link>
              <Link className="pill" href="/shop">Explore Offers</Link>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="phone-stage"><div className="phone"/></div>
            <div className="float-card fc-price"><strong>From 980,000 IQD</strong><span>Demo pricing • editable later</span></div>
            <div className="float-card fc-warranty"><strong>Warranty-ready</strong><span>Configurable store policy</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="shell">
          <div className="section-head">
            <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Curated selection</span><h2>Featured phones</h2></div>
            <div><p className="section-sub">The products, prices and availability remain demo data so the company can replace them later without redesigning the interface.</p><Link href="/shop" className="pill">View full catalog <ArrowUpRight size={16}/></Link></div>
          </div>
          <div className="products">
            {demoProducts.slice(0,3).map((product) => (
              <article className="product-card" key={product.id}>
                <Link href={`/phones/${product.slug}`} className="product-image">
                  <span className="badge">{product.badge}</span>
                  <div className="mini-phone" aria-label={`${product.name} placeholder product visual`}/>
                </Link>
                <div className="product-meta">
                  <span className="maker">{product.brand}</span>
                  <div className="product-title"><Link href={`/phones/${product.slug}`}><h3>{product.name}</h3></Link></div>
                  <p className="price">{formatIQD(product.price)} {product.oldPrice && <span className="old"> {formatIQD(product.oldPrice)}</span>}</p>
                  <div className="spec-row">
                    {product.storage.slice(0,2).map(storage => <span className="chip" key={storage}>{storage}</span>)}
                    <span className="chip">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                  </div>
                  <ProductActions productId={product.id} storage={product.storage[0]} color={product.colors[0]} compact/>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="finder">
        <div className="shell dark-band">
          <div>
            <span className="eyebrow">Signature experience</span>
            <h2>Find your perfect phone.</h2>
            <p className="section-sub" style={{color:'#c5d5cf'}}>Use the live catalog filters now, while a richer guided recommendation flow can be layered on top later.</p>
            <div className="stats">
              <div className="stat"><strong>4</strong><span>phones max in comparison</span></div>
              <div className="stat"><strong>IQD</strong><span>native Iraqi pricing</span></div>
              <div className="stat"><strong>Local</strong><span>cart persistence on this device</span></div>
            </div>
          </div>
          <div className="finder-list">
            <div className="finder-item"><strong>01. Search</strong><span>Name • Brand • Storage</span></div>
            <div className="finder-item"><strong>02. Filter</strong><span>Brand • OS • Budget</span></div>
            <div className="finder-item"><strong>03. Compare</strong><span>Specs side-by-side</span></div>
            <div className="finder-item"><strong>04. Checkout</strong><span>COD • Store Pickup</span></div>
            <Link className="pill lime" href="/shop">Start finding a phone <ArrowUpRight size={17}/></Link>
          </div>
        </div>
      </section>

      <section className="section" id="support">
        <div className="shell">
          <div className="section-head"><div><span className="eyebrow" style={{color:'var(--green-700)'}}>Built for trust</span><h2>More than a catalog.</h2></div></div>
          <div className="products">
            <article className="product-card"><ShieldCheck size={28}/><h3>Warranty-ready</h3><p className="section-sub">Warranty details are modeled as configurable commercial data rather than hard-coded claims.</p></article>
            <article className="product-card"><Truck size={28}/><h3>Iraq checkout</h3><p className="section-sub">Governorate, city, detailed address, landmark, notes, Cash on Delivery and Store Pickup are represented in the customer flow.</p></article>
            <article className="product-card"><Search size={28}/><h3>Real discovery flow</h3><p className="section-sub">Search, filtering, comparison and persistent cart behavior now connect the storefront pages.</p></article>
          </div>
        </div>
      </section>

      <footer className="shell footer"><strong>NOVA Mobile</strong><span>Demo company identity and commercial data — replace before production launch.</span></footer>
    </main>
  );
}
