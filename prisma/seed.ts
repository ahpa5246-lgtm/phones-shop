import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/password';

const prisma = new PrismaClient();

async function main() {
  const phones = await prisma.category.upsert({ where: { slug: 'smartphones' }, update: {}, create: { name: 'Smartphones', slug: 'smartphones' } });

  const brandNames = ['Apple', 'Samsung', 'Xiaomi', 'HONOR', 'Google', 'OnePlus'];
  const brands = new Map<string, { id: string }>();
  for (const name of brandNames) {
    const slug = name.toLowerCase();
    const brand = await prisma.brand.upsert({ where: { slug }, update: { name }, create: { name, slug } });
    brands.set(name, brand);
  }

  const samples = [
    { brand: 'Apple', name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', price: 1890000, comparePrice: 1990000, color: 'Black Titanium', storage: '256GB', ram: '8GB', stock: 8, sku: 'DEMO-APL-16PM-256-BLK', os:'iOS', display:'6.9-inch OLED', battery:'All-day battery', camera:'48MP Pro camera system' },
    { brand: 'Samsung', name: 'Galaxy S26 Ultra', slug: 'galaxy-s26-ultra', price: 1725000, comparePrice: 1810000, color: 'Titanium Gray', storage: '256GB', ram: '12GB', stock: 12, sku: 'DEMO-SAM-S26U-256-GRY', os:'Android', display:'6.9-inch AMOLED', battery:'5000mAh', camera:'200MP multi-camera system' },
    { brand: 'Xiaomi', name: 'Xiaomi 16 Pro', slug: 'xiaomi-16-pro', price: 1095000, color: 'Forest Green', storage: '256GB', ram: '12GB', stock: 5, sku: 'DEMO-XIA-16P-256-GRN', os:'Android', display:'6.7-inch OLED', battery:'5200mAh', camera:'50MP triple camera' },
    { brand: 'HONOR', name: 'HONOR Magic 8 Pro', slug: 'honor-magic-8-pro', price: 1260000, comparePrice: 1325000, color: 'Emerald', storage: '256GB', ram: '12GB', stock: 9, sku: 'DEMO-HON-M8P-256-EMR', os:'Android', display:'6.8-inch OLED', battery:'5100mAh', camera:'50MP AI camera system' },
    { brand: 'Google', name: 'Pixel 11 Pro', slug: 'pixel-11-pro', price: 1395000, color: 'Obsidian', storage: '128GB', ram: '12GB', stock: 7, sku: 'DEMO-GOO-P11P-128-OBS', os:'Android', display:'6.7-inch OLED', battery:'5000mAh', camera:'Pro computational camera' },
    { brand: 'OnePlus', name: 'OnePlus 15', slug: 'oneplus-15', price: 980000, color: 'Midnight', storage: '256GB', ram: '16GB', stock: 14, sku: 'DEMO-ONE-15-256-MID', os:'Android', display:'6.78-inch AMOLED', battery:'5400mAh', camera:'50MP triple camera' },
  ];

  for (const sample of samples) {
    const brand = brands.get(sample.brand);
    if (!brand) continue;
    await prisma.product.upsert({
      where: { slug: sample.slug },
      update: { name: sample.name, brandId: brand.id, categoryId: phones.id, published: true },
      create: {
        name: sample.name,
        slug: sample.slug,
        description: 'Demonstration product data. Replace this description, pricing, imagery and specifications before production launch.',
        featured: true,
        brandId: brand.id,
        categoryId: phones.id,
        variants: { create: [{ sku: sample.sku, color: sample.color, storage: sample.storage, ram: sample.ram, price: sample.price, comparePrice: sample.comparePrice, stock: sample.stock }] },
        specs: { create: [
          { group: 'Software', label: 'OS', value: sample.os },
          { group: 'Display', label: 'Screen', value: sample.display },
          { group: 'Battery', label: 'Capacity', value: sample.battery },
          { group: 'Camera', label: 'System', value: sample.camera },
          { group: 'Network', label: '5G', value: 'Yes' },
          { group: 'Warranty', label: 'Coverage', value: 'Demo warranty policy — replace later' }
        ] }
      }
    });
  }

  await prisma.homepageSection.upsert({
    where: { key: 'hero' },
    update: {},
    create: { key: 'hero', title: 'Find the phone that fits your life.', subtitle: 'Demo homepage content. Editable through the future admin CMS.', enabled: true }
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword && adminPassword.length >= 8) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'ADMIN', password: hashPassword(adminPassword) },
      create: { name: 'Store Admin', email: adminEmail, role: 'ADMIN', password: hashPassword(adminPassword) },
    });
    console.log(`Seeded admin account: ${adminEmail}`);
  } else {
    console.log('Admin seed skipped. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create one.');
  }
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
