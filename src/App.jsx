import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HabitDetailPage from './pages/HabitDetailPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router basename="/Habit-Tracker">
      <NavBar />
      <div className="max-w-4xl mx-auto p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/habit/:id" element={<HabitDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
