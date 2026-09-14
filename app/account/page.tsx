import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import RecentlyViewedList from '@/components/recently-viewed-list';
import LogoutButton from '@/components/logout-button';

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/auth');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      orders: { orderBy: { createdAt: 'desc' }, take: 8 },
      wishlist: {
        include: { product: { include: { brand: true, variants: { orderBy: { price: 'asc' }, take: 1 } } } },
        take: 8,
      },
    }
  });
  if (!user) redirect('/auth');

  return (
    <main className="shell account-page">
      <section className="account-hero">
        <div><span className="eyebrow" style={{color:'var(--green-700)'}}>Your account</span><h1>Hello, {user.name || 'customer'}.</h1><p className="section-sub">Manage your personal details, saved phones and most recent orders.</p></div>
        <LogoutButton/>
      </section>
      <section className="account-grid">
        <article className="panel"><h2>Profile</h2><p><strong>Email</strong><br/>{user.email}</p><p><strong>Role</strong><br/>{user.role}</p></article>
        <article className="panel"><h2>Recent orders</h2>{user.orders.length ? user.orders.map(order => <div className="order-row" key={order.id}><span>#{order.orderNumber}</span><strong>{order.status}</strong><span>{order.total.toString()} IQD</span></div>) : <p className="section-sub">No orders yet. Orders created at checkout will appear here.</p>}</article>
      </section>
      <section className="panel saved-panel">
        <div className="panel-title"><h2>Saved phones</h2><Link href="/shop">Browse catalog</Link></div>
        {user.wishlist.length ? <div className="saved-grid">{user.wishlist.map(item => <Link className="saved-item" key={item.id} href={`/phones/${item.product.slug}`}><span className="maker">{item.product.brand.name}</span><strong>{item.product.name}</strong><span>{item.product.variants[0]?.price.toString() ?? '0'} IQD</span></Link>)}</div> : <p className="section-sub">You have not saved any phones yet. Use the Save button on a product page.</p>}
      </section>
      <section className="panel saved-panel"><div className="panel-title"><h2>Recently viewed</h2><Link href="/shop">See all phones</Link></div><RecentlyViewedList/></section>
      <div className="account-actions">{session.role === 'ADMIN' && <a className="pill primary" href="/admin">Open admin dashboard</a>}</div>
    </main>
  );
}
