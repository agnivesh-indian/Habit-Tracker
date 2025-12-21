import React from 'react';
import { useParams } from 'react-router-dom';
import HabitDetailView from '../components/HabitDetailView';

const HabitDetailPage = () => {
  const { id } = useParams();

  // In a real application, you would fetch the habit data based on the id.
  // For now, we'll just pass the id to the HabitDetailView.
  return <HabitDetailView habitId={id} />;
};

export default HabitDetailPage;
