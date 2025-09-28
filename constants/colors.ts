// رنگ‌های اصلی پروژه
export const COLORS = {
  // رنگ‌های اصلی
  PRIMARY: '#667eea',
  PRIMARY_CONTAINER: '#e8eaf6',
  SECONDARY: '#52c41a',
  SECONDARY_CONTAINER: '#f6ffed',

  // رنگ‌های Mood
  MOOD: {
    GOOD: '#4CAF50',
    OK: '#FF9800',
    BAD: '#9C27B0',
  },

  // رنگ‌های Progress
  PROGRESS: {
    COMPLETE: '#81C784',
    PARTIAL: '#FFB74D',
    INCOMPLETE: '#CE93D8',
  },

  // رنگ‌های حالت
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',

  // رنگ‌های متن
  TEXT: {
    PRIMARY: '#1a1c1e',
    SECONDARY: '#64748b',
    DISABLED: '#94a3b8',
  },

  // رنگ‌های پس‌زمینه Light
  LIGHT: {
    BACKGROUND: '#ffffff',
    SURFACE: '#ffffff',
    SURFACE_VARIANT: '#f8fafc',
    BORDER: '#e2e8f0',
    DIVIDER: 'rgba(0, 0, 0, 0.1)',
  },

  // رنگ‌های پس‌زمینه Dark
  DARK: {
    BACKGROUND: '#121212',
    SURFACE: '#1e1e1e',
    SURFACE_VARIANT: '#2a2a2a',
    BORDER: '#374151',
    DIVIDER: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// رنگ‌های با alpha transparency
export const ALPHA_COLORS = {
  SUCCESS_LIGHT: 'rgba(82, 196, 26, 0.1)',
  SUCCESS_DARK: 'rgba(82, 196, 26, 0.15)',
  PRIMARY_LIGHT: 'rgba(103, 126, 234, 0.1)',
  PRIMARY_DARK: 'rgba(103, 126, 234, 0.15)',
} as const;