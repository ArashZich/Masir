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
import { CustomSplashScreen } from "@/components/SplashScreen";
import { getTheme } from "@/constants/themes";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
  const { scheduleHabitReminder } = useNotifications();
  const [splashVisible, setSplashVisible] = useState(true);

  // Notification setup
  useEffect(() => {
    if (!notifications.enabled) return;

    // Schedule notifications if enabled
    if (notifications.dailyReminder.enabled) {
      scheduleHabitReminder(
        'یادآوری روزانه',
        notifications.dailyReminder.time
      );
    }

    if (notifications.moodReminder.enabled) {
      scheduleHabitReminder(
        'یادآوری حالت',
        notifications.moodReminder.time
      );
    }

    // Cleanup handled by useNotifications hook
  }, [notifications, scheduleHabitReminder]);

  const handleOnboardingComplete = () => {
    // Onboarding completion is handled in the OnboardingScreen itself
    console.log("Onboarding completed!");
  };

  const isDarkMode =
    theme === "system" ? systemColorScheme === "dark" : theme === "dark";
  const paperTheme = getTheme(theme, isDarkMode);

  // Show splash screen first
  if (splashVisible) {
    return <CustomSplashScreen onFinish={() => setSplashVisible(false)} />;
  }

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
