import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/auth');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { orders: { orderBy: { createdAt: 'desc' }, take: 8 } }
  });
  if (!user) redirect('/auth');

  return (
    <main className="shell account-page">
      <section className="account-hero">
        <span className="eyebrow" style={{color:'var(--green-700)'}}>Your account</span>
        <h1>Hello, {user.name || 'customer'}.</h1>
        <p className="section-sub">Manage your personal details and follow your most recent orders.</p>
      </section>
      <section className="account-grid">
        <article className="panel"><h2>Profile</h2><p><strong>Email</strong><br/>{user.email}</p><p><strong>Role</strong><br/>{user.role}</p></article>
        <article className="panel"><h2>Recent orders</h2>{user.orders.length ? user.orders.map(order => <div className="order-row" key={order.id}><span>#{order.orderNumber}</span><strong>{order.status}</strong><span>{order.total} IQD</span></div>) : <p className="section-sub">No orders yet. Orders created at checkout will appear here.</p>}</article>
      </section>
      {session.role === 'ADMIN' && <a className="pill primary" href="/admin">Open admin dashboard</a>}
    </main>
  );
}
