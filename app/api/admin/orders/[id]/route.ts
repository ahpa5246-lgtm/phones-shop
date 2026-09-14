import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  status: z.enum(['PENDING','CONFIRMED','PROCESSING','READY_FOR_DELIVERY','SHIPPED','DELIVERED','CANCELLED','RETURNED']),
  note: z.string().max(240).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid order status.' }, { status: 400 });
  const { id } = await context.params;

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      history: { create: { status: parsed.data.status, note: parsed.data.note || `Status changed to ${parsed.data.status}.` } },
    },
    select: { id: true, orderNumber: true, status: true },
  }).catch(() => null);

  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json({ order });
}
