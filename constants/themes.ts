import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// فونت‌های سفارشی (در صورت نیاز)
const fontConfig = {
  fontFamily: 'System',
};

// تم روشن (Light Theme)
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#667eea', // آبی مسیر - جذاب اما حرفه‌ای
    primaryContainer: '#e8eaf6',
    secondary: '#52c41a', // سبز طبیعت - برای موفقیت
    secondaryContainer: '#f6ffed',
    tertiary: '#ff7043', // نارنجی گرم - برای انرژی
    tertiaryContainer: '#fff3e0',
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    background: '#fafbfc',
    error: '#B3261E',
    errorContainer: '#F9DEDC',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#21005D',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#1D192B',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#31111D',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
    onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',
    onBackground: '#1C1B1F',
    onError: '#FFFFFF',
    onErrorContainer: '#410E0B',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#D0BCFF',
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(50, 47, 53, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: '#f8fafc',
      level2: '#f1f5f9',
      level3: '#e2e8f0',
      level4: '#cbd5e1',
      level5: '#94a3b8',
    },
  },
};

// تم تاریک (Dark Theme)
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8c9eff', // آبی روشن‌تر در dark mode
    primaryContainer: '#3f51b5',
    secondary: '#69db7c', // سبز روشن در dark mode
    secondaryContainer: '#2e7d32',
    tertiary: '#ff8a65', // نارنجی روشن در dark mode
    tertiaryContainer: '#bf360c',
    surface: '#1e1e1e',
    surfaceVariant: '#2a2a2a',
    surfaceDisabled: 'rgba(230, 225, 229, 0.12)',
    background: '#121212',
    error: '#F2B8B5',
    errorContainer: '#8C1D18',
    onPrimary: '#371E73',
    onPrimaryContainer: '#EADDFF',
    onSecondary: '#332D41',
    onSecondaryContainer: '#E8DEF8',
    onTertiary: '#492532',
    onTertiaryContainer: '#FFD8E4',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
    onSurfaceDisabled: 'rgba(230, 225, 229, 0.38)',
    onBackground: '#E6E1E5',
    onError: '#601410',
    onErrorContainer: '#F9DEDC',
    outline: '#938F99',
    outlineVariant: '#49454F',
    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313033',
    inversePrimary: '#6750A4',
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(50, 47, 53, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: '#262626',
      level2: '#2a2a2a',
      level3: '#2f2f2f',
      level4: '#333333',
      level5: '#404040',
    },
  },
};

// نوع تم (light, dark, system)
export type ThemeMode = 'light' | 'dark' | 'system';

// انتخاب تم بر اساس حالت
export const getTheme = (mode: ThemeMode, systemIsDark: boolean): MD3Theme => {
  switch (mode) {
    case 'light':
      return lightTheme;
    case 'dark':
      return darkTheme;
    case 'system':
      return systemIsDark ? darkTheme : lightTheme;
    default:
      return lightTheme;
  }
};