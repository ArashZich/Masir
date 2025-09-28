import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from './storage';
import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '@/services/notificationService';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'fa' | 'en';

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