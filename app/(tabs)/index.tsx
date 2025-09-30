import {
  AnimatedHabitItem,
  GardenGrowth,
  MicroJournal,
  MoodSelector,
  ThemedCard,
} from "@/components";
import { calculateGrowthStage } from "@/components/garden/GardenGrowth";
import { useTheme } from "@/contexts/ThemeContext";
import { useCalendar } from "@/hooks/useCalendar";
import { useLanguage } from "@/hooks/useLanguage";
import { useHabitStore } from "@/store/habitStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";

// 🧪 TEST DATA - Development only
import { clearTestData, loadTestData } from "@/utils/testData";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  FAB,
  ProgressBar,
  Surface,
  Text,
} from "react-native-paper";

export default function HomeScreen() {
  const { t } = useLanguage();
  const { colors, formatNumber } = useTheme();
  const { getTodayFormatted } = useCalendar();
  const {
    getHabitsForDate,
    toggleHabitForDay,
    habits,
    history,
    getDayEntry,
    setDayMood,
    setDayNote,
  } = useHabitStore();

  const today = new Date().toISOString().split("T")[0];
  const todayHabits = getHabitsForDate(today);
  const completedCount = todayHabits.filter((h) => h.completed).length;
  const totalCount = todayHabits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // Get today's mood and note
  const todayEntry = getDayEntry(today);
  const todayMood = todayEntry?.mood || null;
  const todayNote = todayEntry?.note || "";

  const handleHabitToggle = (habitId: string) => {
    toggleHabitForDay(habitId, today);
  };

  const handleMoodChange = (mood: "good" | "ok" | "bad" | null) => {
    console.log("handleMoodChange called with:", mood, "for date:", today);
    setDayMood(today, mood);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Debug: check if it was saved
    setTimeout(() => {
      const entry = getDayEntry(today);
      console.log("Saved entry:", entry);
    }, 100);
  };

  const handleNoteChange = (note: string) => {
    console.log("handleNoteChange called with:", note, "for date:", today);
    setDayNote(today, note);
    // Debug: check if it was saved
    setTimeout(() => {
      const entry = getDayEntry(today);
      console.log("Note saved, entry:", entry);
    }, 100);
  };

  const handleHabitLongPress = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      router.push(`/add-habit?edit=${habitId}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header Simple */}
        <Surface
          style={[
            styles.simpleHeader,
            { backgroundColor: colors.elevation.level2 },
          ]}
          elevation={4}
        >
          <Text
            variant="headlineLarge"
            style={[styles.title, { color: colors.text.primary }]}
          >
            {t("today.yourPath")}
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.subtitle, { color: colors.text.secondary }]}
          >
            {getTodayFormatted()}
          </Text>

          {/* 🧪 TEST DATA BUTTONS - Development only */}
          {__DEV__ && (
            <View style={styles.testDataControls}>
              <Button
                mode="outlined"
                onPress={() => loadTestData()}
                compact
                style={styles.testButton}
              >
                📊 Load Test Data
              </Button>
              <Button
                mode="outlined"
                onPress={() => clearTestData()}
                compact
                style={styles.testButton}
              >
                🗑️ Clear Data
              </Button>
            </View>
          )}
        </Surface>

        {/* Mood Section */}
        <ThemedCard elevation={1}>
          <ThemedCard.Content>
            <Text
              variant="titleMedium"
              style={[styles.moodTitle, { color: colors.text.primary }]}
            >
              ☀️ {t("mood.title")}
            </Text>
            <MoodSelector
              selectedMood={todayMood}
              onMoodSelect={handleMoodChange}
              size="medium"
            />
          </ThemedCard.Content>
        </ThemedCard>

        {/* Journal Section */}
        <ThemedCard elevation={1}>
          <ThemedCard.Content>
            <MicroJournal
              note={todayNote}
              onNoteChange={handleNoteChange}
              compact={false}
            />
          </ThemedCard.Content>
        </ThemedCard>

        {/* Garden Growth Section */}
        <ThemedCard elevation={1}>
          <ThemedCard.Content>
            <Text
              variant="titleMedium"
              style={[styles.gardenTitle, { color: colors.text.primary }]}
            >
              🌱 {t("garden.title")}
            </Text>
            <View style={styles.gardenContainer}>
              {habits.slice(0, 4).map((habit) => {
                // محاسبه تعداد روزهای انجام شده برای این عادت
                const completedDays = Object.values(history || {}).filter(
                  (entry) => entry?.completedHabits?.includes(habit.id)
                ).length;
                const stage = calculateGrowthStage(completedDays);

                return (
                  <View key={habit.id} style={styles.gardenItem}>
                    <GardenGrowth stage={stage} size={80} />
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.gardenLabel,
                        { color: colors.text.primary },
                      ]}
                    >
                      {habit.name}
                    </Text>
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.gardenProgress,
                        { color: colors.secondary },
                      ]}
                    >
                      {formatNumber(completedDays)} {t("garden.days")}
                    </Text>
                  </View>
                );
              })}
              {habits.length === 0 && (
                <View style={styles.emptyGarden}>
                  <GardenGrowth stage={1} size={100} />
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.emptyGardenText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {t("garden.emptyMessage")}
                  </Text>
                </View>
              )}
            </View>
          </ThemedCard.Content>
        </ThemedCard>

        {/* Progress Overview */}
        <ThemedCard elevation={2}>
          <ThemedCard.Content style={styles.progressContent}>
            <View style={styles.progressHeader}>
              <Text
                variant="titleLarge"
                style={[styles.progressTitle, { color: colors.text.primary }]}
              >
                {t("today.progress")}
              </Text>
              <Chip icon="target" mode="flat" textStyle={styles.chipText}>
                {formatNumber(completedCount)}/{formatNumber(totalCount)}
              </Chip>
            </View>

            <ProgressBar
              progress={progress}
              style={styles.progressBar}
              color={colors.secondary}
            />

            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text
                  variant="headlineSmall"
                  style={[styles.statNumber, { color: colors.text.primary }]}
                >
                  {formatNumber(completedCount)}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  {t("today.completed")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text
                  variant="headlineSmall"
                  style={[styles.statNumber, { color: colors.text.primary }]}
                >
                  {formatNumber(totalCount - completedCount)}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.statLabel, { color: colors.text.secondary }]}
                >
                  {t("today.remaining")}
                </Text>
              </View>
            </View>
          </ThemedCard.Content>
        </ThemedCard>

        {/* Today's Habits */}
        <ThemedCard elevation={1}>
          <ThemedCard.Content>
            <View style={styles.pathHeader}>
              <Text
                variant="titleLarge"
                style={[styles.pathTitle, { color: colors.text.primary }]}
              >
                🌱 {t("today.todaysGarden")}
              </Text>
            </View>

            {totalCount === 0 ? (
              <View style={styles.emptyState}>
                <Avatar.Icon
                  size={80}
                  icon="sprout"
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                />
                <Text
                  variant="bodyLarge"
                  style={[styles.emptyText, { color: colors.text.secondary }]}
                >
                  {t("habit.noHabitsYet")}
                </Text>
                <Button
                  mode="outlined"
                  icon="plus"
                  style={styles.addFirstButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/add-habit");
                  }}
                >
                  {t("habit.firstHabit")}
                </Button>
              </View>
            ) : (
              <View style={styles.habitsGrid}>
                {todayHabits.map((habit) => (
                  <AnimatedHabitItem
                    key={habit.id}
                    habit={habit}
                    onComplete={handleHabitToggle}
                    onEdit={handleHabitLongPress}
                  />
                ))}
              </View>
            )}
          </ThemedCard.Content>
        </ThemedCard>
      </ScrollView>

      <FAB
        icon="plus"
        label={t("habit.newHabit")}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        customSize={56}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/add-habit");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
  },
  moodCard: {
    margin: 16,
    marginTop: 0,
  },
  moodTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
  },
  journalCard: {
    margin: 16,
    marginTop: 0,
  },
  gardenCard: {
    margin: 16,
    marginTop: 0,
  },
  gardenTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
  },
  gardenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 16,
  },
  gardenItem: {
    alignItems: "center",
    width: "45%",
    marginBottom: 12,
  },
  gardenLabel: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  gardenProgress: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 11,
  },
  emptyGarden: {
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
  },
  emptyGardenText: {
    textAlign: "center",
    marginTop: 12,
  },
  progressCard: {
    margin: 16,
    marginTop: 0,
  },
  progressContent: {
    paddingVertical: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontWeight: "bold",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {},
  pathCard: {
    margin: 16,
    marginTop: 0,
  },
  pathHeader: {
    marginBottom: 16,
  },
  pathTitle: {
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 20,
  },
  addFirstButton: {
    paddingHorizontal: 20,
  },
  habitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 12,
  },
  fab: {
    position: "absolute",
    right: 10,
    bottom: 10,
    borderRadius: 28,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // 🧪 Test data controls styles
  testDataControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  testButton: {
    borderRadius: 8,
  },
});
