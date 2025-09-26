import { StyleSheet, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text, Card, Surface, FAB, Avatar, Button, Chip, ProgressBar } from 'react-native-paper';
import { useSettingsStore } from '@/store/settingsStore';
import { useHabitStore } from '@/store/habitStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { language } = useSettingsStore();
  const { getHabitsForDate } = useHabitStore();

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = getHabitsForDate(today);
  const completedCount = todayHabits.filter(h => h.completed).length;
  const totalCount = todayHabits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('today.goodMorning');
    if (hour < 17) return t('today.goodAfternoon');
    if (hour < 21) return t('today.goodEvening');
    return t('today.goodNight');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Simple */}
      <Surface style={styles.simpleHeader} elevation={1}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('today.yourPath')}
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {new Date().toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </Text>
      </Surface>

      {/* Progress Overview */}
      <Card style={styles.progressCard} mode="elevated">
        <Card.Content style={styles.progressContent}>
          <View style={styles.progressHeader}>
            <Text variant="titleLarge" style={styles.progressTitle}>
              {t('today.progress')}
            </Text>
            <Chip
              icon="target"
              mode="flat"
              textStyle={styles.chipText}
            >
              {completedCount}/{totalCount}
            </Chip>
          </View>

          <ProgressBar
            progress={progress}
            style={styles.progressBar}
            color="#52c41a"
          />

          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {completedCount}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                {t('today.completed')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={styles.statNumber}>
                {totalCount - completedCount}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                {t('today.remaining')}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Today's Path */}
      <Card style={styles.pathCard} mode="contained">
        <Card.Content>
          <View style={styles.pathHeader}>
            <Text variant="titleLarge" style={styles.pathTitle}>
              {language === 'fa' ? '🌱 باغچه امروز' : '🌱 Today\'s Garden'}
            </Text>
          </View>

          {totalCount === 0 ? (
            <View style={styles.emptyState}>
              <Avatar.Icon
                size={80}
                icon="sprout"
                style={styles.emptyIcon}
              />
              <Text variant="bodyLarge" style={styles.emptyText}>
                {language === 'fa'
                  ? 'هنوز عادتی اضافه نکرده‌اید'
                  : 'No habits added yet'
                }
              </Text>
              <Button
                mode="outlined"
                icon="plus"
                style={styles.addFirstButton}
                onPress={() => console.log('Add first habit')}
              >
                {language === 'fa' ? 'اولین عادت' : 'First Habit'}
              </Button>
            </View>
          ) : (
            <View style={styles.habitsGrid}>
              {todayHabits.map((habit, index) => (
                <Surface
                  key={habit.id}
                  style={[
                    styles.habitItem,
                    habit.completed && styles.habitCompleted
                  ]}
                  elevation={habit.completed ? 3 : 1}
                >
                  <Avatar.Icon
                    size={40}
                    icon={habit.icon}
                    style={[
                      styles.habitIcon,
                      { backgroundColor: habit.color }
                    ]}
                  />
                  <Text variant="labelMedium" style={styles.habitName}>
                    {habit.name}
                  </Text>
                </Surface>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>


      <FAB
        icon="plus"
        label={language === 'fa' ? 'عادت جدید' : 'New Habit'}
        style={styles.fab}
        color="#ffffff"
        backgroundColor="#ff7043"
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
    paddingBottom: 100,
  },
  simpleHeader: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  progressCard: {
    margin: 16,
    marginTop: 0,
  },
  progressContent: {
    paddingVertical: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontWeight: 'bold',
  },
  chipText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    opacity: 0.7,
  },
  pathCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  pathHeader: {
    marginBottom: 16,
  },
  pathTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  addFirstButton: {
    paddingHorizontal: 20,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  habitItem: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 16,
    minWidth: 100,
    marginBottom: 12,
  },
  habitCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  habitIcon: {
    marginBottom: 8,
  },
  habitName: {
    textAlign: 'center',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});