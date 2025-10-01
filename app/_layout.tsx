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
import { useNotifications } from "@/hooks/useNotifications";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme, onboardingCompleted } = useSettingsStore();
  const { permission, requestPermission } = useNotifications();
  const [splashVisible, setSplashVisible] = useState(true);

  // Check permission on first launch (don't automatically request)
  useEffect(() => {
    const checkInitialPermission = async () => {
      // Just check permission status, don't request automatically
      // User will request permission from settings when they enable notifications
      console.log("📱 App launched - Permission status:", permission.status);
    };

    checkInitialPermission();
  }, []);

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
