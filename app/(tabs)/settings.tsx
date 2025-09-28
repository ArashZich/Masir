import { ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import {
  SettingsHeader,
  ThemeSection,
  LanguageSection,
  NotificationSection,
  ExportSection,
} from '@/screens/settings';
import { settingsStyles as styles } from '@/styles/settings.styles';

export default function SettingsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <SettingsHeader styles={styles} />
      <ThemeSection />
      <LanguageSection />
      <NotificationSection styles={styles} />
      <ExportSection styles={styles} />
    </ScrollView>
  );
}