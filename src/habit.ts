
export interface HabitLog {
  date: string; // 'YYYY-MM-DD'
  value?: number; // For cumulative habits
  completed?: boolean; // For daily habits
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  goalType: 'daily' | 'cumulative';
  goalAmount?: number; // For cumulative habits
  logs: HabitLog[];
}
