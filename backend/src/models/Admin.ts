import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  role: 'SUPER_ADMIN';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailChangeToken?: string;
  pendingNewEmail?: string;
  emailChangeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN'],
      default: 'SUPER_ADMIN',
      required: true,
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
    emailChangeToken: {
      type: String,
      default: undefined,
    },
    pendingNewEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: undefined,
    },
    emailChangeExpires: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as Record<string, unknown>).passwordHash;
        delete (ret as Record<string, unknown>).resetPasswordToken;
        delete (ret as Record<string, unknown>).resetPasswordExpires;
        delete (ret as Record<string, unknown>).emailChangeToken;
        delete (ret as Record<string, unknown>).emailChangeExpires;
        return ret;
      },
    },
  }
);

// Enforce collection-level single document rule safety
export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
