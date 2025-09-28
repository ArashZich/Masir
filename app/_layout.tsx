import "@/i18n"; // راه‌اندازی i18next - باید اول باشه

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Updates from "expo-updates";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

import { RestartDialog } from "@/components/RestartDialog";
import { getTheme } from "@/constants/themes";
import { useBoolean } from "@/hooks/useBoolean";
import { useSettingsStore } from "@/store/settingsStore";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, useColorScheme } from "react-native";
import { notificationService } from "@/services/notificationService";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, language, notifications } = useSettingsStore();
  const { i18n } = useTranslation();
  const restartDialog = useBoolean(false);

  useEffect(() => {
    const handleLanguageChange = async () => {
      if (i18n.language !== language) {
        await i18n.changeLanguage(language);
      }

      const isRTL = language === "fa";
      if (I18nManager.isRTL !== isRTL && !restartDialog.value) {
        restartDialog.setTrue();
      }
    };

    handleLanguageChange();
  }, [language, i18n]);

  // Notification setup
  useEffect(() => {
    if (!notifications.enabled) return;

    // Setup notification listeners
    const notificationListener = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseListener = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        // Handle navigation based on notification data
        const data = response.notification.request.content.data;
        if (data?.type === 'habit' && data?.habitId) {
          console.log('Navigate to habit:', data.habitId);
        }
      }
    );

    // Schedule notifications if enabled
    if (notifications.dailyReminder.enabled) {
      notificationService.scheduleDailyReminder(notifications.dailyReminder.time, notifications.sound);
    }

    if (notifications.moodReminder.enabled) {
      notificationService.scheduleMoodReminder(notifications.moodReminder.time, notifications.sound);
    }

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [notifications]);

  const handleRestart = async () => {
    const isRTL = language === "fa";
    I18nManager.forceRTL(isRTL);
    restartDialog.setFalse();

    try {
      await Updates.reloadAsync();
      console.log("Restart would happen here");
    } catch (error) {
      console.log("Could not restart app:", error);
    }
  };

  const isDarkMode =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";
  const paperTheme = getTheme(theme, isDarkMode);

  return (
    <ThemeProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style={isDarkMode ? "light" : "dark"} />

          <RestartDialog
            visible={restartDialog.value}
            onRestart={handleRestart}
          />
          {/* <Portal.Host /> */}
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
