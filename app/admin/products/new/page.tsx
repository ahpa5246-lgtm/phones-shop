import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { NewProductForm } from '@/components/new-product-form';

export default async function NewProductPage() {
  const session = await requireAdmin();
  if (!session) redirect('/auth');

  return <main className="shell admin-page"><div className="admin-heading"><div><span className="eyebrow" style={{color:'var(--green-700)'}}>Catalog management</span><h1>Add product</h1></div><a className="pill" href="/admin/products">Back to products</a></div><NewProductForm/></main>;
}
