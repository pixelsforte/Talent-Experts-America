import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

/**
 * Generates a cryptographically secure random token (hex string)
 * and its SHA-256 hash for secure database storage.
 */
export function generateSecureToken(): { token: string; hashedToken: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = hashToken(token);
  return { token, hashedToken };
}

/**
 * Hashes a token using SHA-256 for comparison with stored token.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
