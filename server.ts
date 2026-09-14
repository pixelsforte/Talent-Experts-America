import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createExpressApp } from './backend/src/app.js';
import { connectDatabase } from './backend/src/config/database.js';

dotenv.config();

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Promise Rejection]:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
});

async function startServer() {
  // Create the Express backend application with all API routes mounted
  const app = createExpressApp();
  const PORT = parseInt(
    process.env.PORT || process.env.DEFAULT_APP_PORT || '3000',
    10
  );

  // Vite middleware for development / static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err && !res.headersSent) {
          res
            .status(500)
            .send('Production build not found. Please run "npm run build" before starting the server.');
        }
      });
    });
  }

  // Start listening immediately so hosting health checks can reach the server
  // without waiting for MongoDB Atlas DNS/connection to complete.
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack Server] App and API running on http://0.0.0.0:${PORT}`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        const mongoose = (await import('mongoose')).default;
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close(false);
          console.log('[MongoDB] Connection closed.');
        }
      } catch (err) {
        console.error('[MongoDB] Error closing connection:', err);
      }
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  // Connect to MongoDB Atlas in the background so a slow DB connection
  // does not prevent the HTTP port from opening.
  connectDatabase().catch((error) => {
    console.error('[MongoDB] Background connection failed:', error);
  });
}

startServer().catch((error) => {
  console.error('[Server Startup Error]', error);
});
