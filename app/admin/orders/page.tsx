import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminOrderStatus } from '@/components/admin-order-status';

export default async function AdminOrdersPage() {
  const session = await requireAdmin();
  if (!session) redirect('/auth');

  const orders = await prisma.order.findMany({
    include: { items: true, history: { orderBy: { createdAt: 'desc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <main className="shell admin-page">
      <div className="admin-heading"><div><span className="eyebrow" style={{color:'var(--green-700)'}}>Order operations</span><h1>Orders</h1></div><div className="admin-links"><a href="/admin/products">Products</a><a href="/admin">Dashboard</a></div></div>
      <section className="panel admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Location</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>{orders.map(order => <tr key={order.id}>
            <td><strong>#{order.orderNumber}</strong><br/><small>{order.createdAt.toLocaleString()}</small></td>
            <td>{order.customerName}<br/><small>{order.phone}</small></td>
            <td>{order.governorate}<br/><small>{order.city}</small></td>
            <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
            <td>{order.total.toString()} IQD</td>
            <td><AdminOrderStatus orderId={order.id} current={order.status}/></td>
          </tr>)}</tbody>
        </table>
        {!orders.length && <p className="section-sub">No orders have been created yet.</p>}
      </section>
    </main>
  );
}
