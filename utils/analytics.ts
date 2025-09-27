import { DayEntry, Habit } from '@/store/habitStore';

export interface StreakData {
  habitId: string;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  successRate: number;
  lastCompleted?: string;
}

export interface MonthlyInsights {
  totalHabits: number;
  avgCompletionRate: number;
  bestDay: { date: string; rate: number } | null;
  worstDay: { date: string; rate: number } | null;
  moodDistribution: {
    good: number;
    ok: number;
    bad: number;
  };
  topHabits: Array<{
    habitId: string;
    habitName: string;
    completionRate: number;
  }>;
}

export class AnalyticsService {
  static calculateStreaks(
    habits: Habit[],
    history: Record<string, DayEntry>
  ): StreakData[] {
    return habits.map(habit => {
      const sortedDates = Object.keys(history)
        .filter(date => history[date]?.completedHabits?.includes(habit.id))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      // محاسبه current streak از امروز به عقب
      const today = new Date();
      let checkDate = new Date(today);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const dayEntry = history[dateStr];

        if (dayEntry?.completedHabits?.includes(habit.id)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // محاسبه longest streak
      if (sortedDates.length > 0) {
        let prevDate: Date | null = null;

        for (const dateStr of sortedDates) {
          const currentDate = new Date(dateStr);

          if (prevDate === null) {
            tempStreak = 1;
          } else {
            const dayDiff = Math.floor(
              (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (dayDiff === 1) {
              tempStreak++;
            } else {
              longestStreak = Math.max(longestStreak, tempStreak);
              tempStreak = 1;
            }
          }

          prevDate = currentDate;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
      }

      const totalDays = sortedDates.length;
      const totalPossibleDays = Object.keys(history).length;
      const successRate = totalPossibleDays > 0 ? (totalDays / totalPossibleDays) * 100 : 0;
      const lastCompleted = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : undefined;

      return {
        habitId: habit.id,
        habitName: habit.name,
        currentStreak,
        longestStreak,
        totalDays,
        successRate: Math.round(successRate),
        lastCompleted,
      };
    });
  }

  static generateMonthlyInsights(
    habits: Habit[],
    history: Record<string, DayEntry>
  ): MonthlyInsights {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // فیلتر کردن تاریخ‌های 30 روز گذشته
    const last30Days = Object.keys(history).filter(date => {
      const entryDate = new Date(date);
      return entryDate >= thirtyDaysAgo && entryDate <= today;
    });

    if (last30Days.length === 0) {
      return {
        totalHabits: habits.length,
        avgCompletionRate: 0,
        bestDay: null,
        worstDay: null,
        moodDistribution: { good: 0, ok: 0, bad: 0 },
        topHabits: [],
      };
    }

    // محاسبه completion rates روزانه
    const dailyRates: Array<{ date: string; rate: number }> = [];
    let totalRate = 0;

    for (const date of last30Days) {
      const dayEntry = history[date];
      const completedCount = dayEntry?.completedHabits?.length || 0;
      const rate = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

      dailyRates.push({ date, rate });
      totalRate += rate;
    }

    const avgCompletionRate = dailyRates.length > 0 ? totalRate / dailyRates.length : 0;

    // پیدا کردن بهترین و بدترین روز
    const sortedByRate = [...dailyRates].sort((a, b) => b.rate - a.rate);
    const bestDay = sortedByRate.length > 0 ? sortedByRate[0] : null;
    const worstDay = sortedByRate.length > 0 ? sortedByRate[sortedByRate.length - 1] : null;

    // محاسبه mood distribution
    const moodDistribution = { good: 0, ok: 0, bad: 0 };
    last30Days.forEach(date => {
      const mood = history[date]?.mood;
      if (mood) {
        moodDistribution[mood]++;
      }
    });

    // محاسبه top habits
    const habitStats = habits.map(habit => {
      const completedDays = last30Days.filter(date =>
        history[date]?.completedHabits?.includes(habit.id)
      ).length;

      const completionRate = last30Days.length > 0 ? (completedDays / last30Days.length) * 100 : 0;

      return {
        habitId: habit.id,
        habitName: habit.name,
        completionRate: Math.round(completionRate),
      };
    });

    const topHabits = habitStats.sort((a, b) => b.completionRate - a.completionRate);

    return {
      totalHabits: habits.length,
      avgCompletionRate: Math.round(avgCompletionRate),
      bestDay,
      worstDay,
      moodDistribution,
      topHabits,
    };
  }

  static getWeeklyTrend(
    habits: Habit[],
    history: Record<string, DayEntry>
  ): Array<{ week: string; rate: number }> {
    const today = new Date();
    const weeks: Array<{ week: string; rate: number }> = [];

    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));

      const weekDates = [];
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        weekDates.push(d.toISOString().split('T')[0]);
      }

      let totalRate = 0;
      let validDays = 0;

      weekDates.forEach(date => {
        if (history[date]) {
          const completed = history[date].completedHabits?.length || 0;
          const rate = habits.length > 0 ? (completed / habits.length) * 100 : 0;
          totalRate += rate;
          validDays++;
        }
      });

      const avgRate = validDays > 0 ? totalRate / validDays : 0;
      const weekLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;

      weeks.unshift({ week: weekLabel, rate: Math.round(avgRate) });
    }

    return weeks;
  }

  static generateInsightMessages(insights: MonthlyInsights, streaks: StreakData[]): string[] {
    const messages: string[] = [];

    // Completion rate insights
    if (insights.avgCompletionRate >= 80) {
      messages.push('🎉 Amazing! You\'re completing over 80% of your habits!');
    } else if (insights.avgCompletionRate >= 60) {
      messages.push('💪 Good progress! You\'re on the right track.');
    } else if (insights.avgCompletionRate >= 40) {
      messages.push('📈 Keep pushing! Small improvements lead to big results.');
    } else {
      messages.push('🌱 Every journey starts with a single step. You\'ve got this!');
    }

    // Streak insights
    const bestStreak = streaks.reduce((max, streak) =>
      streak.currentStreak > max.currentStreak ? streak : max,
      streaks[0] || { currentStreak: 0, habitName: '' }
    );

    if (bestStreak.currentStreak >= 7) {
      messages.push(`🔥 Incredible ${bestStreak.currentStreak}-day streak with ${bestStreak.habitName}!`);
    } else if (bestStreak.currentStreak >= 3) {
      messages.push(`✨ Great ${bestStreak.currentStreak}-day streak building up!`);
    }

    // Mood insights
    const totalMoodEntries = insights.moodDistribution.good +
                            insights.moodDistribution.ok +
                            insights.moodDistribution.bad;

    if (totalMoodEntries > 0) {
      const goodPercentage = (insights.moodDistribution.good / totalMoodEntries) * 100;
      if (goodPercentage >= 70) {
        messages.push('😊 Your mood has been consistently positive this month!');
      } else if (goodPercentage >= 50) {
        messages.push('🌤️ Your mood seems balanced overall.');
      }
    }

    return messages;
  }
}