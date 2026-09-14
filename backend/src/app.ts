import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/authRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { submissionRoutes } from './routes/submissionRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { getDatabaseState, isDatabaseConnected, connectDatabase } from './config/database.js';

export function createExpressApp(): express.Application {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  // Security headers (keep CSP relaxed to work with Vite SPA)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like same-origin navigations, curl, health monitors)
        if (!origin || !isProduction) {
          return callback(null, true);
        }
        const normalizedOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS policy.`), false);
      },
      credentials: true,
    })
  );

  // Parsers
  app.use(cookieParser());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Ensure database connection is established for API requests
  app.use(async (req, _res, next) => {
    const isPublicStatusRoute = req.path === '/api/health';
    if (req.path.startsWith('/api') && !isPublicStatusRoute && !isDatabaseConnected()) {
      try {
        await connectDatabase();
      } catch (err) {
        console.warn('[MongoDB Middleware] Connection attempt error:', err);
      }
    }
    next();
  });

  // API Health & Status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date(),
      database: getDatabaseState(),
    });
  });

  // Backend API Routing
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/form-submissions', submissionRoutes);

  // Catch-all for undefined API routes to return clean JSON 404 instead of HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `API endpoint not found: ${req.method} ${req.path}`,
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
