import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { PhilosophyIcon } from '../icons/PhilosophyIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PhilosophyScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Philosophy Icon */}
      <View
        style={styles.iconContainer}
      >
        <PhilosophyIcon size={100} color={colors.onPrimary} />
      </View>

      {/* Main Title */}
      <View
        style={styles.titleContainer}
      >
        <Text variant="headlineLarge" style={[styles.title, { color: colors.onPrimary }]}>
          {t('onboarding.philosophy.title')}
        </Text>
      </View>

      {/* Philosophy Points */}
      <View
        style={styles.contentContainer}
      >
        <View style={styles.philosophyPoint}>
          <Text variant="headlineSmall" style={[styles.pointEmoji, { color: colors.onPrimary }]}>
            🌊
          </Text>
          <Text variant="titleMedium" style={[styles.pointText, { color: colors.onPrimary }]}>
            {t('onboarding.philosophy.point1')}
          </Text>
        </View>

        <View style={styles.philosophyPoint}>
          <Text variant="headlineSmall" style={[styles.pointEmoji, { color: colors.onPrimary }]}>
            🌱
          </Text>
          <Text variant="titleMedium" style={[styles.pointText, { color: colors.onPrimary }]}>
            {t('onboarding.philosophy.point2')}
          </Text>
        </View>

        <View style={styles.philosophyPoint}>
          <Text variant="headlineSmall" style={[styles.pointEmoji, { color: colors.onPrimary }]}>
            💭
          </Text>
          <Text variant="titleMedium" style={[styles.pointText, { color: colors.onPrimary }]}>
            {t('onboarding.philosophy.point3')}
          </Text>
        </View>
      </View>

      {/* Quote */}
      <View
        style={styles.quoteContainer}
      >
        <Text variant="bodyLarge" style={[styles.quote, { color: colors.onPrimary }]}>
          "{t('onboarding.philosophy.quote')}"
        </Text>
      </View>

      {/* Decorative Wave */}
      <View
        style={[styles.decorativeWave, { backgroundColor: `${colors.onPrimary}10` }]}
      />
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
    marginBottom: 32,
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    width: '100%',
    marginBottom: 40,
  },
  philosophyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  pointEmoji: {
    marginRight: 16,
    marginTop: 2,
  },
  pointText: {
    flex: 1,
    lineHeight: 24,
    opacity: 0.95,
  },
  quoteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  quote: {
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  decorativeWave: {
    position: 'absolute',
    bottom: 50,
    left: -100,
    right: -100,
    height: 80,
    borderRadius: 40,
    transform: [{ rotate: '-15deg' }],
  },
});