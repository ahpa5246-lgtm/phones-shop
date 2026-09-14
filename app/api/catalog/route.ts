import { NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/catalog-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugs = searchParams.get('slugs')?.split(',').map(value => value.trim()).filter(Boolean);
  const products = await getCatalogProducts(slugs);
  return NextResponse.json({ products });
}
