export type DemoProduct = {
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
};

export const demoProducts: DemoProduct[] = [
  {
    id: 'p1',
    brand: 'Apple',
    name: 'iPhone 16 Pro Max',
    slug: 'iphone-16-pro-max',
    price: 1890000,
    oldPrice: 1990000,
    storage: ['256GB', '512GB', '1TB'],
    colors: ['Black Titanium', 'Natural Titanium'],
    stock: 8,
    badge: 'Featured'
  },
  {
    id: 'p2',
    brand: 'Samsung',
    name: 'Galaxy S26 Ultra',
    slug: 'galaxy-s26-ultra',
    price: 1725000,
    oldPrice: 1810000,
    storage: ['256GB', '512GB'],
    colors: ['Titanium Gray', 'Titanium Black'],
    stock: 12,
    badge: 'New'
  },
  {
    id: 'p3',
    brand: 'Xiaomi',
    name: 'Xiaomi 16 Pro',
    slug: 'xiaomi-16-pro',
    price: 1095000,
    storage: ['256GB', '512GB'],
    colors: ['Forest Green', 'Black'],
    stock: 5,
    badge: 'Best Seller'
  }
];

export function formatIQD(value: number) {
  return `${new Intl.NumberFormat('en-US').format(value)} IQD`;
}
