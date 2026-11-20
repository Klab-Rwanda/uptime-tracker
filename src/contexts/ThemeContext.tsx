import { createContext, useContext, useEffect, useCallback, ReactNode, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

interface ThemeContextType {
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'uptime_appearance';

const getSystemDark = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyAppearance = (appearance: Appearance) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (appearance === 'dark') {
    root.classList.add('dark');
  } else if (appearance === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    if (getSystemDark()) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>('system');
  const [isDark, setIsDark] = useState(false);

  // Load saved appearance on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
      setAppearanceState(saved as Appearance);
    }
    applyAppearance(saved as Appearance || 'system');
  }, []);

  // Apply appearance whenever it changes
  useEffect(() => {
    applyAppearance(appearance);
  }, [appearance]);

  // Listen for system theme changes when appearance is 'system'
  useEffect(() => {
    if (appearance !== 'system') return;
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyAppearance('system');
      setIsDark(getSystemDark());
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [appearance]);

  // Update isDark state
  useEffect(() => {
    setIsDark(getSystemDark() || appearance === 'dark');
  }, [appearance]);

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ appearance, setAppearance, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}