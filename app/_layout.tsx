import "@/i18n"; // راه‌اندازی i18next - باید اول باشه

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

import { OnboardingScreen } from "@/components/onboarding";
import { getTheme } from "@/constants/themes";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useLanguage } from "@/hooks/useLanguage";
import { notificationService } from "@/services/notificationService";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, notifications, onboardingCompleted } = useSettingsStore();
  const { t } = useLanguage(); // استفاده از useLanguage hook

  // Notification setup
  useEffect(() => {
    if (!notifications.enabled) return;

    // Setup notification listeners
    const notificationListener =
      notificationService.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    const responseListener =
      notificationService.addNotificationResponseReceivedListener(
        (response) => {
          console.log("Notification response:", response);
          // Handle navigation based on notification data
          const data = response.notification.request.content.data;
          if (data?.type === "habit" && data?.habitId) {
            console.log("Navigate to habit:", data.habitId);
          }
        }
      );

    // Schedule notifications if enabled
    if (notifications.dailyReminder.enabled) {
      notificationService.scheduleDailyReminder(
        notifications.dailyReminder.time,
        notifications.sound
      );
    }

    if (notifications.moodReminder.enabled) {
      notificationService.scheduleMoodReminder(
        notifications.moodReminder.time,
        notifications.sound
      );
    }

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [notifications]);

  const handleOnboardingComplete = () => {
    // Onboarding completion is handled in the OnboardingScreen itself
    console.log("Onboarding completed!");
  };

  const isDarkMode =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";
  const paperTheme = getTheme(theme, isDarkMode);

  // Show onboarding if not completed
  if (!onboardingCompleted) {
    return (
      <ThemeProvider>
        <PaperProvider theme={paperTheme}>
          <NavigationThemeProvider
            value={isDarkMode ? DarkTheme : DefaultTheme}
          >
            <OnboardingScreen onComplete={handleOnboardingComplete} />
            <StatusBar style="light" />
          </NavigationThemeProvider>
        </PaperProvider>
      </ThemeProvider>
    );
  }

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
          {/* <Portal.Host /> */}
        </NavigationThemeProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
