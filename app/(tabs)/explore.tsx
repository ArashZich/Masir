import { ProgressChart } from "@/components/ProgressChart";
import { ThemedCard } from "@/components/ThemedCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useBoolean } from "@/hooks/useBoolean";
import { useHabitStore } from "@/store/habitStore";
import {
  AnalyticsService,
  type MonthlyInsights,
  type StreakData,
} from "@/utils/analytics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Modal,
  Portal,
  ProgressBar,
  Text,
} from "react-native-paper";

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { habits, getHabitsForDate, history } = useHabitStore();
  const { colors, isDark } = useTheme();

  // Modal state for day details
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const modal = useBoolean(false, "calendarModal");

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

  // Handle day press
  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    modal.setTrue();
  };

  // Get selected day data
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null;

    const dayHabits = getHabitsForDate(selectedDate);
    const dayEntry = history[selectedDate];

    return {
      date: selectedDate,
      habits: dayHabits,
      mood: dayEntry?.mood || null,
      note: dayEntry?.note || "",
      completedCount: dayHabits.filter((h) => h.completed).length,
      totalCount: dayHabits.length,
    };
  }, [selectedDate, habits, history, getHabitsForDate]);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ThemedCard elevation={2} style={styles.headerCard}>
          <LinearGradient
            colors={
              isDark
                ? [colors.primary, colors.secondary]
                : ["#667eea", "#764ba2"]
            }
            style={styles.headerGradient}
          >
            <Avatar.Icon
              size={64}
              icon="chart-line"
              style={styles.headerIcon}
            />
            <Text variant="headlineMedium" style={styles.headerTitle}>
              {t("overview.title")}
            </Text>
            <Text variant="bodyLarge" style={styles.headerSubtitle}>
              {t("overview.subtitle")}
            </Text>
          </LinearGradient>
        </ThemedCard>
        <ThemedCard elevation={1} style={styles.statsCard}>
          <ThemedCard.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: colors.text.primary }]}
            >
              {t("overview.statistics")}
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Avatar.Icon
                  size={48}
                  icon="target"
                  style={[styles.statIcon, { backgroundColor: "#52c41a" }]}
                />
                <Text
                  variant="headlineSmall"
                  style={[styles.statNumber, { color: colors.text.primary }]}
                >
                  {totalHabits}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  {t("overview.totalHabits")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Avatar.Icon
                  size={48}
                  icon="check-circle"
                  style={[styles.statIcon, { backgroundColor: "#1890ff" }]}
                />
                <Text
                  variant="headlineSmall"
                  style={[styles.statNumber, { color: colors.text.primary }]}
                >
                  {completedToday}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  {t("overview.completedToday")}
                </Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text
                  variant="bodyLarge"
                  style={[styles.progressLabel, { color: colors.text.primary }]}
                >
                  {t("today.progress")}
                </Text>
                <Chip
                  icon="trophy"
                  mode="flat"
                  style={[
                    styles.progressChip,
                    {
                      backgroundColor: isDark
                        ? "rgba(82, 196, 26, 0.2)"
                        : "rgba(82, 196, 26, 0.1)",
                    },
                  ]}
                >
                  {Math.round(todayProgress * 100)}%
                </Chip>
              </View>
              <ProgressBar
                progress={todayProgress}
                style={styles.progressBar}
                color={colors.secondary}
              />
            </View>
          </ThemedCard.Content>
        </ThemedCard>
        <ThemedCard elevation={1} style={styles.calendarCard}>
          <ThemedCard.Content>
            <Text
              variant="titleLarge"
              style={[styles.cardTitle, { color: colors.text.primary }]}
            >
              {t("overview.calendar")}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.cardDescription, { color: colors.text.secondary }]}
            >
              {t("overview.calendarDescription")}
            </Text>

            <Calendar
              key={isDark ? 'dark' : 'light'}
              current={today}
              markedDates={markedDates}
              markingType="multi-dot"
              onDayPress={handleDayPress}
              theme={
                {
                  backgroundColor: colors.elevation.level1,
                  calendarBackground: colors.elevation.level1,
                  textSectionTitleColor: colors.primary,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.onPrimary,
                  todayTextColor: colors.primary,
                  dayTextColor: colors.text.primary,
                  textDisabledColor: colors.text.disabled,
                  dotColor: colors.secondary,
                  selectedDotColor: colors.onPrimary,
                  arrowColor: colors.primary,
                  disabledArrowColor: colors.text.disabled,
                  monthTextColor: colors.primary,
                  indicatorColor: colors.primary,
                  textDayFontFamily: "System",
                  textMonthFontFamily: "System",
                  textDayHeaderFontFamily: "System",
                  textDayFontWeight: "500",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "600",
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                } as any
              }
              style={[
                styles.calendar,
                {
                  backgroundColor: colors.elevation.level1,
                  borderColor: colors.border,
                },
              ]}
              hideExtraDays={true}
              firstDay={1}
            />

            <View
              style={[styles.calendarLegend, { borderTopColor: colors.border }]}
            >
              <Text
                variant="titleSmall"
                style={[styles.legendTitle, { color: colors.text.primary }]}
              >
                {t("overview.calendarLegend")}
              </Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#4CAF50" }]}
                  />
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.legendText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    😊 {t("overview.moodGood")}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#FF9800" }]}
                  />
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.legendText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    😐 {t("overview.moodOk")}
                  </Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, { backgroundColor: "#9C27B0" }]}
                  />
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.legendText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    😔 {t("overview.moodBad")}
                  </Text>
                </View>
              </View>
            </View>
          </ThemedCard.Content>
        </ThemedCard>

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
        <ThemedCard elevation={1} style={styles.insightsCard}>
          <ThemedCard.Content>
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
                <Text
                  variant="headlineSmall"
                  style={[styles.insightValue, { color: colors.text.primary }]}
                >
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
                <Text
                  variant="headlineSmall"
                  style={[styles.insightValue, { color: colors.text.primary }]}
                >
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
              <Text
                variant="titleSmall"
                style={[styles.smartTitle, { color: colors.text.primary }]}
              >
                💡 {t("charts.insights")}
              </Text>
              {insightMessages.map((message, index) => (
                <Text
                  key={index}
                  variant="bodySmall"
                  style={[
                    styles.smartMessage,
                    {
                      backgroundColor: isDark
                        ? "rgba(82, 196, 26, 0.15)"
                        : "rgba(82, 196, 26, 0.1)",
                      color: colors.text.primary,
                    },
                  ]}
                >
                  {message}
                </Text>
              ))}
            </View>
          </ThemedCard.Content>
        </ThemedCard>

        {/* Streak Analytics */}
        <ThemedCard elevation={1} style={styles.streaksCard}>
          <ThemedCard.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              🔥 {t("charts.streaks")}
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              {t("insights.currentStreak")} & {t("insights.successRate")}
            </Text>

            {streakData.length > 0 ? (
              <View style={styles.streaksContainer}>
                {streakData.slice(0, 3).map((streak) => (
                  <View
                    key={streak.habitId}
                    style={[
                      styles.streakItem,
                      {
                        backgroundColor: colors.elevation.level2,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.streakHeader}>
                      <Text
                        variant="bodyLarge"
                        style={[
                          styles.streakHabitName,
                          { color: colors.text.primary },
                        ]}
                      >
                        {streak.habitName}
                      </Text>
                      <Chip
                        icon="fire"
                        mode="flat"
                        style={[
                          styles.streakChip,
                          {
                            backgroundColor: isDark
                              ? "rgba(255, 87, 34, 0.2)"
                              : "rgba(255, 87, 34, 0.1)",
                          },
                        ]}
                        textStyle={[
                          styles.streakChipText,
                          { color: "#FF5722" },
                        ]}
                      >
                        {streak.currentStreak}
                      </Chip>
                    </View>

                    <View style={styles.streakStats}>
                      <View style={styles.streakStat}>
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.streakStatLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          {t("insights.longestStreak")}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          style={[
                            styles.streakStatValue,
                            { color: colors.text.primary },
                          ]}
                        >
                          {streak.longestStreak} {t("habits.days")}
                        </Text>
                      </View>

                      <View style={styles.streakStat}>
                        <Text
                          variant="bodySmall"
                          style={[
                            styles.streakStatLabel,
                            { color: colors.text.secondary },
                          ]}
                        >
                          {t("insights.successRate")}
                        </Text>
                        <Text
                          variant="bodyMedium"
                          style={[
                            styles.streakStatValue,
                            { color: colors.text.primary },
                          ]}
                        >
                          {streak.successRate}%
                        </Text>
                      </View>
                    </View>

                    <ProgressBar
                      progress={streak.successRate / 100}
                      style={styles.streakProgress}
                      color={colors.secondary}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyStreaks}>
                <Avatar.Icon
                  size={60}
                  icon="chart-line"
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                />
                <Text
                  variant="bodyMedium"
                  style={[styles.emptyText, { color: colors.text.secondary }]}
                >
                  {t("habit.noHabitsYet")}
                </Text>
              </View>
            )}
          </ThemedCard.Content>
        </ThemedCard>
      </ScrollView>

      {/* Day Details Modal */}
      <Portal>
        <Modal
          visible={modal.value}
          onDismiss={modal.setFalse}
          contentContainerStyle={styles.modalContainer}
        >
          {selectedDayData && (
            <View
              style={[
                styles.modalCard,
                { backgroundColor: colors.elevation.level1 },
              ]}
            >
              {/* Header */}
              <View
                style={[
                  styles.modalHeader,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  variant="headlineSmall"
                  style={[styles.modalTitle, { color: colors.onPrimary }]}
                >
                  {new Date(selectedDayData.date).toLocaleDateString("fa-IR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              {/* Content */}
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Mood Display */}
                {selectedDayData.mood && (
                  <View
                    style={[
                      styles.modalMood,
                      { backgroundColor: colors.elevation.level2 },
                    ]}
                  >
                    <View
                      style={[
                        styles.moodIcon,
                        { backgroundColor: colors.elevation.level1 },
                      ]}
                    >
                      <Text style={styles.moodEmoji}>
                        {selectedDayData.mood === "good" && "😊"}
                        {selectedDayData.mood === "ok" && "😐"}
                        {selectedDayData.mood === "bad" && "😔"}
                      </Text>
                    </View>
                    <Text
                      variant="bodyLarge"
                      style={[styles.moodText, { color: colors.text.primary }]}
                    >
                      {selectedDayData.mood === "good" && t("mood.good")}
                      {selectedDayData.mood === "ok" && t("mood.ok")}
                      {selectedDayData.mood === "bad" && t("mood.bad")}
                    </Text>
                  </View>
                )}

                {/* Note Display */}
                {selectedDayData.note && (
                  <View
                    style={[
                      styles.modalNote,
                      {
                        backgroundColor: isDark
                          ? colors.elevation.level2
                          : "#fff5f5",
                        borderRightColor: colors.primary,
                      },
                    ]}
                  >
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.modalNoteText,
                        { color: colors.text.primary },
                      ]}
                    >
                      "{selectedDayData.note}"
                    </Text>
                  </View>
                )}

                {/* Progress Summary */}
                <View
                  style={[
                    styles.modalProgress,
                    {
                      backgroundColor: isDark
                        ? colors.elevation.level2
                        : "#f0f9ff",
                    },
                  ]}
                >
                  <View style={styles.progressHeader}>
                    <Text
                      variant="titleSmall"
                      style={[
                        styles.progressTitle,
                        { color: colors.text.primary },
                      ]}
                    >
                      {t("calendar.todayProgress")}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={[styles.progressText, { color: colors.primary }]}
                    >
                      {selectedDayData.completedCount} از{" "}
                      {selectedDayData.totalCount}
                    </Text>
                  </View>
                  <ProgressBar
                    progress={
                      selectedDayData.totalCount > 0
                        ? selectedDayData.completedCount /
                          selectedDayData.totalCount
                        : 0
                    }
                    color={colors.primary}
                    style={styles.modalProgressBar}
                  />
                </View>

                {/* Habits List */}
                {selectedDayData.habits.length > 0 && (
                  <View style={styles.habitsSection}>
                    <Text
                      variant="titleSmall"
                      style={[
                        styles.sectionTitle,
                        { color: colors.text.primary },
                      ]}
                    >
                      {t("habits.title")}
                    </Text>

                    {selectedDayData.habits.map((habit) => (
                      <View
                        key={habit.id}
                        style={[
                          styles.habitItem,
                          {
                            backgroundColor: colors.elevation.level1,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <View style={styles.habitIcon}>
                          {habit.completed ? (
                            <Text style={styles.completedIcon}>✓</Text>
                          ) : (
                            <View style={styles.incompleteIcon} />
                          )}
                        </View>
                        <View style={styles.habitInfo}>
                          <Text
                            variant="bodyMedium"
                            style={[
                              styles.habitName,
                              { color: colors.text.primary },
                              habit.completed && styles.completedHabit,
                            ]}
                          >
                            {habit.name}
                          </Text>
                          {habit.description && (
                            <Text
                              variant="bodySmall"
                              style={[
                                styles.habitCategory,
                                { color: colors.text.secondary },
                              ]}
                            >
                              {habit.description}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {selectedDayData.habits.length === 0 && (
                  <View style={styles.emptyHabits}>
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.emptyHabitsText,
                        { color: colors.text.secondary },
                      ]}
                    >
                      {t("calendar.noHabitsForDay")}
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Footer */}
              <View
                style={[
                  styles.modalFooter,
                  {
                    backgroundColor: colors.elevation.level2,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <Button
                  mode="contained"
                  onPress={modal.setFalse}
                  style={[
                    styles.closeButton,
                    { backgroundColor: colors.primary },
                  ]}
                  labelStyle={[
                    styles.closeButtonText,
                    { color: colors.onPrimary },
                  ]}
                >
                  {t("calendar.close")}
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
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
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  calendarLegend: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  legendTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 12,
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
  },
  smartInsights: {
    paddingTop: 8,
  },
  smartTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  smartMessage: {
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
  // Modal styles - Complete redesign
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "95%",
    height: "85%",
    maxWidth: 450,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: "#667eea",
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  modalMood: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  moodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodText: {
    fontWeight: "600",
    color: "#2d3748",
  },
  modalNote: {
    backgroundColor: "#fff5f5",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderRightWidth: 4,
    borderRightColor: "#667eea",
  },
  modalNoteText: {
    fontStyle: "italic",
    color: "#4a5568",
    lineHeight: 22,
  },
  modalProgress: {
    backgroundColor: "#f0f9ff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  progressTitle: {
    fontWeight: "600",
    color: "#2d3748",
    fontSize: 16,
  },
  progressText: {
    color: "#667eea",
    fontWeight: "600",
    fontSize: 15,
  },
  modalProgressBar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
  },
  habitsSection: {
    marginBottom: 16,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  habitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  completedIcon: {
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "#10b981",
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "bold",
  },
  incompleteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#cbd5e0",
    backgroundColor: "#f7fafc",
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
    fontSize: 15,
  },
  completedHabit: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  habitCategory: {
    color: "#718096",
    fontSize: 13,
  },
  emptyHabits: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyHabitsText: {
    fontStyle: "italic",
  },
  modalFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  closeButton: {
    backgroundColor: "#667eea",
    borderRadius: 12,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
