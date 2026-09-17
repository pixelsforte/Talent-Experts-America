import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

// Store recent tokens in memory for testing/demonstration logs when email server is not configured
export const memoryEmailOutbox: Array<{
  type: 'PASSWORD_RESET' | 'EMAIL_CHANGE';
  to: string;
  token: string;
  sentAt: Date;
}> = [];

export function getEmailTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    return transporter;
  }

  return null;
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string,
  appUrl?: string
): Promise<{ success: boolean; message: string; debugToken?: string }> {
  const baseUrl = appUrl || process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/management-portal/reset-password?token=${resetToken}&email=${encodeURIComponent(toEmail)}`;
  const from = process.env.EMAIL_FROM || '"The American Dream Staffing" <noreply@theamericandreamstaffing.com>';

  // Record for debugging / testing scenarios
  memoryEmailOutbox.push({
    type: 'PASSWORD_RESET',
    to: toEmail,
    token: resetToken,
    sentAt: new Date(),
  });

  const mailOptions = {
    from,
    to: toEmail,
    subject: 'Security: Password Recovery for Management Portal - The American Dream Staffing',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #b91c1c; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #111827; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">The Talent Experts of America</h2>
          <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Super Admin Management Portal</p>
        </div>
        <h3 style="color: #111827; font-size: 18px; margin-top: 0;">Password Reset Request</h3>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          You requested to reset your password for the Management Portal. Click the button below or copy the token to complete your password reset:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #b91c1c; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
            Reset Super Admin Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
          Direct Reset Token: <code style="background-color: #f3f4f6; padding: 4px 8px; font-weight: bold; color: #111827;">${resetToken}</code>
        </p>
        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
          This token is valid for 1 hour and can only be used once. If you did not request this change, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `,
  };

  const client = getEmailTransporter();
  if (client) {
    try {
      await client.sendMail(mailOptions);
      console.log(`[Email] Password reset email sent via SMTP to: ${toEmail}`);
      return { success: true, message: 'Recovery email sent successfully' };
    } catch (error) {
      console.error('[Email] Failed to send via SMTP, logged to system output:', error);
      console.log(`[Email Notice] Reset Link: ${resetUrl} | Token: ${resetToken}`);
      return {
        success: true,
        message: 'Recovery token generated and queued',
        debugToken: resetToken,
      };
    }
  } else {
    console.log(`[Email Service (Dev/Console)] Reset email for ${toEmail}:`);
    console.log(`[Email Service] Link: ${resetUrl}`);
    console.log(`[Email Service] Token: ${resetToken}`);
    return {
      success: true,
      message: 'Recovery email generated (logged to server console)',
      debugToken: resetToken,
    };
  }
}

export async function sendEmailChangeVerification(
  newEmail: string,
  verificationToken: string,
  appUrl?: string
): Promise<{ success: boolean; message: string; debugToken?: string }> {
  const baseUrl = appUrl || process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/management-portal/settings?action=verify-email&token=${verificationToken}&email=${encodeURIComponent(newEmail)}`;
  const from = process.env.EMAIL_FROM || '"The American Dream Staffing" <noreply@theamericandreamstaffing.com>';

  // Record for debugging / testing
  memoryEmailOutbox.push({
    type: 'EMAIL_CHANGE',
    to: newEmail,
    token: verificationToken,
    sentAt: new Date(),
  });

  const mailOptions = {
    from,
    to: newEmail,
    subject: 'Security: Verify New Email for Management Portal - The American Dream Staffing',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #b91c1c; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="color: #111827; margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">The Talent Experts of America</h2>
          <p style="color: #6b7280; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Super Admin Management Portal</p>
        </div>
        <h3 style="color: #111827; font-size: 18px; margin-top: 0;">Verify New Administrator Email</h3>
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          You requested to change your Super Admin email address to <strong>${newEmail}</strong>. Click below or enter your verification token in the Settings panel:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
            Confirm New Email Address
          </a>
        </div>
        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
          Verification Code/Token: <code style="background-color: #f3f4f6; padding: 4px 8px; font-weight: bold; color: #111827;">${verificationToken}</code>
        </p>
        <p style="color: #6b7280; font-size: 12px; line-height: 1.5;">
          This token is valid for 1 hour. Upon confirmation, this new address will permanently become your official login and password recovery email.
        </p>
      </div>
    `,
  };

  const client = getEmailTransporter();
  if (client) {
    try {
      await client.sendMail(mailOptions);
      console.log(`[Email] Email change verification sent via SMTP to: ${newEmail}`);
      return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
      console.error('[Email] Failed to send via SMTP:', error);
      console.log(`[Email Notice] Verify Link: ${verifyUrl} | Token: ${verificationToken}`);
      return {
        success: true,
        message: 'Verification code generated and queued',
        debugToken: verificationToken,
      };
    }
  } else {
    console.log(`[Email Service (Dev/Console)] Email Change code for ${newEmail}:`);
    console.log(`[Email Service] Link: ${verifyUrl}`);
    console.log(`[Email Service] Token: ${verificationToken}`);
    return {
      success: true,
      message: 'Verification email generated (logged to server console)',
      debugToken: verificationToken,
    };
  }
}
