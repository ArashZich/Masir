import React from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedButtons, Text } from 'react-native-paper';
import { ThemedCard } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettingsStore, type ThemeMode } from '@/store/settingsStore';
import { THEME_OPTIONS } from '@/constants';

export const ThemeSection: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { theme, setTheme } = useSettingsStore();

  const themeOptions = THEME_OPTIONS.map(option => ({
    value: option.value,
    label: t(option.label),
  }));

  return (
    <ThemedCard elevation={1}>
      <ThemedCard.Content>
        <Text variant="titleLarge" style={{ color: colors.text.primary, marginBottom: 16 }}>
          {t('settings.theme')}
        </Text>
        <SegmentedButtons
          value={theme}
          onValueChange={(value) => setTheme(value as ThemeMode)}
          buttons={themeOptions}
          theme={{
            colors: {
              secondaryContainer: colors.primary,
              onSecondaryContainer: colors.onPrimary,
            }
          }}
        />
      </ThemedCard.Content>
    </ThemedCard>
  );
};