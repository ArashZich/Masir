import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export default function ModalScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {t('settings.title')}
      </Text>

      <Text variant="bodyLarge" style={styles.description}>
        تنظیمات و گزینه‌های بیشتر در آینده اینجا خواهد بود
      </Text>

      <Button mode="outlined" onPress={() => router.back()}>
        {t('common.cancel')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  description: {
    marginBottom: 30,
    textAlign: 'center',
  },
});
