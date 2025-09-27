import { StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Surface, List, Divider, SegmentedButtons } from 'react-native-paper';
import { useSettingsStore, type ThemeMode, type Language } from '@/store/settingsStore';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, language, setTheme, setLanguage } = useSettingsStore();

  const themeOptions = [
    { value: 'light', label: t('theme.light'), icon: 'white-balance-sunny' },
    { value: 'dark', label: t('theme.dark'), icon: 'weather-night' },
    { value: 'system', label: t('theme.system'), icon: 'brightness-auto' },
  ];

  const languageOptions = [
    { value: 'fa', label: t('language.persian'), icon: 'translate' },
    { value: 'en', label: t('language.english'), icon: 'translate' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={[styles.header, styles.whiteCard]} elevation={4}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('settings.title')}
        </Text>
      </Surface>

      {/* Theme Selection */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.theme')}
          </Text>
          <SegmentedButtons
            value={theme}
            onValueChange={(value) => setTheme(value as ThemeMode)}
            buttons={themeOptions}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#667eea',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
        </Card.Content>
      </Card>

      {/* Language Selection */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.language')}
          </Text>
          <SegmentedButtons
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
            buttons={languageOptions}
            style={styles.segmentedButtons}
            theme={{
              colors: {
                secondaryContainer: '#667eea',
                onSecondaryContainer: '#ffffff',
              }
            }}
          />
        </Card.Content>
      </Card>

      {/* Data Section */}
      <Card style={[styles.card, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('settings.data')}
          </Text>
          <List.Item
            title={t('backup.export')}
            description={t('backup.description')}
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Export data')}
            style={styles.listItem}
          />
          <List.Item
            title={t('backup.import')}
            left={(props) => <List.Icon {...props} icon="upload" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Import data')}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginTop: 8,
  },
  listItem: {
    paddingHorizontal: 0,
  },
});