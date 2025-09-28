import React from 'react';
import { SegmentedButtons, Text } from 'react-native-paper';
import { ThemedCard } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGE_OPTIONS } from '@/constants';

export const LanguageSection: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { colors } = useTheme();

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
          value={currentLanguage}
          onValueChange={(value) => changeLanguage(value as 'fa' | 'en')}
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