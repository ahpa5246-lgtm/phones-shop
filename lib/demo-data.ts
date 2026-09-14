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
  rating: number;
  os: 'iOS' | 'Android';
  ram: string;
  display: string;
  battery: string;
  camera: string;
  connectivity: string[];
  description: string;
  highlights: string[];
};

export const demoProducts: DemoProduct[] = [
  {
    id: 'p1', brand: 'Apple', name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max',
    price: 1890000, oldPrice: 1990000, storage: ['256GB', '512GB', '1TB'],
    colors: ['Black Titanium', 'Natural Titanium'], stock: 8, badge: 'Featured',
    rating: 4.9, os: 'iOS', ram: '8GB', display: '6.9-inch OLED', battery: 'All-day battery',
    camera: '48MP Pro camera system', connectivity: ['5G', 'Wi-Fi 7', 'NFC'],
    description: 'A premium flagship demo listing with a large display, pro-focused camera system and titanium-inspired finish.',
    highlights: ['Premium build', 'Pro camera controls', 'High-performance chipset', 'USB-C']
  },
  {
    id: 'p2', brand: 'Samsung', name: 'Galaxy S26 Ultra', slug: 'galaxy-s26-ultra',
    price: 1725000, oldPrice: 1810000, storage: ['256GB', '512GB'],
    colors: ['Titanium Gray', 'Titanium Black'], stock: 12, badge: 'New',
    rating: 4.8, os: 'Android', ram: '12GB', display: '6.9-inch AMOLED', battery: '5000mAh',
    camera: '200MP multi-camera system', connectivity: ['5G', 'Wi-Fi 7', 'NFC'],
    description: 'A high-end Android demo listing built around productivity, display quality and long-range camera versatility.',
    highlights: ['Large AMOLED display', 'S Pen-ready workflow', 'High zoom camera', 'Fast charging']
  },
  {
    id: 'p3', brand: 'Xiaomi', name: 'Xiaomi 16 Pro', slug: 'xiaomi-16-pro',
    price: 1095000, storage: ['256GB', '512GB'], colors: ['Forest Green', 'Black'], stock: 5,
    badge: 'Best Seller', rating: 4.7, os: 'Android', ram: '12GB', display: '6.7-inch OLED',
    battery: '5200mAh', camera: '50MP triple camera', connectivity: ['5G', 'Wi-Fi 7', 'NFC'],
    description: 'A value-focused flagship demo listing balancing performance, battery life and a polished premium design.',
    highlights: ['Fast charging', 'Bright OLED display', 'Large battery', 'Flagship processor']
  },
  {
    id: 'p4', brand: 'HONOR', name: 'HONOR Magic 8 Pro', slug: 'honor-magic-8-pro',
    price: 1260000, oldPrice: 1325000, storage: ['256GB', '512GB'], colors: ['Emerald', 'Black'], stock: 9,
    badge: 'Offer', rating: 4.6, os: 'Android', ram: '12GB', display: '6.8-inch OLED', battery: '5100mAh',
    camera: '50MP AI camera system', connectivity: ['5G', 'Wi-Fi 7', 'NFC'],
    description: 'A polished flagship demo listing designed for customers who prioritize battery endurance and portrait photography.',
    highlights: ['Portrait camera', 'Curved OLED', 'Fast charging', 'Premium finish']
  },
  {
    id: 'p5', brand: 'Google', name: 'Pixel 11 Pro', slug: 'pixel-11-pro',
    price: 1395000, storage: ['128GB', '256GB', '512GB'], colors: ['Obsidian', 'Porcelain'], stock: 7,
    badge: 'Camera Pick', rating: 4.8, os: 'Android', ram: '12GB', display: '6.7-inch OLED', battery: '5000mAh',
    camera: 'Pro computational camera', connectivity: ['5G', 'Wi-Fi 7', 'NFC'],
    description: 'A camera-first Android demo listing with clean software, computational photography and a minimal industrial design.',
    highlights: ['Clean Android', 'Computational photography', 'AI-assisted editing', 'Long software support']
  },
  {
    id: 'p6', brand: 'OnePlus', name: 'OnePlus 15', slug: 'oneplus-15',
    price: 980000, storage: ['256GB', '512GB'], colors: ['Midnight', 'Silver'], stock: 14,
    badge: 'Performance', rating: 4.6, os: 'Android', ram: '16GB', display: '6.78-inch AMOLED', battery: '5400mAh',
    camera: '50MP triple camera', connectivity: ['5G', 'Wi-Fi 7', 'NFC'],
    description: 'A performance-oriented demo listing for shoppers who care about speed, smooth display response and fast charging.',
    highlights: ['High refresh display', '16GB RAM', 'Very fast charging', 'Performance mode']
  }
];

export const demoBrands = [...new Set(demoProducts.map((product) => product.brand))];

export function formatIQD(value: number) {
  return `${new Intl.NumberFormat('en-US').format(value)} IQD`;
}

export function getProductBySlug(slug: string) {
  return demoProducts.find((product) => product.slug === slug);
}
