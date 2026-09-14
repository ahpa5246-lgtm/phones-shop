import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(2).max(120),
  brand: z.string().min(1).max(80),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().int().min(0),
  comparePrice: z.coerce.number().int().min(0).optional(),
  stock: z.coerce.number().int().min(0).max(100000),
  storage: z.string().min(1).max(30),
  color: z.string().min(1).max(50),
  ram: z.string().max(30).optional(),
  sku: z.string().min(3).max(80),
  published: z.boolean().default(true),
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Please check the product information.' }, { status: 400 });

  const slug = slugify(parsed.data.name);
  if (!slug) return NextResponse.json({ error: 'Product name must contain Latin letters or numbers for the demo slug.' }, { status: 400 });
  const brandSlug = slugify(parsed.data.brand);

  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: 'A product with this name already exists.' }, { status: 409 });

  const [brand, category] = await Promise.all([
    prisma.brand.upsert({ where: { slug: brandSlug }, update: { name: parsed.data.brand }, create: { name: parsed.data.brand, slug: brandSlug } }),
    prisma.category.upsert({ where: { slug: 'smartphones' }, update: {}, create: { name: 'Smartphones', slug: 'smartphones' } }),
  ]);

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      brandId: brand.id,
      categoryId: category.id,
      published: parsed.data.published,
      variants: { create: {
        sku: parsed.data.sku,
        price: parsed.data.price,
        comparePrice: parsed.data.comparePrice || null,
        stock: parsed.data.stock,
        storage: parsed.data.storage,
        color: parsed.data.color,
        ram: parsed.data.ram || null,
      } },
    },
    select: { id: true, name: true, slug: true },
  }).catch(() => null);

  if (!product) return NextResponse.json({ error: 'Could not create product. Check SKU uniqueness.' }, { status: 409 });
  return NextResponse.json({ product }, { status: 201 });
}
