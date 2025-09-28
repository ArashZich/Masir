import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useCalendar } from '@/hooks/useCalendar';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import moment from 'moment-jalaali';

// Configure moment-jalaali properly
moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });
moment.locale('fa');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface JalaaliCalendarProps {
  current?: string; // YYYY-MM-DD format
  markedDates?: { [key: string]: any };
  onDayPress?: (day: { dateString: string; day: number; month: number; year: number }) => void;
  theme?: any;
}

export const JalaaliCalendar: React.FC<JalaaliCalendarProps> = ({
  current,
  markedDates = {},
  onDayPress,
  theme = {}
}) => {
  const { colors } = useTheme();
  const { isRTL } = useLanguage();
  const { config, getCalendarDate, getNextMonth, getPreviousMonth } = useCalendar();

  const [currentMonth, setCurrentMonth] = useState(current || moment().format('YYYY-MM-DD'));

  const calendarData = useMemo(() => {
    const currentDate = getCalendarDate(currentMonth);
    const { year, month } = currentDate;

    // Create first day of month in Jalaali
    const firstDayMoment = moment(`${year}/${month}/1`, 'jYYYY/jMM/jDD');
    const daysInMonth = moment.jDaysInMonth(year, month - 1); // month is 0-indexed in jDaysInMonth

    // Get the day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayMoment.day();

    // Calculate starting position for Persian calendar
    // Persian week starts with Saturday (شنبه)
    // moment.js: Sunday=0, Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6
    // Persian:   Saturday=0, Sunday=1, Monday=2, Tuesday=3, Wednesday=4, Thursday=5, Friday=6
    // Convert moment day to Persian calendar offset
    const persianWeekDays = [1, 2, 3, 4, 5, 6, 0]; // Map Sunday(0) to 1, ..., Saturday(6) to 0
    const startOffset = persianWeekDays[firstDayOfWeek];

    const days: {
      day: number;
      dateString: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      marked?: any;
    }[] = [];

    // Add empty days for offset
    for (let i = 0; i < startOffset; i++) {
      days.push({
        day: 0,
        dateString: '',
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const jalaaliDateString = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
      const gregorianDate = moment(jalaaliDateString, 'jYYYY/jMM/jDD');
      const gregorianDateString = gregorianDate.format('YYYY-MM-DD');

      const isToday = gregorianDateString === moment().format('YYYY-MM-DD');
      const marked = markedDates[gregorianDateString];

      days.push({
        day,
        dateString: gregorianDateString,
        isCurrentMonth: true,
        isToday,
        isSelected: marked?.selected || false,
        marked
      });
    }

    return {
      days,
      monthName: config.monthNames[month - 1],
      year,
      month
    };
  }, [currentMonth, markedDates, getCalendarDate, config.monthNames]);

  const handlePrevMonth = () => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  };

  const handleNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  const handleDayPress = (day: any) => {
    if (day.isCurrentMonth && onDayPress) {
      onDayPress({
        dateString: day.dateString,
        day: day.day,
        month: calendarData.month,
        year: calendarData.year
      });
    }
  };

  const renderArrow = (direction: 'left' | 'right') => {
    const iconName = direction === 'left'
      ? (isRTL ? 'chevron-right' : 'chevron-left')
      : (isRTL ? 'chevron-left' : 'chevron-right');

    const onPress = direction === 'left' ? handlePrevMonth : handleNextMonth;

    return (
      <IconButton
        icon={iconName}
        size={20}
        iconColor={theme.arrowColor || colors.primary}
        onPress={onPress}
        style={{ margin: 0 }}
      />
    );
  };

  const getDayStyle = (day: any) => {
    const baseStyle = [styles.dayContainer];

    if (!day.isCurrentMonth) {
      return [...baseStyle, styles.emptyDay];
    }

    if (day.isSelected) {
      baseStyle.push({
        backgroundColor: theme.selectedDayBackgroundColor || colors.primary,
        borderRadius: 20
      });
    }

    if (day.isToday && !day.isSelected) {
      baseStyle.push({
        borderWidth: 2,
        borderColor: theme.todayTextColor || colors.primary,
        borderRadius: 20
      });
    }

    return baseStyle;
  };

  const getDayTextStyle = (day: any) => {
    if (!day.isCurrentMonth) {
      return { opacity: 0 };
    }

    let color = theme.dayTextColor || colors.text.primary;

    if (day.isSelected) {
      color = theme.selectedDayTextColor || colors.onPrimary;
    } else if (day.isToday) {
      color = theme.todayTextColor || colors.primary;
    }

    return { color, fontWeight: day.isToday ? 'bold' : 'normal' };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.calendarBackground || colors.elevation.level1 }]}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {renderArrow('left')}
        <Text style={[styles.monthYear, { color: theme.monthTextColor || colors.primary }]}>
          {`${calendarData.monthName} ${calendarData.year}`}
        </Text>
        {renderArrow('right')}
      </View>

      {/* Day names header */}
      <View style={[styles.weekHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {config.dayNamesShort.map((dayName, index) => (
          <Text
            key={index}
            style={[styles.dayName, { color: theme.textSectionTitleColor || colors.primary }]}
          >
            {dayName}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {Array.from({ length: Math.ceil(calendarData.days.length / 7) }, (_, weekIndex) => (
          <View
            key={weekIndex}
            style={[styles.week, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            {calendarData.days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={getDayStyle(day)}
                onPress={() => handleDayPress(day)}
                disabled={!day.isCurrentMonth}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayText, getDayTextStyle(day)]}>
                  {day.day || ''}
                </Text>

                {/* Dots for marked dates */}
                {day.marked?.dots && (
                  <View style={styles.dotsContainer}>
                    {day.marked.dots.map((dot: any, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.dot,
                          { backgroundColor: dot.color }
                        ]}
                      />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weekHeader: {
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    width: SCREEN_WIDTH / 7 - 4,
  },
  calendarGrid: {
    paddingBottom: 8,
  },
  week: {
    justifyContent: 'space-around',
    marginVertical: 2,
  },
  dayContainer: {
    width: SCREEN_WIDTH / 7 - 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    position: 'relative',
  },
  emptyDay: {
    opacity: 0,
  },
  dayText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default JalaaliCalendar;