export const authService = {
  getSession(): null | { user: { id: string; name: string | null; email: string | null; role: string | null } } {
    const stored = localStorage.getItem('uptime_auth');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  },
  login: async (_credentials: { email: string; password: string }) => {
    const stored = localStorage.getItem('uptime_auth');
    if (stored) {
      const user = JSON.parse(stored).user;
      return { user };
    }
    return { user: null };
  },
  register: async (_data: { fullName: string; email: string; password: string; confirmPassword: string; accountType: string; companyName?: string }) => {
    const stored = localStorage.getItem('uptime_auth');
    if (stored) {
      const user = JSON.parse(stored).user;
      return { user };
    }
    return { user: null };
  },
  logout: async () => {
    localStorage.removeItem('uptime_auth');
  },
};