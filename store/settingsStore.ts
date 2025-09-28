import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from './storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'fa' | 'en';

export interface NotificationSettings {
  enabled: boolean;
  sound: string;
  dailyReminder: {
    enabled: boolean;
    time: { hour: number; minute: number };
  };
  moodReminder: {
    enabled: boolean;
    time: { hour: number; minute: number };
  };
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  sound: 'default',
  dailyReminder: {
    enabled: false,
    time: { hour: 9, minute: 0 },
  },
  moodReminder: {
    enabled: false,
    time: { hour: 20, minute: 0 },
  },
};

interface SettingsState {
  // State
  theme: ThemeMode;
  language: Language;
  notifications: NotificationSettings;
  onboardingCompleted: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  theme: 'system' as ThemeMode,
  language: 'fa' as Language,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  onboardingCompleted: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => {
        set({ theme });
      },

      setLanguage: (language) => {
        set({ language });
      },

      setNotifications: (notifications) => {
        set((state) => ({
          notifications: { ...state.notifications, ...notifications }
        }));
      },

      setOnboardingCompleted: (completed) => {
        set({ onboardingCompleted: completed });
      },

      resetSettings: () => {
        set(initialState);
      },
    }),
    {
      name: 'masir-settings',
      storage: persistStorage,
    }
  )
);