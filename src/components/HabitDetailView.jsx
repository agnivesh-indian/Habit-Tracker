
import React from 'react';
import { calculateCompletionRate, calculateConsistency, calculateTrendVelocity, analyzeCorrelations } from '../utils/statsEngine';

// --- MOCK DATA (for demonstration) ---
const mockHabit = {
  id: 'h1',
  name: 'Work Out',
  category: 'Health',
  goalType: 'daily',
  logs: [
    { date: '2025-11-01', completed: true },
    { date: '2025-11-02', completed: false },
    { date: '2025-11-03', completed: true },
    { date: '2025-11-04', completed: true },
    // ... more logs
  ],
};

const mockAllHabits = [
  mockHabit,
  {
    id: 'h2',
    name: 'Sleep 8+ hours',
    category: 'Health',
    goalType: 'daily',
    logs: [
      { date: '2025-11-01', completed: true },
      { date: '2025-11-02', completed: true },
      { date: '2025-11-03', completed: false },
      { date: '2025-11-04', completed: true },
    ],
  },
    {
    id: 'h3',
    name: 'Read 20 Pages',
    category: 'Personal Growth',
    goalType: 'cumulative',
    goalAmount: 20,
    logs: [
      { date: '2025-11-01', value: 25 },
      { date: '2025-11-02', value: 10 },
      { date: '2025-11-03', value: 20 },
      { date: '2025-11-04', value: 15 },
    ],
  },
];


// --- UI COMPONENTS ---

const StatCard = ({ title, value, unit }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">
      {value}
      <span className="text-base font-medium text-gray-500">{unit}</span>
    </p>
  </div>
);

const CorrelationCard = ({ habitName, likelihoodIncrease }) => (
    <div className="bg-blue-50 p-4 rounded-lg shadow">
        <p className="text-sm text-blue-800">
            You are <span className="font-bold">{likelihoodIncrease}%</span> more likely to <span className="font-semibold">{habitName}</span> on days you complete your habit.
        </p>
    </div>
);


// --- MAIN COMPONENT ---

const HabitDetailView = ({ habit = mockHabit, allHabits = mockAllHabits }) => {
  const completionRate = calculateCompletionRate(habit).toFixed(1);
  const consistency = calculateConsistency(habit).toFixed(2);
  const trend = calculateTrendVelocity(habit).toFixed(1);
  const correlations = analyzeCorrelations(habit, allHabits);

  return (
    <div className="bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{habit.name}</h1>
          <p className="text-lg text-gray-600">{habit.category}</p>
        </div>

        {/* --- Descriptive Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Completion Rate" value={completionRate} unit="%" />
          <StatCard title="Consistency Score" value={consistency} unit="" />
          <StatCard title="30-Day Trend" value={trend} unit="%" />
        </div>

        {/* --- Correlation Analysis --- */}
        {correlations.length > 0 && (
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Correlation Insights</h2>
                <div className="space-y-4">
                    {correlations.map(corr => (
                        <CorrelationCard 
                            key={corr.habitName}
                            habitName={corr.habitName}
                            likelihoodIncrease={corr.likelihoodIncrease}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* --- Visualization Suite (Placeholder) --- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Visualizations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center text-gray-500">
              Yearly Consistency Heatmap (Placeholder)
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center text-gray-500">
              Category Distribution Pie Chart (Placeholder)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailView;
