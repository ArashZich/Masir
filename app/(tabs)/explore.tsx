import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Surface, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function ExploreScreen() {
  const { t, i18n } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.header} elevation={2}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('navigation.overview')}
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          {i18n.language === 'fa' ? '📊 آمار و پیشرفت' : '📊 Stats & Progress'}
        </Text>
      </Surface>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            {i18n.language === 'fa' ? '📅 تقویم' : '📅 Calendar'}
          </Text>
          <Text variant="bodyLarge" style={styles.cardDescription}>
            {i18n.language === 'fa'
              ? 'تقویم شمسی و میلادی با نمایش پیشرفت روزانه'
              : 'Persian and Gregorian calendar with daily progress'
            }
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            {i18n.language === 'fa' ? '📈 آمار هفتگی' : '📈 Weekly Stats'}
          </Text>
          <Text variant="bodyLarge" style={styles.cardDescription}>
            {i18n.language === 'fa'
              ? 'نمودار پیشرفت و تحلیل عملکرد هفتگی'
              : 'Progress charts and weekly performance analysis'
            }
          </Text>
        </Card.Content>
      </Card>

      <Surface style={styles.featuresList} elevation={1}>
        <List.Section>
          <List.Subheader>
            {i18n.language === 'fa' ? 'ویژگی‌های آینده' : 'Coming Features'}
          </List.Subheader>
          <List.Item
            title={i18n.language === 'fa' ? 'نمودار پیشرفت' : 'Progress Charts'}
            left={() => <List.Icon icon="chart-line" />}
          />
          <List.Item
            title={i18n.language === 'fa' ? 'تقویم تعاملی' : 'Interactive Calendar'}
            left={() => <List.Icon icon="calendar" />}
          />
          <List.Item
            title={i18n.language === 'fa' ? 'آمار ماهانه' : 'Monthly Statistics'}
            left={() => <List.Icon icon="calendar-month" />}
          />
        </List.Section>
      </Surface>
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
  featuresList: {
    margin: 8,
    marginTop: 16,
    borderRadius: 12,
  },
});