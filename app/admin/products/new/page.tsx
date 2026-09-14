'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get('name'), brand: form.get('brand'), description: form.get('description'),
      price: Number(form.get('price')), comparePrice: form.get('comparePrice') ? Number(form.get('comparePrice')) : undefined,
      stock: Number(form.get('stock')), storage: form.get('storage'), color: form.get('color'), ram: form.get('ram'),
      sku: form.get('sku'), published: form.get('published') === 'on',
    };
    const response = await fetch('/api/admin/products', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    const data = await response.json(); setLoading(false);
    if (!response.ok) return setError(data.error || 'Could not create product.');
    router.push('/admin/products'); router.refresh();
  }

  return <main className="shell admin-page"><div className="admin-heading"><div><span className="eyebrow" style={{color:'var(--green-700)'}}>Catalog management</span><h1>Add product</h1></div><a className="pill" href="/admin/products">Back to products</a></div><section className="panel product-form-panel"><form className="checkout-form" onSubmit={submit}>
    <label>Product name<input required name="name" placeholder="Example Phone Pro"/></label>
    <label>Brand<input required name="brand" placeholder="Example Brand"/></label>
    <label>SKU<input required name="sku" placeholder="DEMO-BRAND-MODEL-256-BLK"/></label>
    <label>Price (IQD)<input required name="price" type="number" min="0" step="1"/></label>
    <label>Compare-at price (IQD)<input name="comparePrice" type="number" min="0" step="1"/></label>
    <label>Stock<input required name="stock" type="number" min="0" step="1" defaultValue="0"/></label>
    <label>Storage<input required name="storage" placeholder="256GB"/></label>
    <label>RAM<input name="ram" placeholder="12GB"/></label>
    <label>Color<input required name="color" placeholder="Black"/></label>
    <label className="full">Description<textarea required minLength={10} name="description" placeholder="Product description..."/></label>
    <label className="full checkbox-line"><input name="published" type="checkbox" defaultChecked/> Publish immediately</label>
    {error && <p className="form-error full">{error}</p>}
    <button className="pill primary" disabled={loading}>{loading ? 'Creating…' : 'Create product'}</button>
  </form></section></main>;
}
