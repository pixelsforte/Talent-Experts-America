import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET =
  process.env.JWT_SECRET || 'ad-staffing-super-admin-secure-key-2026-xyz';
const TOKEN_EXPIRY = '7d';

export const ADMIN_COOKIE_NAME = 'ad_admin_session';

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: 'SUPER_ADMIN';
}

export function generateAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    if (decoded && decoded.role === 'SUPER_ADMIN') {
      return decoded;
    }
    return null;
  } catch {
    return null;
  }
}

export function setAdminCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearAdminCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
}
