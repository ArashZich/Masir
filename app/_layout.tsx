import "@/i18n"; // راه‌اندازی i18next - باید اول باشه

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { OnboardingScreen } from "@/components/onboarding";
import { CustomSplashScreen } from "@/components/SplashScreen";
import { ThemedPaperProvider } from "@/components/ThemedPaperProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, notifications, onboardingCompleted } = useSettingsStore();
  const { scheduleHabitReminder, cancelAllNotifications, permission, requestPermission } = useNotifications();
  const { t } = useLanguage();
  const [splashVisible, setSplashVisible] = useState(true);

  // Request permission on first launch
  useEffect(() => {
    const requestInitialPermission = async () => {
      if (!permission.granted && permission.canAskAgain) {
        await requestPermission();
      }
    };

    requestInitialPermission();
  }, []);

  // Notification setup
  useEffect(() => {
    const setupNotifications = async () => {
      // اگه permission نداریم، هیچ کاری نکن
      if (!permission.granted) {
        return;
      }

      // اگه notification غیرفعاله، همه رو کنسل کن
      if (!notifications.enabled) {
        await cancelAllNotifications();
        return;
      }

      // همیشه اول همه notification های قبلی رو کنسل کن
      await cancelAllNotifications();

      // حالا notification های جدید رو بساز
      if (notifications.dailyReminder.enabled) {
        await scheduleHabitReminder(
          t("notifications.messages.dailyTitle"),
          t("notifications.messages.dailyBody"),
          notifications.dailyReminder.time,
          "daily-reminder"
        );
      }

      if (notifications.moodReminder.enabled) {
        await scheduleHabitReminder(
          t("notifications.messages.moodTitle"),
          t("notifications.messages.moodBody"),
          notifications.moodReminder.time,
          "mood-reminder"
        );
      }
    };

    setupNotifications();
  }, [
    permission.granted,
    notifications.enabled,
    notifications.dailyReminder.enabled,
    notifications.dailyReminder.time.hour,
    notifications.dailyReminder.time.minute,
    notifications.moodReminder.enabled,
    notifications.moodReminder.time.hour,
    notifications.moodReminder.time.minute,
  ]);

  const handleOnboardingComplete = () => {
    // Onboarding completion is handled in the OnboardingScreen itself
    console.log("Onboarding completed!");
  };

  const isDarkMode =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";

  // Show splash screen first
  if (splashVisible) {
    return <CustomSplashScreen onFinish={() => setSplashVisible(false)} />;
  }

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return (
      <ThemeProvider>
        <ThemedPaperProvider>
          <NavigationThemeProvider
            value={isDarkMode ? DarkTheme : DefaultTheme}
          >
            <OnboardingScreen onComplete={handleOnboardingComplete} />
            <StatusBar style="light" />
          </NavigationThemeProvider>
        </ThemedPaperProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ThemedPaperProvider>
        <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          {/* <Portal.Host /> */}
        </NavigationThemeProvider>
      </ThemedPaperProvider>
    </ThemeProvider>
  );
}
