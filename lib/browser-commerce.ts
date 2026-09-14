'use client';

export type CartLine = { productId: string; quantity: number; storage?: string; color?: string };

const CART_KEY = 'nova-mobile-cart';
const COMPARE_KEY = 'nova-mobile-compare';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('nova-commerce-change'));
}

export function getCart(): CartLine[] {
  return read<CartLine[]>(CART_KEY, []);
}

export function addToCart(productId: string, options?: { storage?: string; color?: string; quantity?: number }) {
  const cart = getCart();
  const storage = options?.storage;
  const color = options?.color;
  const quantity = options?.quantity ?? 1;
  const existing = cart.find((line) => line.productId === productId && line.storage === storage && line.color === color);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity, storage, color });
  write(CART_KEY, cart);
  return cart;
}

export function setCartQuantity(index: number, quantity: number) {
  const cart = getCart();
  if (!cart[index]) return cart;
  if (quantity <= 0) cart.splice(index, 1);
  else cart[index].quantity = quantity;
  write(CART_KEY, cart);
  return cart;
}

export function removeCartLine(index: number) {
  const cart = getCart();
  cart.splice(index, 1);
  write(CART_KEY, cart);
  return cart;
}

export function getCompareIds(): string[] {
  return read<string[]>(COMPARE_KEY, []);
}

export function toggleCompare(productId: string) {
  const ids = getCompareIds();
  const exists = ids.includes(productId);
  const next = exists ? ids.filter((id) => id !== productId) : [...ids, productId].slice(-4);
  write(COMPARE_KEY, next);
  return next;
}
