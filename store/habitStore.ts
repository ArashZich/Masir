import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from './storage';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string; // ISO date string
  isActive: boolean;
}

export interface HabitHistory {
  [date: string]: { // YYYY-MM-DD format
    [habitId: string]: boolean;
  };
}

interface HabitState {
  // State
  habits: Habit[];
  history: HabitHistory;

  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  isHabitCompleted: (habitId: string, date: string) => boolean;
  getHabitsForDate: (date: string) => Array<Habit & { completed: boolean }>;
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
            Object.entries(state.history).map(([date, dayHistory]) => [
              date,
              Object.fromEntries(
                Object.entries(dayHistory).filter(([habitId]) => habitId !== id)
              ),
            ])
          ),
        }));
      },

      toggleHabitCompletion: (habitId, date) => {
        set((state) => {
          const currentStatus = state.history[date]?.[habitId] || false;
          return {
            history: {
              ...state.history,
              [date]: {
                ...state.history[date],
                [habitId]: !currentStatus,
              },
            },
          };
        });
      },

      isHabitCompleted: (habitId, date) => {
        const state = get();
        return state.history[date]?.[habitId] || false;
      },

      getHabitsForDate: (date) => {
        const state = get();
        return state.habits
          .filter((habit) => habit.isActive)
          .map((habit) => ({
            ...habit,
            completed: state.history[date]?.[habit.id] || false,
          }));
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