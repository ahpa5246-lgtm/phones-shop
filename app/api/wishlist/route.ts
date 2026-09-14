import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ slug: z.string().min(1) });

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ items: [] }, { status: 401 });
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.userId },
    include: { product: { include: { brand: true, variants: { orderBy: { price: 'asc' }, take: 1 } } } },
    orderBy: { id: 'desc' },
  });
  return NextResponse.json({
    items: items.map(item => ({
      id: item.id,
      slug: item.product.slug,
      name: item.product.name,
      brand: item.product.brand.name,
      price: item.product.variants[0] ? Number(item.product.variants[0].price) : 0,
    }))
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in to save favorites.' }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
  const product = await prisma.product.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.userId, productId: product.id } },
    update: {},
    create: { userId: session.userId, productId: product.id },
  });
  return NextResponse.json({ saved: true });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid product.' }, { status: 400 });
  const product = await prisma.product.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (product) {
    await prisma.wishlistItem.deleteMany({ where: { userId: session.userId, productId: product.id } });
  }
  return NextResponse.json({ saved: false });
}
