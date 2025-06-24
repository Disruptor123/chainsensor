import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'dark' | 'light' | 'auto';
  accentColor: string;
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [accentColor, setAccentColor] = useState('yellow');

  return (
    <ThemeContext.Provider value={{
      theme,
      accentColor,
      setTheme,
      setAccentColor
    }}>
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