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
    primary: '#6750A4', // بنفش اصلی
    primaryContainer: '#EADDFF',
    secondary: '#625B71',
    secondaryContainer: '#E8DEF8',
    tertiary: '#7D5260',
    tertiaryContainer: '#FFD8E4',
    surface: '#FFFBFE',
    surfaceVariant: '#E7E0EC',
    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    background: '#FFFBFE',
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
      level1: '#F7F2FA',
      level2: '#F2ECF4',
      level3: '#ECE6F0',
      level4: '#EAE7F0',
      level5: '#E6E0E9',
    },
  },
};

// تم تاریک (Dark Theme)
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    primaryContainer: '#4F378B',
    secondary: '#CCC2DC',
    secondaryContainer: '#4A4458',
    tertiary: '#EFB8C8',
    tertiaryContainer: '#633B48',
    surface: '#1C1B1F',
    surfaceVariant: '#49454F',
    surfaceDisabled: 'rgba(230, 225, 229, 0.12)',
    background: '#1C1B1F',
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
      level1: '#222124',
      level2: '#28272A',
      level3: '#2D2C2F',
      level4: '#2F2E31',
      level5: '#322F35',
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