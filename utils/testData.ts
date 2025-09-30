import { useHabitStore } from '@/store/habitStore';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Extend dayjs with plugins
dayjs.extend(jalaliday);
dayjs.extend(isSameOrBefore);

// Test data for development - uncomment to use
export const loadTestData = async () => {
  const {
    addHabit,
    toggleHabitForDay,
    setDayMood,
    setDayNote,
    resetAllData
  } = useHabitStore.getState();

  // Clear existing data first
  resetAllData();

  // Sample habits with different categories and frequencies
  const testHabits = [
    {
      name: 'ورزش صبحگاهی',
      description: 'نیم ساعت پیاده‌روی یا دویدن',
      icon: 'run',
      color: '#4CAF50',
      category: 'health',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '07:00',
      estimatedDuration: 30
    },
    {
      name: 'مطالعه',
      description: 'مطالعه کتاب یا مقاله',
      icon: 'book-open',
      color: '#2196F3',
      category: 'learning',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '20:00',
      estimatedDuration: 45
    },
    {
      name: 'مدیتیشن',
      description: 'آرامش ذهن',
      icon: 'spa',
      color: '#9C27B0',
      category: 'mindfulness',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '06:30',
      estimatedDuration: 15
    },
    {
      name: 'نوشیدن آب',
      description: '۸ لیوان آب در روز',
      icon: 'water-outline',
      color: '#00BCD4',
      category: 'health',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: false,
      reminderTime: '09:00',
      estimatedDuration: 1
    },
    {
      name: 'یادگیری زبان',
      description: 'تمرین و یادگیری زبان جدید',
      icon: 'school-outline',
      color: '#FF9800',
      category: 'learning',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '19:00',
      estimatedDuration: 30
    },
    {
      name: 'کدنویسی',
      description: 'تمرین و پروژه‌های شخصی',
      icon: 'code-tags',
      color: '#607D8B',
      category: 'productivity',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '21:00',
      estimatedDuration: 60
    }
  ];

  // Add all habits
  testHabits.forEach(habit => {
    addHabit(habit);
  });

  // Wait a bit and get habit IDs after adding
  await new Promise(resolve => setTimeout(resolve, 100));
  const { habits } = useHabitStore.getState();
  const habitIds = habits.map(h => h.id);

  // Generate test data for last 45 days
  const today = dayjs();
  const startDate = dayjs().subtract(45, 'days');

  let date = startDate;
  while (date.isSameOrBefore(today, 'day')) {
    const dateString = date.format('YYYY-MM-DD');

    // Random mood (70% good, 20% ok, 10% bad)
    const moodRandom = Math.random();
    let mood: 'good' | 'ok' | 'bad';
    if (moodRandom < 0.7) mood = 'good';
    else if (moodRandom < 0.9) mood = 'ok';
    else mood = 'bad';

    setDayMood(dateString, mood);

    // Random notes (50% of days have notes)
    if (Math.random() < 0.5) {
      const notes = [
        'روز خوبی بود، انرژی زیادی داشتم',
        'کمی خسته بودم ولی کارهایم رو انجام دادم',
        'روز پرتنشی بود اما نهایتا خوب تموم شد',
        'احساس بهتری نسبت به دیروز داشتم',
        'امروز خیلی خوب پیش رفت، راضی هستم',
        'کمی استرس داشتم ولی مدیریتش کردم',
        'روز آرومی بود، وقت بیشتری برای خودم داشتم',
        'چالش‌هایی بود ولی یاد گرفتن‌های خوبی داشتم',
        'انگیزه بالایی داشتم',
        'روز معمولی بود، هیچ اتفاق خاصی نیفتاد',
        'لذت بردم از کارهایی که کردم',
        'کمی بی‌حال بودم ولی تلاش کردم مثبت بمونم',
        'پروژه‌ام خوب پیش رفت امروز',
        'خیلی خوابم نیومد، فردا باید بهتر باشم',
        'وقت خوبی با دوستام گذروندم',
        'یه کتاب جدید شروع کردم، جالبه',
        'ورزش امروز سخت بود ولی احساس خوبی بهم داد',
        'کلی کار داشتم اما همشو انجام دادم'
      ];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      setDayNote(dateString, randomNote);
    }

    // Toggle habits based on mood and random factors
    habitIds.forEach((habitId, index) => {
      const habit = testHabits[index];

      // Base completion rate based on mood
      let completionRate = 0.55; // 55% base rate
      if (mood === 'good') completionRate = 0.85; // 85% on good days
      else if (mood === 'ok') completionRate = 0.65; // 65% on ok days
      else completionRate = 0.35; // 35% on bad days

      // Adjust based on habit type
      if (habit.category === 'health') completionRate += 0.1;
      if (habit.category === 'learning') completionRate += 0.05;
      if (habit.category === 'mindfulness') completionRate += 0.08;
      if (habit.category === 'productivity') completionRate += 0.07;

      // Simulate realistic day patterns
      const dayOfWeek = date.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend) {
        if (habit.name.includes('ورزش')) {
          completionRate += 0.15; // More exercise on weekends
        } else if (habit.name.includes('کدنویسی') || habit.name.includes('یادگیری')) {
          completionRate += 0.1; // More learning time on weekends
        } else if (habit.name.includes('مطالعه')) {
          completionRate += 0.05;
        }
      } else {
        // Weekday adjustments
        if (habit.name.includes('مدیتیشن')) {
          completionRate += 0.1; // Morning meditation on work days
        }
      }

      // Add some randomness and streaks
      const random = Math.random();

      // Create streaks (if previous day was completed, higher chance)
      const previousDay = date.subtract(1, 'day').format('YYYY-MM-DD');
      const prevDayCompleted = useHabitStore.getState().getHabitsForDate(previousDay)
        .find(h => h.id === habitId)?.completed;

      if (prevDayCompleted) completionRate += 0.2; // Strong streak bonus

      // Ensure rate is between 0 and 1
      completionRate = Math.min(Math.max(completionRate, 0), 0.95);

      // Implement the completion
      if (random < completionRate) {
        toggleHabitForDay(habitId, dateString);
      }
    });

    date = date.add(1, 'day');
  }
};

// Export function to clear test data
export const clearTestData = () => {
  const { resetAllData } = useHabitStore.getState();
  resetAllData();
};