import { Request, Response } from 'express';
import { FormSubmission } from '../models/FormSubmission.js';
import { isDatabaseConnected } from '../config/database.js';

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

      const submission = new FormSubmission({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : '',
        company: company ? company.trim() : '',
        interest: interest || 'Finding a Job',
        message: message ? message.trim() : '',
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

      const search = (req.query.search as string)?.trim();
      const interest = req.query.interest as string;
      const status = req.query.status as string;

      const filter: any = {};

      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      if (interest && interest !== 'ALL') {
        filter.interest = interest;
      }

      if (status && status !== 'ALL') {
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
      const { id } = req.params;
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
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ['NEW', 'REVIEWED', 'CONTACTED', 'ARCHIVED'];
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({
          error: 'Validation Error',
          message: `Status must be one of: ${allowedStatuses.join(', ')}`,
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
      const { id } = req.params;
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
