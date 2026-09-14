import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const session = await requireAdmin();
  if (!session) redirect('/auth');

  const [products, orders, customers, inventory] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.inventory.aggregate({ _sum: { quantity: true } }),
  ]);

  const recentOrders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 });

  return (
    <main className="shell admin-page">
      <div className="admin-heading"><div><span className="eyebrow" style={{color:'var(--green-700)'}}>Store operations</span><h1>Admin dashboard</h1></div><div className="admin-links"><a href="/admin/products">Products</a><a href="/admin/orders">Orders</a><a href="/shop">View store</a></div></div>
      <section className="metric-grid">
        <article className="metric-card"><span>Products</span><strong>{products}</strong></article>
        <article className="metric-card"><span>Orders</span><strong>{orders}</strong></article>
        <article className="metric-card"><span>Customers</span><strong>{customers}</strong></article>
        <article className="metric-card"><span>Units in inventory</span><strong>{inventory._sum.quantity ?? 0}</strong></article>
      </section>
      <section className="panel admin-table-wrap"><div className="panel-title"><h2>Recent orders</h2><a href="/admin/orders">Manage all</a></div><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead><tbody>{recentOrders.map(order => <tr key={order.id}><td>#{order.orderNumber}</td><td>{order.customerName}</td><td>{order.status}</td><td>{order.total} IQD</td></tr>)}</tbody></table></section>
    </main>
  );
}
