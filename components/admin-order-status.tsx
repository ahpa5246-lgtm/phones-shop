'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const statuses = ['PENDING','CONFIRMED','PROCESSING','READY_FOR_DELIVERY','SHIPPED','DELIVERED','CANCELLED','RETURNED'] as const;

export function AdminOrderStatus({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [busy, setBusy] = useState(false);

  async function save(next: string) {
    setValue(next); setBusy(true);
    const response = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next })
    });
    setBusy(false);
    if (!response.ok) return alert('Could not update the order status.');
    router.refresh();
  }

  return <select className="status-select" value={value} disabled={busy} onChange={(event) => save(event.target.value)}>{statuses.map(status => <option key={status} value={status}>{status.replaceAll('_',' ')}</option>)}</select>;
}
