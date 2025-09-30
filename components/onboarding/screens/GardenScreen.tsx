import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { GardenGrowth, calculateGrowthStage } from '@/components/garden/GardenGrowth';

export default function GardenScreen() {
  const { colors, formatNumber } = useTheme();
  const { t } = useTranslation();
  const [daysCompleted, setDaysCompleted] = useState(0);

  const stages = useMemo(() => [
    { days: 0, duration: 1000 },
    { days: 3, duration: 1000 },
    { days: 7, duration: 1000 },
    { days: 14, duration: 1000 },
    { days: 21, duration: 1000 },
    { days: 30, duration: 1000 },
    { days: 40, duration: 1500 },
  ], []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentIndex = 0;

    const advanceStage = () => {
      if (currentIndex < stages.length - 1) {
        currentIndex++;
        setDaysCompleted(stages[currentIndex].days);
        timeoutId = setTimeout(advanceStage, stages[currentIndex].duration);
      } else {
        // Reset after completing the cycle
        setTimeout(() => {
          currentIndex = 0;
          setDaysCompleted(stages[0].days);
          timeoutId = setTimeout(advanceStage, stages[0].duration);
        }, 2000);
      }
    };

    timeoutId = setTimeout(advanceStage, stages[0].duration);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stages]);

  const currentStage = calculateGrowthStage(daysCompleted);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text variant="headlineLarge" style={[styles.title, { color: colors.onPrimary }]}>
          {t('onboarding.garden.title')}
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.onPrimary }]}>
          {t('onboarding.garden.subtitle')}
        </Text>
      </View>

      {/* Growth Demo */}
      <View style={styles.demoContainer}>
        <Text variant="titleMedium" style={[styles.watchText, { color: colors.onPrimary }]}>
          {t('onboarding.garden.watchGrowth')}
        </Text>

        <View style={styles.plantDisplay}>
          <GardenGrowth stage={currentStage} size={120} />
        </View>

        <Text variant="bodyMedium" style={[styles.currentStageText, { color: colors.onPrimary }]}>
          {daysCompleted > 0 ? `${formatNumber(daysCompleted)} ${t('common.days')}` : t('onboarding.garden.startJourney')}
        </Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text variant="bodyMedium" style={[styles.description, { color: colors.onPrimary }]}>
          {t('onboarding.garden.description')}
        </Text>
      </View>

      {/* Decorative Elements */}
      <View style={[styles.decorativeLeaf1, { backgroundColor: `${colors.onPrimary}15` }]} />
      <View style={[styles.decorativeLeaf2, { backgroundColor: `${colors.onPrimary}10` }]} />
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.9,
  },
  demoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  watchText: {
    marginBottom: 24,
    opacity: 0.9,
  },
  plantDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  currentStageText: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 16,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.85,
  },
  decorativeLeaf1: {
    position: 'absolute',
    top: 100,
    left: 20,
    width: 30,
    height: 15,
    borderRadius: 15,
    transform: [{ rotate: '30deg' }],
  },
  decorativeLeaf2: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    width: 25,
    height: 12,
    borderRadius: 12,
    transform: [{ rotate: '-45deg' }],
  },
});