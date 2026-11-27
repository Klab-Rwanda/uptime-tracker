const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ??
  '/api';
const AUTH_STORAGE_KEY = 'uptime_auth';

interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  accessToken?: string;
  authenticated?: boolean;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type?: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getStoredSession = (): Record<string, unknown> | null => {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) return null;

  try {
    const parsed: unknown = JSON.parse(rawSession);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (!isRecord(payload)) return fallback;
  if (typeof payload.detail === 'string') return payload.detail;
  if (typeof payload.message === 'string') return payload.message;
  if (Array.isArray(payload.detail)) {
    const messages = payload.detail
      .filter(isRecord)
      .map((item) => item.msg)
      .filter((message): message is string => typeof message === 'string');
    if (messages.length > 0) return messages.join(', ');
  }
  return fallback;
};

const parseTokenResponse = async (response: Response): Promise<TokenData> => {
  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new Error('The API returned an invalid token response.');
  }
  const tokenData = payload.data;
  if (
    typeof tokenData.access_token !== 'string' ||
    typeof tokenData.refresh_token !== 'string' ||
    typeof tokenData.expires_in !== 'number'
  ) {
    throw new Error('The API returned an invalid token response.');
  }
  return {
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expires_in: tokenData.expires_in,
    token_type: typeof tokenData.token_type === 'string' ? tokenData.token_type : 'bearer',
  };
};

const refreshAccessToken = async (): Promise<string> => {
  const session = getStoredSession();
  if (typeof session?.refreshToken !== 'string') {
    throw new Error('Your session has expired. Please sign in again.');
  }

  const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    throw new Error('Your session has expired. Please sign in again.');
  }

  const tokens = await parseTokenResponse(response);
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    }),
  );
  return tokens.access_token;
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const authenticated = options.authenticated !== false;
  const session = authenticated ? getStoredSession() : null;
  let accessToken =
    options.accessToken ??
    (typeof session?.accessToken === 'string' ? session.accessToken : undefined);

  const send = async (token?: string) => {
    const headers = new Headers({ Accept: 'application/json' });
    if (options.body !== undefined) headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    return fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  };

  let response = await send(accessToken);
  if (response.status === 401 && authenticated) {
    accessToken = await refreshAccessToken();
    response = await send(accessToken);
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new Error(getErrorMessage(payload, `API request failed (${response.status}).`));
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

export const saveAuthTokens = (
  session: Record<string, unknown>,
  tokens: TokenData,
) => {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      ...session,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    }),
  );
};
