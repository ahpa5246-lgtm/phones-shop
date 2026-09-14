'use client';

import Link from 'next/link';
import { GitCompareArrows, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCart, getCompareIds } from '@/lib/browser-commerce';

export default function SiteHeader() {
  const [cartCount, setCartCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [open, setOpen] = useState(false);

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
        <Link className="brand" href="/" onClick={() => setOpen(false)}>NOVA<span>Mobile</span><i/></Link>
        <nav className={`nav-links ${open ? 'nav-open' : ''}`} aria-label="Primary navigation">
          <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/shop" onClick={() => setOpen(false)}>Smartphones</Link>
          <Link href="/compare" onClick={() => setOpen(false)}>Compare</Link>
          <Link href="/#finder" onClick={() => setOpen(false)}>Find a phone</Link>
          <Link href="/#support" onClick={() => setOpen(false)}>Support</Link>
        </nav>
        <div className="nav-actions">
          <Link className="icon-btn search-action" href="/shop" aria-label="Search"><Search size={17}/><span className="label">Search</span></Link>
          <Link className="icon-btn counter-btn desktop-action" href="/compare" aria-label="Compare"><GitCompareArrows size={17}/>{compareCount > 0 && <span className="count-badge">{compareCount}</span>}</Link>
          <Link className="icon-btn desktop-action" href="/account" aria-label="Account"><User size={17}/></Link>
          <Link className="icon-btn counter-btn cart-action" href="/cart" aria-label="Cart"><ShoppingBag size={17}/>{cartCount > 0 && <span className="count-badge">{cartCount}</span>}</Link>
          <button className="icon-btn menu-action" onClick={() => setOpen(value => !value)} aria-label="Toggle menu" aria-expanded={open}><Menu size={18}/></button>
        </div>
      </div>
    </header>
  );
}
