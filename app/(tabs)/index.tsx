import { StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Text, Card, Surface, FAB, Chip } from 'react-native-paper';
import { changeLanguage } from '@/i18n';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa';
    await changeLanguage(newLang);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.header} elevation={2}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('common.welcome')}
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          {t('navigation.todayPath')}
        </Text>
      </Surface>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            {i18n.language === 'fa' ? '🌱 باغچه عادت‌ها' : '🌱 Habit Garden'}
          </Text>
          <Text variant="bodyLarge" style={styles.cardDescription}>
            {i18n.language === 'fa'
              ? 'اینجا مسیر امروز شما نمایش داده خواهد شد'
              : 'Your daily path will be displayed here'
            }
          </Text>
        </Card.Content>
      </Card>

      <Surface style={styles.languageSection} elevation={1}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t('language.selectLanguage')}
        </Text>

        <Chip
          icon="translate"
          mode="outlined"
          onPress={toggleLanguage}
          style={styles.languageChip}
        >
          {i18n.language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
        </Chip>
      </Surface>

      <FAB
        icon="plus"
        label={i18n.language === 'fa' ? 'عادت جدید' : 'New Habit'}
        style={styles.fab}
        onPress={() => console.log('Add new habit')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    padding: 24,
    margin: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  card: {
    margin: 8,
    marginTop: 16,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    opacity: 0.8,
  },
  languageSection: {
    padding: 16,
    margin: 8,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  languageChip: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});