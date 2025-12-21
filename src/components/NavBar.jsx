import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Habit Tracker
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
