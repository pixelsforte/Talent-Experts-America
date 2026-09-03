import dotenv from 'dotenv';
import { createExpressApp } from './app.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '5000', 10);

async function start() {
  const app = createExpressApp();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Backend Server] Running on http://0.0.0.0:${PORT}`);
  });

  connectDatabase().catch((err) => {
    console.error('[MongoDB] Background connection failed:', err);
  });
}

start().catch((err) => {
  console.error('[Backend Server Startup Error]', err);
});
