import mongoose, { Document, Schema } from 'mongoose';

export interface IFormSubmission extends Document {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  interest: string;
  message?: string;
  status: 'NEW' | 'REVIEWED' | 'CONTACTED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const FormSubmissionSchema = new Schema<IFormSubmission>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [120, 'Full name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    interest: {
      type: String,
      required: [true, 'Interest category is required'],
      enum: [
        'Finding a Job',
        'Hiring Talent',
        'Veteran Opportunities',
        'Staffing Solutions',
      ],
      default: 'Finding a Job',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [3000, 'Message cannot exceed 3000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['NEW', 'REVIEWED', 'CONTACTED', 'ARCHIVED'],
      default: 'NEW',
    },
  },
  {
    timestamps: true,
  }
);

FormSubmissionSchema.index({ createdAt: -1 });
FormSubmissionSchema.index({ email: 1 });

export const FormSubmission = mongoose.model<IFormSubmission>(
  'FormSubmission',
  FormSubmissionSchema
);
