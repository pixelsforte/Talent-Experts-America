import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { requireSuperAdmin } from '../middleware/authMiddleware.js';
import { validateLoginInput } from '../middleware/validationMiddleware.js';

const router = Router();

// Public auth status (checks if Super Admin exists dynamically)
router.get('/status', (req, res) => authController.getStatus(req, res));

// First Super Admin registration (strictly disabled once count >= 1)
router.post('/signup', validateLoginInput, (req, res) =>
  authController.signup(req, res)
);

// Super Admin login
router.post('/login', validateLoginInput, (req, res) =>
  authController.login(req, res)
);

// Logout
router.post('/logout', (req, res) => authController.logout(req, res));

// Forgot password request
router.post('/forgot-password', (req, res) =>
  authController.forgotPassword(req, res)
);

// Verify reset token
router.post('/verify-reset-token', (req, res) =>
  authController.verifyResetToken(req, res)
);

// Reset password
router.post('/reset-password', (req, res) =>
  authController.resetPassword(req, res)
);

// Authenticated me check
router.get('/me', requireSuperAdmin, (req, res) =>
  authController.getMe(req, res)
);

// Testing helper for inspectable generated tokens
router.get('/test-outbox', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }
  return authController.getTestOutbox(req, res);
});

export const authRoutes = router;
