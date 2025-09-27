import { AnimatedHabitItem } from "@/components/AnimatedHabitItem";
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
  const { getHabitsForDate, toggleHabitCompletion, habits } = useHabitStore();

  const today = new Date().toISOString().split("T")[0];
  const todayHabits = getHabitsForDate(today);
  const completedCount = todayHabits.filter((h) => h.completed).length;
  const totalCount = todayHabits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const handleHabitToggle = (habitId: string) => {
    toggleHabitCompletion(habitId, today);
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
        <Surface style={styles.simpleHeader} elevation={1}>
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

        {/* Progress Overview */}
        <Card style={styles.progressCard} mode="elevated">
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

        {/* Today's Path */}
        <Card style={styles.pathCard} mode="contained">
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
    marginHorizontal: 16,
    marginBottom: 16,
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
