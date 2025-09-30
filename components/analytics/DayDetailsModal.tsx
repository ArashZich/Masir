import { useTheme } from "@/contexts/ThemeContext";
import { useCalendar } from "@/hooks/useCalendar";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, ProgressBar, Text } from "react-native-paper";

interface HabitData {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
}

interface DayData {
  date: string;
  habits: HabitData[];
  mood: "good" | "ok" | "bad" | null;
  note: string;
  completedCount: number;
  totalCount: number;
}

interface DayDetailsModalProps {
  visible: boolean;
  onDismiss: () => void;
  dayData: DayData | null;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  visible,
  onDismiss,
  dayData,
}) => {
  const { t } = useTranslation();
  const { colors, isDark, formatNumber } = useTheme();
  const { getCalendarDate } = useCalendar();

  if (!dayData) return null;

  // Format the date using useCalendar
  const calendarDate = getCalendarDate(dayData.date);
  const formattedDate = calendarDate.displayString;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.elevation.level1 },
          ]}
        >
          {/* Header */}
          <View
            style={[styles.modalHeader, { backgroundColor: colors.primary }]}
          >
            <Text
              variant="headlineSmall"
              style={[styles.modalTitle, { color: colors.onPrimary }]}
            >
              {formattedDate}
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Mood Display */}
            {dayData.mood && (
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
                    {dayData.mood === "good" && "😊"}
                    {dayData.mood === "ok" && "😐"}
                    {dayData.mood === "bad" && "😔"}
                  </Text>
                </View>
                <Text
                  variant="bodyLarge"
                  style={[styles.moodText, { color: colors.text.primary }]}
                >
                  {dayData.mood === "good" && t("mood.good")}
                  {dayData.mood === "ok" && t("mood.ok")}
                  {dayData.mood === "bad" && t("mood.bad")}
                </Text>
              </View>
            )}

            {/* Note Display */}
            {dayData.note && (
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
                  style={[styles.modalNoteText, { color: colors.text.primary }]}
                >
                  &ldquo;{dayData.note}&rdquo;
                </Text>
              </View>
            )}

            {/* Progress Summary */}
            <View
              style={[
                styles.modalProgress,
                {
                  backgroundColor: isDark ? colors.elevation.level2 : "#f0f9ff",
                },
              ]}
            >
              <View style={styles.progressHeader}>
                <Text
                  variant="titleSmall"
                  style={[styles.progressTitle, { color: colors.text.primary }]}
                >
                  {t("calendar.todayProgress")}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[styles.progressText, { color: colors.primary }]}
                >
                  {formatNumber(dayData.completedCount)} {t("common.of")}{" "}
                  {formatNumber(dayData.totalCount)}
                </Text>
              </View>
              <ProgressBar
                progress={
                  dayData.totalCount > 0
                    ? dayData.completedCount / dayData.totalCount
                    : 0
                }
                color={colors.primary}
                style={styles.modalProgressBar}
              />
            </View>

            {/* Habits List */}
            {dayData.habits.length > 0 && (
              <View style={styles.habitsSection}>
                <Text
                  variant="titleSmall"
                  style={[styles.sectionTitle, { color: colors.text.primary }]}
                >
                  {t("habits.title")}
                </Text>

                {dayData.habits.map((habit) => (
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

            {dayData.habits.length === 0 && (
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
              onPress={onDismiss}
              style={[styles.closeButton, { backgroundColor: colors.primary }]}
              labelStyle={[styles.closeButtonText, { color: colors.onPrimary }]}
            >
              {t("calendar.close")}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContent: {
    padding: 16,
  },
  modalMood: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  moodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodText: {
    fontWeight: "600",
  },
  modalNote: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderRightWidth: 4,
  },
  modalNoteText: {
    fontStyle: "italic",
    lineHeight: 20,
  },
  modalProgress: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: "600",
  },
  progressText: {
    fontWeight: "bold",
  },
  modalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  habitsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 12,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  habitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  completedIcon: {
    fontSize: 20,
    color: "#52c41a",
    fontWeight: "bold",
  },
  incompleteIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d9d9d9",
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontWeight: "500",
  },
  completedHabit: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  habitCategory: {
    marginTop: 2,
  },
  emptyHabits: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyHabitsText: {
    textAlign: "center",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  closeButton: {
    borderRadius: 8,
  },
  closeButtonText: {
    fontWeight: "600",
  },
});
