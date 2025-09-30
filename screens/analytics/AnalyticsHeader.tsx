import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Surface, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';

export const AnalyticsHeader: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Surface
      style={[
        styles.simpleHeader,
        { backgroundColor: colors.elevation.level2 },
      ]}
      elevation={4}
    >
      <Text
        variant="headlineLarge"
        style={[styles.title, { color: colors.text.primary }]}
      >
        {t("overview.title")}
      </Text>
      <Text
        variant="bodyLarge"
        style={[styles.subtitle, { color: colors.text.secondary }]}
      >
        {t("overview.subtitle")}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  simpleHeader: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
  },
});