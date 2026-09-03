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
    console.warn('[AI Studio] Database offline — returning mock/fallback response');
    if (req.method === 'GET') {
      res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
      return;
    }
    res.status(503).json({
      error: 'Service temporarily unavailable',
      message: 'Database is currently offline or unconfigured.',
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message =
    err.message || 'An unexpected error occurred. Please try again later.';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

