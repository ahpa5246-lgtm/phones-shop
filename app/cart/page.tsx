'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { demoProducts, formatIQD } from '@/lib/demo-data';
import { getCart, removeCartLine, setCartQuantity, type CartLine } from '@/lib/browser-commerce';

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    const sync = () => setCart(getCart());
    sync();
    window.addEventListener('nova-commerce-change', sync);
    return () => window.removeEventListener('nova-commerce-change', sync);
  }, []);

  const lines = useMemo(() => cart.map((line, index) => ({
    line,
    index,
    product: demoProducts.find((product) => product.id === line.productId)
  })).filter((entry) => entry.product), [cart]);

  const subtotal = lines.reduce((sum, entry) => sum + (entry.product?.price ?? 0) * entry.line.quantity, 0);

  return (
    <main className="shell cart-page">
      <div className="cart-heading">
        <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Your bag</span><h1>Shopping cart</h1></div>
        <Link href="/shop" className="pill">Continue shopping</Link>
      </div>

      {!lines.length ? (
        <div className="empty-state cart-empty"><ShoppingBag size={38}/><h2>Your cart is empty.</h2><p>Add a phone from the catalog and it will stay saved on this device.</p><Link className="pill primary" href="/shop">Browse smartphones</Link></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {lines.map(({ line, product, index }) => product && (
              <article className="cart-line" key={`${product.id}-${index}`}>
                <Link href={`/phones/${product.slug}`} className="cart-thumb"><div className="mini-phone"/></Link>
                <div className="cart-info">
                  <span className="maker">{product.brand}</span>
                  <Link href={`/phones/${product.slug}`}><h2>{product.name}</h2></Link>
                  <p>{line.storage ?? product.storage[0]} • {line.color ?? product.colors[0]}</p>
                  <strong>{formatIQD(product.price)}</strong>
                </div>
                <div className="quantity-control">
                  <button aria-label="Decrease quantity" onClick={() => setCart(setCartQuantity(index, line.quantity - 1))}><Minus size={15}/></button>
                  <span>{line.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => setCart(setCartQuantity(index, line.quantity + 1))}><Plus size={15}/></button>
                </div>
                <button className="icon-btn" aria-label={`Remove ${product.name}`} onClick={() => setCart(removeCartLine(index))}><Trash2 size={17}/></button>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <span className="maker">Order summary</span>
            <div><span>Subtotal</span><strong>{formatIQD(subtotal)}</strong></div>
            <div><span>Delivery</span><span>Calculated at checkout</span></div>
            <div className="summary-total"><span>Total</span><strong>{formatIQD(subtotal)}</strong></div>
            <Link href="/checkout" className="pill lime checkout-button">Proceed to checkout</Link>
            <p>Cash on Delivery / Store Pickup will be supported first. No fake card payment is presented.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
