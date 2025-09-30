import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { ThemedCard, JalaaliCalendar } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useHabitStore } from '@/store/habitStore';
import { analyticsStyles as styles } from '@/styles/analytics.styles';

interface CalendarSectionProps {
  today: string;
  onDayPress: (day: any) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  today,
  onDayPress,
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const { history, getHabitsForDate } = useHabitStore();

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

        <JalaaliCalendar
          current={today}
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{
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
          }}
        />
      </ThemedCard.Content>
    </ThemedCard>
  );
};