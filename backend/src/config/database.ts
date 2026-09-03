import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Prevent Mongoose from silently buffering API operations while the database is unavailable.
mongoose.set('bufferCommands', false);

let isConnected = false;
let connectionPromise: Promise<boolean> | null = null;
let nextConnectionAttemptAt = 0;
const CONNECTION_RETRY_BACKOFF_MS = 30000;

function sanitizeMongoUri(rawUri: string): string {
  let uri = rawUri.trim();

  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }

  // Handle common Atlas copy/paste placeholders such as <password>.
  uri = uri.replace(/:\s*<([^>]+)>\s*@/, (_match, password) =>
    `:${encodeURIComponent(String(password).trim())}@`
  );

  return uri;
}

export async function connectDatabase(): Promise<boolean> {
  try {
    dotenv.config();
  } catch {
    // Environment variables may already be supplied by the hosting platform.
  }

  // Prefer MONGODB_URI; keep MONGODB_URL for backwards compatibility.
  // MONGODB_DIRECT_URI can be supplied by the host if SRV DNS is unavailable.
  const rawUri = process.env.MONGODB_DIRECT_URI || process.env.MONGODB_URI || process.env.MONGODB_URL;

  if (!rawUri || !rawUri.trim()) {
    console.warn('[MongoDB] MONGODB_DIRECT_URI / MONGODB_URI / MONGODB_URL is not configured. Database features are unavailable.');
    isConnected = false;
    return false;
  }

  if (isConnected && mongoose.connection.readyState === 1) return true;
  if (connectionPromise) return connectionPromise;
  if (Date.now() < nextConnectionAttemptAt) return false;

  const uri = sanitizeMongoUri(rawUri);

  connectionPromise = (async () => {
    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas...');

      // Do not override the container's DNS servers. Atlas mongodb+srv URIs require
      // SRV DNS resolution, and PaaS/container DNS is often required for that lookup.
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 8000),
        connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 8000),
        socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 45000),
        maxPoolSize: 10,
        minPoolSize: 0,
        retryWrites: true,
      });

      isConnected = true;
      nextConnectionAttemptAt = 0;
      console.log('[MongoDB] Successfully connected to database:', mongoose.connection.name);
      return true;
    } catch (error) {
      isConnected = false;
      nextConnectionAttemptAt = Date.now() + CONNECTION_RETRY_BACKOFF_MS;
      console.error('[MongoDB] Failed to connect to MongoDB Atlas:', error);
      return false;
    } finally {
      connectionPromise = null;
    }
  })();

  return connectionPromise;
}

mongoose.connection.on('error', (error) => {
  isConnected = false;
  console.error('[MongoDB] Connection error event:', error);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[MongoDB] Connection re-established.');
});

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getDatabaseState(): {
  connected: boolean;
  state: string;
  name?: string;
  host?: string;
} {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;

  return {
    connected: stateCode === 1,
    state: states[stateCode] || 'unknown',
    name: mongoose.connection.name,
    host: mongoose.connection.host,
  };
}
