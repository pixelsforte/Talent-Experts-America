import jwt from 'jsonwebtoken';
import { Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('[Auth] JWT_SECRET is required in production.');
}

const TOKEN_EXPIRY = '7d';

export const ADMIN_COOKIE_NAME = 'ad_admin_session';

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: 'SUPER_ADMIN';
}

function getJwtSecret(): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('[Auth] JWT_SECRET is required.');
  }
  return process.env.JWT_SECRET;
}

export function generateAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: TOKEN_EXPIRY,
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AdminTokenPayload;
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
