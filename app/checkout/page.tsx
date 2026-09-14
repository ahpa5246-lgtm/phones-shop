'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { demoProducts, formatIQD } from '@/lib/demo-data';
import { getCart, type CartLine } from '@/lib/browser-commerce';

const governorates = ['Baghdad','Basra','Nineveh','Erbil','Sulaymaniyah','Duhok','Karbala','Najaf','Babil','Wasit','Diyala','Anbar','Kirkuk','Maysan','Dhi Qar','Muthanna','Qadisiyah','Salah al-Din'];

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => setCart(getCart()), []);

  const subtotal = useMemo(() => cart.reduce((sum, line) => {
    const product = demoProducts.find((item) => item.id === line.productId);
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0), [cart]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) return (
    <main className="shell cart-page"><div className="empty-state cart-empty"><CheckCircle2 size={42}/><h1>Demo order captured.</h1><p>No real order or payment was sent. The next backend phase will persist orders to PostgreSQL and generate status history.</p><Link href="/shop" className="pill primary">Return to shop</Link></div></main>
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
            <label className="payment-option"><input type="radio" name="payment" value="cod" defaultChecked/> <span><strong>Cash on Delivery</strong><br/>Pay when the order arrives.</span></label>
            <label className="payment-option"><input type="radio" name="payment" value="pickup"/> <span><strong>Store Pickup</strong><br/>Reserve and collect from a configured branch.</span></label>
          </div>
          <div className="checkout-notice">This is still demo commerce data. The form validates the customer journey but does not claim to process a real payment or create a production order yet.</div>
          <button className="pill lime checkout-button" style={{marginTop:18}} disabled={!cart.length}>Place demo order</button>
        </form>
      </section>
      <aside className="order-summary">
        <span className="maker">Checkout summary</span>
        <div><span>Items</span><strong>{cart.reduce((sum, line) => sum + line.quantity, 0)}</strong></div>
        <div><span>Subtotal</span><strong>{formatIQD(subtotal)}</strong></div>
        <div><span>Payment</span><span>COD / Pickup</span></div>
        <div className="summary-total"><span>Total</span><strong>{formatIQD(subtotal)}</strong></div>
        {!cart.length && <p>Your cart is empty. Add at least one device before submitting checkout.</p>}
      </aside>
    </main>
  );
}
