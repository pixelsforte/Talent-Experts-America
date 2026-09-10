import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createExpressApp } from './backend/src/app.js';
import { connectDatabase } from './backend/src/config/database.js';

dotenv.config();


async function startServer() {
  // Create the Express backend application with all API routes mounted
  const app = createExpressApp();
  // Determine port: in AI Studio container with reverse proxy (NGINX_PORT), use port 3000.
  // In standalone external deployment (e.g. Cloud Run, Render, Heroku), use process.env.PORT.
  const PORT = process.env.DEFAULT_APP_PORT
    ? parseInt(process.env.DEFAULT_APP_PORT, 10)
    : process.env.NGINX_PORT
      ? 3000
      : parseInt(process.env.PORT || '3000', 10);

  // Vite middleware for development / static serving in production
  if (process.env.NODE_ENV !== 'production') {
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
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening immediately so hosting health checks can reach the server
  // without waiting for MongoDB Atlas DNS/connection to complete.
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Full-Stack Server] App and API running on http://0.0.0.0:${PORT}`);
  });

  // Connect to MongoDB Atlas in the background so a slow DB connection
  // does not prevent the HTTP port from opening.
  connectDatabase().catch((error) => {
    console.error('[MongoDB] Background connection failed:', error);
  });
}

startServer().catch((error) => {
  console.error('[Server Startup Error]', error);
});
