import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';
import { WelcomeIcon } from '../icons/WelcomeIcon';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeScreenProps {
  onLanguageSelect: (language: 'fa' | 'en') => void;
}

export default function WelcomeScreen({ onLanguageSelect }: WelcomeScreenProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Welcome Icon */}
      <View style={styles.iconContainer}>
        <WelcomeIcon size={120} color={colors.onPrimary} />
      </View>

      {/* App Name */}
      <View style={styles.textContainer}>
        <Text variant="displayLarge" style={[styles.title, { color: colors.onPrimary }]}>
          🗺️ مسیر
        </Text>
        <Text variant="displayLarge" style={[styles.title, { color: colors.onPrimary }]}>
          Masir
        </Text>
      </View>

      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <Text variant="titleMedium" style={[styles.languageTitle, { color: colors.onPrimary }]}>
          زبان / Language
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => onLanguageSelect('fa')}
            buttonColor={colors.onPrimary}
            textColor={colors.primary}
            style={styles.languageButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            🇮🇷 فارسی
          </Button>

          <Button
            mode="contained"
            onPress={() => onLanguageSelect('en')}
            buttonColor={colors.onPrimary}
            textColor={colors.primary}
            style={styles.languageButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            🇺🇸 English
          </Button>
        </View>
      </View>

      {/* Decorative Elements */}
      <View style={[styles.decorativeCircle1, { backgroundColor: `${colors.onPrimary}15` }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: `${colors.onPrimary}10` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  subtitle: {
    opacity: 0.9,
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '300',
  },
  languageContainer: {
    alignItems: 'center',
    width: '100%',
  },
  languageTitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  languageButton: {
    minWidth: 120,
    borderRadius: 16,
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
});