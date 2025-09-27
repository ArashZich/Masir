import "@/i18n"; // راه‌اندازی i18next - باید اول باشه

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { I18nManager, useColorScheme } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
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

      const isRTL = language === "fa";
      if (I18nManager.isRTL !== isRTL && !restartDialog.value) {
        restartDialog.setTrue();
      }
    };

    handleLanguageChange();
  }, [language, i18n]);

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
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
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
      </ThemeProvider>
    </PaperProvider>
  );
}
