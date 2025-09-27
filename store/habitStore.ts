import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from './storage';

export interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:MM format
  // Daily settings
  dailyInterval?: number; // repeat every X days
  // Weekly settings
  weeklyDays?: number[]; // days of week (0=Sunday, 6=Saturday)
  // Monthly settings
  monthlyDay?: number; // day of month (1-31)
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  target: number; // daily target (default 1)
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string; // ISO date string
  isActive: boolean;
  reminder?: ReminderSettings;
}

export interface DayEntry {
  date: string;
  mood: 'good' | 'ok' | 'bad' | null;
  note?: string; // micro-journal
  completedHabits: string[]; // اختیاری - فقط habit IDs
  created: string; // timestamp
}

export interface HabitHistory {
  [date: string]: DayEntry;
}

interface HabitState {
  // State
  habits: Habit[];
  history: HabitHistory;

  // Actions - Habit Management
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  deleteHabit: (id: string) => void;

  // Actions - Mood & Journal System
  setDayMood: (date: string, mood: 'good' | 'ok' | 'bad' | null) => void;
  setDayNote: (date: string, note: string) => void;
  toggleHabitForDay: (habitId: string, date: string) => void;

  // Getters
  getDayEntry: (date: string) => DayEntry | null;
  isHabitCompletedOnDay: (habitId: string, date: string) => boolean;
  getHabitsForDate: (date: string) => Array<Habit & { completed: boolean }>;
  getWeekMoodTrend: (startDate: string) => Array<{ date: string; mood: string | null }>;
  resetAllData: () => void;
}

const initialState = {
  habits: [],
  history: {},
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isActive: true,
          target: habitData.target || 1,
          frequency: habitData.frequency || 'daily',
        };

        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id ? { ...habit, ...updates } : habit
          ),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
          history: Object.fromEntries(
            Object.entries(state.history).map(([date, dayEntry]) => [
              date,
              {
                ...dayEntry,
                completedHabits: dayEntry.completedHabits?.filter((habitId) => habitId !== id) || [],
              },
            ])
          ),
        }));
      },

      setDayMood: (date, mood) => {
        set((state) => ({
          history: {
            ...state.history,
            [date]: {
              date,
              mood,
              note: state.history[date]?.note || '',
              completedHabits: state.history[date]?.completedHabits || [],
              created: state.history[date]?.created || new Date().toISOString(),
            },
          },
        }));
      },

      setDayNote: (date, note) => {
        set((state) => ({
          history: {
            ...state.history,
            [date]: {
              date,
              mood: state.history[date]?.mood || null,
              note,
              completedHabits: state.history[date]?.completedHabits || [],
              created: state.history[date]?.created || new Date().toISOString(),
            },
          },
        }));
      },

      toggleHabitForDay: (habitId, date) => {
        set((state) => {
          const dayEntry = state.history[date] || {
            date,
            mood: null,
            note: '',
            completedHabits: [],
            created: new Date().toISOString(),
          };

          const isCompleted = dayEntry.completedHabits.includes(habitId);
          const updatedHabits = isCompleted
            ? dayEntry.completedHabits.filter(id => id !== habitId)
            : [...dayEntry.completedHabits, habitId];

          return {
            history: {
              ...state.history,
              [date]: {
                ...dayEntry,
                completedHabits: updatedHabits,
              },
            },
          };
        });
      },

      getDayEntry: (date) => {
        const state = get();
        return state.history[date] || null;
      },

      isHabitCompletedOnDay: (habitId, date) => {
        const state = get();
        return state.history[date]?.completedHabits?.includes(habitId) || false;
      },

      getHabitsForDate: (date) => {
        const state = get();
        return state.habits
          .filter((habit) => habit.isActive)
          .map((habit) => ({
            ...habit,
            completed: state.history[date]?.completedHabits?.includes(habit.id) || false,
          }));
      },

      getWeekMoodTrend: (startDate) => {
        const state = get();
        const result: Array<{ date: string; mood: string | null }> = [];
        const start = new Date(startDate);

        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(start);
          currentDate.setDate(start.getDate() + i);
          const dateStr = currentDate.toISOString().split('T')[0];

          result.push({
            date: dateStr,
            mood: state.history[dateStr]?.mood || null,
          });
        }

        return result;
      },

      resetAllData: () => {
        set(initialState);
      },
    }),
    {
      name: 'masir-habits',
      storage: persistStorage,
    }
  )
);