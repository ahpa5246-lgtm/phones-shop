import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Star, Truck } from 'lucide-react';
import ProductActions from '@/components/product-actions';
import { demoProducts, formatIQD, getProductBySlug } from '@/lib/demo-data';

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main>
      <section className="shell product-detail">
        <div className="detail-gallery">
          <span className="badge">{product.badge ?? 'Smartphone'}</span>
          <div className="detail-phone" aria-label={`${product.name} demo product visual`}/>
          <div className="gallery-note">Demo product visual • replace with real company photography later</div>
        </div>
        <div className="detail-copy">
          <Link href="/shop" className="maker">← Back to smartphones</Link>
          <span className="maker">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="rating"><Star size={16} fill="currentColor"/> {product.rating} <span>Demo rating</span></div>
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">{formatIQD(product.price)} {product.oldPrice && <span className="old">{formatIQD(product.oldPrice)}</span>}</p>
          <div className="variant-block"><strong>Storage</strong><div className="spec-row">{product.storage.map((item) => <span className="chip option-chip" key={item}>{item}</span>)}</div></div>
          <div className="variant-block"><strong>Colors</strong><div className="spec-row">{product.colors.map((item) => <span className="chip option-chip" key={item}>{item}</span>)}</div></div>
          <ProductActions productId={product.id} storage={product.storage[0]} color={product.colors[0]}/>
          <div className="purchase-trust">
            <div><CheckCircle2 size={18}/><span><strong>{product.stock} demo units</strong> currently available</span></div>
            <div><ShieldCheck size={18}/><span>Warranty policy is configurable by the store</span></div>
            <div><Truck size={18}/><span>Delivery flow prepared for Iraqi governorates</span></div>
          </div>
        </div>
      </section>

      <section className="shell specs-section">
        <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Technical details</span><h2>Specifications at a glance.</h2></div>
        <div className="spec-table">
          <div><span>Operating system</span><strong>{product.os}</strong></div>
          <div><span>Memory</span><strong>{product.ram}</strong></div>
          <div><span>Display</span><strong>{product.display}</strong></div>
          <div><span>Battery</span><strong>{product.battery}</strong></div>
          <div><span>Camera</span><strong>{product.camera}</strong></div>
          <div><span>Connectivity</span><strong>{product.connectivity.join(' • ')}</strong></div>
        </div>
        <div className="highlight-grid">{product.highlights.map((item) => <div key={item}><CheckCircle2 size={18}/><strong>{item}</strong></div>)}</div>
      </section>
    </main>
  );
}
