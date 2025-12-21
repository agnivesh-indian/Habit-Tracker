
import { mean, std } from 'mathjs';

// --- DATA STRUCTURES (TypeScript Interfaces) ---

/**
 * @typedef {'daily' | 'cumulative'} GoalType
 */

/**
 * @typedef {Object} HabitLog
 * @property {string} date - The date of the log in 'YYYY-MM-DD' format.
 * @property {number} [value] - The value for cumulative habits (e.g., pages read, minutes meditated).
 * @property {boolean} [completed] - The completion status for daily habits.
 */

/**
 * @typedef {Object} Habit
 * @property {string} id - A unique identifier for the habit.
 * @property {string} name - The name of the habit (e.g., "Work Out").
 * @property {string} category - The category of the habit (e.g., "Health").
 * @property {GoalType} goalType - The type of goal ('daily' or 'cumulative').
 * @property {number} [goalAmount] - The target amount for cumulative habits.
 * @property {HabitLog[]} logs - An array of logs for the habit.
 */

// --- CORE STATISTICAL FUNCTIONS ---

/**
 * Calculates the completion rate for a habit.
 * For 'daily' habits, it's the percentage of completed logs.
 * For 'cumulative' habits, it's the average progress towards the goal.
 * @param {Habit} habit - The habit object.
 * @returns {number} The completion rate as a percentage (0-100).
 */
export const calculateCompletionRate = (habit) => {
  if (!habit.logs || habit.logs.length === 0) return 0;

  if (habit.goalType === 'daily') {
    const completedCount = habit.logs.filter((log) => log.completed).length;
    return (completedCount / habit.logs.length) * 100;
  }

  if (habit.goalType === 'cumulative') {
    if (!habit.goalAmount) return 0;
    const totalValue = habit.logs.reduce((sum, log) => sum + (log.value || 0), 0);
    const averageProgress = (totalValue / (habit.logs.length * habit.goalAmount)) * 100;
    return Math.min(averageProgress, 100); // Cap at 100%
  }

  return 0;
};

/**
 * Calculates the standard deviation of completion for a habit.
 * This measures the consistency of the habit. A lower number means more consistent.
 * @param {Habit} habit - The habit object.
 * @returns {number} The standard deviation.
 */
export const calculateConsistency = (habit) => {
  if (!habit.logs || habit.logs.length < 2) return 0;

  let values;
  if (habit.goalType === 'daily') {
    values = habit.logs.map((log) => (log.completed ? 1 : 0));
  } else {
    if (!habit.goalAmount) return 0;
    values = habit.logs.map((log) => (log.value || 0) / habit.goalAmount);
  }

  return std(values);
};

/**
 * Calculates the trend velocity for a habit over the last 30 days.
 * This is the percentage change in completion rate between the first and second half of the period.
 * @param {Habit} habit - The habit object.
 * @returns {number} The trend velocity as a percentage.
 */
export const calculateTrendVelocity = (habit) => {
  const recentLogs = habit.logs.slice(-30);
  if (recentLogs.length < 2) return 0;

  const midpoint = Math.floor(recentLogs.length / 2);
  const firstHalf = recentLogs.slice(0, midpoint);
  const secondHalf = recentLogs.slice(midpoint);

  if (firstHalf.length === 0 || secondHalf.length === 0) return 0;

  const firstHalfHabit = { ...habit, logs: firstHalf };
  const secondHalfHabit = { ...habit, logs: secondHalf };

  const firstHalfRate = calculateCompletionRate(firstHalfHabit);
  const secondHalfRate = calculateCompletionRate(secondHalfHabit);

  if (firstHalfRate === 0) {
    return secondHalfRate > 0 ? 100 : 0;
  }

  return ((secondHalfRate - firstHalfRate) / firstHalfRate) * 100;
};


// --- CORRELATION ANALYSIS ---

/**
 * Finds correlations between a primary habit and other habits.
 * @param {Habit} primaryHabit - The habit to analyze.
 * @param {Habit[]} allHabits - An array of all habit objects.
 * @returns {Object[]} An array of correlation results.
 */
export const analyzeCorrelations = (primaryHabit, allHabits) => {
  const correlations = [];
  const otherHabits = allHabits.filter((h) => h.id !== primaryHabit.id);

  const primaryHabitLogMap = new Map(primaryHabit.logs.map(log => [log.date, log]));

  for (const otherHabit of otherHabits) {
    const commonDates = primaryHabit.logs.map(log => log.date).filter(date => otherHabit.logs.some(otherLog => otherLog.date === date));
    if (commonDates.length < 5) continue; // Need at least 5 data points for a meaningful correlation

    const primarySuccessDays = new Set(commonDates.filter(date => {
      const log = primaryHabitLogMap.get(date);
      return primaryHabit.goalType === 'daily' ? log.completed : (log.value || 0) >= (primaryHabit.goalAmount || Infinity);
    }));

    if (primarySuccessDays.size === 0) continue;

    const otherHabitOnPrimarySuccessDays = otherHabit.logs.filter(log => primarySuccessDays.has(log.date));
    if (otherHabitOnPrimarySuccessDays.length === 0) continue;

    const correlationHabit = { ...otherHabit, logs: otherHabitOnPrimarySuccessDays };
    const correlationRate = calculateCompletionRate(correlationHabit);
    const baseRate = calculateCompletionRate(otherHabit);

    if (baseRate > 0) {
      const likelihoodIncrease = ((correlationRate - baseRate) / baseRate) * 100;
      if (likelihoodIncrease > 10) { // Only show meaningful correlations
        correlations.push({
          habitName: otherHabit.name,
          likelihoodIncrease: Math.round(likelihoodIncrease),
        });
      }
    }
  }

  return correlations;
};
