import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BatteryCharging, Camera, ChevronRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import ProductActions from '@/components/product-actions';
import { formatIQD } from '@/lib/demo-data';
import { getCatalogProducts } from '@/lib/catalog-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const catalog = await getCatalogProducts();
  const featured = catalog.slice(0, 3);
  const heroProduct = featured[0];
  const brands = Array.from(new Set(catalog.map(product => product.brand))).slice(0, 7);

  return (
    <main>
      <div className="promo-strip"><span>Free delivery messaging can be configured by the retailer</span><span className="promo-dot"/><span>Cash on delivery across Iraq</span><span className="promo-dot"/><span>Demo storefront</span></div>

      <section className="hero">
        <div className="shell hero-card">
          <div className="hero-grid-lines" aria-hidden="true"/>
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><i/> New generation mobile store</span>
            <h1>Smart tech.<br/><em>Better</em> choices.</h1>
            <p>A curated mobile experience designed to make discovering, comparing and buying your next phone feel effortless.</p>
            <div className="hero-ctas">
              <Link className="pill lime hero-primary" href="/shop">Explore phones <ArrowUpRight size={17}/></Link>
              <Link className="text-link" href="/compare">Compare models <ArrowRight size={17}/></Link>
            </div>
            <div className="hero-proof">
              <div><strong>{catalog.length || '06'}+</strong><span>curated models</span></div>
              <div><strong>IQD</strong><span>local pricing</span></div>
              <div><strong>24/7</strong><span>online browsing</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-halo"/>
            <div className="phone-shadow"/>
            <div className="phone premium-phone"><div className="phone-screen"><div className="screen-glow"/><span>NOVA</span></div><div className="camera-island"><i/><i/><i/></div></div>
            <div className="float-card fc-price"><small>Featured</small><strong>{heroProduct ? formatIQD(heroProduct.price) : 'Catalog ready'}</strong><span>{heroProduct?.name ?? 'Premium smartphones'}</span></div>
            <div className="float-card fc-rating"><span className="rating-star">★</span><div><strong>{heroProduct?.rating || '4.9'}</strong><span>customer rating</span></div></div>
            <div className="float-pill fc-stock"><i/> In stock</div>
          </div>
          <div className="hero-index">01</div>
        </div>
      </section>

      <section className="brand-rail shell" aria-label="Phone brands">
        <span className="brand-rail-label">Explore brands</span>
        <div className="brand-list">{(brands.length ? brands : ['Apple','Samsung','Xiaomi','HONOR','Google','OnePlus']).map(brand => <Link key={brand} href={`/shop?q=${encodeURIComponent(brand)}`}>{brand}</Link>)}</div>
        <Link className="round-arrow" href="/shop" aria-label="All brands"><ArrowUpRight size={18}/></Link>
      </section>

      <section className="section featured-section" id="featured">
        <div className="shell">
          <div className="section-head editorial-head">
            <div><span className="eyebrow dark">Handpicked for you</span><h2>Phones worth<br/>looking at.</h2></div>
            <div className="section-side"><p className="section-sub">Less noise, better choices. Browse a focused collection and compare what actually matters.</p><Link href="/shop" className="text-link dark-link">See all phones <ArrowUpRight size={16}/></Link></div>
          </div>
          <div className="products editorial-products">
            {featured.map((product, index) => (
              <article className={`product-card product-card-${index + 1}`} key={product.slug}>
                <Link href={`/phones/${product.slug}`} className="product-image">
                  <span className="badge">{product.badge || (index === 0 ? 'Editor pick' : 'Featured')}</span>
                  <span className="product-number">0{index + 1}</span>
                  <div className="mini-phone"><div className="mini-screen"/><div className="mini-cameras"><i/><i/><i/></div></div>
                  <span className="view-product">View <ArrowUpRight size={14}/></span>
                </Link>
                <div className="product-meta">
                  <div className="maker-row"><span className="maker">{product.brand}</span><span className="stock-dot"><i/>{product.stock > 0 ? 'Available' : 'Sold out'}</span></div>
                  <div className="product-title"><Link href={`/phones/${product.slug}`}><h3>{product.name}</h3></Link></div>
                  <p className="price">{formatIQD(product.price)} {product.oldPrice && <span className="old">{formatIQD(product.oldPrice)}</span>}</p>
                  <div className="spec-row">{product.storage.slice(0,2).map(storage => <span className="chip" key={storage}>{storage}</span>)}<span className="chip">{product.ram}</span></div>
                  <ProductActions productId={product.slug} slug={product.slug} name={product.name} brand={product.brand} price={product.price} storage={product.storage[0]} color={product.colors[0]} compact/>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section experience-section" id="finder">
        <div className="shell experience-grid">
          <div className="experience-visual">
            <span className="giant-number">03</span>
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
            <div className="finder-phone phone"><div className="phone-screen"><div className="screen-glow"/></div></div>
            <div className="feature-bubble bubble-camera"><Camera size={18}/><span><strong>Camera</strong>Compare lenses</span></div>
            <div className="feature-bubble bubble-battery"><BatteryCharging size={18}/><span><strong>Battery</strong>Find your fit</span></div>
          </div>
          <div className="experience-copy">
            <span className="eyebrow">Find your match</span>
            <h2>Not sure which<br/>phone is <em>yours?</em></h2>
            <p>Search, filter and place up to four models side by side. We surface the details so you can make the decision.</p>
            <div className="finder-steps">
              <Link href="/shop"><span>01</span><strong>Search & filter</strong><ChevronRight size={18}/></Link>
              <Link href="/compare"><span>02</span><strong>Compare specifications</strong><ChevronRight size={18}/></Link>
              <Link href="/checkout"><span>03</span><strong>Checkout your way</strong><ChevronRight size={18}/></Link>
            </div>
            <Link className="pill lime" href="/shop">Find my phone <Sparkles size={16}/></Link>
          </div>
        </div>
      </section>

      <section className="section trust-section" id="support">
        <div className="shell">
          <div className="trust-intro"><span className="eyebrow dark">Why NOVA</span><h2>Good technology.<br/><span>Without the friction.</span></h2></div>
          <div className="trust-grid">
            <article><span className="trust-icon"><ShieldCheck size={24}/></span><div><strong>Clear warranty</strong><p>Store policies presented clearly before purchase.</p></div><span className="trust-num">01</span></article>
            <article><span className="trust-icon"><Truck size={24}/></span><div><strong>Built for Iraq</strong><p>Governorates, local addresses, COD and pickup.</p></div><span className="trust-num">02</span></article>
            <article><span className="trust-icon"><Sparkles size={24}/></span><div><strong>Easy decisions</strong><p>Useful filters and comparison without clutter.</p></div><span className="trust-num">03</span></article>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-main"><div><Link className="footer-brand" href="/">NOVA<span>Mobile</span></Link><p>Technology, curated for real life.</p></div><div className="footer-links"><Link href="/shop">Shop</Link><Link href="/compare">Compare</Link><Link href="/account">Account</Link><Link href="/#support">Support</Link></div><Link className="footer-circle" href="/shop"><ArrowUpRight size={24}/></Link></div>
        <div className="shell footer-bottom"><span>Demo identity — replace with retailer details before launch.</span><span>Baghdad, Iraq</span></div>
      </footer>
    </main>
  );
}
