import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireSuperAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes require authenticated SUPER_ADMIN
router.use(requireSuperAdmin);

// Verify current password before unlocking Settings tab
router.post('/verify-password', (req, res) =>
  adminController.verifyPassword(req, res)
);

// Admin profile
router.get('/profile', (req, res) => adminController.getProfile(req, res));

// Request email change token
router.post('/request-email-change', (req, res) =>
  adminController.requestEmailChange(req, res)
);

// Verify and confirm new email token
router.post('/verify-new-email', (req, res) =>
  adminController.verifyNewEmail(req, res)
);

// Direct email update with current password
router.put('/email', (req, res) => adminController.updateEmailDirect(req, res));

// Dashboard metrics from MongoDB
router.get('/dashboard', (req, res) =>
  adminController.getDashboard(req, res)
);

export const adminRoutes = router;
