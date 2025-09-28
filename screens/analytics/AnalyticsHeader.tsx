import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedCard } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsStyles as styles } from '@/styles/analytics.styles';

export const AnalyticsHeader: React.FC = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <ThemedCard elevation={2} style={styles.headerCard}>
      <LinearGradient
        colors={
          isDark
            ? [colors.primary, colors.secondary]
            : ["#667eea", "#764ba2"]
        }
        style={styles.headerGradient}
      >
        <Avatar.Icon
          size={64}
          icon="chart-line"
          style={styles.headerIcon}
        />
        <Text variant="headlineMedium" style={styles.headerTitle}>
          {t("overview.title")}
        </Text>
        <Text variant="bodyLarge" style={styles.headerSubtitle}>
          {t("overview.subtitle")}
        </Text>
      </LinearGradient>
    </ThemedCard>
  );
};