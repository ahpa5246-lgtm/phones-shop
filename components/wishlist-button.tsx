'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WishlistButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch('/api/wishlist')
      .then(response => response.ok ? response.json() : null)
      .then(data => setSaved(Boolean(data?.items?.some((item: { slug: string }) => item.slug === slug))))
      .catch(() => undefined);
  }, [slug]);

  async function toggle() {
    setBusy(true);
    const response = await fetch('/api/wishlist', {
      method: saved ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    setBusy(false);
    if (response.status === 401) {
      router.push('/auth');
      return;
    }
    if (response.ok) setSaved(!saved);
  }

  return <button type="button" className="pill wishlist-button" aria-pressed={saved} disabled={busy} onClick={toggle}><Heart size={16} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved' : 'Save'}</button>;
}
