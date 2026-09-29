import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentColor = 'red' | 'orange';

interface ThemeContextType {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  toggleAccentColor: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'basketdata_theme_accent';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'orange' || saved === 'red') {
        return saved;
      }
    }
    return 'red';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-accent', accentColor);
      localStorage.setItem(THEME_STORAGE_KEY, accentColor);
    }
  }, [accentColor]);

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
  };

  const toggleAccentColor = () => {
    setAccentColorState((prev) => (prev === 'red' ? 'orange' : 'red'));
  };

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, toggleAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
