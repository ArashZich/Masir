import { ThemedCard } from "@/components";
import { DayDetailsModal } from "@/components/analytics/DayDetailsModal";
import { useTheme } from "@/contexts/ThemeContext";
import { useBoolean } from "@/hooks/useBoolean";
import {
  AnalyticsHeader,
  CalendarSection,
  ChartsSection,
  StatsSection,
} from "@/screens/analytics";
import { useHabitStore } from "@/store/habitStore";
import { analyticsStyles as styles } from "@/styles/analytics.styles";
import {
  AnalyticsService,
  type MonthlyInsights,
  type StreakData,
} from "@/utils/analytics";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Avatar, Chip, Divider, ProgressBar, Text } from "react-native-paper";

export default function AnalyticsScreen() {
  const { t } = useTranslation();
  const { habits, getHabitsForDate, history } = useHabitStore();
  const { colors, isDark, formatNumber } = useTheme();

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
  }, [selectedDate, history, getHabitsForDate]);

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
                  {formatNumber(monthlyInsights.avgCompletionRate)}%
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
                  {formatNumber(monthlyInsights.totalHabits)}
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
                  {formatNumber(Math.round(monthlyInsights.bestDay.rate))}%{" "}
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
                        {formatNumber(streak.currentStreak)}
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
                          {formatNumber(streak.longestStreak)}{" "}
                          {t("habits.days")}
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
                          {formatNumber(streak.successRate)}%
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
      <DayDetailsModal
        visible={modal.value}
        onDismiss={modal.setFalse}
        dayData={selectedDayData}
      />
    </View>
  );
}
