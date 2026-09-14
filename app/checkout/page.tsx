'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { demoProducts, formatIQD } from '@/lib/demo-data';
import { clearCart, getCart, type CartLine } from '@/lib/browser-commerce';

const governorates = ['Baghdad','Basra','Nineveh','Erbil','Sulaymaniyah','Duhok','Karbala','Najaf','Babil','Wasit','Diyala','Anbar','Kirkuk','Maysan','Dhi Qar','Muthanna','Qadisiyah','Salah al-Din'];

type OrderResult = { orderNumber: string; total: string; status: string };

function legacyProduct(line: CartLine) {
  return demoProducts.find(item => item.id === line.productId || item.slug === line.productId || item.slug === line.slug);
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => setCart(getCart()), []);

  const subtotal = useMemo(() => cart.reduce((sum, line) => {
    const product = legacyProduct(line);
    return sum + (line.price ?? product?.price ?? 0) * line.quantity;
  }, 0), [cart]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length) return;
    setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const payment = String(form.get('payment') || 'CASH_ON_DELIVERY');
    const fulfillment = payment === 'STORE_PICKUP' ? 'PICKUP' : 'DELIVERY';
    const items = cart.map(line => {
      const product = legacyProduct(line);
      const slug = line.slug || product?.slug || line.productId;
      return { slug, quantity: line.quantity, storage: line.storage, color: line.color };
    });

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: form.get('name'), phone: form.get('phone'), email: form.get('email'),
        governorate: form.get('governorate'), city: form.get('city'), address: form.get('address'),
        landmark: form.get('landmark'), notes: form.get('notes'), payment, fulfillment, items,
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || 'Unable to place the order.');
    clearCart(); setCart([]); setResult(data.order);
  }

  if (result) return (
    <main className="shell cart-page"><div className="empty-state cart-empty"><CheckCircle2 size={42}/><h1>Order received.</h1><p>Your reference is <strong>#{result.orderNumber}</strong>. Current status: <strong>{result.status}</strong>.</p><p>Total recorded: {formatIQD(Number(result.total))}</p><Link href="/account" className="pill primary">View account</Link><Link href="/shop" className="pill">Continue shopping</Link></div></main>
  );

  return (
    <main className="shell checkout-shell">
      <section className="checkout-card">
        <span className="eyebrow" style={{color:'var(--green-700)'}}>Secure checkout flow</span>
        <h1>Delivery details</h1>
        <form onSubmit={submit}>
          <div className="checkout-form">
            <label>Full name<input required name="name" autoComplete="name" placeholder="Customer name"/></label>
            <label>Phone number<input required name="phone" inputMode="tel" placeholder="07XX XXX XXXX"/></label>
            <label>Email<input name="email" type="email" autoComplete="email" placeholder="Optional email"/></label>
            <label>Governorate<select required name="governorate" defaultValue=""><option value="" disabled>Select governorate</option>{governorates.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>City / district<input required name="city" placeholder="City or district"/></label>
            <label>Nearest landmark<input name="landmark" placeholder="Optional landmark"/></label>
            <label className="full">Detailed address<textarea required name="address" placeholder="Street, neighborhood, building, floor..."/></label>
            <label className="full">Order notes<textarea name="notes" placeholder="Optional delivery notes"/></label>
          </div>
          <div className="payment-options">
            <label className="payment-option"><input type="radio" name="payment" value="CASH_ON_DELIVERY" defaultChecked/> <span><strong>Cash on Delivery</strong><br/>Pay when the order arrives.</span></label>
            <label className="payment-option"><input type="radio" name="payment" value="STORE_PICKUP"/> <span><strong>Store Pickup</strong><br/>Reserve and collect from a configured branch.</span></label>
          </div>
          <div className="checkout-notice">The visible subtotal is an estimate from the saved cart. The server re-checks the current PostgreSQL price and stock before creating the order. No card payment is simulated or claimed.</div>
          {error && <p className="form-error">{error}</p>}
          <button className="pill lime checkout-button" style={{marginTop:18}} disabled={!cart.length || loading}>{loading ? 'Placing order…' : 'Place order'}</button>
        </form>
      </section>
      <aside className="order-summary">
        <span className="maker">Checkout summary</span>
        <div><span>Items</span><strong>{cart.reduce((sum, line) => sum + line.quantity, 0)}</strong></div>
        <div><span>Subtotal estimate</span><strong>{formatIQD(subtotal)}</strong></div>
        <div><span>Delivery</span><span>Calculated by server</span></div>
        <div className="summary-total"><span>Estimated total</span><strong>{formatIQD(subtotal)}</strong></div>
        {!cart.length && <p>Your cart is empty. Add at least one device before submitting checkout.</p>}
      </aside>
    </main>
  );
}
