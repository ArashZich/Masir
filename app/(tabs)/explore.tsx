import { ProgressChart } from "@/components/ProgressChart";
import { useHabitStore } from "@/store/habitStore";
import {
  AnalyticsService,
  type MonthlyInsights,
  type StreakData,
} from "@/utils/analytics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  Avatar,
  Card,
  Chip,
  Divider,
  ProgressBar,
  Text,
} from "react-native-paper";

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { habits, getHabitsForDate, history } = useHabitStore();

  // Analytics calculations
  const streakData: StreakData[] = useMemo(
    () => AnalyticsService.calculateStreaks(habits, history),
    [habits, history]
  );

  const monthlyInsights: MonthlyInsights = useMemo(
    () => AnalyticsService.generateMonthlyInsights(habits, history),
    [habits, history]
  );

  // const weeklyTrend = useMemo(() =>
  //   AnalyticsService.getWeeklyTrend(habits, history), [habits, history]
  // );

  const insightMessages = useMemo(
    () => AnalyticsService.generateInsightMessages(monthlyInsights, streakData),
    [monthlyInsights, streakData]
  );

  const totalHabits = habits.length;

  const today = new Date().toISOString().split("T")[0];
  const todayHabits = getHabitsForDate(today);
  const completedToday = todayHabits.filter((h) => h.completed).length;
  const todayProgress =
    todayHabits.length > 0 ? completedToday / todayHabits.length : 0;

  // Calendar marking logic
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark today
    marked[today] = {
      selected: true,
      selectedColor: "#667eea",
      selectedTextColor: "#ffffff",
    };

    // Mark days with mood and progress
    Object.keys(history).forEach((date) => {
      const dayEntry = history[date];
      const dayHabits = getHabitsForDate(date);
      const dayCompleted = dayHabits.filter((h) => h.completed).length;
      const dayTotal = dayHabits.length;

      // Priority 1: Show mood if available
      if (dayEntry?.mood) {
        const moodColors = {
          good: "#4CAF50", // Gentle green
          ok: "#FF9800", // Warm orange
          bad: "#9C27B0", // Soft purple instead of harsh red
        };

        if (date === today) {
          marked[date] = {
            ...marked[date],
            dots: [{ color: moodColors[dayEntry.mood] }],
          };
        } else {
          marked[date] = {
            dots: [{ color: moodColors[dayEntry.mood] }],
            marked: true,
          };
        }
      }
      // Priority 2: Show habit progress if no mood but has habits
      else if (dayTotal > 0) {
        const dayProgress = dayCompleted / dayTotal;
        // Gentler progress colors
        const progressColor =
          dayProgress === 1
            ? "#81C784"
            : dayProgress > 0.5
            ? "#FFB74D"
            : "#CE93D8";

        if (date === today) {
          marked[date] = {
            ...marked[date],
            dots: [{ color: progressColor }],
          };
        } else {
          marked[date] = {
            dots: [{ color: progressColor }],
            marked: true,
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
          colors={["#667eea", "#764ba2"]}
          style={styles.headerGradient}
        >
          <Avatar.Icon size={64} icon="chart-line" style={styles.headerIcon} />
          <Text variant="headlineMedium" style={styles.headerTitle}>
            {t("overview.title")}
          </Text>
          <Text variant="bodyLarge" style={styles.headerSubtitle}>
            {t("overview.subtitle")}
          </Text>
        </LinearGradient>
      </Card>
      <Card style={[styles.statsCard, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            {t("overview.statistics")}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Avatar.Icon
                size={48}
                icon="target"
                style={[styles.statIcon, { backgroundColor: "#52c41a" }]}
              />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {totalHabits}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                {t("overview.totalHabits")}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Avatar.Icon
                size={48}
                icon="check-circle"
                style={[styles.statIcon, { backgroundColor: "#1890ff" }]}
              />
              <Text variant="headlineSmall" style={styles.statNumber}>
                {completedToday}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>
                {t("overview.completedToday")}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text variant="bodyLarge" style={styles.progressLabel}>
                {t("today.progress")}
              </Text>
              <Chip icon="trophy" mode="flat" style={styles.progressChip}>
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
            {t("overview.calendar")}
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {t("overview.calendarDescription")}
          </Text>

          <Calendar
            current={today}
            markedDates={markedDates}
            markingType="multi-dot"
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#667eea",
              selectedDayBackgroundColor: "#667eea",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#667eea",
              dayTextColor: "#2d3748",
              textDisabledColor: "#cbd5e0",
              dotColor: "#52c41a",
              selectedDotColor: "#ffffff",
              arrowColor: "#667eea",
              disabledArrowColor: "#cbd5e0",
              monthTextColor: "#667eea",
              indicatorColor: "#667eea",
              textDayFontFamily: "System",
              textMonthFontFamily: "System",
              textDayHeaderFontFamily: "System",
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
            hideExtraDays={true}
            firstDay={1}
          />

          <View style={styles.calendarLegend}>
            <Text variant="titleSmall" style={styles.legendTitle}>
              {t("overview.calendarLegend")}
            </Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
                />
                <Text variant="bodySmall" style={styles.legendText}>
                  😊 {t("overview.moodGood")}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#FF9800" }]}
                />
                <Text variant="bodySmall" style={styles.legendText}>
                  😐 {t("overview.moodOk")}
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#9C27B0" }]}
                />
                <Text variant="bodySmall" style={styles.legendText}>
                  😔 {t("overview.moodBad")}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Progress Charts */}
      <ProgressChart
        type="line"
        title={t("charts.weeklyTrend")}
        period="week"
      />

      <ProgressChart
        type="bar"
        title={t("charts.monthlyProgress")}
        period="month"
      />

      <ProgressChart
        type="pie"
        title={t("charts.moodDistribution")}
        period="month"
      />

      {/* Monthly Insights */}
      <Card style={[styles.insightsCard, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            📊 {t("insights.title")}
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {t("insights.monthly")} - {t("charts.last30Days")}
          </Text>

          <View style={styles.insightsGrid}>
            <View style={styles.insightItem}>
              <Avatar.Icon
                size={40}
                icon="percent"
                style={[styles.insightIcon, { backgroundColor: "#52c41a" }]}
              />
              <Text variant="headlineSmall" style={styles.insightValue}>
                {monthlyInsights.avgCompletionRate}%
              </Text>
              <Text variant="bodySmall" style={styles.insightLabel}>
                {t("insights.avgCompletion")}
              </Text>
            </View>

            <View style={styles.insightItem}>
              <Avatar.Icon
                size={40}
                icon="target"
                style={[styles.insightIcon, { backgroundColor: "#667eea" }]}
              />
              <Text variant="headlineSmall" style={styles.insightValue}>
                {monthlyInsights.totalHabits}
              </Text>
              <Text variant="bodySmall" style={styles.insightLabel}>
                {t("overview.totalHabits")}
              </Text>
            </View>
          </View>

          {monthlyInsights.bestDay && (
            <View style={styles.dayInsight}>
              <Text variant="bodyMedium" style={styles.dayInsightTitle}>
                🏆 {t("insights.bestDay")}:{" "}
                {new Date(monthlyInsights.bestDay.date).toLocaleDateString()}
              </Text>
              <Text variant="bodySmall" style={styles.dayInsightValue}>
                {Math.round(monthlyInsights.bestDay.rate)}%{" "}
                {t("today.completed")}
              </Text>
            </View>
          )}

          <Divider style={styles.insightDivider} />

          {/* Smart Messages */}
          <View style={styles.smartInsights}>
            <Text variant="titleSmall" style={styles.smartTitle}>
              💡 {t("charts.insights")}
            </Text>
            {insightMessages.map((message, index) => (
              <Text key={index} variant="bodySmall" style={styles.smartMessage}>
                {message}
              </Text>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Streak Analytics */}
      <Card style={[styles.streaksCard, styles.whiteCard]} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            🔥 {t("charts.streaks")}
          </Text>
          <Text variant="bodyMedium" style={styles.cardDescription}>
            {t("insights.currentStreak")} & {t("insights.successRate")}
          </Text>

          {streakData.length > 0 ? (
            <View style={styles.streaksContainer}>
              {streakData.slice(0, 3).map((streak) => (
                <View key={streak.habitId} style={styles.streakItem}>
                  <View style={styles.streakHeader}>
                    <Text variant="bodyLarge" style={styles.streakHabitName}>
                      {streak.habitName}
                    </Text>
                    <Chip
                      icon="fire"
                      mode="flat"
                      style={styles.streakChip}
                      textStyle={styles.streakChipText}
                    >
                      {streak.currentStreak}
                    </Chip>
                  </View>

                  <View style={styles.streakStats}>
                    <View style={styles.streakStat}>
                      <Text variant="bodySmall" style={styles.streakStatLabel}>
                        {t("insights.longestStreak")}
                      </Text>
                      <Text variant="bodyMedium" style={styles.streakStatValue}>
                        {streak.longestStreak} {t("habits.days")}
                      </Text>
                    </View>

                    <View style={styles.streakStat}>
                      <Text variant="bodySmall" style={styles.streakStatLabel}>
                        {t("insights.successRate")}
                      </Text>
                      <Text variant="bodyMedium" style={styles.streakStatValue}>
                        {streak.successRate}%
                      </Text>
                    </View>
                  </View>

                  <ProgressBar
                    progress={streak.successRate / 100}
                    style={styles.streakProgress}
                    color="#52c41a"
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStreaks}>
              <Avatar.Icon
                size={60}
                icon="chart-line"
                style={styles.emptyIcon}
              />
              <Text variant="bodyMedium" style={styles.emptyText}>
                {t("habit.noHabitsYet")}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  whiteCard: {
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    margin: 16,
    marginTop: 0,
    overflow: "hidden",
  },
  headerGradient: {
    padding: 32,
    alignItems: "center",
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "#ffffff",
    opacity: 0.9,
    textAlign: "center",
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    marginBottom: 12,
  },
  statNumber: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
    opacity: 0.7,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabel: {
    fontWeight: "600",
  },
  progressChip: {
    backgroundColor: "rgba(82, 196, 26, 0.1)",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  calendarCard: {
    margin: 16,
    marginTop: 0,
  },
  cardTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  cardDescription: {
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(103, 126, 234, 0.1)",
  },
  calendarLegend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  legendTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12,
    color: "#2d3748",
  },
  legendItems: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
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
  listItem: {
    paddingVertical: 8,
  },
  insightsCard: {
    margin: 16,
    marginTop: 0,
  },
  insightsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  insightItem: {
    alignItems: "center",
    flex: 1,
  },
  insightIcon: {
    marginBottom: 8,
  },
  insightValue: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#2d3748",
  },
  insightLabel: {
    textAlign: "center",
    opacity: 0.7,
  },
  dayInsight: {
    backgroundColor: "rgba(103, 126, 234, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  dayInsightTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  dayInsightValue: {
    opacity: 0.7,
  },
  insightDivider: {
    marginVertical: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  smartInsights: {
    paddingTop: 8,
  },
  smartTitle: {
    fontWeight: "600",
    marginBottom: 12,
    color: "#2d3748",
  },
  smartMessage: {
    backgroundColor: "rgba(82, 196, 26, 0.1)",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    lineHeight: 16,
  },
  streaksCard: {
    margin: 16,
    marginTop: 0,
  },
  streaksContainer: {
    marginTop: 8,
  },
  streakItem: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(103, 126, 234, 0.1)",
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  streakHabitName: {
    fontWeight: "600",
    flex: 1,
    color: "#2d3748",
  },
  streakChip: {
    backgroundColor: "rgba(255, 87, 34, 0.1)",
  },
  streakChipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF5722",
  },
  streakStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  streakStat: {
    alignItems: "center",
  },
  streakStatLabel: {
    opacity: 0.6,
    marginBottom: 2,
  },
  streakStatValue: {
    fontWeight: "600",
  },
  streakProgress: {
    height: 6,
    borderRadius: 3,
  },
  emptyStreaks: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 16,
  },
  emptyText: {
    opacity: 0.7,
    textAlign: "center",
  },
});
