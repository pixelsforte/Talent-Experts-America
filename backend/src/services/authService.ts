import { Admin, IAdmin } from '../models/Admin.js';
import {
  hashPassword,
  comparePassword,
  generateSecureToken,
  hashToken,
} from '../utils/security.js';
import { generateAdminToken } from '../utils/tokens.js';
import {
  sendPasswordResetEmail,
  sendEmailChangeVerification,
} from './emailService.js';
import { isDatabaseConnected } from '../config/database.js';

export class AuthService {
  /**
   * Dynamically checks whether a Super Admin exists in the database.
   */
  async getStatus(): Promise<{
    adminExists: boolean;
    signupAllowed: boolean;
    databaseConnected: boolean;
  }> {
    if (!isDatabaseConnected()) {
      return {
        adminExists: false,
        signupAllowed: false,
        databaseConnected: false,
      };
    }

    try {
      const count = await Admin.countDocuments().maxTimeMS(3000);
      return {
      adminExists: count > 0,
      signupAllowed: count === 0,
        databaseConnected: true,
      };
    } catch (error) {
      console.warn('[Auth] Could not read admin status from database:', error);
      return {
        adminExists: false,
        signupAllowed: false,
        databaseConnected: false,
      };
    }
  }

  /**
   * Registers the FIRST and ONLY Super Admin.
   * If an Admin already exists, this method strictly rejects.
   */
  async registerFirstSuperAdmin(
    email: string,
    password: string
  ): Promise<{ admin: IAdmin; token: string }> {
    if (!isDatabaseConnected()) {
      throw new Error('Database is not connected. Please verify MONGODB_URI.');
    }

    // Strict count check
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      const error: any = new Error('Admin already exists. Signup is disabled.');
      error.statusCode = 403;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const error: any = new Error('A valid email address is required.');
      error.statusCode = 400;
      throw error;
    }

    if (!password || password.length < 8) {
      const error: any = new Error(
        'Password must be at least 8 characters long.'
      );
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await hashPassword(password);

    // Create the one Super Admin document
    const admin = new Admin({
      email: cleanEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
    });

    await admin.save();
    console.log(`[Auth] First Super Admin successfully created: ${cleanEmail}`);

    const token = generateAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: 'SUPER_ADMIN',
    });

    return { admin, token };
  }

  /**
   * Authenticates the existing Super Admin.
   */
  async login(
    email: string,
    password: string
  ): Promise<{ admin: IAdmin; token: string }> {
    if (!isDatabaseConnected()) {
      throw new Error('Database is not connected. Please verify MONGODB_URI.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (admin.role !== 'SUPER_ADMIN') {
      const error: any = new Error('Unauthorized role.');
      error.statusCode = 403;
      throw error;
    }

    const token = generateAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: 'SUPER_ADMIN',
    });

    return { admin, token };
  }

  /**
   * Initiates forgot-password workflow for the current Admin email.
   */
  async requestPasswordReset(
    email: string,
    appUrl?: string
  ): Promise<{ success: boolean; message: string; debugToken?: string }> {
    if (!isDatabaseConnected()) {
      throw new Error('Database is not connected.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      // Do not leak existence info, or return friendly notification
      return {
        success: false,
        message: 'The submitted email does not match the active administrator account.',
      };
    }

    const { token, hashedToken } = generateSecureToken();
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await admin.save();

    const emailResult = await sendPasswordResetEmail(cleanEmail, token, appUrl);
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email.',
      debugToken: emailResult.debugToken,
    };
  }

  /**
   * Verifies if a reset token is valid.
   */
  async verifyResetToken(
    token: string,
    email?: string
  ): Promise<{ valid: boolean; email?: string }> {
    if (!isDatabaseConnected()) {
      throw new Error('Database is not connected.');
    }

    const hashedToken = hashToken(token);
    const query: any = {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    };

    if (email) {
      query.email = email.trim().toLowerCase();
    }

    const admin = await Admin.findOne(query);
    if (!admin) {
      return { valid: false };
    }

    return { valid: true, email: admin.email };
  }

  /**
   * Resets password using valid token.
   */
  async resetPassword(
    token: string,
    newPassword: string,
    email?: string
  ): Promise<{ success: boolean; message: string }> {
    if (!isDatabaseConnected()) {
      throw new Error('Database is not connected.');
    }

    if (!newPassword || newPassword.length < 8) {
      const error: any = new Error(
        'New password must be at least 8 characters long.'
      );
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = hashToken(token);
    const query: any = {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    };

    if (email) {
      query.email = email.trim().toLowerCase();
    }

    const admin = await Admin.findOne(query);
    if (!admin) {
      const error: any = new Error(
        'Invalid or expired password reset token.'
      );
      error.statusCode = 400;
      throw error;
    }

    admin.passwordHash = await hashPassword(newPassword);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    console.log(`[Auth] Password successfully reset for: ${admin.email}`);
    return {
      success: true,
      message: 'Password successfully updated. You can now log in.',
    };
  }

  /**
   * Verifies current password before allowing access to sensitive settings.
   */
  async verifyCurrentPassword(
    adminId: string,
    password: string
  ): Promise<boolean> {
    const admin = await Admin.findById(adminId);
    if (!admin) return false;
    return await comparePassword(password, admin.passwordHash);
  }

  /**
   * Requests email change by generating a verification token sent to the new email.
   */
  async requestEmailChange(
    adminId: string,
    newEmail: string,
    appUrl?: string
  ): Promise<{ success: boolean; message: string; debugToken?: string }> {
    const cleanNewEmail = newEmail.trim().toLowerCase();
    if (!cleanNewEmail || !cleanNewEmail.includes('@')) {
      const error: any = new Error('Please enter a valid new email address.');
      error.statusCode = 400;
      throw error;
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      const error: any = new Error('Admin not found.');
      error.statusCode = 404;
      throw error;
    }

    if (admin.email === cleanNewEmail) {
      const error: any = new Error(
        'New email must be different from current email.'
      );
      error.statusCode = 400;
      throw error;
    }

    const { token, hashedToken } = generateSecureToken();
    admin.pendingNewEmail = cleanNewEmail;
    admin.emailChangeToken = hashedToken;
    admin.emailChangeExpires = new Date(Date.now() + 3600000); // 1 hour
    await admin.save();

    const emailResult = await sendEmailChangeVerification(
      cleanNewEmail,
      token,
      appUrl
    );
    return {
      success: true,
      message: `Verification code sent to ${cleanNewEmail}. Please confirm to finalize.`,
      debugToken: emailResult.debugToken,
    };
  }

  /**
   * Confirms new email address using verification token.
   */
  async confirmNewEmail(
    adminId: string,
    token: string,
    newEmail?: string
  ): Promise<{ admin: IAdmin; token: string }> {
    const hashedToken = hashToken(token.trim());
    const admin = await Admin.findById(adminId);

    if (!admin) {
      const error: any = new Error('Admin not found.');
      error.statusCode = 404;
      throw error;
    }

    if (
      !admin.emailChangeToken ||
      admin.emailChangeToken !== hashedToken ||
      !admin.emailChangeExpires ||
      admin.emailChangeExpires < new Date()
    ) {
      const error: any = new Error('Invalid or expired email verification token.');
      error.statusCode = 400;
      throw error;
    }

    const verifiedEmail = admin.pendingNewEmail || newEmail?.trim().toLowerCase();
    if (!verifiedEmail) {
      const error: any = new Error('No pending email address found.');
      error.statusCode = 400;
      throw error;
    }

    const oldEmail = admin.email;
    admin.email = verifiedEmail;
    admin.pendingNewEmail = undefined;
    admin.emailChangeToken = undefined;
    admin.emailChangeExpires = undefined;
    await admin.save();

    console.log(
      `[Auth] Admin email updated from ${oldEmail} to ${admin.email}`
    );

    // Generate fresh session token for new email
    const sessionToken = generateAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: 'SUPER_ADMIN',
    });

    return { admin, token: sessionToken };
  }

  /**
   * Direct secure email change when current password is verified.
   */
  async updateEmailDirect(
    adminId: string,
    currentPassword: string,
    newEmail: string
  ): Promise<{ admin: IAdmin; token: string }> {
    const isPasswordValid = await this.verifyCurrentPassword(
      adminId,
      currentPassword
    );
    if (!isPasswordValid) {
      const error: any = new Error('Current password is incorrect.');
      error.statusCode = 401;
      throw error;
    }

    const cleanNewEmail = newEmail.trim().toLowerCase();
    if (!cleanNewEmail || !cleanNewEmail.includes('@')) {
      const error: any = new Error('Please enter a valid new email address.');
      error.statusCode = 400;
      throw error;
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      const error: any = new Error('Admin not found.');
      error.statusCode = 404;
      throw error;
    }

    const oldEmail = admin.email;
    admin.email = cleanNewEmail;
    admin.pendingNewEmail = undefined;
    admin.emailChangeToken = undefined;
    admin.emailChangeExpires = undefined;
    await admin.save();

    console.log(`[Auth] Email changed with password verification: ${oldEmail} -> ${admin.email}`);

    const token = generateAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
      role: 'SUPER_ADMIN',
    });

    return { admin, token };
  }
}

export const authService = new AuthService();
