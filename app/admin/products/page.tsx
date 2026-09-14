import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminProductsPage() {
  const session = await requireAdmin();
  if (!session) redirect('/auth');
  const products = await prisma.product.findMany({ include: { brand: true, variants: true }, orderBy: { createdAt: 'desc' } });

  return <main className="shell admin-page"><div className="admin-heading"><div><span className="eyebrow" style={{color:'var(--green-700)'}}>Catalog management</span><h1>Products</h1></div><div className="admin-links"><a href="/admin/products/new">Add product</a><a href="/admin">Dashboard</a></div></div><section className="panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Brand</th><th>Variants</th><th>Stock</th><th>Status</th></tr></thead><tbody>{products.map(product => <tr key={product.id}><td><strong>{product.name}</strong><br/><small>{product.slug}</small></td><td>{product.brand.name}</td><td>{product.variants.length}</td><td>{product.variants.reduce((sum, variant) => sum + variant.stock, 0)}</td><td>{product.published ? 'Published' : 'Draft'}</td></tr>)}</tbody></table></section></main>;
}
