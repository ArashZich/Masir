import '@/i18n'; // راه‌اندازی i18next - باید اول باشه

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme, I18nManager } from 'react-native';
import { getTheme } from '@/constants/themes';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import * as Restart from 'expo-restart';
import { RestartDialog } from '@/components/RestartDialog';
import { useBoolean } from '@/hooks/useBoolean';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, language } = useSettingsStore();
  const { i18n } = useTranslation();
  const restartDialog = useBoolean(false);

  useEffect(() => {
    const handleLanguageChange = async () => {
      if (i18n.language !== language) {
        await i18n.changeLanguage(language);
      }

      const isRTL = language === 'fa';
      if (I18nManager.isRTL !== isRTL && !restartDialog.value) {
        restartDialog.setTrue();
      }
    };

    handleLanguageChange();
  }, [language, i18n]);

  const handleRestart = async () => {
    const isRTL = language === 'fa';
    I18nManager.forceRTL(isRTL);
    restartDialog.setFalse();

    try {
      // expo-restart کار میکنه در هر دو حالت development و production
      await Restart.restartAsync();
    } catch (error) {
      console.log('Could not restart app:', error);
    }
  };

  const isDarkMode = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';
  const paperTheme = getTheme(theme, isDarkMode);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />

        <RestartDialog
          visible={restartDialog.value}
          onRestart={handleRestart}
        />
      </ThemeProvider>
    </PaperProvider>
  );
}
