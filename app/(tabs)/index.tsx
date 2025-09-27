import { AnimatedHabitItem } from "@/components/AnimatedHabitItem";
import { GardenGrowth, calculateGrowthStage } from "@/components/GardenGrowth";
import { MicroJournal } from "@/components/MicroJournal";
import { MoodSelector } from "@/components/MoodSelector";
import { useHabitStore } from "@/store/habitStore";
import { useSettingsStore } from "@/store/settingsStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  FAB,
  ProgressBar,
  Surface,
  Text,
} from "react-native-paper";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { language } = useSettingsStore();
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header Simple */}
        <Surface style={[styles.simpleHeader, styles.whiteCard]} elevation={4}>
          <Text variant="headlineLarge" style={styles.title}>
            {t("today.yourPath")}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {new Date().toLocaleDateString(
              language === "fa" ? "fa-IR" : "en-US",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
              }
            )}
          </Text>
        </Surface>

        {/* Mood Section */}
        <Card style={[styles.moodCard, styles.whiteCard]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.moodTitle}>
              ☀️ {t("mood.title")}
            </Text>
            <MoodSelector
              selectedMood={todayMood}
              onMoodSelect={handleMoodChange}
              size="medium"
            />
          </Card.Content>
        </Card>

        {/* Journal Section */}
        <Card style={[styles.journalCard, styles.whiteCard]} mode="elevated">
          <Card.Content>
            <MicroJournal
              note={todayNote}
              onNoteChange={handleNoteChange}
              compact={false}
            />
          </Card.Content>
        </Card>

        {/* Garden Growth Section */}
        <Card style={[styles.gardenCard, styles.whiteCard]} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.gardenTitle}>
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
                    <Text variant="bodySmall" style={styles.gardenLabel}>
                      {habit.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.gardenProgress}>
                      {completedDays} {t("garden.days")}
                    </Text>
                  </View>
                );
              })}
              {habits.length === 0 && (
                <View style={styles.emptyGarden}>
                  <GardenGrowth stage={1} size={100} />
                  <Text variant="bodyMedium" style={styles.emptyGardenText}>
                    {t("garden.emptyMessage")}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Progress Overview */}
        <Card style={[styles.progressCard, styles.whiteCard]} mode="elevated">
          <Card.Content style={styles.progressContent}>
            <View style={styles.progressHeader}>
              <Text variant="titleLarge" style={styles.progressTitle}>
                {t("today.progress")}
              </Text>
              <Chip icon="target" mode="flat" textStyle={styles.chipText}>
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
                  {t("today.completed")}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statNumber}>
                  {totalCount - completedCount}
                </Text>
                <Text variant="bodyMedium" style={styles.statLabel}>
                  {t("today.remaining")}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Today's Habits */}
        <Card style={[styles.pathCard, styles.whiteCard]} mode="elevated">
          <Card.Content>
            <View style={styles.pathHeader}>
              <Text variant="titleLarge" style={styles.pathTitle}>
                🌱 {t("today.todaysGarden")}
              </Text>
            </View>

            {totalCount === 0 ? (
              <View style={styles.emptyState}>
                <Avatar.Icon size={80} icon="sprout" style={styles.emptyIcon} />
                <Text variant="bodyLarge" style={styles.emptyText}>
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
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        label={t("habit.newHabit")}
        style={styles.fab}
        color="#ffffff"
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
    backgroundColor: '#ffffff',
  },
  whiteCard: {
    backgroundColor: '#ffffff',
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
    opacity: 0.7,
  },
  moodCard: {
    margin: 16,
    marginTop: 0,
  },
  moodTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 16,
    color: "#2d3748",
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
    color: "#2d3748",
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
    color: "#2d3748",
  },
  gardenProgress: {
    textAlign: "center",
    marginTop: 4,
    color: "#4CAF50",
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
    color: "#666",
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
  statLabel: {
    opacity: 0.7,
  },
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
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
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
    backgroundColor: "#667eea",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
