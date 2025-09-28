import { ThemedCard } from "@/components";
import {
  AnalyticsHeader,
  StatsSection,
  CalendarSection,
  ChartsSection,
} from "@/screens/analytics";
import { useTheme } from "@/contexts/ThemeContext";
import { useBoolean } from "@/hooks/useBoolean";
import { useLanguage } from "@/hooks/useLanguage";
import { useHabitStore } from "@/store/habitStore";
import {
  AnalyticsService,
  type MonthlyInsights,
  type StreakData,
} from "@/utils/analytics";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
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
import { analyticsStyles as styles } from "@/styles/analytics.styles";
import moment from "moment-jalaali";

// Configure moment-jalaali
moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });

export default function AnalyticsScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
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


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <AnalyticsHeader />
        <StatsSection
          totalHabits={totalHabits}
          completedToday={completedToday}
          todayProgress={todayProgress}
        />
        <CalendarSection today={today} onDayPress={handleDayPress} />

        <ChartsSection />

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
                  {isRTL
                    ? moment(selectedDayData.date).format('dddd، jD jMMMM jYYYY')
                    : moment(selectedDayData.date).format('dddd، MMMM D، YYYY')
                  }
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
                      &ldquo;{selectedDayData.note}&rdquo;
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

