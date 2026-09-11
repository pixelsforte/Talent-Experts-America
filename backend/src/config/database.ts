import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Allow Mongoose standard resilient command buffering during connection phase
mongoose.set('bufferCommands', true);

let isConnected = false;
let connectionPromise: Promise<boolean> | null = null;
let nextConnectionAttemptAt = 0;
let warnedMissingUri = false;
let dnsConfigurationAttempted = false;
const CONNECTION_RETRY_BACKOFF_MS = 5000;

function resolveMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('[MongoDB] MONGODB_URI is required.');
  }
  return uri;
}

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

function configureMongoDns(): void {
  if (dnsConfigurationAttempted) return;
  dnsConfigurationAttempted = true;

  const configuredServers = process.env.MONGODB_DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (configuredServers?.length) {
    dns.setServers(configuredServers);
  }
}

export async function connectDatabase(force = false): Promise<boolean> {
  try {
    dotenv.config();
  } catch {
    // Environment variables may already be supplied by the hosting platform.
  }

  const rawUri = resolveMongoUri();

  if (isConnected && mongoose.connection.readyState === 1) return true;
  if (connectionPromise) return connectionPromise;
  if (!force && Date.now() < nextConnectionAttemptAt) return false;

  const uri = sanitizeMongoUri(rawUri);
  configureMongoDns();

  const connectOptions: mongoose.ConnectOptions = {
    dbName: 'talent_experts_america_production',
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 8000),
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 8000),
    socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 45000),
    maxPoolSize: 10,
    minPoolSize: 0,
    retryWrites: true,
  };

  connectionPromise = (async () => {
    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas...');
      await mongoose.connect(uri, connectOptions);

      isConnected = true;
      nextConnectionAttemptAt = 0;
      console.log('[MongoDB] Successfully connected to database:', mongoose.connection.name);
      return true;
    } catch (error: any) {
      console.warn('[MongoDB] Primary connection attempt failed:', error.message || error);

      isConnected = false;
      nextConnectionAttemptAt = Date.now() + CONNECTION_RETRY_BACKOFF_MS;
      console.error('[MongoDB] Failed to connect to MongoDB Atlas after all attempts.');
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
