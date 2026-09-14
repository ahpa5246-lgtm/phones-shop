'use client';

import Link from 'next/link';
import { GitCompareArrows, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCart, getCompareIds } from '@/lib/browser-commerce';

export default function SiteHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      setCartCount(getCart().reduce((sum, line) => sum + line.quantity, 0));
      setCompareCount(getCompareIds().length);
    };
    sync();
    window.addEventListener('nova-commerce-change', sync);
    return () => window.removeEventListener('nova-commerce-change', sync);
  }, []);

  return (
    <header className="nav">
      <div className="shell nav-inner">
        <Link className="brand" href="/">NOVA<span>Mobile</span></Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/shop">Shop</Link>
          <Link href="/shop">Smartphones</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/#finder">Find a Phone</Link>
          <Link href="/#support">Support</Link>
        </nav>
        <div className="nav-actions">
          <Link className="icon-btn" href="/shop" aria-label="Search"><Search size={17}/><span className="label">Search</span></Link>
          <Link className="icon-btn counter-btn" href="/compare" aria-label="Compare"><GitCompareArrows size={17}/>{compareCount > 0 && <span className="count-badge">{compareCount}</span>}</Link>
          <Link className="icon-btn" href="/account" aria-label="Account"><User size={17}/></Link>
          <Link className="icon-btn counter-btn" href="/cart" aria-label="Cart"><ShoppingBag size={17}/>{cartCount > 0 && <span className="count-badge">{cartCount}</span>}</Link>
        </div>
      </div>
    </header>
  );
}
