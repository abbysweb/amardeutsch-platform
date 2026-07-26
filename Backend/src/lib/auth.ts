import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'admin_token';
export const USER_COOKIE_NAME = 'user_token';

// Secret key for signing tokens in Edge runtime & Node runtime
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'deutschlern_super_secret_admin_jwt_key_2026_secure';
  return new TextEncoder().encode(secret);
};

export interface AuthPayload {
  userId: number;
  email: string;
  name?: string | null;
  role: string;
}

/**
 * Signs a new JWT token for a given user payload.
 */
export async function signToken(payload: AuthPayload): Promise<string> {
  const secretKey = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secretKey);
}

/**
 * Verifies a JWT token and returns its payload if valid, otherwise null.
 */
export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

/**
 * Helper to retrieve and verify the current admin session from incoming cookies.
 */
export async function getSession(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Helper to retrieve and verify the current general user session (student or admin) from incoming cookies.
 */
export async function getUserSession(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_COOKIE_NAME)?.value || cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
