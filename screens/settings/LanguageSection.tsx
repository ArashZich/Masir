import React from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedButtons, Text } from 'react-native-paper';
import { ThemedCard } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettingsStore, type Language } from '@/store/settingsStore';
import { LANGUAGE_OPTIONS } from '@/constants';

export const LanguageSection: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { language, setLanguage } = useSettingsStore();

  const languageOptions = LANGUAGE_OPTIONS.map(option => ({
    value: option.value,
    label: `${option.flag} ${option.label}`,
  }));

  return (
    <ThemedCard elevation={1}>
      <ThemedCard.Content>
        <Text variant="titleLarge" style={{ color: colors.text.primary, marginBottom: 16 }}>
          {t('settings.language')}
        </Text>
        <SegmentedButtons
          value={language}
          onValueChange={(value) => setLanguage(value as Language)}
          buttons={languageOptions}
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