import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// فایل‌های ترجمه
import en from './locales/en.json';
import fa from './locales/fa.json';

// منابع ترجمه
const resources = {
  en: { translation: en },
  fa: { translation: fa },
};

// تشخیص زبان‌های RTL
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

// خواندن زبان ذخیره شده از store
const getStoredLanguage = async (): Promise<string> => {
  try {
    const storedSettings = await AsyncStorage.getItem('masir-settings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      return settings.state?.language || 'fa';
    }
  } catch (error) {
    console.error('Error reading stored language:', error);
  }
  return 'fa'; // پیش‌فرض
};

// Initialize with stored language
const initializeI18n = async () => {
  const storedLanguage = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: storedLanguage,
      fallbackLng: 'fa',
      debug: __DEV__,

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false,
      },
    });

  // Set RTL based on stored language
  const isRTL = RTL_LANGUAGES.includes(storedLanguage);
  I18nManager.allowRTL(isRTL);

  // Force RTL if needed and current setting is different
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
};

// Start initialization
initializeI18n();

// تابع تغییر زبان (ساده، بدون restart)
export const changeLanguage = async (language: string): Promise<void> => {
  try {
    await i18n.changeLanguage(language);

    // فقط تنظیم جهت بدون restart
    const isRTL = RTL_LANGUAGES.includes(language);
    I18nManager.allowRTL(isRTL);
    // حذف forceRTL که باعث restart میشه

  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// تابع بررسی RTL بودن زبان فعلی
export const isCurrentLanguageRTL = (): boolean => {
  return RTL_LANGUAGES.includes(i18n.language);
};

// export پیش‌فرض
export default i18n;