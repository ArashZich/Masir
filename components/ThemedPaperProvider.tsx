import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useLanguage } from '@/hooks/useLanguage';
import { useSettingsStore } from '@/store/settingsStore';
import { getTheme } from '@/constants/themes';

// Prevent auto-hiding of splash screen
SplashScreen.preventAutoHideAsync();

interface ThemedPaperProviderProps {
  children: React.ReactNode;
}

export const ThemedPaperProvider: React.FC<ThemedPaperProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { currentLanguage } = useLanguage();
  const { theme } = useSettingsStore();

  // Load fonts
  const [fontsLoaded] = useFonts({
    'Vazirmatn-Regular': require('../assets/fonts/Vazirmatn-Regular.ttf'),
    'Vazirmatn-Medium': require('../assets/fonts/Vazirmatn-Medium.ttf'),
    'Vazirmatn-Bold': require('../assets/fonts/Vazirmatn-Bold.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const isDarkMode = theme === 'system'
    ? systemColorScheme === 'dark'
    : theme === 'dark';

  const paperTheme = getTheme(theme, isDarkMode, currentLanguage as 'fa' | 'en');

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};
