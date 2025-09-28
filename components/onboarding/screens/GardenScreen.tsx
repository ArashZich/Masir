import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { GardenIcon } from '../icons/GardenIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type GrowthStage = 'seed' | 'sprout' | 'leaf' | 'bud' | 'flower';

export default function GardenScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [currentStage, setCurrentStage] = useState<GrowthStage>('seed');

  const stages = [
    { stage: 'seed' as const, emoji: '🌰', duration: 1000 },
    { stage: 'sprout' as const, emoji: '🌱', duration: 1200 },
    { stage: 'leaf' as const, emoji: '🌿', duration: 1000 },
    { stage: 'bud' as const, emoji: '🌺', duration: 1200 },
    { stage: 'flower' as const, emoji: '🌸', duration: 1500 },
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const advanceStage = () => {
      if (currentIndex < stages.length - 1) {
        currentIndex++;
        setCurrentStage(stages[currentIndex].stage);
        timeoutId = setTimeout(advanceStage, stages[currentIndex].duration);
      } else {
        // Reset after completing the cycle
        setTimeout(() => {
          currentIndex = 0;
          setCurrentStage(stages[0].stage);
          timeoutId = setTimeout(advanceStage, stages[0].duration);
        }, 2000);
      }
    };

    timeoutId = setTimeout(advanceStage, stages[0].duration);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Garden Icon */}
      <View style={styles.iconContainer}>
        <GardenIcon size={100} color={colors.onPrimary} />
      </View>

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

        <View style={styles.growthStages}>
          {stages.map((stage, index) => (
            <View
              key={stage.stage}
              style={[
                styles.stageItem,
                {
                  opacity: currentStage === stage.stage ? 1 : 0.3,
                  transform: [{ scale: currentStage === stage.stage ? 1.2 : 1 }]
                }
              ]}
            >
              <Text variant="headlineLarge" style={styles.stageEmoji}>
                {stage.emoji}
              </Text>
            </View>
          ))}
        </View>

        <GrowthAnimation currentStage={currentStage} colors={colors} />
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

interface GrowthAnimationProps {
  currentStage: GrowthStage;
  colors: any;
}

function GrowthAnimation({ currentStage, colors }: GrowthAnimationProps) {
  const stageEmojis = {
    seed: '🌰',
    sprout: '🌱',
    leaf: '🌿',
    bud: '🌺',
    flower: '🌸',
  };

  return (
    <View style={styles.plantDisplay}>
      <Text variant="displayLarge" style={styles.plantEmoji}>
        {stageEmojis[currentStage]}
      </Text>
      <Text variant="bodyMedium" style={[styles.currentStageText, { color: colors.onPrimary }]}>
        {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage
      </Text>
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
  growthStages: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  stageItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  stageEmoji: {
    fontSize: 24,
  },
  plantDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  plantEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentStageText: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
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