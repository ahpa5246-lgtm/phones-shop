import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'nova_session';
const MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = { userId: string; role: 'CUSTOMER' | 'ADMIN'; exp: number };

function secret() {
  return process.env.AUTH_SECRET || 'dev-only-change-me';
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

function encode(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function decode(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = sign(body);
  if (signature.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: 'CUSTOMER' | 'ADMIN') {
  const store = await cookies();
  const token = encode({ userId, role, exp: Date.now() + MAX_AGE * 1000 });
  store.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: MAX_AGE });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function getSession() {
  const store = await cookies();
  return decode(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}
