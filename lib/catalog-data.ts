import { prisma } from '@/lib/prisma';
import { demoProducts } from '@/lib/demo-data';

export type CatalogProduct = {
  id: string;
  brand: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  storage: string[];
  colors: string[];
  stock: number;
  badge?: string;
  rating: number;
  os: string;
  ram: string;
  display: string;
  battery: string;
  camera: string;
  connectivity: string[];
  description: string;
  highlights: string[];
};

function demoFallback(): CatalogProduct[] {
  return demoProducts.map(product => ({ ...product }));
}

function specValue(specs: { label: string; value: string }[], label: string, fallback: string) {
  return specs.find(spec => spec.label.toLowerCase() === label.toLowerCase())?.value || fallback;
}

export async function getCatalogProducts(slugs?: string[]): Promise<CatalogProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        published: true,
        ...(slugs?.length ? { slug: { in: slugs } } : {}),
      },
      include: {
        brand: true,
        variants: { orderBy: { price: 'asc' } },
        specs: { orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }] },
        reviews: { where: { approved: true }, select: { rating: true } },
      },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });

    if (!products.length) {
      const fallback = demoFallback();
      return slugs?.length ? fallback.filter(product => slugs.includes(product.slug) || slugs.includes(product.id)) : fallback;
    }

    return products.map(product => {
      const variants = product.variants;
      const first = variants[0];
      const rating = product.reviews.length
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      const storage = [...new Set(variants.map(variant => variant.storage))];
      const colors = [...new Set(variants.map(variant => variant.color))];
      const connectivity = [
        specValue(product.specs, '5G', 'Yes') === 'Yes' ? '5G' : '',
        specValue(product.specs, 'Wi-Fi', 'Wi-Fi'),
        specValue(product.specs, 'NFC', 'NFC'),
      ].filter(Boolean);
      const highlightCandidates = product.specs.slice(0, 4).map(spec => `${spec.label}: ${spec.value}`);

      return {
        id: product.id,
        brand: product.brand.name,
        name: product.name,
        slug: product.slug,
        price: first ? Number(first.price) : 0,
        oldPrice: first?.comparePrice ? Number(first.comparePrice) : undefined,
        storage: storage.length ? storage : ['Standard'],
        colors: colors.length ? colors : ['Default'],
        stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
        badge: product.featured ? 'Featured' : 'Smartphone',
        rating: Number(rating.toFixed(1)),
        os: specValue(product.specs, 'OS', 'Android'),
        ram: first?.ram || specValue(product.specs, 'RAM', 'Not specified'),
        display: specValue(product.specs, 'Screen', 'Not specified'),
        battery: specValue(product.specs, 'Capacity', 'Not specified'),
        camera: specValue(product.specs, 'System', 'Not specified'),
        connectivity,
        description: product.description,
        highlights: highlightCandidates.length ? highlightCandidates : ['Store-managed product', 'Database-backed inventory'],
      };
    });
  } catch {
    const fallback = demoFallback();
    return slugs?.length ? fallback.filter(product => slugs.includes(product.slug) || slugs.includes(product.id)) : fallback;
  }
}

export async function getCatalogProduct(slug: string) {
  const products = await getCatalogProducts([slug]);
  return products.find(product => product.slug === slug || product.id === slug) ?? null;
}
