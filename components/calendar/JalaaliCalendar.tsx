import { useTheme } from "@/contexts/ThemeContext";
import { useCalendar } from "@/hooks/useCalendar";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import DatePicker from "react-native-modern-datepicker";

dayjs.extend(jalaliday);

interface JalaaliCalendarProps {
  current?: string; // YYYY-MM-DD format
  markedDates?: { [key: string]: any };
  onDayPress?: (day: {
    dateString: string;
    day: number;
    month: number;
    year: number;
  }) => void;
  theme?: any;
}

export const JalaaliCalendar: React.FC<JalaaliCalendarProps> = ({
  current,
  markedDates = {},
  onDayPress,
  theme = {},
}) => {
  const { colors } = useTheme();
  const { calendarDateToGregorian, isJalaali } = useCalendar();

  // Local state to track selected date (to avoid re-rendering issues)
  const [internalSelected, setInternalSelected] = useState<string>("");

  // Convert current date to the format expected by react-native-modern-datepicker
  const currentDate = useMemo(() => {
    if (!current) return undefined;

    const date = dayjs(current);
    if (isJalaali) {
      const jalaliDate = date.calendar("jalali");
      return `${jalaliDate.year()}/${String(jalaliDate.month() + 1).padStart(
        2,
        "0"
      )}/${String(jalaliDate.date()).padStart(2, "0")}`;
    } else {
      return date.format("YYYY/MM/DD");
    }
  }, [current, isJalaali]);

  // Handle date selection
  const handleDateChange = (dateString: string) => {
    if (!onDayPress || !dateString) return;

    // Prevent multiple calls for the same date
    if (dateString === internalSelected) return;
    setInternalSelected(dateString);

    // dateString format is "YYYY/MM/DD" in either Jalali or Gregorian
    const [year, month, day] = dateString.split("/").map(Number);

    // Use the same conversion function that works in useCalendar
    const gregorianDateString = calendarDateToGregorian(day, month, year);

    onDayPress({
      dateString: gregorianDateString,
      day,
      month,
      year,
    });
  };

  // Empty handlers for month/year changes
  const handleMonthYearChange = () => {
    // Do nothing - just prevent errors
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.calendarBackground || colors.elevation.level1,
        },
      ]}
    >
      <DatePicker
        mode="calendar"
        isGregorian={!isJalaali}
        options={{
          backgroundColor: theme.calendarBackground || colors.elevation.level1,
          textHeaderColor: theme.monthTextColor || colors.text.primary,
          textDefaultColor: theme.dayTextColor || colors.text.primary,
          selectedTextColor: theme.selectedDayTextColor || colors.onPrimary,
          mainColor: theme.selectedDayBackgroundColor || colors.primary,
          textSecondaryColor: theme.textDisabledColor || colors.text.disabled,
          borderColor: colors.border,
        }}
        current={currentDate}
        onDateChange={handleDateChange}
        onSelectedChange={handleDateChange}
        onMonthYearChange={handleMonthYearChange}
        onTimeChange={handleMonthYearChange}
        style={{ borderRadius: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    padding: 8,
    alignItems: "center",
    direction: "ltr",
  },
});

export default JalaaliCalendar;
