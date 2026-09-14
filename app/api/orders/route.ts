import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const orderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  governorate: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  fulfillment: z.enum(['DELIVERY', 'PICKUP']),
  payment: z.enum(['CASH_ON_DELIVERY', 'STORE_PICKUP']),
  items: z.array(z.object({
    slug: z.string().min(1),
    quantity: z.number().int().min(1).max(20),
    storage: z.string().optional(),
    color: z.string().optional(),
  })).min(1)
});

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Please check the checkout information.' }, { status: 400 });

  const slugs = [...new Set(parsed.data.items.map(item => item.slug))];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, published: true },
    include: { variants: true },
  });

  const resolved = parsed.data.items.map(item => {
    const product = products.find(candidate => candidate.slug === item.slug);
    if (!product) return null;
    const variant = product.variants.find(candidate =>
      (!item.storage || candidate.storage === item.storage) && (!item.color || candidate.color === item.color)
    ) ?? product.variants[0];
    if (!variant || variant.stock < item.quantity) return null;
    return { item, product, variant, unitPrice: Number(variant.price) };
  });

  if (resolved.some(item => !item)) {
    return NextResponse.json({ error: 'One or more products are unavailable or out of stock.' }, { status: 409 });
  }

  const safeItems = resolved.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const subtotal = safeItems.reduce((sum, entry) => sum + entry.unitPrice * entry.item.quantity, 0);
  const shipping = parsed.data.fulfillment === 'PICKUP' ? 0 : 5000;
  const total = subtotal + shipping;
  const orderNumber = `NOVA-${Date.now().toString().slice(-9)}`;
  const session = await getSession();

  const order = await prisma.$transaction(async tx => {
    for (const entry of safeItems) {
      const result = await tx.productVariant.updateMany({
        where: { id: entry.variant.id, stock: { gte: entry.item.quantity } },
        data: { stock: { decrement: entry.item.quantity } },
      });
      if (result.count !== 1) throw new Error('STOCK_CHANGED');
    }

    return tx.order.create({
      data: {
        orderNumber,
        userId: session?.userId,
        customerName: parsed.data.customerName,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        governorate: parsed.data.governorate,
        city: parsed.data.city,
        address: parsed.data.address,
        landmark: parsed.data.landmark || null,
        notes: parsed.data.notes || null,
        paymentMethod: parsed.data.payment,
        fulfillmentMethod: parsed.data.fulfillment,
        subtotal,
        shipping,
        total,
        status: 'PENDING',
        items: {
          create: safeItems.map(entry => ({
            productId: entry.product.id,
            sku: entry.variant.sku,
            name: `${entry.product.name} — ${entry.variant.storage} / ${entry.variant.color}`,
            quantity: entry.item.quantity,
            unitPrice: entry.unitPrice,
          }))
        },
        history: { create: { status: 'PENDING', note: 'Order created from storefront checkout.' } }
      },
      select: { id: true, orderNumber: true, total: true, status: true }
    });
  }).catch(error => {
    if (error instanceof Error && error.message === 'STOCK_CHANGED') return null;
    throw error;
  });

  if (!order) return NextResponse.json({ error: 'Stock changed while placing your order. Please review the cart.' }, { status: 409 });
  return NextResponse.json({ order: { ...order, total: order.total.toString() } }, { status: 201 });
}
