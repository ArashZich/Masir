import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from './storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'fa' | 'en';

interface SettingsState {
  // State
  theme: ThemeMode;
  language: Language;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  resetSettings: () => void;
}

const initialState = {
  theme: 'system' as ThemeMode,
  language: 'fa' as Language,
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