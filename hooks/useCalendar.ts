import { useMemo } from 'react';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import { useLanguage } from './useLanguage';

// Extend dayjs with jalali plugin
dayjs.extend(jalaliday);

// Helper function to convert English digits to Persian
const toPersianDigits = (str: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

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
  const { currentLanguage } = useLanguage();
  const isJalaali = currentLanguage === 'fa'; // Use Jalaali calendar for Persian

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
        firstDay: 0, // Sunday for Gregorian calendar
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
    return dayjs().format('YYYY-MM-DD'); // Always return Gregorian for storage
  };

  // Convert date string to display format
  const formatDateDisplay = (dateString: string): string => {
    const date = dayjs(dateString);

    if (isJalaali) {
      // Convert Gregorian date to Jalaali for display with Persian digits
      const jalaliDate = date.calendar('jalali');
      const formatted = `${jalaliDate.year()}/${String(jalaliDate.month() + 1).padStart(2, '0')}/${String(jalaliDate.date()).padStart(2, '0')}`;
      return toPersianDigits(formatted);
    } else {
      return date.format('YYYY/MM/DD');
    }
  };

  // Convert date to calendar date object
  const getCalendarDate = (dateString: string): CalendarDate => {
    const date = dayjs(dateString);

    if (isJalaali) {
      const jalaliDate = date.calendar('jalali');
      const formatted = `${jalaliDate.year()}/${String(jalaliDate.month() + 1).padStart(2, '0')}/${String(jalaliDate.date()).padStart(2, '0')}`;
      return {
        dateString,
        day: jalaliDate.date(),
        month: jalaliDate.month() + 1, // month is 0-indexed
        year: jalaliDate.year(),
        displayString: toPersianDigits(formatted),
        timestamp: date.valueOf()
      };
    } else {
      return {
        dateString,
        day: date.date(),
        month: date.month() + 1, // month is 0-indexed
        year: date.year(),
        displayString: date.format('YYYY/MM/DD'),
        timestamp: date.valueOf()
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
    const year = isJalaali ? toPersianDigits(calendarDate.year) : String(calendarDate.year);
    return `${config.monthNames[calendarDate.month - 1]} ${year}`;
  };

  // Get formatted date for today (for header display)
  const getTodayFormatted = (): string => {
    const today = dayjs();

    if (isJalaali) {
      const jalaliDate = today.calendar('jalali');
      const dayOfWeek = config.dayNames[today.day()];
      const monthName = config.monthNames[jalaliDate.month()];
      const day = toPersianDigits(jalaliDate.date());
      const year = toPersianDigits(jalaliDate.year());
      return `${dayOfWeek}، ${day} ${monthName} ${year}`;
    } else {
      return today.format('dddd, MMMM D, YYYY');
    }
  };

  // Convert calendar date to Gregorian date string for storage
  const calendarDateToGregorian = (day: number, month: number, year: number): string => {
    if (isJalaali) {
      // Create a Jalali date and convert to Gregorian
      const jalaliDate = dayjs(`${year}/${month}/${day}`, { jalali: true });
      return jalaliDate.format('YYYY-MM-DD');
    } else {
      return dayjs(`${year}-${month}-${day}`).format('YYYY-MM-DD');
    }
  };

  // Get days in current month for calendar grid
  const getMonthDays = (dateString: string) => {
    const date = dayjs(dateString);

    if (isJalaali) {
      const jalaliDate = date.calendar('jalali');
      const year = jalaliDate.year();
      const month = jalaliDate.month() + 1;

      // Get first day of month
      const firstDay = dayjs(`${year}/${month}/1`, { jalali: true });
      const daysInMonth = jalaliDate.daysInMonth();
      const startDayOfWeek = firstDay.day(); // 0 = Sunday

      return {
        daysInMonth,
        startDayOfWeek,
        monthString: toPersianDigits(`${year}/${month}`)
      };
    } else {
      const daysInMonth = date.daysInMonth();
      const startOfMonth = date.startOf('month');
      const startDayOfWeek = startOfMonth.day(); // 0 = Sunday

      return {
        daysInMonth,
        startDayOfWeek,
        monthString: date.format('YYYY-MM')
      };
    }
  };

  // Navigate months
  const getNextMonth = (dateString: string): string => {
    const date = dayjs(dateString);

    if (isJalaali) {
      const jalaliDate = date.calendar('jalali');
      const nextMonth = jalaliDate.add(1, 'month');
      // Convert back to Gregorian
      return dayjs(`${nextMonth.year()}/${nextMonth.month() + 1}/${nextMonth.date()}`, { jalali: true }).format('YYYY-MM-DD');
    } else {
      return date.add(1, 'month').format('YYYY-MM-DD');
    }
  };

  const getPreviousMonth = (dateString: string): string => {
    const date = dayjs(dateString);

    if (isJalaali) {
      const jalaliDate = date.calendar('jalali');
      const prevMonth = jalaliDate.subtract(1, 'month');
      // Convert back to Gregorian
      return dayjs(`${prevMonth.year()}/${prevMonth.month() + 1}/${prevMonth.date()}`, { jalali: true }).format('YYYY-MM-DD');
    } else {
      return date.subtract(1, 'month').format('YYYY-MM-DD');
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