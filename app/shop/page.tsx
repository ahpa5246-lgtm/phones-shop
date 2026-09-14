import CatalogClient from '@/components/catalog-client';
import { getCatalogProducts } from '@/lib/catalog-data';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getCatalogProducts();

  return (
    <main>
      <section className="catalog-hero">
        <div className="shell">
          <span className="eyebrow" style={{color:'var(--green-700)'}}>Smartphone catalog</span>
          <h1>Choose with clarity.</h1>
          <p>Search and filter the live catalog by brand, operating system and price. When PostgreSQL is not configured during development, the store safely falls back to demonstration catalog data.</p>
        </div>
      </section>
      <CatalogClient initialProducts={products}/>
    </main>
  );
}
