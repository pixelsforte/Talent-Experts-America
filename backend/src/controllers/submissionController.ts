import { Request, Response } from 'express';
import { FormSubmission } from '../models/FormSubmission.js';
import { isDatabaseConnected } from '../config/database.js';
import { escapeRegex } from '../utils/escapeRegex.js';

const ALLOWED_STATUSES = ['NEW', 'REVIEWED', 'CONTACTED', 'ARCHIVED'] as const;
const ALLOWED_INTERESTS = [
  'Finding a Job',
  'Hiring Talent',
  'Veteran Opportunities',
  'Staffing Solutions',
] as const;
const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

/** Returns the id only if it is a plain 24-character hex string, otherwise null. */
function toObjectIdString(value: unknown): string | null {
  return typeof value === 'string' && OBJECT_ID_PATTERN.test(value) ? value : null;
}

export class SubmissionController {
  /**
   * Public endpoint to save form inquiries into MongoDB.
   */
  async createSubmission(req: Request, res: Response): Promise<void> {
    try {
      if (!isDatabaseConnected()) {
        res.status(503).json({
          error: 'Service Unavailable',
          message: 'Database storage is temporarily offline. Please try again or contact us directly.',
        });
        return;
      }

      const { fullName, email, phone, company, interest, message } = req.body;
      const asText = (value: unknown): string =>
        typeof value === 'string' ? value.trim() : '';

      const submission = new FormSubmission({
        fullName: asText(fullName),
        email: asText(email).toLowerCase(),
        phone: asText(phone),
        company: asText(company),
        interest: ALLOWED_INTERESTS.find((item) => item === interest) || 'Finding a Job',
        message: asText(message),
        status: 'NEW',
      });

      await submission.save();
      console.log(`[FormSubmission] New inquiry from: ${submission.fullName} (${submission.email}) [${submission.interest}]`);

      res.status(201).json({
        success: true,
        message: 'Your inquiry has been submitted successfully.',
        submissionId: submission._id,
        createdAt: submission.createdAt,
      });
    } catch (error: any) {
      console.error('[FormSubmission Error]', error);
      res.status(500).json({
        error: 'Submission Failed',
        message: error.message || 'An error occurred while saving your inquiry.',
      });
    }
  }

  /**
   * Protected endpoint for Super Admin to query and filter real submissions.
   */
  async getSubmissions(req: Request, res: Response): Promise<void> {
    try {
      if (!isDatabaseConnected()) {
        res.status(503).json({
          error: 'Service Unavailable',
          message: 'Database is not connected.',
        });
        return;
      }

      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const limit = Math.min(
        100,
        Math.max(1, parseInt(req.query.limit as string, 10) || 15)
      );
      const skip = (page - 1) * limit;

      // Query values must be plain strings (blocks ?status[$ne]=x style injection)
      const rawSearch = typeof req.query.search === 'string' ? req.query.search : '';
      const rawInterest = typeof req.query.interest === 'string' ? req.query.interest : '';
      const rawStatus = typeof req.query.status === 'string' ? req.query.status : '';

      const search = escapeRegex(rawSearch);
      // Only values from the fixed allow-lists can reach the database query
      const interest = ALLOWED_INTERESTS.find((item) => item === rawInterest);
      const status = ALLOWED_STATUSES.find((item) => item === rawStatus);

      const filter: any = {};

      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      if (interest) {
        filter.interest = interest;
      }

      if (status) {
        filter.status = status;
      }

      const [submissions, total] = await Promise.all([
        FormSubmission.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        FormSubmission.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      res.json({
        submissions,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Query Failed',
        message: error.message,
      });
    }
  }

  /**
   * Protected endpoint to get full details for a single submission.
   */
  async getSubmissionById(req: Request, res: Response): Promise<void> {
    try {
      const id = toObjectIdString(req.params.id);
      if (!id) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid submission ID.',
        });
        return;
      }
      const submission = await FormSubmission.findById(id);

      if (!submission) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Form submission record not found.',
        });
        return;
      }

      res.json({ submission });
    } catch (error: any) {
      res.status(500).json({
        error: 'Lookup Failed',
        message: error.message,
      });
    }
  }

  /**
   * Protected endpoint to update submission status.
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = toObjectIdString(req.params.id);
      if (!id) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid submission ID.',
        });
        return;
      }

      // Pick the status from the fixed allow-list (never use the raw request value)
      const status = ALLOWED_STATUSES.find((item) => item === req.body?.status);
      if (!status) {
        res.status(400).json({
          error: 'Validation Error',
          message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
        });
        return;
      }

      const submission = await FormSubmission.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!submission) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Submission not found.',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Status updated successfully.',
        submission,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Update Failed',
        message: error.message,
      });
    }
  }

  /**
   * Protected endpoint to delete a submission record.
   */
  async deleteSubmission(req: Request, res: Response): Promise<void> {
    try {
      const id = toObjectIdString(req.params.id);
      if (!id) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid submission ID.',
        });
        return;
      }
      const submission = await FormSubmission.findByIdAndDelete(id);

      if (!submission) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Submission not found.',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Submission deleted successfully.',
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Delete Failed',
        message: error.message,
      });
    }
  }
}

export const submissionController = new SubmissionController();
