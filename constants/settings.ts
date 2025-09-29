// تنظیمات و گزینه‌های Settings
export const THEME_OPTIONS = [
  { label: 'settings.theme.light', value: 'light' as const },
  { label: 'settings.theme.dark', value: 'dark' as const },
  { label: 'settings.theme.system', value: 'system' as const },
] as const;

export const LANGUAGE_OPTIONS = [
  { label: 'فارسی', value: 'fa' as const, flag: '🇮🇷' },
  { label: 'English', value: 'en' as const, flag: '🇺🇸' },
] as const;

export const NOTIFICATION_SOUNDS = [
  { label: 'notifications.sounds.default', value: 'default' as const },
  { label: 'notifications.sounds.bell', value: 'bell' as const },
  { label: 'notifications.sounds.chime', value: 'chime' as const },
  { label: 'notifications.sounds.gentle', value: 'gentle' as const },
] as const;

// Default notification times
export const DEFAULT_TIMES = {
  DAILY_REMINDER: { hour: 9, minute: 0 }, // 9:00 AM
  MOOD_REMINDER: { hour: 21, minute: 0 }, // 9:00 PM
} as const;

// Time picker options
export const TIME_PICKER_CONFIG = {
  MODE: 'time' as const,
  IS_24_HOUR: true,
  DISPLAY: 'default' as const,
} as const;

// Export file formats
export const EXPORT_FORMATS = [
  { label: 'JSON', value: 'json' as const, description: 'settings.export.jsonDesc' },
  { label: 'CSV', value: 'csv' as const, description: 'settings.export.csvDesc' },
] as const;

// Animation durations
export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 200,
  },
} as const;