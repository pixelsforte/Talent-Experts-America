import { Request, Response, NextFunction } from 'express';
import { verifyAdminToken, ADMIN_COOKIE_NAME, AdminTokenPayload } from '../utils/tokens.js';
import { Admin, IAdmin } from '../models/Admin.js';
import { isDatabaseConnected } from '../config/database.js';

export interface AuthenticatedRequest extends Request {
  admin?: IAdmin;
  adminToken?: AdminTokenPayload;
}

export async function requireSuperAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!isDatabaseConnected()) {
    res.status(503).json({
      error: 'Database is not connected',
      message: 'MongoDB connection is not active. Please check MONGODB_URI configuration.',
    });
    return;
  }

  // 1. Check HttpOnly Cookie first, then Authorization header
  const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  let bearerToken: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.split(' ')[1];
  }

  const token = cookieToken || bearerToken;

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. Please log in to access the Management Portal.',
    });
    return;
  }

  const decoded = verifyAdminToken(token);
  if (!decoded || decoded.role !== 'SUPER_ADMIN') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired session token. Please log in again.',
    });
    return;
  }

  try {
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Administrator account not found or access revoked.',
      });
      return;
    }

    req.admin = admin;
    req.adminToken = decoded;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while verifying administrator credentials.',
    });
  }
}
