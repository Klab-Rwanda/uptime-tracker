import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'Workspace owner' | 'Administrator' | 'Operator' | 'Viewer';

export interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser>({
    email: 'user@example.com',
    role: 'Workspace owner',
  });

  const signOut = useCallback(() => {
    // Preserve existing sign-out behavior: clear any localStorage auth state
    localStorage.removeItem('uptime_auth');
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, signOut, isAuthenticated: !!user }}>
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