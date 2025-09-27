import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Card, Surface, List, Avatar, ProgressBar, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useHabitStore } from '@/store/habitStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { habits, getHabitsForDate, history } = useHabitStore();

  const totalHabits = habits.length;

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = getHabitsForDate(today);
  const completedToday = todayHabits.filter(h => h.completed).length;
  const todayProgress = todayHabits.length > 0 ? completedToday / todayHabits.length : 0;

  // Calendar marking logic
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark today
    marked[today] = {
      selected: true,
      selectedColor: '#667eea',
      selectedTextColor: '#ffffff'
    };

    // Mark days with mood and progress
    Object.keys(history).forEach(date => {
      const dayEntry = history[date];
      const dayHabits = getHabitsForDate(date);
      const dayCompleted = dayHabits.filter(h => h.completed).length;
      const dayTotal = dayHabits.length;

      // Priority 1: Show mood if available
      if (dayEntry?.mood) {
        const moodColors = {
          good: '#4CAF50', // Gentle green
          ok: '#FF9800',   // Warm orange
          bad: '#9C27B0'   // Soft purple instead of harsh red
        };

        if (date === today) {
          marked[date] = {
            ...marked[date],
            dots: [{ color: moodColors[dayEntry.mood] }]
          };
        } else {
          marked[date] = {
            dots: [{ color: moodColors[dayEntry.mood] }],
            marked: true
          };
        }
      }
      // Priority 2: Show habit progress if no mood but has habits
      else if (dayTotal > 0) {
        const dayProgress = dayCompleted / dayTotal;
        // Gentler progress colors
        const progressColor = dayProgress === 1 ? '#81C784' : dayProgress > 0.5 ? '#FFB74D' : '#CE93D8';

        if (date === today) {
          marked[date] = {
            ...marked[date],
            dots: [{ color: progressColor }]
          };
        } else {
          marked[date] = {
            dots: [{ color: progressColor }],
            marked: true
          };
        }
      }
    });

    return marked;
  }, [history, today, getHabitsForDate]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={[styles.headerCard, styles.whiteCard]} mode="elevated">
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <Avatar.Icon
            size={64}
            icon="chart-line"
            style={styles.headerIcon}
          />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            {t('overview.title')}
          </Text>
          <Text variant="bodyLarge" style={styles.headerSubtitle}>
            {t('overview.subtitle')}
          </Text>
        </LinearGradient>
      </Card>
      <Card style={[styles.statsCard, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t('overview.statistics')}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Avatar.Icon
                size={48}
                icon="target"
                style={[styles.statIcon, { backgroundColor: '#52c41a' }]}
              />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {totalHabits}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                {t('overview.totalHabits')}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Avatar.Icon
                size={48}
                icon="check-circle"
                style={[styles.statIcon, { backgroundColor: '#1890ff' }]}
              />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {completedToday}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                {t('overview.completedToday')}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodyLarge" style={styles.progressLabel}>
                {t('today.progress')}
              </Text>
              <Chip
                icon="trophy"
                mode="flat"
                style={styles.progressChip}
              >
                {Math.round(todayProgress * 100)}%
              </Chip>
            </View>
            <ProgressBar
              progress={todayProgress}
              style={styles.progressBar}
              color="#52c41a"
            />
          </View>
        </Card.Content>
      </Card>
      <Card style={[styles.calendarCard, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            {t('overview.calendar')}
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {t('overview.calendarDescription')}
          </Text>

          <Calendar
            current={today}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#667eea',
              selectedDayBackgroundColor: '#667eea',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#667eea',
              dayTextColor: '#2d3748',
              textDisabledColor: '#cbd5e0',
              dotColor: '#52c41a',
              selectedDotColor: '#ffffff',
              arrowColor: '#667eea',
              disabledArrowColor: '#cbd5e0',
              monthTextColor: '#667eea',
              indicatorColor: '#667eea',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
            style={styles.calendar}
            hideExtraDays={true}
            firstDay={1}
          />

          <View style={styles.calendarLegend}>
            <Text variant="titleSmall" style={styles.legendTitle}>
              {t('overview.calendarLegend')}
            </Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text variant="bodySmall" style={styles.legendText}>
                  😊 {t('overview.moodGood')}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
                <Text variant="bodySmall" style={styles.legendText}>
                  😐 {t('overview.moodOk')}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#9C27B0' }]} />
                <Text variant="bodySmall" style={styles.legendText}>
                  😔 {t('overview.moodBad')}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.featureCard, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <View style={styles.weeklyHeader}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              {t('overview.weeklyProgress')}
            </Text>
            <Chip icon="calendar-week" mode="flat" style={styles.weeklyChip}>
              7 {t('habit.days')}
            </Chip>
          </View>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {t('overview.weeklyDescription')}
          </Text>

          {/* Weekly Progress Bars */}
          <View style={styles.weeklyChart}>
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const dayHabits = getHabitsForDate(dateStr);
              const dayCompleted = dayHabits.filter(h => h.completed).length;
              const dayTotal = dayHabits.length;
              const dayProgress = dayTotal > 0 ? dayCompleted / dayTotal : 0;

              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <View key={i} style={styles.weeklyBar}>
                  <View style={styles.barContainer}>
                    <View style={[styles.barBackground, { height: 80 }]}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: Math.max(dayProgress * 80, 4),
                            backgroundColor: dateStr === today ? '#667eea' : dayProgress === 1 ? '#52c41a' : dayProgress > 0.5 ? '#FF9800' : dayProgress > 0 ? '#9C27B0' : '#e0e0e0'
                          }
                        ]}
                      />
                    </View>
                    <Text variant="bodySmall" style={styles.barPercentage}>
                      {dayTotal > 0 ? `${Math.round(dayProgress * 100)}%` : '0%'}
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={styles.barLabel}>
                    {dayName}
                  </Text>
                  <Text variant="bodySmall" style={styles.barValue}>
                    {dayTotal > 0 ? `${dayCompleted}/${dayTotal}` : '-'}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      <Surface style={styles.featuresList} elevation={1}>
        <List.Section>
          <List.Subheader style={styles.subheader}>
            ✨ {t('overview.comingFeatures')}
          </List.Subheader>
          <List.Item
            title={t('overview.progressCharts')}
            description={t('overview.progressChartsDesc')}
            left={() => <List.Icon icon="chart-line" color="#ff7043" />}
            style={styles.listItem}
          />
          <List.Item
            title={t('overview.interactiveCalendar')}
            description={t('overview.interactiveCalendarDesc')}
            left={() => <List.Icon icon="calendar" color="#9c27b0" />}
            style={styles.listItem}
          />
          <List.Item
            title={t('overview.monthlyStatistics')}
            description={t('overview.monthlyStatisticsDesc')}
            left={() => <List.Icon icon="calendar-month" color="#00bcd4" />}
            style={styles.listItem}
          />
        </List.Section>
      </Surface>
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
    paddingBottom: 100,
  },
  headerCard: {
    margin: 16,
    marginTop: 0,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 32,
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 12,
  },
  statNumber: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontWeight: '600',
  },
  progressChip: {
    backgroundColor: 'rgba(82, 196, 26, 0.1)',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  featureCard: {
    margin: 16,
    marginTop: 0,
  },
  calendarCard: {
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  weeklyChip: {
    backgroundColor: 'rgba(103, 126, 234, 0.1)',
  },
  cardDescription: {
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(103, 126, 234, 0.1)',
  },
  calendarLegend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  legendTitle: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
    color: '#2d3748',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    opacity: 0.7,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  weeklyBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  barBackground: {
    width: 28,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(103, 126, 234, 0.1)',
  },
  barPercentage: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#667eea',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
    minHeight: 4,
  },
  barLabel: {
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  barValue: {
    marginTop: 2,
    opacity: 0.7,
    textAlign: 'center',
    fontSize: 10,
  },
  featuresList: {
    marginTop: 8,
    borderRadius: 12,
  },
  subheader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listItem: {
    paddingVertical: 8,
  },
});