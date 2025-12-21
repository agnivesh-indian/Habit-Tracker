import React from 'react';
import HabitList from '../components/HabitList';

const HomePage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Habits</h1>
      <HabitList />
    </div>
  );
};

export default HomePage;
