import { Router } from 'express';
import { submissionController } from '../controllers/submissionController.js';
import { requireSuperAdmin } from '../middleware/authMiddleware.js';
import { validateFormSubmission } from '../middleware/validationMiddleware.js';

const router = Router();

// Public route to submit inquiries
router.post('/', validateFormSubmission, (req, res) =>
  submissionController.createSubmission(req, res)
);

// Protected routes (Super Admin only)
router.get('/', requireSuperAdmin, (req, res) =>
  submissionController.getSubmissions(req, res)
);

router.get('/:id', requireSuperAdmin, (req, res) =>
  submissionController.getSubmissionById(req, res)
);

router.patch('/:id/status', requireSuperAdmin, (req, res) =>
  submissionController.updateStatus(req, res)
);

router.delete('/:id', requireSuperAdmin, (req, res) =>
  submissionController.deleteSubmission(req, res)
);

export const submissionRoutes = router;
