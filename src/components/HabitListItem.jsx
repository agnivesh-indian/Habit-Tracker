import React from 'react';
import { Link } from 'react-router-dom';

const HabitListItem = ({ habit }) => {
  return (
    <Link to={`/habit/${habit.id}`} className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-900">{habit.name}</h2>
      <p className="text-gray-600">{habit.category}</p>
    </Link>
  );
};

export default HabitListItem;
