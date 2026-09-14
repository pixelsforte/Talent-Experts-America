import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Backend Error Handler]:', err);

  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    (err.message && (err.message.includes('buffering timed out') || err.message.includes('topology was closed')))
  ) {
    console.warn('[MongoDB Error] Database connection or query failure:', err.message || err.name);
    res.status(503).json({
      error: 'Service Temporarily Unavailable',
      message: 'Database service is currently unreachable or disconnected. Please try again in a few moments.',
    });
    return;
  }

  const isProd = process.env.NODE_ENV === 'production';
  const statusCode =
    typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;
  const message =
    statusCode < 500 || !isProd
      ? err.message || 'An unexpected error occurred. Please try again later.'
      : 'An internal server error occurred. Please try again later.';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    ...(!isProd && { stack: err.stack }),
  });
}

