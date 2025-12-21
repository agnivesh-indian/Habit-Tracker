# Habit Tracker

A professional, production-ready Habit Tracker application designed to provide users with detailed insights into their habits through descriptive statistics and visualizations.

## Project Overview

This application allows users to track their habits, define goals, and gain a deeper understanding of their patterns and consistency. It features a robust statistics engine to calculate completion rates, consistency, and trends, as well as a suite of visualizations to represent habit data in an intuitive way.

## Features

- **Descriptive Statistics:**
  - **Mean Completion Rate:** The average completion rate of a habit.
  - **Standard Deviation:** A measure of habit consistency.
  - **Trend Velocity:** The percentage change in completion rate over time.
  - **Correlation Analysis:** Insights into how different habits influence each other.
- **Visualizations:**
  - **Pie Chart:** For "Category Distribution."
  - **GitHub-style Heatmap:** For "Yearly Consistency."
  - **Habit Deep-Dive:** A detailed view with descriptive stats cards.
- **Customization:**
  - User-defined goals (Cumulative vs. Daily).
- **UI:**
  - A clean and professional UI built with Tailwind CSS.
  - A modular architecture with components for charts, stats, and lists.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Statistics Engine:** JavaScript (with `mathjs` for calculations)
- **Visualizations:** A charting library like `recharts` or `d3`

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/Habit-Tracker.git
   ```
2. **Navigate to the project directory:**
    ```bash
    cd Habit-Tracker
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```
4. **Run the development server:**
    ```bash
    npm run dev
    ```

## Folder Structure

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── HabitDetailView.jsx
│   │   └── ...
│   ├── hooks/
│   │   └── ...
│   ├── utils/
│   │   └── statsEngine.js
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
└── README.md
```

## Habit Object Interface

```typescript
interface HabitLog {
  date: string; // 'YYYY-MM-DD'
  value?: number; // For cumulative habits
  completed?: boolean; // For daily habits
}

interface Habit {
  id: string;
  name: string;
  category: string;
  goalType: 'daily' | 'cumulative';
  goalAmount?: number; // For cumulative habits
  logs: HabitLog[];
}
```