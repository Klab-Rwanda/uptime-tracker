import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { authService } from '../features/auth/services/authService';
import type { AuthUser, AuthState, LoginCredentials, RegisterData } from '../features/auth/types/auth.types';

export type UserRole = 'Workspace owner' | 'Administrator' | 'Operator' | 'Viewer';

export interface AuthContextType {
  user: AuthUser | null;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load existing session on mount
  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const setError = useCallback((message: string | null) => {
    setState((prev: AuthState) => ({ ...prev, error: message }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));
    try {
      const session = await authService.login(credentials);
      setState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed.';
      setState((prev: AuthState) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.register(data);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed.';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(async (email: string, code: string) => {
    setState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.verifyEmail(email, code);
      setState((prev) => ({ ...prev, isLoading: false, error: null }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email verification failed.';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    let logoutError: string | null = null;
    try {
      await authService.logout();
    } catch (error) {
      logoutError = error instanceof Error ? error.message : 'Sign out failed.';
    }
    localStorage.removeItem('uptime_auth');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: logoutError,
    });
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      signOut,
      login,
      register,
      verifyEmail,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}