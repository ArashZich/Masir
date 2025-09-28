import { useHabitStore } from '@/store/habitStore';
import moment from 'moment-jalaali';

moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });

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
      name: 'مطالعه روزانه',
      description: 'مطالعه کتاب یا مقاله تخصصی',
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
      description: 'مدیتیشن و تنفس عمیق',
      icon: 'heart',
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
      description: '8 لیوان آب در روز',
      icon: 'water',
      color: '#00BCD4',
      category: 'health',
      target: 8,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: false,
      reminderTime: '09:00',
      estimatedDuration: 1
    },
    {
      name: 'یوگا',
      description: 'تمرینات یوگا و کشش',
      icon: 'leaf',
      color: '#8BC34A',
      category: 'fitness',
      target: 3,
      frequency: 'weekly' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '18:00',
      estimatedDuration: 60
    },
    {
      name: 'نوشتن خلاقانه',
      description: 'نوشتن داستان یا شعر',
      icon: 'lightbulb',
      color: '#FF9800',
      category: 'creativity',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: true,
      reminderTime: '21:30',
      estimatedDuration: 30
    },
    {
      name: 'تماس با خانواده',
      description: 'صحبت با اعضای خانواده',
      icon: 'heart',
      color: '#E91E63',
      category: 'health',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: false,
      reminderTime: '19:00',
      estimatedDuration: 20
    },
    {
      name: 'مرتب کردن اتاق',
      description: 'تمیز و مرتب نگه داشتن محیط',
      icon: 'star',
      color: '#FF5722',
      category: 'productivity',
      target: 1,
      frequency: 'daily' as const,
      isActive: true,
      reminderEnabled: false,
      reminderTime: '08:00',
      estimatedDuration: 15
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
  const today = moment();
  const startDate = moment().subtract(45, 'days');

  for (let date = startDate.clone(); date.isSameOrBefore(today); date.add(1, 'day')) {
    const dateString = date.format('YYYY-MM-DD');

    // Random mood (70% good, 20% ok, 10% bad)
    const moodRandom = Math.random();
    let mood: 'good' | 'ok' | 'bad';
    if (moodRandom < 0.7) mood = 'good';
    else if (moodRandom < 0.9) mood = 'ok';
    else mood = 'bad';

    setDayMood(dateString, mood);

    // Random notes (60% of days have notes)
    if (Math.random() < 0.6) {
      const notes = [
        'روز خوبی بود، انرژی زیادی داشتم',
        'کمی خسته بودم ولی کارهایم رو انجام دادم',
        'روز پرتنشی بود اما در نهایت خوب تموم شد',
        'احساس بهتری نسبت به دیروز داشتم',
        'امروز خیلی خوب پیش رفت، راضی هستم',
        'کمی استرس داشتم ولی مدیریتش کردم',
        'روز آرامی بود، وقت بیشتری برای خودم داشتم',
        'چالش‌هایی داشت ولی یاد گرفتن‌های خوبی هم بود',
        'انگیزه بالایی داشتم امروز',
        'روز معمولی بود، هیچ اتفاق خاصی نیفتاد',
        'خیلی لذت بردم از کارهایی که کردم',
        'کمی پایین بودم ولی سعی کردم مثبت بمونم'
      ];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      setDayNote(dateString, randomNote);
    }

    // Toggle habits based on mood and random factors
    habitIds.forEach((habitId, index) => {
      const habit = testHabits[index];

      // Base completion rate based on mood
      let completionRate = 0.5; // 50% base rate
      if (mood === 'good') completionRate = 0.8; // 80% on good days
      else if (mood === 'ok') completionRate = 0.6; // 60% on ok days
      else completionRate = 0.3; // 30% on bad days

      // Adjust based on habit type
      if (habit.category === 'health') completionRate += 0.1;
      if (habit.category === 'learning') completionRate += 0.05;
      if (habit.target > 1) completionRate -= 0.1; // Multi-target habits are harder

      // Weekly frequency habits (less frequent)
      if (habit.frequency === 'weekly') {
        completionRate *= 0.4; // Much less frequent
      }

      // Simulate realistic patterns
      const dayOfWeek = date.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        if (habit.name.includes('ورزش') || habit.name.includes('یوگا')) {
          completionRate += 0.2; // More exercise on weekends
        } else if (habit.name.includes('مطالعه')) {
          completionRate -= 0.1; // Less study on weekends
        }
      }

      // Add some randomness and streaks
      const random = Math.random();

      // Create some streaks (if previous day was completed, higher chance)
      const previousDay = date.clone().subtract(1, 'day').format('YYYY-MM-DD');
      const prevDayCompleted = useHabitStore.getState().getHabitsForDate(previousDay)
        .find(h => h.id === habitId)?.completed;

      if (prevDayCompleted) completionRate += 0.15; // Streak bonus

      // Implement the completion
      if (random < completionRate) {
        // For multi-target habits, sometimes complete partially
        if (habit.target > 1) {
          const completions = Math.floor(Math.random() * habit.target) + 1;
          for (let i = 0; i < completions; i++) {
            toggleHabitForDay(habitId, dateString);
          }
        } else {
          toggleHabitForDay(habitId, dateString);
        }
      }
    });
  }

  console.log('✅ Test data loaded successfully!');
  console.log(`📊 Generated data for ${habitIds.length} habits over 45 days`);
  console.log('🎯 Habit IDs:', habitIds);
  console.log('📅 Date range:', startDate.format('YYYY-MM-DD'), 'to', today.format('YYYY-MM-DD'));
};

// Export function to clear test data
export const clearTestData = () => {
  const { resetAllData } = useHabitStore.getState();
  resetAllData();
  console.log('🗑️ All test data cleared!');
};