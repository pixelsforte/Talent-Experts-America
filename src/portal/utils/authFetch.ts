export const AUTH_TOKEN_KEY = 'ad_admin_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to save auth token to localStorage', err);
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (err) {
    console.error('Failed to remove auth token from localStorage', err);
  }
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const callerSignal = options.signal;

  const abortFromCaller = () => controller.abort();
  if (callerSignal) {
    if (callerSignal.aborted) controller.abort();
    else callerSignal.addEventListener('abort', abortFromCaller, { once: true });
  }

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      credentials: 'include',
    });
  } catch (error: any) {
    if (controller.signal.aborted && !callerSignal?.aborted) {
      const timeoutError = new Error(`Request timed out after ${timeoutMs / 1000} seconds.`);
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    callerSignal?.removeEventListener('abort', abortFromCaller);
  }
}
