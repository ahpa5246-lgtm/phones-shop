'use client';

import { useEffect } from 'react';

const KEY = 'nova-mobile-recent';

export default function RecentlyViewedTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      const current = raw ? JSON.parse(raw) as string[] : [];
      const next = [slug, ...current.filter(item => item !== slug)].slice(0, 8);
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Ignore unavailable or malformed local storage.
    }
  }, [slug]);
  return null;
}
