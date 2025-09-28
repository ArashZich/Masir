import React from 'react';
import { useTranslation } from 'react-i18next';
import { Surface, Text } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsHeaderProps {
  styles: any; // Import styles from parent
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ styles }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Surface style={[styles.header, { backgroundColor: colors.elevation.level2 }]} elevation={4}>
      <Text variant="headlineLarge" style={[styles.title, { color: colors.text.primary }]}>
        {t('settings.title')}
      </Text>
    </Surface>
  );
};