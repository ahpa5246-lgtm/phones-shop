'use client';

import { useState } from 'react';
import { Check, GitCompareArrows, ShoppingBag } from 'lucide-react';
import { addToCart, getCompareIds, toggleCompare } from '@/lib/browser-commerce';

type Props = {
  productId: string;
  storage?: string;
  color?: string;
  compact?: boolean;
};

export default function ProductActions({ productId, storage, color, compact = false }: Props) {
  const [added, setAdded] = useState(false);
  const [compared, setCompared] = useState(false);

  function handleAdd() {
    addToCart(productId, { storage, color });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleCompare() {
    const next = toggleCompare(productId);
    setCompared(next.includes(productId));
  }

  return (
    <div className={compact ? 'product-actions' : 'detail-actions'}>
      <button className="pill primary" type="button" onClick={handleAdd}>
        {added ? <Check size={16}/> : <ShoppingBag size={16}/>} {added ? 'Added' : 'Add to cart'}
      </button>
      <button className="pill" type="button" onClick={handleCompare} aria-pressed={compared}>
        <GitCompareArrows size={16}/> {compared || getCompareIds().includes(productId) ? 'Compared' : 'Compare'}
      </button>
    </div>
  );
}
