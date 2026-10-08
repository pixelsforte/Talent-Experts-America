import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/authRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { submissionRoutes } from './routes/submissionRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { getDatabaseState, isDatabaseConnected, connectDatabase } from './config/database.js';

export function createExpressApp(): express.Application {
  const app = express();

  // Needed so rate limiting sees each visitor's real IP behind the hosting proxy
  app.set('trust proxy', 1);

  // Security headers (Content-Security-Policy enabled)
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          // Vite dev server needs inline/eval scripts; production stays strict
          scriptSrc: isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'],
          // Vite hot-reload uses websockets in development
          connectSrc: isProduction ? ["'self'"] : ["'self'", 'ws:', 'wss:'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS: the website and API share one origin, so cross-origin access is off by default.
  // To allow another site, set ALLOWED_ORIGINS="https://example.com,https://other.com"
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.use(
    cors({
      origin: allowedOrigins,
    })
  );

  // Rate limit the whole API (per IP)
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 600,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { error: 'Too many requests', message: 'Too many requests. Please try again later.' },
    })
  );

  // Parsers
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Try to reconnect in the background for API requests. Do not block the request
  // pipeline on a slow/unreachable Atlas DNS lookup.
  app.use((req, _res, next) => {
    const isPublicStatusRoute = req.path === '/api/health' || req.path === '/api/auth/status';
    if (req.path.startsWith('/api') && !isPublicStatusRoute && !isDatabaseConnected()) {
      void connectDatabase();
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

  // Global error handler
  app.use(errorHandler);

  return app;
}
