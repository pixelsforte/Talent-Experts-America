import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Allow Mongoose standard resilient command buffering during connection phase
mongoose.set('bufferCommands', true);

let isConnected = false;
let connectionPromise: Promise<boolean> | null = null;
let nextConnectionAttemptAt = 0;
let warnedMissingUri = false;
const CONNECTION_RETRY_BACKOFF_MS = 30000;

function isPlaceholderUri(uri: string): boolean {
  return (
    uri.includes('<username>') ||
    uri.includes('<cluster>') ||
    uri.includes('<database>') ||
    uri.includes('username:password@') ||
    uri.includes('your_mongodb')
  );
}

function resolveMongoUri(): string | null {
  const candidates = [
    process.env.MONGODB_DIRECT_URI,
    process.env.MONGODB_URL,
    process.env.MONGODB_URI,
  ];

  for (const candidate of candidates) {
    if (candidate && candidate.trim() && !isPlaceholderUri(candidate)) {
      return candidate.trim();
    }
  }

  return null;
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

function getDirectFallbackUri(rawUri: string): string | null {
  if (process.env.MONGODB_DIRECT_URI && !isPlaceholderUri(process.env.MONGODB_DIRECT_URI)) {
    return process.env.MONGODB_DIRECT_URI.trim();
  }

  // Derive direct replica-set seed list for cluster0.tqnuuei.mongodb.net
  // to completely bypass local ISP/router DNS SRV query failures (querySrv ECONNREFUSED)
  const match = rawUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@cluster0\.tqnuuei\.mongodb\.net\/?([^?]*)/);
  if (match) {
    const [, user, pass, db] = match;
    const dbName = db || 'test';
    return `mongodb://${user}:${pass}@ac-yisda7o-shard-00-00.tqnuuei.mongodb.net:27017,ac-yisda7o-shard-00-01.tqnuuei.mongodb.net:27017,ac-yisda7o-shard-00-02.tqnuuei.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-un17fr-shard-0&authSource=admin&retryWrites=true&w=majority`;
  }

  return null;
}

export async function connectDatabase(): Promise<boolean> {
  try {
    dotenv.config();
  } catch {
    // Environment variables may already be supplied by the hosting platform.
  }

  const rawUri = resolveMongoUri();

  if (!rawUri) {
    if (!warnedMissingUri) {
      console.warn('[MongoDB] No valid MongoDB URI found. Please configure MONGODB_URL or MONGODB_URI.');
      warnedMissingUri = true;
    }
    isConnected = false;
    return false;
  }

  if (isConnected && mongoose.connection.readyState === 1) return true;
  if (connectionPromise) return connectionPromise;
  if (Date.now() < nextConnectionAttemptAt) return false;

  const uri = sanitizeMongoUri(rawUri);

  const connectOptions: mongoose.ConnectOptions = {
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
      const isDnsError =
        String(error?.message || '').includes('querySrv') ||
        error?.code === 'ECONNREFUSED' ||
        error?.code === 'EBADNAME' ||
        error?.code === 'ENOTFOUND';

      if (isDnsError) {
        console.warn('[MongoDB] Local DNS querySrv failed. Attempting connection via public DNS resolvers (8.8.8.8, 1.1.1.1)...');
        try {
          dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
          await mongoose.connect(uri, connectOptions);
          isConnected = true;
          nextConnectionAttemptAt = 0;
          console.log('[MongoDB] Successfully connected to database via public DNS:', mongoose.connection.name);
          return true;
        } catch (publicDnsError: any) {
          console.warn('[MongoDB] Public DNS querySrv also failed. Attempting direct replica-set seed list...');
          const directFallback = getDirectFallbackUri(uri);
          if (directFallback && directFallback !== uri) {
            try {
              await mongoose.connect(directFallback, connectOptions);
              isConnected = true;
              nextConnectionAttemptAt = 0;
              console.log('[MongoDB] Successfully connected via direct replica-set seed list:', mongoose.connection.name);
              return true;
            } catch (directError: any) {
              console.error('[MongoDB] Direct replica-set connection failed:', directError.message || directError);
            }
          }
        }
      }

      isConnected = false;
      nextConnectionAttemptAt = Date.now() + CONNECTION_RETRY_BACKOFF_MS;
      console.error('[MongoDB] Failed to connect to MongoDB Atlas:', error.message || error);
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
