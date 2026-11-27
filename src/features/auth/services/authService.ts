import { apiRequest, saveAuthTokens, TokenData } from '../../../services/apiClient';
import { AuthSession, AuthUser, LoginCredentials, RegisterData } from '../types/auth.types';

const AUTH_STORAGE_KEY = 'uptime_auth';

interface TokenEnvelope {
  data: TokenData;
}

interface ApiUser {
  id: string;
  email: string;
  full_name: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toAuthUser = (value: unknown): AuthUser => {
  const envelope = isRecord(value) && isRecord(value.data) ? value.data : value;
  const candidate = isRecord(envelope) && isRecord(envelope.user) ? envelope.user : envelope;
  if (
    !isRecord(candidate) ||
    typeof candidate.id !== 'string' ||
    typeof candidate.email !== 'string' ||
    typeof candidate.full_name !== 'string'
  ) {
    throw new Error('The API returned an invalid user profile.');
  }

  const user: ApiUser = {
    id: candidate.id,
    email: candidate.email,
    full_name: candidate.full_name,
  };
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: null,
  };
};

const isAuthSession = (value: unknown): value is AuthSession => {
  if (!isRecord(value) || !isRecord(value.user)) return false;
  return (
    typeof value.accessToken === 'string' &&
    typeof value.refreshToken === 'string' &&
    typeof value.expiresAt === 'number' &&
    typeof value.user.id === 'string' &&
    (typeof value.user.name === 'string' || value.user.name === null) &&
    (typeof value.user.email === 'string' || value.user.email === null) &&
    (typeof value.user.role === 'string' || value.user.role === null)
  );
};

export const authService = {
  getSession(): AuthSession | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
      const session: unknown = JSON.parse(stored);
      return isAuthSession(session) ? session : null;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },

  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser }> => {
    const tokenResponse = await apiRequest<TokenEnvelope>('/v1/auth/login', {
      method: 'POST',
      body: { email: credentials.email, password: credentials.password },
      authenticated: false,
    });

    const profileResponse = await apiRequest<unknown>('/v1/auth/me', {
      accessToken: tokenResponse.data.access_token,
      authenticated: false,
    });
    const user = toAuthUser(profileResponse);
    saveAuthTokens({ user }, tokenResponse.data);
    return { user };
  },

  register: async (data: RegisterData): Promise<void> => {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match.');
    }
    if (data.password.length < 12) {
      throw new Error('Password must be at least 12 characters.');
    }

    await apiRequest('/v1/auth/register', {
      method: 'POST',
      body: {
        email: data.email,
        password: data.password,
        full_name: data.fullName,
      },
      authenticated: false,
    });
  },

  verifyEmail: async (email: string, code: string): Promise<void> => {
    await apiRequest('/v1/auth/verify-email', {
      method: 'POST',
      body: { email, code },
      authenticated: false,
    });
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await apiRequest('/v1/auth/forgot-password', {
      method: 'POST',
      body: { email },
      authenticated: false,
    });
  },

  resetPassword: async (email: string, code: string, newPassword: string): Promise<void> => {
    if (newPassword.length < 12) {
      throw new Error('Password must be at least 12 characters.');
    }

    await apiRequest('/v1/auth/reset-password', {
      method: 'POST',
      body: { email, code, new_password: newPassword },
      authenticated: false,
    });
  },

  logout: async (): Promise<void> => {
    const session = authService.getSession();
    try {
      if (session) {
        await apiRequest('/v1/auth/logout', {
          method: 'POST',
          accessToken: session.accessToken,
        });
      }
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },
};
