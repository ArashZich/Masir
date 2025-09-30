import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore, type ThemeMode } from '@/store/settingsStore';
import { useLanguage } from '@/hooks/useLanguage';

export interface FontConfig {
  regular: string;
  medium: string;
  bold: string;
}

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;

  // Secondary colors
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;

  // Background colors
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  // Card and elevation
  elevation: {
    level0: string; // background
    level1: string; // cards
    level2: string; // elevated cards
    level3: string; // modals
    level4: string; // navigation
    level5: string; // max elevation
  };

  // Status colors
  success: string;
  successContainer: string;
  warning: string;
  warningContainer: string;
  error: string;
  errorContainer: string;

  // Border and divider
  border: string;
  divider: string;

  // Text colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };

  // Custom app colors
  mood: {
    good: string;
    ok: string;
    bad: string;
  };
}

const lightTheme: ThemeColors = {
  primary: '#667eea',
  primaryContainer: '#e0e7ff',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#1e1b4b',

  secondary: '#52c41a',
  secondaryContainer: '#f6ffed',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#135200',

  background: '#ffffff',
  onBackground: '#1a1c1e',
  surface: '#ffffff',
  onSurface: '#1a1c1e',
  surfaceVariant: '#f8fafc',
  onSurfaceVariant: '#64748b',

  elevation: {
    level0: '#ffffff',
    level1: '#ffffff',
    level2: '#fefefe',
    level3: '#fdfdfd',
    level4: '#fcfcfc',
    level5: '#fbfbfb',
  },

  success: '#10b981',
  successContainer: '#d1fae5',
  warning: '#f59e0b',
  warningContainer: '#fef3c7',
  error: '#ef4444',
  errorContainer: '#fee2e2',

  border: '#e2e8f0',
  divider: 'rgba(0, 0, 0, 0.1)',

  text: {
    primary: '#1a1c1e',
    secondary: '#64748b',
    disabled: '#94a3b8',
  },

  mood: {
    good: '#4CAF50',
    ok: '#FF9800',
    bad: '#9C27B0',
  },
};

const darkTheme: ThemeColors = {
  primary: '#8b9aff',
  primaryContainer: '#3730a3',
  onPrimary: '#000000',
  onPrimaryContainer: '#e0e7ff',

  secondary: '#7dd87d',
  secondaryContainer: '#166534',
  onSecondary: '#000000',
  onSecondaryContainer: '#bbf7d0',

  background: '#121212',
  onBackground: '#e5e7eb',
  surface: '#1e1e1e',
  onSurface: '#e5e7eb',
  surfaceVariant: '#2a2a2a',
  onSurfaceVariant: '#9ca3af',

  elevation: {
    level0: '#121212',
    level1: '#1e1e1e',
    level2: '#232323',
    level3: '#2a2a2a',
    level4: '#2f2f2f',
    level5: '#363636',
  },

  success: '#22c55e',
  successContainer: '#166534',
  warning: '#fbbf24',
  warningContainer: '#92400e',
  error: '#f87171',
  errorContainer: '#991b1b',

  border: '#374151',
  divider: 'rgba(255, 255, 255, 0.1)',

  text: {
    primary: '#f9fafb',
    secondary: '#d1d5db',
    disabled: '#6b7280',
  },

  mood: {
    good: '#66bb6a',
    ok: '#ffb74d',
    bad: '#ba68c8',
  },
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fonts: FontConfig;
  formatNumber: (num: string | number) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { theme: themeMode, setTheme } = useSettingsStore();
  const { currentLanguage } = useLanguage();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    switch (themeMode) {
      case 'light':
        setIsDark(false);
        break;
      case 'dark':
        setIsDark(true);
        break;
      case 'system':
        setIsDark(systemColorScheme === 'dark');
        break;
    }
  }, [themeMode, systemColorScheme]);

  const colors = isDark ? darkTheme : lightTheme;

  // Font configuration based on language
  const fonts: FontConfig = currentLanguage === 'fa'
    ? {
        regular: 'Vazirmatn-Regular',
        medium: 'Vazirmatn-Medium',
        bold: 'Vazirmatn-Bold',
      }
    : {
        regular: 'Montserrat-Regular',
        medium: 'Montserrat-Medium',
        bold: 'Montserrat-Bold',
      };

  // Number formatting based on language
  const formatNumber = (num: string | number): string => {
    if (currentLanguage === 'fa') {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
    }
    return String(num);
  };

  const value: ThemeContextType = {
    colors,
    isDark,
    themeMode,
    setTheme,
    fonts,
    formatNumber,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};