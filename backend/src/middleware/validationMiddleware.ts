import { Request, Response, NextFunction } from 'express';

export function validateFormSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { fullName, email, interest } = req.body;

  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Full Name is required.',
    });
    return;
  }

  if (fullName.trim().length > 120) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Full Name cannot exceed 120 characters.',
    });
    return;
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Email address is required.',
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Please provide a valid email address.',
    });
    return;
  }

  const allowedInterests = [
    'Finding a Job',
    'Hiring Talent',
    'Veteran Opportunities',
    'Staffing Solutions',
  ];

  if (interest && !allowedInterests.includes(interest)) {
    res.status(400).json({
      error: 'Validation Error',
      message: `Invalid interest category. Allowed options: ${allowedInterests.join(', ')}`,
    });
    return;
  }

  if (req.body.message && typeof req.body.message === 'string' && req.body.message.length > 3000) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Message cannot exceed 3000 characters.',
    });
    return;
  }

  next();
}

export function validateLoginInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Email is required.',
    });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Password is required.',
    });
    return;
  }

  next();
}
