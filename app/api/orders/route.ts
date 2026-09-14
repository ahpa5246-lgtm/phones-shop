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
  items: z.array(z.object({ productId: z.string(), name: z.string(), quantity: z.number().int().min(1).max(20), unitPrice: z.number().int().min(0) })).min(1)
});

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Please check the checkout information.' }, { status: 400 });

  const session = await getSession();
  const subtotal = parsed.data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = parsed.data.fulfillment === 'PICKUP' ? 0 : 5000;
  const total = subtotal + deliveryFee;
  const orderNumber = `NOVA-${Date.now().toString().slice(-9)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.userId,
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      governorate: parsed.data.governorate,
      city: parsed.data.city,
      addressLine: parsed.data.address,
      landmark: parsed.data.landmark || null,
      notes: parsed.data.notes || null,
      paymentMethod: parsed.data.payment,
      fulfillmentMethod: parsed.data.fulfillment,
      subtotal,
      deliveryFee,
      total,
      status: 'PENDING',
      items: {
        create: parsed.data.items.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
        }))
      },
      statusHistory: { create: { status: 'PENDING', note: 'Order created from storefront checkout.' } }
    },
    select: { id: true, orderNumber: true, total: true, status: true }
  });

  return NextResponse.json({ order }, { status: 201 });
}
