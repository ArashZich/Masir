/**
 * Hook for accessing theme colors from React Native Paper
 * Uses Material Design 3 color system
 */

import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName?: keyof MD3Theme['colors']
) {
  const theme = useTheme();
  const isDark = theme.dark;

  // اگر رنگ مشخص شده توی props، از آن استفاده کن
  const colorFromProps = props[isDark ? 'dark' : 'light'];

  if (colorFromProps) {
    return colorFromProps;
  }

  // اگر نام رنگ مشخص شده، از theme paper استفاده کن
  if (colorName) {
    return theme.colors[colorName];
  }

  // پیش‌فرض
  return theme.colors.onSurface;
}

// Helper hook برای دسترسی مستقیم به theme
export function usePaperTheme() {
  return useTheme();
}
