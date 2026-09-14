import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phones = await prisma.category.upsert({ where: { slug: 'smartphones' }, update: {}, create: { name: 'Smartphones', slug: 'smartphones' } });

  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'apple' }, update: {}, create: { name: 'Apple', slug: 'apple' } }),
    prisma.brand.upsert({ where: { slug: 'samsung' }, update: {}, create: { name: 'Samsung', slug: 'samsung' } }),
    prisma.brand.upsert({ where: { slug: 'xiaomi' }, update: {}, create: { name: 'Xiaomi', slug: 'xiaomi' } })
  ]);

  const samples = [
    { brand: brands[0], name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', price: 1890000, color: 'Black Titanium', storage: '256GB', sku: 'DEMO-APL-16PM-256-BLK' },
    { brand: brands[1], name: 'Galaxy S26 Ultra', slug: 'galaxy-s26-ultra', price: 1725000, color: 'Titanium Gray', storage: '256GB', sku: 'DEMO-SAM-S26U-256-GRY' },
    { brand: brands[2], name: 'Xiaomi 16 Pro', slug: 'xiaomi-16-pro', price: 1095000, color: 'Forest Green', storage: '256GB', sku: 'DEMO-XIA-16P-256-GRN' }
  ];

  for (const sample of samples) {
    await prisma.product.upsert({
      where: { slug: sample.slug },
      update: {},
      create: {
        name: sample.name,
        slug: sample.slug,
        description: 'Demonstration product data. Replace this description, pricing, imagery and specifications before production launch.',
        featured: true,
        brandId: sample.brand.id,
        categoryId: phones.id,
        variants: { create: [{ sku: sample.sku, color: sample.color, storage: sample.storage, price: sample.price, stock: 10 }] },
        specs: { create: [
          { group: 'General', label: 'Condition', value: 'New' },
          { group: 'Warranty', label: 'Coverage', value: 'Demo warranty policy — replace later' },
          { group: 'Network', label: '5G', value: 'Yes' }
        ] }
      }
    });
  }

  await prisma.homepageSection.upsert({
    where: { key: 'hero' },
    update: {},
    create: {
      key: 'hero',
      title: 'Find the phone that fits your life.',
      subtitle: 'Demo homepage content. Editable through the future admin CMS.',
      enabled: true
    }
  });
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
