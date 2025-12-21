import React from 'react';
import HabitListItem from './HabitListItem';

const mockHabits = [
  {
    id: 'h1',
    name: 'Work Out',
    category: 'Health',
  },
  {
    id: 'h2',
    name: 'Sleep 8+ hours',
    category: 'Health',
  },
  {
    id: 'h3',
    name: 'Read 20 Pages',
    category: 'Personal Growth',
  },
];

const HabitList = () => {
  return (
    <div className="space-y-4">
      {mockHabits.map((habit) => (
        <HabitListItem key={habit.id} habit={habit} />
      ))}
    </div>
  );
};

export default HabitList;
