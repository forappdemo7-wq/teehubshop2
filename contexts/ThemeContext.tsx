'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cardBg: string;
}

const defaultTheme: Theme = {
  primary: '#2563eb',
  secondary: '#1e40af',
  accent: '#eab308',
  background: '#f3f4f6',
  text: '#111827',
  cardBg: '#ffffff',
};

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}>({
  theme: defaultTheme,
  setTheme: () => {},
  isLoading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/theme')
      .then(res => res.json())
      .then(data => {
        setTheme({
          primary: data.primary,
          secondary: data.secondary,
          accent: data.accent,
          background: data.background,
          text: data.text,
          cardBg: data.cardBg,
        });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // Apply CSS variables globally
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-card-bg', theme.cardBg);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);