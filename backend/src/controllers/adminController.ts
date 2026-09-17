import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { authService } from '../services/authService.js';
import { FormSubmission } from '../models/FormSubmission.js';
import { setAdminCookie } from '../utils/tokens.js';
import { getDatabaseState } from '../config/database.js';

export class AdminController {
  /**
   * Verifies current password to unlock Settings tab.
   */
  async verifyPassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { password } = req.body;
      if (!password) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Current password is required.',
        });
        return;
      }

      if (!req.admin) {
        res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
        return;
      }

      const isValid = await authService.verifyCurrentPassword(
        req.admin._id.toString(),
        password
      );

      if (!isValid) {
        res.status(401).json({
          verified: false,
          message: 'The current password you entered is incorrect.',
        });
        return;
      }

      res.json({
        verified: true,
        message: 'Password verified. Settings unlocked.',
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Verification Failed',
        message: error.message,
      });
    }
  }

  /**
   * Retrieves Admin profile overview.
   */
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.admin) {
      res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
      return;
    }

    const dbState = getDatabaseState();
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        role: req.admin.role,
        createdAt: req.admin.createdAt,
        updatedAt: req.admin.updatedAt,
      },
      dbState,
    });
  }

  /**
   * Requests email change by sending a code to the new address.
   */
  async requestEmailChange(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { newEmail } = req.body;
      if (!req.admin) {
        res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
        return;
      }

      const hostUrl = `${req.protocol}://${req.get('host')}`;
      const result = await authService.requestEmailChange(
        req.admin._id.toString(),
        newEmail,
        hostUrl
      );

      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        error: 'Email Change Request Failed',
        message: error.message,
      });
    }
  }

  /**
   * Confirms and applies new email with verification token.
   */
  async verifyNewEmail(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { token, newEmail } = req.body;
      if (!token) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Verification token is required.',
        });
        return;
      }

      if (!req.admin) {
        res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
        return;
      }

      const { admin, token: newToken } = await authService.confirmNewEmail(
        req.admin._id.toString(),
        token,
        newEmail
      );

      setAdminCookie(res, newToken);

      res.json({
        success: true,
        message: `Admin email successfully updated to ${admin.email}.`,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          updatedAt: admin.updatedAt,
        },
        token: newToken,
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        error: 'Email Verification Failed',
        message: error.message,
      });
    }
  }

  /**
   * Fallback direct email update when verified with current password.
   */
  async updateEmailDirect(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { currentPassword, newEmail } = req.body;
      if (!req.admin) {
        res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
        return;
      }

      const { admin, token: newToken } = await authService.updateEmailDirect(
        req.admin._id.toString(),
        currentPassword,
        newEmail
      );

      setAdminCookie(res, newToken);

      res.json({
        success: true,
        message: `Admin email successfully updated to ${admin.email}.`,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          updatedAt: admin.updatedAt,
        },
        token: newToken,
      });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({
        error: 'Email Update Failed',
        message: error.message,
      });
    }
  }

  /**
   * Retrieves live metrics for the Dashboard tab from MongoDB.
   */
  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.admin) {
        res.status(401).json({ error: 'Unauthorized', message: 'Not logged in.' });
        return;
      }

      const totalSubmissions = await FormSubmission.countDocuments();
      const recentSubmissions = await FormSubmission.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .lean();

      // Aggregate counts by interest
      const interestAggregation = await FormSubmission.aggregate([
        { $group: { _id: '$interest', count: { $sum: 1 } } },
      ]);

      const interestCounts: Record<string, number> = {};
      interestAggregation.forEach((item) => {
        if (item._id) interestCounts[item._id] = item.count;
      });

      const dbState = getDatabaseState();

      res.json({
        totalSubmissions,
        recentSubmissions,
        interestCounts,
        dbState,
        admin: {
          email: req.admin.email,
          role: req.admin.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Dashboard Query Failed',
        message: error.message,
      });
    }
  }
}

export const adminController = new AdminController();
