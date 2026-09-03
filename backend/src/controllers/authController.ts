import { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import {
  setAdminCookie,
  clearAdminCookie,
  verifyAdminToken,
  ADMIN_COOKIE_NAME,
} from '../utils/tokens.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { memoryEmailOutbox } from '../services/emailService.js';
import { getDatabaseState } from '../config/database.js';
import { Admin } from '../models/Admin.js';

export class AuthController {
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await authService.getStatus();
      const dbState = getDatabaseState();

      let authenticated = false;
      let authenticatedAdmin: any = null;

      const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME];
      const authHeader = req.headers.authorization;
      let bearerToken: string | undefined;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        bearerToken = authHeader.split(' ')[1];
      }

      const token = cookieToken || bearerToken;
      if (token) {
        const decoded = verifyAdminToken(token);
        if (decoded && decoded.adminId) {
          try {
            const admin = await Admin.findById(decoded.adminId).maxTimeMS(3000).lean();
            if (admin) {
              authenticated = true;
              authenticatedAdmin = {
                id: admin._id,
                email: admin.email,
                role: admin.role,
              };
            }
          } catch {
            // Ignore token lookup error
          }
        }
      }

      res.json({
        ...status,
        authenticated,
        admin: authenticatedAdmin,
        dbConnected: status.databaseConnected,
        dbState,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to retrieve auth status',
        message: error.message,
      });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { admin, token } = await authService.registerFirstSuperAdmin(
        email,
        password
      );

      setAdminCookie(res, token);

      res.status(201).json({
        success: true,
        message: 'Admin successfully registered.',
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt,
        },
        token,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: 'Signup Failed',
        message: error.message || 'Could not complete registration.',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { admin, token } = await authService.login(email, password);

      setAdminCookie(res, token);

      res.json({
        success: true,
        message: 'Authentication successful.',
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          createdAt: admin.createdAt,
        },
        token,
      });
    } catch (error: any) {
      res.status(error.statusCode || 401).json({
        error: 'Authentication Failed',
        message: error.message || 'Invalid credentials.',
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    clearAdminCookie(res);
    res.json({
      success: true,
      message: 'Successfully logged out.',
    });
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.admin) {
      res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
      return;
    }

    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt,
        updatedAt: req.admin.updatedAt,
      },
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email || !email.trim()) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Please provide the administrator email address.',
        });
        return;
      }

      const hostUrl = `${req.protocol}://${req.get('host')}`;
      const result = await authService.requestPasswordReset(email, hostUrl);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: 'Password Recovery Failed',
        message: error.message,
      });
    }
  }

  async verifyResetToken(req: Request, res: Response): Promise<void> {
    try {
      const { token, email } = req.body;
      if (!token) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Reset token is required.',
        });
        return;
      }

      const result = await authService.verifyResetToken(token, email);
      if (!result.valid) {
        res.status(400).json({
          valid: false,
          message: 'The password reset token is invalid or has expired.',
        });
        return;
      }

      res.json({
        valid: true,
        email: result.email,
        message: 'Token is valid.',
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Verification Failed',
        message: error.message,
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword, email } = req.body;
      if (!token || !newPassword) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Token and new password are required.',
        });
        return;
      }

      const result = await authService.resetPassword(token, newPassword, email);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        error: 'Reset Failed',
        message: error.message,
      });
    }
  }

  // Development/testing helper to inspect generated outbox tokens when testing recovery without live SMTP
  async getTestOutbox(_req: Request, res: Response): Promise<void> {
    res.json({
      outbox: memoryEmailOutbox.slice(-10),
    });
  }
}

export const authController = new AuthController();
