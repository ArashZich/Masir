import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';

// فایل‌های ترجمه
import en from './locales/en.json';
import fa from './locales/fa.json';

// تشخیص زبان پیش‌فرض سیستم
const systemLanguage = getLocales()[0]?.languageCode || 'en';

// منابع ترجمه
const resources = {
  en: { translation: en },
  fa: { translation: fa },
};

// تشخیص زبان‌های RTL
const RTL_LANGUAGES = ['fa', 'ar', 'he'];

// پیکربندی i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: systemLanguage === 'fa' ? 'fa' : 'en', // زبان پیش‌فرض
    fallbackLng: 'en', // زبان جایگزین
    debug: __DEV__, // فقط در حالت توسعه

    interpolation: {
      escapeValue: false, // React از XSS محافظت می‌کند
    },

    react: {
      useSuspense: false, // جلوگیری از مشکلات React Navigation
    },
  });

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