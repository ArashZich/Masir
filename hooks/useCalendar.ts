import { useMemo } from 'react';
import moment from 'moment-jalaali';
import { useLanguage } from './useLanguage';

moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });
moment.locale('fa');

export interface CalendarDate {
  dateString: string; // YYYY-MM-DD format for storage
  day: number;
  month: number;
  year: number;
  displayString: string; // Formatted display string
  timestamp: number;
}

export interface CalendarConfig {
  locale: string;
  isJalaali: boolean;
  firstDay: number; // 0 = Sunday, 1 = Monday
  monthNames: string[];
  dayNames: string[];
  dayNamesShort: string[];
}

export function useCalendar() {
  const { isRTL } = useLanguage();
  const isJalaali = isRTL; // Use Jalaali calendar for Persian (RTL)

  const config: CalendarConfig = useMemo(() => {
    if (isJalaali) {
      return {
        locale: 'fa',
        isJalaali: true,
        firstDay: 6, // Saturday for Persian calendar
        monthNames: [
          'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
          'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ],
        dayNames: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'],
        dayNamesShort: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش']
      };
    } else {
      return {
        locale: 'en',
        isJalaali: false,
        firstDay: 1, // Monday for Gregorian calendar
        monthNames: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      };
    }
  }, [isJalaali]);

  // Get today's date in appropriate calendar
  const getTodayString = (): string => {
    return moment().format('YYYY-MM-DD'); // Always return Gregorian for storage
  };

  // Convert date string to display format
  const formatDateDisplay = (dateString: string): string => {
    if (isJalaali) {
      // Convert Gregorian date to Jalaali for display
      const gregorianMoment = moment(dateString, 'YYYY-MM-DD');
      return gregorianMoment.format('jYYYY/jMM/jDD');
    } else {
      return moment(dateString, 'YYYY-MM-DD').format('YYYY/MM/DD');
    }
  };

  // Convert date to calendar date object
  const getCalendarDate = (dateString: string): CalendarDate => {
    const gregorianMoment = moment(dateString, 'YYYY-MM-DD');

    if (isJalaali) {
      return {
        dateString,
        day: gregorianMoment.jDate(),
        month: gregorianMoment.jMonth() + 1, // moment months are 0-indexed
        year: gregorianMoment.jYear(),
        displayString: gregorianMoment.format('jYYYY/jMM/jDD'),
        timestamp: gregorianMoment.valueOf()
      };
    } else {
      return {
        dateString,
        day: gregorianMoment.date(),
        month: gregorianMoment.month() + 1, // moment months are 0-indexed
        year: gregorianMoment.year(),
        displayString: gregorianMoment.format('YYYY/MM/DD'),
        timestamp: gregorianMoment.valueOf()
      };
    }
  };

  // Get month name for given date
  const getMonthName = (dateString: string): string => {
    const calendarDate = getCalendarDate(dateString);
    return config.monthNames[calendarDate.month - 1];
  };

  // Get current month and year for display
  const getCurrentMonthYear = (): string => {
    const today = getTodayString();
    const calendarDate = getCalendarDate(today);
    return `${config.monthNames[calendarDate.month - 1]} ${calendarDate.year}`;
  };

  // Get formatted date for today (for header display)
  const getTodayFormatted = (): string => {
    if (isJalaali) {
      return moment().format('dddd، jD jMMMM jYYYY');
    } else {
      return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }
  };

  // Convert calendar date to Gregorian date string for storage
  const calendarDateToGregorian = (day: number, month: number, year: number): string => {
    if (isJalaali) {
      return moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
    } else {
      return moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    }
  };

  // Get days in current month for calendar grid
  const getMonthDays = (dateString: string) => {
    const calendarDate = getCalendarDate(dateString);
    const { year, month } = calendarDate;

    if (isJalaali) {
      const startOfMonth = moment(`${year}/${month}/1`, 'jYYYY/jMM/jDD');
      const daysInMonth = moment.jDaysInMonth(year, month - 1);
      const startDayOfWeek = startOfMonth.day(); // 0 = Sunday

      return {
        daysInMonth,
        startDayOfWeek,
        monthString: `${year}/${month}`
      };
    } else {
      const startOfMonth = moment(`${year}-${month}-1`, 'YYYY-MM-DD');
      const daysInMonth = startOfMonth.daysInMonth();
      const startDayOfWeek = startOfMonth.day(); // 0 = Sunday

      return {
        daysInMonth,
        startDayOfWeek,
        monthString: `${year}-${month}`
      };
    }
  };

  // Navigate months
  const getNextMonth = (dateString: string): string => {
    if (isJalaali) {
      const current = moment(dateString, 'YYYY-MM-DD');
      const nextMonth = current.clone().add(1, 'jMonth');
      return nextMonth.format('YYYY-MM-DD');
    } else {
      const current = moment(dateString, 'YYYY-MM-DD');
      const nextMonth = current.clone().add(1, 'month');
      return nextMonth.format('YYYY-MM-DD');
    }
  };

  const getPreviousMonth = (dateString: string): string => {
    if (isJalaali) {
      const current = moment(dateString, 'YYYY-MM-DD');
      const prevMonth = current.clone().subtract(1, 'jMonth');
      return prevMonth.format('YYYY-MM-DD');
    } else {
      const current = moment(dateString, 'YYYY-MM-DD');
      const prevMonth = current.clone().subtract(1, 'month');
      return prevMonth.format('YYYY-MM-DD');
    }
  };

  return {
    config,
    isJalaali,
    getTodayString,
    formatDateDisplay,
    getCalendarDate,
    getMonthName,
    getCurrentMonthYear,
    getTodayFormatted,
    calendarDateToGregorian,
    getMonthDays,
    getNextMonth,
    getPreviousMonth
  };
}