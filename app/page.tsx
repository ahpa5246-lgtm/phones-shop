import { Heart, Search, ShoppingBag, User, ArrowUpRight, ShieldCheck, Truck } from 'lucide-react';
import { demoProducts, formatIQD } from '@/lib/demo-data';

export default function HomePage() {
  return (
    <main>
      <header className="nav">
        <div className="shell nav-inner">
          <a className="brand" href="#">NOVA<span>Mobile</span></a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#featured">Shop</a>
            <a href="#featured">Smartphones</a>
            <a href="#brands">Brands</a>
            <a href="#finder">Find a Phone</a>
            <a href="#support">Support</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" aria-label="Search"><Search size={17}/><span className="label">Search</span></button>
            <button className="icon-btn" aria-label="Favorites"><Heart size={17}/></button>
            <button className="icon-btn" aria-label="Account"><User size={17}/></button>
            <button className="icon-btn" aria-label="Cart"><ShoppingBag size={17}/></button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="shell hero-card">
          <div className="lime-orb"/>
          <div className="hero-copy">
            <span className="eyebrow">Premium mobile technology</span>
            <h1>Find the phone that fits your life.</h1>
            <p>Explore flagship smartphones, trusted warranty, flexible storage options and curated accessories in one premium shopping experience.</p>
            <div className="hero-ctas">
              <a className="pill lime" href="#featured">Shop Phones <ArrowUpRight size={17}/></a>
              <a className="pill" href="#featured">Explore Offers</a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="phone-stage"><div className="phone"/></div>
            <div className="float-card fc-price"><strong>From 1,095,000 IQD</strong><span>Demo pricing • editable later</span></div>
            <div className="float-card fc-warranty"><strong>1 Year Warranty</strong><span>Configurable store policy</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="featured">
        <div className="shell">
          <div className="section-head">
            <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Curated selection</span><h2>Featured phones</h2></div>
            <p className="section-sub">The initial products, prices and availability are intentionally demo data. They are structured so the company can replace them later without redesigning the interface.</p>
          </div>
          <div className="products">
            {demoProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <span className="badge">{product.badge}</span>
                  <div className="mini-phone" aria-label={`${product.name} placeholder product visual`}/>
                </div>
                <div className="product-meta">
                  <span className="maker">{product.brand}</span>
                  <div className="product-title">
                    <h3>{product.name}</h3>
                    <button className="icon-btn" aria-label={`Save ${product.name}`}><Heart size={16}/></button>
                  </div>
                  <p className="price">{formatIQD(product.price)} {product.oldPrice && <span className="old"> {formatIQD(product.oldPrice)}</span>}</p>
                  <div className="spec-row">
                    {product.storage.slice(0,2).map(storage => <span className="chip" key={storage}>{storage}</span>)}
                    <span className="chip">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                  </div>
                  <div className="product-actions">
                    <button className="pill primary">Add to cart</button>
                    <button className="pill" aria-label={`Compare ${product.name}`}>Compare</button>
                  </div>
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
            <p className="section-sub" style={{color:'#c5d5cf'}}>A guided decision flow will match customers to suitable devices by budget, camera, gaming, battery, business use, operating system and storage.</p>
            <div className="stats">
              <div className="stat"><strong>3–4</strong><span>phones side-by-side comparison</span></div>
              <div className="stat"><strong>IQD</strong><span>native Iraqi pricing support</span></div>
              <div className="stat"><strong>AR/EN</strong><span>bilingual architecture planned</span></div>
            </div>
          </div>
          <div className="finder-list">
            <div className="finder-item"><strong>01. Set your budget</strong><span>Price range</span></div>
            <div className="finder-item"><strong>02. Choose priorities</strong><span>Camera • Gaming • Battery</span></div>
            <div className="finder-item"><strong>03. Pick preferences</strong><span>Brand • OS • Storage</span></div>
            <div className="finder-item"><strong>04. Compare matches</strong><span>Clear differences</span></div>
            <button className="pill lime">Start phone finder <ArrowUpRight size={17}/></button>
          </div>
        </div>
      </section>

      <section className="section" id="support">
        <div className="shell">
          <div className="section-head">
            <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Built for trust</span><h2>More than a catalog.</h2></div>
          </div>
          <div className="products">
            <article className="product-card"><ShieldCheck size={28}/><h3>Warranty-ready</h3><p className="section-sub">Warranty details are modeled as configurable commercial data rather than hard-coded claims.</p></article>
            <article className="product-card"><Truck size={28}/><h3>Order tracking</h3><p className="section-sub">The architecture includes status history for pending, confirmed, processing, shipped, delivered and returned orders.</p></article>
            <article className="product-card"><Search size={28}/><h3>Smart discovery</h3><p className="section-sub">Search, filtering, comparison, wishlist and recently viewed experiences are part of the planned commerce layer.</p></article>
          </div>
        </div>
      </section>

      <footer className="shell footer">
        <strong>NOVA Mobile</strong>
        <span>Demo company identity and commercial data — replace before production launch.</span>
      </footer>
    </main>
  );
}
